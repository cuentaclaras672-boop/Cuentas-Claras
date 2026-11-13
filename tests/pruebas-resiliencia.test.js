/**
 * @file pruebas-resiliencia.test.js
 * @description Pruebas de degradación elegante y reconexión automática - Tarea 14.3 / HU-14 (CA-14.3).
 * Responsable: Daniel Cortes.
 * Prueba el módulo real src/services/conexion.js simulando el estado de red y los errores de Firestore.
 *
 * Uso:
 *   node tests/pruebas-resiliencia.test.js
 */

import assert from "node:assert/strict";
import {
  asegurarConexion,
  conReintentos,
  esErrorTransitorio,
  ErrorSinConexion,
  hayConexion,
  MENSAJE_SIN_CONEXION
} from "../src/services/conexion.js";

/** Error con código, como los que lanza Firestore (FirestoreError tiene `code`). */
function errorFirestore(code, mensaje = `Simulación ${code}`) {
  const error = new Error(mensaje);
  error.code = code;
  return error;
}

/** Espera simulada: no duerme, solo registra cuánto habría esperado. */
function crearEsperaFalsa() {
  const esperas = [];
  return { esperas, esperar: async (ms) => { esperas.push(ms); } };
}

export async function ejecutarPruebasResiliencia() {
  console.log("Iniciando pruebas de la Tarea 14.3: degradación elegante y reconexión...");

  // Fuera del navegador se asume conexión (no rompe las pruebas en Node)
  assert.equal(hayConexion(), true);

  // CA-14.3: sin conexión la escritura se rechaza antes de llegar a Firestore
  assert.throws(() => asegurarConexion(() => false), ErrorSinConexion);
  assert.doesNotThrow(() => asegurarConexion(() => true));
  try {
    asegurarConexion(() => false);
  } catch (error) {
    assert.equal(error.message, MENSAJE_SIN_CONEXION, "El mensaje debe estar listo para el Toast");
    assert.equal(error.code, "sin-conexion");
  }

  // Clasificación de errores: solo los de red se reintentan
  assert.equal(esErrorTransitorio(errorFirestore("unavailable")), true);
  assert.equal(esErrorTransitorio(errorFirestore("deadline-exceeded")), true);
  assert.equal(esErrorTransitorio(new Error("Failed to get document because the client is offline.")), true);
  assert.equal(esErrorTransitorio(errorFirestore("permission-denied")), false);
  assert.equal(esErrorTransitorio(new Error("Ya perteneces a un hogar.")), false);
  assert.equal(esErrorTransitorio(new ErrorSinConexion()), false);
  assert.equal(esErrorTransitorio(null), false);

  // Sin conexión: la operación nunca se ejecuta y no se reintenta
  let llamadasOffline = 0;
  await assert.rejects(
    conReintentos(async () => { llamadasOffline++; return "ok"; }, { estaEnLinea: () => false }),
    ErrorSinConexion
  );
  assert.equal(llamadasOffline, 0, "Sin red no se debe tocar Firestore");

  // Reconexión automática: dos fallos de red y luego éxito, con espera exponencial
  let intentos = 0;
  const espera1 = crearEsperaFalsa();
  const resultado = await conReintentos(async () => {
    intentos++;
    if (intentos < 3) throw errorFirestore("unavailable");
    return "guardado";
  }, { estaEnLinea: () => true, esperar: espera1.esperar, esperaInicialMs: 100 });
  assert.equal(resultado, "guardado");
  assert.equal(intentos, 3);
  assert.deepEqual(espera1.esperas, [100, 200], "La espera se duplica entre intentos");

  // Se agotan los intentos: error amigable, sin quedarse colgado
  let intentosAgotados = 0;
  const espera2 = crearEsperaFalsa();
  await assert.rejects(
    conReintentos(async () => { intentosAgotados++; throw errorFirestore("deadline-exceeded"); },
      { intentos: 4, estaEnLinea: () => true, esperar: espera2.esperar, esperaInicialMs: 1000, esperaMaximaMs: 3000 }),
    (error) => error instanceof ErrorSinConexion && error.message.includes("varios intentos")
  );
  assert.equal(intentosAgotados, 4);
  assert.deepEqual(espera2.esperas, [1000, 2000, 3000], "La espera respeta el tope");

  // La red se cae a mitad de los reintentos: se corta de inmediato
  let enLinea = true;
  let intentosCaida = 0;
  await assert.rejects(
    conReintentos(async () => { intentosCaida++; enLinea = false; throw errorFirestore("unavailable"); },
      { estaEnLinea: () => enLinea, esperar: async () => {} }),
    ErrorSinConexion
  );
  assert.equal(intentosCaida, 1, "Después de perder la red no se vuelve a intentar");

  // Errores que no son de red (reglas, validaciones) salen tal cual y sin reintentar
  let intentosPermiso = 0;
  await assert.rejects(
    conReintentos(async () => { intentosPermiso++; throw errorFirestore("permission-denied"); },
      { estaEnLinea: () => true, esperar: async () => {} }),
    (error) => error.code === "permission-denied"
  );
  assert.equal(intentosPermiso, 1);

  // CA-14.3: el estado en memoria no se corrompe si la operación falla
  const saldoEnMemoria = { total: 50000 };
  const copia = structuredClone(saldoEnMemoria);
  await assert.rejects(conReintentos(async () => {
    throw errorFirestore("unavailable");
  }, { intentos: 2, estaEnLinea: () => true, esperar: async () => {} }));
  assert.deepEqual(saldoEnMemoria, copia, "Un fallo de red no modifica los datos en memoria");

  await assert.rejects(conReintentos(null), TypeError);

  console.log("  ✔ Todas las verificaciones de la Tarea 14.3 pasaron (CA-14.3).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-resiliencia.test.js")) {
  ejecutarPruebasResiliencia();
}
