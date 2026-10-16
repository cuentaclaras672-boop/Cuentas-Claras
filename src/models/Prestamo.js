/**
 * @file Prestamo.js
 * @description Capa de Dominio - Definición de la entidad Prestamo y sus reglas de negocio.
 * Modela préstamos informales a terceros con seguimiento de abonos parciales (HU-08 / Tarea 8.1).
 * Cumple con la Condición Técnica #1 (Persistencia real NoSQL) y #4 (Filtrado por estado).
 * @module models/Prestamo
 */

import { parsearMonto } from "../utils/formateo.js";

/**
 * Estados posibles de un préstamo.
 * @readonly
 * @enum {string}
 */
export const ESTADO_PRESTAMO = Object.freeze({
  PENDIENTE: "PENDIENTE",
  SALDADO: "SALDADO"
});

/**
 * Redondea un valor numérico a 2 decimales para evitar desajustes de punto flotante.
 * @param {number} valor - Valor numérico a redondear.
 * @returns {number} Valor redondeado.
 */
function redondear(valor) {
  return Math.round(Number(valor) * 100) / 100;
}

/**
 * Entidad de dominio que representa un préstamo a terceros en Cuentas Claras.
 */
export class Prestamo {
  /**
   * Crea una nueva instancia de Prestamo.
   * @param {object} params - Parámetros de inicialización.
   * @param {string|null} [params.id=null] - Identificador único del documento en Firestore.
   * @param {string} params.deudor - Nombre o alias de la persona a quien se le prestó (3 a 60 caracteres).
   * @param {number|string} params.monto - Monto total original del préstamo (mayor a 0).
   * @param {Date|string|number} [params.fecha=new Date()] - Fecha en la que se realizó el préstamo.
   * @param {string} [params.nota=""] - Observación o nota contextual (máx 200 caracteres).
   * @param {Array<{monto: number, fecha: Date}>} [params.abonos=[]] - Lista cronológica de abonos realizados.
   * @param {number} [params.totalAbonado=0] - Suma consolidada de los abonos.
   * @param {'PENDIENTE'|'SALDADO'} [params.estado=ESTADO_PRESTAMO.PENDIENTE] - Estado del préstamo.
   * @param {string} params.creadoPor - UID del usuario prestamista en Firebase Auth.
   */
  constructor({
    id = null,
    deudor,
    monto,
    fecha = new Date(),
    nota = "",
    abonos = [],
    totalAbonado = 0,
    estado = ESTADO_PRESTAMO.PENDIENTE,
    creadoPor
  }) {
    this.id = id;
    this.deudor = typeof deudor === "string" ? deudor.trim() : "";
    this.monto = parsearMonto(monto);
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);
    this.nota = typeof nota === "string" ? nota.trim() : "";
    this.abonos = Array.isArray(abonos) ? abonos : [];
    this.totalAbonado = redondear(Number(totalAbonado) || 0);
    this.estado = estado === ESTADO_PRESTAMO.SALDADO ? ESTADO_PRESTAMO.SALDADO : ESTADO_PRESTAMO.PENDIENTE;
    this.creadoPor = creadoPor;

    this.validar();
  }

  /**
   * Valida la integridad del préstamo según los criterios de aceptación (CA-8.1 y CA-8.8).
   * @throws {Error} Si algún campo obligatorio no cumple las reglas de negocio.
   * @returns {boolean} true si es válido.
   */
  validar() {
    if (!this.deudor || this.deudor.length < 3 || this.deudor.length > 60) {
      throw new Error("El nombre de la persona debe tener entre 3 y 60 caracteres.");
    }

    if (isNaN(this.monto) || this.monto <= 0) {
      throw new Error("El monto prestado debe ser un número mayor a cero.");
    }

    if (!this.creadoPor || typeof this.creadoPor !== "string") {
      throw new Error("El préstamo debe estar asociado al UID de un usuario autenticado.");
    }

    if (this.nota && this.nota.length > 200) {
      throw new Error("La nota contextual no puede exceder los 200 caracteres.");
    }

    if (isNaN(this.totalAbonado) || this.totalAbonado < 0) {
      throw new Error("El total abonado debe ser un número mayor o igual a cero.");
    }

    if (this.totalAbonado > this.monto) {
      throw new Error("El total abonado no puede superar el monto original prestado.");
    }

    return true;
  }

  /**
   * Calcula el saldo remanente pendiente por cobrar.
   * @returns {number} Saldo pendiente (monto - totalAbonado).
   */
  calcularSaldoPendiente() {
    return redondear(Math.max(0, this.monto - this.totalAbonado));
  }

  /**
   * Getter para consultar el saldo pendiente de forma directa.
   * @returns {number} Saldo pendiente actual.
   */
  get saldoPendiente() {
    return this.calcularSaldoPendiente();
  }

  /**
   * Registra un nuevo abono en el préstamo, actualizando saldo y estado (CA-8.3 a CA-8.5).
   * @param {number|string} montoAbono - Cantidad a abonar (mayor a 0).
   * @param {Date|string} [fechaAbono=new Date()] - Fecha del abono.
   * @throws {Error} Si el abono es inválido o supera el saldo pendiente.
   * @returns {number} Nuevo saldo pendiente.
   */
  registrarAbono(montoAbono, fechaAbono = new Date()) {
    const abono = parsearMonto(montoAbono);
    const pendiente = this.calcularSaldoPendiente();

    if (this.estado === ESTADO_PRESTAMO.SALDADO || pendiente <= 0) {
      throw new Error("Este préstamo ya se encuentra completamente saldado.");
    }

    if (abono > pendiente) {
      throw new Error(`El abono supera el saldo pendiente. Lo máximo que puedes abonar es $ ${pendiente.toLocaleString("es-CO")}.`);
    }

    const fecha = fechaAbono instanceof Date ? fechaAbono : new Date(fechaAbono);
    this.abonos.push({ monto: abono, fecha });
    this.totalAbonado = redondear(this.totalAbonado + abono);

    if (this.totalAbonado >= this.monto) {
      this.estado = ESTADO_PRESTAMO.SALDADO;
    }

    return this.calcularSaldoPendiente();
  }

  /**
   * Convierte la instancia a un objeto plano serializable para Cloud Firestore (CA-8.2).
   * @returns {object} Objeto con la estructura esperada por las reglas de seguridad de Firestore.
   */
  aFirestore() {
    this.validar();
    return {
      deudor: this.deudor,
      monto: this.monto,
      fecha: this.fecha,
      nota: this.nota,
      abonos: this.abonos.map((a) => ({
        monto: a.monto,
        fecha: a.fecha instanceof Date ? a.fecha : new Date(a.fecha)
      })),
      totalAbonado: this.totalAbonado,
      estado: this.estado,
      creadoPor: this.creadoPor
    };
  }

  /**
   * Reconstruye una instancia de Prestamo a partir de un documento de Firestore.
   * @static
   * @param {string} id - Identificador del documento.
   * @param {object} data - Datos crudos del documento.
   * @returns {Prestamo} Instancia tipada del modelo Prestamo.
   */
  static desdeFirestore(id, data) {
    if (!data) throw new Error("Datos de Firestore inválidos para Prestamo.");

    const fechaDoc = data.fecha && typeof data.fecha.toDate === "function"
      ? data.fecha.toDate()
      : (data.fecha instanceof Date ? data.fecha : new Date(data.fecha || Date.now()));

    const abonos = (data.abonos || []).map((a) => ({
      monto: Number(a.monto),
      fecha: a.fecha && typeof a.fecha.toDate === "function" ? a.fecha.toDate() : new Date(a.fecha)
    }));

    return new Prestamo({
      id,
      deudor: data.deudor,
      monto: data.monto,
      fecha: fechaDoc,
      nota: data.nota || "",
      abonos,
      totalAbonado: data.totalAbonado || 0,
      estado: data.estado || ESTADO_PRESTAMO.PENDIENTE,
      creadoPor: data.creadoPor
    });
  }
}
