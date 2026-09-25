# Acta de Sprint Planning — Sprint 1
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Metodología:** Scrum / Ágil  
**Duración del Sprint:** 2 semanas (del 17 de agosto al 5 de septiembre de 2026)  
**Cierre y Aprobación:** Sustentación 1 (5 de septiembre de 2026)  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad Principal |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Priorización del Backlog, definición de valor de negocio y validación de criterios de aceptación. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilitación de ceremonias ágiles, remoción de impedimentos y cumplimiento de la Definition of Done. |
| **Development Team** | Daniel Felipe Cortes | Integración con servicios de Firebase y persistencia NoSQL. |
| **Development Team** | Jorman Palacios Murillo | Capa de presentación (UI/UX) con Tailwind CSS y componentes visuales. |
| **Development Team** | Yerson Niño Guerrero | Capa de dominio, modelos de datos y programación defensiva. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Construir e integrar la arquitectura base por capas de Cuentas Claras, implementando el flujo completo de autenticación de usuarios con Firebase Auth y la persistencia en tiempo real de transacciones (ingresos/gastos personales y compartidos) en Cloud Firestore, con cálculo consolidado de saldo líquido."*

---

## 3. Historias de Usuario Seleccionadas (Sprint Backlog)

Todas las historias del Sprint 1 están estimadas en **talla pequeña (S)** para dar cumplimiento estricto a las reglas de alcance de la asignatura (§5.1: máximo 3 historias, todas de talla pequeña y al menos una con persistencia).

### [HU-01] Autenticación y Control de Acceso
- **Talla:** S
- **Prioridad:** Alta (Requisito técnico bloqueante para aislar los datos por hogar).
- **Descripción:** Como usuario del hogar, quiero autenticarme mediante correo y contraseña para proteger la privacidad de mis finanzas.
- **Criterios de Aceptación:**
  - Validación defensiva de formato de correo y longitud de contraseña (mínimo 6 caracteres).
  - Almacenamiento seguro en Firebase Authentication SDK v10.
  - Notificaciones flotantes (Toast) ante errores o éxito.
- **Tareas Asignadas:**
  - **Tarea 1.1:** Configurar credenciales y SDK Firebase (Juan Diego Peraza | 18 ago - 21 ago).
  - **Tarea 1.2:** Diseñar formulario visual de Login en HTML/Tailwind (Juan Diego Peraza | 20 ago - 23 ago).
  - **Tarea 1.3:** Lógica de autenticación con Firebase Auth (Juan Diego Peraza | 23 ago - 27 ago).
  - **Tarea 1.4:** Persistencia de sesión y logout (Juan Diego Peraza | 27 ago - 30 ago).

### [HU-02] Registro de Transacciones
- **Talla:** S
- **Prioridad:** Alta (Cumple la condición técnica obligatoria de persistencia real).
- **Descripción:** Como usuario, quiero registrar ingresos y egresos categorizados para almacenarlos en la nube de forma persistente.
- **Criterios de Aceptación:**
  - Persistencia asíncrona real en Cloud Firestore (colección `transacciones`).
  - Validación estricta del monto (número positivo > 0).
  - Selector dinámico de categorías según el tipo (Ingreso o Gasto).
- **Tareas Asignadas:**
  - **Tarea 2.1:** Definir colección transacciones en Firestore (Daniel Felipe Cortes / Juan Diego Peraza | 21 ago - 24 ago).
  - **Tarea 2.2:** Modal y formulario para captura de montos y categorías (Jorman Palacios Murillo | 24 ago - 27 ago).
  - **Tarea 2.3:** Función de inserción `addDoc` a Firestore (Juan Diego Peraza | 27 ago - 31 ago).
  - **Tarea 2.4:** Pruebas de persistencia ante recarga de página (Fabián Eduardo Córdoba | 31 ago - 03 sep).

### [HU-03] Dashboard de Saldo Líquido
- **Talla:** S
- **Prioridad:** Alta (Entrega principal de valor funcional para el usuario).
- **Descripción:** Como miembro del hogar, quiero visualizar en un dashboard el saldo total disponible consolidado en tiempo real.
- **Criterios de Aceptación:**
  - Uso de listeners reactivos `onSnapshot` de Firestore.
  - Actualización automática de métricas agregadas al registrar o borrar transacciones.
  - Filtro interactivo por ámbito (Todos, Personal, Compartido).
- **Tareas Asignadas:**
  - **Tarea 3.1:** Diseñar tarjeta hero de Saldo Disponible y métricas (Jorman Palacios Murillo | 26 ago - 29 ago).
  - **Tarea 3.2:** Consulta reactiva `onSnapshot` a Firestore (Daniel Felipe Cortes | 29 ago - 01 sep).
  - **Tarea 3.3:** Algoritmo de cálculo de saldos en JavaScript (Yerson Niño Guerrero | 01 sep - 03 sep).
  - **Tarea 3.4:** Pruebas de actualización de balance en vivo (Fabián Eduardo Córdoba / Juan Diego Peraza | 03 sep - 05 sep).

---

## 4. Definición de Estimaciones y Capacidad
- **Capacidad del Sprint:** 3 Historias de Usuario (Todas talla S).
- **Estimación en Story Points (referencial):** 18 SP.
- **Herramientas de seguimiento:** Tablero de Miro / Planner y Bitácora de Sprint.
