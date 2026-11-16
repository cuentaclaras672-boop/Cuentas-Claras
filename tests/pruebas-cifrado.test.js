/**
 * @file pruebas-cifrado.test.js
 * @description Suite de Pruebas Automatizadas QA - Cifrado AES-256-GCM de los datos antes de Firestore.
 * Cubre src/utils/cifrado.js (no necesita Firebase) y comprueba que los tamaños máximos que aceptan
 * las reglas (esCifrado en firestore.rules) alcanzan para el texto más largo permitido por cada modelo.
 * @module tests/pruebas-cifrado
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import {
  PREFIJO_CIFRADO,
  generarClaveBase64,
  importarClave,
  cifrarValor,
  descifrarValor,
  cifrarCampos,
  descifrarCampos,
  estaCifrado,
  tieneCamposCifrados,
  deBase64
} from "../src/utils/cifrado.js";

const PATRON_REGLAS = /^enc:v1:[A-Za-z0-9+/]{16}:[A-Za-z0-9+/]+={0,2}$/;

export async function ejecutarPruebasCifrado() {
  console.log("  -> Ejecutando pruebas de cifrado AES-256-GCM...");

  // 1. Claves
  const claveB64 = await generarClaveBase64();
  assert.equal(deBase64(claveB64).length, 32, "La clave debe tener 256 bits");
  assert.match(claveB64, /^[A-Za-z0-9+/]{43}=$/, "La clave debe cumplir esClaveAes de las reglas");
  assert.notEqual(claveB64, await generarClaveBase64(), "Cada clave generada debe ser distinta");
  await assert.rejects(() => importarClave("AAAA"), /dañada/, "Una clave de tamaño incorrecto se rechaza");
  const clave = await importarClave(claveB64);
  const otraClave = await importarClave(await generarClaveBase64());

  // 2. Ida y vuelta conservando el tipo
  for (const valor of ["Mercado semanal en el Éxito", 185400, 0.5, 0, "", [{ de: "a", para: "b", monto: 10 }], "Café ☕ ñandú"]) {
    const cifrado = await cifrarValor(clave, valor, "campo");
    assert.ok(cifrado.startsWith(PREFIJO_CIFRADO) && PATRON_REGLAS.test(cifrado), `Formato inválido para ${JSON.stringify(valor)}`);
    assert.ok(!cifrado.includes(String(valor)) || valor === "" || valor === 0, "El texto cifrado no debe contener el original");
    assert.deepEqual(await descifrarValor(clave, cifrado, "campo"), valor, `No se recuperó ${JSON.stringify(valor)}`);
  }

  // 3. El mismo dato cifrado dos veces da textos distintos (IV aleatorio)
  assert.notEqual(await cifrarValor(clave, 1000, "monto"), await cifrarValor(clave, 1000, "monto"));

  // 4. Otra clave, otro campo (AAD) o un carácter alterado: el descifrado falla
  const cifrado = await cifrarValor(clave, 185400, "monto");
  await assert.rejects(() => descifrarValor(otraClave, cifrado, "monto"), /No se pudo descifrar/);
  await assert.rejects(() => descifrarValor(clave, cifrado, "descripcion"), /No se pudo descifrar/);
  // Se cambia un carácter del centro de los datos (los del final pueden ser solo relleno de base64)
  const pos = PREFIJO_CIFRADO.length + 17 + 10;
  const alterado = cifrado.slice(0, pos) + (cifrado[pos] === "A" ? "B" : "A") + cifrado.slice(pos + 1);
  await assert.rejects(() => descifrarValor(clave, alterado, "monto"), /No se pudo descifrar/);

  // 5. Datos antiguos sin cifrar pasan sin cambios
  assert.equal(await descifrarValor(clave, "Mercado", "descripcion"), "Mercado");
  assert.equal(await descifrarValor(clave, 1000, "monto"), 1000);
  assert.equal(estaCifrado("enc:v1:<script>"), false);

  // 6. Cifrar / descifrar documentos por campos
  const transaccion = { descripcion: "Arriendo", monto: 1500000, tipo: "GASTO", ambito: "COMPARTIDO", hogarId: "K7M2QX" };
  const campos = ["descripcion", "monto", "categoria"];
  const doc = await cifrarCampos(clave, transaccion, campos);
  assert.ok(estaCifrado(doc.descripcion) && estaCifrado(doc.monto), "Los campos sensibles deben quedar cifrados");
  assert.equal(doc.tipo, "GASTO", "tipo queda en claro");
  assert.equal(doc.hogarId, "K7M2QX", "hogarId queda en claro");
  assert.ok(!("categoria" in doc), "Un campo ausente no se inventa");
  assert.ok(tieneCamposCifrados(doc, campos) && !tieneCamposCifrados(transaccion, campos));
  assert.deepEqual(await descifrarCampos(clave, doc, campos), transaccion);

  // 7. Tamaños máximos de las reglas (8 * caracteres + 48): el peor caso de cada campo debe caber
  const peorTexto = (n) => "\u0001".repeat(n); // un carácter de control ocupa 6 bytes en JSON
  const casos = [
    ["descripcion (120)", peorTexto(120), 1008],
    ["categoria (60)", peorTexto(60), 528],
    ["nombreUsuario (100)", peorTexto(100), 848],
    ["nombre bolsillo/categoría (40)", peorTexto(40), 368],
    ["deudor (60)", peorTexto(60), 528],
    ["nota (200)", peorTexto(200), 1648],
    ["texto con emojis (120)", "😀".repeat(60), 1008]
  ];
  for (const [nombre, valor, maximo] of casos) {
    const largo = (await cifrarValor(clave, valor, "c")).length;
    assert.ok(largo <= maximo, `${nombre}: ${largo} caracteres supera el máximo de las reglas (${maximo})`);
  }

  // 8. Las reglas exigen los mismos límites que se probaron arriba, y los montos siguen validándose en claro
  const reglas = fs.readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
  for (const limite of ["esCifrado(d.descripcion, 1008)", "esCifrado(d.categoria, 528)", "esCifrado(d.nombreUsuario, 848)", "esCifrado(d.nombre, 368)", "esCifrado(request.resource.data.deudor, 528)", "esCifrado(request.resource.data.nota, 1648)"]) {
    assert.ok(reglas.includes(limite), `firestore.rules debe contener ${limite}`);
  }
  assert.ok(reglas.includes("d.monto is number && d.monto > 0"), "Las reglas deben seguir validando el monto en claro");

  console.log("  ✓ AES-256-GCM: ida y vuelta, IV aleatorio, clave/campo/alteración detectados, datos antiguos y tamaños de reglas.");
}
