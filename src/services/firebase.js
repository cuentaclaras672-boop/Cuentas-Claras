/**
 * @file firebase.js
 * @description Módulo centralizado de configuración e inicialización de Firebase SDK (v10).
 * Provee instancias únicas (Singleton) de Firebase App, Authentication y Cloud Firestore
 * para desacoplar los servicios de dominio de la inicialización de infraestructura.
 * @module services/firebase
 *
 * NOTA DE SEGURIDAD SOBRE API KEYS EN FIREBASE:
 * Las credenciales de Firebase en clientes web (apiKey, projectId, appId) son identificadores
 * públicos del proyecto en Google Cloud, no contraseñas administrativas ni secretos de servidor.
 * La seguridad e integridad de los datos financieros está garantizada por:
 * 1. Reglas de Seguridad en Cloud Firestore (`firestore.rules`).
 * 2. Autenticación verificada por token JWT en cada petición (`request.auth.uid`).
 * 3. Restricciones de dominio autorizados (HTTP Referrers / App Check) en Firebase Console.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Configuración del proyecto Firebase (Cuentas Claras)
// Permite sobreescritura externa mediante variable global window.__FIREBASE_CONFIG__ si se requiere
export const firebaseConfig = (typeof window !== "undefined" && window.__FIREBASE_CONFIG__) || {
  apiKey: "AIzaSyDLVw72vEnRmrm_CRFLKlZoxsHxHtxLzk0",
  authDomain: "bdcuentasclaras-b1814.firebaseapp.com",
  projectId: "bdcuentasclaras-b1814",
  storageBucket: "bdcuentasclaras-b1814.firebasestorage.app",
  messagingSenderId: "632619284326",
  appId: "1:632619284326:web:b08f98785f80aff4b8baa7"
};

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
