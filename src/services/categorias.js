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
    const docRef = await addDoc(collection(db, "categorias"), {
      uid: user.uid,
      nombre: nombreLimpio,
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
    const categorias = [];
    querySnapshot.forEach((docSnap) => {
      categorias.push({ id: docSnap.id, ...docSnap.data() });
    });
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
    const categoriaRef = doc(db, "categorias", idCategoria);
    await updateDoc(categoriaRef, nuevosDatos);
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
    const categoriaRef = doc(db, "categorias", idCategoria);
    await deleteDoc(categoriaRef);
    return true;
  } catch (error) {
    console.error("[CategoriasService.eliminarCategoria] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}
