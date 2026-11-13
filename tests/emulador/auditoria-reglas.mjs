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
const { Bolsillo } = await import(`${REPO}/src/models/Bolsillo.js`);
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
// 1. Sin sesión no se lee ni se escribe nada en ninguna de las 6 colecciones
// ---------------------------------------------------------------------------
let A = await como("ana");
const idBolsillo = await fs.registrarBolsillo(new Bolsillo({ nombre: "Viaje", meta: 1000000, creadoPor: A }));
const idCategoria = await C.guardarCategoria("Mascotas", "gasto");
const idPrestamo = await P.registrarPrestamo({ deudor: "Pedro", monto: 100000, fecha: new Date(), nota: "", creadoPor: A });
await signOut(auth);
for (const col of ["transacciones", "bolsillos", "prestamos", "hogares", "liquidaciones", "categorias"]) {
  await denegado(() => getDocs(collection(db, col)), `sin sesión: listar ${col}`);
  await denegado(() => addDoc(collection(db, col), { creadoPor: "x", uid: "x" }), `sin sesión: escribir en ${col}`);
}
await denegado(() => getDoc(doc(db, "bolsillos", idBolsillo)), "sin sesión: leer un bolsillo por ID");
await denegado(() => getDocs(collection(db, "coleccion_inventada")), "colección no declarada (regla por defecto)");

// ---------------------------------------------------------------------------
// 2. Flujos normales de la app siguen funcionando con las reglas endurecidas
// ---------------------------------------------------------------------------
A = await como("ana");
await fs.abonarFondosBolsillo(idBolsillo, 50000, A);
ok((await getDoc(doc(db, "bolsillos", idBolsillo))).data().montoAcumulado === 50000, "app: abonar a un bolsillo");
await C.actualizarCategoria(idCategoria, { nombre: "Mascotas y veterinaria" });
ok((await getDoc(doc(db, "categorias", idCategoria))).data().nombre === "Mascotas y veterinaria", "app: renombrar categoría");
let r = await P.registrarAbonoPrestamo(idPrestamo, 30000, A);
r = await P.registrarAbonoPrestamo(idPrestamo, 20000.5, A);
ok(r.saldoPendiente === 49999.5, "app: dos abonos seguidos (con centavos)");
const hogar = await H.crearHogar("Casa Ana", { uid: A, nombre: "Ana" }, () => "AUD" + sufijo.slice(-3).toUpperCase().replace(/[^A-Z0-9]/g, "0"));
ok(!!hogar.codigo, "app: crear hogar");

// ---------------------------------------------------------------------------
// 3. Bolsillos: inyección de campos y datos fuera de rango
// ---------------------------------------------------------------------------
const bolsilloBase = { nombre: "Ahorro", meta: 1000, montoAcumulado: 0, creadoPor: A, fecha: Timestamp.now() };
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

// ---------------------------------------------------------------------------
// 6. Transacciones: textos y montos sin límite
// ---------------------------------------------------------------------------
const mov = { descripcion: "Mercado", monto: 1000, tipo: "GASTO", ambito: "PERSONAL", categoria: "Otros", creadoPor: A, fecha: Timestamp.now() };
const idMov = (await addDoc(collection(db, "transacciones"), mov)).id;
ok(!!idMov, "transacción válida escrita directo");
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
const unido = await H.unirseAHogar(hogar.codigo, { uid: B, nombre: "Beto" });
ok(unido.miembros.includes(B), "app: unirse al hogar con el código (nombre normal)");

console.log(fallos ? `\n${fallos} FALLOS` : "\nTODO PASA");
process.exit(fallos ? 1 : 0);
