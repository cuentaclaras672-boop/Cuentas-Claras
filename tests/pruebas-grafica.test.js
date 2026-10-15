/**
 * @file pruebas-grafica.test.js
 * @description Suite de Pruebas Unitarias y de Integración - Tarea 10.3 / HU-10 (Gráfica de Gastos por Categoría).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-10.1, CA-10.2, CA-10.3, CA-10.4, CA-10.5.
 */

import assert from "node:assert/strict";
import { agruparGastosPorCategoria } from "../src/utils/estadisticas.js";
import { escaparHTML, formatearMoneda } from "../src/utils/formateo.js";

/**
 * Simulación del renderizado de barras de la gráfica según src/ui/dashboard.js
 */
function simularRenderizadoGrafica(transaccionesFiltradas, { divisa = "COP", tasaTRM = 3329.61 } = {}) {
  const { totalGastos, categorias } = agruparGastosPorCategoria(transaccionesFiltradas);

  // CA-10.4: Si no hay gastos con los filtros elegidos, muestra mensaje de estado vacío
  if (totalGastos === 0 || categorias.length === 0) {
    return {
      estadoVacio: true,
      mensaje: "No hay gastos para mostrar con los filtros elegidos.",
      barras: []
    };
  }

  // CA-10.1, CA-10.3, CA-10.5: Renderizado de barras
  const factorConversion = divisa === "USD" ? tasaTRM : 1;
  const decimales = divisa === "USD" ? 2 : 0;

  const barras = categorias.map((cat) => {
    const totalConvertido = Math.round((cat.total / factorConversion) * 100) / 100;
    return {
      categoriaSegura: escaparHTML(cat.categoria),
      total: totalConvertido,
      totalFormateado: formatearMoneda(totalConvertido, divisa, decimales),
      porcentaje: cat.porcentaje
    };
  });

  return {
    estadoVacio: false,
    totalGastos: Math.round((totalGastos / factorConversion) * 100) / 100,
    barras
  };
}

export function ejecutarPruebasGrafica() {
  console.log("▶ Ejecutando pruebas de Tarea 10.3 (Gráfica de gastos, filtros y divisas)...");

  const transacciones = [
    { id: "1", tipo: "GASTO", categoria: "Vivienda y Alquiler", monto: 1200000, ambito: "COMPARTIDO" },
    { id: "2", tipo: "GASTO", categoria: "Alimentación y Mercado", monto: 600000, ambito: "COMPARTIDO" },
    { id: "3", tipo: "INGRESO", categoria: "Salario", monto: 4000000, ambito: "PERSONAL" }, // Debe ignorarse
    { id: "4", tipo: "GASTO", categoria: "Servicios Públicos", monto: 200000, ambito: "COMPARTIDO" }
  ];

  // CA-10.1: Agrupación pura, suma total e ignorado de ingresos
  const resultado = agruparGastosPorCategoria(transacciones);
  assert.equal(resultado.totalGastos, 2000000, "El total de gastos debe ser 1.2M + 600k + 200k = 2M (ingreso ignorado)");
  assert.equal(resultado.categorias.length, 3, "Debe haber 3 categorías de gasto");

  // CA-10.1: Ordenamiento estrictamente decreciente
  assert.equal(resultado.categorias[0].categoria, "Vivienda y Alquiler");
  assert.equal(resultado.categorias[0].total, 1200000);
  assert.equal(resultado.categorias[0].porcentaje, 60.0);

  assert.equal(resultado.categorias[1].categoria, "Alimentación y Mercado");
  assert.equal(resultado.categorias[1].total, 600000);
  assert.equal(resultado.categorias[1].porcentaje, 30.0);

  assert.equal(resultado.categorias[2].categoria, "Servicios Públicos");
  assert.equal(resultado.categorias[2].total, 200000);
  assert.equal(resultado.categorias[2].porcentaje, 10.0);

  // La suma de los porcentajes debe ser 100%
  const sumaPorcentajes = resultado.categorias.reduce((acc, c) => acc + c.porcentaje, 0);
  assert.equal(sumaPorcentajes, 100.0);

  // CA-10.3: Conmutación COP / USD
  const tasaTRM = 3329.61;
  const renderUSD = simularRenderizadoGrafica(transacciones, { divisa: "USD", tasaTRM });
  assert.equal(renderUSD.estadoVacio, false);
  const totalEsperadoUSD = Math.round((2000000 / tasaTRM) * 100) / 100;
  assert.equal(renderUSD.totalGastos, totalEsperadoUSD);
  assert.ok(renderUSD.barras[0].totalFormateado.includes("USD") || renderUSD.barras[0].totalFormateado.includes("$"));

  // CA-10.4: Estado vacío cuando solo hay ingresos o no hay movimientos
  const soloIngresos = [{ id: "1", tipo: "INGRESO", categoria: "Salario", monto: 1500000 }];
  const renderVacio = simularRenderizadoGrafica(soloIngresos);
  assert.equal(renderVacio.estadoVacio, true);
  assert.ok(renderVacio.mensaje.includes("No hay gastos para mostrar"));
  assert.equal(renderVacio.barras.length, 0);

  // CA-10.5: Sanitización XSS en categorías
  const gastoMalicioso = [{ id: "9", tipo: "GASTO", categoria: "<img src=x onerror=alert(1)> Salud", monto: 50000 }];
  const renderXSS = simularRenderizadoGrafica(gastoMalicioso);
  assert.ok(!renderXSS.barras[0].categoriaSegura.includes("<img"));
  assert.ok(renderXSS.barras[0].categoriaSegura.includes("&lt;img"));

  console.log("  ✔ Todas las verificaciones de Tarea 10.3 pasaron exitosamente (CA-10.1 a CA-10.5).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-grafica.test.js")) {
  ejecutarPruebasGrafica();
}
