# Bitácora de Sprint 1 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 1 (Semanas 3 y 4)  

---

## 1. Registro de Dailies (Seguimiento Diario del Equipo)

### Daily 1 — Arranque de Sprint y Repositorio
- **¿Qué se hizo?**: Configuración del repositorio en GitHub, inicialización de Git con formato `reftable`, resolución de conflicto de ramas remotas (`main`/`Main`) y primer commit.
- **¿Qué se va a hacer hoy?**: Diseñar la arquitectura por capas y definir el modelo de datos de la entidad `Transaccion`.
- **Impedimentos detectados**: Conflicto de credenciales de Git Credential Manager en Windows (solucionado asignando permisos al usuario colaborador).

### Daily 2 — Servicios de Backend e Integración Externa
- **¿Qué se hizo?**: Implementación de `auth.js` (Firebase Auth v10), `firestore.js` (persistencia NoSQL y tiempo real) e integración externa con API pública de la TRM en `indicadores.js`.
- **¿Qué se va a hacer hoy?**: Construir la capa de presentación (UI de autenticación, dashboard y notificaciones Toast).
- **Impedimentos detectados**: Ninguno.

### Daily 3 — Integración UI, Orquestación y Pruebas
- **¿Qué se hizo?**: Construcción de `public/index.html` con Tailwind CSS, módulos `ui-auth.js`, `dashboard.js`, `notificaciones.js` y el orquestador reactivo `app.js`.
- **¿Qué se va a hacer hoy?**: Revisión de criterios de aceptación de las 3 Historias de Usuario del Sprint 1 y pruebas de sustentación en vivo.
- **Impedimentos detectados**: Ninguno. El software corre y persiste en Firestore.

---

## 2. Tareas del Sprint Backlog (Medidas para el Burndown)

| ID Tarea | Descripción | Responsable | Estado |
|---|---|---|---|
| **T-01** | Configuración de conexión y Singleton de Firebase SDK v10 | Daniel Cortes | Terminado (Done) |
| **T-02** | Implementación de validaciones defensivas de autenticación en `auth.js` | Juan Diego Peraza | Terminado (Done) |
| **T-03** | Modelado de la clase `Transaccion` con serialización a Firestore | Yerson Niño | Terminado (Done) |
| **T-04** | Creación de listener en tiempo real `onSnapshot` en `firestore.js` | Daniel Cortes | Terminado (Done) |
| **T-05** | Consumo vía `fetch` del servicio público de la TRM del dólar | Juan Diego Peraza | Terminado (Done) |
| **T-06** | Maquetación con Tailwind CSS de vistas Login y Dashboard | Jorman Palacios | Terminado (Done) |
| **T-07** | Desarrollo del sistema desacoplado de notificaciones Toasts | Fabián Córdoba | Terminado (Done) |
| **T-08** | Pruebas de integración, verificación de sintaxis y documentación | Todo el equipo | Terminado (Done) |

---

## 3. Registro Obligatorio del Uso de Inteligencia Artificial (§8)

En cumplimiento de la Sección 8 del programa de la asignatura (*"El uso de IA no está prohibido, está sujeto a registro"*), se detalla la bitácora de interacción con herramientas de IA:

### 3.1 ¿Qué le pedimos a la IA?
1. Asistencia para estructurar una arquitectura limpia por capas (separando presentación, dominio, servicios e infraestructura) que cumpliera con las 7 condiciones técnicas de la rúbrica.
2. Generación del código modular inicial para Firebase Auth v10 y Cloud Firestore v10 con programación defensiva.
3. Propuesta de diseño responsivo moderno en Tailwind CSS para el Dashboard financiero y el sistema de Toasts.
4. Redacción de artefactos ágiles (Acta de Planning, DoD y Bitácora) adaptados al estándar de la materia.

### 3.2 ¿Qué aceptamos de la IA?
- **El patrón Singleton para Firebase App:** La verificación mediante `getApps().length` para evitar errores de inicialización múltiple.
- **El sistema reactivo de Toasts:** Desacoplado del DOM principal, garantizando la condición de error visible (#5).
- **El patrón Observer con `onAuthStateChanged` y `onSnapshot`:** Permite que la UI reaccione en tiempo real sin recargar la página.
- **Mapeo de errores de Firebase:** Traducción a mensajes amigables en español para los usuarios del hogar.

### 3.3 ¿Qué rechazamos y por qué? (Criterio de Evaluación de Ingeniería)
1. **Rechazamos el uso de frameworks pesados (React / Next.js / Angular / Vite bundlers):**
   - *Motivo:* Aunque la IA frecuentemente sugiere librerías complejas, el equipo decidió usar **Vanilla JavaScript con ES6 Modules nativos**. Esto elimina la sobrecarga de dependencias (`node_modules`), acelera la ejecución y asegura que durante la **modificación en vivo (§7.2)** cualquier integrante del equipo pueda rastrear el flujo del código sin abstraerse en el Virtual DOM o configuraciones de empaquetado.
2. **Rechazamos guardar balances o transacciones en `localStorage`:**
   - *Motivo:* Algunas sugerencias iniciales proponían guardar datos localmente para acelerar la carga ("optimistic UI"). Se rechazó de forma estricta porque violaba la **Condición Técnica Obligatoria #1 (Persistencia Real)**, que exige que los datos sobrevivan al cierre de la aplicación y se compartan entre convivientes mediante la base de datos Firestore.
3. **Rechazamos consolidar la lógica en un único script `app.js` monolítico:**
   - *Motivo:* Se descartó cualquier código que mezclara llamadas a Firebase con `document.getElementById()`, exigiendo una estricta separación donde `src/services/` nunca accede a la interfaz gráfica.
