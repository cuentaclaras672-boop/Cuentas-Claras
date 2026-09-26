/**
 * @file app.js
 * @description Orquestador Principal de la aplicación Cuentas Claras.
 * Inicializa la arquitectura por capas, gestiona el ciclo de vida del estado
 * y conecta los servicios de Infraestructura con la Presentación.
 * @module app
 */

import { suscribirEstadoAuth } from "./services/auth.js";
import { escucharTransacciones, escucharBolsillos } from "./services/firestore.js";
import { inicializarAuthUI } from "./ui/ui-auth.js";
import { inicializarDashboardUI, actualizarDashboard, actualizarBolsillosUI } from "./ui/dashboard.js?v=4";
import { mostrarToast } from "./ui/notificaciones.js";

let desuscribirTransacciones = null;
let desuscribirBolsillos = null;

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

      // Cancelar suscripciones anteriores si existían para evitar fugas de memoria
      if (typeof desuscribirTransacciones === "function") {
        desuscribirTransacciones();
      }
      if (typeof desuscribirBolsillos === "function") {
        desuscribirBolsillos();
      }

      // Conectar listener de Firestore en tiempo real para transacciones (HU-02)
      desuscribirTransacciones = escucharTransacciones(
        usuario.uid,
        (listaTransacciones) => {
          actualizarDashboard(listaTransacciones);
        },
        (error) => {
          mostrarToast(`Error de base de datos: ${error.message}`, "error");
        }
      );

      // Conectar listener de Firestore en tiempo real para bolsillos de ahorro (HU-04)
      desuscribirBolsillos = escucharBolsillos(
        usuario.uid,
        (listaBolsillos) => {
          actualizarBolsillosUI(listaBolsillos);
        },
        (error) => {
          mostrarToast(`Error en bolsillos de ahorro: ${error.message}`, "error");
        }
      );
    } else {
      // Estado: Sin sesión activa (Visitante / Logout)
      if (typeof desuscribirTransacciones === "function") {
        desuscribirTransacciones();
        desuscribirTransacciones = null;
      }
      if (typeof desuscribirBolsillos === "function") {
        desuscribirBolsillos();
        desuscribirBolsillos = null;
      }

      // Limpiar los datos del usuario anterior para que no se vean en el próximo login
      actualizarDashboard([]);
      actualizarBolsillosUI([]);

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
