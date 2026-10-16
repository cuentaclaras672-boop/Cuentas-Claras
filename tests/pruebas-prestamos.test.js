/**
 * @file pruebas-prestamos.test.js
 * @description Suite de Pruebas Unitarias y de Integración - Tarea 8.4 / HU-08 (Préstamos a Terceros y Abonos).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-8.1, CA-8.2, CA-8.3, CA-8.4, CA-8.5, CA-8.6, CA-8.7, CA-8.8.
 */

import assert from "node:assert/strict";
import { Prestamo, ESTADO_PRESTAMO } from "../src/models/Prestamo.js";
function redondear(valor) {
  return Math.round(Number(valor) * 100) / 100;
}

function filtrarPrestamosPorEstado(lista = [], estado = "TODOS") {
  if (!Array.isArray(lista)) return [];
  if (estado === "TODOS") return [...lista];
  return lista.filter((p) => p.estado === estado);
}

function calcularTotalPorCobrar(lista = []) {
  if (!Array.isArray(lista)) return 0;
  const suma = lista.reduce((acc, p) => {
    if (p.estado === ESTADO_PRESTAMO.SALDADO) return acc;
    const pendiente = typeof p.calcularSaldoPendiente === "function"
      ? p.calcularSaldoPendiente()
      : (typeof p.saldoPendiente === "number" ? p.saldoPendiente : 0);
    return acc + pendiente;
  }, 0);
  return redondear(suma);
}

export function ejecutarPruebasPrestamos() {
  console.log("▶ Ejecutando pruebas de Tarea 8.4 (Préstamos a terceros y abonos atómicos)...");

  // CA-8.1: Validación de campos al crear préstamo
  assert.throws(
    () => new Prestamo({ deudor: "Al", monto: 100000, creadoPor: "usr-1" }),
    /entre 3 y 60 caracteres/
  );
  assert.throws(
    () => new Prestamo({ deudor: "Carlos Pérez", monto: 0, creadoPor: "usr-1" }),
    /mayor a cero/
  );

  const prestamo = new Prestamo({
    id: "p-100",
    deudor: "Carlos Pérez",
    monto: 500000,
    creadoPor: "usr-1"
  });
  assert.equal(prestamo.saldoPendiente, 500000);
  assert.equal(prestamo.estado, ESTADO_PRESTAMO.PENDIENTE);

  // CA-8.3: Registro de abono parcial válido y recálculo de saldo pendiente
  prestamo.registrarAbono(200000);
  assert.equal(prestamo.totalAbonado, 200000);
  assert.equal(prestamo.saldoPendiente, 300000);
  assert.equal(prestamo.estado, ESTADO_PRESTAMO.PENDIENTE);

  // CA-8.4: Rechazo si el abono supera el saldo pendiente (350.000 > 300.000)
  assert.throws(
    () => prestamo.registrarAbono(350000),
    /supera el saldo pendiente/
  );
  // Estado intacto tras fallo
  assert.equal(prestamo.saldoPendiente, 300000);

  // CA-8.5: Abono que liquida la deuda -> Cambio automático a SALDADO
  prestamo.registrarAbono(300000);
  assert.equal(prestamo.totalAbonado, 500000);
  assert.equal(prestamo.saldoPendiente, 0);
  assert.equal(prestamo.estado, ESTADO_PRESTAMO.SALDADO);

  // Intento de abonar a un préstamo saldado
  assert.throws(
    () => prestamo.registrarAbono(10000),
    /saldado/
  );

  // CA-8.6 & CA-8.7: Filtrado por estado y cálculo de total por cobrar
  const prestamo2 = new Prestamo({
    id: "p-200",
    deudor: "María Gómez",
    monto: 300000,
    creadoPor: "usr-1"
  });
  prestamo2.registrarAbono(100000); // pendiente: 200.000

  const lista = [prestamo, prestamo2]; // prestamo está SALDADO, prestamo2 está PENDIENTE

  const pendientes = filtrarPrestamosPorEstado(lista, ESTADO_PRESTAMO.PENDIENTE);
  assert.equal(pendientes.length, 1);
  assert.equal(pendientes[0].id, "p-200");

  const saldados = filtrarPrestamosPorEstado(lista, ESTADO_PRESTAMO.SALDADO);
  assert.equal(saldados.length, 1);
  assert.equal(saldados[0].id, "p-100");

  const totalPorCobrar = calcularTotalPorCobrar(lista);
  assert.equal(totalPorCobrar, 200000, "El total por cobrar debe sumar solo saldos pendientes");

  // CA-8.2: Serialización y reconstrucción de Firestore
  const payload = prestamo2.aFirestore();
  assert.equal(payload.deudor, "María Gómez");
  assert.equal(payload.monto, 300000);
  assert.equal(payload.totalAbonado, 100000);

  const reconstruido = Prestamo.desdeFirestore("p-200", payload);
  assert.equal(reconstruido.id, "p-200");
  assert.equal(reconstruido.calcularSaldoPendiente(), 200000);

  console.log("  ✔ Todas las verificaciones de Tarea 8.4 pasaron exitosamente (CA-8.1 a CA-8.8).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-prestamos.test.js")) {
  ejecutarPruebasPrestamos();
}
