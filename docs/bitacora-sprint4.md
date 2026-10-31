# Bitácora de Seguimiento — Sprint 4
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Periodo:** 17 de octubre al 30 de octubre de 2026 (2 semanas)  

---

## 1. Resumen Ejecutivo del Sprint 4

Durante el Sprint 4, el equipo abordó el núcleo de valor diferencial del producto: la conciliación mensual de gastos entre convivientes (**HU-11**), permitiendo responder de manera matemática y equitativa a la pregunta "¿quién le debe a quién?" reduciendo al mínimo las transferencias monetarias requeridas. En paralelo, se habilitó el registro de categorías personalizadas (**HU-12**) y se fortaleció la integridad de la base de datos limitando las descripciones a 120 caracteres tanto en frontend como en reglas de Firestore (**HU-13**).

| Métrica | Planificado | Obtenido | Estado |
|---|:---:|:---:|:---:|
| **Story Points (SP)** | 16 SP | 16 SP | ✅ 100% Cumplido |
| **Historias de Usuario** | 3 historias | 3 historias | ✅ 100% Terminadas |
| **Tareas Técnicas** | 8 tareas | 8 tareas | ✅ 100% Cerradas |
| **Suites de Pruebas QA** | 8 suites en `runner.js` | 8 aprobadas (100% PASS) | ✅ Certificado |
| **Deuda Técnica** | 0 bloqueantes | 0 pendientes | ✅ Saneada |

---

## 2. Registro Cronológico de Daily Scrums

### Daily 1 — Lunes, 19 de Octubre de 2026 (Semana 7)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer (Fin de semana):** Cierre y sustentación exitosa del Corte II con la docente Vilma Yenny Bohórquez. Planificación del Sprint 4.
- **Hoy:** Yerson Niño inicia la formulación del algoritmo de compensación de saldos en `src/utils/cuadre.js` (Tarea 11.1). Daniel Cortes revisa la estructura NoSQL para la colección `liquidaciones`.
- **Impedimentos:** Ninguno.

### Daily 2 — Miércoles, 21 de Octubre de 2026 (Semana 7)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Yerson completó la versión inicial del algoritmo codicioso (Greedy) para minimizar transferencias (máximo $N - 1$).
- **Hoy:** Daniel Cortes inicia la implementación de `src/services/liquidaciones.js` (Tarea 11.2) con oyente en tiempo real de gastos del mes y transacción atómica para marcar saldado. Jorman Palacios avanza en el contador dinámico de descripción (Tarea 13.1).
- **Impedimentos:** Necesidad de garantizar que no se cobren montos negativos ni divisiones por cero en hogares unipersonales.

### Daily 3 — Viernes, 23 de Octubre de 2026 (Semana 7)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Jorman integró el input de descripción con `maxlength="120"` y texto dinámico de caracteres restantes bajo el campo.
- **Hoy:** Yerson Niño arranca el servicio CRUD de categorías personalizadas en `src/services/categorias.js` (Tarea 12.1). Daniel valida que `firestore.rules` soporte el ID determinista `{hogarId}_{AAAA-MM}`.
- **Impedimentos:** Ninguno.

### Daily 4 — Lunes, 26 de Octubre de 2026 (Semana 8)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Revisión de código en rama principal y merge de avances de servicios.
- **Hoy:** Daniel Cortes incorpora las reglas de seguridad para `liquidaciones` y `categorias` en `firestore.rules` (Tarea 12.2). Juan Diego Peraza inicia la integración de categorías dinámicas en la interfaz.
- **Impedimentos:** Recordatorio al equipo para no mezclar versiones de Firebase SDK en las URLs de importación (mantener `10.13.0` homogéneo).

### Daily 5 — Miércoles, 28 de Octubre de 2026 (Semana 8)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Daniel y Jorman desplegaron la versión con cache-buster `v=8` en `app.js` e `index.html`.
- **Hoy:** Fabián Córdoba estructura la suite de pruebas unitarias e integración en `tests/pruebas-liquidaciones.test.js` (Tarea 11.4 y Tarea 13.2).
- **Impedimentos:** Ninguno. El runner maestro pasa a 8 suites automatizadas.

### Daily 6 — Viernes, 30 de Octubre de 2026 (Semana 8 - Cierre de Sprint 4)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer:** Ejecución completa de pruebas de regresión en `tests/runner.js`: 8 de 8 suites con 100% de éxito.
- **Hoy:** Celebración de la sesión de **Sprint Review y Retrospectiva de Sprint 4**. Consolidación de documentación y preparación del arranque de **Sprint 5** (31 de octubre de 2026).
- **Impedimentos:** Ninguno. Incremento de software listo y verificado.

---

## 3. Registro de Uso de Inteligencia Artificial en el Sprint 4

### 3.1 ¿Qué le pedimos a la IA?
1. Sugerencias de algoritmos óptimos para simplificación de deudas multipartitas en un grupo conviviente (problema de flujo de costo mínimo / emparejamiento Greedy).
2. Revisión de expresiones regulares RE2 para validar en `firestore.rules` que el ID del documento coincida con `{hogarId}_{AAAA-MM}`.
3. Asesoría para diseñar un contador de caracteres accesible (`aria-describedby`) sin saturar el DOM con re-renderizados innecesarios.

### 3.2 ¿Qué aceptamos?
- La implementación del algoritmo Greedy en `src/utils/cuadre.js`: ordena deudores y acreedores por balance residual y ejecuta transferencias bilaterales en $O(N \log N)$, garantizando como máximo $N - 1$ transferencias.
- La regla en `firestore.rules` que exige fecha exacta de servidor (`request.time`) y restringe a un máximo de 5 transferencias por liquidación mensual.
- La homogeneización de la biblioteca de Firestore SDK en la versión `10.13.0` para evitar duplicidad de instancias en memoria.

### 3.3 ¿Qué rechazamos y por qué?
1. **Librerías externas de simplificación de deudas (npm):** Se rechazó para respetar la directriz arquitectónica de cero dependencias externas de empaquetado en producción. La función pura nativa en `src/utils/cuadre.js` resuelve el caso de manera limpia en menos de 100 líneas.
2. **Permitir edición o reapertura de un mes saldado:** Se decidió que una liquidación guardada es inmutable por motivos de auditoría contable. Si se requiere ajustar, se crea una transacción correctiva en el mes en curso.

---

## 4. Retrospectiva del Sprint 4 (30 de Octubre de 2026)

**Facilitador:** Fabián Córdoba (Scrum Master) · **Fecha:** 30 de octubre de 2026  
**Participantes:** Juan Diego Peraza (PO), Fabián Córdoba (SM), Daniel Cortes (Dev), Jorman Palacios (Dev), Yerson Niño (Dev).

| ¿Qué funcionó bien? | ¿Qué dificultades se presentaron? | Acción de mejora para el Sprint 5 | Responsable |
|---|---|---|---|
| **Lógica Pura Desacoplada:** La creación de `src/utils/cuadre.js` como módulo puro permitió probar exhaustivamente el algoritmo con múltiples combinaciones sin depender de la base de datos. | **Formato de Fechas en Objetos:** Al recuperar documentos en tiempo real, algunos entornos entregaban objetos `Date` nativos y otros `Timestamp` con método `toDate()`, requiriendo normalización defensiva. | Estandarizar una función auxiliar transversal de conversión de fecha en `formateo.js` para todos los servicios de Firestore. | Daniel Cortes / Yerson Niño |
| **Alineación Cliente-Servidor:** La sincronización estricta del límite de 120 caracteres entre el input HTML, el modelo `Transaccion.js` y `firestore.rules` evitó errores de red inesperados. | **Diferencias de Versión en SDK:** Un commit incorporó accidentalmente Firebase `10.8.0` en `categorias.js` mientras el resto del sistema usaba `10.13.0`. | Establecer en la DoD una verificación obligatoria de versiones de CDN en todos los archivos que consuman Firebase. | Fabián Córdoba (Scrum Master) |
| **Crecimiento de la Suite QA:** Se incorporó la 8ª suite de pruebas (`pruebas-liquidaciones.test.js`) manteniendo el tiempo de ejecución del runner en menos de 1 segundo. | **Sincronización de Commits Remotos:** El trabajo en paralelo de compañeros requiere comunicación continua para evitar conflictos al rebasar ramas de desarrollo. | Realizar pull diario de `origin/main` antes de iniciar cada jornada de desarrollo local. | Todo el equipo |

> **Conclusión de la Retrospectiva:** El equipo completó satisfactoriamente los 16 Story Points del Sprint 4, alcanzando un total acumulado de **68 Story Points** en el proyecto. Con la funcionalidad de cuadre de cuentas entregada, el equipo se declara listo para iniciar el **Sprint 5 (31 de octubre al 13 de noviembre de 2026)** enfocado en auditoría de seguridad, pruebas de carga y reportes.
