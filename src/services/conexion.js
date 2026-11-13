/**
 * @file conexion.js
 * @description Capa de Infraestructura / Servicios - Estado de la conexión a Internet y resiliencia de red
 * (Tarea 7.2 / HU-07 y Tarea 14.3 / HU-14 - Condición #5).
 *
 * - Detecta los eventos `online` / `offline` del navegador y avisa a quien se suscriba.
 * - Degradación elegante (CA-14.3): las escrituras se rechazan antes de tocar Firestore cuando no hay
 *   conexión, así no quedan operaciones a medias ni estados en memoria que no coinciden con la base.
 * - Reconexión automática: las operaciones idempotentes se reintentan con espera exponencial
 *   cuando Firestore responde con un error transitorio de red.
 *
 * No toca el DOM: la interfaz decide qué mostrar.
 * @module services/conexion
 */

/** Mensaje que ve el usuario cuando intenta guardar sin conexión. */
export const MENSAJE_SIN_CONEXION =
  "Sin conexión a Internet. No se guardó ningún cambio; intenta de nuevo cuando vuelvas a estar en línea.";

/**
 * Códigos de error de Firestore que indican un fallo pasajero de red o del servidor.
 * Con estos códigos tiene sentido reintentar; con los demás (permission-denied, not-found...) no.
 */
const CODIGOS_TRANSITORIOS = new Set(["unavailable", "deadline-exceeded", "aborted"]);

/**
 * Error que se lanza cuando una operación no se puede hacer por falta de conexión.
 * Su `message` ya está listo para mostrarse en un Toast.
 */
export class ErrorSinConexion extends Error {
  /**
   * @param {string} [mensaje=MENSAJE_SIN_CONEXION] - Texto para el usuario.
   */
  constructor(mensaje = MENSAJE_SIN_CONEXION) {
    super(mensaje);
    this.name = "ErrorSinConexion";
    this.code = "sin-conexion";
  }
}

/**
 * Indica si el navegador tiene conexión en este momento.
 * Fuera del navegador (por ejemplo, en las pruebas con Node) se asume que hay conexión.
 * @returns {boolean} true si hay conexión.
 */
export function hayConexion() {
  if (typeof navigator === "undefined" || typeof navigator.onLine !== "boolean") return true;
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

/**
 * Corta la operación si no hay conexión (CA-14.3).
 * Se llama al inicio de cada escritura: Firestore pondría la escritura en cola local y la promesa
 * quedaría colgada hasta volver a tener red, con la interfaz mostrando "Guardando..." indefinidamente.
 * @param {function(): boolean} [estaEnLinea=hayConexion] - Permite simular el estado de red en las pruebas.
 * @throws {ErrorSinConexion} Si no hay conexión.
 * @returns {void}
 */
export function asegurarConexion(estaEnLinea = hayConexion) {
  if (!estaEnLinea()) {
    throw new ErrorSinConexion();
  }
}

/**
 * Indica si un error es un fallo pasajero de red que vale la pena reintentar.
 * @param {unknown} error - Error lanzado por Firestore o por fetch.
 * @returns {boolean} true si es transitorio.
 */
export function esErrorTransitorio(error) {
  if (!error) return false;
  if (error instanceof ErrorSinConexion) return false;
  if (CODIGOS_TRANSITORIOS.has(error.code)) return true;
  const mensaje = String(error.message || "").toLowerCase();
  return mensaje.includes("client is offline") || mensaje.includes("failed to fetch") || mensaje.includes("network");
}

/**
 * Espera la cantidad de milisegundos indicada.
 * @param {number} ms - Milisegundos.
 * @returns {Promise<void>}
 */
function esperarMs(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/**
 * Ejecuta una operación y la reintenta con espera exponencial si falla por un error transitorio de red.
 * Úsese solo con operaciones idempotentes o que validan el estado dentro de una transacción
 * (por ejemplo, un `runTransaction` que revisa si el registro ya existe), para que un reintento
 * nunca duplique datos.
 *
 * Antes de cada intento revisa la conexión: sin red no reintenta, falla de inmediato con
 * {@link ErrorSinConexion} y no deja nada a medias.
 *
 * @async
 * @template T
 * @param {function(): Promise<T>} operacion - Operación a ejecutar.
 * @param {object} [opciones]
 * @param {number} [opciones.intentos=3] - Número máximo de intentos (incluye el primero).
 * @param {number} [opciones.esperaInicialMs=400] - Espera antes del segundo intento; se duplica en cada reintento.
 * @param {number} [opciones.esperaMaximaMs=4000] - Tope de la espera entre intentos.
 * @param {function(): boolean} [opciones.estaEnLinea=hayConexion] - Estado de red (inyectable en pruebas).
 * @param {function(number): Promise<void>} [opciones.esperar] - Función de espera (inyectable en pruebas).
 * @param {function(number, Error): void} [opciones.alReintentar] - Aviso opcional antes de cada reintento.
 * @returns {Promise<T>} El resultado de la operación.
 * @throws {ErrorSinConexion} Si no hay conexión o se agotaron los intentos por fallos de red.
 * @throws {Error} El error original si no es transitorio (por ejemplo, permission-denied).
 */
export async function conReintentos(operacion, opciones = {}) {
  if (typeof operacion !== "function") {
    throw new TypeError("conReintentos necesita una función que devuelva una promesa.");
  }
  const {
    intentos = 3,
    esperaInicialMs = 400,
    esperaMaximaMs = 4000,
    estaEnLinea = hayConexion,
    esperar = esperarMs,
    alReintentar = null
  } = opciones;

  let espera = esperaInicialMs;
  for (let intento = 1; intento <= intentos; intento++) {
    asegurarConexion(estaEnLinea);
    try {
      return await operacion();
    } catch (error) {
      if (!esErrorTransitorio(error)) throw error;
      if (intento === intentos) {
        throw new ErrorSinConexion(
          "No fue posible comunicarse con la base de datos después de varios intentos. Revisa tu conexión e intenta de nuevo."
        );
      }
      if (alReintentar) alReintentar(intento, error);
      await esperar(espera);
      espera = Math.min(espera * 2, esperaMaximaMs);
    }
  }
  // Inalcanzable: el ciclo siempre retorna o lanza
  throw new ErrorSinConexion();
}
