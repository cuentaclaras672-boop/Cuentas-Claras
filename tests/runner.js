/**
 * @file runner.js
 * @description Suite Maestra y Ejecutor de Pruebas Automatizadas de Calidad (QA).
 * Permite certificar el 100% de los criterios de aceptación de los Sprints 2 y 3.
 * Responsable: Fabián Córdoba <cuentaclaras672@gmail.com> (Scrum Master / QA Lead).
 * 
 * Uso:
 *   node tests/runner.js
 */

import { ejecutarPruebasFiltros } from "./pruebas-filtros.test.js";
import { ejecutarPruebasIndicadores } from "./pruebas-indicadores.test.js";
import { ejecutarPruebasConexion } from "./pruebas-conexion.test.js";
import { ejecutarPruebasBolsillos } from "./pruebas-bolsillos.test.js";
import { ejecutarPruebasPrestamos } from "./pruebas-prestamos.test.js";
import { ejecutarPruebasHogares } from "./pruebas-hogares.test.js";
import { ejecutarPruebasGrafica } from "./pruebas-grafica.test.js";

async function ejecutarTodasLasPruebas() {
  console.log("===============================================================");
  console.log("       CUENTAS CLARAS — SUITE INTEGRAL DE PRUEBAS QA");
  console.log("       Responsable: Fabián Córdoba (Scrum Master / QA)");
  console.log("===============================================================\n");

  const suites = [
    { nombre: "Sprint 2 - Tarea 5.4: Filtros del Historial (HU-05)", fn: ejecutarPruebasFiltros },
    { nombre: "Sprint 2 - Tarea 6.4: API TRM, Fallback y Divisas (HU-06)", fn: ejecutarPruebasIndicadores },
    { nombre: "Sprint 2 - Tarea 7.4: Conexión Offline y Validación (HU-07)", fn: ejecutarPruebasConexion },
    { nombre: "Sprint 2 - Tarea 4.4: Bolsillos y Saldo Disponible (HU-04)", fn: ejecutarPruebasBolsillos },
    { nombre: "Sprint 3 - Tarea 8.4: Préstamos a Terceros y Abonos (HU-08)", fn: ejecutarPruebasPrestamos },
    { nombre: "Sprint 3 - Tarea 9.4: Hogar Compartido y Aislamiento (HU-09)", fn: ejecutarPruebasHogares },
    { nombre: "Sprint 3 - Tarea 10.3: Gráfica de Gastos y Divisa (HU-10)", fn: ejecutarPruebasGrafica }
  ];

  let exitosas = 0;
  let fallidas = 0;

  for (const suite of suites) {
    try {
      await suite.fn();
      exitosas++;
      console.log(`[PASS] ${suite.nombre}\n`);
    } catch (error) {
      fallidas++;
      console.error(`[FAIL] ${suite.nombre}`);
      console.error(error);
      console.log("");
    }
  }

  console.log("===============================================================");
  console.log(` RESUMEN DE EJECUCIÓN QA:`);
  console.log(` Total Suites:    ${suites.length}`);
  console.log(` Aprobadas:       ${exitosas}`);
  console.log(` Fallidas:        ${fallidas}`);
  console.log(` Tasa de Éxito:   ${Math.round((exitosas / suites.length) * 100)}%`);
  console.log("===============================================================");

  if (fallidas > 0) {
    process.exit(1);
  }
}

ejecutarTodasLasPruebas();
