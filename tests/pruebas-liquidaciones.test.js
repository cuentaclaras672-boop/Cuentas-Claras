/**
 * @file pruebas-liquidaciones.test.js
 * @description Suite de Pruebas Unitarias y de Integración - Tarea 11.4 / HU-11 (Cuadre de Cuentas y Liquidación Mensual) y Tarea 13.1 (Integridad de Descripción).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-11.1 a CA-11.6 (Condición Técnica #1 y #2) y CA-13.1.
 */

import assert from "node:assert/strict";
import { calcularCuadreMes } from "../src/utils/cuadre.js";
import { Transaccion, MAX_DESCRIPCION } from "../src/models/Transaccion.js";
import { MAX_MIEMBROS_HOGAR } from "../src/models/Hogar.js";

/** Formato del periodo liquidado. */
const PATRON_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;
const PATRON_HOGAR = /^[A-Z0-9]{6}$/;
const MAX_TRANSFERENCIAS = MAX_MIEMBROS_HOGAR - 1;

function periodoDe(fecha = new Date()) {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}`;
}

function rangoDelPeriodo(periodo) {
  if (typeof periodo !== "string" || !PATRON_PERIODO.test(periodo)) {
    throw new Error("El periodo debe tener el formato AAAA-MM.");
  }
  const [anio, mes] = periodo.split("-").map(Number);
  return { inicio: new Date(anio, mes - 1, 1), fin: new Date(anio, mes, 1) };
}

function idLiquidacion(hogarId, periodo) {
  if (typeof hogarId !== "string" || !PATRON_HOGAR.test(hogarId)) {
    throw new Error("Identificador de hogar inválido.");
  }
  rangoDelPeriodo(periodo);
  return `${hogarId}_${periodo}`;
}

function validarTransferencias(transferencias, miembros) {
  if (!Array.isArray(transferencias)) {
    throw new TypeError("Las transferencias deben ser una lista.");
  }
  if (transferencias.length > MAX_TRANSFERENCIAS) {
    throw new Error(`Un cuadre no puede tener más de ${MAX_TRANSFERENCIAS} transferencias.`);
  }

  return transferencias.map((t) => {
    const monto = Math.round(Number(t?.monto) * 100) / 100;
    if (!t || !miembros.includes(t.de) || !miembros.includes(t.para)) {
      throw new Error("Cada transferencia debe ser entre dos miembros del hogar.");
    }
    if (t.de === t.para) {
      throw new Error("Una transferencia no puede ser de un miembro a sí mismo.");
    }
    if (!Number.isFinite(monto) || monto <= 0) {
      throw new Error("El monto de cada transferencia debe ser mayor a 0.");
    }
    return { de: t.de, para: t.para, monto };
  });
}

export function ejecutarPruebasLiquidaciones() {
  console.log("▶ Ejecutando pruebas de Tarea 11.4 (Cuadre de cuentas, liquidaciones y control de descripción)...");

  // 1. Tarea 11.1 (CA-11.1, CA-11.2): Cálculo de cuadre entre dos convivientes (Caso Pareja)
  const miembrosPareja = ["usr-ana", "usr-carlos"];
  const gastosPareja = [
    { creadoPor: "usr-ana", monto: 300000 },
    { creadoPor: "usr-ana", monto: 100000 }, // Ana pagó 400.000
    { creadoPor: "usr-carlos", monto: 100000 } // Carlos pagó 100.000
  ];

  const resultadoPareja = calcularCuadreMes(gastosPareja, miembrosPareja);
  assert.equal(resultadoPareja.totalGastos, 500000, "El total de gastos debe ser 500.000");
  assert.equal(resultadoPareja.cuotaPorMiembro, 250000, "La cuota equitativa por miembro debe ser 250.000");
  assert.equal(resultadoPareja.balances["usr-ana"], 150000, "A Ana le deben 150.000");
  assert.equal(resultadoPareja.balances["usr-carlos"], -150000, "Carlos debe 150.000");
  assert.equal(resultadoPareja.transferencias.length, 1, "Debe existir exactamente 1 transferencia");
  assert.deepEqual(resultadoPareja.transferencias[0], {
    de: "usr-carlos",
    para: "usr-ana",
    monto: 150000
  });

  // 2. Tarea 11.1: Caso equitativo (ambos aportaron exactamente lo mismo)
  const gastosEquitativos = [
    { creadoPor: "usr-ana", monto: 200000 },
    { creadoPor: "usr-carlos", monto: 200000 }
  ];
  const resultadoEquitativo = calcularCuadreMes(gastosEquitativos, miembrosPareja);
  assert.equal(resultadoEquitativo.transferencias.length, 0, "No debe haber transferencias si los aportes fueron iguales");

  // 3. Tarea 11.1: Caso con 3 convivientes (Roommates) y verificación de transferencias mínimas (<= N - 1)
  const miembrosRoomies = ["usr-1", "usr-2", "usr-3"];
  const gastosRoomies = [
    { creadoPor: "usr-1", monto: 900000 }, // Total 900.000, cuota 300.000
    { creadoPor: "usr-2", monto: 0 },
    { creadoPor: "usr-3", monto: 0 }
  ];
  const resultadoRoomies = calcularCuadreMes(gastosRoomies, miembrosRoomies);
  assert.equal(resultadoRoomies.cuotaPorMiembro, 300000);
  assert.ok(resultadoRoomies.transferencias.length <= 2, "Con 3 miembros el número de transferencias no supera 2");
  const totalTransferido = resultadoRoomies.transferencias.reduce((sum, t) => sum + t.monto, 0);
  assert.equal(totalTransferido, 600000, "El total compensado debe saldar exactamente la diferencia");

  // 4. Tarea 11.2 (CA-11.3): Validación de periodos y códigos de liquidación
  assert.equal(periodoDe(new Date(2026, 9, 15)), "2026-10");
  const rangoOct = rangoDelPeriodo("2026-10");
  assert.equal(rangoOct.inicio.getFullYear(), 2026);
  assert.equal(rangoOct.inicio.getMonth(), 9); // Octubre (mes 9 en 0-indexed)
  assert.equal(rangoOct.fin.getMonth(), 10); // Noviembre (excluido)
  assert.throws(() => rangoDelPeriodo("2026-13"), /formato AAAA-MM/);
  assert.throws(() => rangoDelPeriodo("2026"), /formato AAAA-MM/);

  const id = idLiquidacion("HOG123", "2026-10");
  assert.equal(id, "HOG123_2026-10");
  assert.throws(() => idLiquidacion("invalido", "2026-10"), /Identificador de hogar inválido/);

  // 5. Tarea 11.2 (CA-11.5, CA-11.6): Validación estricta de transferencias antes de persistir
  assert.throws(
    () => validarTransferencias([{ de: "usr-ana", para: "usr-ana", monto: 50000 }], miembrosPareja),
    /de un miembro a sí mismo/
  );
  assert.throws(
    () => validarTransferencias([{ de: "usr-ana", para: "usr-ajeno", monto: 50000 }], miembrosPareja),
    /entre dos miembros del hogar/
  );
  assert.throws(
    () => validarTransferencias([{ de: "usr-carlos", para: "usr-ana", monto: -100 }], miembrosPareja),
    /mayor a 0/
  );
  const transferenciasValidas = validarTransferencias(
    [{ de: "usr-carlos", para: "usr-ana", monto: 150000 }],
    miembrosPareja
  );
  assert.equal(transferenciasValidas[0].monto, 150000);

  // 6. Tarea 13.1 (CA-13.1): Validación de límite estricto de descripción en Transaccion
  assert.equal(MAX_DESCRIPCION, 120, "El límite máximo de descripción debe ser 120 caracteres");
  const descripcionValida = "A".repeat(120);
  const descripcionLarga = "A".repeat(121);

  assert.doesNotThrow(() => new Transaccion({
    descripcion: descripcionValida,
    monto: 50000,
    tipo: "GASTO",
    categoria: "Alimentación y Mercado",
    creadoPor: "usr-ana"
  }));

  assert.throws(() => new Transaccion({
    descripcion: descripcionLarga,
    monto: 50000,
    tipo: "GASTO",
    categoria: "Alimentación y Mercado",
    creadoPor: "usr-ana"
  }), /no puede superar los 120 caracteres/);

  console.log("  ✔ Todas las verificaciones de Tarea 11.4 y Tarea 13.1 pasaron exitosamente.");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-liquidaciones.test.js")) {
  ejecutarPruebasLiquidaciones();
}
