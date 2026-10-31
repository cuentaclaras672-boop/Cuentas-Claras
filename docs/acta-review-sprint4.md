# Acta de Sprint Review — Sprint 4
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente / Evaluadora:** Vilma Yenny Bohórquez  
**Fecha de la Sesión:** 30 de octubre de 2026  
**Periodo del Sprint 4:** 17 de octubre al 30 de octubre de 2026  
**Hito Asociado:** Cierre de Sprint 4 y Certificación de Incremento hacia el Corte III  

---

## 1. Asistentes y Roles Scrum

| Integrante | Rol Scrum | Participación en la Sesión |
|---|---|---|
| **Juan Diego Peraza Amado** | Product Owner | Conducción de la presentación del incremento de producto, validación de criterios de negocio de liquidaciones y balance de velocidad. |
| **Daniel Felipe Cortes** | Development Team / Suplencia Scrum Master | Demostración técnica de liquidaciones en Firestore, reglas de inmutabilidad, límite de descripción y co-facilitación de la Retrospectiva del Barco. |
| **Fabián Eduardo Córdoba** | Scrum Master / QA | Participación en desarrollo previo y diseño de la suite de pruebas QA (ausencia justificada en sustentación presencial). |
| **Jorman Palacios Murillo** | Development Team | Participación en interfaz de usuario y componentes visuales (ausencia justificada en sustentación presencial). |
| **Yerson Niño Guerrero** | Development Team | Participación en servicios y validaciones de categorías (ausencia justificada en sustentación presencial). |

> [!NOTE]
> **Propiedad Colectiva del Código y Suplencia Ágil:** Debido a motivos de fuerza mayor justificados de tres compañeros de equipo, la sustentación, demo del incremento y dinámica de retrospectiva son asumidas y defendidas en vivo por **Juan Diego Peraza** y **Daniel Felipe Cortes**, evidenciando la versatilidad técnica y dominio integral del repositorio por parte de los miembros presentes.

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Que los convivientes del hogar puedan cuadrar cuentas al final del mes sabiendo exactamente quién le debe a quién con transferencias mínimas y marcar el mes como saldado de forma atómica en Firestore, gestionando categorías personalizadas y garantizando la integridad de los datos financieros con descripciones controladas."*

**Resultado:** **CUMPLIDO AL 100% (16/16 Story Points entregados, certificados y sin defectos abiertos)**.

---

## 3. Demostración del Incremento de Producto (Sprint Demo)

Durante la sesión se validaron en vivo las tres Historias de Usuario completadas en el Sprint 4:

### 3.1 [HU-11] Cuadre mensual de gastos y liquidación entre convivientes (8 SP · Prioridad 1)
- **Componentes Demostrados:** Módulo matemático puro `src/utils/cuadre.js`, servicio de infraestructura `src/services/liquidaciones.js`, reglas en `firestore.rules` y suite `tests/pruebas-liquidaciones.test.js`.
- **Criterios Validados:**
  - Filtrado reactivo en tiempo real de gastos compartidos del periodo consultado (`AAAA-MM`).
  - Cálculo de cuota justa por conviviente (`totalGastos / miembros.length`).
  - Resolución del problema de "¿quién le debe a quién?" mediante algoritmo Greedy que genera como máximo $N - 1$ transferencias (máximo 5 en hogares de hasta 6 miembros).
  - Marcado de mes saldado con `runTransaction` garantizando idempotencia (si dos miembros pulsan el botón a la vez, se guarda una única liquidación).
  - Inmutabilidad en servidor: las reglas de Firestore impiden actualización o borrado de liquidaciones guardadas.
- **Resultado:** Aceptada por el Product Owner con felicitación por la elegancia del algoritmo de compensación.

### 3.2 [HU-12] Categorías personalizadas por usuario (5 SP · Prioridad 2)
- **Componentes Demostrados:** Servicio `src/services/categorias.js`, colección `categorias` en `firestore.rules` con SDK modular v10.
- **Criterios Validados:**
  - Registro de categorías personalizadas con validación de longitud (3 a 40 caracteres).
  - Aislamiento estricto por usuario en Firestore (`uid == request.auth.uid`).
  - Consulta y actualización de categorías asociadas al usuario autenticado.
- **Resultado:** Aceptada al 100%.

### 3.3 [HU-13] Control de integridad y límite de descripción de transacciones (3 SP · Prioridad 3)
- **Componentes Demostrados:** Constante `MAX_DESCRIPCION = 120` en `src/models/Transaccion.js`, atributo `maxlength="120"` con `aria-describedby` en `public/index.html`, listener reactivo en `src/ui/dashboard.js`.
- **Criterios Validados:**
  - El contador dinámico disminuye progresivamente al escribir ("Quedan 120 caracteres" a "Queda 1 carácter").
  - El modelo de dominio rechaza descripciones mayores a 120 caracteres arrojando excepción clara.
  - Las reglas de Firestore rechazan peticiones que violen la longitud máxima.
- **Resultado:** Aceptada al 100%.

---

## 4. Métricas de Entrega y Calidad (Sprint 4)

| Métrica del Sprint | Compromiso Inicial | Resultado Obtenido | Calificación |
|---|:---:|:---:|:---:|
| **Historias de Usuario (HU)** | 3 historias | 3 historias entregadas y aceptadas | 100% |
| **Story Points (SP)** | 16 SP | 16 SP certificados | 100% |
| **Tareas del Sprint Backlog** | 8 tareas | 8 tareas cerradas en Done | 100% |
| **Suites de Pruebas QA** | 9 suites consolidadas | 9 de 9 aprobadas en `runner.js` | 100% PASS |
| **Tiempo de Ejecución QA** | Menor a 2 segundos | ~0.35 segundos | Óptimo |
| **Deuda Técnica Acumulada** | 0 deudas | 0 defectos pendientes | Resuelta |

---

## 5. Acuerdos de Cierre y Próximos Pasos

1. El Product Owner aprueba y firma formalmente la entrega del incremento del Sprint 4.
2. La velocidad acumulada del equipo alcanza **68 Story Points** en 8 semanas (15 + 21 + 16 + 16).
3. Se da apertura inmediata al **Sprint 5 (31 de octubre al 13 de noviembre de 2026)** enfocado en:
   - **HU-14:** Auditoría de seguridad, pruebas de carga (stress testing) y robustez ante fallos masivos.
   - **HU-15:** Generación y exportación de reportes financieros del hogar (formato estructurado CSV / PDF imprimible).
