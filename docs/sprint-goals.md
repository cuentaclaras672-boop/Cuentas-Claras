# Objetivos de Sprint (Sprint Goals)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  

---

## ✅ Sprint 1: Arquitectura Base, Autenticación y Saldo Líquido
- **Periodo:** 17 al 29 de agosto de 2026 (Semanas 3 y 4 · 2 semanas). Semana 5: pruebas finales y sustentación.
- **Hito de Cierre:** **Sustentación 1 (Aprobada con éxito el 5 de septiembre)**
- **Estado:** **100% FINALIZADO Y FUNCIONAL (DONE)**
- **Sprint Goal Alcanzado:**
  > *"Construir e integrar la arquitectura base por capas de Cuentas Claras, implementando el flujo completo de autenticación de usuarios con Firebase Auth y la persistencia en tiempo real de transacciones (ingresos/gastos personales y compartidos) en Cloud Firestore, con cálculo consolidado de saldo líquido."*
- **Historias de Usuario Entregadas (Tope de 3 historias según lineamientos del Sprint 1):**
  - **HU-01: Autenticación y Control de Acceso** — Implementado con Firebase Auth v10 en [`src/services/auth.js`](../src/services/auth.js) y [`src/ui/ui-auth.js`](../src/ui/ui-auth.js). *(Cumple Condición #2)*.
  - **HU-02: Registro de Transacciones con Persistencia Real** — Implementado con Cloud Firestore NoSQL en [`src/services/firestore.js`](../src/services/firestore.js) y [`src/models/Transaccion.js`](../src/models/Transaccion.js). *(Cumple Condición #1)*.
  - **HU-03: Dashboard de Saldo Líquido y Métricas en Tiempo Real** — Implementado con reactividad `onSnapshot` y balance consolidado en [`src/ui/dashboard.js`](../src/ui/dashboard.js).

---

## 🚀 Sprint 2: Bolsillos de Ahorro, Integración Externa TRM, Búsqueda y Resiliencia
- **Periodo:** 07 de septiembre al 03 de octubre de 2026 (Semanas 6 a 9 · 4 semanas). Semana 10: pruebas finales.
- **Hito de Cierre:** **Sustentación 2 (10 de octubre de 2026, Grupo 2)**
- **Estado:** En curso.
- **Sprint Goal:**
  > *"Que el hogar pueda separar su dinero en bolsillos con metas de ahorro, encontrar cualquier movimiento con búsqueda y filtros, y ver sus saldos en dólares con la TRM oficial, recibiendo avisos claros cuando algo falle."*
- **Historias comprometidas (21 SP):**
  - **HU-05: Búsqueda y filtros avanzados del historial** (S · 5 SP) — texto, categoría, tipo y fechas. *Condición #4*.
  - **HU-06: Integración externa de la TRM y vista en dólares** (S · 5 SP) — API de datos.gov.co con respaldos. *Condición #3*.
  - **HU-04: Bolsillos de ahorro con metas** (M · 8 SP) — nueva colección `bolsillos` en Firestore. *Condición #1*.
  - **HU-07: Avisos de conexión y validaciones en formularios** (S · 3 SP). *Condición #5*.
- Detalle de criterios y tareas en el [Acta de Planning del Sprint 2](acta-planning-sprint2.md).

---

## ⏳ Sprint 3: Préstamos a Terceros, Hogar Compartido y Visualización de Gastos
- **Periodo:** 12 de octubre al 31 de octubre de 2026 (Semanas 11 a 13 · 3 semanas)
- **Hito de Cierre:** Sprint Review y Retrospectiva Internos (31 de octubre de 2026)
- **Estado:** Planificado (Sprint Backlog y Bitácora listos)
- **Sprint Goal:**
  > *"Que el usuario pueda registrar lo que le presta a amigos o familiares y seguir sus abonos hasta saldarlo, que dos convivientes compartan un mismo hogar para ver juntos los gastos comunes, y que el hogar vea en una gráfica en qué se le va el dinero."*
- **Historias comprometidas (16 SP):**
  - **HU-08: Préstamos a terceros con abonos parciales** (M · 8 SP · Prioridad 1) — colección `prestamos`, amortización de saldo y tarjeta "Por cobrar". *Refuerza Condiciones #1 y #4*.
  - **HU-09: Hogar compartido entre convivientes** (S · 5 SP · Prioridad 2) — colección `hogares`, código de invitación y privacidad de gastos compartidos vs personales. *Refuerza Condición #2*.
  - **HU-10: Gráfica de gastos por categoría** (S · 3 SP · Prioridad 3) — barras horizontales reactivas con Tailwind CSS nativo sin librerías externas. *Refuerza Condición #4*.
- Detalle completo de criterios de aceptación, DoR, DoD y tareas en el [Acta de Planning del Sprint 3](acta-planning-sprint3.md) y la [Bitácora del Sprint 3](bitacora-sprint3.md).

---

## ⏳ Sprint 4: Release Versionado, Empaquetado y Cierre del Semestre
- **Periodo:** 2 de noviembre al 28 de noviembre de 2026 (Semanas 14 a 16 · 3 semanas)
- **Hito de Cierre:** **Sustentación 3 — Entrega Final (23 al 28 de noviembre de 2026)**
- **Estado:** Planificado
