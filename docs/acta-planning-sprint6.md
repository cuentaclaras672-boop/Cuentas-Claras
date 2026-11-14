# Acta de Sprint Planning — Sprint 6 (Cierre y Despliegue)
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Fecha del Planning:** 14 de noviembre de 2026  
**Duración del Sprint:** 2 semanas (14 de noviembre al 27 de noviembre de 2026)  
**Hito Crítico Evaluativo:** **Parcial Corte III y Sustentación Final (21 de noviembre de 2026)**  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad en el Sprint 6 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Verificación integral de UAT en producción, actualización del repositorio y conducción de la demostración final de Corte III. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilitación de cierre semestral, auditoría final de DoD/DoR, verificación de la suite QA en rama principal y control de impedimentos. |
| **Development Team** | Daniel Felipe Cortes | Configuración de Firebase CLI (`firebase.json`, `.firebaserc`), guía de despliegue en Hosting, publicación de reglas productivas y soporte técnico en sustentación. |
| **Development Team** | Jorman Palacios Murillo | Pruebas visuales de aceptación (desktop/móvil y vista de impresión PDF) sobre el entorno desplegado. |
| **Development Team** | Yerson Niño Guerrero | Verificación de integridad de archivos CSV descargados desde producción, revisión de dominio y soporte documental final. |

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Desplegar Cuentas Claras en Firebase Hosting con sus reglas de seguridad publicadas y API Key restringida por dominio, validar la experiencia completa extremo a extremo sin errores de consola en navegadores reales y preparar la sustentación técnica y funcional del Parcial Corte III (21 de noviembre de 2026)."*

---

## 3. Capacidad y Velocidad Acumulada

- **Velocidad histórica acumulada (Sprints 1–5):**
  - Sprint 1: 15 SP (100% efectividad)
  - Sprint 2: 21 SP (100% efectividad)
  - Sprint 3: 16 SP (100% efectividad)
  - Sprint 4: 16 SP (100% efectividad)
  - Sprint 5: 13 SP (100% efectividad)
  - **Total completado previo al Sprint 6:** **81 Story Points**.
- **Capacidad estimada para Sprint 6:** **13 Story Points** (con foco en despliegue productivo, validación en vivo y sustentación de cierre el 21 de noviembre).
- **Observación de adelanto técnico:** El 13 de noviembre Daniel Cortes dejó adelantados los artefactos de configuración **Tarea 16.1** (`.firebaserc`, `firebase.json`) y **Tarea 16.2** (`docs/guia-despliegue.md`), los cuales entran a verificación e integración oficial dentro del Sprint 6.

---

## 4. Historias de Usuario Seleccionadas (Sprint Backlog)

### [HU-16] Despliegue en producción en Firebase Hosting y endurecimiento operativo
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 1 (Disponibilidad pública y seguridad en producción).
- **Condiciones técnicas que consolida:** #2 (Control de Acceso), #6 (Repositorio y Despliegue) y #7 (Documentación Operativa).
- **Descripción:** Como equipo de ingeniería, queremos publicar la aplicación web estática y las reglas `firestore.rules` en el proyecto Firebase `bdcuentasclaras-b1814`, restringiendo los dominios autorizados y la API Key de cliente web, para demostrar el sistema funcionando en una URL pública real durante el Parcial Corte III.

#### Criterios de Aceptación:
- **CA-16.1:** Configuración declarativa de Hosting y Firestore Rules en `firebase.json` y `.firebaserc` sirviendo `public/` y `src/` con cabeceras de caché controladas (`must-revalidate` para módulos JS/CSS/HTML).
- **CA-16.2:** Reglas `firestore.rules` desplegadas en el proyecto real y `firebaseConfig` protegido mediante restricción de referentes HTTP en Google Cloud + lista estricta de dominios autorizados en Firebase Auth.
- **CA-16.3:** Validación explícita del aviso de baja de Firebase Dynamic Links en Consola Auth, confirmando por auditoría de `src/services/auth.js` que el flujo correo/contraseña web no se ve interrumpido ni requiere migración de enlaces móviles/Cordova.
- **CA-16.4:** Aplicación accesible en `https://bdcuentasclaras-b1814.web.app` con consola de navegador (F12) completamente libre de errores críticos de red, CORS o Firebase.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Estado al Arrancar S6 |
|---|---|---|---:|
| **16.1** | Definir `firebase.json` y `.firebaserc` para Hosting y despliegue de `firestore.rules` | Daniel Cortes | ✅ **Adelantada el 13 nov** (`79315bd`) |
| **16.2** | Documentar `docs/guia-despliegue.md` (restricción de API Key y dominios Auth) | Daniel Cortes | ✅ **Adelantada el 13 nov** (`2f0638f`) |
| **16.3** | Desplegar `firestore:rules` y `hosting`, aplicar restricciones en Google Cloud y documentar alcance Dynamic Links | Daniel Cortes / Juan Diego Peraza | 🚀 En curso (14–18 nov) |
| **16.4** | Verificación UAT en URL pública (Auth, Hogar, Cuadre, Bolsillos, CSV y PDF sin errores F12) | Jorman Palacios / Yerson Niño | 🚀 En curso (16–20 nov) |

---

### [HU-17] Preparación de sustentación técnica integral y auditoría final de cierre
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Evaluación Corte III y cierre formal).
- **Condiciones técnicas que consolida:** #6 (Repositorio) y #7 (Documentación Integral).
- **Descripción:** Como equipo Scrum, queremos consolidar las evidencias de calidad, matriz de cumplimiento de las 7 condiciones técnicas y guion de demo en vivo, para garantizar una sustentación fluida del Parcial Corte III (21/11/2026) y el cierre administrativo del semestre (27/11/2026).

#### Criterios de Aceptación:
- **CA-17.1:** 100% de actas, bitácoras, DoR/DoD, `README.md` y `docs/sprint-goals.md` alineados con las fechas reales de clase e incrementos en GitHub.
- **CA-17.2:** Suite `node tests/runner.js` aprobando el 100% de las suites antes del Parcial Corte III y al cierre del sprint.
- **CA-17.3:** Guion de sustentación de 30 minutos ensayado por todos los miembros activos cubriendo arquitectura SoC, reglas Firestore, algoritmo Greedy de cuadre, resiliencia y exportación CSV/PDF.

#### Tareas Técnicas:
| Tarea | Descripción | Responsable | Fechas Planificadas |
|---|---|---|---|
| **17.1** | Checklist de sustentación y ensayo de demo en vivo sobre datos reales de hogar | Juan Diego Peraza / Daniel Cortes | 15 nov – 20 nov |
| **17.2** | Retrospectiva final de cierre semestral y consolidación de informe final Sprint 6 | Fabián Córdoba / Todo el equipo | 21 nov – 27 nov |

---

## 5. Definición de Terminado (DoD) para Sprint 6

1. Reglas de Firestore y Firebase Hosting desplegados y verificados con cuenta de usuario real.
2. Cero errores de consola en entorno local (`npx serve .`) y en entorno público (`https://bdcuentasclaras-b1814.web.app`).
3. Ejecutor `node tests/runner.js` al 100% PASS en la rama `main`.
4. Sustentación de Parcial Corte III realizada exitosamente el **21 de noviembre de 2026** y cierre documental formal el **27 de noviembre de 2026**.
