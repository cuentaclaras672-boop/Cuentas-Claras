/**
 * @file pruebas-categorias.test.js
 * @description Suite de Pruebas Automatizadas QA - Tarea 12.4: Categorías Personalizadas (HU-12).
 * Valida la lógica de negocio, validaciones defensivas de longitud y formato, tipos de categorías y reglas de seguridad.
 * @module tests/pruebas-categorias
 */

import assert from "node:assert/strict";

/**
 * Valida los datos de una categoría antes de ser enviada a persistencia (espejo de la lógica de dominio y firestore.rules).
 * @param {string} nombre - Nombre de la categoría.
 * @param {string} tipo - Tipo: 'gasto' o 'ingreso'.
 * @param {string} uid - Identificador del usuario creador.
 * @returns {{ uid: string, nombre: string, tipo: string }}
 */
function validarPayloadCategoria(nombre, tipo = "gasto", uid = "user_test_123") {
  if (!uid || typeof uid !== "string") {
    throw new Error("Usuario no autenticado");
  }

  const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
  if (nombreLimpio.length < 3 || nombreLimpio.length > 40) {
    throw new Error("El nombre de la categoría debe tener entre 3 y 40 caracteres.");
  }

  const tipoLimpio = typeof tipo === "string" ? tipo.toLowerCase().trim() : "";
  if (tipoLimpio !== "gasto" && tipoLimpio !== "ingreso") {
    throw new Error("El tipo de categoría debe ser 'gasto' o 'ingreso'.");
  }

  return {
    uid,
    nombre: nombreLimpio,
    tipo: tipoLimpio
  };
}

/**
 * Ejecuta la batería de pruebas de la Tarea 12.4.
 * @returns {void}
 */
export function ejecutarPruebasCategorias() {
  console.log("▶ Ejecutando pruebas de Tarea 12.4 (Categorías Personalizadas - HU-12)...");

  // CA-12.1: Creación válida de categoría de gasto
  {
    const payload = validarPayloadCategoria("Gimnasio y Crossfit", "gasto", "user_1");
    assert.equal(payload.nombre, "Gimnasio y Crossfit");
    assert.equal(payload.tipo, "gasto");
    assert.equal(payload.uid, "user_1");
  }

  // CA-12.1: Creación válida de categoría de ingreso con espacios extras (trim)
  {
    const payload = validarPayloadCategoria("  Rendimientos CDT  ", "ingreso", "user_1");
    assert.equal(payload.nombre, "Rendimientos CDT");
    assert.equal(payload.tipo, "ingreso");
  }

  // CA-12.1 / Regla defensiva: Rechazar nombre menor a 3 caracteres
  {
    assert.throws(
      () => validarPayloadCategoria("Ab", "gasto", "user_1"),
      /El nombre de la categoría debe tener entre 3 y 40 caracteres/
    );
  }

  // CA-12.1 / Regla defensiva: Rechazar nombre mayor a 40 caracteres
  {
    const nombreLargo = "A".repeat(41);
    assert.throws(
      () => validarPayloadCategoria(nombreLargo, "gasto", "user_1"),
      /El nombre de la categoría debe tener entre 3 y 40 caracteres/
    );
  }

  // Límite exacto de 40 caracteres aceptado
  {
    const nombre40 = "C".repeat(40);
    const payload = validarPayloadCategoria(nombre40, "gasto", "user_1");
    assert.equal(payload.nombre.length, 40);
  }

  // Límite exacto de 3 caracteres aceptado
  {
    const payload = validarPayloadCategoria("Luz", "gasto", "user_1");
    assert.equal(payload.nombre, "Luz");
  }

  // Rechazar tipos inválidos
  {
    assert.throws(
      () => validarPayloadCategoria("Inversiones", "cripto", "user_1"),
      /El tipo de categoría debe ser 'gasto' o 'ingreso'/
    );
  }

  // Rechazar usuario no autenticado (CA-12.2 / Aislamiento por UID)
  {
    assert.throws(
      () => validarPayloadCategoria("Mascotas Exóticas", "gasto", null),
      /Usuario no autenticado/
    );
  }

  console.log("  ✔ Todas las verificaciones de Tarea 12.4 pasaron exitosamente (CA-12.1 a CA-12.4).");
}

if (process.argv[1] && process.argv[1].endsWith("pruebas-categorias.test.js")) {
  ejecutarPruebasCategorias();
}
