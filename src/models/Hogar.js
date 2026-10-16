/**
 * @file Hogar.js
 * @description Capa de Dominio - Definición de la entidad Hogar y sus reglas de membresía.
 * Modela hogares compartidos entre convivientes vinculados por código de 6 caracteres (HU-09 / Tarea 9.1).
 * Cumple con la Condición Técnica #2 (Control de Acceso y Aislamiento por hogar).
 * @module models/Hogar
 */

/**
 * Caracteres alfanuméricos seguros para códigos de invitación (sin ceros ni letras ambiguas).
 * Coincide con la implementación de src/services/hogares.js.
 */
export const CARACTERES_CODIGO_HOGAR = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Cantidad máxima de miembros convivientes permitidos en un mismo hogar.
 */
export const MAX_MIEMBROS_HOGAR = 6;

/**
 * Expresión regular para validar el formato estricto del código de invitación.
 */
export const REGEX_CODIGO_HOGAR = /^[A-Z0-9]{6}$/;

/**
 * Entidad de dominio que representa un Hogar Compartido en Cuentas Claras.
 */
export class Hogar {
  /**
   * Crea una nueva instancia de Hogar.
   * @param {object} params - Parámetros de inicialización.
   * @param {string|null} [params.id=null] - Identificador del documento (coincide con el código).
   * @param {string} params.nombre - Nombre asignado al hogar (3 a 40 caracteres).
   * @param {string} params.codigo - Código alfanumérico único de 6 caracteres.
   * @param {string[]} [params.miembros=[]] - Lista de UIDs de los convivientes miembros.
   * @param {Record<string, string>} [params.nombres={}] - Diccionario UID -> Nombre visible del conviviente.
   * @param {string} params.creadoPor - UID del usuario fundador del hogar.
   * @param {Date|string|number} [params.fecha=new Date()] - Fecha de creación del hogar.
   */
  constructor({
    id = null,
    nombre,
    codigo,
    miembros = [],
    nombres = {},
    creadoPor,
    fecha = new Date()
  }) {
    this.id = id || (typeof codigo === "string" ? codigo.trim().toUpperCase() : null);
    this.nombre = typeof nombre === "string" ? nombre.trim() : "";
    this.codigo = typeof codigo === "string" ? codigo.trim().toUpperCase() : "";
    this.miembros = Array.isArray(miembros) ? [...miembros] : [];
    this.nombres = typeof nombres === "object" && nombres !== null ? { ...nombres } : {};
    this.creadoPor = creadoPor;
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);

    this.validar();
  }

  /**
   * Valida la integridad del hogar según los criterios de aceptación (CA-9.1 a CA-9.6).
   * @throws {Error} Si algún campo no cumple las reglas de negocio.
   * @returns {boolean} true si el modelo es válido.
   */
  validar() {
    if (!this.nombre || this.nombre.length < 3 || this.nombre.length > 40) {
      throw new Error("El nombre del hogar debe tener entre 3 y 40 caracteres.");
    }

    if (!this.codigo || !REGEX_CODIGO_HOGAR.test(this.codigo)) {
      throw new Error("El código de invitación debe tener exactamente 6 letras o números en mayúsculas.");
    }

    if (!this.creadoPor || typeof this.creadoPor !== "string") {
      throw new Error("El hogar debe estar asociado al UID del usuario creador.");
    }

    if (!Array.isArray(this.miembros) || this.miembros.length === 0) {
      throw new Error("El hogar debe contar con al menos un miembro.");
    }

    if (this.miembros.length > MAX_MIEMBROS_HOGAR) {
      throw new Error(`El hogar no puede superar el límite de ${MAX_MIEMBROS_HOGAR} miembros convivientes.`);
    }

    return true;
  }

  /**
   * Comprueba si un usuario forma parte de este hogar.
   * @param {string} usuarioId - UID a verificar.
   * @returns {boolean} true si es miembro.
   */
  esMiembro(usuarioId) {
    return typeof usuarioId === "string" && this.miembros.includes(usuarioId);
  }

  /**
   * Obtiene el nombre amigable de un miembro del hogar para mostrar en los movimientos compartidos.
   * @param {string} usuarioId - UID del miembro.
   * @returns {string} Nombre registrado o "Conviviente".
   */
  obtenerNombreMiembro(usuarioId) {
    return this.nombres[usuarioId] || "Conviviente";
  }

  /**
   * Agrega un nuevo conviviente al hogar (CA-9.2 y CA-9.3).
   * @param {string} usuarioId - UID del nuevo miembro.
   * @param {string} [nombreVisible="Conviviente"] - Nombre para identificar sus movimientos.
   * @throws {Error} Si ya es miembro o se supera el cupo máximo.
   */
  agregarMiembro(usuarioId, nombreVisible = "Conviviente") {
    if (!usuarioId || typeof usuarioId !== "string") {
      throw new Error("UID de usuario inválido.");
    }

    if (this.esMiembro(usuarioId)) {
      throw new Error("El usuario ya pertenece a este hogar.");
    }

    if (this.miembros.length >= MAX_MIEMBROS_HOGAR) {
      throw new Error(`Este hogar ya alcanzó el cupo máximo de ${MAX_MIEMBROS_HOGAR} miembros.`);
    }

    this.miembros.push(usuarioId);
    this.nombres[usuarioId] = typeof nombreVisible === "string" && nombreVisible.trim()
      ? nombreVisible.trim()
      : "Conviviente";
  }

  /**
   * Remueve a un conviviente del hogar (CA-9.7).
   * @param {string} usuarioId - UID del miembro que abandona el hogar.
   * @throws {Error} Si el usuario no pertenece al hogar.
   */
  removerMiembro(usuarioId) {
    if (!this.esMiembro(usuarioId)) {
      throw new Error("El usuario no forma parte de este hogar.");
    }

    this.miembros = this.miembros.filter((uid) => uid !== usuarioId);
    delete this.nombres[usuarioId];
  }

  /**
   * Genera un código de invitación aleatorio de 6 caracteres.
   * @static
   * @returns {string} Código de 6 caracteres.
   */
  static generarCodigo() {
    let codigo = "";
    for (let i = 0; i < 6; i++) {
      const idx = Math.floor(Math.random() * CARACTERES_CODIGO_HOGAR.length);
      codigo += CARACTERES_CODIGO_HOGAR[idx];
    }
    return codigo;
  }

  /**
   * Serializa la instancia a un objeto apto para Firestore (CA-9.1).
   * @returns {object} Objeto plano para Firestore.
   */
  aFirestore() {
    this.validar();
    return {
      nombre: this.nombre,
      codigo: this.codigo,
      miembros: [...this.miembros],
      nombres: { ...this.nombres },
      creadoPor: this.creadoPor,
      fecha: this.fecha
    };
  }

  /**
   * Reconstruye una instancia de Hogar a partir de un documento de Firestore.
   * @static
   * @param {string} id - ID del documento (código).
   * @param {object} data - Datos crudos del documento.
   * @returns {Hogar} Instancia tipada del modelo Hogar.
   */
  static desdeFirestore(id, data) {
    if (!data) throw new Error("Datos de Firestore inválidos para Hogar.");

    const fechaDoc = data.fecha && typeof data.fecha.toDate === "function"
      ? data.fecha.toDate()
      : (data.fecha instanceof Date ? data.fecha : new Date(data.fecha || Date.now()));

    return new Hogar({
      id: id || data.codigo,
      nombre: data.nombre,
      codigo: data.codigo || id,
      miembros: data.miembros || [],
      nombres: data.nombres || {},
      creadoPor: data.creadoPor,
      fecha: fechaDoc
    });
  }
}
