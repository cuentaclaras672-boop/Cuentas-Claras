import { db, auth } from './firebase-config.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Tarea 8.2: Servicio para guardar categorias personalizadas por usuario
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