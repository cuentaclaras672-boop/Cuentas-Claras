/**
 * @file firestore.js
 * @description Capa de Infraestructura / Servicios para persistencia en Cloud Firestore (SDK v10).
 * @module services/firestore
 * 
 * Reglas de Arquitectura:
 * 1. Persistencia Real: No almacena datos financieros en memoria ni en localStorage.
 * 2. Conversión de Tipos: Convierte documentos Firestore a entidades del Dominio (Transaccion).
 * 3. Mapeo de Excepciones: Los errores de Firestore se traducen a mensajes comprensibles para Toasts.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./auth.js";
import { Transaccion, TIPO_TRANSACCION, AMBITO_TRANSACCION } from "../models/Transaccion.js";
import { Bolsillo } from "../models/Bolsillo.js";

// ============================================================================
// INICIALIZACIÓN SINGLETON DE FIRESTORE
// ============================================================================

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLECCION_TRANSACCIONES = "transacciones";
const COLECCION_BOLSILLOS = "bolsillos";

/**
 * Mapea códigos de error de Cloud Firestore a mensajes claros en español.
 * @param {object} error - Objeto de error generado por Firestore.
 * @returns {string} Mensaje traducido.
 */
function traducirErrorFirestore(error) {
  const codigo = error?.code || '';

  switch (codigo) {
    case 'permission-denied':
      return 'Acceso denegado. No tienes permisos para consultar o modificar esta información.';
    case 'unavailable':
      return 'El servicio de base de datos se encuentra temporalmente inaccesible. Revisa tu conexión.';
    case 'not-found':
      return 'El registro solicitado no fue encontrado en la base de datos.';
    case 'cancelled':
      return 'La operación en la base de datos fue cancelada.';
    case 'deadline-exceeded':
      return 'Tiempo de espera agotado al consultar la base de datos.';
    default:
      return error.message || 'Error de comunicación con la base de datos Firestore.';
  }
}

// ============================================================================
// OPERACIONES CRUD ASÍNCRONAS
// ============================================================================

/**
 * Guarda una nueva transacción en Firestore de forma asíncrona.
 * @async
 * @param {Transaccion} transaccion - Instancia del modelo de dominio Transaccion.
 * @returns {Promise<string>} ID generado por Firestore para el nuevo documento.
 * @throws {Error} Si la validación falla o la base de datos rechaza la inserción.
 */
export async function registrarTransaccion(transaccion) {
  try {
    if (!(transaccion instanceof Transaccion)) {
      throw new TypeError("El objeto a registrar debe ser una instancia válida de Transaccion.");
    }

    // Re-ejecuta validación de integridad antes de hacer la petición de red
    transaccion.validar();

    const datosPayload = {
      ...transaccion.aFirestore(),
      fecha: Timestamp.fromDate(transaccion.fecha)
    };

    const docRef = await addDoc(collection(db, COLECCION_TRANSACCIONES), datosPayload);
    return docRef.id;
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error(`[FirestoreService.registrarTransaccion] Error (${error.code || 'VALIDACION'}):`, error.message);
    throw new Error(mensaje);
  }
}

/**
 * Elimina una transacción existente en Firestore por su identificador de documento.
 * Valida de forma defensiva que el documento pertenezca al usuario antes de ejecutar el borrado.
 * 
 * @async
 * @param {string} idTransaccion - Identificador único del documento en Firestore.
 * @param {string} [usuarioId=null] - UID del usuario autenticado que solicita la eliminación.
 * @returns {Promise<void>}
 * @throws {Error} Si no se especifica el ID, el usuario no tiene permisos o falla la operación.
 */
export async function eliminarTransaccion(idTransaccion, usuarioId = null) {
  try {
    if (!idTransaccion || typeof idTransaccion !== 'string') {
      throw new Error("Identificador de transacción inválido para eliminación.");
    }

    const docRef = doc(db, COLECCION_TRANSACCIONES, idTransaccion);

    // Verificación defensiva previa de propiedad en cliente
    if (usuarioId) {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.creadoPor && data.creadoPor !== usuarioId) {
          throw new Error("No tienes autorización para eliminar una transacción registrada por otro usuario.");
        }
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error("[FirestoreService.eliminarTransaccion] Error:", error.message);
    throw new Error(mensaje);
  }
}

/**
 * Suscribe un listener en tiempo real a las transacciones del usuario o compartidas del hogar.
 * Actualiza automáticamente la capa de presentación cuando ocurren cambios en la base de datos.
 * Evita la necesidad de índices compuestos en Firestore ordenando cronológicamente en memoria.
 * 
 * @param {string} usuarioId - UID del usuario autenticado.
 * @param {function(Transaccion[]): void} onActualizacion - Callback ejecutado con la lista de transacciones.
 * @param {function(Error): void} onError - Callback ejecutado en caso de fallo.
 * @returns {function(): void} Función para cancelar la suscripción (Unsubscribe).
 */
export function escucharTransacciones(usuarioId, onActualizacion, onError) {
  if (!usuarioId || typeof usuarioId !== 'string') {
    throw new Error("Se requiere el UID del usuario para consultar las transacciones.");
  }

  if (typeof onActualizacion !== 'function') {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  // Consulta filtrada por usuario. Se prescinde de orderBy en servidor para evitar
  // la exigencia de índices compuestos en Firebase Console; la lista se ordena en memoria.
  const q = query(
    collection(db, COLECCION_TRANSACCIONES),
    where("creadoPor", "==", usuarioId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const transacciones = [];
      snapshot.forEach((docItem) => {
        try {
          const entidad = Transaccion.desdeFirestore(docItem.id, docItem.data());
          transacciones.push(entidad);
        } catch (errorParseo) {
          console.warn(`[FirestoreService] Registro omitido id=${docItem.id} por datos inválidos:`, errorParseo.message);
        }
      });

      // Ordenamiento cronológico descendente en memoria del cliente
      transacciones.sort((a, b) => {
        const tiempoA = a.fecha instanceof Date ? a.fecha.getTime() : new Date(a.fecha).getTime();
        const tiempoB = b.fecha instanceof Date ? b.fecha.getTime() : new Date(b.fecha).getTime();
        return tiempoB - tiempoA;
      });

      onActualizacion(transacciones);
    },
    (error) => {
      const mensaje = traducirErrorFirestore(error);
      console.error("[FirestoreService.escucharTransacciones] Error en tiempo real:", error);
      if (typeof onError === 'function') {
        onError(new Error(mensaje));
      }
    }
  );
}

/**
 * Calcula los totales agregados de ingresos, gastos y balance a partir de una colección de transacciones.
 * Función pura que no muta el arreglo original.
 * 
 * @param {Transaccion[]} listaTransacciones - Lista de transacciones a calcular.
 * @returns {{ totalIngresos: number, totalGastos: number, balanceNeto: number, totalCompartido: number }}
 */
export function calcularTotales(listaTransacciones = []) {
  let totalIngresos = 0;
  let totalGastos = 0;
  let totalCompartido = 0;

  for (const t of listaTransacciones) {
    if (t.tipo === TIPO_TRANSACCION.INGRESO) {
      totalIngresos += t.monto;
    } else if (t.tipo === TIPO_TRANSACCION.GASTO) {
      totalGastos += t.monto;
      if (t.ambito === AMBITO_TRANSACCION.COMPARTIDO) {
        totalCompartido += t.monto;
      }
    }
  }

  return {
    totalIngresos,
    totalGastos,
    balanceNeto: totalIngresos - totalGastos,
    totalCompartido
  };
}

// ============================================================================
// OPERACIONES CRUD PARA BOLSILLOS DE AHORRO (HU-04 - Condición #1)
// ============================================================================

/**
 * Registra un nuevo bolsillo de ahorro con meta en Cloud Firestore.
 * @async
 * @param {Bolsillo} bolsillo - Instancia del modelo Bolsillo.
 * @returns {Promise<string>} ID generado por Firestore para el nuevo bolsillo.
 */
export async function registrarBolsillo(bolsillo) {
  try {
    if (!(bolsillo instanceof Bolsillo)) {
      throw new TypeError("El objeto a registrar debe ser una instancia válida de Bolsillo.");
    }

    bolsillo.validar();

    const payload = {
      ...bolsillo.aFirestore(),
      fecha: Timestamp.fromDate(bolsillo.fecha)
    };

    const docRef = await addDoc(collection(db, COLECCION_BOLSILLOS), payload);
    return docRef.id;
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error("[FirestoreService.registrarBolsillo] Error:", error.message);
    throw new Error(mensaje);
  }
}

/**
 * Elimina un bolsillo de ahorro de Firestore previa validación de permisos.
 * @async
 * @param {string} idBolsillo - ID del documento en Firestore.
 * @param {string} [usuarioId=null] - UID del usuario que ejecuta la acción.
 * @returns {Promise<void>}
 */
export async function eliminarBolsillo(idBolsillo, usuarioId = null) {
  try {
    if (!idBolsillo || typeof idBolsillo !== 'string') {
      throw new Error("Identificador de bolsillo inválido para eliminación.");
    }

    const docRef = doc(db, COLECCION_BOLSILLOS, idBolsillo);

    if (usuarioId) {
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().creadoPor !== usuarioId) {
        throw new Error("No tienes autorización para eliminar este bolsillo.");
      }
    }

    await deleteDoc(docRef);
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error("[FirestoreService.eliminarBolsillo] Error:", error.message);
    throw new Error(mensaje);
  }
}

/**
 * Abona dinero adicional a un bolsillo existente en Firestore.
 * @async
 * @param {string} idBolsillo - ID del documento en Firestore.
 * @param {number} montoAbono - Cantidad positiva a transferir al bolsillo.
 * @param {string} [usuarioId=null] - UID del usuario para verificación.
 * @returns {Promise<void>}
 */
export async function abonarFondosBolsillo(idBolsillo, montoAbono, usuarioId = null) {
  try {
    if (!idBolsillo || typeof idBolsillo !== 'string') {
      throw new Error("Identificador de bolsillo inválido.");
    }

    if (isNaN(montoAbono) || montoAbono <= 0) {
      throw new Error("El monto a transferir debe ser un número mayor a cero.");
    }

    const docRef = doc(db, COLECCION_BOLSILLOS, idBolsillo);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error("El bolsillo especificado no existe en la base de datos.");
    }

    const data = snap.data();
    if (usuarioId && data.creadoPor !== usuarioId) {
      throw new Error("No tienes autorización para modificar este bolsillo.");
    }

    const nuevoMonto = (data.montoAcumulado || 0) + Number(montoAbono);
    await updateDoc(docRef, { montoAcumulado: nuevoMonto });
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error("[FirestoreService.abonarFondosBolsillo] Error:", error.message);
    throw new Error(mensaje);
  }
}

/**
 * Suscribe un listener en tiempo real a los bolsillos del usuario autenticado.
 * @param {string} usuarioId - UID del usuario autenticado.
 * @param {function(Bolsillo[]): void} onActualizacion - Callback con los bolsillos actualizados.
 * @param {function(Error): void} onError - Callback en caso de fallo.
 * @returns {function(): void} Función para cancelar la suscripción.
 */
export function escucharBolsillos(usuarioId, onActualizacion, onError) {
  if (!usuarioId || typeof usuarioId !== 'string') {
    throw new Error("Se requiere el UID del usuario para consultar los bolsillos.");
  }

  if (typeof onActualizacion !== 'function') {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  const q = query(
    collection(db, COLECCION_BOLSILLOS),
    where("creadoPor", "==", usuarioId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const bolsillos = [];
      snapshot.forEach((docItem) => {
        try {
          const entidad = Bolsillo.desdeFirestore(docItem.id, docItem.data());
          bolsillos.push(entidad);
        } catch (errorParseo) {
          console.warn(`[FirestoreService] Bolsillo omitido id=${docItem.id}:`, errorParseo.message);
        }
      });

      // Ordenar por fecha descendente
      bolsillos.sort((a, b) => {
        const tA = a.fecha instanceof Date ? a.fecha.getTime() : new Date(a.fecha).getTime();
        const tB = b.fecha instanceof Date ? b.fecha.getTime() : new Date(b.fecha).getTime();
        return tB - tA;
      });

      onActualizacion(bolsillos);
    },
    (error) => {
      const mensaje = traducirErrorFirestore(error);
      console.error("[FirestoreService.escucharBolsillos] Error en tiempo real:", error);
      if (typeof onError === 'function') {
        onError(new Error(mensaje));
      }
    }
  );
}

/**
 * Calcula el monto acumulado total comprometido en todos los bolsillos de ahorro.
 * @param {Bolsillo[]} listaBolsillos - Arreglo de bolsillos.
 * @returns {number} Sumatoria de fondos en bolsillos.
 */
export function calcularTotalBolsillos(listaBolsillos = []) {
  return listaBolsillos.reduce((total, b) => total + (b.montoAcumulado || 0), 0);
}

