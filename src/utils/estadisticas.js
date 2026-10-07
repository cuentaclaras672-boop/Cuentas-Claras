/**
 * @file estadisticas.js
 * @description Funciones puras de agregación sobre las transacciones (Tarea 10.1 / HU-10).
 * No tocan el DOM ni Firestore: reciben una lista y devuelven datos listos para pintar.
 * @module utils/estadisticas
 */

/**
 * Agrupa los gastos por categoría y calcula cuánto representa cada una sobre el total de gastos.
 * Los ingresos se ignoran. El resultado sale ordenado de mayor a menor gasto (CA-10.1).
 *
 * @param {Array<{tipo: string, categoria: string, monto: number}>} [transacciones=[]] - Movimientos a agrupar.
 * @returns {{ totalGastos: number, categorias: Array<{ categoria: string, total: number, porcentaje: number }> }}
 *   Total de gastos y una entrada por categoría con su porcentaje (0 a 100, con un decimal).
 */
export function agruparGastosPorCategoria(transacciones = []) {
  const totalesPorCategoria = new Map();
  let totalGastos = 0;

  for (const t of transacciones) {
    if (t.tipo !== "GASTO") continue;
    totalesPorCategoria.set(t.categoria, (totalesPorCategoria.get(t.categoria) || 0) + t.monto);
    totalGastos += t.monto;
  }

  const categorias = [...totalesPorCategoria.entries()]
    .map(([categoria, total]) => ({
      categoria,
      total,
      porcentaje: totalGastos > 0 ? Math.round((total / totalGastos) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.total - a.total);

  return { totalGastos, categorias };
}
