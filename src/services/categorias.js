import { db, auth } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Tarea 8.2: Servicio para guardar categorias personalizadas por usuario (HU-08)
 */
export async function guardarCategoria(nombre, tipo = 'gasto') {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    const docRef = await addDoc(collection(db, "categorias"), {
      uid: user.uid,
      nombre: nombre.trim(),
      tipo: tipo,
      fechaCreacion: new Date().toISOString()
    });
    console.log("Categoría creada exitosamente con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la categoría en Firestore:", error);
    throw error;
  }
}

/**
 * Servicio para obtener las categorias del usuario autenticado
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
    console.error("Error al obtener las categorías:", error);
    throw error;
  }
}

/**
 * Tarea 9.1: Servicio para actualizar una categoría (HU-09)
 */
export async function actualizarCategoria(idCategoria, nuevosDatos) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    const categoriaRef = doc(db, "categorias", idCategoria);
    await updateDoc(categoriaRef, nuevosDatos);
    console.log("Categoría actualizada correctamente:", idCategoria);
    return true;
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    throw error;
  }
}

/**
 * Tarea 9.2: Servicio para eliminar una categoría (HU-09)
 */
export async function eliminarCategoria(idCategoria) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    const categoriaRef = doc(db, "categorias", idCategoria);
    await deleteDoc(categoriaRef);
    console.log("Categoría eliminada correctamente:", idCategoria);
    return true;
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    throw error;
  }
}