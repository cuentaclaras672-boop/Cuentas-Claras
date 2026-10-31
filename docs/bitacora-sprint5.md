# Bitácora de Seguimiento — Sprint 5
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Periodo:** 31 de octubre al 13 de noviembre de 2026 (2 semanas)  

---

## 1. Resumen Ejecutivo del Sprint 5

El Sprint 5 marca el inicio de la fase de estabilización, pruebas no funcionales de carga y resiliencia (**HU-14**) y portabilidad de datos mediante exportación de reportes (**HU-15**) previo al Parcial Final de Corte III y sustentación de grado.

| Métrica | Planificado | Estado Actual |
|---|:---:|:---:|
| **Story Points (SP)** | 13 SP | 🚀 En Ejecución / Arranque |
| **Historias de Usuario** | 2 historias (HU-14 y HU-15) | 🚀 En Progreso |
| **Tareas Técnicas** | 6 tareas | 🚀 2 en progreso, 4 por hacer |
| **Suites de Pruebas QA** | 8 suites existentes + 1 en construcción | ✅ 8 de 8 aprobadas (100% PASS) |
| **Fecha de Inicio** | 31 de octubre de 2026 | ✅ En curso |
| **Fecha de Cierre** | 13 de noviembre de 2026 | ⏳ Planificado |

---

## 2. Registro Cronológico de Daily Scrums

### Daily 1 — Sábado, 31 de Octubre de 2026 (Kick-off de Sprint 5)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer (Viernes 30 de Octubre):** Cierre formal del Sprint 4 con 16/16 SP cumplidos, integración de `liquidaciones.js` (HU-11), `categorias.js` (HU-12) y control estricto de descripción de 120 caracteres (HU-13). Ejecución de 8/8 suites de pruebas QA al 100%.
- **Hoy (Kick-off Sprint 5):** 
  - Apertura formal del Sprint 5 en el tablero Miro.
  - Daniel Cortes inicia la auditoría de seguridad de `firestore.rules` (Tarea 14.1) verificando que las 6 colecciones apliquen reglas cerradas contra accesos anónimos.
  - Yerson Niño comienza el diseño del módulo de exportación CSV en `src/utils/exportador.js` (Tarea 15.1) garantizando cumplimiento de RFC 4180.
  - Juan Diego Peraza revisa el repositorio, valida commits de los compañeros, corrige bugs de versionamiento y sincroniza la documentación integral.
- **Impedimentos:** Ninguno. Equipo alineado con el cronograma oficial de la docente Vilma Yenny Bohórquez para llegar con holgura a la sustentación final del 21 de noviembre.

---

## 3. Próximos Pasos (Semana 9 de Clases: 02 al 06 de Noviembre de 2026)
1. Concluir la auditoría de reglas en Firestore e implementar simulaciones de estrés concurrente en la suite de pruebas.
2. Integrar el botón de exportación CSV en la barra de filtros del historial con descarga automática en el navegador.
3. Actualizar el burndown chart en la sesión intermedia de control ágil.
