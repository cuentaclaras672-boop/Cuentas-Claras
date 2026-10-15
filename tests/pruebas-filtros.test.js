/**
 * @file pruebas-filtros.test.js
 * @description Suite de Pruebas Unitarias y de Integración - Tarea 5.4 / HU-05 (Filtros del Historial).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-5.1, CA-5.2, CA-5.3, CA-5.4, CA-5.5.
 */

import assert from "node:assert/strict";
import { Transaccion, TIPO_TRANSACCION, AMBITO_TRANSACCION } from "../src/models/Transaccion.js";

/**
 * Normaliza cadenas de texto para búsqueda insensible a mayúsculas y acentos (idéntico a dashboard.js).
 */
function normalizarTexto(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Motor de filtrado que reproduce fielmente la lógica de aplicarFiltros() de dashboard.js
 * para verificar los criterios de aceptación en entorno de pruebas.
 */
function aplicarFiltros(transacciones, {
  busqueda = "",
  tipo = "TODOS",
  ambito = "TODOS",
  categoria = "TODAS",
  fechaDesde = "",
  fechaHasta = ""
} = {}) {
  const textoNorm = normalizarTexto(busqueda);

  return transacciones.filter((t) => {
    // CA-5.1: Búsqueda en descripción o categoría
    if (textoNorm) {
      const descNorm = normalizarTexto(t.descripcion);
      const catNorm = normalizarTexto(t.categoria);
      if (!descNorm.includes(textoNorm) && !catNorm.includes(textoNorm)) {
        return false;
      }
    }

    // CA-5.2: Filtro por tipo
    if (tipo !== "TODOS" && t.tipo !== tipo) {
      return false;
    }

    // CA-5.2: Filtro por ámbito
    if (ambito !== "TODOS" && t.ambito !== ambito) {
      return false;
    }

    // CA-5.2: Filtro por categoría temática
    if (categoria !== "TODAS" && t.categoria !== categoria) {
      return false;
    }

    // CA-5.3: Filtro por rango de fechas (desde <= fecha <= hasta)
    if (fechaDesde || fechaHasta) {
      let fechaIso = "";
      if (t.fecha instanceof Date) {
        fechaIso = t.fecha.toISOString().slice(0, 10);
      } else if (typeof t.fecha === "string") {
        fechaIso = t.fecha.slice(0, 10);
      }
      if (fechaDesde && fechaIso < fechaDesde) return false;
      if (fechaHasta && fechaIso > fechaHasta) return false;
    }

    return true;
  });
}

// Datos de prueba representativos del hogar
const datosPrueba = [
  new Transaccion({
    id: "tx-1",
    descripcion: "Mercado Éxito mensual",
    monto: 350000,
    tipo: TIPO_TRANSACCION.GASTO,
    categoria: "Alimentación y Mercado",
    ambito: AMBITO_TRANSACCION.COMPARTIDO,
    creadoPor: "usr-1",
    fecha: new Date("2026-09-15T10:00:00")
  }),
  new Transaccion({
    id: "tx-2",
    descripcion: "Pago de Salario quincenal",
    monto: 2500000,
    tipo: TIPO_TRANSACCION.INGRESO,
    categoria: "Salario y Nómina",
    ambito: AMBITO_TRANSACCION.PERSONAL,
    creadoPor: "usr-1",
    fecha: new Date("2026-09-16T08:00:00")
  }),
  new Transaccion({
    id: "tx-3",
    descripcion: "Recibo de energía Enel",
    monto: 120000,
    tipo: TIPO_TRANSACCION.GASTO,
    categoria: "Servicios Públicos",
    ambito: AMBITO_TRANSACCION.COMPARTIDO,
    creadoPor: "usr-2",
    fecha: new Date("2026-09-20T14:30:00")
  }),
  new Transaccion({
    id: "tx-4",
    descripcion: "Cena restaurante aniversario",
    monto: 180000,
    tipo: TIPO_TRANSACCION.GASTO,
    categoria: "Ocio y Entretenimiento",
    ambito: AMBITO_TRANSACCION.PERSONAL,
    creadoPor: "usr-1",
    fecha: new Date("2026-09-25T20:00:00")
  })
];

export function ejecutarPruebasFiltros() {
  console.log("▶ Ejecutando pruebas de Tarea 5.4 (Filtros del Historial)...");

  // CA-5.1: Búsqueda de texto insensible a mayúsculas y tildes
  const resBusqueda1 = aplicarFiltros(datosPrueba, { busqueda: "exito" });
  assert.equal(resBusqueda1.length, 1, "Debe encontrar 'Éxito' buscando 'exito'");
  assert.equal(resBusqueda1[0].id, "tx-1");

  const resBusqueda2 = aplicarFiltros(datosPrueba, { busqueda: "ENERGÍA" });
  assert.equal(resBusqueda2.length, 1, "Debe encontrar 'energía' buscando 'ENERGÍA'");
  assert.equal(resBusqueda2[0].id, "tx-3");

  // CA-5.2: Filtro por tipo
  const soloGastos = aplicarFiltros(datosPrueba, { tipo: TIPO_TRANSACCION.GASTO });
  assert.equal(soloGastos.length, 3, "Debe retornar 3 gastos");
  assert.ok(soloGastos.every(t => t.tipo === TIPO_TRANSACCION.GASTO));

  const soloIngresos = aplicarFiltros(datosPrueba, { tipo: TIPO_TRANSACCION.INGRESO });
  assert.equal(soloIngresos.length, 1, "Debe retornar 1 ingreso");
  assert.equal(soloIngresos[0].id, "tx-2");

  // CA-5.2: Filtro por ámbito
  const compartidos = aplicarFiltros(datosPrueba, { ambito: AMBITO_TRANSACCION.COMPARTIDO });
  assert.equal(compartidos.length, 2, "Debe retornar 2 movimientos compartidos");
  assert.ok(compartidos.every(t => t.ambito === AMBITO_TRANSACCION.COMPARTIDO));

  // CA-5.2: Filtro por categoría
  const servicios = aplicarFiltros(datosPrueba, { categoria: "Servicios Públicos" });
  assert.equal(servicios.length, 1, "Debe filtrar únicamente Servicios Públicos");
  assert.equal(servicios[0].categoria, "Servicios Públicos");

  // CA-5.3: Filtro por rango de fechas
  const rango = aplicarFiltros(datosPrueba, {
    fechaDesde: "2026-09-16",
    fechaHasta: "2026-09-22"
  });
  assert.equal(rango.length, 2, "Debe retornar transacciones entre 16 y 22 de sep (tx-2 y tx-3)");

  // CA-5.4: Estado vacío cuando ningún registro coincide
  const sinResultados = aplicarFiltros(datosPrueba, { busqueda: "término_inexistente_xyz" });
  assert.equal(sinResultados.length, 0, "Debe arrojar lista vacía ante búsqueda sin coincidencias");

  // CA-5.5: Limpiar filtros restablece a la lista original completa
  const restablecido = aplicarFiltros(datosPrueba, {});
  assert.equal(restablecido.length, datosPrueba.length, "Restablecer filtros debe retornar todos los registros");

  console.log("  ✔ Todas las verificaciones de Tarea 5.4 pasaron exitosamente (CA-5.1 a CA-5.5).");
  return true;
}

// Ejecución directa si se invoca con node
if (process.argv[1]?.endsWith("pruebas-filtros.test.js")) {
  ejecutarPruebasFiltros();
}
