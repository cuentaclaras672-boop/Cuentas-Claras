/**
 * @file hogares.js
 * @description Capa de Infraestructura / Servicios - Hogar compartido entre convivientes en Cloud Firestore
 * (Tarea 9.2 / HU-09). Crear un hogar, unirse con el código de invitación, salir y escuchar el hogar del usuario.
 * No toca el DOM.
 * @module services/hogares
 *
 * Estructura de cada documento en `hogares/{codigo}`. El ID del documento ES el código de invitación,
 * así unirse es leer un documento por su ID y Firestore garantiza que no haya dos hogares con el mismo código.
 * | Campo     | Tipo      | Regla                                                        |
 * |-----------|-----------|--------------------------------------------------------------|
 * | nombre    | string    | 3 a 40 caracteres                                            |
 * | codigo    | string    | 6 caracteres A-Z / 0-9, igual al ID del documento            |
 * | miembros  | array     | UIDs de los convivientes (máximo MAX_MIEMBROS_HOGAR)         |
 * | nombres   | map       | UID → nombre visible, para la pantalla "Mi hogar"            |
 * | creadoPor | string    | UID de quien creó el hogar                                   |
 * | fecha     | timestamp | fecha de creación                                            |
 */

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  limit,
  onSnapshot,
  runTransaction,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, traducirErrorFirestore } from "./firestore.js";

const COLECCION_HOGARES = "hogares";

/** Máximo de miembros por hogar. Debe coincidir con firestore.rules. */
export const MAX_MIEMBROS_HOGAR = 6;

/** Formato del código de invitación (CA-9.1). Debe coincidir con firestore.rules. */
const PATRON_CODIGO = /^[A-Z0-9]{6}$/;

/** Intentos para encontrar un código libre antes de rendirse. */
const INTENTOS_CODIGO = 5;

/**
 * Convierte un documento de hogar en un objeto plano.
 * @param {string} id - ID del documento (el código).
 * @param {object} data - Datos del documento.
 * @returns {{ id: string, nombre: string, codigo: string, miembros: string[], nombres: object, creadoPor: string, fecha: Date }}
 */
function hogarDesdeDocumento(id, data) {
  return {
    id,
    nombre: data.nombre,
    codigo: data.codigo,
    miembros: data.miembros || [],
    nombres: data.nombres || {},
    creadoPor: data.creadoPor,
    fecha: data.fecha && typeof data.fecha.toDate === "function" ? data.fecha.toDate() : new Date()
  };
}

/**
 * Normaliza lo que escribe el usuario como código: sin espacios y en mayúsculas.
 * @param {string} codigo - Código escrito por el usuario.
 * @returns {string} Código normalizado.
 */
function normalizarCodigo(codigo) {
  return typeof codigo === "string" ? codigo.replace(/\s+/g, "").toUpperCase() : "";
}

/**
 * Valida el usuario que llega a las operaciones del servicio.
 * @param {{ uid: string, nombre?: string }} usuario - Usuario autenticado.
 * @returns {{ uid: string, nombre: string }} Usuario con nombre visible.
 */
function validarUsuario(usuario) {
  if (!usuario || typeof usuario.uid !== "string" || !usuario.uid) {
    throw new Error("Se requiere un usuario autenticado.");
  }
  const nombre = typeof usuario.nombre === "string" && usuario.nombre.trim() ? usuario.nombre.trim() : "Conviviente";
  return { uid: usuario.uid, nombre: nombre.slice(0, 60) };
}

/**
 * Busca el hogar al que pertenece el usuario (un usuario tiene como máximo uno, CA-9.3).
 * @async
 * @param {string} usuarioId - UID del usuario.
 * @returns {Promise<object|null>} El hogar o null si no pertenece a ninguno.
 */
export async function obtenerHogarDelUsuario(usuarioId) {
  try {
    const q = query(
      collection(db, COLECCION_HOGARES),
      where("miembros", "array-contains", usuarioId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docHogar = snapshot.docs[0];
    return hogarDesdeDocumento(docHogar.id, docHogar.data());
  } catch (error) {
    console.error("[HogaresService.obtenerHogarDelUsuario] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Crea un hogar con el usuario como único miembro (CA-9.1).
 * El código lo genera `generarCodigo` (método del modelo `Hogar`, Tarea 9.1). Si el código ya está en uso,
 * se pide otro, hasta INTENTOS_CODIGO veces.
 *
 * @async
 * @param {string} nombre - Nombre del hogar (3 a 40 caracteres).
 * @param {{ uid: string, nombre?: string }} usuario - Usuario autenticado que crea el hogar.
 * @param {function(): string} generarCodigo - Devuelve un código de 6 caracteres A-Z / 0-9.
 * @returns {Promise<object>} El hogar creado.
 * @throws {Error} Si el usuario ya tiene hogar, los datos son inválidos o Firestore rechaza la escritura.
 */
export async function crearHogar(nombre, usuario, generarCodigo) {
  try {
    const { uid, nombre: nombreUsuario } = validarUsuario(usuario);
    const nombreHogar = typeof nombre === "string" ? nombre.trim() : "";

    if (nombreHogar.length < 3 || nombreHogar.length > 40) {
      throw new Error("El nombre del hogar debe tener entre 3 y 40 caracteres.");
    }
    if (typeof generarCodigo !== "function") {
      throw new TypeError("Se requiere una función que genere el código de invitación.");
    }
    if (await obtenerHogarDelUsuario(uid)) {
      throw new Error("Ya perteneces a un hogar. Sal de él antes de crear otro.");
    }

    for (let intento = 0; intento < INTENTOS_CODIGO; intento++) {
      const codigo = normalizarCodigo(generarCodigo());
      if (!PATRON_CODIGO.test(codigo)) {
        throw new Error("El código de invitación debe tener 6 letras o números.");
      }

      const docRef = doc(db, COLECCION_HOGARES, codigo);
      const datos = {
        nombre: nombreHogar,
        codigo,
        miembros: [uid],
        nombres: { [uid]: nombreUsuario },
        creadoPor: uid,
        fecha: Timestamp.now()
      };

      const creado = await runTransaction(db, async (transaccion) => {
        const existente = await transaccion.get(docRef);
        if (existente.exists()) return false;
        transaccion.set(docRef, datos);
        return true;
      });

      if (creado) return hogarDesdeDocumento(codigo, datos);
    }

    throw new Error("No se pudo generar un código de invitación libre. Inténtalo de nuevo.");
  } catch (error) {
    console.error("[HogaresService.crearHogar] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Une al usuario a un hogar existente con su código de invitación (CA-9.2 y CA-9.3).
 * @async
 * @param {string} codigo - Código de 6 caracteres que compartió el otro conviviente.
 * @param {{ uid: string, nombre?: string }} usuario - Usuario autenticado que se une.
 * @returns {Promise<object>} El hogar al que se unió.
 * @throws {Error} Si el código no existe, el usuario ya tiene hogar o el hogar está lleno.
 */
export async function unirseAHogar(codigo, usuario) {
  try {
    const { uid, nombre: nombreUsuario } = validarUsuario(usuario);
    const codigoNormalizado = normalizarCodigo(codigo);

    if (!PATRON_CODIGO.test(codigoNormalizado)) {
      throw new Error("El código de invitación debe tener 6 letras o números.");
    }
    if (await obtenerHogarDelUsuario(uid)) {
      throw new Error("Ya perteneces a un hogar. Sal de él antes de unirte a otro.");
    }

    const docRef = doc(db, COLECCION_HOGARES, codigoNormalizado);

    return await runTransaction(db, async (transaccion) => {
      const snap = await transaccion.get(docRef);
      if (!snap.exists()) {
        throw new Error("No existe ningún hogar con ese código. Revisa que esté bien escrito.");
      }

      const data = snap.data();
      const miembros = data.miembros || [];
      if (miembros.includes(uid)) {
        throw new Error("Ya eres miembro de este hogar.");
      }
      if (miembros.length >= MAX_MIEMBROS_HOGAR) {
        throw new Error(`Este hogar ya tiene el máximo de ${MAX_MIEMBROS_HOGAR} miembros.`);
      }

      const actualizacion = {
        miembros: [...miembros, uid],
        nombres: { ...(data.nombres || {}), [uid]: nombreUsuario }
      };
      transaccion.update(docRef, actualizacion);
      return hogarDesdeDocumento(snap.id, { ...data, ...actualizacion });
    });
  } catch (error) {
    console.error("[HogaresService.unirseAHogar] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Saca al usuario del hogar (CA-9.7). Si era el último miembro, el hogar se elimina.
 * Los movimientos que ya registró conservan su hogarId; al salir deja de ver los compartidos de los demás.
 * @async
 * @param {string} hogarId - ID (código) del hogar.
 * @param {string} usuarioId - UID del usuario que sale.
 * @returns {Promise<void>}
 */
export async function salirDelHogar(hogarId, usuarioId) {
  try {
    if (!hogarId || typeof hogarId !== "string") {
      throw new Error("Identificador de hogar inválido.");
    }

    const docRef = doc(db, COLECCION_HOGARES, hogarId);

    await runTransaction(db, async (transaccion) => {
      const snap = await transaccion.get(docRef);
      if (!snap.exists()) return;

      const data = snap.data();
      const miembros = data.miembros || [];
      if (!miembros.includes(usuarioId)) {
        throw new Error("No perteneces a este hogar.");
      }

      if (miembros.length === 1) {
        transaccion.delete(docRef);
        return;
      }

      const nombres = { ...(data.nombres || {}) };
      delete nombres[usuarioId];
      transaccion.update(docRef, {
        miembros: miembros.filter((m) => m !== usuarioId),
        nombres
      });
    });
  } catch (error) {
    console.error("[HogaresService.salirDelHogar] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Escucha en tiempo real el hogar del usuario: avisa al unirse, al salir o cuando entra otro miembro.
 * @param {string} usuarioId - UID del usuario autenticado.
 * @param {function(object|null): void} onActualizacion - Recibe el hogar, o null si no pertenece a ninguno.
 * @param {function(Error): void} [onError] - Callback en caso de fallo.
 * @returns {function(): void} Función para cancelar la suscripción.
 */
export function escucharHogarDelUsuario(usuarioId, onActualizacion, onError) {
  if (!usuarioId || typeof usuarioId !== "string") {
    throw new Error("Se requiere el UID del usuario para consultar su hogar.");
  }
  if (typeof onActualizacion !== "function") {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  const q = query(
    collection(db, COLECCION_HOGARES),
    where("miembros", "array-contains", usuarioId),
    limit(1)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onActualizacion(null);
        return;
      }
      const docHogar = snapshot.docs[0];
      onActualizacion(hogarDesdeDocumento(docHogar.id, docHogar.data()));
    },
    (error) => {
      console.error("[HogaresService.escucharHogarDelUsuario] Error en tiempo real:", error);
      if (typeof onError === "function") {
        onError(new Error(traducirErrorFirestore(error)));
      }
    }
  );
}
