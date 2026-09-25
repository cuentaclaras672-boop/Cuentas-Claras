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
  - **HU-01: Autenticación y Control de Acceso** — Implementado con Firebase Auth v10 en [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js) y [`src/ui/ui-auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/ui-auth.js). *(Cumple Condición #2)*.
  - **HU-02: Registro de Transacciones con Persistencia Real** — Implementado con Cloud Firestore NoSQL en [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js) y [`src/models/Transaccion.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/models/Transaccion.js). *(Cumple Condición #1)*.
  - **HU-03: Dashboard de Saldo Líquido y Métricas en Tiempo Real** — Implementado con reactividad `onSnapshot` y balance consolidado en [`src/ui/dashboard.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/dashboard.js).

---

## 🚀 Sprint 2: Bolsillos de Ahorro, Integración Externa TRM, Filtros y Resiliencia
- **Periodo:** 07 de septiembre al 10 de octubre de 2026 (Semanas 6 a 9 · 4 semanas)
- **Hito de Cierre:** **Sustentación 2 (Entre el 5 y 10 de octubre de 2026)**
- **Estado:** **EN CURSO (Promediando Sprint a fecha 26 de septiembre de 2026)**
- **Sprint Goal en Ejecución:**
  > *"Incorporar la gestión de bolsillos de ahorro para metas del hogar, la integración externa con la API oficial de la TRM del dólar para conversión multidivisa, el historial con filtrado dinámico y la consolidación del manejo visible de errores, garantizando el cumplimiento verificable del 100% de las condiciones técnicas obligatorias de la asignatura para la Sustentación 2."*
- **Historias de Usuario en Tránsito en el Tablero (Miro / Planner):**
  - **HU-04: Bolsillos de Ahorro / Cajas Fijas** — Fondos con propósitos específicos (*En Desarrollo / WIP*).
  - **HU-05: Historial con Filtros Avanzados y Búsqueda** — Búsqueda por texto, fechas y categoría (*En Pruebas · Cumple Condición #4*).
  - **HU-06: Integración Externa de TRM y Conversión Multidivisa** — Consumo asíncrono API pública TRM (*En Pruebas · Cumple Condición #3*).
  - **HU-07: Manejo de Errores Visible y Resiliencia** — Toasts contextuales y validación defensiva (*En Pruebas · Cumple Condición #5*).

---

## ⏳ Sprint 3: Liquidación entre Convivientes y Control de Deudas a Terceros
- **Periodo:** 12 de octubre al 31 de octubre de 2026 (Semanas 11 a 13 · 3 semanas)
- **Hito de Cierre:** Sprint Review y Retrospectiva Internos (Sesión 9)
- **Estado:** Planificado
- **Alcance Planificado:**
  - Registro y conciliación de préstamos informales a amigos o familiares (Cuentas por cobrar).
  - Liquidación automática de deudas cruzadas en gastos compartidos del hogar.
  - Visualización gráfica de gastos por categoría (Chart.js / SVG nativo).

---

## ⏳ Sprint 4: Release Versionado, Empaquetado y Cierre del Semestre
- **Periodo:** 2 de noviembre al 28 de noviembre de 2026 (Semanas 14 a 16 · 3 semanas)
- **Hito de Cierre:** **Sustentación 3 — Entrega Final (23 al 28 de noviembre de 2026)**
- **Estado:** Planificado
