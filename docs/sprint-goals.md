# Objetivos de Sprint (Sprint Goals)
**Proyecto:** Cuentas Claras  
**Marco de Trabajo:** Scrum  

---

## 🎯 Sprint 1: Arquitectura Base, Autenticación y CRUD en Tiempo Real
- **Estado:** En Curso / Completado
- **Meta del Sprint:**
  Implementar la arquitectura modular por capas en Vanilla JS + Tailwind, configurar la integración con Firebase v10 (Auth y Firestore), y lograr el ciclo completo de autenticación y registro de transacciones financieras con feedback visual mediante Toasts.
- **Entregables:**
  - Capa de servicios (`auth.js`, `firestore.js`).
  - Capa de dominio (`Transaccion.js`).
  - Capa de presentación (`ui-auth.js`, `dashboard.js`, `notificaciones.js`).
  - Capa de utilidades (`formateo.js`).
  - Orquestador reactivo (`app.js`).
  - Documentación de proyecto y DoD.

---

## 🎯 Sprint 2: División de Gastos Compartidos y Balances del Hogar
- **Estado:** Planificado
- **Meta del Sprint:**
  Desarrollar la lógica de liquidación entre convivientes (quién le debe a quién en gastos compartidos), cálculo de cuotas equitativas y desglose gráfico por categorías.
- **Entregables Estimados:**
  - Módulo de cálculo de deudas y saldos cruzados entre miembros del hogar.
  - Visualización gráfica de gastos por categoría (Chart.js / SVG nativo).
  - Gestión de grupos o identificador de hogar compartido.

---

## 🎯 Sprint 3: Presupuestos Límite, Exportación y Preparación de Sustentación
- **Estado:** Planificado
- **Meta del Sprint:**
  Establecer límites de presupuesto mensual con alertas preventivas, exportación de reportes financieros y batería de pruebas de modificación de código en vivo para la sustentación final.
- **Entregables Estimados:**
  - Configuración de alertas de sobregiro por categoría.
  - Exportación de resumen a CSV/JSON.
  - Guía rápida de sustentación y modificación en vivo.
