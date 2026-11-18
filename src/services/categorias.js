/**
 * @file categorias.js
 * @description Capa de Infraestructura / Servicios - Categorías personalizadas en Cloud Firestore (HU-12).
 * Permite a los usuarios crear, consultar, actualizar y eliminar categorías dinámicas para sus transacciones.
 * @module services/categorias
 */

import { db, auth } from './firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { traducirErrorFirestore } from './firestore.js';
import { asegurarConexion } from './conexion.js';
import { obtenerClaveUsuario } from './claves.js';
import { cifrarValor, descifrarValor } from '../utils/cifrado.js';

/**
 * Servicio para registrar una categoría personalizada por usuario (HU-12).
 * @async
 * @param {string} nombre - Nombre descriptivo de la categoría.
 * @param {'gasto'|'ingreso'} [tipo='gasto'] - Tipo de flujo asociado.
 * @returns {Promise<string>} ID generado en Firestore.
 */
export async function guardarCategoria(nombre, tipo = 'gasto') {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
  if (nombreLimpio.length < 3 || nombreLimpio.length > 40) {
    throw new Error("El nombre de la categoría debe tener entre 3 y 40 caracteres.");
  }

  try {
    // Tarea 14.3 (CA-14.3): sin conexión se rechaza antes de tocar Firestore
    asegurarConexion();
    // El nombre de la categoría se guarda cifrado con la clave personal del usuario
    const clave = await obtenerClaveUsuario(user.uid);
    const docRef = await addDoc(collection(db, "categorias"), {
      uid: user.uid,
      nombre: await cifrarValor(clave, nombreLimpio, "nombre"),
      tipo: tipo,
      fechaCreacion: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("[CategoriasService.guardarCategoria] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Obtiene las categorías personalizadas del usuario autenticado.
 * @async
 * @returns {Promise<Array<{id: string, nombre: string, tipo: string}>>}
 */
export async function obtenerCategorias() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    const q = query(collection(db, "categorias"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const clave = await obtenerClaveUsuario(user.uid);
    const categorias = [];
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      try {
        const nombre = await descifrarValor(clave, data.nombre, "nombre");
        const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
        const tipo = data.tipo === "ingreso" ? "ingreso" : data.tipo === "gasto" ? "gasto" : "";
        if (nombreLimpio.length < 3 || nombreLimpio.length > 40 || !tipo) {
          throw new Error("Categoría con datos fuera de rango tras descifrar.");
        }
        categorias.push({ id: docSnap.id, ...data, nombre: nombreLimpio, tipo });
      } catch (errorDescifrado) {
        console.warn(`[CategoriasService] Categoría omitida id=${docSnap.id}:`, errorDescifrado.message);
      }
    }
    return categorias;
  } catch (error) {
    console.error("[CategoriasService.obtenerCategorias] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Actualiza los datos de una categoría personalizada (HU-12).
 * @async
 * @param {string} idCategoria - ID del documento en Firestore.
 * @param {object} nuevosDatos - Campos a actualizar.
 * @returns {Promise<boolean>}
 */
export async function actualizarCategoria(idCategoria, nuevosDatos) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    // Tarea 14.3 (CA-14.3): sin conexión se rechaza antes de tocar Firestore
    asegurarConexion();
    const categoriaRef = doc(db, "categorias", idCategoria);
    const datos = { ...nuevosDatos };
    if (typeof datos.nombre === "string") {
      const nombreLimpio = datos.nombre.trim();
      if (nombreLimpio.length < 3 || nombreLimpio.length > 40) {
        throw new Error("El nombre de la categoría debe tener entre 3 y 40 caracteres.");
      }
      datos.nombre = await cifrarValor(await obtenerClaveUsuario(user.uid), nombreLimpio, "nombre");
    }
    await updateDoc(categoriaRef, datos);
    return true;
  } catch (error) {
    console.error("[CategoriasService.actualizarCategoria] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}

/**
 * Elimina una categoría personalizada del usuario (HU-12).
 * @async
 * @param {string} idCategoria - ID del documento en Firestore.
 * @returns {Promise<boolean>}
 */
export async function eliminarCategoria(idCategoria) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    // Tarea 14.3 (CA-14.3): sin conexión se rechaza antes de tocar Firestore
    asegurarConexion();
    const categoriaRef = doc(db, "categorias", idCategoria);
    await deleteDoc(categoriaRef);
    return true;
  } catch (error) {
    console.error("[CategoriasService.eliminarCategoria] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}
