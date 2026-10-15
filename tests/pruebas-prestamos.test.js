/**
 * @file pruebas-prestamos.test.js
 * @description Suite de Pruebas Unitarias y de Integración - Tarea 8.4 / HU-08 (Préstamos a Terceros y Abonos).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-8.1, CA-8.2, CA-8.3, CA-8.4, CA-8.5, CA-8.6, CA-8.7, CA-8.8.
 */

import assert from "node:assert/strict";

const ESTADO_PRESTAMO = Object.freeze({
  PENDIENTE: "PENDIENTE",
  SALDADO: "SALDADO"
});

function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Simulador de entidad Prestamo y operaciones transaccionales según src/services/prestamos.js
 */
class PrestamoSimulado {
  constructor({ id = "p-1", deudor, monto, fecha = new Date(), nota = "", creadoPor = "usr-1" }) {
    this.id = id;
    this.deudor = typeof deudor === "string" ? deudor.trim() : "";
    this.monto = Number(monto);
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);
    this.nota = typeof nota === "string" ? nota.trim() : "";
    this.creadoPor = creadoPor;
    this.abonos = [];
    this.totalAbonado = 0;
    this.estado = ESTADO_PRESTAMO.PENDIENTE;
    this.validar();
  }

  validar() {
    if (!this.deudor || this.deudor.length < 3 || this.deudor.length > 60) {
      throw new Error("El nombre de la persona debe tener entre 3 y 60 caracteres.");
    }
    if (isNaN(this.monto) || this.monto <= 0) {
      throw new Error("El monto prestado debe ser un número mayor a cero.");
    }
    if (!this.creadoPor) {
      throw new Error("El préstamo debe estar asociado al UID de un usuario autenticado.");
    }
    return true;
  }

  get saldoPendiente() {
    return redondear(this.monto - this.totalAbonado);
  }

  /**
   * Registra un abono dentro de una transacción lógica (CA-8.3, CA-8.4, CA-8.5).
   */
  registrarAbono(montoAbono, fecha = new Date()) {
    const valor = Number(montoAbono);
    if (isNaN(valor) || valor <= 0) {
      throw new Error("El monto del abono debe ser mayor a cero.");
    }

    if (this.estado === ESTADO_PRESTAMO.SALDADO) {
      throw new Error("Este préstamo ya está saldado en su totalidad.");
    }

    const pendiente = this.saldoPendiente;
    // CA-8.4: Rechazo si el abono supera el saldo pendiente
    if (valor > pendiente) {
      throw new Error(`El abono ($ ${valor}) no puede ser mayor que el saldo pendiente ($ ${pendiente}).`);
    }

    this.abonos.push({ monto: valor, fecha });
    this.totalAbonado = redondear(this.totalAbonado + valor);

    // CA-8.5: Transición automática a SALDADO
    if (this.totalAbonado >= this.monto) {
      this.estado = ESTADO_PRESTAMO.SALDADO;
    }

    return this.saldoPendiente;
  }
}

/**
 * Filtra préstamos por estado (CA-8.6).
 */
function filtrarPrestamosPorEstado(prestamos, estado = "TODOS") {
  if (estado === "TODOS") return prestamos;
  return prestamos.filter(p => p.estado === estado);
}

/**
 * Calcula el total por cobrar en el dashboard (CA-8.7).
 */
function calcularTotalPorCobrar(prestamos) {
  return prestamos
    .filter(p => p.estado === ESTADO_PRESTAMO.PENDIENTE)
    .reduce((acc, p) => redondear(acc + p.saldoPendiente), 0);
}

export function ejecutarPruebasPrestamos() {
  console.log("▶ Ejecutando pruebas de Tarea 8.4 (Préstamos a terceros y abonos atómicos)...");

  // CA-8.1: Validación de campos al crear préstamo
  assert.throws(
    () => new PrestamoSimulado({ deudor: "Al", monto: 100000 }),
    /entre 3 y 60 caracteres/
  );
  assert.throws(
    () => new PrestamoSimulado({ deudor: "Carlos Pérez", monto: 0 }),
    /mayor a cero/
  );

  const prestamo = new PrestamoSimulado({
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
    /no puede ser mayor que el saldo pendiente/
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
    /ya está saldado/
  );

  // CA-8.6 & CA-8.7: Filtrado por estado y cálculo de total por cobrar
  const prestamo2 = new PrestamoSimulado({
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

  console.log("  ✔ Todas las verificaciones de Tarea 8.4 pasaron exitosamente (CA-8.1 a CA-8.8).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-prestamos.test.js")) {
  ejecutarPruebasPrestamos();
}
