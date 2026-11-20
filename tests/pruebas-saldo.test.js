/**
 * @file pruebas-saldo.test.js
 * @description Pruebas de la regla "no gastar más del saldo disponible" (CA-4.3 / CA-4.5).
 * Prueba la función real de src/utils/saldo.js que usa el formulario de transacciones.
 */

import assert from "node:assert/strict";
import { calcularSaldoDisponible, validarGastoContraSaldo } from "../src/utils/saldo.js";

export async function ejecutarPruebasSaldo() {
  const transacciones = [
    { tipo: "INGRESO", monto: 5000000 },
    { tipo: "GASTO", monto: 1000000 }
  ];
  const bolsillos = [{ montoAcumulado: 500000 }];

  // Saldo disponible = 5.000.000 - 1.000.000 - 500.000 = 3.500.000
  const disponible = calcularSaldoDisponible(transacciones, bolsillos);
  assert.equal(disponible, 3500000);
  console.log("  ✓ Saldo disponible descuenta gastos y bolsillos (3.500.000)");

  // El caso reportado: gasto de 7.000.000 con 3.500.000 disponibles debe rechazarse
  assert.throws(() => validarGastoContraSaldo("GASTO", 7000000, disponible), /Saldo insuficiente/);
  console.log("  ✓ Rechaza un gasto de 7.000.000 con 3.500.000 disponibles");

  // Gastar exactamente el disponible sí se permite
  assert.equal(validarGastoContraSaldo("GASTO", 3500000, disponible), true);
  console.log("  ✓ Permite gastar exactamente el saldo disponible");

  // Los ingresos nunca se bloquean
  assert.equal(validarGastoContraSaldo("INGRESO", 9000000, disponible), true);
  console.log("  ✓ Los ingresos no se limitan por el saldo");

  // Con saldo negativo o cero no se puede gastar nada
  assert.throws(() => validarGastoContraSaldo("GASTO", 1, -200), /Saldo insuficiente/);
  assert.throws(() => validarGastoContraSaldo("GASTO", 1, 0), /Saldo insuficiente/);
  console.log("  ✓ Sin saldo disponible no se permite ningún gasto");

  // Listas vacías: saldo 0
  assert.equal(calcularSaldoDisponible(), 0);
  console.log("  ✓ Sin movimientos el saldo disponible es 0");
}
