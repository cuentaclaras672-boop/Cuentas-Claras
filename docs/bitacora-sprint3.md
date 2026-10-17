# Bitácora de Sprint 3 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 3 (03 de octubre al 16 de octubre de 2026 · Semana de receso del 05 al 12 de octubre)  
**Hito de Cierre:** PARCIAL Corte II, Sprint Review, Sustentación y Retrospectiva (17 de octubre de 2026)  

---

## 1. Estado del Tablero (Miro)

Historias comprometidas y culminadas en el Sprint 3:

| Historia de Usuario | Condición técnica que refuerza | Story Points | Responsable Principal | Columna en Tablero |
|---|---|:---:|---|:---:|
| **HU-08: Préstamos a terceros con abonos parciales** | #1 (Persistencia) y #4 (Filtrado) | 8 SP | Daniel Cortes / Yerson Niño | **Terminado (Done - S3)** |
| **HU-09: Hogar compartido entre convivientes** | #2 (Control de acceso y aislamiento) | 5 SP | Daniel Cortes / Jorman Palacios | **Terminado (Done - S3)** |
| **HU-10: Gráfica de gastos por categoría** | #4 (Filtrado y Visualización) | 3 SP | Juan Diego Peraza / Yerson Niño | **Terminado (Done - S3)** |

---

### 1.1 Tareas del Sprint Backlog (detalle y criterios en el [Acta de Planning](acta-planning-sprint3.md))

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro |
|---|---|---|:---:|:---:|
| **Tarea 8.1** | Modelo `Prestamo.js` con validaciones y cálculo de saldo pendiente | Yerson Niño | 03 oct - 06 oct | **Done** |
| **Tarea 8.2** | Servicio Firestore: colección `prestamos`, abonos y reglas de seguridad | Daniel Cortes | 06 oct - 13 oct | **Done** |
| **Tarea 8.3** | Tarjetas de préstamos, formulario de abono, filtro por estado y tarjeta "Por cobrar" | Jorman Palacios | 13 oct - 15 oct | **Done** |
| **Tarea 8.4** | Pruebas: abonos parciales, abono mayor al pendiente y cambio a "Saldado" | Fabián Córdoba | 14 oct - 16 oct | **Done** |
| **Tarea 9.1** | Modelo `Hogar.js` y generación del código de invitación (6 caracteres) | Yerson Niño | 04 oct - 07 oct | **Done** |
| **Tarea 9.2** | Servicio de hogares (crear, unirse, salir) y reglas de seguridad | Daniel Cortes | 07 oct - 14 oct | **Done** |
| **Tarea 9.3** | Pantalla "Mi hogar" y etiqueta de autor en movimientos compartidos | Jorman Palacios | 13 oct - 16 oct | **Done** |
| **Tarea 9.4** | Pruebas con dos cuentas y prueba negativa con una tercera cuenta | Fabián Córdoba | 14 oct - 16 oct | **Done** |
| **Tarea 10.1** | Función pura que agrupa los gastos por categoría y calcula porcentajes | Yerson Niño | 12 oct - 14 oct | **Done** |
| **Tarea 10.2** | Gráfica de barras en Tailwind conectada a filtros y divisa | Juan Diego Peraza | 14 oct - 16 oct | **Done** |
| **Tarea 10.3** | Pruebas con filtros, cambio de divisa y estado vacío | Fabián Córdoba | 15 oct - 16 oct | **Done** |

---

### 1.2 Burndown del Sprint 3 (medido en tareas)
Total de tareas del sprint: **11**. Se mide al cierre de cada semana.

| Semana | Corte | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| Inicio | 03 oct | 11 | 11 | 11 |
| Semana 5 (Receso) | 10 oct | 5,5 | 7 | 5 |
| Semana 6 (Cierre) | 16 oct | 0 | 0 | 0 |
| Cierre / Parcial | 17 oct | 0 | 0 | **0 (100% Cerrado)** |

> El equipo mantuvo ritmo sostenible antes y después del receso institucional (del 05 al 12 de octubre), cerrando las 11 tareas con respaldo de pruebas automatizadas en `tests/runner.js`.

### 1.3 Velocidad
| Sprint | Duración | Historias terminadas | SP terminados | Eficacia |
|:---:|:---:|:---:|:---:|:---:|
| **1** | 2 semanas | 3 | 15 | 100% |
| **2** | 2 semanas | 4 | 21 (de 21 comprometidos) | 100% |
| **3** | 2 semanas (con receso) | 3 | **16 (de 16 comprometidos)** | **100%** |

---

## 2. Registro de Dailies

### Daily — 04 de Octubre de 2026 (Semana 5 - Arranque Sprint 3)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Consolidación de la Sustentación 2 (03 de octubre) y planeación del Sprint 3.
- **Hoy:** Definición de la estructura de las entidades de dominio `Prestamo.js` y `Hogar.js`.
- **Impedimentos:** Ninguno.

### Daily — 13 de Octubre de 2026 (Semana 6 - Retorno de Receso)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Finalización del receso institucional (05 al 12 de octubre).
- **Hoy:** Integración de los servicios transaccionales en Cloud Firestore para préstamos y validación del código de 6 caracteres para hogares.
- **Impedimentos:** Necesidad de verificar reglas de seguridad en Firestore para que no generen errores de permisos.

### Daily — 15 de Octubre de 2026 (Semana 6 - Integración QA)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Despliegue de servicios `prestamos.js` y `hogares.js` y función de agrupación de estadísticas en `estadisticas.js`.
- **Hoy:** Ejecución de suites de aseguramiento de calidad QA (Tareas 8.4, 9.4 y 10.3). Verificación de abonos atómicos, prueba negativa de aislamiento con tercera cuenta externa y reactividad de gráfica ante filtros.
- **Impedimentos:** Ninguno. Cobertura de pruebas al 100% en `tests/runner.js`.

### Daily — 16 de Octubre de 2026 (Semana 6 - Estabilización y Seguridad)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Desacoplamiento de la inicialización de Firebase en `src/services/firebase.js` y segregación de credenciales en `firebase-config.js` excluido mediante `.gitignore`.
- **Hoy:** Verificación integral de la documentación del Sprint 3, revisión de las actas de planificación y certificación de pruebas ante el simulacro de entrega.
- **Impedimentos:** Recordatorio al equipo para publicar `firestore.rules` en Firebase Console.

### Daily — 17 de Octubre de 2026 (Semana 6 - Cierre de Corte II)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Cierre técnico del Sprint 3 con 16/16 SP cumplidos y suite de pruebas en 100% de aprobación.
- **Hoy:** Presentación en vivo del incremento en la sesión de **PARCIAL Corte II, Review, Sustentación y Retrospectiva** con la docente Vilma Yenny Bohórquez.
- **Impedimentos:** Ninguno. Equipo listo para sustentar y dar paso al Sprint 4.

---

## 3. Registro de Uso de Inteligencia Artificial en el Sprint 3

### 3.1 ¿Qué le pedimos a la IA?
1. Ideas para modelar la colección `hogares` en Firestore y las reglas de seguridad para que los convivientes vean solo los movimientos compartidos sin filtrar datos personales.
2. Formulación del cálculo de saldo pendiente y validación defensiva en transacciones atómicas para que ningún abono sea superior a la deuda.
3. Estructuración de barras horizontales proporcionales con Tailwind CSS nativo para prescindir de librerías de terceros (Chart.js).

### 3.2 ¿Qué aceptamos?
- La gráfica con barras de HTML y Tailwind CSS nativo, manteniendo la política de 0 dependencias pesadas en producción.
- La separación visual de préstamos en la tarjeta "Por cobrar", evitando distorsionar el saldo líquido disponible del hogar.
- El aislamiento estricto en Firestore verificado mediante prueba negativa en la suite QA.
- El desacoplamiento de credenciales en `firebase-config.js` y plantilla pública `firebase-config.example.js` protegidas en `.gitignore`.

### 3.3 ¿Qué rechazamos y por qué?
1. **Incluir librerías externas de gráficos (Chart.js / ApexCharts):** El proyecto corre con módulos ES6 nativos; incluir empaquetadores aumentaba el riesgo de fallos en el navegador y contradecía la arquitectura limpia establecida.
2. **Permitir pertenencia a múltiples hogares simultáneos:** Complejizaba las reglas de seguridad sin aportar al caso de uso pedagógico esencial (convivientes en un mismo hogar).

---

## 4. Retrospectiva del Sprint 3 (17 de Octubre de 2026)
**Facilitador:** Fabián Córdoba (Scrum Master) · **Fecha:** 17 de octubre de 2026  
**Participantes:** Juan Diego Peraza (PO), Fabián Córdoba (SM), Daniel Cortes (Dev), Jorman Palacios (Dev), Yerson Niño (Dev).

| ¿Qué funcionó bien? | ¿Qué dificultades se presentaron? | Acción de mejora para el Sprint 4 | Responsable |
|---|---|---|---|
| **Arquitectura de Dominio Pura:** Los modelos `Prestamo.js` y `Hogar.js` encapsularon toda la lógica matemática y de validación, facilitando pruebas unitarias directas. | **Bloqueo y Seguridad de Credenciales:** La exposición del API Key en repositorios públicos evidenció la necesidad de aislar credenciales. | Centralizar la configuración de Firebase en `firebase-config.js` protegido en `.gitignore` y distribuir la plantilla `firebase-config.example.js` para todo el equipo. | Juan Diego Peraza |
| **Suite QA Unificada:** El orquestador `tests/runner.js` permitió certificar las 7 suites del proyecto en un solo comando con 100% de éxito. | **Ajuste de Calendario Académico:** El cambio de fechas de la docente y el receso del 5 al 12 de octubre exigieron reajustar las sesiones de Review y Retrospectiva al 17 de octubre. | Sincronizar el cronograma oficial de la materia de forma inmediata en las actas de Scrum y la bitácora para evitar desalineación en sustentaciones. | Fabián Córdoba (Scrum Master) |
| **Atomicidad Transaccional:** El uso de `runTransaction` garantizó que los abonos a préstamos no generen inconsistencias ni saldos negativos. | **Permisos en Firestore:** Intentos de consulta sobre colecciones nuevas arrojaron `permission-denied` si las reglas no estaban publicadas en la consola web. | Incluir como paso obligatorio de DoD la publicación formal de `firestore.rules` en Firebase Console antes de realizar pruebas end-to-end. | Daniel Cortes / Fabián Córdoba |

> **Conclusión de la Retrospectiva:** El equipo Scrum logró una efectividad del 100% en los tres primeros sprints (15 SP en S1, 21 SP en S2, 16 SP en S3), totalizando **52 Story Points completados**. El equipo queda preparado y alineado para el inicio del **Sprint 4 (17 al 30 de octubre de 2026)**.
