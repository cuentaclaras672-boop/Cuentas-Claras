/**
 * @file formateo.js
 * @description Módulo de utilidades para formateo de valores monetarios, fechas y cadenas.
 * @module utils/formateo
 */

/**
 * Formatea un número como moneda colombiana (COP) o la divisa especificada.
 * @param {number|string} valor - Cantidad numérica a formatear.
 * @param {string} [moneda='COP'] - Código ISO de la moneda (COP, USD, EUR).
 * @param {number} [decimales=0] - Cantidad de dígitos decimales a mostrar.
 * @returns {string} Texto formateado con signo de moneda y separadores de miles.
 */
export function formatearMoneda(valor, moneda = 'COP', decimales = 0) {
  const numero = typeof valor === 'number' ? valor : parseFloat(valor);

  if (isNaN(numero)) {
    return '$ 0';
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(numero);
}

/**
 * Formatea específicamente la TRM con dos decimales de precisión oficial.
 * Ejemplo: "$ 3.329,61"
 * @param {number|string} valor - Valor de la TRM.
 * @returns {string} TRM formateada con centavos.
 */
export function formatearTRM(valor) {
  return formatearMoneda(valor, 'COP', 2);
}

/**
 * Convierte una fecha (Date, string ISO o Firebase Timestamp) a formato legible en español.
 * Ejemplo: "25 sep. 2026, 12:30 p. m."
 * @param {Date|string|number|object} fecha - Objeto fecha o timestamp.
 * @returns {string} Fecha formateada de forma amigable.
 */
export function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';

  let objetoFecha;

  // Soporte para Firebase Firestore Timestamp (posee método .toDate())
  if (fecha && typeof fecha.toDate === 'function') {
    objetoFecha = fecha.toDate();
  } else if (fecha instanceof Date) {
    objetoFecha = fecha;
  } else {
    objetoFecha = new Date(fecha);
  }

  if (isNaN(objetoFecha.getTime())) {
    return 'Fecha inválida';
  }

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(objetoFecha);
}

/**
 * Limpia y convierte una entrada de texto a un valor numérico válido.
 * @param {string|number} entrada - Valor ingresado en un formulario.
 * @returns {number} Número decimal positivo validado.
 * @throws {Error} Si el monto no es un número válido o es menor o igual a cero.
 */
export function parsearMonto(entrada) {
  if (typeof entrada === 'number') {
    if (isNaN(entrada) || entrada <= 0) {
      throw new Error('El monto debe ser un valor numérico mayor a cero.');
    }
    return entrada;
  }

  if (typeof entrada !== 'string') {
    throw new Error('Formato de monto inválido.');
  }

  const limpio = entrada.replace(/[^0-9.-]+/g, '');
  const numero = parseFloat(limpio);

  if (isNaN(numero) || numero <= 0) {
    throw new Error('El monto ingresado debe ser superior a $0.');
  }

  return Math.round(numero * 100) / 100;
}
