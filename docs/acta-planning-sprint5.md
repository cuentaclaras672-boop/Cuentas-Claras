# Acta de Sprint Planning — Sprint 5
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Fecha del Planning:** 31 de octubre de 2026  
**Duración del Sprint:** 2 semanas (31 de octubre al 13 de noviembre de 2026)  
**Cierre:** Sprint Review, Retrospectiva y Certificación QA de Sprint 5 (13 de noviembre de 2026).  
**Hito Subsiguiente:** Parcial Corte III y Sustentación Final de Grado (21 de noviembre de 2026 en Sprint 6).  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad en el Sprint 5 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Define los requisitos de exportación de datos, prioriza los escenarios de prueba de carga y valida los entregables de auditoría de seguridad. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilita ceremonias, vela por el cumplimiento de DoD, diseña el plan de pruebas de estrés y monitorea el burndown del sprint. |
| **Development Team** | Daniel Felipe Cortes | Auditoría técnica de reglas en `firestore.rules`, mitigación de vectores de ataque y validación de cuotas de Firebase. |
| **Development Team** | Jorman Palacios Murillo | Interfaz de exportación (botones CSV / vista de impresión PDF) y retroalimentación visual accesible. |
| **Development Team** | Yerson Niño Guerrero | Lógica de serialización y formateo de datos para exportación CSV respetando estándares RFC 4180. |

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Realizar la auditoría de seguridad integral, pruebas de resiliencia y pruebas de carga sobre Cloud Firestore y Firebase Auth, incorporando la exportación de reportes financieros del hogar (formato estructurado CSV / PDF imprimible) para garantizar la robustez del sistema de cara al cierre de semestre."*

---

## 3. Capacidad y Velocidad del Equipo

- **Velocidad histórica acumulada:**
  - Sprint 1: 15 SP (100% efectividad)
  - Sprint 2: 21 SP (100% efectividad)
  - Sprint 3: 16 SP (100% efectividad)
  - Sprint 4: 16 SP (100% efectividad)
  - **Total acumulado:** **68 Story Points completados**.
- **Capacidad estimada para Sprint 5:** **13 Story Points**. Se reduce ligeramente la carga de nuevas características para dar prioridad a la estabilización, pruebas de carga (stress testing) y preparación de la sustentación final de Corte III.
- **Escala de estimación:** Fibonacci (S = 3 a 5 SP · M = 8 SP · L = 13 SP).
- **Límite WIP del tablero:** Máximo 4 tareas en progreso simultáneo en todo el equipo.

---

## 4. Historias de Usuario Seleccionadas (Sprint Backlog)

---

### [HU-14] Auditoría de seguridad, pruebas de carga y resiliencia en red
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 1 (Estabilidad y robustez no funcional).
- **Condiciones técnicas que refuerza:** #2 (Control de Acceso y Aislamiento) y #5 (Manejo de Errores y Resiliencia).
- **Descripción:** Como equipo de ingeniería, queremos someter el sistema a pruebas de carga simulada, estrés de peticiones concurrentes y auditoría estricta de las reglas de Firestore, para garantizar que la aplicación soporte múltiples convivientes concurrentes y no colapse ante pérdidas intermitentes de red.

#### Criterios de Aceptación:
- **CA-14.1:** Auditoría estricta de `firestore.rules`: ninguna colección permite lecturas o escrituras públicas no autenticadas; las 6 colecciones (`transacciones`, `bolsillos`, `prestamos`, `hogares`, `liquidaciones`, `categorias`) aplican aislamiento estricto por UID u hogar.
- **CA-14.2:** Suite de pruebas automatizadas simula ráfagas de 50 peticiones concurrentes a Firestore sin condiciones de carrera ni estados inconsistentes.
- **CA-14.3:** En escenarios de desconexión forzada durante operaciones transaccionales, el sistema rechaza la operación sin corromper el estado en memoria y notifica mediante Toast visible.
- **CA-14.4:** Tiempo de respuesta de los servicios en cliente permanece inferior a 500 ms bajo condiciones normales de red.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **14.1** | Auditoría estricta de vectores de inyección y bypass en `firestore.rules` | Daniel Cortes | 31 oct - 04 nov |
| **14.2** | Suite de pruebas de carga y estrés concurrente `tests/pruebas-seguridad-carga.test.js` | Fabián Córdoba | 03 nov - 08 nov |
| **14.3** | Pruebas de degradación elegante y reconexión automática en `src/services/conexion.js` | Daniel Cortes | 07 nov - 11 nov |

---

### [HU-15] Exportación de reportes financieros del hogar (CSV y vista imprimible)
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Portabilidad y respaldo de datos).
- **Condición técnica que refuerza:** #4 (Consulta con Filtrado y Portabilidad).
- **Descripción:** Como conviviente del hogar, quiero exportar el historial de movimientos filtrado en formato CSV y generar un comprobante imprimible del balance mensual, para guardar un registro contable externo y compartir el reporte por correo o archivo físico.

#### Criterios de Aceptación:
- **CA-15.1:** Botón "Exportar CSV" que genera y descarga en el navegador un archivo `.csv` estructurado según estándar RFC 4180 con cabeceras: `Fecha, Descripcion, Monto, Tipo, Ambito, Categoria, Autor`.
- **CA-15.2:** La exportación respeta estrictamente los filtros activos en pantalla (si el usuario filtró por "Octubre 2026" y "Compartido", solo se descargan esos registros).
- **CA-15.3:** Vista de impresión CSS (`@media print`) que oculta barras de navegación y botones, presentando un reporte limpio listo para guardar como PDF desde el diálogo nativo del navegador.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **15.1** | Módulo de serialización CSV y escape de caracteres especiales en `src/utils/exportador.js` | Yerson Niño | 02 nov - 06 nov |
| **15.2** | Botón de descarga en barra de filtros y manejador de evento de exportación | Jorman Palacios | 05 nov - 09 nov |
| **15.3** | Hoja de estilos de impresión `@media print` en `public/style.css` | Juan Diego Peraza | 08 nov - 12 nov |

---

## 5. Resumen de Cargas de Trabajo (Sprint 5)

| Integrante | Tareas Asignadas | SP Estimados |
|---|---|:---:|
| **Juan Diego Peraza Amado** | Tarea 15.3, validación de Product Goal y release | 3 SP |
| **Fabián Eduardo Córdoba** | Tarea 14.2, facilitación de ceremonias y control QA | 4 SP |
| **Daniel Felipe Cortes** | Tareas 14.1, 14.3 (seguridad y resiliencia) | 4 SP |
| **Jorman Palacios Murillo** | Tarea 15.2 (interfaz de exportación) | 2 SP |
| **Yerson Niño Guerrero** | Tarea 15.1 (formateo y lógica de exportación) | 3 SP |
| **Total Sprint 5** | **6 tareas técnicas** | **13 SP** |

---

## 6. Definición de Terminado (DoD) para Sprint 5

1. Ninguna vulnerabilidad de permisos en `firestore.rules` abierta ante pruebas de penetración simuladas.
2. Suite global de pruebas ejecutada en `tests/runner.js` reportando 100% de aprobación.
3. Archivos CSV exportados verificados en Excel y LibreOffice sin fallas de codificación UTF-8 ni saltos de línea rotos.
4. Registro de Dailies en `docs/bitacora-sprint5.md` al día.
5. Código integrado y versionado en la rama `main` de GitHub.
