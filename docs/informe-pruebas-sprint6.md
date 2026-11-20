# Informe de Avance y Certificación Final de Pruebas — Sprint 6
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Responsable de Calidad y Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Fecha de Emisión:** 18 de noviembre de 2026 (Cierre Semestral y Pre-Sustentación Corte III)  
**Estado General:** ✅ **13 / 13 SUITES DE `tests/runner.js` APROBADAS (100% PASS) + 88/88 CASOS EN EMULADOR**

---

## 1. Alcance de las Pruebas de QA en Sprint 6

Este informe certifica las pruebas de cifrado criptográfico AES-256-GCM en cliente, validación defensiva al leer, cobertura de las 8 colecciones en `firestore.rules`, integración funcional de interfaz y regresión completa de las **18 Historias de Usuario (102 Story Points)** del proyecto:
- **HU-18:** Seguridad de los datos mediante cifrado AES-256-GCM en cliente (8 SP) — *Refuerza Condiciones #1 (Persistencia), #2 (Control de Acceso y Privacidad) y #5 (Manejo de Errores y Validación al Leer)*.
- **HU-16:** Preparación de despliegue en Firebase Hosting, completitud UI y endurecimiento operativo (8 SP) — *Consolida Condiciones #2, #4, #6 y #7 (alcance evaluado: MVP en local con Hosting listo para publicar)*.
- **HU-17:** Preparación de sustentación técnica integral y auditoría final de cierre (5 SP) — *Consolida Condiciones #6 y #7*.

---

## 2. Matriz de Cobertura y Resultados de Pruebas (Sprint 6)

| ID Tarea | Historia | Responsable(s) | Criterios Evaluados | Método de Verificación | Evidencia / Resultado | Estado |
|---|---|---|---|---|---|---|:---:|
| **Tarea 18.1 / 18.3** | HU-18 | Daniel Cortes / Fabián Córdoba | CA-18.1 a CA-18.7 | Generación e importación de claves AES-256 (`generarClaveBase64`, `importarClave`), ida y vuelta conservando tipos, IV aleatorio de 96 bits, detección de alteración / clave ajena / AAD distinto, retrocompatibilidad con datos sin cifrar y validación de límites máximos (`8 * chars + 48` y `100` para números) en `firestore.rules` | `tests/pruebas-cifrado.test.js` ejecutado en `node tests/runner.js` con 100% de éxito. | **Aprobado** |
| **Tarea 18.2 / 18.3 (Emulador)** | HU-18 | Daniel Cortes | CA-18.1 a CA-18.7 | Cifrado real en Firestore para `transacciones`, `bolsillos`, `prestamos`, `liquidaciones` y `categorias`; llaveros `clavesUsuario` y `clavesHogar`; rechazo de datos en texto plano; dos abonos simultáneos en `bolsillos` con `runTransaction`; descarte individual de registros alterados o fuera de rango al leer | `tests/emulador/auditoria-reglas.mjs` (**88 casos**) certificado contra Firestore/Auth Emulator (detalle en `docs/cifrado-datos.md`). | **Aprobado** |
| **Tarea 14.2 (Actualizada S6)** | HU-14 / HU-18 | Fabián Córdoba / Juan Diego Peraza | CA-14.1, CA-18.4 | Auditoría estática de las **8 colecciones** (`transacciones`, `bolsillos`, `prestamos`, `hogares`, `liquidaciones`, `categorias`, `clavesUsuario`, `clavesHogar`), funciones `esCifrado`, `esNumeroCifrado`, `esClaveAes`, inmutabilidad de `liquidaciones` y `clavesHogar`, catch-all `deny-all`, y ráfaga de 50 operaciones concurrentes (`< 500 ms`) | `tests/pruebas-seguridad-carga.test.js` aprobado en `0.67 ms` (`< 500 ms`), 0 condiciones de carrera. | **Aprobado** |
| **Tarea 16.3 / 16.4** | HU-16 | Juan Diego Peraza / Jorman Palacios / Yerson Niño | CA-16.1 a CA-16.4 | Verificación sintáctica (`node -c`) de todos los módulos en `src/` y `tests/`, integración de `#seccion-prestamos`, `#resumen-por-cobrar`, `#btn-editar-categoria`, `#btn-eliminar-categoria` y `#badge-cifrado` en `public/index.html`, `src/ui/dashboard.js` y `src/app.js`, y configuración `package.json` (`"type": "module"`) + `firebase.json` | 100% de módulos con sintaxis válida (`exit code 0`) y ejecución limpia sin advertencias en Node v22.12.0. | **Aprobado** |

---

## 3. Ejecución de la Suite Integral (`node tests/runner.js`)

```text
===============================================================
       CUENTAS CLARAS — SUITE INTEGRAL DE PRUEBAS QA
       Responsable: Fabián Córdoba (Scrum Master / QA)
===============================================================

▶ Ejecutando pruebas de Tarea 5.4 (Filtros del Historial)...
  ✔ Todas las verificaciones de Tarea 5.4 pasaron exitosamente (CA-5.1 a CA-5.5).
[PASS] Sprint 2 - Tarea 5.4: Filtros del Historial (HU-05)

▶ Ejecutando pruebas de Tarea 6.4 (API TRM, Fallback y Divisas)...
  ✔ Todas las verificaciones de Tarea 6.4 pasaron exitosamente (CA-6.1 a CA-6.5).
[PASS] Sprint 2 - Tarea 6.4: API TRM, Fallback y Divisas (HU-06)

▶ Ejecutando pruebas de Tarea 7.4 (Conexión offline y validación de campos)...
  ✔ Todas las verificaciones de Tarea 7.4 pasaron exitosamente (CA-7.1 a CA-7.4).
[PASS] Sprint 2 - Tarea 7.4: Conexión Offline y Validación (HU-07)

▶ Ejecutando pruebas de Tarea 4.4 (Integración de Bolsillos y Saldo Disponible)...
  ✔ Todas las verificaciones de Tarea 4.4 pasaron exitosamente (CA-4.1 a CA-4.7).
[PASS] Sprint 2 - Tarea 4.4: Bolsillos y Saldo Disponible (HU-04)

▶ Ejecutando pruebas de Tarea 8.4 (Préstamos a terceros y abonos atómicos)...
  ✔ Todas las verificaciones de Tarea 8.4 pasaron exitosamente (CA-8.1 a CA-8.8).
[PASS] Sprint 3 - Tarea 8.4: Préstamos a Terceros y Abonos (HU-08)

▶ Ejecutando pruebas de Tarea 9.4 (Hogar compartido, privacidad y prueba negativa)...
  ✔ Todas las verificaciones de Tarea 9.4 pasaron exitosamente (CA-9.1 a CA-9.7 y prueba negativa).
[PASS] Sprint 3 - Tarea 9.4: Hogar Compartido y Aislamiento (HU-09)

▶ Ejecutando pruebas de Tarea 10.3 (Gráfica de gastos, filtros y divisas)...
  ✔ Todas las verificaciones de Tarea 10.3 pasaron exitosamente (CA-10.1 a CA-10.5).
[PASS] Sprint 3 - Tarea 10.3: Gráfica de Gastos y Divisa (HU-10)

▶ Ejecutando pruebas de Tarea 11.4 (Cuadre de cuentas, liquidaciones y control de descripción)...
  ✔ Todas las verificaciones de Tarea 11.4 y Tarea 13.1 pasaron exitosamente.
[PASS] Sprint 4 - Tarea 11.4 / 13.1: Cuadre del Hogar y Control de Descripción (HU-11 / HU-13)

▶ Ejecutando pruebas de Tarea 12.4 (Categorías Personalizadas - HU-12)...
  ✔ Todas las verificaciones de Tarea 12.4 pasaron exitosamente (CA-12.1 a CA-12.4).
[PASS] Sprint 4 - Tarea 12.4: Categorías Personalizadas por Usuario (HU-12)

Iniciando pruebas de la Tarea 14.3: degradación elegante y reconexión...
  ✔ Todas las verificaciones de la Tarea 14.3 pasaron (CA-14.3).
[PASS] Sprint 5 - Tarea 14.3: Degradación Elegante y Reconexión (HU-14)

Iniciando pruebas de la Tarea 14.2: Auditoría de Reglas, Estrés (50 ops) y Fechas...
  -> [OK] Auditoría estática de 8 colecciones, reglas de cifrado AES-256-GCM y catch-all deny-all en firestore.rules verificada.
  -> [OK] Ráfaga de 50 abonos concurrentes completada en 0.67 ms (< 500 ms), 0 race conditions.
  -> [OK] Idempotencia bajo 50 cierres mensuales concurrentes verificada (1 consolidado, 49 bloqueados).
  -> [OK] Normalización transversal normalizarFecha() verificada para Date, Timestamp y { seconds }.
[PASS] Sprint 5 - Tarea 14.2: Blindaje de Reglas, Estrés (50 ops) y Fechas (HU-14)

Iniciando pruebas de la Tarea 15.1: Exportación CSV RFC 4180 (HU-15)...
  -> [OK] Escapado RFC 4180 y neutralización de inyección de fórmulas validados.
  -> [OK] Serialización CSV con BOM UTF-8, CRLF, Timestamp { seconds } y RFC 4180 validada.
  -> [OK] Exportación vacía, manejo de errores y nombreArchivoCSV validados.
[PASS] Sprint 5 - Tarea 15.1: Exportación CSV RFC 4180 y BOM UTF-8 (HU-15)

  -> Ejecutando pruebas de cifrado AES-256-GCM...
  ✓ AES-256-GCM: ida y vuelta, IV aleatorio, clave/campo/alteración detectados, datos antiguos y tamaños de reglas.
[PASS] Seguridad: Cifrado AES-256-GCM de los datos antes de Firestore

===============================================================
 RESUMEN DE EJECUCIÓN QA:
 Total Suites:    13
 Aprobadas:       13
 Fallidas:        0
 Tasa de Éxito:   100%
===============================================================
```

**Dictamen Final del Scrum Master / QA Lead:**  
El incremento del Sprint 6 y la totalidad de las **18 Historias de Usuario (102 Story Points)** cumplen el 100% de la Definición de Terminado (DoD) y de las Siete Condiciones Técnicas de la asignatura. El software queda certificado para la **Sustentación Final del Parcial Corte III (21 de noviembre de 2026)**.
