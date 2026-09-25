/**
 * @file Transaccion.js
 * @description Capa de Dominio - Definición de la entidad Transaccion y sus reglas de negocio.
 * @module models/Transaccion
 */

import { parsearMonto } from "../utils/formateo.js";

/**
 * Enumeración para los tipos de transacción permitidos.
 * @readonly
 * @enum {string}
 */
export const TIPO_TRANSACCION = Object.freeze({
  INGRESO: 'INGRESO',
  GASTO: 'GASTO'
});

/**
 * Enumeración para el ámbito de la transacción (Personal o Compartido del hogar).
 * @readonly
 * @enum {string}
 */
export const AMBITO_TRANSACCION = Object.freeze({
  PERSONAL: 'PERSONAL',
  COMPARTIDO: 'COMPARTIDO'
});

/**
 * Categorías predefinidas para gastos del hogar y personales.
 */
export const CATEGORIAS_GASTO = Object.freeze([
  'Vivienda y Alquiler',
  'Servicios Públicos',
  'Alimentación y Mercado',
  'Transporte y Gasolina',
  'Salud y Farmacia',
  'Educación',
  'Ocio y Entretenimiento',
  'Mascotas',
  'Mantenimiento del Hogar',
  'Otros'
]);

/**
 * Categorías predefinidas para ingresos.
 */
export const CATEGORIAS_INGRESO = Object.freeze([
  'Salario / Nómina',
  'Honorarios / Servicios',
  'Ingreso Extra / Ventas',
  'Aporte Compartido',
  'Rentas / Rendimientos',
  'Otros'
]);

/**
 * Clase que modela una transacción financiera en el dominio de Cuentas Claras.
 */
export class Transaccion {
  /**
   * Crea una nueva instancia de Transacción.
   * @param {object} params - Parámetros de la transacción.
   * @param {string} [params.id=null] - Identificador único de Firestore.
   * @param {string} params.descripcion - Concepto o detalle descriptivo.
   * @param {number|string} params.monto - Valor monetario mayor a 0.
   * @param {'INGRESO'|'GASTO'} params.tipo - Tipo de movimiento.
   * @param {'PERSONAL'|'COMPARTIDO'} [params.ambito='PERSONAL'] - Destino de la transacción.
   * @param {string} params.categoria - Categoría temática asociada.
   * @param {string} params.creadoPor - UID del usuario en Firebase Auth.
   * @param {string} [params.nombreUsuario='Anónimo'] - Nombre visible del autor.
   * @param {Date|string|object} [params.fecha=new Date()] - Fecha del movimiento.
   */
  constructor({
    id = null,
    descripcion,
    monto,
    tipo,
    ambito = AMBITO_TRANSACCION.PERSONAL,
    categoria,
    creadoPor,
    nombreUsuario = 'Anónimo',
    fecha = new Date()
  }) {
    this.id = id;
    this.descripcion = (descripcion || '').trim();
    this.monto = parsearMonto(monto);
    this.tipo = tipo;
    this.ambito = ambito;
    this.categoria = (categoria || '').trim();
    this.creadoPor = creadoPor;
    this.nombreUsuario = (nombreUsuario || 'Anónimo').trim();
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha || Date.now());

    // Ejecuta validaciones de dominio defensivas al instanciarse
    this.validar();
  }

  /**
   * Ejecuta validaciones estrictas de reglas de negocio para asegurar la integridad de datos.
   * @throws {Error} Si algún campo viola las reglas del modelo.
   */
  validar() {
    if (!this.descripcion || this.descripcion.length < 3) {
      throw new Error('La descripción debe contener al menos 3 caracteres.');
    }

    if (typeof this.monto !== 'number' || isNaN(this.monto) || this.monto <= 0) {
      throw new Error('El monto de la transacción debe ser un número positivo mayor a 0.');
    }

    if (!Object.values(TIPO_TRANSACCION).includes(this.tipo)) {
      throw new Error(`Tipo de transacción inválido. Debe ser: ${Object.values(TIPO_TRANSACCION).join(', ')}.`);
    }

    if (!Object.values(AMBITO_TRANSACCION).includes(this.ambito)) {
      throw new Error(`Ámbito inválido. Debe ser: ${Object.values(AMBITO_TRANSACCION).join(', ')}.`);
    }

    if (!this.categoria) {
      throw new Error('Debes seleccionar una categoría para la transacción.');
    }

    if (!this.creadoPor || typeof this.creadoPor !== 'string') {
      throw new Error('La transacción debe estar asociada al UID de un usuario autenticado.');
    }
  }

  /**
   * Convierte la entidad a un objeto plano preparado para inserción en Firestore.
   * @returns {object} Objeto serializable para Cloud Firestore.
   */
  aFirestore() {
    return {
      descripcion: this.descripcion,
      monto: this.monto,
      tipo: this.tipo,
      ambito: this.ambito,
      categoria: this.categoria,
      creadoPor: this.creadoPor,
      nombreUsuario: this.nombreUsuario,
      fecha: this.fecha instanceof Date ? this.fecha : new Date()
    };
  }

  /**
   * Método de fábrica (Factory Method) para reconstruir una entidad desde un documento de Firestore.
   * @static
   * @param {string} id - ID del documento en Firestore.
   * @param {object} data - Datos almacenados en el documento.
   * @returns {Transaccion} Instancia validada de Transaccion.
   */
  static desdeFirestore(id, data) {
    if (!data) {
      throw new Error('No se pueden instanciar transacciones a partir de datos nulos.');
    }

    let fechaFormateada = new Date();
    if (data.fecha && typeof data.fecha.toDate === 'function') {
      fechaFormateada = data.fecha.toDate();
    } else if (data.fecha) {
      fechaFormateada = new Date(data.fecha);
    }

    return new Transaccion({
      id,
      descripcion: data.descripcion,
      monto: data.monto,
      tipo: data.tipo,
      ambito: data.ambito,
      categoria: data.categoria,
      creadoPor: data.creadoPor,
      nombreUsuario: data.nombreUsuario,
      fecha: fechaFormateada
    });
  }
}
