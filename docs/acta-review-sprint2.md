# Acta de Sprint Review — Sprint 2
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente / Stakeholder Principal:** Vilma Yenny Bohórquez  
**Fecha de la Sesión:** 03 de octubre de 2026  
**Periodo del Sprint 2:** 19 de septiembre al 02 de octubre de 2026  
**Hito Asociado:** Sustentación de Resultados de Sprint 2 (03/10/2026)  

---

## 1. Asistentes y Roles Scrum

| Integrante | Rol Scrum | Participación en la Sesión |
|---|---|---|
| **Juan Diego Peraza Amado** | Product Owner | Presentación del incremento, validación de criterios de aceptación y balance de producto. |
| **Fabián Eduardo Córdoba** | Scrum Master / QA | Moderación de la sesión, reporte de métricas de calidad y certificación de pruebas unitarias. |
| **Daniel Felipe Cortes** | Development Team | Demostración del consumo asíncrono de la TRM (`indicadores.js`) y persistencia de bolsillos. |
| **Jorman Palacios Murillo** | Development Team | Demostración de componentes visuales (búsqueda, selectores y avisos de conectividad). |
| **Yerson Niño Guerrero** | Development Team | Demostración de filtros combinados en memoria y cálculo de conversión multidivisa. |
| **Vilma Yenny Bohórquez** | Docente / Evaluadora | Evaluación formal de rúbrica, verificación de condiciones técnicas y retroalimentación. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Que el hogar pueda separar su dinero en bolsillos con metas de ahorro, encontrar cualquier movimiento con búsqueda y filtros, y ver sus saldos en dólares con la TRM oficial, recibiendo avisos claros cuando algo falle."*

**Resultado:** **CUMPLIDO AL 100%**. Todas las condiciones técnicas del Sprint 2 fueron integradas y verificadas.

---

## 3. Demostración del Incremento de Producto (Sprint Demo)

Durante la sesión se ejecutó la demostración interactiva en vivo del software frente a la docente, validando las cuatro Historias de Usuario comprometidas:

### 3.1 [HU-05] Búsqueda y filtros avanzados del historial (5 SP · Condición Técnica #4)
- **Demostración:**
  - Búsqueda en tiempo real por texto en la descripción del movimiento (insensible a mayúsculas y tildes).
  - Filtrado cruzado simultáneo por categoría (Alimentación, Vivienda, etc.), tipo (Ingreso/Gasto) y ámbito (Personal/Compartido).
  - Rango de fechas con validación defensiva (`desde <= hasta`) y botón de restablecimiento total de filtros.
- **Resultado:** Aceptada por el Product Owner y calificada positivamente por la docente evaluadora.

### 3.2 [HU-06] Integración externa de la TRM y vista multidivisa (5 SP · Condición Técnica #3)
- **Demostración:**
  - Consumo directo mediante `fetch` a la API oficial de datos abiertos del gobierno colombiano (`datos.gov.co`).
  - Límite de tiempo estricto de 5 segundos con respaldo ante fallos y valor de contingencia offline.
  - Alternador interactivo COP / USD que recalcula en tiempo real el saldo líquido, ingresos, gastos y tarjetas de resumen.
- **Resultado:** Aceptada con felicitación por la resiliencia multicanal ante caídas de la API externa.

### 3.3 [HU-04] Bolsillos de ahorro con metas financieras (8 SP · Condición Técnica #1)
- **Demostración:**
  - Creación de bolsillos con nombre, meta de ahorro y saldo inicial (incluyendo soporte explícito de $0 inicial).
  - Barra de progreso porcentual dinámica con código de colores según nivel de completitud.
  - Deducción automática del saldo disponible para evitar gastar dinero comprometido en ahorro.
- **Resultado:** Aceptada. Se evidencia persistencia real en la colección `bolsillos` de Cloud Firestore.

### 3.4 [HU-07] Avisos de conexión y validaciones en formularios (3 SP · Condición Técnica #5)
- **Demostración:**
  - Desconexión simulada en consola de desarrollador (F12 Offline): banner superior amarillo flotante *"Sin conexión a internet"*.
  - Validación en vivo debajo de cada campo con mensajes de error contextuales en rojo sin recargar la página.
  - Notificaciones flotantes (Toasts) automáticas para excepciones de red y base de datos.
- **Resultado:** Aceptada al 100%.

---

## 4. Métricas de Entrega y Velocidad del Sprint

| Métrica Scrum | Valor Planificado | Valor Real Obtenido | Eficacia |
|---|:---:|:---:|:---:|
| **Historias de Usuario** | 4 historias | 4 historias aprobadas | 100% |
| **Story Points (SP)** | 21 SP | 21 SP terminados | 100% |
| **Tareas del Sprint Backlog** | 16 tareas | 16 tareas cerradas en Done | 100% |
| **Cobertura de Pruebas QA** | 4 suites dedicadas | 4 suites aprobadas (100% PASS) | 100% |
| **Deuda Técnica Crítica** | 0 bloqueantes | 0 bloqueantes en producción | 100% |

---

## 5. Retroalimentación de la Docente y Stakeholders

1. **Aspectos Destacados:**
   - La arquitectura basada en Vanilla JS modular (ES6) sin dependencias de `node_modules` demostró gran velocidad de carga y cumplimiento estricto de la separación de responsabilidades.
   - Excelente implementación de la resiliencia en la TRM y el manejo de estados de conectividad.
2. **Recomendaciones para el Sprint 3:**
   - Al implementar el hogar compartido (HU-09) y préstamos a terceros (HU-08), asegurar que las reglas de seguridad en Cloud Firestore no permitan fugas de información entre cuentas ajenas.
   - Aprovechar la semana de receso (del 05 al 12 de octubre) para adelantar el diseño de los modelos de dominio y las reglas de seguridad del Sprint 3.

---

## 6. Acuerdos y Próximos Pasos (Sprint 3)
- El Product Owner declara el incremento del Sprint 2 formalmente aceptado e incorporado a la línea base del producto.
- El equipo procede al refinamiento y arranque de las historias del **Sprint 3 (03 al 16 de octubre de 2026)**:
  - HU-08: Préstamos a terceros con abonos parciales (8 SP).
  - HU-09: Hogar compartido entre convivientes (5 SP).
  - HU-10: Gráfica de gastos por categoría (3 SP).
- Programación de la sesión de sustentación de resultados y Parcial de Corte II para el **17 de octubre de 2026**.
