/**
 * @file notificaciones.js
 * @description Capa de Presentación - Sistema centralizado de notificaciones flotantes (Toasts).
 * Cumple la regla de arquitectura: Manejo de errores visible y amigable para el usuario.
 * @module ui/notificaciones
 */

const CONTENEDOR_ID = "cc-toast-container";

/**
 * Obtiene o crea dinámicamente el contenedor flotante para los Toasts en el DOM.
 * @returns {HTMLElement} Elemento contenedor de notificaciones.
 */
function obtenerContenedor() {
  let contenedor = document.getElementById(CONTENEDOR_ID);
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = CONTENEDOR_ID;
    contenedor.className = "fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0";
    document.body.appendChild(contenedor);
  }
  return contenedor;
}

/**
 * Estilos y configuraciones visuales por cada tipo de notificación.
 */
const ESTILOS_TOAST = {
  exito: {
    fondo: "bg-emerald-900/90 border-emerald-500 text-emerald-100",
    icono: `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    titulo: "Éxito"
  },
  error: {
    fondo: "bg-rose-900/90 border-rose-500 text-rose-100",
    icono: `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    titulo: "Error"
  },
  advertencia: {
    fondo: "bg-amber-900/90 border-amber-500 text-amber-100",
    icono: `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
    titulo: "Atención"
  },
  info: {
    fondo: "bg-cyan-900/90 border-cyan-500 text-cyan-100",
    icono: `<svg class="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    titulo: "Información"
  }
};

/**
 * Muestra una notificación emergente flotante en pantalla.
 * @param {string} mensaje - Texto descriptivo para el usuario.
 * @param {'exito'|'error'|'advertencia'|'info'} [tipo='info'] - Naturaleza visual del mensaje.
 * @param {number} [duracion=4000] - Tiempo en milisegundos antes del auto-cierre.
 */
export function mostrarToast(mensaje, tipo = "info", duracion = 4000) {
  const contenedor = obtenerContenedor();
  const configuracion = ESTILOS_TOAST[tipo] || ESTILOS_TOAST.info;

  const elementoToast = document.createElement("div");
  elementoToast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-2 opacity-0 ${configuracion.fondo}`;

  elementoToast.innerHTML = `
    ${configuracion.icono}
    <div class="flex-1 text-sm leading-snug">
      <p class="font-semibold capitalize">${configuracion.titulo}</p>
      <p class="mt-0.5 text-xs opacity-90">${mensaje}</p>
    </div>
    <button type="button" class="text-white/60 hover:text-white transition-colors" aria-label="Cerrar notificación">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  const botonCerrar = elementoToast.querySelector("button");
  const cerrarToast = () => {
    elementoToast.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => {
      if (elementoToast.parentElement) {
        elementoToast.remove();
      }
    }, 300);
  };

  botonCerrar.addEventListener("click", cerrarToast);
  contenedor.appendChild(elementoToast);

  // Animación de entrada
  requestAnimationFrame(() => {
    elementoToast.classList.remove("translate-y-2", "opacity-0");
  });

  // Temporizador de auto-destrucción
  if (duracion > 0) {
    setTimeout(cerrarToast, duracion);
  }
}
