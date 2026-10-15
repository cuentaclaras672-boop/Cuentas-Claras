# Informe de Certificación de Pruebas — Sprint 2
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Responsable de Calidad y Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Fecha de Emisión:** 03 de octubre de 2026 (Cierre de Sprint 2)  
**Estado General:** ✅ **100% APROBADO (21 SP Verificados)**

---

## 🎯 1. Objetivo del Informe
Certificar el cumplimiento estricto de los Criterios de Aceptación (CA) y las condiciones de la **Definición de Terminado (DoD)** para las 4 Historias de Usuario desarrolladas en el Sprint 2:
- **HU-04:** Bolsillos de ahorro con metas (8 SP) — *Condición #1 (Persistencia real NoSQL)*.
- **HU-05:** Historial y búsqueda avanzada (5 SP) — *Condición #4 (Filtrado y Búsqueda)*.
- **HU-06:** Integración externa TRM y multidivisa (5 SP) — *Condición #3 (API Pública Externa)*.
- **HU-07:** Resiliencia y avisos de conexión (3 SP) — *Condición #5 (Manejo de Errores Visible)*.

---

## 🧪 2. Matriz de Cobertura y Resultados de Pruebas

| ID Tarea | Historia | Criterios Evaluados | Método de Verificación | Evidencia / Resultado | Estado |
|---|---|---|---|---|:---:|
| **Tarea 5.4** | HU-05 | CA-5.1 a CA-5.5 | Búsqueda insensible a tildes/mayúsculas, filtros por tipo, ámbito, categoría, fechas y botón limpiar | `tests/pruebas-filtros.test.js` ejecutado con éxito. Estado vacío contextual comprobado ante búsquedas sin coincidencias. | **Aprobado** |
| **Tarea 6.4** | HU-06 | CA-6.1 a CA-6.5 | Simulación de caída de API en DevTools (F12 → Network Block), failover multicanal y fallback $3.329,61 | `tests/pruebas-indicadores.test.js` ejecutado con éxito. Badge referencial visible y conmutación COP/USD sin alterar Firestore. | **Aprobado** |
| **Tarea 7.4** | HU-07 | CA-7.1 a CA-7.4 | Corte de red (F12 → Network → Offline), validación de inputs con borde rojo y prevención de bloqueos | `tests/pruebas-conexion.test.js` ejecutado con éxito. Botón de guardado reactivo, Toasts informativos y cero pantallas en blanco. | **Aprobado** |
| **Tarea 4.4** | HU-04 | CA-4.1 a CA-4.7 | Persistencia en Firestore (`bolsillos`), cálculo de porcentaje (tope 100%) y descuento del saldo líquido | `tests/pruebas-bolsillos.test.js` ejecutado con éxito. Transferencias controladas contra saldo disponible y restitución al borrar. | **Aprobado** |

---

## 🔍 3. Verificación de Criterios de Calidad (DoD)

1. **Cero Errores en Consola (F12 en ceros):**  
   Se ejecutó la aplicación localmente mediante servidor HTTP. Todas las interacciones (filtrado en vivo, cambio de divisa COP/USD, creación de bolsillos y conmutación offline) se ejecutaron con la consola de DevTools completamente limpia de errores y advertencias no controladas.

2. **Integridad de Datos y Sanitización XSS:**  
   Se inyectaron payloads de prueba con caracteres especiales (`<script>`, comillas simples y dobles) en descripciones de transacciones y nombres de bolsillos. Se confirmó que la función `escaparHTML` neutraliza cualquier riesgo de Cross-Site Scripting.

3. **Arquitectura Modular Limpia:**  
   Se validó la estricta separación de responsabilidades: los modelos (`src/models/`) y servicios (`src/services/`) se mantienen 100% desacoplados de la manipulación del DOM, concentrando la interacción visual exclusivamente en `src/ui/`.

---

## ✍️ 4. Dictamen de Calidad
En calidad de Scrum Master y responsable de Calidad y Pruebas del equipo **Cuentas Claras**, certifico que las tareas asignadas para el Sprint 2 cumplen satisfactoriamente con la totalidad de los requerimientos técnicos y funcionales, quedando habilitadas para la Sustentación 2.
