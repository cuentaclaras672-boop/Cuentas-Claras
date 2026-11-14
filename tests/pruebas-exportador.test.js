/**
 * @file pruebas-exportador.test.js
 * @description Pruebas unitarias de Exportación CSV (RFC 4180, BOM UTF-8 y filtros activos)
 * para Sprint 5 — HU-15 / Tarea 15.1 (Juan Diego Peraza).
 *
 * Uso:
 *   node tests/pruebas-exportador.test.js
 */

import assert from "node:assert/strict";
import {
  CABECERAS_CSV,
  escaparCampoCSV,
  generarCSVTransacciones,
  nombreArchivoCSV
} from "../src/utils/exportador.js";

export async function ejecutarPruebasExportador() {
  console.log("Iniciando pruebas de la Tarea 15.1: Exportación CSV RFC 4180 (HU-15)...");

  // 1. Validar cabeceras oficiales CA-15.1
  assert.deepEqual(CABECERAS_CSV, [
    "Fecha",
    "Descripcion",
    "Monto",
    "Tipo",
    "Ambito",
    "Categoria",
    "Autor"
  ]);

  // 2. Validar escapado RFC 4180 (comas, comillas dobles, saltos de línea y prevención de fórmulas)
  assert.equal(escaparCampoCSV("Mercado"), "Mercado");
  assert.equal(escaparCampoCSV("Mercado, frutas"), '"Mercado, frutas"');
  assert.equal(escaparCampoCSV('Pago "Urgente"'), '"Pago ""Urgente"""');
  assert.equal(escaparCampoCSV("Linea 1\nLinea 2"), '"Linea 1\nLinea 2"');
  assert.equal(escaparCampoCSV("=CMD|calc"), "'=CMD|calc");
  assert.equal(escaparCampoCSV(null), "");
  assert.equal(escaparCampoCSV(150000), "150000");
  console.log("  -> [OK] Escapado RFC 4180 y neutralización de inyección de fórmulas validados.");

  // 3. Validar BOM UTF-8, formato CRLF y columnas serializadas sobre datos mixtos
  const transacciones = [
    {
      fecha: new Date(2026, 10, 13, 9, 5),
      descripcion: 'Mercado "Éxito", semanal\nfrutas',
      monto: 185000,
      tipo: "GASTO",
      ambito: "COMPARTIDO",
      categoria: "Alimentación",
      nombreUsuario: "Juan Diego Peraza"
    },
    {
      fecha: { seconds: Math.floor(new Date(2026, 10, 14, 14, 30).getTime() / 1000) },
      descripcion: "Salario quincena",
      monto: 2400000,
      tipo: "INGRESO",
      ambito: "PERSONAL",
      categoria: "Salario",
      nombreUsuario: "Daniel Cortes"
    }
  ];

  const csvConBOM = generarCSVTransacciones(transacciones);
  assert.ok(csvConBOM.startsWith("\uFEFF"), "El CSV debe incluir BOM UTF-8 por defecto para Excel.");

  const sinBomTexto = csvConBOM.slice(1);
  assert.equal(sinBomTexto, generarCSVTransacciones(transacciones, { incluirBOM: false }));
  assert.ok(sinBomTexto.includes("\r\n"), "Las filas deben separarse con CRLF estándar RFC 4180.");

  const primeraLinea = sinBomTexto.split("\r\n")[0];
  assert.equal(primeraLinea, "Fecha,Descripcion,Monto,Tipo,Ambito,Categoria,Autor");
  assert.ok(sinBomTexto.includes("2026-11-13 09:05"), "La fecha Date debe formatearse como AAAA-MM-DD HH:mm.");
  assert.ok(sinBomTexto.includes("2026-11-14 14:30"), "La fecha { seconds } debe normalizarse correctamente.");
  assert.ok(
    sinBomTexto.includes('"Mercado ""Éxito"", semanal\nfrutas",185000,GASTO,COMPARTIDO,Alimentación,Juan Diego Peraza'),
    "La fila escapada debe conservar el orden exacto de columnas CA-15.1."
  );
  console.log("  -> [OK] Serialización CSV con BOM UTF-8, CRLF, Timestamp { seconds } y RFC 4180 validada.");

  // 4. CA-15.2: Exportación vacía y validación de tipo de entrada
  const csvVacio = generarCSVTransacciones([], { incluirBOM: false });
  assert.equal(csvVacio, "Fecha,Descripcion,Monto,Tipo,Ambito,Categoria,Autor");
  assert.throws(() => generarCSVTransacciones("no-es-arreglo"), TypeError);

  // 5. Nombre de archivo determinista
  const nombreArchivo = nombreArchivoCSV(new Date(2026, 10, 14, 10, 0));
  assert.equal(nombreArchivo, "cuentas-claras-reporte-2026-11-14.csv");
  console.log("  -> [OK] Exportación vacía, manejo de errores y nombreArchivoCSV validados.");

  return true;
}

if (process.argv[1] && process.argv[1].endsWith("pruebas-exportador.test.js")) {
  ejecutarPruebasExportador().catch((err) => {
    console.error("[FAIL] Error en pruebas del exportador CSV:", err);
    process.exit(1);
  });
}
