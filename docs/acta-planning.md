# Acta de Sprint Planning — Sprint 1
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Metodología:** Scrum / Ágil  
**Duración del Sprint:** 2 semanas  
**Fecha:** Septiembre 2026  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad Principal |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Priorización del Backlog, definición de valor de negocio y validación de criterios de aceptación. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilitación de ceremonias ágiles, remoción de impedimentos y cumplimiento de la Definition of Done. |
| **Development Team** | Daniel Felipe Cortes | Integración con servicios de Firebase y APIs externas (TRM). |
| **Development Team** | Jorman Palacios Murillo | Capa de presentación (UI/UX) con Tailwind CSS y componentes reactivos. |
| **Development Team** | Yerson Niño Guerrero | Capa de dominio, modelos de datos y programación defensiva. |

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
  - Almacenamiento seguro en Firebase Authentication SDK v10.
  - Notificaciones flotantes (Toast) ante errores o éxito.

### HU-02: Registro de Movimientos Financieros
- **Como** miembro del hogar,
- **Quiero** registrar ingresos y gastos clasificándolos por categoría y ámbito (Personal o Compartido),
- **Para** mantener las finanzas organizadas y transparentes con mis convivientes.
- **Criterios de Aceptación:**
  - Persistencia asíncrona real en Cloud Firestore (colección `transacciones`).
  - Validación estricta del monto (número positivo > 0).
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
