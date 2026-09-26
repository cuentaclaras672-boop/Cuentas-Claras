/**
 * @file Bolsillo.js
 * @description Capa de Dominio - Definición de la entidad Bolsillo y sus reglas de negocio.
 * @module models/Bolsillo
 */

import { parsearMonto } from "../utils/formateo.js";

/**
 * Clase que modela un Bolsillo de Ahorro con Meta en Cuentas Claras.
 * Cumple con la Condición Técnica #1 (Persistencia real NoSQL) y los criterios de la HU-04.
 */
export class Bolsillo {
  /**
   * @param {object} params - Parámetros de inicialización.
   * @param {string} [params.id] - Identificador único generado por Firestore.
   * @param {string} params.nombre - Nombre del bolsillo (mínimo 3 caracteres).
   * @param {number|string} params.meta - Meta monetaria a alcanzar en pesos (mayor a 0).
   * @param {number|string} [params.montoAcumulado=0] - Monto acumulado actual (mayor o igual a 0).
   * @param {string} params.creadoPor - UID del usuario creador en Firebase Auth.
   * @param {Date|string|number} [params.fecha] - Fecha de creación.
   */
  constructor({ id = null, nombre, meta, montoAcumulado = 0, creadoPor, fecha = new Date() }) {
    this.id = id;
    this.nombre = typeof nombre === "string" ? nombre.trim() : "";
    this.meta = parsearMonto(meta);
    this.montoAcumulado = parsearMonto(montoAcumulado);
    this.creadoPor = creadoPor;
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);
  }

  /**
   * Valida la integridad del bolsillo según las reglas de negocio (CA-4.1).
   * @throws {Error} Si alguna validación falla.
   * @returns {boolean} Retorna true si es válido.
   */
  validar() {
    if (!this.nombre || this.nombre.length < 3) {
      throw new Error("El nombre del bolsillo debe tener al menos 3 caracteres.");
    }

    if (isNaN(this.meta) || this.meta <= 0) {
      throw new Error("La meta del bolsillo debe ser un valor monetario mayor a cero.");
    }

    if (isNaN(this.montoAcumulado) || this.montoAcumulado < 0) {
      throw new Error("El monto acumulado no puede ser un valor negativo.");
    }

    if (!this.creadoPor || typeof this.creadoPor !== "string") {
      throw new Error("El bolsillo debe estar asociado al UID de un usuario autenticado.");
    }

    return true;
  }

  /**
   * Calcula el porcentaje de avance hacia la meta (tope 100%).
   * @returns {number} Porcentaje entero entre 0 y 100.
   */
  calcularPorcentaje() {
    if (!this.meta || this.meta <= 0) return 0;
    const porcentaje = Math.round((this.montoAcumulado / this.meta) * 100);
    return Math.min(100, Math.max(0, porcentaje));
  }

  /**
   * Transforma la instancia a un objeto plano apto para Firestore.
   * @returns {object} Objeto serializable para Cloud Firestore.
   */
  aFirestore() {
    this.validar();
    return {
      nombre: this.nombre,
      meta: this.meta,
      montoAcumulado: this.montoAcumulado,
      creadoPor: this.creadoPor,
      fecha: this.fecha
    };
  }

  /**
   * Construye una instancia de Bolsillo a partir de un documento de Firestore.
   * @param {string} id - ID del documento en Firestore.
   * @param {object} data - Datos almacenados en Firestore.
   * @returns {Bolsillo} Instancia tipada del modelo.
   */
  static desdeFirestore(id, data) {
    if (!data) {
      throw new Error("Los datos de Firestore son requeridos para instanciar un Bolsillo.");
    }

    let fechaInstancia;
    if (data.fecha && typeof data.fecha.toDate === "function") {
      fechaInstancia = data.fecha.toDate();
    } else if (data.fecha?.seconds) {
      fechaInstancia = new Date(data.fecha.seconds * 1000);
    } else {
      fechaInstancia = data.fecha ? new Date(data.fecha) : new Date();
    }

    return new Bolsillo({
      id,
      nombre: data.nombre,
      meta: data.meta,
      montoAcumulado: data.montoAcumulado || 0,
      creadoPor: data.creadoPor,
      fecha: fechaInstancia
    });
  }
}
