# Bitácora de Seguimiento — Sprint 6 (Cifrado AES-256-GCM, Prep. Despliegue y Cierre)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Product Owner:** Juan Diego Peraza Amado  
**Periodo:** 14 de noviembre al 27 de noviembre de 2026 (Parcial Corte III: 21 de noviembre)  

---

## 1. Resumen Ejecutivo del Sprint 6

El Sprint 6 culmina el desarrollo semestral de **Cuentas Claras** incorporando cifrado criptográfico de extremo a extremo en el navegador con **AES-256-GCM (Web Crypto API)** tanto para textos como para montos financieros (**HU-18**, 8 SP), completando la integración en interfaz de usuario para préstamos a terceros (`#seccion-prestamos`, tarjeta `#resumen-por-cobrar`), edición y borrado de categorías personalizadas e indicador visual `#badge-cifrado` junto con la preparación operativa de Firebase Hosting y restricción de API Key para el MVP local (**HU-16**, 8 SP), y consolidando la suite de **13 pruebas automatizadas (100% PASS)**, la auditoría de **88 casos en emulador** y la guía maestra de sustentación final (**HU-17**, 5 SP).

| Métrica | Planificado | Resultado Final del Sprint 6 |
|---|:---:|:---:|
| **Story Points (SP)** | 21 SP (`HU-16`: 8 · `HU-17`: 5 · `HU-18`: 8) | ✅ **21 SP Cumplidos (100% · 102 SP Totales)** |
| **Historias de Usuario** | 3 historias (`HU-16`, `HU-17`, `HU-18`) | ✅ **3 / 3 Terminadas (Done · 18/18 Totales)** |
| **Tareas Técnicas** | 9 tareas (`16.1–16.4`, `17.1–17.2`, `18.1–18.3`) | ✅ **9 / 9 Cerradas** |
| **Suites Automatizadas (`runner.js`)** | 13 suites totales | ✅ **13 / 13 Aprobadas (100% PASS · 0 warnings)** |
| **Auditoría en Emulador Firebase** | 8 colecciones + cifrado AES-256-GCM | ✅ **88 / 88 casos aprobados (`auditoria-reglas.mjs`)** |
| **Hito Parcial Corte III** | 21 de noviembre de 2026 | ✅ **Software y documentación 100% listos** |

### Responsables Asignados por Tarea (Sprint 6)
- **Daniel Felipe Cortes:** Tareas `16.1` (`.firebaserc` / `firebase.json`), `16.2` (`docs/guia-despliegue.md`), `18.1` (`src/utils/cifrado.js` y `src/services/claves.js`), `18.2` (cifrado de textos y montos en servicios) y `18.3` (reglas `esCifrado`/`esNumeroCifrado` en `firestore.rules`, `auditoria-reglas.mjs` con 88 casos y `docs/cifrado-datos.md`).
- **Juan Diego Peraza Amado:** Tareas `16.1` (`package.json` ESM), `16.3` (integración UI completa de préstamos `#seccion-prestamos`, tarjeta `#resumen-por-cobrar`, edición/borrado de categorías `#btn-editar-categoria` / `#btn-eliminar-categoria` e indicador `#badge-cifrado`), `17.1` (`docs/guia-sustentacion-corte3.md`) y cierre documental.
- **Fabián Eduardo Córdoba:** Tareas `18.3` (certificación QA de `tests/pruebas-cifrado.test.js` y actualización de 8 colecciones en `tests/pruebas-seguridad-carga.test.js`) y `17.2` (`docs/informe-pruebas-sprint6.md`, `docs/acta-review-sprint6.md` y retrospectiva final).
- **Jorman Palacios Murillo:** Tareas `16.3` (maquetación Tailwind de `#seccion-prestamos` y controles de categorías) y `16.4` (validación visual UAT desktop/móvil y vista de impresión PDF).
- **Yerson Niño Guerrero:** Tareas `18.2` (validación defensiva al leer documentos descifrados en `prestamos.js`, `liquidaciones.js` y `categorias.js`), `16.4` (verificación de exportación CSV sobre datos descifrados) y `17.2`.

---

## 2. Registro Cronológico de Daily Scrums

### Daily 1 — Sábado, 14 de Noviembre de 2026 (Kick-off de Sprint 6)
- **Facilitador:** Juan Diego Peraza / Fabián Córdoba.
- **Ayer / Cierre Sprint 5:** Certificación de `HU-14` y `HU-15` con 12/12 suites en `runner.js` y adelanto de `.firebaserc`, `firebase.json` y `docs/guia-despliegue.md` (**Tareas 16.1 y 16.2**).
- **Hoy:**
  - Se verifica el aviso de baja de Firebase Dynamic Links en Consola Auth, confirmando que `src/services/auth.js` usa exclusivamente `createUserWithEmailAndPassword` y `signInWithEmailAndPassword` sin afectación.
  - Se identifica la oportunidad de elevar la seguridad del proyecto incorporando cifrado en cliente (**HU-18**) para que ni siquiera desde la consola de Firebase se vean descripciones, deudores ni montos en claro.
- **Impedimentos:** Ninguno.

### Daily 2 — Lunes, 16 de Noviembre de 2026 (Implementación de Cifrado de Textos — HU-18)
- **Facilitador:** Fabián Córdoba.
- **Avance:** Daniel Cortes publica el commit `a3d4478` implementando `src/utils/cifrado.js` (AES-256-GCM con Web Crypto API, IV aleatorio de 96 bits y nombre del campo como AAD) y `src/services/claves.js` (`clavesUsuario/{uid}` y `clavesHogar/{codigo}` creadas con `runTransaction`).
- **Hoy:**
  - Se cifran los campos de texto sensibles en `transacciones`, `bolsillos`, `prestamos` y `categorias`, manteniendo retrocompatibilidad con registros previos y limpiando claves en memoria al cerrar sesión (`auth.js`).
  - Se añade `tests/pruebas-cifrado.test.js` (Suite #13) y se amplía `tests/emulador/auditoria-reglas.mjs` a 79 casos.
- **Impedimentos:** Los montos aún quedaban en claro en Firestore; el equipo acuerda cifrar también todos los montos trasladando la validación numérica al cliente (antes de guardar y al leer).

### Daily 3 — Martes, 17 de Noviembre de 2026 (Cifrado de Montos y Completitud Funcional en UI)
- **Facilitador:** Fabián Córdoba.
- **Avance:**
  - Daniel Cortes integra el commit `0782778` cifrando también todos los montos (`transacciones.monto`, `bolsillos.meta`, `bolsillos.montoAcumulado`, `prestamos.monto`, `prestamos.totalAbonado`, `abonos[].monto` y `liquidaciones.transferencias`). `abonarFondosBolsillo` pasa a `runTransaction` para evitar pérdida de abonos concurrentes, `firestore.rules` exige `esNumeroCifrado` y `auditoria-reglas.mjs` alcanza **88 casos aprobados**.
  - Juan Diego Peraza, Jorman Palacios y Yerson Niño completan las últimas implementaciones del sprint en el repositorio:
    - Integración completa en UI (`public/index.html`, `src/ui/dashboard.js`, `src/app.js`) del módulo de **Préstamos a Terceros (`#seccion-prestamos` y tarjeta `#resumen-por-cobrar`)** conectado en tiempo real a `escucharPrestamos`, `registrarPrestamo`, `registrarAbonoPrestamo` y `eliminarPrestamo`.
    - Integración en UI de los botones **Editar (`#btn-editar-categoria`)** y **Borrar (`#btn-eliminar-categoria`)** para categorías personalizadas (`CA-12.3`) e indicador `#badge-cifrado` (`AES-256-GCM`) en la barra superior.
    - Validación defensiva adicional al descifrar en `src/services/categorias.js` y `src/services/liquidaciones.js`.
    - Actualización de `tests/pruebas-seguridad-carga.test.js` para auditar las **8 colecciones** de `firestore.rules` y adición de `package.json` (`"type": "module"`) para eliminar advertencias de Node.
- **Impedimentos:** Ninguno. `node tests/runner.js` ejecuta las **13 suites con 100% PASS y 0 advertencias**.

### Daily 4 — Miércoles, 18 de Noviembre de 2026 (Cierre Documental y Preparación de Sustentación Corte III)
- **Facilitador:** Juan Diego Peraza / Fabián Córdoba.
- **Avance consolidado:**
  - Actualización integral de `README.md`, `docs/sprint-goals.md`, `docs/acta-planning-sprint6.md`, `docs/bitacora-sprint6.md`, `docs/definition-of-done.md` y `docs/guia-despliegue.md`.
  - Emisión del [Acta de Review de Sprint 6](acta-review-sprint6.md), el [Informe de Pruebas de Sprint 6](informe-pruebas-sprint6.md) y la [Guía de Sustentación de Corte III](guia-sustentacion-corte3.md).
- **Resultado QA Final:** `node tests/runner.js` en **13/13 PASS (100%)** y sintaxis verificada en el 100% de los módulos.

---

## 3. Registro de Uso de Inteligencia Artificial en el Sprint 6

| Fecha | Uso / Consulta | Qué Aceptamos | Qué Rechazamos y Por Qué |
|---|---|---|---|
| **16–17 nov** | Diseño de cifrado en cliente con Web Crypto API (`AES-256-GCM`) y gestión de llaves en Firestore (`HU-18`). | Uso nativo de `crypto.subtle` con IV de 96 bits y el nombre del campo como AAD (`enc:v1:<iv>:<datos>`), llaveros inmutables `clavesUsuario` y `clavesHogar` creados con `runTransaction` y validación defensiva al leer. | **Rechazamos derivar la clave con PBKDF2 desde la contraseña del usuario:** si el usuario restablece su contraseña por correo perdería acceso a todos sus datos históricos, y compartir la clave del hogar exigiría criptografía asimétrica innecesaria para el alcance académico (documentado en `docs/cifrado-datos.md`). |
| **17–18 nov** | Integración de UI de préstamos/categorías, validación al leer y consolidación documental de cierre del Sprint 6. | Conexión limpia manteniendo la Separación de Responsabilidades (SoC): `src/ui/dashboard.js` consume únicamente `src/services/prestamos.js` y `src/services/categorias.js` sin tocar Firestore ni `crypto.subtle` directamente. | **Rechazamos agregar librerías externas de criptografía (`crypto-js` / `libsodium`):** Web Crypto API es estándar en todos los navegadores modernos y en Node 19+, manteniendo 0 dependencias en producción. |

---

## 4. Burndown del Sprint 6 (Medido en Tareas Técnicas)

Total de tareas del Sprint 6: **9 tareas técnicas** (`16.1–16.4`, `17.1–17.2`, `18.1–18.3`).

| Corte | Fecha | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| **Inicio S6 (con adelanto 16.1–16.2)** | 14 nov 2026 | 9 | 7 | 7 |
| **Corte Intermedio (HU-18 textos)** | 16 nov 2026 | 5 | 4 | 3 |
| **Cierre Técnico Pre-Parcial Corte III** | 17–18 nov 2026 | 0 | 0 | **0 (100% Cerrado)** |

---

## 5. Retrospectiva Final del Sprint 6 — Dinámica del Barco (18 de Noviembre de 2026)

**Facilitación:** Fabián Eduardo Córdoba (Scrum Master) y Juan Diego Peraza (Product Owner).  
**Participantes:** Juan Diego Peraza, Fabián Córdoba, Daniel Cortes, Jorman Palacios, Yerson Niño.

### 5.1 Lienzo de la Dinámica del Barco (Sailboat)
- **🏝️ LA ISLA (Meta Alcanzada):**
  - Proyecto **Cuentas Claras** 100% completado con **18 Historias de Usuario (102 Story Points)**, las **7 condiciones técnicas obligatorias** superadas con holgura, cifrado extremo a extremo **AES-256-GCM**, **13 suites QA al 100% PASS** y **88 pruebas en emulador**.
- **☀️ EL SOL (Reconocimientos del Semestre):**
  - Mantener **100% de eficacia en los 6 Sprints** (`15 + 21 + 16 + 16 + 13 + 21 = 102 SP`) y una arquitectura modular pura en Vanilla JS que nunca requirió frameworks pesados ni `node_modules` en producción.
- **💨 EL VIENTO EN LAS VELAS (¿Qué nos impulsó en el Sprint 6?):**
  - **Web Crypto API nativa (`src/utils/cifrado.js`):** Funciona idéntico en el navegador y en Node 22, permitiendo probar el cifrado AES-256-GCM en `node tests/runner.js` en milisegundos.
  - **Autenticación por campo (AAD):** Incluir el nombre del campo como dato autenticado impide que alguien copie el texto cifrado de un campo a otro desde la consola de Firebase.
  - **Cierre integral de interfaz:** Conectar `#seccion-prestamos`, `#resumen-por-cobrar` y los botones de editar/borrar categorías dejó el 100% de las historias operables desde la pantalla principal.
- **⚓ LAS ANCLAS (¿Qué retos superamos en el Sprint 6?):**
  - **Cifrar montos sin perder consistencia:** Al cifrar montos, Firestore ya no puede sumar con `increment()` ni validar `monto > 0` en reglas; lo resolvimos usando `runTransaction` (leer, descifrar, validar, sumar y volver a cifrar) y agregando validación defensiva al leer en cliente.
- **🪨 LAS ROCAS (Cuidados para el día de la Sustentación Final — 21/11/2026):**
  - Asegurar que las reglas actualizadas de las **8 colecciones** (`firestore.rules`) estén publicadas en Firebase Console antes de la demostración del MVP en local (`npx firebase-tools deploy --only firestore:rules`), dejando el despliegue web en Hosting (`--only hosting`) listo en un solo paso si se decide publicar en línea.
