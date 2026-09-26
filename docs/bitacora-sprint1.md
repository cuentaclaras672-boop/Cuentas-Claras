# Bitácora de Sprint 1 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 1 (Semanas 3 y 4, 17 - 29 ago · Sustentación 1: 5 sep)  

---

## 1. Registro de Dailies (Seguimiento Diario del Equipo)

### Daily 1 — Arranque de Sprint y Repositorio
- **¿Qué se hizo?**: Configuración del repositorio en GitHub, inicialización de Git con formato `reftable`, resolución de conflicto de ramas remotas (`main`/`Main`) y primer commit.
- **¿Qué se va a hacer hoy?**: Diseñar la arquitectura por capas y definir el modelo de datos de la entidad `Transaccion`.
- **Impedimentos detectados**: Conflicto de credenciales de Git Credential Manager en Windows (solucionado asignando permisos al usuario colaborador).

### Daily 2 — Servicios de Backend y Persistencia
- **¿Qué se hizo?**: Implementación de `auth.js` (Firebase Auth v10), `firestore.js` (persistencia NoSQL y sincronización en tiempo real en Firestore) y definición de entidades de dominio en `Transaccion.js` con tipado defensivo.
- **¿Qué se va a hacer hoy?**: Construir la capa de presentación (UI de autenticación, dashboard y notificaciones Toast).
- **Impedimentos detectados**: Ninguno.

### Daily 3 — Integración UI, Orquestación y Pruebas
- **¿Qué se hizo?**: Construcción de `public/index.html` con Tailwind CSS, módulos `ui-auth.js`, `dashboard.js`, `notificaciones.js` y el orquestador reactivo `app.js`.
- **¿Qué se va a hacer hoy?**: Revisión de criterios de aceptación de las 3 Historias de Usuario del Sprint 1 y pruebas de sustentación en vivo.
- **Impedimentos detectados**: Ninguno. El software corre y persiste en Firestore.

---

## 2. Tareas del Sprint Backlog (Medidas para el Burndown)

| ID Tarea | Descripción | Responsable | Periodo | Estado |
|---|---|---|:---:|:---:|
| **Tarea 1.1** | Configurar credenciales y SDK Firebase | Juan Diego Peraza | 18 ago - 21 ago | **Done** |
| **Tarea 1.2** | Diseñar formulario visual de Login en HTML/Tailwind | Juan Diego Peraza | 20 ago - 23 ago | **Done** |
| **Tarea 1.3** | Lógica de autenticación con Firebase Auth | Juan Diego Peraza | 23 ago - 27 ago | **Done** |
| **Tarea 1.4** | Persistencia de sesión y logout | Juan Diego Peraza | 27 ago - 30 ago | **Done** |
| **Tarea 2.1** | Definir colección transacciones en Firestore | Daniel Cortes / Juan Diego Peraza | 21 ago - 24 ago | **Done** |
| **Tarea 2.2** | Modal para captura de montos y categorías | Jorman Palacios | 24 ago - 27 ago | **Done** |
| **Tarea 2.3** | Función de inserción `addDoc` a Firestore | Juan Diego Peraza | 27 ago - 31 ago | **Done** |
| **Tarea 2.4** | Pruebas de persistencia ante recarga | Fabián Córdoba | 31 ago - 03 sep | **Done** |
| **Tarea 3.1** | Diseñar tarjeta hero de Saldo Disponible | Jorman Palacios | 26 ago - 29 ago | **Done** |
| **Tarea 3.2** | Consulta reactiva `onSnapshot` a Firestore | Daniel Cortes | 29 ago - 01 sep | **Done** |
| **Tarea 3.3** | Algoritmo de cálculo de saldos en JavaScript | Yerson Niño | 01 sep - 03 sep | **Done** |
| **Tarea 3.4** | Pruebas de actualización de balance en vivo | Fabián Córdoba / Juan Diego Peraza | 03 sep - 05 sep | **Done** |

---

## 3. Registro Obligatorio del Uso de Inteligencia Artificial (Lineamientos de la Materia)

En cumplimiento de las directrices académicas de la asignatura (*"El uso de IA no está prohibido, está sujeto a registro"*), se detalla la bitácora de interacción con herramientas de IA:

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
   - *Motivo:* Aunque la IA frecuentemente sugiere librerías complejas, el equipo decidió usar **Vanilla JavaScript con ES6 Modules nativos**. Esto elimina la sobrecarga de dependencias (`node_modules`), acelera la ejecución y asegura que durante la **prueba de modificación en vivo** cualquier integrante del equipo pueda rastrear el flujo del código sin abstraerse en el Virtual DOM o configuraciones de empaquetado.
2. **Rechazamos guardar balances o transacciones en `localStorage`:**
   - *Motivo:* Algunas sugerencias iniciales proponían guardar datos localmente para acelerar la carga ("optimistic UI"). Se rechazó de forma estricta porque violaba la **Condición Técnica Obligatoria #1 (Persistencia Real)**, que exige que los datos sobrevivan al cierre de la aplicación y se compartan entre convivientes mediante la base de datos Firestore.
3. **Rechazamos consolidar la lógica en un único script `app.js` monolítico:**
   - *Motivo:* Se descartó cualquier código que mezclara llamadas a Firebase con `document.getElementById()`, exigiendo una estricta separación donde `src/services/` nunca accede a la interfaz gráfica.
