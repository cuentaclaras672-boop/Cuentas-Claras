# Bitácora de Sprint 2 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 2 (Semanas 6 a 9: 07 de septiembre al 10 de octubre de 2026)  
**Fecha de Corte:** 26 de septiembre de 2026 (Semana 8 · Promedio del Sprint)  

---

## 1. Estado del Tablero de Miro / Planner

A fecha del **26 de septiembre de 2026**, el equipo se encuentra promediando el Sprint 2. Las historias aprobadas corresponden al Sprint 1, mientras que las del Sprint 2 abordan directamente las condiciones técnicas obligatorias pendientes para la Sustentación 2:

| Historia de Usuario | Condición Técnica Vinculada | Story Points | Responsable Principal | Columna en Tablero |
|---|---|:---:|---|:---:|
| **HU-01: Autenticación (Firebase Auth)** | Condición #2 (Control de Acceso) | 5 SP | Juan Diego Peraza | **Terminado (Done - S1)** |
| **HU-02: Registro Transacciones (Firestore)** | Condición #1 (Persistencia Real) | 8 SP | Daniel Cortes / Yerson Niño | **Terminado (Done - S1)** |
| **HU-03: Dashboard Saldo Líquido** | Entrega Principal de Valor | 5 SP | Jorman Palacios | **Terminado (Done - S1)** |
| **HU-04: Bolsillos de Ahorro / Metas** | Núcleo del Product Goal | 8 SP | Yerson Niño / Daniel Cortes | **Work in Progress (WIP)** |
| **HU-05: Historial y Búsqueda Avanzada** | **Condición #4 (Filtrado y Búsqueda)** | 5 SP | Jorman Palacios | **En Pruebas (Testing)** |
| **HU-06: Integración Externa TRM y Divisas** | **Condición #3 (Integración Externa API)**| 5 SP | Daniel Cortes / Juan Diego Peraza | **En Pruebas (Testing)** |
| **HU-07: Manejo Visible de Errores** | **Condición #5 (Manejo de Errores)** | 3 SP | Fabián Córdoba | **En Pruebas (Testing)** |

---

### 1.1 Desglose y Cronograma de Tareas en el Tablero de Miro (4 Semanas)

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro |
|---|---|---|:---:|:---:|
| **Tarea 5.1** | Diseñar barra de búsqueda y selectores en HTML/Tailwind | Jorman Palacios | 09 sep - 12 sep | **Done** |
| **Tarea 5.2** | Lógica de filtrado combinado en array en `dashboard.js` | Yerson Niño | 13 sep - 16 sep | **Done** |
| **Tarea 5.3** | Adaptar consulta `onSnapshot` en `firestore.js` | Daniel Cortes | 16 sep - 20 sep | **Done** |
| **Tarea 5.4** | Pruebas de renderizado de resultados y estados vacíos | Fabián Córdoba | 21 sep - 26 sep | **En Pruebas** |
| **Tarea 6.1** | Spike técnico y servicio modular API TRM (`indicadores.js`) | Daniel Cortes | 10 sep - 14 sep | **Done** |
| **Tarea 6.2** | Función de conversión de divisa (COP a USD) y utilidades | Yerson Niño | 15 sep - 19 sep | **Done** |
| **Tarea 6.3** | Componente visual de indicador y toggle multidivisa | Juan Diego Peraza / Jorman Palacios | 20 sep - 24 sep | **Done** |
| **Tarea 6.4** | Pruebas de latencia, excepciones de red y validación en vivo | Fabián Córdoba | 24 sep - 28 sep | **En Pruebas** |
| **Tarea 7.1** | Maquetar alerta Toast en Tailwind (Éxito, Error, Info) | Jorman Palacios | 12 sep - 16 sep | **Done** |
| **Tarea 7.2** | Escribir módulo independiente `notificaciones.js` | Fabián Córdoba | 16 sep - 20 sep | **Done** |
| **Tarea 7.3** | Inyectar llamadas Toast en bloques `catch` de servicios | Daniel Cortes | 21 sep - 24 sep | **Done** |
| **Tarea 7.4** | Pruebas forzando caídas de red (Modo offline en F12) | Fabián Córdoba | 25 sep - 29 sep | **En Pruebas** |
| **Tarea 4.1** | Modelar colección y estructura de `Bolsillo.js` en dominio | Yerson Niño | 18 sep - 22 sep | **Done** |
| **Tarea 4.2** | Funciones asíncronas para transferir fondos en Firestore | Daniel Cortes | 23 sep - 27 sep | **WIP (En Progreso)** |
| **Tarea 4.3** | Maquetar tarjetas de bolsillos y barras de progreso (Tailwind) | Jorman Palacios | 27 sep - 30 sep | **Por Hacer** |
| **Tarea 4.4** | Lógica matemática del porcentaje y pruebas de UI integradas | Fabián Córdoba | 30 sep - 03 oct | **Por Hacer** |

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
