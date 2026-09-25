/**
 * @file ui-auth.js
 * @description Capa de Presentación - Gestión de eventos y vistas del flujo de Autenticación.
 * Consume src/services/auth.js y notifica mediante src/ui/notificaciones.js.
 * @module ui/ui-auth
 */

import { iniciarSesion, registrarUsuario, cerrarSesion } from "../services/auth.js";
import { mostrarToast } from "./notificaciones.js";

/**
 * Vincula los formularios de autenticación con el servicio de Auth.
 */
export function inicializarAuthUI() {
  const formLogin = document.getElementById("form-login");
  const formRegistro = document.getElementById("form-registro");
  const btnCerrarSesion = document.getElementById("btn-logout");
  const btnMostrarRegistro = document.getElementById("btn-toggle-registro");
  const btnMostrarLogin = document.getElementById("btn-toggle-login");
  const contenedorLogin = document.getElementById("seccion-login");
  const contenedorRegistro = document.getElementById("seccion-registro");

  // Alternar entre Login y Registro
  if (btnMostrarRegistro && btnMostrarLogin && contenedorLogin && contenedorRegistro) {
    btnMostrarRegistro.addEventListener("click", () => {
      contenedorLogin.classList.add("hidden");
      contenedorRegistro.classList.remove("hidden");
    });

    btnMostrarLogin.addEventListener("click", () => {
      contenedorRegistro.classList.add("hidden");
      contenedorLogin.classList.remove("hidden");
    });
  }

  // Manejador de Inicio de Sesión
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputEmail = document.getElementById("login-email");
      const inputPassword = document.getElementById("login-password");
      const btnSubmit = formLogin.querySelector("button[type='submit']");

      const email = inputEmail.value.trim();
      const password = inputPassword.value;

      try {
        cambiarEstadoBoton(btnSubmit, true, "Verificando...");
        const usuario = await iniciarSesion(email, password);
        mostrarToast(`¡Bienvenido de nuevo, ${usuario.displayName || usuario.email}!`, "exito");
        formLogin.reset();
      } catch (error) {
        mostrarToast(error.message, "error");
      } finally {
        cambiarEstadoBoton(btnSubmit, false, "Iniciar Sesión");
      }
    });
  }

  // Manejador de Registro de Usuario
  if (formRegistro) {
    formRegistro.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputNombre = document.getElementById("registro-nombre");
      const inputEmail = document.getElementById("registro-email");
      const inputPassword = document.getElementById("registro-password");
      const btnSubmit = formRegistro.querySelector("button[type='submit']");

      const nombre = inputNombre.value.trim();
      const email = inputEmail.value.trim();
      const password = inputPassword.value;

      try {
        cambiarEstadoBoton(btnSubmit, true, "Registrando...");
        const usuario = await registrarUsuario(email, password, nombre);
        mostrarToast(`Cuenta creada con éxito. ¡Bienvenido, ${usuario.displayName}!`, "exito");
        formRegistro.reset();
      } catch (error) {
        mostrarToast(error.message, "error");
      } finally {
        cambiarEstadoBoton(btnSubmit, false, "Crear Cuenta");
      }
    });
  }

  // Manejador de Cierre de Sesión
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async () => {
      try {
        await cerrarSesion();
        mostrarToast("Has cerrado sesión correctamente.", "info");
      } catch (error) {
        mostrarToast(error.message, "error");
      }
    });
  }
}

/**
 * Controla el estado visual de carga y deshabilita botones durante llamadas asíncronas.
 * @param {HTMLButtonElement} boton - Elemento botón del formulario.
 * @param {boolean} cargando - Indica si la petición está en progreso.
 * @param {string} texto - Texto a desplegar en el botón.
 */
function cambiarEstadoBoton(boton, cargando, texto) {
  if (!boton) return;
  boton.disabled = cargando;
  boton.textContent = texto;
  if (cargando) {
    boton.classList.add("opacity-60", "cursor-not-allowed");
  } else {
    boton.classList.remove("opacity-60", "cursor-not-allowed");
  }
}
