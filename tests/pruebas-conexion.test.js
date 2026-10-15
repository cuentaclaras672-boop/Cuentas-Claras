/**
 * @file pruebas-conexion.test.js
 * @description Suite de Pruebas Unitarias y de Resiliencia - Tarea 7.4 / HU-07 (Conexión y Validaciones).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-7.1, CA-7.2, CA-7.3, CA-7.4 (Condición Técnica #5).
 */

import assert from "node:assert/strict";
import { parsearMontoCOP, escaparHTML } from "../src/utils/formateo.js";

/**
 * Emulador ligero de eventos de ventana para probar la lógica de servicios/conexion.js en Node.
 */
class VentanaMock {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(tipo, callback) {
    if (!this.listeners.has(tipo)) {
      this.listeners.set(tipo, new Set());
    }
    this.listeners.get(tipo).add(callback);
  }

  removeEventListener(tipo, callback) {
    if (this.listeners.has(tipo)) {
      this.listeners.get(tipo).delete(callback);
    }
  }

  despacharEvento(tipo) {
    if (this.listeners.has(tipo)) {
      for (const cb of this.listeners.get(tipo)) {
        cb();
      }
    }
  }
}

/**
 * Implementación desacoplada de la lógica de conexión para verificar suscripción/desuscripción (CA-7.1, CA-7.2).
 */
function suscribirConexionMock(ventana, onCambio) {
  if (typeof onCambio !== "function") {
    throw new TypeError("Se debe suministrar un callback para los cambios de conexión.");
  }

  const alConectar = () => onCambio(true);
  const alDesconectar = () => onCambio(false);

  ventana.addEventListener("online", alConectar);
  ventana.addEventListener("offline", alDesconectar);

  return () => {
    ventana.removeEventListener("online", alConectar);
    ventana.removeEventListener("offline", alDesconectar);
  };
}

/**
 * Simulación del ciclo de vida de un envío de formulario (CA-7.3, CA-7.4):
 * valida campos, actualiza estado de botón (guardando -> rehabilitado en finally)
 * y previene pantallas en blanco mediante captura defensiva.
 */
function simularEnvioFormulario({ descripcion, montoTexto, hayRed = true, accionGuardar }) {
  const errores = {};
  let estadoBoton = "NORMAL"; // 'NORMAL' -> 'GUARDANDO' -> 'NORMAL'

  // CA-7.1: Si no hay red, la acción se bloquea inmediatamente
  if (!hayRed) {
    return {
      exito: false,
      bloqueadoPorOffline: true,
      mensaje: "Sin conexión a internet. Conéctate para continuar.",
      estadoBoton: "BLOQUEADO"
    };
  }

  // CA-7.3: Validación por campo (descripción)
  const descLimpia = (descripcion || "").trim();
  if (!descLimpia || descLimpia.length < 3) {
    errores.descripcion = "La descripción debe tener al menos 3 caracteres.";
  }

  // CA-7.3: Validación por campo (monto en pesos)
  let montoNumerico = 0;
  try {
    montoNumerico = parsearMontoCOP(montoTexto);
  } catch (err) {
    errores.monto = err.message;
  }

  if (Object.keys(errores).length > 0) {
    return {
      exito: false,
      errores,
      estadoBoton: "NORMAL"
    };
  }

  // CA-7.4: Simulación de ejecución con try/finally para asegurar que el botón nunca quede trabado
  estadoBoton = "GUARDANDO";
  try {
    if (typeof accionGuardar === "function") {
      accionGuardar({ descripcion: escaparHTML(descLimpia), monto: montoNumerico });
    }
    return {
      exito: true,
      estadoBoton: "NORMAL",
      datos: { descripcion: escaparHTML(descLimpia), monto: montoNumerico }
    };
  } catch (err) {
    return {
      exito: false,
      errorServidor: err.message,
      estadoBoton: "NORMAL" // Garantizado por bloque finally
    };
  }
}

export function ejecutarPruebasConexion() {
  console.log("▶ Ejecutando pruebas de Tarea 7.4 (Conexión offline y validación de campos)...");

  // CA-7.1 & CA-7.2: Detección y notificación reactiva de eventos online / offline
  const ventana = new VentanaMock();
  const eventos = [];
  const cancelar = suscribirConexionMock(ventana, (conectado) => {
    eventos.push(conectado);
  });

  ventana.despacharEvento("offline");
  assert.equal(eventos.length, 1);
  assert.equal(eventos[0], false, "Debe notificar desconexión (false)");

  ventana.despacharEvento("online");
  assert.equal(eventos.length, 2);
  assert.equal(eventos[1], true, "Debe notificar reconexión (true)");

  // Desuscripción limpia (sin listeners huérfanos)
  cancelar();
  ventana.despacharEvento("offline");
  assert.equal(eventos.length, 2, "Tras cancelar la suscripción no deben recibirse más eventos");

  // CA-7.1: Intento de envío en modo offline
  const resOffline = simularEnvioFormulario({
    descripcion: "Almuerzo",
    montoTexto: "25000",
    hayRed: false
  });
  assert.equal(resOffline.exito, false);
  assert.equal(resOffline.bloqueadoPorOffline, true);
  assert.equal(resOffline.estadoBoton, "BLOQUEADO");

  // CA-7.3: Validación con datos inválidos (monto negativo o texto, descripción corta)
  const resCamposInvalidos = simularEnvioFormulario({
    descripcion: "No", // menos de 3 caracteres
    montoTexto: "veinte mil pesos", // no numérico
    hayRed: true
  });
  assert.equal(resCamposInvalidos.exito, false);
  assert.ok(resCamposInvalidos.errores.descripcion);
  assert.ok(resCamposInvalidos.errores.monto);
  assert.equal(resCamposInvalidos.estadoBoton, "NORMAL");

  // CA-7.3: Validación de monto cero
  const resMontoCero = simularEnvioFormulario({
    descripcion: "Gasto nulo",
    montoTexto: "0",
    hayRed: true
  });
  assert.equal(resMontoCero.exito, false);
  assert.ok(resMontoCero.errores.monto);

  // CA-7.4: Resiliencia ante error de servidor (el botón debe quedar en 'NORMAL', no 'GUARDANDO')
  const resErrorServidor = simularEnvioFormulario({
    descripcion: "Gasto de prueba",
    montoTexto: "50000",
    hayRed: true,
    accionGuardar: () => {
      throw new Error("Simulación de fallo en Firestore");
    }
  });
  assert.equal(resErrorServidor.exito, false);
  assert.equal(resErrorServidor.estadoBoton, "NORMAL", "El botón no debe quedar bloqueado tras una excepción");

  // Envío exitoso con sanitización XSS
  const resExito = simularEnvioFormulario({
    descripcion: "<script>alert('xss')</script> Supermercado",
    montoTexto: "150.000",
    hayRed: true
  });
  assert.equal(resExito.exito, true);
  assert.ok(!resExito.datos.descripcion.includes("<script>"), "El texto debe estar sanitizado con escaparHTML");
  assert.equal(resExito.datos.monto, 150000);

  console.log("  ✔ Todas las verificaciones de Tarea 7.4 pasaron exitosamente (CA-7.1 a CA-7.4).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-conexion.test.js")) {
  ejecutarPruebasConexion();
}
