# Objetivos de Sprint (Sprint Goals)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  

---

## ✅ Sprint 1: Arquitectura Base, Autenticación y Saldo Líquido
- **Periodo:** 17 de agosto al 5 de septiembre de 2026 (Semanas 3 y 4 · 2 semanas)
- **Hito de Cierre:** **Sustentación 1 (Aprobada con éxito el 5 de septiembre)**
- **Estado:** **100% FINALIZADO Y FUNCIONAL (DONE)**
- **Sprint Goal Alcanzado:**
  > *"Construir e integrar la arquitectura base por capas de Cuentas Claras, implementando el flujo completo de autenticación de usuarios con Firebase Auth y la persistencia en tiempo real de transacciones (ingresos/gastos personales y compartidos) en Cloud Firestore, con cálculo consolidado de saldo líquido."*
- **Historias de Usuario Entregadas (Tope de 3 historias según §5.1):**
  - **HU-01: Autenticación y Control de Acceso** — Implementado con Firebase Auth v10 en [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js) y [`src/ui/ui-auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/ui-auth.js).
  - **HU-02: Registro de Transacciones con Persistencia Real** — Implementado con Cloud Firestore NoSQL en [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js) y modelo [`src/models/Transaccion.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/models/Transaccion.js).
  - **HU-03: Dashboard de Saldo Líquido y Métricas en Tiempo Real** — Implementado con reactividad `onSnapshot` y balance consolidado en [`src/ui/dashboard.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/dashboard.js).

---

## 🚀 Sprint 2: Bolsillos de Ahorro, Control de Deudas, Filtros y Resiliencia
- **Periodo:** 7 de septiembre al 10 de octubre de 2026 (Semanas 6 a 9 · 4 semanas)
- **Hito de Cierre:** **Sustentación 2 (Entre el 5 y 10 de octubre)**
- **Estado:** **EN CURSO (Promediando Sprint a fecha 26 de septiembre de 2026)**
- **Sprint Goal en Ejecución:**
  > *"Expandir las capacidades del hogar implementando el módulo de bolsillos de ahorro para metas específicas, el registro y seguimiento de deudas o préstamos informales a terceros, y la optimización de consultas de historial con filtrado avanzado y manejo de errores visible."*
- **Historias de Usuario en Tránsito en el Tablero (Miro / Planner):**
  - **HU-04: Bolsillos de Ahorro / Cajas Fijas** — Fondos con propósitos específicos (*En Desarrollo / WIP*).
  - **HU-05: Historial con Filtros Avanzados y Búsqueda** — Búsqueda por texto, fechas y categoría (*En Pruebas*).
  - **HU-06: Control de Deudas y Préstamos a Terceros** — Cuentas por cobrar/pagar informales (*En Desarrollo / WIP*).
  - **HU-07: Manejo de Errores Visible y Resiliencia** — Toasts contextuales y validación defensiva (*En Pruebas*).

---

## ⏳ Sprint 3: Liquidación entre Convivientes y Métricas
- **Periodo:** 12 de octubre al 31 de octubre de 2026 (Semanas 11 a 13 · 3 semanas)
- **Hito de Cierre:** Sprint Review y Retrospectiva Internos (Sesión 9)
- **Estado:** Planificado

---

## ⏳ Sprint 4: Release Versionado, Empaquetado y Cierre del Semestre
- **Periodo:** 2 de noviembre al 28 de noviembre de 2026 (Semanas 14 a 16 · 3 semanas)
- **Hito de Cierre:** **Sustentación 3 — Entrega Final (23 al 28 de noviembre)**
- **Estado:** Planificado
