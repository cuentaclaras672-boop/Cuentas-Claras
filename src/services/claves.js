/**
 * @file claves.js
 * @description Llavero de cifrado: obtiene (o crea la primera vez) las claves AES-256 con las que se cifran
 * los datos antes de guardarlos en Firestore.
 * @module services/claves
 *
 * Hay dos tipos de clave:
 * | Clave             | Dónde se guarda                 | Quién la puede leer (firestore.rules) | Qué cifra                                   |
 * |-------------------|---------------------------------|---------------------------------------|---------------------------------------------|
 * | Clave del usuario | `clavesUsuario/{uid}.clave`     | Solo ese usuario                      | Movimientos personales, bolsillos, préstamos, categorías |
 * | Clave del hogar   | `clavesHogar/{codigoHogar}`     | Solo los miembros del hogar           | Movimientos COMPARTIDOS y liquidaciones del hogar |
 *
 * Cada usuario guarda además una copia de la clave de su hogar en `clavesUsuario/{uid}.hogares`, así puede
 * seguir leyendo sus propios movimientos compartidos si un día sale del hogar.
 *
 * Las claves se generan en el navegador con crypto.subtle y nunca viajan a ningún servidor distinto de
 * Firestore. Una vez creada, una clave no se puede cambiar ni borrar (las reglas lo impiden), porque
 * perderla haría ilegibles los datos cifrados con ella.
 */

import {
  doc,
  getDoc,
  updateDoc,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, auth } from "./firebase.js";
import { generarClaveBase64, importarClave } from "../utils/cifrado.js";

const COLECCION_CLAVES_USUARIO = "clavesUsuario";
const COLECCION_CLAVES_HOGAR = "clavesHogar";
const PATRON_CODIGO_HOGAR = /^[A-Z0-9]{6}$/;

// Claves ya importadas en esta sesión (promesas, para no pedir la misma clave dos veces en paralelo)
const clavesUsuario = new Map();
const clavesHogar = new Map();

function uidActual(uid) {
  const resultado = uid || auth.currentUser?.uid;
  if (!resultado || typeof resultado !== "string") {
    throw new Error("Se requiere una sesión activa para cifrar o descifrar los datos.");
  }
  return resultado;
}

/** Guarda la promesa en la caché y la saca si falla, para que el siguiente intento vuelva a consultar. */
function enCache(mapa, llave, crear) {
  if (!mapa.has(llave)) {
    const promesa = crear().catch((error) => {
      mapa.delete(llave);
      throw error;
    });
    mapa.set(llave, promesa);
  }
  return mapa.get(llave);
}

/**
 * Lee el documento de un llavero y, si no existe, lo crea con una clave nueva dentro de una transacción.
 * Si dos pestañas lo crean al mismo tiempo, la transacción de una de ellas se repite y usa la clave de la otra.
 * @returns {Promise<object>} Datos del documento.
 */
async function leerOCrear(docRef, datosNuevos) {
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data();

  const clave = await generarClaveBase64();
  return runTransaction(db, async (transaccion) => {
    const actual = await transaccion.get(docRef);
    if (actual.exists()) return actual.data();
    const datos = datosNuevos(clave);
    transaccion.set(docRef, datos);
    return datos;
  });
}

/**
 * Clave personal del usuario. La crea la primera vez que se necesita.
 * @param {string} [uid] - UID del usuario; por defecto, el de la sesión activa.
 * @returns {Promise<CryptoKey>}
 */
export function obtenerClaveUsuario(uid) {
  const id = uidActual(uid);
  return enCache(clavesUsuario, id, async () => {
    const datos = await leerOCrear(doc(db, COLECCION_CLAVES_USUARIO, id), (clave) => ({ clave, hogares: {} }));
    return importarClave(datos.clave);
  });
}

/**
 * Clave compartida de un hogar. Primero busca la copia que el usuario guardó en su llavero; si no la tiene,
 * la lee de `clavesHogar` (o la crea si el hogar aún no tiene una) y guarda la copia.
 * @param {string} codigoHogar - Código (ID) del hogar.
 * @param {string} [uid] - UID del usuario; por defecto, el de la sesión activa.
 * @returns {Promise<CryptoKey>}
 */
export function obtenerClaveHogar(codigoHogar, uid) {
  const id = uidActual(uid);
  if (typeof codigoHogar !== "string" || !PATRON_CODIGO_HOGAR.test(codigoHogar)) {
    return Promise.reject(new Error("Código de hogar inválido para obtener su clave de cifrado."));
  }

  return enCache(clavesHogar, `${id}|${codigoHogar}`, async () => {
    const refUsuario = doc(db, COLECCION_CLAVES_USUARIO, id);
    await obtenerClaveUsuario(id); // garantiza que el llavero del usuario existe
    const llavero = (await getDoc(refUsuario)).data() || {};
    const copia = llavero.hogares?.[codigoHogar];
    if (copia) return importarClave(copia);

    const datosHogar = await leerOCrear(
      doc(db, COLECCION_CLAVES_HOGAR, codigoHogar),
      (clave) => ({ clave, creadoPor: id })
    );
    // La copia es una ayuda (permite leer lo propio después de salir del hogar): si falla, no se bloquea nada
    try {
      await updateDoc(refUsuario, { [`hogares.${codigoHogar}`]: datosHogar.clave });
    } catch (error) {
      console.warn("[ClavesService] No se pudo guardar la copia de la clave del hogar:", error.message);
    }
    return importarClave(datosHogar.clave);
  });
}

/**
 * Olvida las claves importadas en memoria. Se llama al cerrar sesión.
 */
export function limpiarClavesEnMemoria() {
  clavesUsuario.clear();
  clavesHogar.clear();
}
