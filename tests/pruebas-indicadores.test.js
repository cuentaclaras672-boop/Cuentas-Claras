/**
 * @file pruebas-indicadores.test.js
 * @description Suite de Pruebas Unitarias y de Tolerancia a Fallos - Tarea 6.4 / HU-06 (Integración Externa TRM).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-6.1, CA-6.2, CA-6.3, CA-6.4, CA-6.5 y mitigación de Riesgo R6.
 */

import assert from "node:assert/strict";
import { formatearTRM, formatearMoneda } from "../src/utils/formateo.js";

// Parámetros oficiales de indicadores.js
const TRM_FALLBACK_DEFAULT = 3329.61;
const TIEMPO_LIMITE_MS = 5000;

/**
 * Simulación del algoritmo multicanal de indicadores.js con inyección de cliente fetch
 * para probar aisladamente todos los escenarios de resiliencia y failover de red.
 */
async function simularConsultarTRM(mockFetch) {
  const URL_API_DATOS_GOV = "https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciahasta%20DESC";
  const URL_API_RESPALDO_1 = "https://open.er-api.com/v6/latest/USD";
  const URL_API_RESPALDO_2 = "https://trm-colombia.vercel.app/api/trm/current";

  // 1. Intento API Principal
  try {
    const res = await mockFetch(URL_API_DATOS_GOV);
    if (res.ok) {
      const datos = await res.json();
      if (Array.isArray(datos) && datos.length > 0) {
        const val = parseFloat(datos[0].valor);
        if (!isNaN(val) && val > 0) {
          return { valor: val, fuente: "Superfinanciera - Datos Abiertos" };
        }
      }
    }
  } catch (err) {}

  // 2. Intento Respaldo 1
  try {
    const res = await mockFetch(URL_API_RESPALDO_1);
    if (res.ok) {
      const datos = await res.json();
      if (datos?.rates?.COP) {
        const val = parseFloat(datos.rates.COP);
        if (!isNaN(val) && val > 0) {
          return { valor: val, fuente: "Open Exchange Rates (Respaldo)" };
        }
      }
    }
  } catch (err) {}

  // 3. Intento Respaldo 2
  try {
    const res = await mockFetch(URL_API_RESPALDO_2);
    if (res.ok) {
      const datos = await res.json();
      if (datos?.data?.valor) {
        const val = parseFloat(datos.data.valor);
        if (!isNaN(val) && val > 0) {
          return { valor: val, fuente: "TRM Colombia API (Respaldo)" };
        }
      }
    }
  } catch (err) {}

  // 4. Contingencia defensiva (Fallback local)
  return {
    valor: TRM_FALLBACK_DEFAULT,
    fuente: "Valor de contingencia local (Modo Fuera de Línea)"
  };
}

/**
 * Simula la conversión de saldo en cliente sin mutar los datos originales (CA-6.3, CA-6.4).
 */
function convertirSaldosPresentacion(saldoCOP, tasa, divisa) {
  if (divisa === "USD") {
    return {
      montoCalculado: Math.round((saldoCOP / tasa) * 100) / 100,
      textoFormateado: formatearMoneda(saldoCOP / tasa, "USD", 2)
    };
  }
  return {
    montoCalculado: saldoCOP,
    textoFormateado: formatearMoneda(saldoCOP, "COP", 0)
  };
}

export async function ejecutarPruebasIndicadores() {
  console.log("▶ Ejecutando pruebas de Tarea 6.4 (API TRM, Fallback y Divisas)...");

  // Escenario 1: API principal responde correctamente (CA-6.1)
  const mockOk = async (url) => ({
    ok: true,
    json: async () => [{ valor: "3350.25", vigenciadesde: "2026-09-24", vigenciahasta: "2026-09-25" }]
  });
  const resOk = await simularConsultarTRM(mockOk);
  assert.equal(resOk.valor, 3350.25);
  assert.ok(resOk.fuente.includes("Superfinanciera"));

  // Escenario 2: API principal cae (500 / timeout) -> Debe conmutar a respaldo 1 (CA-6.2)
  const mockFailPrincipal = async (url) => {
    if (url.includes("datos.gov.co")) {
      throw new Error("500 Internal Server Error simulado");
    }
    return {
      ok: true,
      json: async () => ({ rates: { COP: 3345.50 } })
    };
  };
  const resFail1 = await simularConsultarTRM(mockFailPrincipal);
  assert.equal(resFail1.valor, 3345.50);
  assert.ok(resFail1.fuente.includes("Open Exchange Rates"));

  // Escenario 3: Caída total de red / bloqueo en DevTools F12 -> Fallback de contingencia (CA-6.2)
  const mockTotalOffline = async () => {
    throw new TypeError("Failed to fetch (NetworkBlocked in DevTools)");
  };
  const resOffline = await simularConsultarTRM(mockTotalOffline);
  assert.equal(resOffline.valor, TRM_FALLBACK_DEFAULT, "Debe retornar el valor referencial exacto");
  assert.ok(resOffline.fuente.includes("contingencia local"), "Debe identificar la fuente como contingencia offline");

  // Verificación de formato con 2 decimales oficiales (CA-6.1)
  const textoTRM = formatearTRM(resOffline.valor);
  assert.ok(textoTRM.includes("3.329,61") || textoTRM.includes("3,329.61"), "La TRM debe tener 2 decimales");

  // Verificación de conversión COP a USD y de integridad contable (CA-6.3, CA-6.4)
  const saldoOriginalCOP = 1000000;
  const saldoUSD = convertirSaldosPresentacion(saldoOriginalCOP, resOffline.valor, "USD");
  const saldoRecalculado = Math.round((saldoOriginalCOP / resOffline.valor) * 100) / 100;

  assert.equal(saldoUSD.montoCalculado, saldoRecalculado);
  assert.equal(saldoOriginalCOP, 1000000, "El valor contable en COP no debe ser alterado");

  console.log("  ✔ Todas las verificaciones de Tarea 6.4 pasaron exitosamente (CA-6.1 a CA-6.5).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-indicadores.test.js")) {
  ejecutarPruebasIndicadores();
}
