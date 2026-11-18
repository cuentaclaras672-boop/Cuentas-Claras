# Acta de Sprint Planning — Sprint 6 (Cifrado AES-256-GCM, Despliegue y Cierre)
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Fecha del Planning:** 14 de noviembre de 2026 (actualización de alcance con HU-18 el 16 de noviembre de 2026)  
**Duración del Sprint:** 2 semanas (14 de noviembre al 27 de noviembre de 2026)  
**Hito Crítico Evaluativo:** **Parcial Corte III y Sustentación Final (21 de noviembre de 2026)**  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad en el Sprint 6 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Priorización de HU-18 junto con HU-16/17, integración en UI de préstamos a terceros y gestión completa de categorías personalizadas, verificación UAT y guía de sustentación Corte III. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilitación de cierre semestral, auditoría final de DoD/DoR, verificación de las 13 suites QA en `tests/runner.js` e informe final de pruebas. |
| **Development Team** | Daniel Felipe Cortes | Diseño e implementación de cifrado extremo a extremo AES-256-GCM (`src/utils/cifrado.js`, `src/services/claves.js`), reglas de 8 colecciones en `firestore.rules`, suite de 88 casos en emulador y configuración Firebase CLI (`firebase.json`, `.firebaserc`, `docs/guia-despliegue.md`). |
| **Development Team** | Jorman Palacios Murillo | Interfaz de préstamos a terceros (`#seccion-prestamos`, tarjeta `#resumen-por-cobrar`), indicador `#badge-cifrado` y pruebas visuales de aceptación (desktop/móvil y vista PDF). |
| **Development Team** | Yerson Niño Guerrero | Validación defensiva al leer documentos descifrados (`prestamos.js`, `liquidaciones.js`, `categorias.js`), verificación de integridad de CSV y soporte documental final. |

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Incorporar cifrado extremo a extremo AES-256-GCM en el navegador para todos los textos y montos financieros antes de enviarlos a Firestore, completar la interfaz operativa de préstamos y categorías personalizadas, desplegar Cuentas Claras en Firebase Hosting con sus 8 colecciones blindadas y API Key restringida por dominio, y certificar las 13 suites QA y la guía de sustentación del Parcial Corte III (21 de noviembre de 2026)."*

---

## 3. Capacidad y Velocidad Acumulada

- **Velocidad histórica acumulada (Sprints 1–5):**
  - Sprint 1: 15 SP (100% efectividad · 3 HUs)
  - Sprint 2: 21 SP (100% efectividad · 4 HUs)
  - Sprint 3: 16 SP (100% efectividad · 3 HUs)
  - Sprint 4: 16 SP (100% efectividad · 3 HUs)
  - Sprint 5: 13 SP (100% efectividad · 2 HUs)
  - **Total completado previo al Sprint 6:** **81 Story Points (15 HUs)**.
- **Capacidad comprometida y completada en Sprint 6:** **21 Story Points (3 HUs: HU-16, HU-17 y HU-18)**, alcanzando un total semestral de **102 Story Points (18 Historias de Usuario)**.
- **Observación de adelanto técnico:** El 13 de noviembre Daniel Cortes dejó adelantados los artefactos **Tarea 16.1** (`.firebaserc`, `firebase.json`) y **Tarea 16.2** (`docs/guia-despliegue.md`), permitiendo dedicar capacidad de ingeniería en los días 16–18 de noviembre al cifrado AES-256-GCM (**HU-18**) y al cierre integral de interfaz y documentación.

---

## 4. Historias de Usuario Seleccionadas (Sprint Backlog)

### [HU-18] Seguridad de los datos mediante cifrado AES-256-GCM en cliente
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 1 (Privacidad criptográfica extremo a extremo en Firestore).
- **Condiciones técnicas que refuerza:** #1 (Persistencia Real), #2 (Control de Acceso y Privacidad) y #5 (Manejo de Errores y Validación Defensiva al Leer).
- **Descripción:** Como miembro de un hogar que registra sus finanzas en Cuentas Claras, quiero que las descripciones, categorías, nombres de deudores, notas, nombres de bolsillos y montos se guarden cifrados en el navegador antes de enviarse a Firestore, para que nadie que mire la consola de Firebase pueda leer en qué gasto mi dinero, cuánto ni a quién le presto.
- **Documentación de diseño detallada:** [`docs/cifrado-datos.md`](cifrado-datos.md).

#### Criterios de Aceptación:
- **CA-18.1:** Los campos sensibles de `transacciones`, `bolsillos`, `prestamos`, `liquidaciones` y `categorias` se cifran en el navegador con AES-256-GCM (Web Crypto API, IV aleatorio de 96 bits y nombre del campo como AAD) bajo el formato `enc:v1:<iv>:<datos>`.
- **CA-18.2:** Los montos (`transacciones.monto`, `bolsillos.meta`, `bolsillos.montoAcumulado`, `prestamos.monto`, `prestamos.totalAbonado`, `abonos[].monto` y `liquidaciones.transferencias`) también se almacenan cifrados; `abonarFondosBolsillo` y `registrarAbonoPrestamo` operan con `runTransaction`.
- **CA-18.3:** Cada usuario posee una clave en `clavesUsuario/{uid}` y cada hogar una clave compartida en `clavesHogar/{codigo}` creadas de forma atómica con `runTransaction` y protegidas contra modificación o borrado en `firestore.rules`.
- **CA-18.4:** `firestore.rules` exige formato cifrado (`esCifrado` y `esNumeroCifrado`) con límite de longitud (`8 * caracteres + 48` y `100` para números) y rechaza datos sensibles en texto plano.
- **CA-18.5:** Al leer, cualquier documento alterado, mal formado o con valores fuera de rango tras descifrar se descarta individualmente sin romper el resto de la lista; los datos antiguos previos al cifrado siguen leyéndose con retrocompatibilidad.
- **CA-18.6:** Al cerrar sesión (`cerrarSesion()` en `src/services/auth.js`), las claves en memoria se limpian (`limpiarClavesEnMemoria()`).
- **CA-18.7:** Pasan la suite `tests/pruebas-cifrado.test.js` en `node tests/runner.js` (13/13 suites) y la auditoría en emulador `tests/emulador/auditoria-reglas.mjs` (88 casos).

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Estado |
|---|---|---|---:|
| **18.1** | Módulo `src/utils/cifrado.js` (AES-256-GCM, IV 96 bits, AAD) y llavero `src/services/claves.js` (`clavesUsuario`, `clavesHogar`) | Daniel Cortes | ✅ **Done** (`a3d4478`) |
| **18.2** | Cifrado de textos y montos en `firestore.js`, `prestamos.js`, `liquidaciones.js`, `categorias.js`, limpieza en `auth.js` y validación al leer | Daniel Cortes / Yerson Niño | ✅ **Done** (`a3d4478`, `0782778`) |
| **18.3** | Reglas `esCifrado`/`esNumeroCifrado`/`esClaveAes` en `firestore.rules` (8 colecciones), `tests/pruebas-cifrado.test.js` (Suite #13), `auditoria-reglas.mjs` (88 casos) y `docs/cifrado-datos.md` | Daniel Cortes / Fabián Córdoba | ✅ **Done** (`0782778`) |

---

### [HU-16] Despliegue en producción en Firebase Hosting, completitud UI y endurecimiento operativo
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 1 (Disponibilidad pública, completitud funcional en UI y seguridad operativa).
- **Condiciones técnicas que consolida:** #2 (Control de Acceso), #4 (Filtrado), #6 (Repositorio y Despliegue) y #7 (Documentación Operativa).
- **Descripción:** Como equipo de ingeniería, queremos publicar la aplicación web estática y las reglas `firestore.rules` (8 colecciones) en el proyecto Firebase `bdcuentasclaras-b1814`, restringiendo los dominios autorizados y la API Key de cliente web y asegurando que el 100% de los módulos del backlog (incluidos préstamos a terceros y edición/borrado de categorías personalizadas) estén operativos en la interfaz.

#### Criterios de Aceptación:
- **CA-16.1:** Configuración declarativa de Hosting y Firestore Rules en `firebase.json` y `.firebaserc` sirviendo `public/` y `src/` con cabeceras de seguridad y `Cache-Control: no-cache`, más `package.json` con `"type": "module"` excluido del despliegue.
- **CA-16.2:** Procedimiento documentado y listo en `docs/guia-despliegue.md` para publicar las 8 colecciones de `firestore.rules`, desplegar Hosting y restringir la `apiKey` por referente HTTP y APIs en Google Cloud Console.
- **CA-16.3:** Validación explícita del aviso de baja de Firebase Dynamic Links en Consola Auth, confirmando que `src/services/auth.js` usa exclusivamente `createUserWithEmailAndPassword` y `signInWithEmailAndPassword`.
- **CA-16.4:** Interfaz 100% conectada para todos los módulos del dominio: tarjeta `#resumen-por-cobrar` y sección `#seccion-prestamos` (crear préstamo, filtrar por estado, abonar y eliminar con cifrado AES-256-GCM), botones `#btn-editar-categoria` y `#btn-eliminar-categoria` en el formulario de transacciones e indicador `#badge-cifrado` en cabecera, corriendo sin errores en consola (F12).

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Estado |
|---|---|---|---:|
| **16.1** | Definir `firebase.json`, `.firebaserc` y `package.json` ESM para Hosting, `firestore.rules` y runner QA sin warnings | Daniel Cortes / Juan Diego Peraza | ✅ **Done** (`79315bd`) |
| **16.2** | Documentar `docs/guia-despliegue.md` (restricción de API Key, dominios Auth y reglas de 8 colecciones) | Daniel Cortes | ✅ **Done** (`2f0638f`) |
| **16.3** | Integración final en UI de Préstamos a Terceros (`#seccion-prestamos`, `#resumen-por-cobrar`), edición/borrado de categorías (`#btn-editar-categoria`, `#btn-eliminar-categoria`) e indicador `#badge-cifrado` | Juan Diego Peraza / Jorman Palacios | ✅ **Done** |
| **16.4** | Verificación UAT integral (Auth, Hogar, Cuadre, Bolsillos, Préstamos, Categorías, CSV, PDF y Cifrado AES-256-GCM sin errores F12) | Jorman Palacios / Yerson Niño | ✅ **Done** |

---

### [HU-17] Preparación de sustentación técnica integral y auditoría final de cierre
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Evaluación Corte III y cierre formal).
- **Condiciones técnicas que consolida:** #6 (Repositorio) y #7 (Documentación Integral).
- **Descripción:** Como equipo Scrum, queremos consolidar las evidencias de calidad, matriz de cumplimiento de las 7 condiciones técnicas, actas de cierre y guía de sustentación con simulacros de modificación en vivo, para garantizar una sustentación sobresaliente del Parcial Corte III (21/11/2026) y el cierre administrativo del semestre.

#### Criterios de Aceptación:
- **CA-17.1:** 100% de actas, bitácoras, DoR/DoD, `README.md`, `docs/sprint-goals.md`, `docs/acta-review-sprint6.md` y `docs/informe-pruebas-sprint6.md` actualizados y sincronizados con las 18 Historias de Usuario (102 SP).
- **CA-17.2:** Suite `node tests/runner.js` aprobando las **13 suites al 100% PASS** (0 advertencias en consola) y auditoría en emulador con **88 casos**.
- **CA-17.3:** Guía maestra de sustentación final (`docs/guia-sustentacion-corte3.md`) con mapa completo de archivos, explicación de cifrado AES-256-GCM, cuadre Greedy, resiliencia y exportación CSV/PDF, más simulacros de código en vivo.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Estado |
|---|---|---|---:|
| **17.1** | Elaborar `docs/guia-sustentacion-corte3.md` y protocolo de demo en vivo para el Parcial Corte III | Juan Diego Peraza / Daniel Cortes | ✅ **Done** |
| **17.2** | Retrospectiva final del Sprint 6, `docs/acta-review-sprint6.md` e `docs/informe-pruebas-sprint6.md` (13 suites QA) | Fabián Córdoba / Todo el equipo | ✅ **Done** |

---

## 5. Resumen de Cargas de Trabajo (Sprint 6)

| Integrante | Tareas Asignadas | SP Estimados | Estado Final |
|---|---|:---:|---|
| **Daniel Felipe Cortes** | Tareas **16.1**, **16.2**, **18.1**, **18.2**, **18.3** y apoyo en **17.1** | 8 SP | ✅ 100% Completado |
| **Juan Diego Peraza Amado** | Tareas **16.1**, **16.3**, **17.1** y consolidación documental de cierre | 5 SP | ✅ 100% Completado |
| **Fabián Eduardo Córdoba** | Tareas **18.3** (QA), **17.2** (certificación 13 suites, retrospectiva e informe S6) | 3 SP | ✅ 100% Completado |
| **Jorman Palacios Murillo** | Tareas **16.3** (UI préstamos/categorías/badge cifrado) y **16.4** (UAT visual y PDF) | 3 SP | ✅ 100% Completado |
| **Yerson Niño Guerrero** | Tareas **18.2** (validación al leer), **16.4** (UAT datos y CSV) y **17.2** | 2 SP | ✅ 100% Completado |
| **Total Sprint 6** | **9 tareas técnicas (`16.1–16.4`, `17.1–17.2`, `18.1–18.3`)** | **21 SP** | ✅ **9 / 9 Cerradas (Done)** |

---

## 6. Definición de Terminado (DoD) para Sprint 6

1. Cifrado AES-256-GCM activo para textos y montos sensibles en las 5 colecciones financieras, con llaveros `clavesUsuario` y `clavesHogar` protegidos en `firestore.rules` (8 colecciones + `deny-all`).
2. Interfaz completa y sin errores de consola (F12) tanto para transacciones, bolsillos y hogar como para préstamos a terceros (`#seccion-prestamos`) y edición/borrado de categorías personalizadas.
3. Ejecutor `node tests/runner.js` reportando **13 / 13 suites aprobadas (100% PASS)** sin advertencias de módulos y **88 / 88 casos** en el emulador de reglas.
4. Documentación técnica, guía de despliegue y guía de sustentación Corte III completadas al 100%.
