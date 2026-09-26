/**
 * @file app.js
 * @description Orquestador Principal de la aplicación Cuentas Claras.
 * Inicializa la arquitectura por capas, gestiona el ciclo de vida del estado
 * y conecta los servicios de Infraestructura con la Presentación.
 * @module app
 */

import { suscribirEstadoAuth } from "./services/auth.js";
import { escucharTransacciones } from "./services/firestore.js";
import { inicializarAuthUI } from "./ui/ui-auth.js";
import { inicializarDashboardUI, actualizarDashboard } from "./ui/dashboard.js?v=3";
import { mostrarToast } from "./ui/notificaciones.js";

let desuscribirTransacciones = null;

/**
 * Punto de entrada principal que inicializa los controladores y listeners cuando el DOM está listo.
 * @returns {void}
 */
function iniciarAplicacion() {
  // Inicializar listeners de la interfaz de autenticación
  inicializarAuthUI();

  const vistaAuth = document.getElementById("auth-view");
  const vistaDashboard = document.getElementById("dashboard-view");
  const cargandoApp = document.getElementById("app-loading");

  // Escuchar reactivamente los cambios de sesión (Login / Logout)
  suscribirEstadoAuth((usuario) => {
    if (cargandoApp) {
      cargandoApp.classList.add("hidden");
    }

    if (usuario) {
      // Estado: Usuario Autenticado
      if (vistaAuth) vistaAuth.classList.add("hidden");
      if (vistaDashboard) vistaDashboard.classList.remove("hidden");

      // Inicializar eventos de Dashboard (protegido contra duplicación)
      inicializarDashboardUI(usuario);

      // Cancelar suscripción anterior si existía para evitar fugas de memoria
      if (typeof desuscribirTransacciones === "function") {
        desuscribirTransacciones();
      }

      // Conectar listener de Firestore en tiempo real
      desuscribirTransacciones = escucharTransacciones(
        usuario.uid,
        (listaTransacciones) => {
          actualizarDashboard(listaTransacciones);
        },
        (error) => {
          mostrarToast(`Error de base de datos: ${error.message}`, "error");
        }
      );
    } else {
      // Estado: Sin sesión activa (Visitante / Logout)
      if (typeof desuscribirTransacciones === "function") {
        desuscribirTransacciones();
        desuscribirTransacciones = null;
      }

      if (vistaDashboard) vistaDashboard.classList.add("hidden");
      if (vistaAuth) vistaAuth.classList.remove("hidden");
    }
  });
}

// Iniciar al cargar el DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarAplicacion);
} else {
  iniciarAplicacion();
}
