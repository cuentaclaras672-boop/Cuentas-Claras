/**
 * @file conexion.js
 * @description Capa de Infraestructura / Servicios - Detección del estado de la conexión a Internet
 * (Tarea 7.2 / HU-07 - Condición #5). Escucha los eventos `online` / `offline` del navegador
 * y avisa a quien se suscriba. No toca el DOM: la interfaz decide qué mostrar.
 * @module services/conexion
 */

/**
 * Indica si el navegador tiene conexión en este momento.
 * @returns {boolean} true si hay conexión.
 */
export function hayConexion() {
  return navigator.onLine;
}

/**
 * Se suscribe a los cambios de conexión del navegador.
 * @param {function(boolean): void} onCambio - Recibe true al recuperar la conexión y false al perderla.
 * @returns {function(): void} Función para cancelar la suscripción y no dejar escuchadores duplicados.
 */
export function escucharConexion(onCambio) {
  if (typeof onCambio !== "function") {
    throw new TypeError("Se debe suministrar un callback para los cambios de conexión.");
  }

  const alConectar = () => onCambio(true);
  const alDesconectar = () => onCambio(false);

  window.addEventListener("online", alConectar);
  window.addEventListener("offline", alDesconectar);

  return () => {
    window.removeEventListener("online", alConectar);
    window.removeEventListener("offline", alDesconectar);
  };
}
