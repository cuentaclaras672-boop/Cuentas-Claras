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
| **Sprint 5** | 31/10/2026 – 13/11/2026 | 2 semanas | Auditoría de seguridad, pruebas de carga y reportes | 🚀 **En Ejecución / Arranque (13 SP)** |
| **Sprint 6** | 14/11/2026 – 27/11/2026 | 2 semanas | **Parcial Corte III y Sustentación Final (21/11/2026)** | ⏳ Planificado |

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

## 🚀 Sprint 5: Auditoría de Seguridad, Pruebas de Carga y Exportación
- **Periodo:** 31 de octubre al 13 de noviembre de 2026 (2 semanas).
- **Hito de Cierre:** Sprint Review y Retrospectiva de Sprint 5 (13 de noviembre de 2026).
- **Estado:** **EN EJECUCIÓN / ARRANQUE (13 SP)**
- **Sprint Goal en Curso:**
  > *"Realizar la auditoría de seguridad integral, pruebas de resiliencia y pruebas de carga sobre Cloud Firestore y Firebase Auth, incorporando la exportación de reportes financieros del hogar (formato estructurado CSV / PDF imprimible) para garantizar la robustez del sistema de cara al cierre de semestre."*
- **Historias en Ejecución (13 SP):**
  - **HU-14: Auditoría de seguridad, pruebas de carga y resiliencia en red** (8 SP · Prioridad 1) — Pruebas de estrés concurrente, verificación de aislamiento en las 6 colecciones NoSQL y resiliencia ante pérdidas intermitentes de red. *(Refuerza Condiciones #2 y #5)*.
  - **HU-15: Exportación de reportes financieros del hogar (CSV y vista imprimible)** (5 SP · Prioridad 2) — Serialización según estándar RFC 4180 con filtros activos y vista `@media print` para exportación PDF limpia. *(Refuerza Condición #4)*.
- Detalle en el [Acta de Planning de Sprint 5](acta-planning-sprint5.md) y la [Bitácora de Sprint 5](bitacora-sprint5.md).

---

## 🎯 Sprint 6: Despliegue en Producción y Cierre del Semestre
- **Periodo:** 14 de noviembre al 27 de noviembre de 2026 (2 semanas).
- **Hito Final:** **Parcial Corte III y Sustentación Final de Grado (21 de noviembre de 2026)**.
- **Estado:** Planificado.
