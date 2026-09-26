# Bitácora de Sprint 2 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 2 (Semanas 6 a 9: 07 de septiembre al 03 de octubre de 2026 · Sustentación 2: 10 de octubre)  
**Fecha de Corte:** 26 de septiembre de 2026 (Semana 8 · Promedio del Sprint)  

---

## 1. Estado del Tablero (Miro)

A fecha del **26 de septiembre de 2026**, el equipo se encuentra promediando el Sprint 2. Las historias aprobadas corresponden al Sprint 1, mientras que las del Sprint 2 abordan directamente las condiciones técnicas obligatorias pendientes para la Sustentación 2:

| Historia de Usuario | Condición Técnica Vinculada | Story Points | Responsable Principal | Columna en Tablero |
|---|---|:---:|---|:---:|
| **HU-01: Autenticación (Firebase Auth)** | Condición #2 (Control de Acceso) | 5 SP | Juan Diego Peraza | **Terminado (Done - S1)** |
| **HU-02: Registro Transacciones (Firestore)** | Condición #1 (Persistencia Real) | 5 SP | Daniel Cortes / Yerson Niño | **Terminado (Done - S1)** |
| **HU-03: Dashboard Saldo Líquido** | Entrega Principal de Valor | 5 SP | Jorman Palacios | **Terminado (Done - S1)** |
| **HU-04: Bolsillos de Ahorro / Metas** | Núcleo del Product Goal | 8 SP | Yerson Niño / Daniel Cortes | **Work in Progress (WIP)** |
| **HU-05: Historial y Búsqueda Avanzada** | **Condición #4 (Filtrado y Búsqueda)** | 5 SP | Jorman Palacios | **En Pruebas (Testing)** |
| **HU-06: Integración Externa TRM y Divisas** | **Condición #3 (Integración Externa API)**| 5 SP | Daniel Cortes / Juan Diego Peraza | **En Pruebas (Testing)** |
| **HU-07: Avisos de Conexión y Validaciones** | **Condición #5 (Manejo de Errores)** | 3 SP | Fabián Córdoba | **En Pruebas (Testing)** |

---

### 1.1 Tareas del Sprint Backlog (detalle y criterios en el [Acta de Planning](acta-planning-sprint2.md))

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro |
|---|---|---|:---:|:---:|
| **Tarea 5.1** | Diseñar barra de búsqueda y selectores en HTML/Tailwind | Jorman Palacios | 09 sep - 12 sep | **Done** |
| **Tarea 5.2** | Filtrado combinado (texto, categoría, tipo, ámbito) en `dashboard.js` | Yerson Niño | 13 sep - 16 sep | **Done** |
| **Tarea 5.3** | Filtro por rango de fechas con validación "desde ≤ hasta" | Daniel Cortes | 16 sep - 20 sep | *Actualizar según Miro* |
| **Tarea 5.4** | Pruebas de combinaciones de filtros, estado vacío y botón limpiar | Fabián Córdoba | 21 sep - 26 sep | **En Pruebas** |
| **Tarea 6.1** | Servicio `indicadores.js`: API de la TRM con respaldos | Daniel Cortes | 10 sep - 14 sep | **Done** |
| **Tarea 6.2** | Función de conversión de divisa (COP a USD) y utilidades | Yerson Niño | 15 sep - 19 sep | **Done** |
| **Tarea 6.3** | Componente visual de indicador y toggle multidivisa | Juan Diego Peraza / Jorman Palacios | 20 sep - 24 sep | **Done** |
| **Tarea 6.4** | Pruebas con la API caída y verificación del valor referencial | Fabián Córdoba | 24 sep - 28 sep | **En Pruebas** |
| **Tarea 7.1** | Diseño del aviso "Sin conexión" y estilo de error por campo | Jorman Palacios | 12 sep - 16 sep | *Actualizar según Miro* |
| **Tarea 7.2** | Módulo `conexion.js` con eventos `online` / `offline` | Daniel Cortes | 16 sep - 20 sep | *Actualizar según Miro* |
| **Tarea 7.3** | Mensajes de validación debajo de cada campo | Yerson Niño | 21 sep - 24 sep | *Actualizar según Miro* |
| **Tarea 7.4** | Pruebas en modo offline (F12) y con datos inválidos | Fabián Córdoba | 25 sep - 29 sep | **En Pruebas** |
| **Tarea 4.1** | Modelo `Bolsillo.js` con validaciones | Yerson Niño | 18 sep - 22 sep | **Done** |
| **Tarea 4.2** | Servicio de bolsillos en Firestore y reglas de seguridad | Daniel Cortes | 23 sep - 27 sep | **WIP (En Progreso)** |
| **Tarea 4.3** | Tarjetas de bolsillos con barra de progreso y formulario | Jorman Palacios | 27 sep - 30 sep | **Por Hacer** |
| **Tarea 4.4** | Descuento del saldo disponible y pruebas de integración | Fabián Córdoba | 30 sep - 03 oct | **Por Hacer** |


### 1.2 Burndown del Sprint 2 (medido en tareas)
Total de tareas del sprint: **16**. Se mide al cierre de cada semana (sábado). La columna "Ideal" baja 4 tareas por semana; "Planificado" sale de las fechas de fin de cada tarea; "Real" se llena con lo que esté en "Terminado" en Miro ese día.

| Semana | Corte | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| Inicio | 07 sep | 16 | 16 | 16 |
| 6 | 12 sep | 12 | 15 | |
| 7 | 19 sep | 8 | 11 | |
| 8 | 26 sep | 4 | 5 | |
| 9 | 03 oct | 0 | 0 | |

> El plan va por encima de la línea ideal en las semanas 6 y 7 porque las primeras tareas de cada historia son de diseño y tardan más en cerrarse; el grueso se termina en la semana 8.

### 1.3 Velocidad
| Sprint | Duración | Historias terminadas | SP terminados |
|:---:|:---:|:---:|:---:|
| 1 | 2 semanas | 3 | 15 |
| 2 | 4 semanas | *(llenar al cierre)* | *(de 21 comprometidos)* |

---

## 2. Registro de Dailies de Sprint 2 (Muestreo del Periodo)

### Daily — 08 de Septiembre de 2026 (Semana 6 - Arranque de Sprint 2)
- **Ayer:** Cierre y consolidación del Sprint 1 tras la Sustentación 1 (05 de septiembre).
- **Hoy:** Ceremonia de Sprint Planning 2, estimación en Story Points (21 SP totales) y definición de arquitectura para la API de la TRM y el módulo de bolsillos.
- **Impedimentos:** Ninguno.

### Daily — 14 de Septiembre de 2026 (Semana 7 - Construcción Inicial)
- **Ayer:** Conclusión de la maquetación de búsqueda y selectores (Tarea 5.1) y spike de consumo de la TRM (Tarea 6.1).
- **Hoy:** Programar la lógica de filtrado combinado en memoria y el modelado de la clase `Bolsillo.js`.
- **Impedimentos:** Ninguno.

### Daily — 21 de Septiembre de 2026 (Semana 8 - Integración y Pruebas)
- **Ayer:** Estabilización del servicio de notificaciones Toasts para capturar fallos de red (Tarea 7.3).
- **Hoy:** Iniciar fase de pruebas (Testing) de filtros e indicadores económicos; avanzar en la lógica de transferencia hacia bolsillos en Firestore (Tarea 4.2).
- **Impedimentos:** Ninguno.

### Daily — 26 de Septiembre de 2026 (Semana 8 - Estado Actual)
- **Ayer:** Verificación de las llamadas a la TRM y validación de estados vacíos en el historial de movimientos.
- **Hoy:** Continuar el desarrollo de las transferencias de bolsillos (Tarea 4.2 en WIP) para pasar a la maquetación de tarjetas la próxima semana.
- **Impedimentos:** Ninguno. Ritmo sostenible y sincronizado con el cronograma hacia la Sustentación 2 (05 - 10 de octubre).

---

## 3. Registro de Uso de Inteligencia Artificial en Sprint 2 (Lineamientos de la Materia)

### 3.1 ¿Qué le pedimos a la IA?
1. Asistencia para estructurar un cronograma realista de 4 semanas en Scrum que muestre flujo de trabajo continuo desde el 7 de septiembre.
2. Formulación del servicio asíncrono para consumir la TRM en `indicadores.js` con fallback offline seguro.
3. Sugerencias de maquetación en Tailwind CSS para representar visualmente el avance porcentual de los bolsillos de ahorro.

### 3.2 ¿Qué aceptamos?
- La inclusión del módulo `indicadores.js` como una historia formal de sprint (HU-06), cubriendo la Condición Técnica #3.
- La distribución equitativa de tareas a lo largo de las 4 semanas para evidenciar autoría distribuida en el tiempo según los lineamientos de la materia.
- La conversión referencial de divisas en cliente para fundamentar decisiones de compras o ahorros en moneda extranjera.

### 3.3 ¿Qué rechazamos y por qué? (Criterio de Evaluación de Ingeniería)
1. **Rechazamos concentrar todas las tareas únicamente en las últimas dos semanas del sprint:**  
   *Motivo:* En Scrum, un sprint de 4 semanas debe evidenciar trabajo continuo desde la primera semana (Semana 6). Concentrar las tareas solo al final distorsiona la velocidad del equipo y viola la exigencia de la guía docente (*"el historial debe mostrar trabajo distribuido en el tiempo y autoría individual identificable"*).
2. **Rechazamos priorizar funcionalidades secundarias (deudas a terceros) sobre las condiciones técnicas obligatorias:**  
   *Motivo:* El equipo trasladó el Control de Deudas al Sprint 3 para asegurar que en la Sustentación 2 el 100% de la rúbrica técnica innegociable esté cumplido y certificado con historias de Prioridad Alta.

---

## 4. Retrospectiva del Sprint 2 (llenar en la semana 9, antes de la Sustentación 2)

| ¿Qué funcionó? | ¿Qué no funcionó? | Acción de mejora para el Sprint 3 | Responsable |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

> Cada acción de mejora debe ser concreta y verificable en el Sprint 3 (por ejemplo: "actualizar el burndown todos los sábados", no "comunicarnos mejor").
