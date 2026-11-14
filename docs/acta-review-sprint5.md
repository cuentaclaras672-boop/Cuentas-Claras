# Acta de Sprint Review — Sprint 5
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente / Evaluadora:** Vilma Yenny Bohórquez  
**Fecha de la Sesión:** 13 de noviembre de 2026 (consolidación final de rama principal: 14 de noviembre de 2026)  
**Periodo del Sprint 5:** 31 de octubre al 13 de noviembre de 2026  
**Hito Asociado:** Cierre de Fase de Estabilización, Seguridad y Exportación previo a Despliegue Final  

---

## 1. Asistentes y Roles Scrum

| Integrante | Rol Scrum | Participación en el Sprint Review |
|---|---|---|
| **Juan Diego Peraza Amado** | Product Owner | Validación de portabilidad CSV/PDF, integración final de `normalizarFecha`, hoja `@media print`, pruebas de exportación y consolidación de cierre en GitHub. |
| **Fabián Eduardo Córdoba** | Scrum Master / QA | Supervisión de DoD/DoR, diseño de batería de concurrencia (`pruebas-seguridad-carga.test.js`) y certificación global de las 12 suites en `runner.js`. |
| **Daniel Felipe Cortes** | Development Team | Demostración de auditoría de seguridad en `firestore.rules` (46 casos en emulador), sistema de reintentos en `conexion.js` y adelanto de configuración Hosting/despliegue. |
| **Jorman Palacios Murillo** | Development Team | Diseño de controles de exportación en cabecera del historial, estados visuales accesibles y limpieza visual en impresión. |
| **Yerson Niño Guerrero** | Development Team | Especificación y lógica de serialización tabular RFC 4180 con BOM UTF-8 e inmunización de celdas en `src/utils/exportador.js`. |

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Realizar la auditoría de seguridad integral, pruebas de resiliencia y pruebas de carga sobre Cloud Firestore y Firebase Auth, incorporando la exportación de reportes financieros del hogar (formato estructurado CSV / PDF imprimible) para garantizar la robustez del sistema de cara al cierre de semestre."*

**Resultado:** **CUMPLIDO AL 100% (13/13 Story Points entregados, verificados y consolidados sin defectos abiertos)**.

---

## 3. Demostración del Incremento de Producto (Sprint Demo)

### 3.1 [HU-14] Auditoría de seguridad, pruebas de carga y resiliencia en red (8 SP · Prioridad 1)
- **Componentes Entregados:**
  - `firestore.rules`: validación estricta de esquemas, longitudes, tipos, inmutabilidad y aislamiento por UID/hogar en las 6 colecciones (`transacciones`, `bolsillos`, `prestamos`, `hogares`, `liquidaciones`, `categorias`) + catch-all final `deny-all`.
  - `src/models/Bolsillo.js` y `public/index.html`: alineación del rango de nombre de bolsillo a `3–40` caracteres entre frontend, modelo y reglas de servidor.
  - `tests/emulador/auditoria-reglas.mjs` y `docs/auditoria-seguridad-sprint5.md`: batería de 46 escenarios reales contra Firestore Emulator (40 ataques bloqueados con `PERMISSION_DENIED` + 6 flujos legítimos aprobados).
  - `src/services/conexion.js` + `firestore.js`, `hogares.js`, `liquidaciones.js`, `prestamos.js`, `categorias.js`: clase `ErrorSinConexion`, guarda previa `asegurarConexion()` y backoff `conReintentos()` para fallos transitorios (`unavailable`, `aborted`, `deadline-exceeded`, `resource-exhausted`).
  - `tests/pruebas-resiliencia.test.js` y `tests/pruebas-seguridad-carga.test.js`: verificación de degradación elegante offline y ráfagas de 50 operaciones concurrentes sin condiciones de carrera en menos de 500 ms.
- **Resultado:** Aprobada al 100% por el Product Owner.

### 3.2 [HU-15] Exportación de reportes financieros del hogar (CSV y vista imprimible) (5 SP · Prioridad 2)
- **Componentes Entregados:**
  - `src/utils/exportador.js`: módulo puro con funciones `escaparCampoCSV()`, `generarCSVTransacciones()` y `nombreArchivoCSV()`, aplicando estándar RFC 4180, saltos CRLF (`\r\n`), cabeceras oficiales (`Fecha,Descripcion,Monto,Tipo,Ambito,Categoria,Autor`), neutralización de fórmulas CSV y BOM UTF-8 (`\uFEFF`) para Excel.
  - `public/index.html` y `src/ui/dashboard.js`: botones **Exportar CSV** (`#btn-exportar-csv`) e **Imprimir / PDF** (`#btn-imprimir-reporte`) conectados directamente a `obtenerTransaccionesFiltradas()` (CA-15.2), manteniéndose disponibles aun sin conexión a Internet al operar sobre memoria local.
  - `public/style.css`: hoja de estilo `@media print` con clase `.no-print` para ocultar navegación, banners, formularios y botones destructivos, y `.only-print` para mostrar cabecera de titular, fecha de generación y filtros aplicados en el PDF final.
  - `tests/pruebas-exportador.test.js`: verificación integral del escapado RFC 4180, BOM UTF-8, subconjuntos filtrados y manejo de casos vacíos.
- **Resultado:** Aprobada al 100% por el Product Owner.

### 3.3 Cumplimiento Adicional de Acuerdos de Retrospectiva Sprint 4
- **Ancla 1 (`normalizarFecha`):** Se implementó `normalizarFecha(valor)` en `src/utils/formateo.js`, reutilizándola transversalmente en `formatearFecha()`, `src/services/liquidaciones.js`, `src/utils/exportador.js` y `src/ui/dashboard.js`.
- **Ancla 2 (Homogeneidad Firebase SDK `10.13.0`):** Se verificó que todos los servicios en `src/services/` importan la versión `10.13.0` y se incorporó el control permanente en `docs/definition-of-done.md`.
- **Adelanto hacia Sprint 6:** Durante este cierre quedaron además adelantados `.firebaserc`, `firebase.json` y `docs/guia-despliegue.md` para agilizar la salida a producción en Firebase Hosting.

### 3.4 Matriz de Tareas, Integrantes y Trazabilidad en Repositorio

| Tarea / Compromiso | Descripción | Responsable Asignado (Scrum) | Ejecución y Trazabilidad en Git | Estado |
|:---:|---|---|---|:---:|
| **14.1** | Endurecimiento de `firestore.rules` (6 colecciones) y auditoría en emulador (46 casos) | Daniel Felipe Cortes | Autoría directa en `origin/main` (`82b0c90`, 13 nov) | ✅ Terminada |
| **14.2** | Batería de auditoría estática, 50 ops concurrentes y latencia `< 500 ms` | Fabián Eduardo Córdoba *(QA Lead)* | Criterios QA certificados; suite integrada en `runner.js` por Juan Diego Peraza (`19a0dda`, 14 nov) | ✅ Terminada |
| **14.3** | Resiliencia de red, `conReintentos()` en 5 servicios y `pruebas-resiliencia.test.js` | Daniel Felipe Cortes | Autoría directa en `origin/main` (`a1f7ccd`, 13 nov) | ✅ Terminada |
| **14.4** | Preparación CLI para publicación de reglas (`firebase.json`, `.firebaserc`, `guia-despliegue.md`) | Daniel Felipe Cortes | Config/guía publicada (`79315bd`, `2f0638f`); ejecución en Consola Firebase continuada en **16.3** | ✅ Prep. lista |
| **15.1** | Módulo puro de exportación CSV RFC 4180 + BOM UTF-8 (`src/utils/exportador.js` y tests) | Yerson Niño Guerrero *(Diseño)* | Especificado en Planning; implementado y probado en `main` por Juan Diego Peraza (`32612ff`, `19a0dda`) | ✅ Terminada |
| **15.2** | Controles `#btn-exportar-csv` / `#btn-imprimir-reporte` conectados a filtros activos | Jorman Palacios Murillo *(Diseño UI)* | Especificado en Planning; integrado en HTML/JS por Juan Diego Peraza (`32612ff`) | ✅ Terminada |
| **15.3** | Hoja de estilo `@media print` (`public/style.css`) y banner `.only-print` | Juan Diego Peraza Amado | Autoría directa en `origin/main` (`32612ff`, 14 nov) | ✅ Terminada |
| **Ancla 1 y 2** | Normalización `normalizarFecha()` y regla Firebase SDK `10.13.0` en DoD | Daniel Cortes / Juan Diego Peraza | Implementado y verificado por Juan Diego Peraza (`1f7d4c3`, `0f9a2f6`) | ✅ Terminada |

---

## 4. Métricas de Entrega y Calidad (Sprint 5)

| Métrica del Sprint | Compromiso Inicial | Resultado Obtenido | Estado |
|---|:---:|:---:|:---:|
| **Historias de Usuario (HU)** | 2 historias (HU-14, HU-15) | 2 historias entregadas y aceptadas | 100% |
| **Story Points (SP)** | 13 SP | 13 SP certificados | 100% |
| **Tareas del Sprint Backlog** | 6 tareas técnicas | 6 tareas cerradas en Done | 100% |
| **Suites en `tests/runner.js`** | 12 suites totales | 12 / 12 aprobadas (100% PASS) | 100% |
| **Auditoría Emulador Firestore** | Suite negativa + positiva | 46 casos (40 bloqueos + 6 flujos válidos) | Verificada |
| **Deuda Técnica Abierta** | 0 defectos críticos | 0 defectos en lógica, seguridad ni QA | Resuelta |

---

## 5. Acuerdos de Cierre y Apertura de Sprint 6

1. El Product Owner acepta formalmente el incremento del Sprint 5, elevando la velocidad acumulada del equipo a **81 Story Points** en 10 semanas (`15 + 21 + 16 + 16 + 13`).
2. Se da apertura inmediata hoy **14 de noviembre de 2026** al **Sprint 6 (14 al 27 de noviembre de 2026)**, orientado al despliegue en Firebase Hosting, publicación de reglas productivas, endurecimiento de API Key, pruebas de aceptación final y sustentación del **Parcial Corte III (21 de noviembre de 2026)**.
