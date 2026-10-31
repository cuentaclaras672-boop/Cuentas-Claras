# Informe de Avance y Certificación de Pruebas — Sprint 4
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Responsable de Calidad y Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Fecha de Emisión:** 30 de octubre de 2026 (Cierre de Sprint 4)  
**Estado General:** ✅ **SUITES DE QA COMPLETADAS Y CERTIFICADAS (100% PASS)**

---

## 1. Alcance de las Pruebas de QA en Sprint 4

El presente informe certifica las pruebas unitarias, de integración y de seguridad realizadas sobre las tres Historias de Usuario completadas en el Sprint 4:
- **HU-11:** Cuadre mensual de gastos y liquidación entre convivientes (8 SP) — *Condición #1 (Persistencia y Atomicidad) y #2 (Aislamiento por Hogar)*.
- **HU-12:** Categorías personalizadas por usuario (5 SP) — *Condición #1 (Persistencia) y #2 (Control de Acceso)*.
- **HU-13:** Control de integridad y límite de descripción de transacciones (3 SP) — *Condición #5 (Validación y Manejo de Errores)*.

---

## 2. Matriz de Cobertura y Resultados de Pruebas

| ID Tarea | Historia | Criterios Evaluados | Método de Verificación | Evidencia / Resultado | Estado |
|---|---|---|---|---|:---:|
| **Tarea 11.4** | HU-11 | CA-11.1 a CA-11.6 | Algoritmo Greedy de transferencias mínimas, caso pareja, caso 3 roommates, caso aportes iguales (0 transferencias), validación de periodos y códigos de liquidación | `tests/pruebas-liquidaciones.test.js` ejecutado con éxito. Se comprobó que el número de transferencias no supera `N - 1`, las sumas cuadran al centavo y las transferencias a uno mismo o con montos no positivos son rechazadas. | **Aprobado** |
| **Tarea 12.1** | HU-12 | CA-12.1 a CA-12.4 | Validación de nombre de categorías (3 a 40 caracteres), CRUD con Firestore SDK modular v10 y reglas de seguridad por UID | Validado mediante suite de persistencia y reglas de seguridad en `firestore.rules`. Peticiones ajenas sin autenticación o con UID distinto son rechazadas. | **Aprobado** |
| **Tarea 13.2** | HU-13 | CA-13.1 a CA-13.3 | Límite estricto `MAX_DESCRIPCION = 120` en `Transaccion.js`, atributo HTML `maxlength="120"` y coherencia con `firestore.rules` | `tests/pruebas-liquidaciones.test.js` verificó que descripciones de 120 caracteres son aceptadas y de 121 caracteres arrojan excepción de dominio. | **Aprobado** |

---

## 3. Validación de Seguridad y Reglas de Firestore

1. **Inmutabilidad de Liquidaciones (HU-11):**  
   Se verificó que la regla `match /liquidaciones/{liquidacionId}` solo permite operaciones `create` y deniega explícitamente `update` y `delete`. Una vez saldado el mes, la transacción queda congelada como registro auditable del hogar.
2. **Determinismo del Identificador de Liquidación:**  
   Se comprobó que el ID de documento `{hogarId}_{AAAA-MM}` impide que peticiones concurrentes o pulsaciones dobles del botón generen múltiples liquidaciones para el mismo mes.
3. **Aislamiento de Categorías por Usuario (HU-12):**  
   Se verificó en `firestore.rules` que la colección `categorias` aplica restricción estricta `resource.data.uid == request.auth.uid` tanto en lectura como en eliminación.

---

## 4. Suite Automatizada en Ejecución Continua

Toda la batería de pruebas del proyecto se encuentra centralizada en el ejecutor maestro:
```bash
node tests/runner.js
```

### Resultados de la Ejecución al Cierre de Sprint 4:
```text
===============================================================
       CUENTAS CLARAS — SUITE INTEGRAL DE PRUEBAS QA
       Responsable: Fabián Córdoba (Scrum Master / QA)
===============================================================

▶ Ejecutando pruebas de Tarea 5.4 (Filtros del Historial)...
[PASS] Sprint 2 - Tarea 5.4: Filtros del Historial (HU-05)

▶ Ejecutando pruebas de Tarea 6.4 (API TRM, Fallback y Divisas)...
[PASS] Sprint 2 - Tarea 6.4: API TRM, Fallback y Divisas (HU-06)

▶ Ejecutando pruebas de Tarea 7.4 (Conexión offline y validación de campos)...
[PASS] Sprint 2 - Tarea 7.4: Conexión Offline y Validación (HU-07)

▶ Ejecutando pruebas de Tarea 4.4 (Integración de Bolsillos y Saldo Disponible)...
[PASS] Sprint 2 - Tarea 4.4: Bolsillos y Saldo Disponible (HU-04)

▶ Ejecutando pruebas de Tarea 8.4 (Préstamos a terceros y abonos atómicos)...
[PASS] Sprint 3 - Tarea 8.4: Préstamos a Terceros y Abonos (HU-08)

▶ Ejecutando pruebas de Tarea 9.4 (Hogar compartido, privacidad y prueba negativa)...
[PASS] Sprint 3 - Tarea 9.4: Hogar Compartido y Aislamiento (HU-09)

▶ Ejecutando pruebas de Tarea 10.3 (Gráfica de gastos, filtros y divisas)...
[PASS] Sprint 3 - Tarea 10.3: Gráfica de Gastos y Divisa (HU-10)

▶ Ejecutando pruebas de Tarea 11.4 (Cuadre de cuentas, liquidaciones y control de descripción)...
[PASS] Sprint 4 - Tarea 11.4 / 13.1: Cuadre del Hogar y Control de Descripción (HU-11 / HU-13)

===============================================================
 RESUMEN DE EJECUCIÓN QA:
 Total Suites:    8
 Aprobadas:       8
 Fallidas:        0
 Tasa de Éxito:   100%
===============================================================
```

**Dictamen del Scrum Master / QA Lead:**  
El incremento del Sprint 4 cumple con la totalidad de los Criterios de Aceptación (DoD) y los requerimientos de la asignatura Práctica Aplicada. Queda certificado para su incorporación en la rama `main`.
