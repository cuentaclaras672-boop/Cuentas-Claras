/**
 * @file liquidaciones.js
 * @description Capa de Infraestructura / Servicios - Cuadre de cuentas entre convivientes en Cloud Firestore
 * (Tarea 11.2 / HU-11). Escucha los gastos compartidos del hogar en un mes y guarda la liquidación
 * cuando los convivientes marcan el mes como saldado. No toca el DOM y no calcula quién le debe a quién:
 * ese cálculo es la función pura de la Tarea 11.1, y este servicio solo guarda las transferencias que recibe.
 * @module services/liquidaciones
 *
 * Estructura de cada documento en `liquidaciones/{hogarId}_{periodo}` (ej. `ABC123_2026-10`).
 * El ID fijo hace que cada hogar tenga como máximo una liquidación por mes.
 * | Campo          | Tipo      | Regla                                                         |
 * |----------------|-----------|---------------------------------------------------------------|
 * | hogarId        | string    | código del hogar; quien guarda debe ser miembro               |
 * | periodo        | string    | mes liquidado, formato AAAA-MM                                |
 * | transferencias | array     | lista de { de: uid, para: uid, monto: number > 0 }, máximo 5  |
 * | saldadaPor     | string    | UID del miembro que marcó el mes como saldado                 |
 * | fecha          | timestamp | hora del servidor al guardar                                  |
 *
 * Una liquidación guardada no se puede modificar ni borrar (firestore.rules): queda como registro del cuadre.
 */

import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, traducirErrorFirestore } from "./firestore.js";
import { MAX_MIEMBROS_HOGAR } from "./hogares.js";
import { AMBITO_TRANSACCION, TIPO_TRANSACCION } from "../models/Transaccion.js";

const COLECCION_LIQUIDACIONES = "liquidaciones";
const COLECCION_TRANSACCIONES = "transacciones";

/** Formato del periodo liquidado. Debe coincidir con firestore.rules. */
const PATRON_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Formato del código de hogar. Debe coincidir con firestore.rules. */
const PATRON_HOGAR = /^[A-Z0-9]{6}$/;

/**
 * Con N miembros, el cuadre nunca necesita más de N - 1 transferencias.
 * Debe coincidir con firestore.rules.
 */
export const MAX_TRANSFERENCIAS = MAX_MIEMBROS_HOGAR - 1;

/**
 * Redondea a centavos para no guardar montos como 33333.333333.
 * @param {number} valor - Número a redondear.
 * @returns {number} Valor con máximo dos decimales.
 */
function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Devuelve el periodo (AAAA-MM) de una fecha, en hora local.
 * @param {Date} [fecha=new Date()] - Fecha de referencia.
 * @returns {string} Periodo, ej. "2026-10".
 */
export function periodoDe(fecha = new Date()) {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}`;
}

/**
 * Valida un periodo y devuelve el rango de fechas que cubre, en hora local.
 * @param {string} periodo - Periodo en formato AAAA-MM.
 * @returns {{ inicio: Date, fin: Date }} Inicio del mes (incluido) e inicio del mes siguiente (excluido).
 * @throws {Error} Si el periodo no tiene el formato AAAA-MM.
 */
export function rangoDelPeriodo(periodo) {
  if (typeof periodo !== "string" || !PATRON_PERIODO.test(periodo)) {
    throw new Error("El periodo debe tener el formato AAAA-MM.");
  }
  const [anio, mes] = periodo.split("-").map(Number);
  return { inicio: new Date(anio, mes - 1, 1), fin: new Date(anio, mes, 1) };
}

/**
 * ID del documento de liquidación de un hogar en un mes.
 * @param {string} hogarId - Código del hogar.
 * @param {string} periodo - Periodo AAAA-MM.
 * @returns {string} ID, ej. "ABC123_2026-10".
 */
export function idLiquidacion(hogarId, periodo) {
  return `${hogarId}_${periodo}`;
}

/**
 * Valida el código de hogar que llega a las operaciones del servicio.
 * @param {string} hogarId - Código del hogar.
 * @throws {Error} Si no es un código de 6 caracteres A-Z / 0-9.
 */
function validarHogarId(hogarId) {
  if (typeof hogarId !== "string" || !PATRON_HOGAR.test(hogarId)) {
    throw new Error("Identificador de hogar inválido.");
  }
}

/**
 * Valida y normaliza las transferencias calculadas por la Tarea 11.1 antes de guardarlas.
 * @param {Array<{de: string, para: string, monto: number}>} transferencias - Transferencias sugeridas.
 * @param {string[]} miembros - UIDs de los miembros del hogar.
 * @returns {Array<{de: string, para: string, monto: number}>} Transferencias con montos redondeados.
 * @throws {Error} Si alguna transferencia es inválida o hay más de MAX_TRANSFERENCIAS.
 */
function validarTransferencias(transferencias, miembros) {
  if (!Array.isArray(transferencias)) {
    throw new TypeError("Las transferencias deben ser una lista.");
  }
  if (transferencias.length > MAX_TRANSFERENCIAS) {
    throw new Error(`Un cuadre no puede tener más de ${MAX_TRANSFERENCIAS} transferencias.`);
  }

  return transferencias.map((t) => {
    const monto = redondear(Number(t?.monto));
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

/**
 * Convierte un documento de liquidación en un objeto plano con la fecha como Date.
 * @param {string} id - ID del documento.
 * @param {object} data - Datos del documento.
 * @returns {{ id: string, hogarId: string, periodo: string, transferencias: Array, saldadaPor: string, fecha: Date }}
 */
function liquidacionDesdeDocumento(id, data) {
  return {
    id,
    hogarId: data.hogarId,
    periodo: data.periodo,
    transferencias: data.transferencias || [],
    saldadaPor: data.saldadaPor,
    fecha: data.fecha && typeof data.fecha.toDate === "function" ? data.fecha.toDate() : new Date()
  };
}

/**
 * Escucha en tiempo real los gastos COMPARTIDOS del hogar en un mes (CA-11.1).
 * Consulta solo por hogarId y ámbito, que es lo que permiten las reglas y no exige índices compuestos;
 * el tipo GASTO y el rango de fechas se filtran en memoria.
 *
 * @param {string} hogarId - Código del hogar.
 * @param {string} periodo - Periodo AAAA-MM.
 * @param {function(Array<{id: string, creadoPor: string, nombreUsuario: string, descripcion: string, monto: number, fecha: Date}>): void} onActualizacion
 *   Recibe los gastos compartidos del mes, del más reciente al más antiguo.
 * @param {function(Error): void} [onError] - Callback en caso de fallo.
 * @returns {function(): void} Función para cancelar la suscripción.
 */
export function escucharGastosCompartidosDelPeriodo(hogarId, periodo, onActualizacion, onError) {
  validarHogarId(hogarId);
  const { inicio, fin } = rangoDelPeriodo(periodo);
  if (typeof onActualizacion !== "function") {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  const q = query(
    collection(db, COLECCION_TRANSACCIONES),
    where("hogarId", "==", hogarId),
    where("ambito", "==", AMBITO_TRANSACCION.COMPARTIDO)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const gastos = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let fecha = null;
        if (data.fecha && typeof data.fecha.toDate === "function") {
          fecha = data.fecha.toDate();
        } else if (data.fecha instanceof Date) {
          fecha = data.fecha;
        } else if (data.fecha && data.fecha.seconds) {
          fecha = new Date(data.fecha.seconds * 1000);
        } else if (data.fecha) {
          fecha = new Date(data.fecha);
        }
        if (data.tipo !== TIPO_TRANSACCION.GASTO || !fecha || fecha < inicio || fecha >= fin) return;
        gastos.push({
          id: docSnap.id,
          creadoPor: data.creadoPor,
          nombreUsuario: data.nombreUsuario || "Conviviente",
          descripcion: data.descripcion,
          monto: Number(data.monto) || 0,
          fecha
        });
      });
      gastos.sort((a, b) => b.fecha - a.fecha);
      onActualizacion(gastos);
    },
    (error) => {
      console.error("[LiquidacionesService.escucharGastosCompartidosDelPeriodo] Error en tiempo real:", error);
      if (typeof onError === "function") {
        onError(new Error(traducirErrorFirestore(error)));
      }
    }
  );
}

/**
 * Escucha en tiempo real la liquidación de un hogar en un mes (CA-11.5): avisa en cuanto
 * cualquier conviviente marca el mes como saldado.
 * @param {string} hogarId - Código del hogar.
 * @param {string} periodo - Periodo AAAA-MM.
 * @param {function(object|null): void} onActualizacion - Recibe la liquidación, o null si el mes no se ha saldado.
 * @param {function(Error): void} [onError] - Callback en caso de fallo.
 * @returns {function(): void} Función para cancelar la suscripción.
 */
export function escucharLiquidacion(hogarId, periodo, onActualizacion, onError) {
  validarHogarId(hogarId);
  rangoDelPeriodo(periodo);
  if (typeof onActualizacion !== "function") {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  const docRef = doc(db, COLECCION_LIQUIDACIONES, idLiquidacion(hogarId, periodo));

  return onSnapshot(
    docRef,
    (snap) => {
      onActualizacion(snap.exists() ? liquidacionDesdeDocumento(snap.id, snap.data()) : null);
    },
    (error) => {
      console.error("[LiquidacionesService.escucharLiquidacion] Error en tiempo real:", error);
      if (typeof onError === "function") {
        onError(new Error(traducirErrorFirestore(error)));
      }
    }
  );
}

/**
 * Marca el mes como saldado y guarda las transferencias del cuadre (CA-11.5).
 * Se usa una transacción para que, si dos convivientes pulsan el botón a la vez, solo se guarde una liquidación.
 *
 * @async
 * @param {object} hogar - Hogar del usuario, como lo entrega `escucharHogarDelUsuario`.
 * @param {string} hogar.id - Código del hogar.
 * @param {string[]} hogar.miembros - UIDs de los miembros.
 * @param {string} periodo - Periodo AAAA-MM.
 * @param {Array<{de: string, para: string, monto: number}>} transferencias - Transferencias calculadas en la Tarea 11.1.
 * @param {string} usuarioId - UID del miembro que marca el mes como saldado.
 * @returns {Promise<string>} ID de la liquidación guardada.
 * @throws {Error} Si los datos son inválidos, el usuario no es miembro o el mes ya estaba saldado.
 */
export async function marcarLiquidacionSaldada(hogar, periodo, transferencias, usuarioId) {
  try {
    validarHogarId(hogar?.id);
    rangoDelPeriodo(periodo);
    const miembros = Array.isArray(hogar.miembros) ? hogar.miembros : [];
    if (!usuarioId || !miembros.includes(usuarioId)) {
      throw new Error("Solo un miembro del hogar puede marcar el cuadre como saldado.");
    }
    const transferenciasValidas = validarTransferencias(transferencias, miembros);

    const id = idLiquidacion(hogar.id, periodo);
    const docRef = doc(db, COLECCION_LIQUIDACIONES, id);

    await runTransaction(db, async (transaccion) => {
      const existente = await transaccion.get(docRef);
      if (existente.exists()) {
        throw new Error("Este mes ya fue marcado como saldado.");
      }
      transaccion.set(docRef, {
        hogarId: hogar.id,
        periodo,
        transferencias: transferenciasValidas,
        saldadaPor: usuarioId,
        fecha: serverTimestamp()
      });
    });

    return id;
  } catch (error) {
    console.error("[LiquidacionesService.marcarLiquidacionSaldada] Error:", error.message);
    throw new Error(traducirErrorFirestore(error));
  }
}
