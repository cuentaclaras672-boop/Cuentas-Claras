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

### 1.1 Desglose de Tareas de Sprint 2 en el Tablero

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro |
|---|---|---|:---:|:---:|
| **Tarea 4.1** | Modelar colección y estructura de `Bolsillo.js` | Yerson Niño | 25 sep - 27 sep | **WIP** |
| **Tarea 4.2** | Funciones asíncronas para transferir fondos en Firestore | Daniel Cortes | 27 sep - 29 sep | **Por Hacer** |
| **Tarea 4.3** | Maquetar tarjetas de bolsillos y barras de progreso (Tailwind) | Jorman Palacios | 28 sep - 30 sep | **Por Hacer** |
| **Tarea 4.4** | Lógica matemática del porcentaje y pruebas de UI | Fabián Córdoba | 30 sep - 01 oct | **Por Hacer** |
| **Tarea 5.1** | Diseñar barra de búsqueda y selectores en HTML/Tailwind | Jorman Palacios | 21 sep - 23 sep | **En Pruebas** |
| **Tarea 5.2** | Lógica de filtrado combinado en array en `dashboard.js` | Yerson Niño | 23 sep - 25 sep | **En Pruebas** |
| **Tarea 5.3** | Adaptar consulta `onSnapshot` en `firestore.js` | Daniel Cortes | 25 sep - 27 sep | **En Pruebas** |
| **Tarea 5.4** | Pruebas de renderizado de resultados y estados vacíos | Fabián Córdoba | 27 sep - 28 sep | **En Pruebas** |
| **Tarea 6.1** | Servicio modular de consumo de API TRM con fallback offline | Daniel Cortes | 25 sep - 28 sep | **En Pruebas** |
| **Tarea 6.2** | Función de conversión de divisa (COP a USD) y utilidades | Yerson Niño | 28 sep - 30 sep | **En Pruebas** |
| **Tarea 6.3** | Componente visual de indicador y toggle multidivisa | Juan Diego Peraza / Jorman Palacios | 30 sep - 02 oct | **En Pruebas** |
| **Tarea 6.4** | Pruebas de latencia, excepciones de red y validación en vivo | Fabián Córdoba | 02 oct - 04 oct | **En Pruebas** |
| **Tarea 7.1** | Maquetar alerta Toast en Tailwind (Éxito, Error, Info) | Jorman Palacios | 28 sep - 30 sep | **En Pruebas** |
| **Tarea 7.2** | Escribir módulo independiente `notificaciones.js` | Fabián Córdoba | 30 sep - 02 oct | **En Pruebas** |
| **Tarea 7.3** | Inyectar llamadas Toast en bloques `catch` de servicios | Daniel Cortes | 02 oct - 03 oct | **En Pruebas** |
| **Tarea 7.4** | Pruebas forzando caídas de red (Modo offline en F12) | Fabián Córdoba | 03 oct - 04 oct | **En Pruebas** |

---

## 2. Registro de Dailies de Sprint 2 (Muestreo del Periodo)

### Daily — 14 de Septiembre de 2026 (Semana 7 - Arranque Sprint 2)
- **Ayer:** Cierre y consolidación del Sprint 1 tras la Sustentación 1 (5 de septiembre). Inicio del refinamiento de las historias de Bolsillos (HU-04) e Integración Externa (HU-06).
- **Hoy:** Diseñar la estructura de datos NoSQL para bolsillos en Firestore y afinar la conexión con la API pública de la TRM.
- **Impedimentos:** Ninguno.

### Daily — 21 de Septiembre de 2026 (Semana 8)
- **Ayer:** Pruebas del componente de búsqueda y filtrado dinámico en la capa de presentación (HU-05).
- **Hoy:** Avanzar en la lógica de separación de saldo líquido vs. saldo comprometido en bolsillos de ahorro (HU-04).
- **Impedimentos:** Ninguno.

### Daily — 26 de Septiembre de 2026 (Semana 8 - Estado Actual)
- **Ayer:** Estabilización del servicio de notificaciones Toast para capturar errores de red en la integración externa de la TRM.
- **Hoy:** Ajuste de backlog para priorizar al 100% las condiciones técnicas obligatorias de cara a la Sustentación 2.
- **Impedimentos:** Ninguno. El equipo mantiene ritmo sostenible de acuerdo con el calendario hacia la Sustentación 2 (5 - 10 de octubre).

---

## 3. Registro de Uso de Inteligencia Artificial en Sprint 2 (§8)

### 3.1 ¿Qué le pedimos a la IA?
1. Asistencia para reestructurar el backlog del Sprint 2 garantizando que todas las condiciones técnicas obligatorias queden cubiertas por historias de usuario de prioridad alta.
2. Formulación del servicio asíncrono para consumir la TRM en `indicadores.js` con fallback offline seguro.
3. Sugerencias de maquetación en Tailwind CSS para representar visualmente el avance porcentual de los bolsillos de ahorro.

### 3.2 ¿Qué aceptamos?
- La inclusión del módulo `indicadores.js` como una historia formal de sprint (HU-06), cubriendo la Condición Técnica #3.
- La conversión referencial de divisas en cliente para fundamentar decisiones de compras o ahorros en moneda extranjera.

### 3.3 ¿Qué rechazamos y por qué? (Criterio de Evaluación de Ingeniería)
1. **Rechazamos mantener funcionalidades de negocio de prioridad media sobre condiciones técnicas obligatorias:**  
   *Motivo:* La IA sugirió inicialmente abordar préstamos a terceros en este sprint. El equipo descartó esa sugerencia y **trasladó el Control de Deudas al Sprint 3**, priorizando en su lugar la **Condición Técnica #3 (Integración Externa)** para asegurar que en la Sustentación 2 el 100% de la rúbrica innegociable de la materia esté cubierto y demostrado.
2. **Rechazamos crear una colección global no particionada para los bolsillos:**  
   *Motivo:* Los bolsillos deben pertenecer estrictamente al UID del usuario autenticado o ID del hogar para cumplir con la Condición #2 de control de acceso y privacidad.
