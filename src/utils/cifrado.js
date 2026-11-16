/**
 * @file cifrado.js
 * @description Cifrado simétrico AES-256-GCM con la Web Crypto API (crypto.subtle), sin dependencias.
 * Funciona igual en el navegador y en Node 19+, por eso las pruebas unitarias lo cubren directamente.
 * @module utils/cifrado
 *
 * Formato de un valor cifrado (lo que se ve en la consola de Firebase):
 *
 *     enc:v1:<IV en base64, 16 caracteres>:<datos cifrados + etiqueta GCM en base64>
 *
 * - El valor original se serializa con JSON antes de cifrar, así un número vuelve como número
 *   y una lista vuelve como lista.
 * - El IV (vector de inicialización) es de 96 bits y se genera nuevo en cada cifrado, así que el mismo
 *   dato cifrado dos veces nunca produce el mismo texto.
 * - El nombre del campo se usa como "datos adicionales autenticados" (AAD): si alguien copia el valor
 *   cifrado de `monto` en `descripcion` desde la consola, el descifrado falla en vez de mostrar basura.
 * - La etiqueta de autenticación de GCM (128 bits) detecta cualquier modificación del texto cifrado.
 */

/** Prefijo que identifica un valor cifrado con la versión 1 del esquema. */
export const PREFIJO_CIFRADO = "enc:v1:";

const PATRON_CIFRADO = /^enc:v1:[A-Za-z0-9+/]{16}:[A-Za-z0-9+/]+={0,2}$/;
const BYTES_IV = 12;
const BITS_CLAVE = 256;

function webCrypto() {
  const c = globalThis.crypto;
  if (!c || !c.subtle) {
    throw new Error("Este navegador no soporta cifrado seguro (Web Crypto). Abre la app desde https o localhost.");
  }
  return c;
}

/**
 * Convierte bytes a base64.
 * @param {ArrayBuffer|Uint8Array} datos
 * @returns {string}
 */
export function aBase64(datos) {
  const bytes = datos instanceof Uint8Array ? datos : new Uint8Array(datos);
  let binario = "";
  for (let i = 0; i < bytes.length; i++) binario += String.fromCharCode(bytes[i]);
  return btoa(binario);
}

/**
 * Convierte base64 a bytes.
 * @param {string} texto
 * @returns {Uint8Array}
 */
export function deBase64(texto) {
  const binario = atob(texto);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

/**
 * Indica si un valor tiene el formato de un dato cifrado por esta app.
 * @param {*} valor
 * @returns {boolean}
 */
export function estaCifrado(valor) {
  return typeof valor === "string" && PATRON_CIFRADO.test(valor);
}

/**
 * Genera una clave AES-256 aleatoria y la devuelve en base64 (32 bytes = 44 caracteres).
 * @returns {Promise<string>}
 */
export async function generarClaveBase64() {
  const c = webCrypto();
  const clave = await c.subtle.generateKey({ name: "AES-GCM", length: BITS_CLAVE }, true, ["encrypt", "decrypt"]);
  return aBase64(await c.subtle.exportKey("raw", clave));
}

/**
 * Importa una clave AES-256 guardada en base64. La clave importada no se puede volver a exportar.
 * @param {string} claveBase64
 * @returns {Promise<CryptoKey>}
 */
export async function importarClave(claveBase64) {
  const bytes = deBase64(claveBase64);
  if (bytes.length !== BITS_CLAVE / 8) {
    throw new Error("La clave de cifrado guardada está dañada.");
  }
  return webCrypto().subtle.importKey("raw", bytes, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

const codificar = (texto) => new TextEncoder().encode(texto);

/**
 * Cifra un valor cualquiera (texto, número, lista u objeto serializable en JSON).
 * @param {CryptoKey} clave - Clave AES-GCM.
 * @param {*} valor - Valor a cifrar.
 * @param {string} [campo=""] - Nombre del campo; se autentica junto con el dato (AAD).
 * @returns {Promise<string>} Texto con el formato `enc:v1:<iv>:<datos>`.
 */
export async function cifrarValor(clave, valor, campo = "") {
  if (valor === undefined) throw new TypeError(`No se puede cifrar un valor indefinido (${campo}).`);
  const c = webCrypto();
  const iv = c.getRandomValues(new Uint8Array(BYTES_IV));
  const cifrado = await c.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: codificar(campo) },
    clave,
    codificar(JSON.stringify(valor))
  );
  return `${PREFIJO_CIFRADO}${aBase64(iv)}:${aBase64(cifrado)}`;
}

/**
 * Descifra un valor. Si el valor no está cifrado (datos guardados antes del cifrado), lo devuelve igual.
 * @param {CryptoKey} clave - Clave AES-GCM.
 * @param {*} valor - Valor leído de Firestore.
 * @param {string} [campo=""] - Nombre del campo con el que se cifró.
 * @returns {Promise<*>} Valor original.
 * @throws {Error} Si el dato fue alterado o la clave no corresponde.
 */
export async function descifrarValor(clave, valor, campo = "") {
  if (!estaCifrado(valor)) return valor;
  const [ivB64, datosB64] = valor.slice(PREFIJO_CIFRADO.length).split(":");
  try {
    const plano = await webCrypto().subtle.decrypt(
      { name: "AES-GCM", iv: deBase64(ivB64), additionalData: codificar(campo) },
      clave,
      deBase64(datosB64)
    );
    return JSON.parse(new TextDecoder().decode(plano));
  } catch {
    throw new Error(`No se pudo descifrar el campo "${campo}": la clave no corresponde o el dato fue alterado.`);
  }
}

/**
 * Devuelve una copia del objeto con los campos indicados cifrados. Los demás campos no se tocan.
 * @param {CryptoKey} clave
 * @param {object} datos
 * @param {string[]} campos
 * @returns {Promise<object>}
 */
export async function cifrarCampos(clave, datos, campos) {
  const salida = { ...datos };
  for (const campo of campos) {
    if (campo in salida && salida[campo] !== undefined) {
      salida[campo] = await cifrarValor(clave, salida[campo], campo);
    }
  }
  return salida;
}

/**
 * Devuelve una copia del objeto con los campos indicados descifrados.
 * @param {CryptoKey} clave
 * @param {object} datos
 * @param {string[]} campos
 * @returns {Promise<object>}
 */
export async function descifrarCampos(clave, datos, campos) {
  const salida = { ...datos };
  for (const campo of campos) {
    if (campo in salida) {
      salida[campo] = await descifrarValor(clave, salida[campo], campo);
    }
  }
  return salida;
}

/**
 * ¿El documento tiene algún campo cifrado? Sirve para no pedir la clave cuando son datos antiguos.
 * @param {object} datos
 * @param {string[]} campos
 * @returns {boolean}
 */
export function tieneCamposCifrados(datos, campos) {
  return campos.some((campo) => estaCifrado(datos?.[campo]));
}
