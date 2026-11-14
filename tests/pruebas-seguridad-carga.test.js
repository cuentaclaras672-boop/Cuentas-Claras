/**
 * @file pruebas-seguridad-carga.test.js
 * @description Pruebas de blindaje estático de Firestore Rules, concurrencia de 50 operaciones,
 * latencia máxima y normalización transversal de fechas - Tarea 14.2 / HU-14 & Retrospectiva S4.
 * Responsables: Fabián Córdoba (QA Lead) / Daniel Cortes / Juan Diego Peraza.
 *
 * Uso:
 *   node tests/pruebas-seguridad-carga.test.js
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { conReintentos } from "../src/services/conexion.js";
import { calcularCuadreMes } from "../src/utils/cuadre.js";
import { formatearFecha, normalizarFecha } from "../src/utils/formateo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_REGLAS = path.resolve(__dirname, "../firestore.rules");

/**
 * Simula un almacén transaccional tipo Firestore runTransaction en memoria
 * garantizando serialización atómica en pruebas de estrés concurrente.
 */
function crearAlmacenTransaccionalMock(saldoInicial = 200000) {
  let saldoRestante = saldoInicial;
  const liquidaciones = new Map();
  let cola = Promise.resolve();

  const enTransaccion = (fn) => {
    const ejecucion = cola.then(() => fn());
    cola = ejecucion.catch(() => {});
    return ejecucion;
  };

  return {
    obtenerSaldo: () => saldoRestante,
    contarLiquidaciones: () => liquidaciones.size,
    abonarAtomico: (monto) =>
      enTransaccion(async () => {
        if (monto <= 0 || saldoRestante - monto < 0) {
          throw new Error("El abono supera el saldo pendiente.");
        }
        saldoRestante -= monto;
        return saldoRestante;
      }),
    saldarPeriodoIdempotente: (clavePeriodo, payload) =>
      enTransaccion(async () => {
        if (liquidaciones.has(clavePeriodo)) {
          throw new Error("Este periodo ya fue marcado como saldado.");
        }
        liquidaciones.set(clavePeriodo, payload);
        return clavePeriodo;
      })
  };
}

export async function ejecutarPruebasSeguridadCarga() {
  console.log("Iniciando pruebas de la Tarea 14.2: Auditoría de Reglas, Estrés (50 ops) y Fechas...");

  // 1. CA-14.1: Auditoría estática de cobertura en firestore.rules (6 colecciones + catch-all)
  const reglas = fs.readFileSync(RUTA_REGLAS, "utf8");
  const coleccionesEsperadas = [
    "transacciones",
    "bolsillos",
    "prestamos",
    "hogares",
    "liquidaciones",
    "categorias"
  ];
  for (const col of coleccionesEsperadas) {
    assert.ok(
      reglas.includes(`match /${col}/`),
      `firestore.rules debe declarar reglas explícitas para la colección '${col}'.`
    );
  }
  assert.ok(
    reglas.includes("request.auth != null"),
    "firestore.rules debe requerir usuario autenticado."
  );
  const bloqueLiquidacionesMatch = reglas.match(
    /match\s+\/liquidaciones\/\{liquidacionId\}\s*\{([\s\S]*?)\n\s*\}/
  );
  assert.ok(bloqueLiquidacionesMatch, "Debe existir bloque match /liquidaciones/{liquidacionId}.");
  const bloqueLiquidaciones = bloqueLiquidacionesMatch[1];
  assert.ok(
    bloqueLiquidaciones.includes("allow read:") && bloqueLiquidaciones.includes("allow create:"),
    "liquidaciones debe definir reglas explícitas de lectura y creación."
  );
  assert.ok(
    !/allow\s+(?:write|update|delete)\s*:/.test(bloqueLiquidaciones),
    "liquidaciones debe permanecer inmutable en firestore.rules (sin allow write/update/delete)."
  );
  assert.ok(
    /match \/\{document=\*\*\}[\s\S]*allow read, write: if false;/.test(reglas),
    "firestore.rules debe cerrar cualquier ruta no contemplada con deny-all."
  );
  console.log("  -> [OK] Auditoría estática de 6 colecciones y catch-all deny-all en firestore.rules verificada.");

  // 2. CA-14.2 & CA-14.4: Ráfaga de 50 operaciones concurrentes con fallos transitorios y latencia < 500 ms
  const inicio = performance.now();
  const almacen = crearAlmacenTransaccionalMock(200000);
  const esperarCero = async () => {};

  const peticionesMixtas = Array.from({ length: 50 }, (_, idx) => {
    let intento = 0;
    return conReintentos(
      async () => {
        intento++;
        if (idx % 10 === 0 && intento === 1) {
          const err = new Error("Servicio temporalmente saturado");
          err.code = "unavailable";
          throw err;
        }
        return almacen.abonarAtomico(10000);
      },
      { esperar: esperarCero }
    ).catch((err) => ({ rechazado: true, motivo: err.message }));
  });

  const resultadosAbonos = await Promise.all(peticionesMixtas);
  const duracionMs = performance.now() - inicio;

  const exitosos = resultadosAbonos.filter((r) => typeof r === "number");
  const rechazados = resultadosAbonos.filter((r) => r && r.rechazado === true);

  assert.equal(exitosos.length, 20, "Solo 20 abonos de $10.000 caben en un saldo inicial de $200.000.");
  assert.equal(rechazados.length, 30, "Los 30 abonos sobrantes deben rechazarse limpiamente sin sobrescritura.");
  assert.equal(almacen.obtenerSaldo(), 0, "El saldo final nunca debe volverse negativo ni perder actualizaciones.");
  assert.ok(
    duracionMs < 500,
    `La ráfaga de 50 operaciones tardó ${duracionMs.toFixed(2)} ms y superó el umbral CA-14.4 de 500 ms.`
  );
  console.log(`  -> [OK] Ráfaga de 50 abonos concurrentes completada en ${duracionMs.toFixed(2)} ms (< 500 ms), 0 race conditions.`);

  // 3. CA-14.2: 50 intentos simultáneos de liquidación idempotente + cálculo de cuadre bajo carga
  const gastosSimulados = [
    { tipo: "GASTO", monto: 120000, creadoPor: "u1" },
    { tipo: "GASTO", monto: 60000, creadoPor: "u2" },
    { tipo: "GASTO", monto: 0, creadoPor: "u3" }
  ];
  const cuadre = calcularCuadreMes(gastosSimulados, ["u1", "u2", "u3"]);

  const intentosCierre = Array.from({ length: 50 }, (_, i) =>
    almacen
      .saldarPeriodoIdempotente("HOGAR1_2026-11", { actor: `u${(i % 3) + 1}`, transferencias: cuadre.transferencias })
      .then(() => ({ consolidado: true }))
      .catch(() => ({ consolidado: false }))
  );

  const resultadosCierre = await Promise.all(intentosCierre);
  const cierresConsolidados = resultadosCierre.filter((r) => r.consolidado).length;

  assert.equal(cierresConsolidados, 1, "De 50 cierres concurrentes, exactamente 1 debe consolidarse por idempotencia.");
  assert.equal(almacen.contarLiquidaciones(), 1, "Solo debe persistirse un documento por hogar y periodo.");
  console.log("  -> [OK] Idempotencia bajo 50 cierres mensuales concurrentes verificada (1 consolidado, 49 bloqueados).");

  // 4. Ancla 1 (Retrospectiva Sprint 4): Normalización transversal de fechas heterogéneas
  const fechaBase = new Date("2026-11-13T15:30:00.000Z");
  const mockTimestamp = { toDate: () => new Date(fechaBase.getTime()) };
  const mockSeconds = { seconds: Math.floor(fechaBase.getTime() / 1000) };

  assert.equal(normalizarFecha(fechaBase)?.getTime(), fechaBase.getTime());
  assert.equal(normalizarFecha(mockTimestamp)?.getTime(), fechaBase.getTime());
  assert.equal(normalizarFecha(mockSeconds)?.getTime(), fechaBase.getTime());
  assert.equal(normalizarFecha("2026-11-13T15:30:00.000Z")?.getTime(), fechaBase.getTime());
  assert.equal(normalizarFecha(null), null);
  assert.equal(normalizarFecha(""), null);
  assert.equal(normalizarFecha("fecha-corrupta"), null);
  assert.equal(formatearFecha(null), "Fecha no disponible");
  assert.equal(formatearFecha("fecha-corrupta"), "Fecha inválida");
  assert.ok(formatearFecha(mockSeconds).includes("2026"), "formatearFecha debe soportar objetos { seconds } vía normalizarFecha.");
  console.log("  -> [OK] Normalización transversal normalizarFecha() verificada para Date, Timestamp y { seconds }.");

  return true;
}

if (process.argv[1] && process.argv[1].endsWith("pruebas-seguridad-carga.test.js")) {
  ejecutarPruebasSeguridadCarga().catch((err) => {
    console.error("[FAIL] Error en pruebas de seguridad y carga:", err);
    process.exit(1);
  });
}
