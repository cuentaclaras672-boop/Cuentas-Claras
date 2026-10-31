# Acta de Sprint Planning — Sprint 4
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Fecha del Planning:** 17 de octubre de 2026 (Inmediatamente tras la sesión de Sustentación de Corte II)  
**Duración del Sprint:** 2 semanas (17 al 30 de octubre de 2026)  
**Cierre:** Sprint Review, Retrospectiva y Certificación QA de Sprint 4 (30 de octubre de 2026).  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad en el Sprint 4 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Prioriza el backlog hacia el Product Goal central (cuadre de cuentas en pareja), valida criterios de aceptación de liquidaciones y coordina la integración en release. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilita ceremonias, vela por el cumplimiento de DoD, controla el límite WIP y lidera las pruebas de aseguramiento de calidad (QA). |
| **Development Team** | Daniel Felipe Cortes | Infraestructura: servicio `liquidaciones.js`, colección `liquidaciones` en Firestore, reglas de seguridad y límites de descripción. |
| **Development Team** | Jorman Palacios Murillo | Presentación: componentes visuales de cuadre mensual, contador dinámico de caracteres y avisos de liquidación saldada. |
| **Development Team** | Yerson Niño Guerrero | Dominio: módulo de cuadre matemático (`cuadre.js`), servicio de categorías personalizadas (`categorias.js`) y cálculo de transferencias mínimas. |

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Que los convivientes del hogar puedan cuadrar cuentas al final del mes sabiendo exactamente quién le debe a quién con transferencias mínimas y marcar el mes como saldado de forma atómica en Firestore, gestionando categorías personalizadas y garantizando la integridad de los datos financieros con descripciones controladas."*

---

## 3. Capacidad y Velocidad del Equipo

- **Velocidad histórica demostrada:**
  - Sprint 1: 15 SP completados (100% efectividad).
  - Sprint 2: 21 SP completados (100% efectividad).
  - Sprint 3: 16 SP completados (100% efectividad · Parcial Corte II aprobado).
  - **Velocidad promedio del equipo:** 17.3 SP por sprint de 2 semanas.
- **Capacidad asignada para Sprint 4:** **16 Story Points** (distribuidos en 3 Historias de Usuario de talla S y M).
- **Escala de estimación:** Fibonacci (S = 3 a 5 SP · M = 8 SP · L = 13 SP).
- **Límite WIP del tablero:** Máximo 5 tareas en progreso simultáneo en todo el equipo y máximo 2 por desarrollador.

---

## 4. Historias de Usuario Seleccionadas (Sprint Backlog)

---

### [HU-11] Cuadre mensual de gastos y liquidación entre convivientes
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 1 (Núcleo del Product Goal: resolver "¿quién le debe a quién?").
- **Condición técnica que refuerza:** #1 (Persistencia Real y atomicidad con `runTransaction`) y #2 (Control de Acceso y Aislamiento por hogar).
- **Descripción:** Como conviviente en un hogar compartido, quiero consultar al final del mes cuánto gastó cada miembro, cuál fue la cuota equitativa y quién le debe a quién, para saldar las cuentas mediante las transferencias mínimas necesarias sin discusiones.
- **Por qué ahora:** En el Sprint 3 se creó la estructura del Hogar (HU-09) y el registro de gastos compartidos; el paso natural y promesa central del proyecto es la conciliación mensual de cuentas.

#### Criterios de Aceptación:
- **CA-11.1:** El sistema filtra exclusivamente los gastos marcados como `COMPARTIDO` correspondientes al mes consultado (`AAAA-MM`) dentro del hogar activo del usuario.
- **CA-11.2:** Se calcula el total gastado en el periodo y la cuota justa por conviviente (`totalGastos / N`).
- **CA-11.3:** El algoritmo de compensación determina el balance neto individual (`pagado - cuota`) y genera el conjunto óptimo de transferencias mínimas (a lo sumo `N - 1` transferencias para `N` miembros, máximo 5 con límite de 6 convivientes).
- **CA-11.4:** Si los miembros aportaron sumas equivalentes, el sistema reporta saldo en equilibrio (0 transferencias requeridas).
- **CA-11.5:** Cualquier miembro del hogar puede marcar el mes como saldado; la operación se ejecuta en Firestore mediante transacción atómica (`runTransaction`), asociando ID determinista `{hogarId}_{AAAA-MM}` para evitar liquidaciones duplicadas.
- **CA-11.6:** Las reglas en `firestore.rules` impiden modificaciones o eliminaciones posteriores: una liquidación guardada es inmutable y solo accesible por miembros del hogar correspondiente.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **11.1** | Algoritmo matemático de balance equitativo y minimización de transferencias en `src/utils/cuadre.js` | Yerson Niño | 17 oct - 21 oct |
| **11.2** | Servicio `src/services/liquidaciones.js`, colección NoSQL y reglas de seguridad en `firestore.rules` | Daniel Cortes | 20 oct - 25 oct |
| **11.3** | Componente de cuadre mensual en dashboard, tabla de transferencias y botón marcar saldado | Jorman Palacios | 24 oct - 28 oct |
| **11.4** | Suite automatizada de pruebas `tests/pruebas-liquidaciones.test.js` y conexión a `runner.js` | Fabián Córdoba | 27 oct - 30 oct |

---

### [HU-12] Categorías personalizadas por usuario
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Flexibilidad de presupuestación).
- **Condición técnica que refuerza:** #1 (Persistencia en Firestore) y #2 (Aislamiento por UID).
- **Descripción:** Como usuario del sistema, quiero poder crear mis propias categorías personalizadas además de las predefinidas, para adaptar el registro a los gastos específicos de mi estilo de vida.

#### Criterios de Aceptación:
- **CA-12.1:** El usuario puede registrar una nueva categoría asignándole nombre (3 a 40 caracteres) y tipo (`gasto` o `ingreso`).
- **CA-12.2:** Las categorías personalizadas quedan aisladas por UID en Firestore; ningún otro usuario puede leerlas ni editarlas.
- **CA-12.3:** El usuario puede actualizar el nombre o eliminar una categoría previamente creada.
- **CA-12.4:** Reglas de seguridad en `firestore.rules` validan que `request.auth.uid == resource.data.uid`.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **12.1** | Servicio CRUD en `src/services/categorias.js` con SDK modular v10 | Yerson Niño | 18 oct - 23 oct |
| **12.2** | Reglas de seguridad para colección `categorias` en `firestore.rules` | Daniel Cortes | 22 oct - 26 oct |
| **12.3** | Integración de categorías dinámicas en el selector del formulario | Juan Diego Peraza | 25 oct - 29 oct |

---

### [HU-13] Control de integridad y límite de descripción de transacciones
- **Talla:** S · **Estimación:** 3 SP · **Prioridad:** 3 (Calidad de datos y prevención de desbordamientos visuales).
- **Condición técnica que refuerza:** #5 (Manejo de Errores Visible y Validación en Cliente y Servidor).
- **Descripción:** Como usuario, quiero ver cuántos caracteres me quedan disponibles al redactar la descripción del gasto y que el sistema me impida exceder el límite, para evitar errores de almacenamiento y desajustes visuales en las tablas.

#### Criterios de Aceptación:
- **CA-13.1:** El campo descripción limita estrictamente a 120 caracteres (`MAX_DESCRIPCION = 120`), coincidiendo con la restricción de `firestore.rules`.
- **CA-13.2:** Un contador interactivo debajo del input notifica en tiempo real los caracteres restantes ("Quedan X caracteres").
- **CA-13.3:** El modelo de dominio `Transaccion.js` valida defensivamente el tope máximo en cliente antes de cualquier petición de red.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **13.1** | Actualización de constante `MAX_DESCRIPCION` en `Transaccion.js`, input con `maxlength=120` y contador en `dashboard.js` | Daniel Cortes / Jorman Palacios | 20 oct - 27 oct |
| **13.2** | Pruebas unitarias de límite de descripción en la suite de pruebas QA | Fabián Córdoba | 28 oct - 30 oct |

---

## 5. Resumen de Cargas de Trabajo (Sprint 4)

| Integrante | Tareas Asignadas | SP Estimados |
|---|---|:---:|
| **Juan Diego Peraza Amado** | Tarea 12.3, revisión de arquitectura y release versionado | 3 SP |
| **Fabián Eduardo Córdoba** | Tareas 11.4, 13.2 y facilitación de ceremonias | 4 SP |
| **Daniel Felipe Cortes** | Tareas 11.2, 12.2, 13.1 (servicios y reglas) | 5 SP |
| **Jorman Palacios Murillo** | Tareas 11.3, 13.1 (interfaz y reactividad) | 4 SP |
| **Yerson Niño Guerrero** | Tareas 11.1, 12.1 (lógica de dominio y cuadre) | 5 SP |
| **Total Sprint 4** | **8 tareas técnicas** | **16 SP** |

---

## 6. Definición de Terminado (DoD) Específica del Sprint 4

1. Código fuente implementado con arquitectura en capas limpia, sin acoplamiento de DOM en `src/services/` ni `src/utils/`.
2. Las 8 suites de pruebas automatizadas en `tests/runner.js` deben ejecutarse y reportar **100% PASS**.
3. Las reglas de `liquidaciones` y `categorias` deben estar añadidas en `firestore.rules` y verificadas.
4. Commits semánticos y distribuidos registrados bajo la autoría de cada desarrollador.
5. Bitácora de seguimiento con Dailies del 17 al 30 de octubre de 2026 completada.
