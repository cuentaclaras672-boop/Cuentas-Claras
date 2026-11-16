/**
 * @file prestamos.js
 * @description Capa de Infraestructura / Servicios - Persistencia de préstamos a terceros en Cloud Firestore
 * (Tarea 8.2 / HU-08). No toca el DOM: la interfaz recibe listas y mensajes de error listos para Toasts.
 * @module services/prestamos
 *
 * Estructura de cada documento en `prestamos/{idAutomatico}`:
 * | Campo          | Tipo      | Regla                                                   |
 * |----------------|-----------|---------------------------------------------------------|
 * | deudor         | cifrado   | 3 a 60 caracteres                                       |
 * | monto          | number    | monto prestado, mayor que 0                             |
 * | fecha          | timestamp | fecha del préstamo                                      |
 * | nota           | cifrado   | opcional, hasta 200 caracteres ("" si no hay)           |
 * | abonos         | array     | lista de { monto: number, fecha: timestamp }            |
 * | totalAbonado   | number    | suma de los abonos, entre 0 y monto                     |
 * | estado         | string    | 'PENDIENTE' o 'SALDADO' (SALDADO cuando totalAbonado == monto) |
 * | creadoPor      | string    | UID del usuario que prestó el dinero                    |
 *
 * Los campos marcados "cifrado" (textos) se guardan con AES-256-GCM y la clave personal del usuario
 * (ver src/services/claves.js). Los montos quedan en claro a propósito: así las reglas de Firestore siguen
 * verificando en el servidor que ningún abono supere el saldo pendiente (CA-8.4), y `totalAbonado` y
 * `estado` permiten filtrar por estado (CA-8.6) sin recorrer los abonos.
 */

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
  runTransaction,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, traducirErrorFirestore, procesadorEnOrden, convertirDocumentos } from "./firestore.js";
import { asegurarConexion } from "./conexion.js";
import { obtenerClaveUsuario } from "./claves.js";
import { cifrarCampos, descifrarCampos } from "../utils/cifrado.js";

/** Campos de texto del préstamo que se guardan cifrados (los montos quedan en claro para las reglas). */
export const CAMPOS_CIFRADOS_PRESTAMO = Object.freeze(["deudor", "nota"]);

/**
 * Descifra los textos de un préstamo. Los datos antiguos sin cifrar pasan igual.
 * @param {CryptoKey} clave
 * @param {object} data
 * @returns {Promise<object>}
 */
export function descifrarPrestamo(clave, data) {
  return descifrarCampos(clave, data, CAMPOS_CIFRADOS_PRESTAMO);
}

const COLECCION_PRESTAMOS = "prestamos";

/**
 * Estados posibles de un préstamo.
 * @readonly
 * @enum {string}
 */
export const ESTADO_PRESTAMO = Object.freeze({
  PENDIENTE: "PENDIENTE",
  SALDADO: "SALDADO"
});

/**
 * Redondea a centavos para que sumas como 0,1 + 0,2 no dejen un pendiente de 0,0000001.
 * @param {number} valor - Número a redondear.
 * @returns {number} Valor con máximo dos decimales.
 */
function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Convierte un Timestamp de Firestore (o un valor de fecha cualquiera) a Date.
 * @param {*} valor - Timestamp, Date, string o número.
 * @returns {Date} Fecha equivalente.
 */
function aFecha(valor) {
  if (valor && typeof valor.toDate === "function") return valor.toDate();
  if (valor instanceof Date) return valor;
  return valor ? new Date(valor) : new Date();
}

/**
 * Convierte un documento de Firestore en un objeto plano con fechas de tipo Date
 * y el saldo pendiente calculado. Es la fábrica por defecto de `escucharPrestamos`.
 * @param {string} id - ID del documento.
 * @param {object} data - Datos del documento.
 * @returns {object} Préstamo con `id`, `saldoPendiente` y fechas como Date.
 */
function prestamoDesdeDocumento(id, data) {
  const totalAbonado = Number(data.totalAbonado) || 0;
  return {
    id,
    deudor: data.deudor,
    monto: data.monto,
    fecha: aFecha(data.fecha),
    nota: data.nota || "",
    abonos: (data.abonos || []).map((a) => ({ monto: a.monto, fecha: aFecha(a.fecha) })),
    totalAbonado,
    saldoPendiente: redondear(data.monto - totalAbonado),
    estado: data.estado,
    creadoPor: data.creadoPor
  };
}

/**
 * Registra un nuevo préstamo en Firestore (CA-8.1 y CA-8.2).
 * Acepta una instancia del modelo `Prestamo` (usa su `aFirestore()`) o un objeto plano
 * con `deudor`, `monto`, `fecha`, `nota` y `creadoPor`.
 *
 * @async
 * @param {object} prestamo - Préstamo a registrar.
 * @returns {Promise<string>} ID generado por Firestore.
 * @throws {Error} Si los datos son inválidos o Firestore rechaza la escritura.
 */
export async function registrarPrestamo(prestamo) {
  try {
    // Tarea 14.3 (CA-14.3): sin conexión se rechaza antes de tocar Firestore
    asegurarConexion();
    if (!prestamo || typeof prestamo !== "object") {
      throw new TypeError("Se requieren los datos del préstamo.");
    }

    if (typeof prestamo.validar === "function") prestamo.validar();
    const datos = typeof prestamo.aFirestore === "function" ? prestamo.aFirestore() : prestamo;

    const deudor = typeof datos.deudor === "string" ? datos.deudor.trim() : "";
    const monto = redondear(Number(datos.monto));
    const nota = typeof datos.nota === "string" ? datos.nota.trim() : "";

    if (deudor.length < 3 || deudor.length > 60) {
      throw new Error("El nombre del deudor debe tener entre 3 y 60 caracteres.");
    }
    if (isNaN(monto) || monto <= 0) {
      throw new Error("El monto prestado debe ser mayor a cero.");
    }
    if (nota.length > 200) {
      throw new Error("La nota no puede superar los 200 caracteres.");
    }
    if (!datos.creadoPor || typeof datos.creadoPor !== "string") {
      throw new Error("El préstamo debe estar asociado al UID de un usuario autenticado.");
    }

    const payload = {
      deudor,
      monto,
      fecha: Timestamp.fromDate(aFecha(datos.fecha)),
      nota,
      abonos: [],
      totalAbonado: 0,
      estado: ESTADO_PRESTAMO.PENDIENTE,
      creadoPor: datos.creadoPor
    };

    const clave = await obtenerClaveUsuario(datos.creadoPor);
    const payloadCifrado = await cifrarCampos(clave, payload, CAMPOS_CIFRADOS_PRESTAMO);

    const docRef = await addDoc(collection(db, COLECCION_PRESTAMOS), payloadCifrado);
    return docRef.id;
  } catch (error) {
    console.error("[PrestamosService.registrarPrestamo] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Registra un abono parcial a un préstamo (CA-8.3, CA-8.4 y CA-8.5).
 * Se hace dentro de una transacción: lee el saldo pendiente actual y escribe el abono en una sola
 * operación, así dos abonos simultáneos no pueden dejar el préstamo con saldo negativo.
 * Cuando el pendiente llega a 0, el préstamo pasa a estado SALDADO.
 *
 * @async
 * @param {string} idPrestamo - ID del préstamo en Firestore.
 * @param {number} montoAbono - Valor abonado, mayor a 0 y menor o igual al saldo pendiente.
 * @param {string} usuarioId - UID del usuario autenticado.
 * @param {Date} [fechaAbono=new Date()] - Fecha del abono.
 * @returns {Promise<{ saldoPendiente: number, estado: string }>} Saldo y estado después del abono.
 * @throws {Error} Si el abono supera el saldo pendiente, el préstamo no existe o no es del usuario.
 */
export async function registrarAbonoPrestamo(idPrestamo, montoAbono, usuarioId, fechaAbono = new Date()) {
  try {
    // Tarea 14.3 (CA-14.3): sin conexión se rechaza antes de tocar Firestore
    asegurarConexion();
    if (!idPrestamo || typeof idPrestamo !== "string") {
      throw new Error("Identificador de préstamo inválido.");
    }

    const abono = redondear(Number(montoAbono));
    if (isNaN(abono) || abono <= 0) {
      throw new Error("El abono debe ser un número mayor a cero.");
    }

    const docRef = doc(db, COLECCION_PRESTAMOS, idPrestamo);

    // Tarea 14.3: aquí no se usa conReintentos. Si la confirmación del servidor se pierde después de
    // guardar, un reintento registraría el abono dos veces; mejor avisar y que el usuario revise.
    return await runTransaction(db, async (transaccion) => {
      const snap = await transaccion.get(docRef);
      if (!snap.exists()) {
        throw new Error("El préstamo especificado no existe.");
      }

      const data = snap.data();
      if (data.creadoPor !== usuarioId) {
        throw new Error("No tienes autorización para modificar este préstamo.");
      }

      const pendiente = redondear(data.monto - (Number(data.totalAbonado) || 0));
      if (pendiente <= 0) {
        throw new Error("Este préstamo ya está saldado.");
      }
      if (abono > pendiente) {
        throw new Error(`El abono supera el saldo pendiente. Lo máximo que puedes abonar es ${pendiente.toLocaleString("es-CO")}.`);
      }

      const totalAbonado = redondear((Number(data.totalAbonado) || 0) + abono);
      const estado = totalAbonado >= data.monto ? ESTADO_PRESTAMO.SALDADO : ESTADO_PRESTAMO.PENDIENTE;

      transaccion.update(docRef, {
        abonos: [...(data.abonos || []), { monto: abono, fecha: Timestamp.fromDate(aFecha(fechaAbono)) }],
        totalAbonado,
        estado
      });

      return { saldoPendiente: redondear(data.monto - totalAbonado), estado };
    });
  } catch (error) {
    console.error("[PrestamosService.registrarAbonoPrestamo] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Elimina un préstamo del usuario.
 * @async
 * @param {string} idPrestamo - ID del préstamo en Firestore.
 * @param {string} [usuarioId=null] - UID del usuario, para verificar la propiedad antes de borrar.
 * @returns {Promise<void>}
 */
export async function eliminarPrestamo(idPrestamo, usuarioId = null) {
  try {
    // Tarea 14.3 (CA-14.3): sin conexión se rechaza antes de tocar Firestore
    asegurarConexion();
    if (!idPrestamo || typeof idPrestamo !== "string") {
      throw new Error("Identificador de préstamo inválido para eliminación.");
    }

    const docRef = doc(db, COLECCION_PRESTAMOS, idPrestamo);

    if (usuarioId) {
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().creadoPor !== usuarioId) {
        throw new Error("No tienes autorización para eliminar este préstamo.");
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("[PrestamosService.eliminarPrestamo] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Validación al leer: descarta un préstamo con datos imposibles (p. ej. escrito por un cliente modificado).
 * Revisa que el total abonado coincida con la suma de los abonos y no supere el monto prestado.
 * @param {object} p - Préstamo ya descifrado.
 * @throws {Error} Si los datos no son coherentes.
 */
export function validarPrestamoLeido(p) {
  const deudor = typeof p.deudor === "string" ? p.deudor.trim() : "";
  if (deudor.length < 3 || deudor.length > 60) throw new Error("Deudor inválido.");
  if (!(Number(p.monto) > 0)) throw new Error("Monto inválido.");
  const suma = redondear((p.abonos || []).reduce((t, a) => t + (Number(a.monto) || 0), 0));
  const total = Number(p.totalAbonado) || 0;
  if (Math.abs(suma - total) >= 0.01 || total > Number(p.monto) + 0.001) {
    throw new Error("El total abonado no coincide con los abonos o supera el monto.");
  }
}

/**
 * Escucha en tiempo real los préstamos del usuario, ordenados del más reciente al más antiguo.
 * Por defecto entrega objetos planos (ver `prestamoDesdeDocumento`); cuando exista el modelo
 * `Prestamo` (Tarea 8.1) se puede pasar `Prestamo.desdeFirestore` como fábrica.
 *
 * @param {string} usuarioId - UID del usuario autenticado.
 * @param {function(object[]): void} onActualizacion - Callback con la lista de préstamos.
 * @param {function(Error): void} [onError] - Callback en caso de fallo.
 * @param {function(string, object): object} [fabrica] - Convierte (id, data) en el objeto que recibe la UI.
 * @returns {function(): void} Función para cancelar la suscripción.
 */
export function escucharPrestamos(usuarioId, onActualizacion, onError, fabrica = prestamoDesdeDocumento) {
  if (!usuarioId || typeof usuarioId !== "string") {
    throw new Error("Se requiere el UID del usuario para consultar los préstamos.");
  }
  if (typeof onActualizacion !== "function") {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  const q = query(collection(db, COLECCION_PRESTAMOS), where("creadoPor", "==", usuarioId));

  const procesador = procesadorEnOrden(async (snapshot, sigueVigente) => {
    const clave = await obtenerClaveUsuario(usuarioId);
    const pares = await convertirDocumentos(
      snapshot,
      async (id, data) => {
        const prestamo = fabrica(id, await descifrarPrestamo(clave, data));
        validarPrestamoLeido(prestamo);
        return prestamo;
      },
      "PrestamosService.escucharPrestamos"
    );
    if (!sigueVigente()) return;
    const prestamos = pares.map(([, prestamo]) => prestamo);
    prestamos.sort((a, b) => aFecha(b.fecha).getTime() - aFecha(a.fecha).getTime());
    onActualizacion(prestamos);
  }, onError);

  const desuscribir = onSnapshot(
    q,
    (snapshot) => procesador.alRecibir(snapshot),
    (error) => {
      console.error("[PrestamosService.escucharPrestamos] Error en tiempo real:", error);
      if (typeof onError === "function") {
        onError(new Error(traducirErrorFirestore(error)));
      }
    }
  );

  return () => {
    procesador.cancelar();
    desuscribir();
  };
}

/**
 * Filtra los préstamos por estado (CA-8.6). Función pura.
 * @param {object[]} lista - Préstamos.
 * @param {'TODOS'|'PENDIENTE'|'SALDADO'} [estado='TODOS'] - Estado a mostrar.
 * @returns {object[]} Préstamos que cumplen el filtro.
 */
export function filtrarPrestamosPorEstado(lista = [], estado = "TODOS") {
  if (estado === "TODOS") return [...lista];
  return lista.filter((p) => p.estado === estado);
}

/**
 * Suma los saldos pendientes para la tarjeta "Por cobrar" del dashboard (CA-8.7). Función pura.
 * @param {object[]} lista - Préstamos.
 * @returns {number} Total por cobrar.
 */
export function calcularTotalPorCobrar(lista = []) {
  return redondear(
    lista.reduce((total, p) => total + Math.max(0, p.monto - (Number(p.totalAbonado) || 0)), 0)
  );
}
