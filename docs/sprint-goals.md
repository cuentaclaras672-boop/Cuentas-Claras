# Objetivos de Sprint (Sprint Goals)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente:** Vilma Yenny Bohórquez  

---

## 📅 Cronograma Oficial de Sprints (2026-2)

| Sprint | Fechas Inicio - Fin | Duración | Hitos Académicos Oficiales | Estado |
|:---:|:---:|:---:|---|:---:|
| **Sprint 1** | 05/09/2026 – 18/09/2026 | 2 semanas | Sustentación de Resultados Sprint 1 | ✅ **100% Finalizado (15 SP)** |
| **Sprint 2** | 19/09/2026 – 02/10/2026 | 2 semanas | Daily en vivo (26/09) · Sustentación Sprint 2 (03/10) | ✅ **100% Finalizado (21 SP)** |
| **Sprint 3** | 03/10/2026 – 16/10/2026 | 2 semanas | Receso (05-12 oct) · **PARCIAL Corte II, Review, Sustentación y Retro (17/10)** | ✅ **100% Finalizado (16 SP)** |
| **Sprint 4** | 17/10/2026 – 30/10/2026 | 2 semanas | Sprint Review y Retrospectiva Sprint 4 (30/10/2026) | ✅ **100% Finalizado (16 SP)** |
| **Sprint 5** | 31/10/2026 – 13/11/2026 | 2 semanas | Auditoría de seguridad, pruebas de carga y reportes CSV/PDF | ✅ **100% Finalizado (13 SP)** |
| **Sprint 6** | 14/11/2026 – 27/11/2026 | 2 semanas | Cifrado AES-256-GCM (HU-18), Despliegue y **Parcial Corte III (21/11/2026)** | ✅ **100% Finalizado (21 SP · 102 SP Totales)** |

---

## ✅ Sprint 1: Arquitectura Base, Autenticación y Saldo Líquido
- **Periodo:** 05 de septiembre al 18 de septiembre de 2026 (2 semanas).
- **Hito de Cierre:** Sustentación de Resultados Sprint 1 (Aprobada con éxito).
- **Estado:** **100% FINALIZADO Y FUNCIONAL (15/15 SP)**
- **Sprint Goal Alcanzado:**
  > *"Construir e integrar la arquitectura base por capas de Cuentas Claras, implementando el flujo completo de autenticación de usuarios con Firebase Auth y la persistencia en tiempo real de transacciones (ingresos/gastos personales y compartidos) en Cloud Firestore, con cálculo consolidado de saldo líquido."*
- **Historias de Usuario Entregadas (15 SP):**
  - **HU-01: Autenticación y Control de Acceso** (5 SP) — Firebase Auth v10 y observador reactivo. *(Cumple Condición #2)*.
  - **HU-02: Registro de Transacciones con Persistencia Real** (5 SP) — Cloud Firestore NoSQL y modelo de dominio `Transaccion.js`. *(Cumple Condición #1)*.
  - **HU-03: Dashboard de Saldo Líquido y Métricas en Tiempo Real** (5 SP) — Balance consolidado y reactividad en tiempo real.

---

## ✅ Sprint 2: Bolsillos de Ahorro, Integración Externa TRM, Búsqueda y Resiliencia
- **Periodo:** 19 de septiembre al 02 de octubre de 2026 (2 semanas).
- **Hitos de Cierre:** Daily en vivo (26 de septiembre) y Sustentación de Resultados Sprint 2 (03 de octubre de 2026).
- **Estado:** **100% FINALIZADO Y CERTIFICADO POR QA (21/21 SP CUMPLIDOS)**
- **Sprint Goal Alcanzado:**
  > *"Que el hogar pueda separar su dinero en bolsillos con metas de ahorro, encontrar cualquier movimiento con búsqueda y filtros, y ver sus saldos en dólares con la TRM oficial, recibiendo avisos claros cuando algo falle."*
- **Historias Entregadas (21 SP):**
  - **HU-05: Búsqueda y filtros avanzados del historial** (5 SP) — Texto, categoría, tipo y rango de fechas. *(Cumple Condición #4)*.
  - **HU-06: Integración externa de la TRM y vista en dólares** (5 SP) — API de `datos.gov.co` con respaldos y timeout de 5 s. *(Cumple Condición #3)*.
  - **HU-04: Bolsillos de ahorro con metas** (8 SP) — Colección `bolsillos` en Firestore y deducción de saldo disponible. *(Cumple Condición #1)*.
  - **HU-07: Avisos de conexión y validaciones en formularios** (3 SP) — Módulo `conexion.js` y resiliencia offline. *(Cumple Condición #5)*.
- Detalle en el [Acta de Planning de Sprint 2](acta-planning-sprint2.md), la [Bitácora de Sprint 2](bitacora-sprint2.md), el [Acta de Review de Sprint 2](acta-review-sprint2.md) y el [Informe de Pruebas de Sprint 2](informe-pruebas-sprint2.md).

---

## ✅ Sprint 3: Préstamos a Terceros, Hogar Compartido y Gráfica de Gastos
- **Periodo:** 03 de octubre al 16 de octubre de 2026 (Semana de receso institucional del 05 al 12 de octubre).
- **Hito de Cierre:** **PARCIAL Corte II, Review, Sustentación y Retrospectiva (17 de octubre de 2026)**.
- **Estado:** **100% FINALIZADO Y CERTIFICADO POR QA (16/16 SP CUMPLIDOS)**
- **Sprint Goal Alcanzado:**
  > *"Que el usuario pueda registrar lo que le presta a amigos o familiares y seguir sus abonos hasta saldarlo, que dos convivientes compartan un mismo hogar para ver juntos los gastos comunes, y que el hogar vea en una gráfica en qué se le va el dinero."*
- **Historias Entregadas (16 SP):**
  - **HU-08: Préstamos a terceros con abonos parciales** (8 SP · Prioridad 1) — Colección `prestamos`, amortización atómica con `runTransaction`, prevención de saldos negativos y tarjeta "Por cobrar". *(Refuerza Condiciones #1 y #4)*.
  - **HU-09: Hogar compartido entre convivientes** (5 SP · Prioridad 2) — Colección `hogares`, código de invitación de 6 caracteres, límite de 6 convivientes y aislamiento estricto validado con prueba negativa. *(Refuerza Condición #2)*.
  - **HU-10: Gráfica de gastos por categoría** (3 SP · Prioridad 3) — Barras proporcionales con Tailwind CSS nativo (sin librerías pesadas), filtros combinados y toggle multidivisa COP/USD. *(Refuerza Condición #4)*.
- Detalle en el [Acta de Planning de Sprint 3](acta-planning-sprint3.md), la [Bitácora de Sprint 3](bitacora-sprint3.md), el [Acta de Review de Sprint 3](acta-review-sprint3.md) y el [Informe de Pruebas de Sprint 3](informe-pruebas-sprint3.md).

---

## ✅ Sprint 4: Cuadre Mensual del Hogar, Categorías Dinámicas e Integridad
- **Periodo:** 17 de octubre al 30 de octubre de 2026 (2 semanas).
- **Hito de Cierre:** Sprint Review, Retrospectiva y Certificación QA de Sprint 4 (30 de octubre de 2026).
- **Estado:** **100% FINALIZADO Y CERTIFICADO POR QA (16/16 SP CUMPLIDOS)**
- **Sprint Goal Alcanzado:**
  > *"Que los convivientes del hogar puedan cuadrar cuentas al final del mes sabiendo exactamente quién le debe a quién con transferencias mínimas y marcar el mes como saldado de forma atómica en Firestore, gestionando categorías personalizadas y garantizando la integridad de los datos financieros con descripciones controladas."*
- **Historias Entregadas (16 SP):**
  - **HU-11: Cuadre mensual de gastos y liquidación entre convivientes** (8 SP · Prioridad 1) — Algoritmo Greedy de transferencias mínimas (`cuadre.js`), colección `liquidaciones` en Firestore, transacción atómica `runTransaction` y reglas de inmutabilidad. *(Refuerza Condiciones #1 y #2)*.
  - **HU-12: Categorías personalizadas por usuario** (5 SP · Prioridad 2) — Servicio CRUD `categorias.js` con SDK modular v10 y aislamiento estricto en `firestore.rules`. *(Refuerza Condiciones #1 y #2)*.
  - **HU-13: Control de integridad y límite de descripción de transacciones** (3 SP · Prioridad 3) — Constante `MAX_DESCRIPCION = 120`, contador dinámico en vivo en formulario HTML y validación defensiva en el modelo `Transaccion.js`. *(Refuerza Condición #5)*.
- Detalle en el [Acta de Planning de Sprint 4](acta-planning-sprint4.md), la [Bitácora de Sprint 4](bitacora-sprint4.md), el [Acta de Review de Sprint 4](acta-review-sprint4.md) y el [Informe de Pruebas de Sprint 4](informe-pruebas-sprint4.md).

---

## ✅ Sprint 5: Auditoría de Seguridad, Pruebas de Carga y Exportación
- **Periodo:** 31 de octubre al 13 de noviembre de 2026 (2 semanas).
- **Hito de Cierre:** Sprint Review, Retrospectiva y Certificación QA de Sprint 5 (13 de noviembre de 2026).
- **Estado:** **100% FINALIZADO Y CERTIFICADO POR QA (13/13 SP CUMPLIDOS · 81 SP ACUMULADOS)**
- **Sprint Goal Alcanzado:**
  > *"Realizar la auditoría de seguridad integral, pruebas de resiliencia y pruebas de carga sobre Cloud Firestore y Firebase Auth, incorporando la exportación de reportes financieros del hogar (formato estructurado CSV / PDF imprimible) para garantizar la robustez del sistema de cara al cierre de semestre."*
- **Historias Entregadas (13 SP):**
  - **HU-14: Auditoría de seguridad, pruebas de carga y resiliencia en red** (8 SP · Prioridad 1) — Hardening de las 6 colecciones en `firestore.rules`, suite de 46 casos en Emulador (`tests/emulador/auditoria-reglas.mjs`), política `conReintentos` y guarda offline en `src/services/conexion.js`, y batería concurrente de 50 operaciones en `tests/pruebas-seguridad-carga.test.js`. *(Refuerza Condiciones #2 y #5)*.
  - **HU-15: Exportación de reportes financieros del hogar (CSV y vista imprimible)** (5 SP · Prioridad 2) — Serializador puro RFC 4180 con BOM UTF-8 (`src/utils/exportador.js`), botones `#btn-exportar-csv` / `#btn-imprimir-reporte` conectados a los filtros activos y hoja `@media print` en `public/style.css`. *(Refuerza Condición #4)*.
  - **Acuerdos Técnicos Retro S4:** Estandarización de `normalizarFecha()` en `src/utils/formateo.js` y regla de homogeneidad Firebase SDK `10.13.0` en `docs/definition-of-done.md`.
- Detalle en el [Acta de Planning de Sprint 5](acta-planning-sprint5.md), la [Auditoría de Seguridad de Sprint 5](auditoria-seguridad-sprint5.md), la [Bitácora de Sprint 5](bitacora-sprint5.md), el [Acta de Review de Sprint 5](acta-review-sprint5.md) y el [Informe de Pruebas de Sprint 5](informe-pruebas-sprint5.md).

---

## ✅ Sprint 6: Cifrado AES-256-GCM, Despliegue en Producción y Cierre del Semestre
- **Periodo:** 14 de noviembre al 27 de noviembre de 2026 (2 semanas).
- **Hito Crítico:** **Parcial Corte III y Sustentación Final (21 de noviembre de 2026)**.
- **Estado:** **100% FINALIZADO Y CERTIFICADO POR QA (21/21 SP CUMPLIDOS · 102 SP ACUMULADOS EN 18 HISTORIAS)**.
- **Sprint Goal Alcanzado:**
  > *"Incorporar cifrado extremo a extremo AES-256-GCM en el navegador para todos los textos y montos financieros antes de enviarlos a Firestore, completar la interfaz operativa de préstamos y categorías personalizadas, desplegar Cuentas Claras en Firebase Hosting con sus 8 colecciones blindadas y API Key restringida por dominio, y certificar las 13 suites QA y la guía de sustentación del Parcial Corte III (21 de noviembre de 2026)."*
- **Historias Entregadas (21 SP):**
  - **HU-18: Seguridad de los datos mediante cifrado AES-256-GCM en cliente** (8 SP · Prioridad 1) — Módulo `src/utils/cifrado.js` (Web Crypto API, IV de 96 bits y AAD por campo), llavero `src/services/claves.js` (`clavesUsuario` y `clavesHogar` con `runTransaction`), cifrado de textos y montos en `firestore.js`, `prestamos.js`, `liquidaciones.js` y `categorias.js`, validación defensiva al leer, reglas `esCifrado` / `esNumeroCifrado` / `esClaveAes` en `firestore.rules` (8 colecciones), suite `tests/pruebas-cifrado.test.js` y 88 casos en `tests/emulador/auditoria-reglas.mjs`. *(Refuerza Condiciones #1, #2 y #5)*.
  - **HU-16: Despliegue en producción en Firebase Hosting y endurecimiento operativo** (8 SP · Prioridad 1) — Configuración `.firebaserc` / `firebase.json`, `docs/guia-despliegue.md`, integración completa en UI de préstamos a terceros (`#seccion-prestamos`, tarjeta `#resumen-por-cobrar`), edición/eliminación de categorías personalizadas en formulario e indicador `#badge-cifrado`. *(Consolida Condiciones #2, #6 y #7)*.
  - **HU-17: Preparación de sustentación técnica integral y auditoría final de cierre** (5 SP · Prioridad 2) — Guía maestra de sustentación Corte III (`docs/guia-sustentacion-corte3.md`), certificación de las **13 suites QA** (`node tests/runner.js` al 100% PASS, 0 advertencias con `package.json` ESM), `docs/acta-review-sprint6.md` e `docs/informe-pruebas-sprint6.md`. *(Consolida Condiciones #6 y #7)*.
- Detalle en [Cifrado de Datos (HU-18)](cifrado-datos.md), la [Guía de Despliegue](guia-despliegue.md), el [Acta de Planning de Sprint 6](acta-planning-sprint6.md), la [Bitácora de Sprint 6](bitacora-sprint6.md), el [Acta de Review de Sprint 6](acta-review-sprint6.md), el [Informe de Pruebas de Sprint 6](informe-pruebas-sprint6.md) y la [Guía de Sustentación Corte III](guia-sustentacion-corte3.md).
