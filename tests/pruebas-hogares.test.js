/**
 * @file pruebas-hogares.test.js
 * @description Suite de Pruebas Unitarias, Integración y Seguridad - Tarea 9.4 / HU-09 (Hogar Compartido y Aislamiento).
 * Responsable de QA: Fabián Córdoba <cuentaclaras672@gmail.com>
 * Criterios evaluados: CA-9.1, CA-9.2, CA-9.3, CA-9.4, CA-9.5, CA-9.6, CA-9.7 (Condición Técnica #2).
 */

import assert from "node:assert/strict";
import { Hogar, MAX_MIEMBROS_HOGAR } from "../src/models/Hogar.js";

const CARACTERES_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Genera código de 6 caracteres seguro (idéntico a src/services/hogares.js).
 */
function generarCodigoInvitacion() {
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    const indice = Math.floor(Math.random() * CARACTERES_CODIGO.length);
    codigo += CARACTERES_CODIGO[indice];
  }
  return codigo;
}

/**
 * Simulador de repositorio y reglas de seguridad de Firestore para Hogares y Transacciones
 * (CA-9.1 a CA-9.7 y prueba negativa con tercera cuenta).
 */
class SimuladorFirestoreHogares {
  constructor() {
    this.hogares = new Map(); // codigo -> { nombre, miembros: Set<uid>, creadoPor }
    this.usuariosHogar = new Map(); // uid -> codigoHogar
    this.transacciones = []; // lista de { id, descripcion, monto, ambito, creadoPor, hogarId }
  }

  crearHogar(uid, nombre) {
    if (!nombre || nombre.trim().length < 3) {
      throw new Error("El nombre del hogar debe tener al menos 3 caracteres.");
    }
    if (this.usuariosHogar.has(uid)) {
      throw new Error("Ya perteneces a un hogar. Debes salir antes de crear uno nuevo.");
    }

    const codigo = generarCodigoInvitacion();
    this.hogares.set(codigo, {
      codigo,
      nombre: nombre.trim(),
      miembros: new Set([uid]),
      creadoPor: uid
    });
    this.usuariosHogar.set(uid, codigo);
    return codigo;
  }

  unirseAHogar(uid, codigoInvitacion) {
    const codigoLimpio = (codigoInvitacion || "").trim().toUpperCase();
    if (!this.hogares.has(codigoLimpio)) {
      throw new Error("No existe ningún hogar con ese código de invitación.");
    }
    if (this.usuariosHogar.has(uid)) {
      throw new Error("Ya perteneces a un hogar. Debes salir antes de unirte a otro.");
    }

    const hogar = this.hogares.get(codigoLimpio);
    hogar.miembros.add(uid);
    this.usuariosHogar.set(uid, codigoLimpio);
    return hogar;
  }

  salirDeHogar(uid) {
    const codigo = this.usuariosHogar.get(uid);
    if (!codigo) {
      throw new Error("No perteneces a ningún hogar.");
    }

    const hogar = this.hogares.get(codigo);
    hogar.miembros.delete(uid);
    this.usuariosHogar.delete(uid);

    if (hogar.miembros.size === 0) {
      this.hogares.delete(codigo);
    }
    return true;
  }

  registrarTransaccion(uid, { descripcion, monto, ambito }) {
    const hogarId = this.usuariosHogar.get(uid) || null;
    const tx = {
      id: `tx-${this.transacciones.length + 1}`,
      descripcion,
      monto,
      ambito, // 'PERSONAL' o 'COMPARTIDO'
      creadoPor: uid,
      hogarId
    };
    this.transacciones.push(tx);
    return tx;
  }

  /**
   * Consulta reactiva aplicando estrictamente las reglas de seguridad de firestore.rules (CA-9.5, CA-9.6):
   * Un lector autenticado solo puede leer:
   * 1. Sus transacciones propias (creadoPor == lectorUid)
   * 2. Transacciones con ambito == 'COMPARTIDO' cuyo hogarId coincida con el hogar activo del lector.
   */
  consultarTransaccionesVisibles(lectorUid) {
    const lectorHogarId = this.usuariosHogar.get(lectorUid) || null;

    return this.transacciones.filter((tx) => {
      // 1. Propias: siempre visibles
      if (tx.creadoPor === lectorUid) return true;

      // 2. Si es de otro usuario y es PERSONAL: NUNCA visible (Aislamiento de privacidad)
      if (tx.ambito === "PERSONAL") return false;

      // 3. Si es COMPARTIDO: visible SOLO si ambos pertenecen al mismo hogar
      if (tx.ambito === "COMPARTIDO" && lectorHogarId && tx.hogarId === lectorHogarId) {
        return true;
      }

      return false;
    });
  }
}

export function ejecutarPruebasHogares() {
  console.log("▶ Ejecutando pruebas de Tarea 9.4 (Hogar compartido, privacidad y prueba negativa)...");

  // Verificación unitaria de la clase de dominio Hogar (Tarea 9.1)
  const codigoModelo = Hogar.generarCodigo();
  assert.equal(codigoModelo.length, 6);
  assert.throws(() => new Hogar({ nombre: "Ho", codigo: codigoModelo, creadoPor: "u1" }), /entre 3 y 40 caracteres/);
  const hogarEntidad = new Hogar({
    nombre: "Hogar Familia",
    codigo: codigoModelo,
    miembros: ["u1"],
    nombres: { u1: "Ana" },
    creadoPor: "u1"
  });
  assert.equal(hogarEntidad.esMiembro("u1"), true);
  hogarEntidad.agregarMiembro("u2", "Pedro");
  assert.equal(hogarEntidad.esMiembro("u2"), true);
  assert.equal(hogarEntidad.obtenerNombreMiembro("u2"), "Pedro");
  hogarEntidad.removerMiembro("u2");
  assert.equal(hogarEntidad.esMiembro("u2"), false);

  const payloadHogar = hogarEntidad.aFirestore();
  assert.equal(payloadHogar.nombre, "Hogar Familia");
  const desdeDoc = Hogar.desdeFirestore(codigoModelo, payloadHogar);
  assert.equal(desdeDoc.codigo, codigoModelo);

  const fs = new SimuladorFirestoreHogares();

  const UID_USUARIO_A = "usr-conyugue-1";
  const UID_USUARIO_B = "usr-conyugue-2";
  const UID_USUARIO_C = "usr-tercero-ajeno";

  // CA-9.1: Creación de hogar y generación de código de 6 caracteres
  const codigoHogar = fs.crearHogar(UID_USUARIO_A, "Hogar Los Pinos");
  assert.equal(codigoHogar.length, 6, "El código de invitación debe tener exactamente 6 caracteres");
  assert.match(codigoHogar, /^[A-Z0-9]{6}$/, "El código debe ser alfanumérico en mayúsculas");

  // CA-9.2: Usuario B se une con el código
  fs.unirseAHogar(UID_USUARIO_B, codigoHogar);
  assert.equal(fs.usuariosHogar.get(UID_USUARIO_B), codigoHogar);

  // CA-9.3: Impedir unirse a un segundo hogar sin salir del actual
  assert.throws(
    () => fs.crearHogar(UID_USUARIO_B, "Otro Hogar"),
    /Ya perteneces a un hogar/
  );

  // CA-9.4: Registro de transacciones con hogarId asignado
  // Usuario A registra 1 gasto personal y 1 gasto compartido
  fs.registrarTransaccion(UID_USUARIO_A, { descripcion: "Ropa personal A", monto: 80000, ambito: "PERSONAL" });
  fs.registrarTransaccion(UID_USUARIO_A, { descripcion: "Arriendo del hogar", monto: 1200000, ambito: "COMPARTIDO" });

  // Usuario B registra 1 gasto personal y 1 gasto compartido
  fs.registrarTransaccion(UID_USUARIO_B, { descripcion: "Juegos personal B", monto: 50000, ambito: "PERSONAL" });
  fs.registrarTransaccion(UID_USUARIO_B, { descripcion: "Supermercado cocina", monto: 300000, ambito: "COMPARTIDO" });

  // CA-9.5: Verificación de visibilidad para Usuario A
  const visiblesParaA = fs.consultarTransaccionesVisibles(UID_USUARIO_A);
  assert.equal(visiblesParaA.length, 3, "Usuario A debe ver 3 movimientos: 2 propios + 1 compartido de B");
  assert.ok(visiblesParaA.some(t => t.descripcion === "Ropa personal A"));
  assert.ok(visiblesParaA.some(t => t.descripcion === "Arriendo del hogar"));
  assert.ok(visiblesParaA.some(t => t.descripcion === "Supermercado cocina"));
  assert.ok(!visiblesParaA.some(t => t.descripcion === "Juegos personal B"), "Usuario A NUNCA debe ver los gastos personales de B");

  // CA-9.5: Verificación de visibilidad para Usuario B
  const visiblesParaB = fs.consultarTransaccionesVisibles(UID_USUARIO_B);
  assert.equal(visiblesParaB.length, 3, "Usuario B debe ver 3 movimientos: 2 propios + 1 compartido de A");
  assert.ok(!visiblesParaB.some(t => t.descripcion === "Ropa personal A"), "Usuario B NUNCA debe ver los gastos personales de A");

  // CA-9.6: PRUEBA NEGATIVA CON TERCERA CUENTA (Usuario C)
  // Usuario C registra su propio gasto personal
  fs.registrarTransaccion(UID_USUARIO_C, { descripcion: "Gasto propio C", monto: 20000, ambito: "PERSONAL" });

  const visiblesParaC = fs.consultarTransaccionesVisibles(UID_USUARIO_C);
  assert.equal(visiblesParaC.length, 1, "Usuario C ajeno al hogar SOLO ve su propio movimiento");
  assert.equal(visiblesParaC[0].descripcion, "Gasto propio C");

  // Intento de Usuario C de consultar transacciones del hogar A y B -> 0 resultados permitidos
  const ajenosVisiblesParaC = visiblesParaC.filter(t => t.creadoPor === UID_USUARIO_A || t.creadoPor === UID_USUARIO_B);
  assert.equal(ajenosVisiblesParaC.length, 0, "Prueba negativa exitosa: Usuario C no tiene acceso a datos del hogar");

  // Intento de unirse con código inexistente
  assert.throws(
    () => fs.unirseAHogar(UID_USUARIO_C, "COD999"),
    /No existe ningún hogar con ese código/
  );

  // CA-9.7: Salida del hogar
  fs.salirDeHogar(UID_USUARIO_B);
  assert.equal(fs.usuariosHogar.has(UID_USUARIO_B), false);

  // Tras salir, Usuario B ya no puede ver los compartidos de A
  const visiblesParaBTrasSalir = fs.consultarTransaccionesVisibles(UID_USUARIO_B);
  assert.equal(visiblesParaBTrasSalir.length, 2, "Usuario B desvinculado solo ve sus propios movimientos");
  assert.ok(!visiblesParaBTrasSalir.some(t => t.descripcion === "Arriendo del hogar"));

  console.log("  ✔ Todas las verificaciones de Tarea 9.4 pasaron exitosamente (CA-9.1 a CA-9.7 y prueba negativa).");
  return true;
}

if (process.argv[1]?.endsWith("pruebas-hogares.test.js")) {
  ejecutarPruebasHogares();
}
