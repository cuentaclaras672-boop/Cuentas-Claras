/**
 * @file cuadre.js
 * @description Capa Transversal / Utilidades - Cálculo matemático de cuadre y liquidación de gastos del hogar (Tarea 11.1 / HU-11).
 * Función pura sin efectos secundarios ni llamadas a red que calcula el saldo equitativo y las transferencias
 * mínimas necesarias para saldar las cuentas entre convivientes ("¿Quién le debe a quién?").
 * @module utils/cuadre
 */

/**
 * Redondea un valor numérico a dos decimales (centavos).
 * @param {number} valor - Número a redondear.
 * @returns {number} Valor redondeado a 2 decimales.
 */
function redondear(valor) {
  return Math.round(Number(valor) * 100) / 100;
}

/**
 * Calcula el cuadre mensual de gastos compartidos entre convivientes de un hogar (HU-11).
 * Determina el total gastado, la cuota equitativa por miembro, el balance neto de cada uno
 * y el conjunto óptimo de transferencias mínimas (a lo sumo N - 1 transferencias para N miembros).
 *
 * @param {Array<{ creadoPor: string, monto: number }>} gastosCompartidos - Lista de gastos del periodo.
 * @param {string[]} miembros - Lista de UIDs de los convivientes del hogar.
 * @returns {{
 *   totalGastos: number,
 *   cuotaPorMiembro: number,
 *   pagadoPor: Record<string, number>,
 *   balances: Record<string, number>,
 *   transferencias: Array<{ de: string, para: string, monto: number }>
 * }}
 */
export function calcularCuadreMes(gastosCompartidos = [], miembros = []) {
  if (!Array.isArray(miembros) || miembros.length === 0) {
    return {
      totalGastos: 0,
      cuotaPorMiembro: 0,
      pagadoPor: {},
      balances: {},
      transferencias: []
    };
  }

  // 1. Inicializar totales aportados por cada conviviente miembro
  const pagadoPor = {};
  for (const uid of miembros) {
    pagadoPor[uid] = 0;
  }

  let totalGastos = 0;
  for (const gasto of gastosCompartidos) {
    const monto = Number(gasto?.monto) || 0;
    const autor = gasto?.creadoPor;
    if (monto > 0 && autor && miembros.includes(autor)) {
      pagadoPor[autor] = redondear(pagadoPor[autor] + monto);
      totalGastos = redondear(totalGastos + monto);
    }
  }

  // 2. Cuota equitativa individual (gasto medio)
  const cuotaPorMiembro = redondear(totalGastos / miembros.length);

  // 3. Balance individual: positivo = acreedor (le deben), negativo = deudor (debe)
  const balances = {};
  const deudores = [];
  const acreedores = [];

  for (const uid of miembros) {
    const bal = redondear(pagadoPor[uid] - cuotaPorMiembro);
    balances[uid] = bal;

    if (bal < -0.01) {
      deudores.push({ uid, balance: bal });
    } else if (bal > 0.01) {
      acreedores.push({ uid, balance: bal });
    }
  }

  // 4. Algoritmo codicioso (Greedy) para minimizar el número de transferencias
  // Ordenar deudores de mayor a menor deuda y acreedores de mayor a menor crédito
  deudores.sort((a, b) => a.balance - b.balance);
  acreedores.sort((a, b) => b.balance - a.balance);

  const transferencias = [];

  let idxDeudor = 0;
  let idxAcreedor = 0;

  while (idxDeudor < deudores.length && idxAcreedor < acreedores.length) {
    const deudor = deudores[idxDeudor];
    const acreedor = acreedores[idxAcreedor];

    const debe = Math.abs(deudor.balance);
    const leDeben = acreedor.balance;

    const montoTransferencia = redondear(Math.min(debe, leDeben));

    if (montoTransferencia > 0) {
      transferencias.push({
        de: deudor.uid,
        para: acreedor.uid,
        monto: montoTransferencia
      });
    }

    deudor.balance = redondear(deudor.balance + montoTransferencia);
    acreedor.balance = redondear(acreedor.balance - montoTransferencia);

    if (Math.abs(deudor.balance) < 0.01) {
      idxDeudor++;
    }
    if (Math.abs(acreedor.balance) < 0.01) {
      idxAcreedor++;
    }
  }

  return {
    totalGastos,
    cuotaPorMiembro,
    pagadoPor,
    balances,
    transferencias
  };
}
