# Acta de Sprint Review — Sprint 3
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente / Evaluadora:** Vilma Yenny Bohórquez  
**Fecha de la Sesión:** 17 de octubre de 2026  
**Periodo del Sprint 3:** 03 de octubre al 16 de octubre de 2026 (Semana de receso estudiantil del 05 al 12 de octubre)  
**Hito Asociado:** PARCIAL Corte II, Review, Sustentación y Retrospectiva de Sprint 3  

---

## 1. Asistentes y Roles Scrum

| Integrante | Rol Scrum | Participación en la Sesión |
|---|---|---|
| **Juan Diego Peraza Amado** | Product Owner | Presentación del incremento de Sprint 3, demostración de la gráfica de gastos y balance del corte. |
| **Fabián Eduardo Córdoba** | Scrum Master / QA | Moderación de la Review, presentación del informe formal de pruebas QA y runner automatizado. |
| **Daniel Felipe Cortes** | Development Team | Demostración de persistencia transaccional de préstamos y servicios de hogares en Firestore. |
| **Jorman Palacios Murillo** | Development Team | Demostración de componentes de interfaz y formulario de abonos parciales. |
| **Yerson Niño Guerrero** | Development Team | Demostración de los modelos de dominio `Prestamo.js` y `Hogar.js` con cálculo de amortizaciones. |
| **Vilma Yenny Bohórquez** | Docente / Evaluadora | Evaluación de rúbrica de Corte II, verificación de historias de usuario y retroalimentación académica. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Que el usuario pueda registrar lo que le presta a amigos o familiares y seguir sus abonos hasta saldarlo, que dos convivientes compartan un mismo hogar para ver juntos los gastos comunes, y que el hogar vea en una gráfica en qué se le va el dinero."*

**Resultado:** **CUMPLIDO AL 100% (16/16 Story Points entregados y certificados)**.

---

## 3. Demostración del Incremento de Producto (Sprint Demo)

Durante la sesión del Parcial de Corte II se demostraron en vivo las tres Historias de Usuario completadas en el Sprint 3:

### 3.1 [HU-08] Préstamos a terceros con abonos parciales (8 SP · Prioridad 1)
- **Componentes Demostrados:** Modelo de dominio `Prestamo.js`, servicio `prestamos.js` en Firestore y suite `pruebas-prestamos.test.js`.
- **Criterios Validados:**
  - Registro de préstamos con nombre de deudor, monto y fecha de compromiso.
  - Abonos parciales atómicos utilizando `runTransaction` de Firestore para prevenir condiciones de carrera.
  - Validación defensiva en servidor y cliente: ningún abono puede ser negativo ni superar el saldo pendiente.
  - Transición automática de estado de `PENDIENTE` a `SALDADO` al cubrir la totalidad de la deuda.
  - Tarjeta de resumen "Por cobrar" que totaliza únicamente los saldos pendientes sin distorsionar el saldo disponible del hogar.
- **Resultado:** Aprobada al 100% con felicitaciones por la consistencia transaccional.

### 3.2 [HU-09] Hogar compartido entre convivientes (5 SP · Prioridad 2)
- **Componentes Demostrados:** Modelo de dominio `Hogar.js`, servicio `hogares.js`, interfaz interactiva en `public/index.html` (sección `#seccion-hogar`, ayudas contextuales en `#form-transaccion` y etiquetas de autor en transacciones compartidas de `src/ui/dashboard.js`), integración reactiva en `src/app.js` y suite `pruebas-hogares.test.js`.
- **Criterios Validados:**
  - Creación de hogar con código de invitación único de 6 caracteres alfanuméricos (`/^[A-Z0-9]{6}$/`).
  - Unirse a un hogar existente mediante código y abandono seguro del hogar.
  - Membresía múltiple con límite seguro de hasta 6 convivientes (`MAX_MIEMBROS_HOGAR = 6`).
  - **Identificación de autor en movimientos compartidos (CA-9.5 / Tarea 9.3):** Etiqueta dinámica con el nombre del conviviente autor (`Compartido • por Juan Diego`) y restricción de eliminación solo para el creador original.
  - **Guía contextual en el formulario de registro:** Advertencia en vivo si el usuario no tiene hogar vinculado y confirmación de los miembros con quienes se comparte.
  - **Prueba Negativa y Aislamiento de Datos (Condición Técnica #2):** Demostración en vivo donde un usuario ajeno al hogar recibe `permission-denied` estricto en Firestore al intentar consultar transacciones ajenas, mientras los convivientes pueden ver los movimientos marcados como compartidos pero nunca los personales ajenos.
- **Resultado:** Aprobada al 100%. Se destaca la arquitectura de seguridad multicapa y la experiencia de usuario guiada.

### 3.3 [HU-10] Gráfica de gastos por categoría (3 SP · Prioridad 3)
- **Componentes Demostrados:** Módulo transversal `estadisticas.js` y suite `pruebas-grafica.test.js`.
- **Criterios Validados:**
  - Función pura de agregación que suma exclusivamente gastos (omitiendo ingresos) y calcula porcentajes con un decimal.
  - Ordenamiento visual decreciente (categorías de mayor impacto arriba).
  - Barras proporcionales construidas con Tailwind CSS nativo sin dependencias de librerías pesadas como Chart.js.
  - Reactividad inmediata ante filtros por fecha o ámbito, y conversión automática de valores al alternar divisa COP / USD.
- **Resultado:** Aprobada al 100%.

---

## 4. Métricas de Entrega y Calidad (Cierre de Corte II)

| Métrica del Sprint | Compromiso Inicial | Resultado Obtenido | Calificación |
|---|:---:|:---:|:---:|
| **Historias de Usuario (HU)** | 3 historias | 3 historias entregadas y aceptadas | 100% |
| **Story Points (SP)** | 16 SP | 16 SP certificados | 100% |
| **Tareas del Sprint Backlog** | 11 tareas | 11 tareas cerradas en Done | 100% |
| **Suites de Pruebas QA** | 3 suites de Sprint 3 | 3 suites aprobadas (100% PASS) | 100% |
| **Suite Global del Proyecto** | 7 suites consolidadas | 7 de 7 aprobadas en `runner.js` | 100% PASS |
| **Deuda Técnica Acumulada** | 0 deudas | 0 pendientes bloqueantes | Resuelta |

---

## 5. Retroalimentación de la Docente (Vilma Yenny Bohórquez)

1. **Fortalezas del Equipo:**
   - Cumplimiento riguroso del calendario académico y entrega puntual del incremento al cierre del Corte II.
   - Excelencia en el aseguramiento de calidad con una suite automatizada ejecutable desde consola (`node tests/runner.js`).
   - El desacoplamiento de credenciales en `firebase-config.js` y su protección mediante `.gitignore` refleja madurez en prácticas de ingeniería de software y seguridad de la información.
2. **Observaciones para el Sprint 4:**
   - Mantener el ritmo ágil y la distribución de tareas en el tablero Miro.
   - En el Sprint 4, enfocarse en la consolidación del release versionado, pulido final de la experiencia de usuario y preparación para la entrega final del semestre.

---

## 6. Acuerdos de Cierre del Corte II
- El Product Owner aprueba y firma el incremento del Sprint 3.
- Se declara formalmente cerrado el **Corte II de la asignatura Práctica Aplicada**.
- El equipo da inicio formal al **Sprint 4 (17 de octubre al 30 de octubre de 2026)** con el evento de Retrospectiva y Planning subsiguiente.
