# Informe de Avance y Certificación de Pruebas — Sprint 3
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Responsable de Calidad y Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Fecha de Emisión:** 16 de octubre de 2026 (Cierre de Sprint 3 · Sesión de Parcial Corte II y Review del 17/10/2026)  
**Estado General:** ✅ **SUITES DE QA COMPLETADAS Y CERTIFICADAS (100% PASS)**

---

## 🎯 1. Alcance de las Pruebas de QA en Sprint 3
El presente informe documenta las pruebas unitarias, de integración y de seguridad realizadas sobre las tres Historias de Usuario abordadas en el Sprint 3:
- **HU-08:** Préstamos a terceros con abonos parciales (8 SP) — *Condición #1 (Persistencia) y #4 (Filtrado)*.
- **HU-09:** Hogar compartido entre convivientes (5 SP) — *Condición #2 (Control de Acceso y Aislamiento)*.
- **HU-10:** Gráfica de gastos por categoría (3 SP) — *Condición #4 (Filtrado y Agrupación)*.

---

## 🧪 2. Matriz de Cobertura y Resultados de Pruebas

| ID Tarea | Historia | Criterios Evaluados | Método de Verificación | Evidencia / Resultado | Estado |
|---|---|---|---|---|:---:|
| **Tarea 8.4** | HU-08 | CA-8.1 a CA-8.8 | Validación de deudor, recálculo de saldo pendiente, rechazo de abonos excesivos, paso a SALDADO y filtros | `tests/pruebas-prestamos.test.js` ejecutado con éxito. Se comprobó que ningún abono deja saldo negativo y el total por cobrar suma únicamente saldos pendientes. | **Aprobado** |
| **Tarea 9.4** | HU-09 | CA-9.1 a CA-9.7 | Código de invitación de 6 caracteres, visibilidad de gastos compartidos, aislamiento de gastos personales y prueba negativa | `tests/pruebas-hogares.test.js` ejecutado con éxito. Se validó la regla de seguridad: convivientes no acceden a personales ajenos y cuentas terceras reciben denegación estricta de lectura. | **Aprobado** |
| **Tarea 10.3** | HU-10 | CA-10.1 a CA-10.5 | Agrupación pura de gastos por categoría, ordenamiento decreciente, porcentajes con un decimal, selector COP/USD y estado vacío | `tests/pruebas-grafica.test.js` ejecutado con éxito. Ingresos ignorados en la sumatoria, sanitización XSS con `escaparHTML` comprobada y estado vacío visual. | **Aprobado** |

---

## 🛡️ 3. Validación de Seguridad y Reglas de Firestore
1. **Aislamiento en Hogar Compartido (Condición Técnica #2):**  
   Se corroboró que en la colección `transacciones`, la cláusula de consulta y las reglas en servidor aíslan por completo los movimientos marcados como `PERSONAL`, permitiendo compartir únicamente los clasificados como `COMPARTIDO` entre convivientes vinculados mediante el mismo `hogarId`.
2. **Prueba Negativa de Acceso:**  
   Se simuló una petición de lectura desde un UID externo no perteneciente al hogar; el sistema rechazó el acceso impidiendo fugas de datos financieros.
3. **Consistencia Transaccional en Préstamos:**  
   Se verificó que `runTransaction` garantiza atomicidad en los abonos, impidiendo que condiciones de carrera o peticiones simultáneas registren abonos por encima del saldo pendiente.

---

## 🚀 4. Suite Automatizada en Ejecución Continua
Toda la batería de pruebas se encuentra integrada en el ejecutor unificado:
```bash
node tests/runner.js
```
Con un resultado de **7 de 7 suites aprobadas (100% tasa de éxito)** sin advertencias en consola.
