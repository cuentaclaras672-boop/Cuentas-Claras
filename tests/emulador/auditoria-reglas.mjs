/**
 * @file auditoria-reglas.mjs
 * @description Pruebas de penetración simuladas sobre firestore.rules - Tarea 14.1 / HU-14 (CA-14.1).
 * Responsable: Daniel Cortes.
 *
 * Se salta los servicios de la app y escribe directo con el SDK, como lo haría alguien que abre la
 * consola del navegador. Cada intento malicioso debe terminar en permission-denied, y los flujos
 * normales de la app (usando los servicios reales de src/services) deben seguir funcionando.
 *
 * Uso (ver tests/emulador/README.md):
 *   npx firebase emulators:exec --only firestore,auth --project bdcuentasclaras-b1814 \
 *     "node --import ./tests/emulador/registrar.mjs tests/emulador/auditoria-reglas.mjs ."
 */

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const REPO = pathToFileURL(resolve(process.argv[2] || ".")).href;
const { auth } = await import(`${REPO}/src/services/auth.js`);
const { db } = await import(`${REPO}/src/services/firestore.js`);
const fs = await import(`${REPO}/src/services/firestore.js`);
const P = await import(`${REPO}/src/services/prestamos.js`);
const H = await import(`${REPO}/src/services/hogares.js`);
const C = await import(`${REPO}/src/services/categorias.js`);
const L = await import(`${REPO}/src/services/liquidaciones.js`);
const K = await import(`${REPO}/src/services/claves.js`);
const { cifrarValor, descifrarValor, estaCifrado } = await import(`${REPO}/src/utils/cifrado.js`);
const { Bolsillo } = await import(`${REPO}/src/models/Bolsillo.js`);
const { Transaccion } = await import(`${REPO}/src/models/Transaccion.js`);
import { connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  connectFirestoreEmulator, doc, getDoc, getDocs, updateDoc, setDoc, addDoc, collection, query, where, Timestamp, arrayUnion
} from "firebase/firestore";

connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
connectFirestoreEmulator(db, "127.0.0.1", 8080);
console.error = () => {}; console.warn = () => {};

let fallos = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASA " : "FALLA"} ${msg}`); if (!cond) fallos++; };
const denegado = async (fn, msg) => {
  try { await fn(); ok(false, `${msg} (la regla lo permitió)`); }
  catch (e) { ok(e.code === "permission-denied" || /Acceso denegado/.test(e.message), `${msg} -> ${e.code || e.message}`); }
};
const sufijo = Date.now().toString(36);
const uids = {};
for (const n of ["ana", "beto"]) {
  uids[n] = (await createUserWithEmailAndPassword(auth, `${n}.${sufijo}@x.co`, "secreto1")).user.uid;
}
const como = async (n) => { await signInWithEmailAndPassword(auth, `${n}.${sufijo}@x.co`, "secreto1"); return uids[n]; };
const largo = (n) => "x".repeat(n);

// ---------------------------------------------------------------------------
// 1. Sin sesión no se lee ni se escribe nada en ninguna de las 8 colecciones
// ---------------------------------------------------------------------------
let A = await como("ana");
const idBolsillo = await fs.registrarBolsillo(new Bolsillo({ nombre: "Viaje", meta: 1000000, creadoPor: A }));
const idCategoria = await C.guardarCategoria("Mascotas", "gasto");
const idPrestamo = await P.registrarPrestamo({ deudor: "Pedro", monto: 100000, fecha: new Date(), nota: "", creadoPor: A });
await signOut(auth);
for (const col of ["transacciones", "bolsillos", "prestamos", "hogares", "liquidaciones", "categorias", "clavesUsuario", "clavesHogar"]) {
  await denegado(() => getDocs(collection(db, col)), `sin sesión: listar ${col}`);
  await denegado(() => addDoc(collection(db, col), { creadoPor: "x", uid: "x" }), `sin sesión: escribir en ${col}`);
}
await denegado(() => getDoc(doc(db, "bolsillos", idBolsillo)), "sin sesión: leer un bolsillo por ID");
await denegado(() => getDocs(collection(db, "coleccion_inventada")), "colección no declarada (regla por defecto)");

// ---------------------------------------------------------------------------
// 2. Flujos normales de la app siguen funcionando con las reglas endurecidas
// ---------------------------------------------------------------------------
A = await como("ana");
const claveA = await K.obtenerClaveUsuario(A);
const cifrar = (v, campo) => cifrarValor(claveA, v, campo);
await fs.abonarFondosBolsillo(idBolsillo, 50000, A);
ok((await getDoc(doc(db, "bolsillos", idBolsillo))).data().montoAcumulado === 50000, "app: abonar a un bolsillo");
await C.actualizarCategoria(idCategoria, { nombre: "Mascotas y veterinaria" });
let crudo = (await getDoc(doc(db, "categorias", idCategoria))).data();
ok(estaCifrado(crudo.nombre) && await descifrarValor(claveA, crudo.nombre, "nombre") === "Mascotas y veterinaria",
  "app: renombrar categoría (el nombre queda cifrado)");
ok((await C.obtenerCategorias()).some((c) => c.nombre === "Mascotas y veterinaria"), "app: listar categorías descifradas");
let r = await P.registrarAbonoPrestamo(idPrestamo, 30000, A);
r = await P.registrarAbonoPrestamo(idPrestamo, 20000.5, A);
ok(r.saldoPendiente === 49999.5, "app: dos abonos seguidos (con centavos)");
crudo = (await getDoc(doc(db, "prestamos", idPrestamo))).data();
ok(estaCifrado(crudo.deudor) && estaCifrado(crudo.nota) && crudo.monto === 100000 && crudo.totalAbonado === 50000.5,
  "app: el préstamo guarda deudor y nota cifrados y los montos en claro");
crudo = (await getDoc(doc(db, "bolsillos", idBolsillo))).data();
ok(estaCifrado(crudo.nombre) && crudo.montoAcumulado === 50000, "app: el bolsillo guarda el nombre cifrado y el saldo en claro");
const hogar = await H.crearHogar("Casa Ana", { uid: A, nombre: "Ana" }, () => "AUD" + sufijo.slice(-3).toUpperCase().replace(/[^A-Z0-9]/g, "0"));
ok(!!hogar.codigo, "app: crear hogar");

// ---------------------------------------------------------------------------
// 3. Bolsillos: inyección de campos y datos fuera de rango
// ---------------------------------------------------------------------------
const bolsilloBase = { nombre: await cifrar("Ahorro", "nombre"), meta: 1000, montoAcumulado: 0, creadoPor: A, fecha: Timestamp.now() };
ok(!!(await addDoc(collection(db, "bolsillos"), bolsilloBase)).id, "bolsillo con nombre cifrado escrito directo");
await denegado(() => addDoc(collection(db, "bolsillos"), { ...bolsilloBase, nombre: "Ahorro" }), "bolsillo con nombre sin cifrar");
await denegado(() => addDoc(collection(db, "bolsillos"), { ...bolsilloBase, esAdmin: true }), "bolsillo con campo extra");
await denegado(() => addDoc(collection(db, "bolsillos"), { ...bolsilloBase, nombre: largo(5000) }), "bolsillo con nombre de 5000 caracteres");
await denegado(() => addDoc(collection(db, "bolsillos"), { ...bolsilloBase, fecha: "ayer" }), "bolsillo con fecha que no es timestamp");
await denegado(() => updateDoc(doc(db, "bolsillos", idBolsillo), { creadoPor: uids.beto }), "regalar el bolsillo a otro usuario");
await denegado(() => updateDoc(doc(db, "bolsillos", idBolsillo), { fecha: Timestamp.fromDate(new Date(2000, 0, 1)) }), "cambiar la fecha de creación del bolsillo");
await denegado(() => updateDoc(doc(db, "bolsillos", idBolsillo), { nombre: 12345 }), "nombre de bolsillo que no es texto");
await denegado(() => updateDoc(doc(db, "bolsillos", idBolsillo), { montoAcumulado: -1 }), "monto acumulado negativo");

// ---------------------------------------------------------------------------
// 4. Categorías: la actualización antes aceptaba cualquier cosa
// ---------------------------------------------------------------------------
await denegado(() => updateDoc(doc(db, "categorias", idCategoria), { nombre: largo(1000) }), "categoría con nombre de 1000 caracteres");
await denegado(() => updateDoc(doc(db, "categorias", idCategoria), { nombre: "Comida" }), "categoría con nombre sin cifrar");
await denegado(() => updateDoc(doc(db, "categorias", idCategoria), { payload: largo(100) }), "categoría con campo extra");
await denegado(() => updateDoc(doc(db, "categorias", idCategoria), { tipo: "admin" }), "categoría con tipo inválido");
await denegado(() => addDoc(collection(db, "categorias"), { uid: A, nombre: "Ok nombre", extra: 1 }), "crear categoría con campo extra");

// ---------------------------------------------------------------------------
// 5. Préstamos: reescribir el historial de abonos
// ---------------------------------------------------------------------------
const snapP = (await getDoc(doc(db, "prestamos", idPrestamo))).data();
await denegado(() => updateDoc(doc(db, "prestamos", idPrestamo), {
  abonos: [{ monto: 1, fecha: Timestamp.now() }, snapP.abonos[1], { monto: 10, fecha: Timestamp.now() }],
  totalAbonado: snapP.totalAbonado + 10, estado: "PENDIENTE"
}), "cambiar un abono anterior al agregar uno nuevo");
await denegado(() => updateDoc(doc(db, "prestamos", idPrestamo), {
  abonos: [...snapP.abonos, { monto: 1, fecha: Timestamp.now() }],
  totalAbonado: snapP.totalAbonado + 40000, estado: "PENDIENTE"
}), "abono de 1 que sube el total en 40000");
await denegado(() => updateDoc(doc(db, "prestamos", idPrestamo), {
  abonos: [...snapP.abonos, { monto: 10, fecha: Timestamp.now(), basura: largo(10000) }],
  totalAbonado: snapP.totalAbonado + 10, estado: "PENDIENTE"
}), "abono con campos extra");
await denegado(() => updateDoc(doc(db, "prestamos", idPrestamo), {
  abonos: [...snapP.abonos, { monto: 10, fecha: "hoy" }],
  totalAbonado: snapP.totalAbonado + 10, estado: "PENDIENTE"
}), "abono con fecha que no es timestamp");
await denegado(() => addDoc(collection(db, "prestamos"), {
  deudor: "Pedro", monto: 100, fecha: Timestamp.now(), nota: "", abonos: [], totalAbonado: 0, estado: "PENDIENTE", creadoPor: A
}), "préstamo con deudor y nota sin cifrar");

// ---------------------------------------------------------------------------
// 6. Transacciones: textos y montos sin límite
// ---------------------------------------------------------------------------
const movPlano = { descripcion: "Mercado", monto: 1000, tipo: "GASTO", ambito: "PERSONAL", categoria: "Otros", creadoPor: A, fecha: Timestamp.now() };
const mov = { ...movPlano, descripcion: await cifrar("Mercado", "descripcion"), categoria: await cifrar("Otros", "categoria") };
const idMov = (await addDoc(collection(db, "transacciones"), mov)).id;
ok(!!idMov, "transacción con textos cifrados escrita directo");
await denegado(() => addDoc(collection(db, "transacciones"), movPlano), "transacción con textos sin cifrar (como antes)");
await denegado(() => addDoc(collection(db, "transacciones"), { ...mov, monto: -5 }), "monto negativo (el servidor sigue validando el dinero)");
await denegado(() => addDoc(collection(db, "transacciones"), { ...mov, descripcion: "enc:v1:<script>alert(1)</script>" }), "descripción con formato de cifrado falso");
await denegado(() => addDoc(collection(db, "transacciones"), { ...mov, nombreUsuario: largo(5000) }), "nombre de autor de 5000 caracteres");
await denegado(() => addDoc(collection(db, "transacciones"), { ...mov, monto: 1e15 }), "monto absurdo (1e15)");
await denegado(() => addDoc(collection(db, "transacciones"), { ...mov, creadoPor: uids.beto }), "transacción a nombre de otro");
await denegado(() => updateDoc(doc(db, "transacciones", idMov), { hogarId: hogar.codigo }), "mover un movimiento a un hogar después de creado");

// ---------------------------------------------------------------------------
// 7. Hogares y aislamiento entre usuarios
// ---------------------------------------------------------------------------
let B = await como("beto");
await denegado(() => updateDoc(doc(db, "hogares", hogar.codigo), {
  miembros: arrayUnion(B), [`nombres.${B}`]: largo(500)
}), "unirse a un hogar con nombre de 500 caracteres");
await denegado(() => updateDoc(doc(db, "hogares", hogar.codigo), {
  miembros: arrayUnion(B), [`nombres.${B}`]: { html: "<script>" }
}), "unirse a un hogar con un nombre que no es texto");
await denegado(() => getDoc(doc(db, "bolsillos", idBolsillo)), "Beto lee el bolsillo de Ana");
await denegado(() => getDoc(doc(db, "categorias", idCategoria)), "Beto lee la categoría de Ana");
await denegado(() => getDocs(query(collection(db, "transacciones"), where("creadoPor", "==", A))), "Beto consulta los movimientos de Ana");
await denegado(() => getDocs(collection(db, "hogares")), "Beto lista todos los hogares");
await denegado(() => setDoc(doc(db, "liquidaciones", `${hogar.codigo}_2026-11`), {
  hogarId: hogar.codigo, periodo: "2026-11", transferencias: [], saldadaPor: B, fecha: Timestamp.now()
}), "Beto salda el mes de un hogar ajeno");
await denegado(() => getDoc(doc(db, "clavesUsuario", A)), "Beto lee la clave personal de Ana");
await denegado(() => getDoc(doc(db, "clavesHogar", hogar.codigo)), "Beto lee la clave del hogar sin ser miembro");
const unido = await H.unirseAHogar(hogar.codigo, { uid: B, nombre: "Beto" });
ok(unido.miembros.includes(B), "app: unirse al hogar con el código (nombre normal)");

// ---------------------------------------------------------------------------
// 8. Cifrado de extremo a extremo entre miembros del hogar
// ---------------------------------------------------------------------------
K.limpiarClavesEnMemoria();
A = await como("ana");
const idCompartido = await fs.registrarTransaccion(new Transaccion({
  descripcion: "Arriendo noviembre", monto: 1500000, tipo: "GASTO", ambito: "COMPARTIDO",
  categoria: "Vivienda y Alquiler", creadoPor: A, nombreUsuario: "Ana"
}), hogar.codigo);
const idPersonal = await fs.registrarTransaccion(new Transaccion({
  descripcion: "Regalo sorpresa", monto: 80000, tipo: "GASTO", ambito: "PERSONAL",
  categoria: "Otros", creadoPor: A, nombreUsuario: "Ana"
}), hogar.codigo);
crudo = (await getDoc(doc(db, "transacciones", idCompartido))).data();
ok(["descripcion", "categoria", "nombreUsuario"].every((c) => estaCifrado(crudo[c])) && crudo.monto === 1500000 &&
  crudo.tipo === "GASTO" && crudo.ambito === "COMPARTIDO" && crudo.hogarId === hogar.codigo,
  "app: en Firestore los textos quedan cifrados (monto, tipo, ámbito y hogar en claro)");
const claveHogarA = await K.obtenerClaveHogar(hogar.codigo, A);
await denegado(async () => setDoc(doc(db, "clavesHogar", hogar.codigo), { clave: "A".repeat(43) + "=", creadoPor: A }), "reemplazar la clave del hogar");
await denegado(async () => updateDoc(doc(db, "clavesUsuario", A), { clave: "A".repeat(43) + "=" }), "cambiar la clave personal");
const escuchar = (uid) => new Promise((ok_, mal) => {
  let parar = () => {};
  parar = fs.escucharTransacciones(uid, (lista) => { parar(); ok_(lista); }, mal, hogar.codigo);
});
let lista = await escuchar(A);
ok(lista.some((t) => t.descripcion === "Arriendo noviembre" && t.monto === 1500000) &&
  lista.some((t) => t.descripcion === "Regalo sorpresa"), "app: Ana ve sus movimientos descifrados");

K.limpiarClavesEnMemoria();
B = await como("beto");
lista = await escuchar(B);
ok(lista.some((t) => t.id === idCompartido && t.descripcion === "Arriendo noviembre" && t.nombreUsuario === "Ana"),
  "app: Beto (miembro) descifra el movimiento compartido de Ana con la clave del hogar");
ok(!lista.some((t) => t.id === idPersonal), "app: Beto no ve el movimiento personal de Ana");
const claveHogarB = await K.obtenerClaveHogar(hogar.codigo, B);
ok(await descifrarValor(claveHogarB, crudo.descripcion, "descripcion") === "Arriendo noviembre", "Ana y Beto comparten la misma clave de hogar");
let errorClave = "";
try { await descifrarValor(await K.obtenerClaveUsuario(B), crudo.descripcion, "descripcion"); } catch (e) { errorClave = e.message; }
ok(/No se pudo descifrar/.test(errorClave), "con la clave personal de Beto no se puede leer lo cifrado con la del hogar");

const periodo = L.periodoDe(new Date());
await L.marcarLiquidacionSaldada(unido, periodo, [{ de: B, para: A, monto: 750000 }], B);
const liq = await new Promise((ok_, mal) => { const parar = L.escucharLiquidacion(hogar.codigo, periodo, (v) => { if (v) { parar(); ok_(v); } }, mal); });
ok(liq.transferencias[0].monto === 750000 && liq.transferencias[0].para === A, "app: la liquidación se guarda y se lee");

// Alteración desde la consola: copiar la categoría cifrada en la descripción. Las reglas no pueden notarlo
// (ambos tienen formato válido), pero AES-GCM sí: la app descarta el registro en vez de mostrar basura.
K.limpiarClavesEnMemoria();
A = await como("ana");
const original = (await getDoc(doc(db, "transacciones", idPersonal))).data();
await updateDoc(doc(db, "transacciones", idPersonal), { descripcion: original.categoria });
lista = await escuchar(A);
ok(!lista.some((t) => t.id === idPersonal) && lista.some((t) => t.id === idCompartido),
  "dato alterado en la consola: AES-GCM lo detecta y la app lo omite");

// ---------------------------------------------------------------------------
// 9. Validación al leer: datos mal formados o cifrados con otra clave se omiten uno por uno
//    (las reglas no ven el contenido cifrado, así que esto lo escribe un "cliente modificado")
// ---------------------------------------------------------------------------
const claveAjena = await crypto.subtle.importKey("raw", crypto.getRandomValues(new Uint8Array(32)), "AES-GCM", false, ["encrypt"]);
const primeraLista = (escucharFn) => new Promise((ok_, mal) => {
  let parar = () => {};
  parar = escucharFn((lista) => { parar(); ok_(lista); }, mal);
});
const leerBolsillos = () => primeraLista((ok_, mal) => fs.escucharBolsillos(A, ok_, mal));
const leerPrestamos = () => primeraLista((ok_, mal) => P.escucharPrestamos(A, ok_, mal));

const idBolsilloCorto = (await addDoc(collection(db, "bolsillos"), { ...bolsilloBase, nombre: await cifrar("ab", "nombre") })).id;
const idBolsilloAjeno = (await addDoc(collection(db, "bolsillos"), { ...bolsilloBase, nombre: await cifrarValor(claveAjena, "Viaje", "nombre") })).id;
let bolsillos = await leerBolsillos();
ok(!bolsillos.some((b) => b.id === idBolsilloCorto), "al leer: bolsillo con nombre de 2 letras (cifrado) se omite");
ok(!bolsillos.some((b) => b.id === idBolsilloAjeno), "al leer: bolsillo cifrado con otra clave se omite");
ok(bolsillos.some((b) => b.id === idBolsillo && b.nombre === "Viaje"), "al leer: los demás bolsillos siguen apareciendo");

const prestamoBase = { monto: 1000, fecha: Timestamp.now(), nota: await cifrar("", "nota"), abonos: [], totalAbonado: 0, estado: "PENDIENTE", creadoPor: A };
const idPrestamoCorto = (await addDoc(collection(db, "prestamos"), { ...prestamoBase, deudor: await cifrar("ab", "deudor") })).id;
const idPrestamoAjeno = (await addDoc(collection(db, "prestamos"), { ...prestamoBase, deudor: await cifrarValor(claveAjena, "Pedro", "deudor") })).id;
const idPrestamoBueno = (await addDoc(collection(db, "prestamos"), { ...prestamoBase, deudor: await cifrar("Lucía", "deudor") })).id;
const prestamos = await leerPrestamos();
ok(!prestamos.some((p) => p.id === idPrestamoCorto), "al leer: préstamo con deudor de 2 letras (cifrado) se omite");
ok(!prestamos.some((p) => p.id === idPrestamoAjeno), "al leer: préstamo cifrado con otra clave se omite");
ok(prestamos.some((p) => p.id === idPrestamoBueno && p.deudor === "Lucía"), "al leer: los demás préstamos siguen apareciendo");

const idMovCorto = (await addDoc(collection(db, "transacciones"), { ...mov, descripcion: await cifrar("ab", "descripcion"), fecha: Timestamp.now() })).id;
lista = await escuchar(A);
ok(!lista.some((t) => t.id === idMovCorto) && lista.some((t) => t.id === idCompartido),
  "al leer: movimiento con descripción de 2 letras (cifrada) se omite y el resto sigue");

console.log(fallos ? `\n${fallos} FALLOS` : "\nTODO PASA");
process.exit(fallos ? 1 : 0);
