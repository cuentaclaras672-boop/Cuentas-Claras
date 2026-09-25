/**
 * @file firestore.js
 * @description Capa de Infraestructura / Servicios para persistencia en Cloud Firestore (SDK v10).
 * @module services/firestore
 * 
 * Reglas de Arquitectura:
 * 1. Persistencia Real: No almacena datos financieros en memoria ni en localStorage.
 * 2. Conversión de Tipos: Convierte documentos Firestore a entidades del Dominio (Transaccion).
 * 3. Mapeo de Excepciones: Los errores de Firestore se traducen a mensajes comprensibles para Toasts.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./auth.js";
import { Transaccion, TIPO_TRANSACCION, AMBITO_TRANSACCION } from "../models/Transaccion.js";

// ============================================================================
// INICIALIZACIÓN SINGLETON DE FIRESTORE
// ============================================================================

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLECCION_TRANSACCIONES = "transacciones";

/**
 * Mapea códigos de error de Cloud Firestore a mensajes claros en español.
 * @param {object} error - Objeto de error generado por Firestore.
 * @returns {string} Mensaje traducido.
 */
function traducirErrorFirestore(error) {
  const codigo = error?.code || '';

  switch (codigo) {
    case 'permission-denied':
      return 'Acceso denegado. No tienes permisos para consultar o modificar esta información.';
    case 'unavailable':
      return 'El servicio de base de datos se encuentra temporalmente inaccesible. Revisa tu conexión.';
    case 'not-found':
      return 'El registro solicitado no fue encontrado en la base de datos.';
    case 'cancelled':
      return 'La operación en la base de datos fue cancelada.';
    case 'deadline-exceeded':
      return 'Tiempo de espera agotado al consultar la base de datos.';
    default:
      return error.message || 'Error de comunicación con la base de datos Firestore.';
  }
}

// ============================================================================
// OPERACIONES CRUD ASÍNCRONAS
// ============================================================================

/**
 * Guarda una nueva transacción en Firestore de forma asíncrona.
 * @async
 * @param {Transaccion} transaccion - Instancia del modelo de dominio Transaccion.
 * @returns {Promise<string>} ID generado por Firestore para el nuevo documento.
 * @throws {Error} Si la validación falla o la base de datos rechaza la inserción.
 */
export async function registrarTransaccion(transaccion) {
  try {
    if (!(transaccion instanceof Transaccion)) {
      throw new TypeError("El objeto a registrar debe ser una instancia válida de Transaccion.");
    }

    // Re-ejecuta validación de integridad antes de hacer la petición de red
    transaccion.validar();

    const datosPayload = {
      ...transaccion.aFirestore(),
      fecha: Timestamp.fromDate(transaccion.fecha)
    };

    const docRef = await addDoc(collection(db, COLECCION_TRANSACCIONES), datosPayload);
    return docRef.id;
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error(`[FirestoreService.registrarTransaccion] Error (${error.code || 'VALIDACION'}):`, error.message);
    throw new Error(mensaje);
  }
}

/**
 * Elimina una transacción existente en Firestore por su identificador de documento.
 * @async
 * @param {string} idTransaccion - Identificador único del documento en Firestore.
 * @returns {Promise<void>}
 * @throws {Error} Si no se especifica el ID o falla la operación.
 */
export async function eliminarTransaccion(idTransaccion) {
  try {
    if (!idTransaccion || typeof idTransaccion !== 'string') {
      throw new Error("Identificador de transacción inválido para eliminación.");
    }

    const docRef = doc(db, COLECCION_TRANSACCIONES, idTransaccion);
    await deleteDoc(docRef);
  } catch (error) {
    const mensaje = traducirErrorFirestore(error);
    console.error("[FirestoreService.eliminarTransaccion] Error:", error.message);
    throw new Error(mensaje);
  }
}

/**
 * Suscribe un listener en tiempo real a las transacciones del usuario o compartidas del hogar.
 * Actualiza automáticamente la capa de presentación cuando ocurren cambios en la base de datos.
 * 
 * @param {string} usuarioId - UID del usuario autenticado.
 * @param {function(Transaccion[]): void} onActualizacion - Callback ejecutado con la lista de transacciones.
 * @param {function(Error): void} onError - Callback ejecutado en caso de fallo.
 * @returns {function(): void} Función para cancelar la suscripción (Unsubscribe).
 */
export function escucharTransacciones(usuarioId, onActualizacion, onError) {
  if (!usuarioId || typeof usuarioId !== 'string') {
    throw new Error("Se requiere el UID del usuario para consultar las transacciones.");
  }

  if (typeof onActualizacion !== 'function') {
    throw new TypeError("Se debe suministrar un callback de actualización válido.");
  }

  // Consulta por movimientos del usuario ordenados por fecha descendente
  const q = query(
    collection(db, COLECCION_TRANSACCIONES),
    where("creadoPor", "==", usuarioId),
    orderBy("fecha", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const transacciones = [];
      snapshot.forEach((docItem) => {
        try {
          const entidad = Transaccion.desdeFirestore(docItem.id, docItem.data());
          transacciones.push(entidad);
        } catch (errorParseo) {
          console.warn(`[FirestoreService] Registro omitido id=${docItem.id} por datos inválidos:`, errorParseo.message);
        }
      });
      onActualizacion(transacciones);
    },
    (error) => {
      const mensaje = traducirErrorFirestore(error);
      console.error("[FirestoreService.escucharTransacciones] Error en tiempo real:", error);
      if (typeof onError === 'function') {
        onError(new Error(mensaje));
      }
    }
  );
}

/**
 * Calcula los totales agregados de ingresos, gastos y balance a partir de una colección de transacciones.
 * Función pura que no muta el arreglo original.
 * 
 * @param {Transaccion[]} listaTransacciones - Lista de transacciones a calcular.
 * @returns {{ totalIngresos: number, totalGastos: number, balanceNeto: number, totalCompartido: number }}
 */
export function calcularTotales(listaTransacciones = []) {
  let totalIngresos = 0;
  let totalGastos = 0;
  let totalCompartido = 0;

  for (const t of listaTransacciones) {
    if (t.tipo === TIPO_TRANSACCION.INGRESO) {
      totalIngresos += t.monto;
    } else if (t.tipo === TIPO_TRANSACCION.GASTO) {
      totalGastos += t.monto;
      if (t.ambito === AMBITO_TRANSACCION.COMPARTIDO) {
        totalCompartido += t.monto;
      }
    }
  }

  return {
    totalIngresos,
    totalGastos,
    balanceNeto: totalIngresos - totalGastos,
    totalCompartido
  };
}
