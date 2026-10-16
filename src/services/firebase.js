/**
 * @file firebase.js
 * @description Módulo centralizado de inicialización de Firebase SDK (v10).
 * Provee instancias únicas (Singleton) de Firebase App, Authentication y Cloud Firestore
 * desacoplando la lógica de infraestructura de las credenciales de conexión.
 * @module services/firebase
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// ============================================================================
// INICIALIZACIÓN SINGLETON
// ============================================================================

/**
 * Instancia principal de la aplicación Firebase.
 * Garantiza una única instancia activa evitando duplicación en hot-reload o recargas modulares.
 */
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Instancia del servicio de Autenticación de Firebase.
 */
export const auth = getAuth(app);

/**
 * Instancia de la base de datos Cloud Firestore.
 */
export const db = getFirestore(app);

// Re-exportamos para compatibilidad de servicios dependientes
export { firebaseConfig };
