/**
 * @file saldo.js
 * @description Regla de negocio del saldo disponible (CA-4.5) y validación de gastos contra ese saldo.
 * Funciones puras: no tocan Firestore ni el DOM, así se pueden probar en Node.
 *
 * Con HU-18 los montos viajan cifrados y Firestore ya no puede compararlos, por eso esta
 * validación se hace en el cliente con los montos ya descifrados.
 * @module utils/saldo
 */

/**
 * Calcula el saldo disponible: ingresos - gastos - fondos guardados en bolsillos.
 * Es el mismo número que muestra la tarjeta "Saldo disponible" del dashboard.
 *
 * @param {Array<{tipo: string, monto: number}>} transacciones - Movimientos ya descifrados.
 * @param {Array<{montoAcumulado: number}>} bolsillos - Bolsillos ya descifrados.
 * @returns {number} Saldo disponible.
 */
export function calcularSaldoDisponible(transacciones = [], bolsillos = []) {
  let balance = 0;
  for (const t of transacciones) {
    const monto = Number(t?.monto) || 0;
    if (t?.tipo === "INGRESO") balance += monto;
    else if (t?.tipo === "GASTO") balance -= monto;
  }
  const enBolsillos = bolsillos.reduce((total, b) => total + (Number(b?.montoAcumulado) || 0), 0);
  return balance - enBolsillos;
}

/**
 * Impide registrar un gasto mayor al saldo disponible. Los ingresos siempre se permiten.
 *
 * @param {'INGRESO'|'GASTO'} tipo - Tipo del movimiento que se quiere registrar.
 * @param {number} monto - Valor del movimiento (ya convertido a número).
 * @param {number} saldoDisponible - Saldo disponible actual.
 * @throws {Error} Con un mensaje amable si el gasto supera el saldo disponible.
 * @returns {true}
 */
export function validarGastoContraSaldo(tipo, monto, saldoDisponible) {
  if (tipo !== "GASTO") return true;
  const disponible = Math.max(0, Number(saldoDisponible) || 0);
  if (Number(monto) > disponible) {
    throw new Error(
      `Saldo insuficiente: quieres gastar $ ${Number(monto).toLocaleString("es-CO")} y solo tienes ` +
      `$ ${disponible.toLocaleString("es-CO")} disponibles. Registra primero el ingreso o retira fondos de un bolsillo.`
    );
  }
  return true;
}
