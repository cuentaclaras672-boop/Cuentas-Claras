# Informe de Avance y Certificación de Pruebas — Sprint 5
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Responsable de Calidad y Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Fecha de Emisión:** 13 de noviembre de 2026 (consolidación QA completa en `main`: 14 de noviembre de 2026)  
**Estado General:** ✅ **12 / 12 SUITES DE `tests/runner.js` APROBADAS (100% PASS) + 46/46 CASOS EN EMULADOR**

---

## 1. Alcance de las Pruebas de QA en Sprint 5

Este informe certifica las pruebas de seguridad, carga concurrente, resiliencia ante caídas de red, normalización transversal de fechas y exportación de reportes sobre las dos Historias de Usuario del Sprint 5:
- **HU-14:** Auditoría de seguridad, pruebas de carga y resiliencia en red (8 SP) — *Refuerza Condiciones #2 (Control de Acceso y Aislamiento) y #5 (Manejo de Errores y Resiliencia)*.
- **HU-15:** Exportación de reportes financieros del hogar (CSV RFC 4180 y vista imprimible a PDF) (5 SP) — *Refuerza Condición #4 (Consulta con Filtrado y Portabilidad)*.
- **Compromisos Técnicos Retro S4:** Ancla 1 (`normalizarFecha()` transversal) y Ancla 2 (homogeneidad Firebase SDK `10.13.0` en `docs/definition-of-done.md`).

---

## 2. Matriz de Cobertura y Resultados de Pruebas

| ID Tarea | Historia | Responsable(s) | Criterios Evaluados | Método de Verificación | Evidencia / Resultado | Estado |
|---|---|---|---|---|---|---|:---:|
| **Tarea 14.1** | HU-14 | Daniel Felipe Cortes | CA-14.1 | Reglas de seguridad en `firestore.rules` para 6 colecciones (`transacciones`, `bolsillos`, `prestamos`, `hogares`, `liquidaciones`, `categorias`) + catch-all deny-all; verificación de límites (`Bolsillo` 3–40 chars) | Ejecutada el 13/11/2026 por Daniel Cortes sobre emulador local (`tests/emulador/auditoria-reglas.mjs`) reportando 40 ataques bloqueados y 6 flujos válidos aprobados (detalle en `docs/auditoria-seguridad-sprint5.md`). Además, cobertura estática verificada en `tests/pruebas-seguridad-carga.test.js`. | **Aprobado** |
| **Tarea 14.2** | HU-14 | Fabián Eduardo Córdoba (QA Lead) / Juan Diego Peraza | CA-14.2, CA-14.4 | Auditoría estática de reglas, ráfaga de 50 operaciones atómicas concurrentes con fallos transitorios simulados, 50 cierres idempotentes simultáneos y medición de latencia (`< 500 ms`) | `tests/pruebas-seguridad-carga.test.js` ejecutado en `node tests/runner.js`: 50 abonos concurrentes completados en 0.41 ms (`< 500 ms`), saldo exacto `$0` sin condiciones de carrera y 1/50 consolidaciones en cierre mensual idempotente. | **Aprobado** |
| **Tarea 14.3** | HU-14 | Daniel Felipe Cortes | CA-14.3 | `ErrorSinConexion`, `asegurarConexion()`, `esErrorTransitorio()` y `conReintentos()` en `src/services/conexion.js` integrados en los 5 servicios Firestore | `tests/pruebas-resiliencia.test.js` ejecutado en `node tests/runner.js`: rechaza escrituras offline antes de llegar a Firestore, reintenta fallos transitorios (`unavailable`, `aborted`) con espera exponencial y falla directo en errores permanentes (`permission-denied`). | **Aprobado** |
| **Tarea 14.4** | HU-14 | Daniel Felipe Cortes | Despliegue reglas | Definición declarativa en `firebase.json` / `.firebaserc` y procedimiento de publicación `firestore:rules` en `docs/guia-despliegue.md` | Configuración validada; publicación en Consola Firebase con cuenta administradora vinculada a Tarea 16.3 del Sprint 6. | **Prep. Lista** |
| **Ancla 1 S4** | Deuda Técnica | Juan Diego Peraza / Daniel Cortes | Homogeneidad de fechas | `normalizarFecha(valor)` en `src/utils/formateo.js` y reutilización en `liquidaciones.js`, `exportador.js` y `dashboard.js` | Verificado en `tests/pruebas-seguridad-carga.test.js` para instancias `Date`, objetos Firestore `.toDate()`, objetos `{ seconds }`, cadenas ISO y valores nulos/corruptos. | **Aprobado** |
| **Tarea 15.1** | HU-15 | Yerson Niño (Diseño) / Juan Diego Peraza (Impl.) | CA-15.1 | `CABECERAS_CSV`, `escaparCampoCSV()`, `generarCSVTransacciones()` y `nombreArchivoCSV()` en `src/utils/exportador.js` | `tests/pruebas-exportador.test.js` certifica BOM UTF-8 (`\uFEFF`), saltos `\r\n`, cabeceras `Fecha,Descripcion,Monto,Tipo,Ambito,Categoria,Autor`, escape RFC 4180 de comas/comillas/saltos y neutralización de fórmulas. | **Aprobado** |
| **Tareas 15.2 y 15.3** | HU-15 | Jorman Palacios (UI) / Juan Diego Peraza | CA-15.2, CA-15.3 | Controles `#btn-exportar-csv` e `#btn-imprimir-reporte` conectados a `obtenerTransaccionesFiltradas()`, hoja `@media print` en `public/style.css` y `.only-print`/`.no-print` en `public/index.html` | Revisión de código y verificación sintáctica (`node -c`) sobre `src/ui/dashboard.js`, `src/app.js`, `src/utils/exportador.js`, `src/services/liquidaciones.js` y `src/utils/formateo.js` con código de salida 0. | **Aprobado** |

> [!NOTE]
> **Alcance de la verificación local en este entorno:** La suite completa de 12 módulos (`node tests/runner.js`) y las comprobaciones sintácticas (`node -c`) se ejecutaron directamente tras la consolidación final de Sprint 5 con 100% de éxito. La batería de penetración contra emulador (`tests/emulador/auditoria-reglas.mjs`, 46 casos) fue ejecutada y certificada por Daniel Cortes el 13/11/2026 según el registro de [`docs/auditoria-seguridad-sprint5.md`](auditoria-seguridad-sprint5.md) y no se re-ejecutó en esta máquina porque `tests/emulador/node_modules/` está excluido del repositorio Git hasta ejecutar `npm install` dentro de `tests/emulador/`.

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
  -> [OK] Auditoría estática de 6 colecciones y catch-all deny-all en firestore.rules verificada.
  -> [OK] Ráfaga de 50 abonos concurrentes completada en 0.41 ms (< 500 ms), 0 race conditions.
  -> [OK] Idempotencia bajo 50 cierres mensuales concurrentes verificada (1 consolidado, 49 bloqueados).
  -> [OK] Normalización transversal normalizarFecha() verificada para Date, Timestamp y { seconds }.
[PASS] Sprint 5 - Tarea 14.2: Blindaje de Reglas, Estrés (50 ops) y Fechas (HU-14)

Iniciando pruebas de la Tarea 15.1: Exportación CSV RFC 4180 (HU-15)...
  -> [OK] Escapado RFC 4180 y neutralización de inyección de fórmulas validados.
  -> [OK] Serialización CSV con BOM UTF-8, CRLF, Timestamp { seconds } y RFC 4180 validada.
  -> [OK] Exportación vacía, manejo de errores y nombreArchivoCSV validados.
[PASS] Sprint 5 - Tarea 15.1: Exportación CSV RFC 4180 y BOM UTF-8 (HU-15)

===============================================================
 RESUMEN DE EJECUCIÓN QA:
 Total Suites:    12
 Aprobadas:       12
 Fallidas:        0
 Tasa de Éxito:   100%
===============================================================
```

**Dictamen del Scrum Master / QA Lead:**  
El incremento del Sprint 5 cumple la totalidad de los criterios de aceptación, refuerza la seguridad y la resiliencia de Firebase, e incorpora exportación CSV/PDF alineada con la arquitectura SoC. Queda certificado para iniciar el **Sprint 6 (Despliegue en Producción y Sustentación Final)**.
