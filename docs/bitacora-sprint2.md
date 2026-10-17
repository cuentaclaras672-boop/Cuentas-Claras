# Bitácora de Sprint 2 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 2 (19 de septiembre al 02 de octubre de 2026 · Daily en vivo el 26/09/2026)  
**Hito de Cierre:** Sustentación de Resultados de Sprint 2 (03 de octubre de 2026)  

---

## 1. Estado del Tablero (Miro)

Al cierre del **Sprint 2 (02 de octubre de 2026)**, el equipo concluyó exitosamente el 100% de las historias comprometidas, cumpliendo las condiciones técnicas obligatorias de la materia:

| Historia de Usuario | Condición Técnica Vinculada | Story Points | Responsable Principal | Columna en Tablero |
|---|---|:---:|---|:---:|
| **HU-01: Autenticación (Firebase Auth)** | Condición #2 (Control de Acceso) | 5 SP | Juan Diego Peraza | **Terminado (Done - S1)** |
| **HU-02: Registro Transacciones (Firestore)** | Condición #1 (Persistencia Real) | 5 SP | Daniel Cortes / Yerson Niño | **Terminado (Done - S1)** |
| **HU-03: Dashboard Saldo Líquido** | Entrega Principal de Valor | 5 SP | Jorman Palacios | **Terminado (Done - S1)** |
| **HU-04: Bolsillos de Ahorro / Metas** | Núcleo del Product Goal | 8 SP | Yerson Niño / Daniel Cortes | **Terminado (Done - S2)** |
| **HU-05: Historial y Búsqueda Avanzada** | **Condición #4 (Filtrado y Búsqueda)** | 5 SP | Jorman Palacios | **Terminado (Done - S2)** |
| **HU-06: Integración Externa TRM y Divisas** | **Condición #3 (Integración Externa API)**| 5 SP | Daniel Cortes / Juan Diego Peraza | **Terminado (Done - S2)** |
| **HU-07: Avisos de Conexión y Validaciones** | **Condición #5 (Manejo de Errores)** | 3 SP | Fabián Córdoba | **Terminado (Done - S2)** |

---

### 1.1 Tareas del Sprint Backlog (detalle y criterios en el [Acta de Planning](acta-planning-sprint2.md))

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro |
|---|---|---|:---:|:---:|
| **Tarea 5.1** | Diseñar barra de búsqueda y selectores en HTML/Tailwind | Jorman Palacios | 19 sep - 21 sep | **Done** |
| **Tarea 5.2** | Filtrado combinado (texto, categoría, tipo, ámbito) en `dashboard.js` | Yerson Niño | 21 sep - 24 sep | **Done** |
| **Tarea 5.3** | Filtro por rango de fechas con validación "desde ≤ hasta" | Daniel Cortes | 24 sep - 26 sep | **Done** |
| **Tarea 5.4** | Pruebas de combinaciones de filtros, estado vacío y botón limpiar | Fabián Córdoba | 26 sep - 28 sep | **Done** |
| **Tarea 6.1** | Servicio `indicadores.js`: API de la TRM con respaldos | Daniel Cortes | 20 sep - 22 sep | **Done** |
| **Tarea 6.2** | Función de conversión de divisa (COP a USD) y utilidades | Yerson Niño | 22 sep - 24 sep | **Done** |
| **Tarea 6.3** | Componente visual de indicador y toggle multidivisa | Juan Diego Peraza / Jorman Palacios | 24 sep - 27 sep | **Done** |
| **Tarea 6.4** | Pruebas con la API caída y verificación del valor referencial | Fabián Córdoba | 27 sep - 29 sep | **Done** |
| **Tarea 7.1** | Diseño del aviso "Sin conexión" y estilo de error por campo | Jorman Palacios | 21 sep - 23 sep | **Done** |
| **Tarea 7.2** | Módulo `conexion.js` con eventos `online` / `offline` | Daniel Cortes | 23 sep - 26 sep | **Done** |
| **Tarea 7.3** | Mensajes de validación debajo de cada campo | Yerson Niño | 26 sep - 28 sep | **Done** |
| **Tarea 7.4** | Pruebas en modo offline (F12) y con datos inválidos | Fabián Córdoba | 28 sep - 30 sep | **Done** |
| **Tarea 4.1** | Modelo `Bolsillo.js` con validaciones | Yerson Niño | 22 sep - 25 sep | **Done** |
| **Tarea 4.2** | Servicio de bolsillos en Firestore y reglas de seguridad | Daniel Cortes | 25 sep - 28 sep | **Done** |
| **Tarea 4.3** | Tarjetas de bolsillos con barra de progreso y formulario | Jorman Palacios | 28 sep - 30 sep | **Done** |
| **Tarea 4.4** | Descuento del saldo disponible y pruebas de integración | Fabián Córdoba | 30 sep - 02 oct | **Done** |

---

### 1.2 Burndown del Sprint 2 (medido en tareas)
Total de tareas del sprint: **16**.

| Semana | Corte | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| Inicio | 19 sep | 16 | 16 | 16 |
| Semana 3 (Daily en vivo) | 26 sep | 8 | 9 | 8 |
| Semana 4 (Cierre) | 02 oct | 0 | 0 | 0 |
| Sustentación S2 | 03 oct | 0 | 0 | **0 (100% Cerrado)** |

---

### 1.3 Velocidad
| Sprint | Duración | Historias terminadas | SP terminados | Eficacia |
|:---:|:---:|:---:|:---:|:---:|
| **1** | 2 semanas | 3 | 15 | 100% |
| **2** | 2 semanas | 4 | **21 (de 21 comprometidos)** | **100%** |

---

## 2. Registro de Dailies de Sprint 2

### Daily — 20 de Septiembre de 2026 (Semana 3 - Arranque de Sprint 2)
- **Ayer:** Consolidación de la planeación de Sprint 2 y estimación en Story Points (21 SP totales).
- **Hoy:** Inicio de tareas de búsqueda en `dashboard.js` y spike de consumo de la TRM en `indicadores.js`.
- **Impedimentos:** Ninguno.

### Daily — 23 de Septiembre de 2026 (Semana 3 - Construcción)
- **Ayer:** Finalización de la barra de búsqueda y selectores (Tarea 5.1).
- **Hoy:** Integración de la conversión COP/USD y modelado defensivo de la entidad `Bolsillo.js`.
- **Impedimentos:** La API oficial de la TRM presentó intermitencias momentáneas; se confirmó el uso de URLs de fallback y valor referencial offline.

### Daily — 26 de Septiembre de 2026 (Semana 3 - Daily en Vivo con la Docente)
- **Evento Oficial:** Daily transmitida y evaluada en vivo ante la docente Vilma Yenny Bohórquez.
- **Ayer:** Estabilización de filtros avanzados por fechas y categorías (HU-05) y maquetación del indicador de la TRM.
- **Hoy:** Presentación del estado del tablero Miro ante la docente: 8 tareas concluidas, 8 en curso dentro del ritmo esperado.
- **Impedimentos:** Ninguno. Feedback docente positivo sobre el avance estructurado del equipo.

### Daily — 01 de Octubre de 2026 (Semana 4 - Cierre y Pruebas)
- **Ayer:** Deducción reactiva del saldo disponible ante asignación a bolsillos de ahorro (HU-04).
- **Hoy:** Ejecución de suites de aseguramiento de calidad QA (Tareas 5.4, 6.4, 7.4 y 4.4).
- **Impedimentos:** Ninguno. Suite automatizada en 100% de efectividad lista para la sustentación.

---

## 3. Registro de Uso de Inteligencia Artificial en Sprint 2

### 3.1 ¿Qué le pedimos a la IA?
1. Asistencia para estructurar un cronograma de 2 semanas en Scrum con Daily en vivo el 26 de septiembre y Sustentación el 03 de octubre.
2. Formulación del servicio asíncrono para consumir la TRM en `indicadores.js` con fallback offline seguro.
3. Sugerencias de maquetación en Tailwind CSS para representar visualmente el avance porcentual de los bolsillos de ahorro.

### 3.2 ¿Qué aceptamos?
- La inclusión del módulo `indicadores.js` como una historia formal de sprint (HU-06), cubriendo la Condición Técnica #3.
- La distribución equitativa de tareas para evidenciar autoría distribuida en el tiempo según lineamientos docentes.
- La conversión referencial de divisas en cliente para fundamentar decisiones de compras o ahorros en moneda extranjera.

### 3.3 ¿Qué rechazamos y por qué?
1. **Rechazamos librerías externas para la conversión de divisas:** Una función pura con tasa de cambio oficial cubre la necesidad de forma liviana y sin dependencias.
2. **Rechazamos priorizar funcionalidades secundarias (deudas a terceros) sobre las condiciones técnicas obligatorias:** El equipo trasladó el Control de Deudas al Sprint 3 para asegurar que en la Sustentación 2 el 100% de la rúbrica técnica obligatoria estuviera certificada.

---

## 4. Retrospectiva del Sprint 2 (03 de Octubre de 2026)
**Facilitador:** Fabián Córdoba (Scrum Master) · **Fecha:** 03 de octubre de 2026

| ¿Qué funcionó? | ¿Qué no funcionó? | Acción de mejora para el Sprint 3 | Responsable |
|---|---|---|---|
| La arquitectura modular en Vanilla JS con ES6 Modules facilitó ejecutar las pruebas en DevTools con F12 en ceros y sin sobrecarga de dependencias. | La API de la TRM presentó intermitencias que hicieron indispensable el uso de endpoints de respaldo y el valor referencial offline. | Incorporar límite de tiempo de espera (5 s) en el servicio de indicadores para no retardar la carga inicial ante APIs lentas. | Daniel Cortes |
| La estrategia multicanal de indicadores y el manejo offline mantuvieron la interfaz operativa ante cortes de red simulados. | El modelo Bolsillo requirió ajuste en el constructor para permitir saldo inicial en cero ($0) al crearse sin fondos acumulados. | Probar los modelos de dominio con suites de pruebas unitarias antes de acoplarlos con los servicios de Firestore. | Fabián Córdoba |
| El burndown cerró en 0 tareas pendientes gracias a la distribución de pruebas a lo largo de las semanas 3 y 4. | La detección de eventos online/offline requirió modularizarse en un archivo independiente (`conexion.js`) para no sobrecargar `dashboard.js`. | Resolver deudas técnicas de modularización en los primeros dos días del sprint antes de iniciar historias nuevas. | Fabián Córdoba / Daniel Cortes |

> Retrospectiva aprobada por el equipo Scrum tras la sustentación exitosa del Sprint 2 el 03 de octubre de 2026.
