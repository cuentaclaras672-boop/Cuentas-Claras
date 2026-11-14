/**
 * Módulo de Exportación de Reportes Financieros (CSV RFC 4180).
 * Cumple estrictamente SoC: lógica pura sin manipulación del DOM ni llamadas a red.
 * Implementa Sprint 5 — HU-15 / Tarea 15.1 (Juan Diego Peraza).
 */

import { fechaLocalISO, normalizarFecha } from "./formateo.js";

/**
 * Cabecera oficial del reporte CSV (CA-15.1).
 * @type {string[]}
 */
export const CABECERAS_CSV = [
  "Fecha",
  "Descripcion",
  "Monto",
  "Tipo",
  "Ambito",
  "Categoria",
  "Autor"
];

/**
 * Escapa una celda siguiendo el estándar RFC 4180 y previene interpretación
 * accidental de fórmulas en hojas de cálculo si un texto inicia con =, +, - o @.
 * @param {string|number|null|undefined} valor - Valor crudo de la celda.
 * @returns {string} Celda escapada lista para concatenar con coma.
 */
export function escaparCampoCSV(valor) {
  if (valor === null || valor === undefined) return "";

  let texto = String(valor);

  // Neutralización preventiva de CSV Formula Injection en campos de texto no numéricos
  if (typeof valor === "string" && /^[=+\-@]/.test(texto)) {
    texto = `'${texto}`;
  }

  if (/[",\r\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

/**
 * Formatea una fecha a representación ISO legible AAAA-MM-DD HH:mm para reportes CSV.
 * @param {Date|string|number|object} valor - Fecha de la transacción.
 * @returns {string} Fecha formateada o cadena vacía si no es válida.
 */
function formatearFechaCSV(valor) {
  const fecha = normalizarFecha(valor);
  if (!fecha) return "";

  const dia = fechaLocalISO(fecha);
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${dia} ${horas}:${minutos}`;
}

/**
 * Genera el contenido completo de un archivo CSV (RFC 4180) a partir de
 * una lista de transacciones (por ejemplo, el subconjunto filtrado actual CA-15.2).
 *
 * @param {Array<object>} transacciones - Arreglo de objetos Transaccion.
 * @param {object} [opciones] - Configuración de exportación.
 * @param {boolean} [opciones.incluirBOM=true] - Antepone BOM UTF-8 (\uFEFF) para Excel en Windows.
 * @returns {string} Contenido CSV serializado con saltos CRLF (\r\n).
 */
export function generarCSVTransacciones(transacciones = [], opciones = {}) {
  const { incluirBOM = true } = opciones;

  if (!Array.isArray(transacciones)) {
    throw new TypeError("Se esperaba un arreglo de transacciones para exportar a CSV.");
  }

  const filas = [CABECERAS_CSV.join(",")];

  for (const t of transacciones) {
    if (!t || typeof t !== "object") continue;

    const montoNumerico = Number(t.monto);
    const montoSerializado = Number.isFinite(montoNumerico) ? montoNumerico : 0;

    const celdas = [
      escaparCampoCSV(formatearFechaCSV(t.fecha)),
      escaparCampoCSV(t.descripcion || ""),
      escaparCampoCSV(montoSerializado),
      escaparCampoCSV(t.tipo || ""),
      escaparCampoCSV(t.ambito || ""),
      escaparCampoCSV(t.categoria || "General"),
      escaparCampoCSV(t.nombreUsuario || t.creadoPor || "Usuario")
    ];

    filas.push(celdas.join(","));
  }

  const cuerpo = filas.join("\r\n");
  return incluirBOM ? `\uFEFF${cuerpo}` : cuerpo;
}

/**
 * Genera un nombre de archivo estandarizado para la descarga del CSV.
 * Ejemplo: "cuentas-claras-reporte-2026-11-14.csv"
 * @param {Date|string|number|object} [fechaReferencia=new Date()] - Fecha del reporte.
 * @returns {string} Nombre de archivo seguro.
 */
export function nombreArchivoCSV(fechaReferencia = new Date()) {
  const fecha = normalizarFecha(fechaReferencia) || new Date();
  return `cuentas-claras-reporte-${fechaLocalISO(fecha)}.csv`;
}
