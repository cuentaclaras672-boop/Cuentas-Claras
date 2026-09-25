/**
 * @file auth.js
 * @description Capa de Infraestructura / Servicios para Autenticación con Firebase Auth (SDK v10).
 * @module services/auth
 * 
 * Reglas de Arquitectura:
 * 1. Independencia del DOM: Este servicio no manipula HTML ni interfaces de usuario.
 * 2. Programación Defensiva: Validación de tipos y formatos antes de invocar la red.
 * 3. Mapeo de Excepciones: Conversión de códigos técnicos de Firebase a mensajes amigables para Toast UI.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// ============================================================================
// CONFIGURACIÓN E INICIALIZACIÓN (Patrón Singleton)
// ============================================================================

export const firebaseConfig = {
  apiKey: "AIzaSyDLVw72vEnRmrm_CRFLKlZoxsHxHtxLzk0",
  authDomain: "bdcuentasclaras-b1814.firebaseapp.com",
  projectId: "bdcuentasclaras-b1814",
  storageBucket: "bdcuentasclaras-b1814.firebasestorage.app",
  messagingSenderId: "632619284326",
  appId: "1:632619284326:web:b08f98785f80aff4b8baa7"
};

// Garantiza una única instancia activa de Firebase App en toda la aplicación
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ============================================================================
// VALIDACIONES DEFENSIVAS (Reglas de Negocio Previas)
// ============================================================================

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida de forma preventiva los datos de credenciales.
 * @param {string} email - Correo del usuario.
 * @param {string} password - Contraseña en texto plano.
 * @throws {Error} Si algún parámetro no cumple el estándar mínimo.
 */
function validarCredenciales(email, password) {
  if (typeof email !== "string" || !REGEX_EMAIL.test(email.trim())) {
    throw new Error("El correo electrónico proporcionado no tiene un formato válido.");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }
}

/**
 * Mapea los códigos de error internos de Firebase Auth a mensajes comprensibles en español.
 * @param {object} error - Error capturado de Firebase Auth.
 * @returns {string} Mensaje de error amigable para la capa de presentación.
 */
export function traducirErrorAuth(error) {
  const codigo = error?.code || "";

  switch (codigo) {
    case "auth/email-already-in-use":
      return "Este correo ya se encuentra registrado. Intenta iniciar sesión.";
    case "auth/invalid-email":
      return "El formato del correo electrónico es inválido.";
    case "auth/operation-not-allowed":
    case "auth/configuration-not-found":
      return "El proveedor de correo y contraseña no está habilitado en Firebase Console. Por favor actívalo en la pestaña Authentication.";
    case "auth/weak-password":
      return "La contraseña es muy débil. Debe tener un mínimo de 6 caracteres.";
    case "auth/user-disabled":
      return "Esta cuenta de usuario ha sido inhabilitada por el administrador.";
    case "auth/user-not-found":
      return "No existe ninguna cuenta asociada a este correo electrónico.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos. Verifica tus credenciales.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Por seguridad, espera unos minutos.";
    case "auth/network-request-failed":
      return "Fallo de conexión a la red. Verifica tu acceso a internet.";
    default:
      return error.message || "Ocurrió un error inesperado durante la autenticación.";
  }
}

// ============================================================================
// MÉTODOS PÚBLICOS DEL SERVICIO
// ============================================================================

/**
 * Registra un nuevo usuario en Firebase Auth y actualiza su perfil con su nombre.
 * @async
 * @param {string} email - Correo electrónico institucional o personal.
 * @param {string} password - Contraseña con mínimo 6 caracteres.
 * @param {string} [nombreCompleto=""] - Nombre visible del usuario.
 * @returns {Promise<{ uid: string, email: string, displayName: string }>} Objeto del usuario autenticado.
 */
export async function registrarUsuario(email, password, nombreCompleto = "") {
  try {
    validarCredenciales(email, password);

    const credenciales = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const usuario = credenciales.user;

    if (nombreCompleto.trim().length > 0) {
      await updateProfile(usuario, {
        displayName: nombreCompleto.trim()
      });
    }

    return {
      uid: usuario.uid,
      email: usuario.email,
      displayName: usuario.displayName || nombreCompleto.trim()
    };
  } catch (error) {
    const mensaje = traducirErrorAuth(error);
    console.error(`[AuthService.registrarUsuario] Error (${error.code || 'VALIDACION'}):`, error.message);
    throw new Error(mensaje);
  }
}

/**
 * Inicia sesión para un usuario existente mediante correo y contraseña.
 * @async
 * @param {string} email - Correo registrado.
 * @param {string} password - Contraseña asociada.
 * @returns {Promise<{ uid: string, email: string, displayName: string }>} Objeto del usuario autenticado.
 */
export async function iniciarSesion(email, password) {
  try {
    validarCredenciales(email, password);

    const credenciales = await signInWithEmailAndPassword(auth, email.trim(), password);
    const usuario = credenciales.user;

    return {
      uid: usuario.uid,
      email: usuario.email,
      displayName: usuario.displayName || ""
    };
  } catch (error) {
    const mensaje = traducirErrorAuth(error);
    console.error(`[AuthService.iniciarSesion] Error (${error.code || 'VALIDACION'}):`, error.message);
    throw new Error(mensaje);
  }
}

/**
 * Cierra la sesión activa actual en Firebase Auth.
 * @async
 * @returns {Promise<void>}
 */
export async function cerrarSesion() {
  try {
    await signOut(auth);
  } catch (error) {
    const mensaje = traducirErrorAuth(error);
    console.error("[AuthService.cerrarSesion] Error:", error.message);
    throw new Error(mensaje);
  }
}

/**
 * Suscribe un observador a los cambios de estado de autenticación (Login/Logout).
 * Patrón Observer para que la capa de UI reaccione sin acoplarse.
 * @param {function(object|null): void} callback - Función que recibe el usuario activo o null.
 * @returns {function(): void} Función de desuscripción para limpieza de eventos.
 */
export function suscribirEstadoAuth(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("El listener de estado de autenticación debe ser una función.");
  }

  return onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
      callback({
        uid: usuario.uid,
        email: usuario.email,
        displayName: usuario.displayName || ""
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Obtiene el usuario autenticado actual de forma sincrónica.
 * @returns {{ uid: string, email: string, displayName: string } | null}
 */
export function obtenerUsuarioActual() {
  const usuario = auth.currentUser;
  if (!usuario) return null;

  return {
    uid: usuario.uid,
    email: usuario.email,
    displayName: usuario.displayName || ""
  };
}
