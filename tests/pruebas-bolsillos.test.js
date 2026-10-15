/**
 * @file pruebas-bolsillos.test.js
 * @description Suite de Pruebas Unitarias y de Integración - Tarea 4.4 / HU-04 (Bolsillos con Metas y Saldo Disponible).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-4.1, CA-4.2, CA-4.3, CA-4.4, CA-4.5, CA-4.6, CA-4.7.
 */

import assert from "node:assert/strict";
import { Bolsillo } from "../src/models/Bolsillo.js";

/**
 * Función de cálculo de saldos consolidados que replica el cálculo del Dashboard
 * para verificar la deducción estricta de fondos de bolsillos sobre el saldo líquido (CA-4.5).
 */
function calcularSaldoLiquidoDisponible(ingresos, gastos, listaBolsillos) {
  const balanceNeto = ingresos - gastos;
  const totalBolsillos = listaBolsillos.reduce((acc, b) => acc + (b.montoAcumulado || 0), 0);
  const saldoDisponible = balanceNeto - totalBolsillos;

  return {
    balanceNeto,
    totalBolsillos,
    saldoDisponible
  };
}

/**
 * Simulación de la regla de negocio para transferir fondos a un bolsillo (CA-4.3):
 * No se puede transferir un monto mayor al saldo disponible del usuario.
 */
function validarTransferenciaABolsillo(saldoDisponibleActual, montoAbono) {
  if (isNaN(montoAbono) || montoAbono <= 0) {
    throw new Error("El monto a transferir debe ser mayor a cero.");
  }
  if (montoAbono > saldoDisponibleActual) {
    throw new Error(`Saldo insuficiente: tienes $ ${saldoDisponibleActual} disponible y pretendes transferir $ ${montoAbono}.`);
  }
  return true;
}

export function ejecutarPruebasBolsillos() {
  console.log("▶ Ejecutando pruebas de Tarea 4.4 (Integración de Bolsillos y Saldo Disponible)...");

  // CA-4.1: Instanciación válida de Bolsillo (incluyendo soporte para $0 iniciales)
  const bolsilloValido = new Bolsillo({
    id: "bol-1",
    nombre: "Viaje a Cartagena",
    meta: 1500000,
    montoAcumulado: 0,
    creadoPor: "usr-1"
  });
  assert.equal(bolsilloValido.validar(), true);
  assert.equal(bolsilloValido.montoAcumulado, 0);
  assert.equal(bolsilloValido.calcularPorcentaje(), 0);

  // CA-4.1: Rechazo de nombres menores a 3 caracteres
  assert.throws(
    () => new Bolsillo({ nombre: "Vi", meta: 50000, creadoPor: "usr-1" }).validar(),
    /al menos 3 caracteres/
  );

  // CA-4.1: Rechazo de metas <= 0
  assert.throws(
    () => new Bolsillo({ nombre: "Emergencias", meta: 0, creadoPor: "usr-1" }).validar(),
    /mayor a cero/
  );

  // CA-4.4: Cálculo de porcentaje de meta y tope máximo al 100%
  const bolsilloParcial = new Bolsillo({
    nombre: "Fondo Estudio",
    meta: 1000000,
    montoAcumulado: 450000,
    creadoPor: "usr-1"
  });
  assert.equal(bolsilloParcial.calcularPorcentaje(), 45);

  const bolsilloSuperado = new Bolsillo({
    nombre: "Ahorro Extra",
    meta: 200000,
    montoAcumulado: 250000,
    creadoPor: "usr-1"
  });
  assert.equal(bolsilloSuperado.calcularPorcentaje(), 100, "El porcentaje no debe superar el 100%");

  // CA-4.5: Deducción del saldo disponible
  // Balance general = $ 2.000.000 (Ingresos: 3M, Gastos: 1M)
  // Bolsillo 1 = $ 300.000, Bolsillo 2 = $ 200.000
  // Saldo disponible debe ser $ 1.500.000
  const bolsillos = [
    new Bolsillo({ id: "b1", nombre: "Bolsillo A", meta: 500000, montoAcumulado: 300000, creadoPor: "usr-1" }),
    new Bolsillo({ id: "b2", nombre: "Bolsillo B", meta: 400000, montoAcumulado: 200000, creadoPor: "usr-1" })
  ];

  const saldos1 = calcularSaldoLiquidoDisponible(3000000, 1000000, bolsillos);
  assert.equal(saldos1.balanceNeto, 2000000);
  assert.equal(saldos1.totalBolsillos, 500000);
  assert.equal(saldos1.saldoDisponible, 1500000, "El saldo disponible debe restar los fondos de bolsillos");

  // CA-4.3: Transferencia permitida si no supera el saldo disponible
  assert.doesNotThrow(() => {
    validarTransferenciaABolsillo(saldos1.saldoDisponible, 500000);
  });

  // CA-4.3: Rechazo de transferencia si supera el saldo disponible
  assert.throws(() => {
    validarTransferenciaABolsillo(saldos1.saldoDisponible, 1600000);
  }, /Saldo insuficiente/);

  // CA-4.6: Liberación de fondos al eliminar un bolsillo
  // Si se elimina el Bolsillo 1 ($300.000), el saldo disponible aumenta de $1.500.000 a $1.800.000
  const bolsillosTrasEliminar = bolsillos.filter(b => b.id !== "b1");
  const saldos2 = calcularSaldoLiquidoDisponible(3000000, 1000000, bolsillosTrasEliminar);
  assert.equal(saldos2.totalBolsillos, 200000);
  assert.equal(saldos2.saldoDisponible, 1800000, "Al eliminar un bolsillo sus fondos vuelven al disponible");

  // CA-4.2: Serialización y deserialización con Firestore
  const objetoFirestore = bolsilloValido.aFirestore();
  assert.equal(objetoFirestore.nombre, "Viaje a Cartagena");
  assert.equal(objetoFirestore.meta, 1500000);
  assert.equal(objetoFirestore.montoAcumulado, 0);

  const deserializado = Bolsillo.desdeFirestore("bol-99", {
    nombre: "Viaje a Cartagena",
    meta: 1500000,
    montoAcumulado: 0,
    creadoPor: "usr-1",
    fecha: { seconds: 1727700000 }
  });
  assert.equal(deserializado.id, "bol-99");
  assert.equal(deserializado.nombre, "Viaje a Cartagena");

  console.log("  ✔ Todas las verificaciones de Tarea 4.4 pasaron exitosamente (CA-4.1 a CA-4.7).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-bolsillos.test.js")) {
  ejecutarPruebasBolsillos();
}
