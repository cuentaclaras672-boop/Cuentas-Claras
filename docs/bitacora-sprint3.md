# Bitácora de Sprint 3 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 3 (Semanas 11 a 13: 12 de octubre al 31 de octubre de 2026)  
**Fecha de Corte:** 24 de octubre de 2026 (Semana 12 · Promedio del Sprint)  

---

## 1. Estado del Tablero (Miro)

A fecha del **24 de octubre de 2026**, el equipo se encuentra promediando el Sprint 3. Tras el cierre y consolidación de los Sprints 1 y 2 (donde quedaron culminadas las 5 condiciones técnicas obligatorias evaluadas en las Sustentaciones 1 y 2), el Sprint 3 profundiza en el valor diferencial del Product Goal (préstamos con abonos parciales, hogar compartido para convivientes y visualización analítica de gastos):

| Historia de Usuario | Condición Técnica Vinculada | Story Points | Responsable Principal | Columna en Tablero |
|---|---|:---:|---|:---:|
| **HU-01: Autenticación (Firebase Auth)** | Condición #2 (Control de Acceso) | 5 SP | Juan Diego Peraza | **Terminado (Done - S1)** |
| **HU-02: Registro Transacciones (Firestore)** | Condición #1 (Persistencia Real) | 5 SP | Daniel Cortes / Yerson Niño | **Terminado (Done - S1)** |
| **HU-03: Dashboard Saldo Líquido** | Entrega Principal de Valor | 5 SP | Jorman Palacios | **Terminado (Done - S1)** |
| **HU-04: Bolsillos de Ahorro / Metas** | Núcleo del Product Goal | 8 SP | Yerson Niño / Daniel Cortes | **Terminado (Done - S2)** |
| **HU-05: Historial y Búsqueda Avanzada** | Condición #4 (Filtrado y Búsqueda) | 5 SP | Jorman Palacios | **Terminado (Done - S2)** |
| **HU-06: Integración Externa TRM y Divisas** | Condición #3 (Integración Externa API) | 5 SP | Daniel Cortes / Juan Diego Peraza | **Terminado (Done - S2)** |
| **HU-07: Avisos de Conexión y Validaciones** | Condición #5 (Manejo de Errores) | 3 SP | Fabián Córdoba | **Terminado (Done - S2)** |
| **HU-08: Préstamos a terceros con abonos parciales** | Refuerzo Condición #1 y #4 | 8 SP | Yerson Niño / Daniel Cortes / Jorman Palacios | **En Pruebas (Testing)** |
| **HU-09: Hogar compartido entre convivientes** | Refuerzo Condición #2 (Seguridad RBAC) | 5 SP | Daniel Cortes / Jorman Palacios | **Work in Progress (WIP)** |
| **HU-10: Gráfica de gastos por categoría** | Refuerzo Condición #4 (Filtrado/Agrupación) | 3 SP | Juan Diego Peraza / Yerson Niño | **Por Hacer (To Do)** |

---

### 1.1 Tareas del Sprint Backlog (detalle y criterios en el [Acta de Planning](acta-planning-sprint3.md))

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro (al corte 24 oct) |
|---|---|---|:---:|:---:|
| **Tarea 8.1** | Modelo `Prestamo.js` con validaciones y cálculo de saldo pendiente | Yerson Niño | 12 oct - 15 oct | **Done** |
| **Tarea 8.2** | Servicio Firestore: colección `prestamos`, abonos y reglas de seguridad | Daniel Cortes | 15 oct - 19 oct | **Done** |
| **Tarea 8.3** | Tarjetas de préstamos, formulario de abono, filtro por estado y tarjeta "Por cobrar" | Jorman Palacios | 19 oct - 23 oct | **Done** |
| **Tarea 8.4** | Pruebas funcionales: abonos parciales, validación de sobrepago y cambio a "Saldado" | Fabián Córdoba | 23 oct - 26 oct | **En Pruebas** |
| **Tarea 9.1** | Modelo `Hogar.js` y algoritmo de generación de código de invitación (6 caracteres) | Yerson Niño | 15 oct - 18 oct | **Done** |
| **Tarea 9.2** | Servicio de hogares (crear, unirse, salir) y reglas de seguridad en `firestore.rules` | Daniel Cortes | 19 oct - 23 oct | **Done** |
| **Tarea 9.3** | Interfaz "Mi hogar", gestión de miembros y etiqueta de autor en gastos compartidos | Jorman Palacios | 23 oct - 27 oct | **En Progreso** |
| **Tarea 9.4** | Pruebas de aislamiento multiusuario (dos cuentas) y prueba negativa de acceso ajeno | Fabián Córdoba | 27 oct - 30 oct | **Por Hacer** |
| **Tarea 10.1** | Función pura de agregación de gastos por categoría y cálculo de porcentajes | Yerson Niño | 21 oct - 23 oct | **Done** |
| **Tarea 10.2** | Componente visual de barras horizontales en Tailwind conectado a filtros y divisa | Juan Diego Peraza | 24 oct - 28 oct | **Por Hacer** |
| **Tarea 10.3** | Pruebas de reactividad con filtros del historial, alternancia COP/USD y estado vacío | Fabián Córdoba | 28 oct - 30 oct | **Por Hacer** |

---

### 1.2 Burndown del Sprint 3 (medido en tareas)
Total de tareas del sprint: **11**. Se mide al cierre de cada semana (sábado). La columna "Ideal" desciende de forma equilibrada a razón de ~3,6 tareas por semana; "Planificado" refleja las fechas pactadas en el planning; "Real" refleja las tareas efectivamente concluidas y verificadas en Miro.

| Semana | Corte | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| Inicio | 12 oct | 11 | 11 | 11 |
| 11 | 17 oct | 7.3 | 8 | 8 |
| 12 | 24 oct | 3.6 | 4 | 5 |
| 13 | 31 oct | 0 | 0 | *(por registrar al cierre)* |

> En la semana 11 el equipo dedicó tiempo al saneamiento de la deuda técnica remanente del Sprint 2 (corrección del constructor en `Bolsillo.js` y publicación de reglas en Firebase Console) antes de volcarse de lleno a las tareas nuevas. El avance se acelera en la semana 12 cerrando el flujo completo de préstamos y la base de datos de hogares.

---

### 1.3 Velocidad Histórica
| Sprint | Duración | Historias terminadas | SP terminados | Estado de Requisitos Técnicos |
|:---:|:---:|:---:|:---:|---|
| 1 | 2 semanas | 3 | 15 | Sustentación 1 Aprobada (Condiciones #1 y #2) |
| 2 | 4 semanas | 4 | 21 | Sustentación 2 Aprobada (Condiciones #3, #4 y #5) |
| 3 | 3 semanas | *(por cerrar)* | *(de 16 comprometidos)* | Funcionalidades avanzadas de Product Goal (HU-08, HU-09, HU-10) |

---

## 2. Registro de Dailies de Sprint 3 (Muestreo del Periodo)

### Daily — 13 de Octubre de 2026 (Semana 11 - Arranque de Sprint 3 y Saneamiento)
- **Ayer:** Reunión de Sprint Planning 3; definición del Sprint Goal y asignación de las 11 tareas para las 3 semanas de trabajo.
- **Hoy:** Resolver de inmediato la deuda técnica prioritaria (corrección del error de inicialización en `Bolsillo.js` donde `parsearMonto` rechazaba el valor cero al crear un bolsillo) e iniciar la programación del modelo `Prestamo.js` (Tarea 8.1).
- **Impedimentos:** Ninguno. Reglas de Firestore sincronizadas en local y pendientes de publicación en consola por Daniel Cortes.

### Daily — 20 de Octubre de 2026 (Semana 12 - Construcción de Servicios y Préstamos)
- **Ayer:** Conclusión del servicio Firestore para préstamos (Tarea 8.2) y maquetación preliminar del modelo `Hogar.js` (Tarea 9.1).
- **Hoy:** Integrar el formulario de abonos parciales y la tarjeta de resumen "Por cobrar" en la UI del dashboard (Tarea 8.3); Daniel inicia las reglas de seguridad de la colección `hogares` (Tarea 9.2).
- **Impedimentos:** Se acordó que el saldo de préstamos no altere el saldo líquido disponible de la cuenta bancaria, mostrándose como un activo independiente para no distorsionar las métricas de liquidez diaria.

### Daily — 27 de Octubre de 2026 (Semana 13 - Integración Multiusuario y Gráfica)
- **Ayer:** Estabilización de la pantalla de gestión de hogar con código de invitación (Tarea 9.3).
- **Hoy:** Iniciar pruebas de aislamiento con dos navegadores simultáneos simulando dos convivientes del mismo hogar (Tarea 9.4); iniciar el ensamble del componente visual de barras para gastos por categoría (Tarea 10.2).
- **Impedimentos:** Ninguno. El equipo coordina sesión de revisión cruzada de código para garantizar que ningún dato de usuario se renderice sin `escaparHTML`.

---

## 3. Registro de Uso de Inteligencia Artificial en Sprint 3 (Lineamientos de la Materia)

### 3.1 ¿Qué le pedimos a la IA?
1. Asistencia en el diseño arquitectónico de la colección `hogares` en Firestore y la formulación segura de reglas de seguridad para convivientes sin crear sobrecostos de lectura (`get()` anidados excesivos).
2. Estructuración del algoritmo de cálculo y amortización de préstamos para garantizar que ningún abono supere el saldo pendiente.
3. Propuesta de diseño para representar una gráfica de distribución de gastos por categoría utilizando HTML nativo y Tailwind CSS sin introducir dependencias pesadas de NPM como Chart.js o D3.

### 3.2 ¿Qué aceptamos?
- La implementación de una gráfica de barras horizontales nativa construida con contenedores `div` y flexbox de Tailwind, manteniendo el proyecto liviano, sin dependencias y de carga instantánea.
- La restricción estricta de que los préstamos a terceros se manejen como una cuenta analítica independiente ("Por cobrar") que no descuenta automáticamente el saldo líquido del usuario en el dashboard.
- La verificación de seguridad en dos niveles para el hogar compartido: filtrado en la consulta del cliente (`where('hogarId', '==', ...)` y comprobación en servidor mediante reglas de Firestore.

### 3.3 ¿Qué rechazamos y por qué? (Criterio de Evaluación de Ingeniería)
1. **Rechazamos instalar librerías externas de visualización de datos (ej. Chart.js, Recharts o ApexCharts):**  
   *Motivo:* El proyecto está diseñado como una SPA ligera con módulos ES6 nativos sin empaquetadores complejos. Instalar una librería externa aumentaba innecesariamente el peso del bundle y complejizaba el despliegue para la sustentación. La solución con Tailwind nativo es suficiente, accesible y no introduce vectores de vulnerabilidad.
2. **Rechazamos permitir que un usuario pertenezca a múltiples hogares simultáneamente en esta fase:**  
   *Motivo:* En Scrum se busca entregar incrementos usables de máximo valor con el menor riesgo. Manejar múltiples hogares requería un selector de contexto global y reglas de seguridad de gran complejidad que consumían más de 13 SP. Limitar el hogar a 1 por usuario cubre el caso de uso del 95% de los convivientes y garantiza estabilidad para el cierre de la materia.

---

## 4. Retrospectiva del Sprint 3 (llenar en la semana 13, antes del cierre de Sprint)

| ¿Qué funcionó? | ¿Qué no funcionó? | Acción de mejora para el Sprint 4 (Entrega Final) | Responsable |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

> Cada acción de mejora debe ser concreta y verificable en el Sprint 4 (por ejemplo: "ejecutar suite de pruebas de regresión antes de congelar versión final", no "esforzarnos más").
