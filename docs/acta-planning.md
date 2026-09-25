# Acta de Sprint Planning — Sprint 1
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Metodología:** Scrum / Ágil  
**Duración del Sprint:** 2 semanas  
**Fecha:** Septiembre 2026  

---

## 1. Roles del Equipo Scrum

| Rol | Responsable | Funciones Principales |
|---|---|---|
| **Product Owner** | Equipo Cuentas Claras | Definición y priorización del Product Backlog, criterios de aceptación y valor de negocio. |
| **Scrum Master** | Equipo Cuentas Claras | Facilitación de ceremonias, remoción de impedimentos técnicos y aseguramiento de buenas prácticas. |
| **Development Team** | Juan Diego Peraza & Equipo | Diseño de arquitectura en capas, desarrollo frontend (Vanilla JS + Tailwind), integración con Firebase v10. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Construir e integrar la arquitectura base por capas de Cuentas Claras, implementando el flujo completo de autenticación de usuarios con Firebase Auth y la persistencia en tiempo real de transacciones (ingresos/gastos personales y compartidos) en Cloud Firestore, con manejo visible de errores mediante notificaciones Toast."*

---

## 3. Historias de Usuario Seleccionadas (Sprint Backlog)

### HU-01: Autenticación Segura de Usuarios
- **Como** usuario del hogar,
- **Quiero** registrarme e iniciar sesión con mi correo y contraseña,
- **Para** acceder de manera privada y segura a la gestión financiera de mi hogar.
- **Criterios de Aceptación:**
  - Validación defensiva de formato de correo y contraseña (mínimo 6 caracteres).
  - Almacenamiento seguro en Firebase Authentication.
  - Notificaciones flotantes (Toast) ante errores o éxito.

### HU-02: Registro de Movimientos Financieros
- **Como** miembro del hogar,
- **Quiero** registrar ingresos y gastos clasificándolos por categoría y ámbito (Personal o Compartido),
- **Para** mantener las finanzas organizadas y transparentes con mis convivientes.
- **Criterios de Aceptación:**
  - Persistencia asíncrona real en Cloud Firestore (colección `transacciones`).
  - Validación del monto (número positivo > 0).
  - Selector dinámico de categorías según el tipo (Ingreso o Gasto).

### HU-03: Dashboard y Resumen en Tiempo Real
- **Como** usuario,
- **Quiero** visualizar mi balance neto, total de ingresos, gastos y gastos compartidos en tiempo real,
- **Para** conocer inmediatamente el estado económico del hogar sin tener que recargar la página.
- **Criterios de Aceptación:**
  - Uso de listeners reactivos (`onSnapshot`) de Firestore.
  - Actualización automática de métricas agregadas al registrar o borrar transacciones.
  - Filtro interactivo por ámbito (Todos, Personal, Compartido).

---

## 4. Definición de Estimaciones y Capacidad
- **Capacidad estimada:** 30 Puntos de Historia (Story Points).
- **Herramienta de seguimiento:** Tablero Kanban / GitHub Projects.
