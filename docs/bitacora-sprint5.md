# Bitácora de Seguimiento — Sprint 5
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Product Owner:** Juan Diego Peraza Amado  
**Periodo:** 31 de octubre al 13 de noviembre de 2026 (2 semanas)  

---

## 1. Resumen Ejecutivo del Sprint 5

El Sprint 5 consolidó la fase de endurecimiento de seguridad, resiliencia ante caídas de red, pruebas de carga concurrente (**HU-14**) y portabilidad financiera mediante exportación CSV RFC 4180 y vista imprimible a PDF (**HU-15**), junto con los acuerdos técnicos heredados de la Retrospectiva del Sprint 4 (normalización única de fechas `normalizarFecha` y homogeneidad del SDK Firebase `10.13.0`).

| Métrica | Planificado | Resultado Final del Sprint |
|---|:---:|:---:|
| **Story Points (SP)** | 13 SP | ✅ **13 SP Cumplidos (100%)** |
| **Historias de Usuario** | 2 historias (HU-14 y HU-15) | ✅ **2 / 2 Terminadas (Done)** |
| **Tareas Técnicas** | 6 tareas | ✅ **6 / 6 Cerradas** |
| **Suites Automatizadas (`runner.js`)** | 12 suites totales | ✅ **12 / 12 Aprobadas (100% PASS)** |
| **Auditoría en Emulador Firebase** | Batería negativa + positiva en 6 colecciones | ✅ **46 casos ejecutados (40 ataques bloqueados + 6 flujos legítimos)** |
| **Fecha de Inicio** | 31 de octubre de 2026 | ✅ Cumplida |
| **Fecha de Cierre** | 13 de noviembre de 2026 | ✅ Cerrado (consolidación final en `main`: 14 nov) |

---

## 2. Registro Cronológico de Daily Scrums

### Daily 1 — Sábado, 31 de Octubre de 2026 (Kick-off de Sprint 5)
- **Facilitador:** Fabián Córdoba (Scrum Master).
- **Ayer (Viernes 30 de Octubre):** Cierre formal del Sprint 4 con 16/16 SP cumplidos, integración de `liquidaciones.js` (HU-11), `categorias.js` (HU-12) y control estricto de descripción de 120 caracteres (HU-13). Ejecución de 9/9 suites de pruebas QA al 100%.
- **Hoy:**
  - Apertura formal del Sprint 5 en el tablero Miro.
  - Daniel Cortes inicia la auditoría de seguridad de `firestore.rules` (Tarea 14.1) verificando que las 6 colecciones apliquen reglas cerradas contra accesos anónimos.
  - Yerson Niño comienza el diseño del módulo de exportación CSV en `src/utils/exportador.js` (Tarea 15.1) garantizando cumplimiento de RFC 4180.
  - Juan Diego Peraza valida la sincronización de commits de Sprint 4, corrige detalles de documentación y refuerza la trazabilidad del cierre de Sprint 4.
- **Impedimentos:** Ninguno.

### Daily 2 — Lunes, 02 de Noviembre de 2026
- **Facilitador:** Fabián Córdoba.
- **Avance:** Al probar el arranque integral del dashboard tras el cierre de Sprint 4, se detectó que `inicializarDashboardUI` invocaba `cargarCategoriasUsuario()` e `inicializarLiquidacionesUI()` sin estar conectadas al DOM completo tras un refactory previo.
- **Hoy:** Daniel Cortes toma la corrección prioritaria de `src/ui/dashboard.js` para cablear categorías y liquidaciones sin romper la arquitectura SoC, mientras avanza con la matriz de vectores de ataque sobre las 6 colecciones.
- **Impedimentos:** Posible error `ReferenceError` en runtime si se interactuaba con liquidaciones/categorías antes de completar el cableado. Resuelto en Daily 3.

### Daily 3 — Martes, 03 de Noviembre de 2026
- **Facilitador:** Fabián Córdoba.
- **Avance:** Daniel Cortes publica el commit `321b5f6` completando `cargarCategoriasUsuario()` e `inicializarLiquidacionesUI()` en `src/ui/dashboard.js` (restaurando la operativa de HU-11 y HU-12 en interfaz).
- **Hoy:**
  - Daniel revisa campos sin restricción de tamaño en `firestore.rules` (`bolsillos.nombre`, `hogares.nombres`, `prestamos`, etc.).
  - Yerson define las cabeceras oficiales del CSV (`Fecha, Descripcion, Monto, Tipo, Ambito, Categoria, Autor`) y la estrategia de escape RFC 4180 + BOM UTF-8 (`\uFEFF`) para compatibilidad directa con Excel en Windows.
- **Impedimentos:** Ninguno.

### Daily 4 — Viernes, 06 de Noviembre de 2026 (Corte Semana 9)
- **Facilitador:** Fabián Córdoba.
- **Avance:** Mapeadas 13 brechas de validación y escalación de privilegios en `firestore.rules` (incluyendo unificación del límite mínimo/máximo de nombre de bolsillo a 3–40 caracteres entre `Bolsillo.js`, `public/index.html` y las reglas de servidor).
- **Hoy:**
  - Se estructura la suite negativa/positiva en `tests/emulador/auditoria-reglas.mjs` usando `@firebase/rules-unit-testing` sobre el emulador local de Firestore.
  - Se definen los escenarios de degradación elegante ante cortes de red (`ErrorSinConexion`, `asegurarConexion`, `conReintentos` para fallos `unavailable` y `aborted`).
- **Impedimentos:** La ejecución del emulador de Firestore requiere Java instalado localmente en la máquina donde corre el test de reglas.

### Daily 5 — Lunes, 09 de Noviembre de 2026
- **Facilitador:** Fabián Córdoba.
- **Avance:** Se inicia la integración de `src/services/conexion.js` con políticas de reintento exponencial (`conReintentos`) sobre los cinco servicios de persistencia (`firestore.js`, `hogares.js`, `liquidaciones.js`, `prestamos.js`, `categorias.js`).
- **Hoy:**
  - Fabián diseña la batería de carga de 50 operaciones concurrentes y verificación estática de `firestore.rules` en `tests/pruebas-seguridad-carga.test.js` (Tarea 14.2), junto con el cumplimiento de **Ancla 1** (`normalizarFecha` en `src/utils/formateo.js`).
  - Jorman y Juan Diego preparan los controles de exportación en la barra de herramientas del historial y las reglas `@media print` en `public/style.css` (Tareas 15.2 y 15.3).
- **Impedimentos:** Ninguno.

### Daily 6 — Viernes, 13 de Noviembre de 2026 (Cierre Técnico de Sprint 5 y Consolidación en `main` el 14 de Noviembre)
- **Facilitador:** Daniel Cortes y Juan Diego Peraza.
- **Avance consolidado:**
  - El 13 de noviembre Daniel Cortes integra los commits `82b0c90`, `a1f7ccd`, `79315bd` y `2f0638f`: culmina **Tarea 14.1** (`firestore.rules` endurecido, `tests/emulador/auditoria-reglas.mjs` con 46/46 casos aprobados en emulador y `docs/auditoria-seguridad-sprint5.md`), **Tarea 14.3** (`conReintentos` / `asegurarConexion` en `conexion.js`, 5 servicios actualizados y Suite #10 `tests/pruebas-resiliencia.test.js`), y adelanta configuración de despliegue para Sprint 6 (`.firebaserc`, `firebase.json`, `docs/guia-despliegue.md`).
  - En la sesión de cierre y consolidación de la rama `main` (13–14 nov, previa al arranque oficial de Sprint 6), Juan Diego Peraza completa e integra las tareas restantes del Sprint 5:
    - **Compromiso Retro S4 (Anclas 1 y 2):** Implementa `normalizarFecha()` en `src/utils/formateo.js` (reutilizada en `liquidaciones.js`, `exportador.js` y `dashboard.js`) y formaliza la regla de homogeneidad Firebase SDK `10.13.0` en `docs/definition-of-done.md`.
    - **Tarea 14.2:** Crea e integra `tests/pruebas-seguridad-carga.test.js` (auditoría estática de 6 colecciones + ráfaga de 50 peticiones atómicas en `< 500 ms` + idempotencia de cierres + pruebas de `normalizarFecha`).
    - **HU-15 (Tareas 15.1, 15.2 y 15.3):** Implementa `src/utils/exportador.js`, botones `#btn-exportar-csv` e `#btn-imprimir-reporte` operando sobre `obtenerTransaccionesFiltradas()` (incluso en modo offline), estilos `@media print` + banner `.only-print` en `public/index.html` y `public/style.css`, y la Suite #12 `tests/pruebas-exportador.test.js`.
- **Resultado QA Final de Sprint 5:** `node tests/runner.js` ejecutado tras la consolidación completa reportando **12 de 12 suites aprobadas (100% PASS)**.

---

## 3. Registro de Uso de IA Generativa y Decisiones Técnicas (Sprint 5)

| Fecha | Herramienta / Uso | Propósito y Supervisión Humana |
|---|---|---|
| **03–13 nov** | Asistente de programación IA | Revisión cruzada de vectores de escalación en `firestore.rules`, diseño de casos negativos para `auditoria-reglas.mjs` y ajuste de backoff transitorio en `conReintentos`. Todo verificado manualmente y con emulador local. |
| **13–14 nov** | Asistente de programación IA | Generación asistida del serializador CSV RFC 4180 (`exportador.js`), reglas `@media print` en `style.css`, suite de concurrencia (`pruebas-seguridad-carga.test.js`) y consolidación documental de Sprint 5 y arranque de Sprint 6. Validado íntegramente mediante `node -c` y `node tests/runner.js` (12/12 PASS). |

---

## 4. Burndown del Sprint 5 (Medido en Tareas Técnicas)

Total de tareas comprometidas en Sprint 5 Planning: **6 tareas base** (`14.1`, `14.2`, `14.3`, `15.1`, `15.2`, `15.3`) más el anexo de configuración CLI **14.4** adelantado por Daniel Cortes (cierre en servidor vinculado a Tarea 16.3).

### Distribución y Trazabilidad de Responsables en Sprint 5
- **Daniel Felipe Cortes:** Tareas `14.1` (auditoría `firestore.rules` y emulador), `14.3` (módulo `conexion.js` y reintentos) y `14.4` (preparación CLI para despliegue de reglas).
- **Fabián Eduardo Córdoba:** Tarea `14.2` (diseño QA de carga/estrés y supervisión del runner maestro en `tests/runner.js`).
- **Yerson Niño Guerrero:** Tarea `15.1` (especificación RFC 4180 para exportación CSV).
- **Jorman Palacios Murillo:** Tarea `15.2` (diseño UI de botones de exportación y limpieza en impresión).
- **Juan Diego Peraza Amado:** Tarea `15.3` (`@media print` en `public/style.css`), implementación/consolidación en `main` de `14.2`, `15.1` y `15.2` (`exportador.js`, `pruebas-exportador.test.js`, `pruebas-seguridad-carga.test.js`) y `normalizarFecha()` (Ancla 1).

| Semana | Corte | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| **Inicio** | 31 oct 2026 | 6 | 6 | 6 |
| **Semana 9** | 06 nov 2026 | 3 | 3 | 3 |
| **Semana 10 (Cierre)** | 13–14 nov 2026 | 0 | 0 | **0 (100% Cerrado)** |

---

## 5. Retrospectiva del Sprint 5 — Dinámica del Barco (13 de Noviembre de 2026)

**Facilitación:** Fabián Eduardo Córdoba (Scrum Master), Juan Diego Peraza (Product Owner) y Daniel Felipe Cortes (Development Team).  
**Equipo completo participante:** Juan Diego Peraza, Fabián Córdoba, Daniel Cortes, Jorman Palacios, Yerson Niño.

### 5.1 Lienzo de la Dinámica del Barco (Sailboat)

- **🏝️ LA ISLA (Visión hacia Sprint 6 y Sustentación Final del 21 de Noviembre):**
  - Entregar **Cuentas Claras** desplegada públicamente en Firebase Hosting (`https://bdcuentasclaras-b1814.web.app`), con reglas publicadas en producción, 0 errores en consola y sustentación técnica sólida en el Parcial Corte III (21/11/2026).
- **☀️ EL SOL (Reconocimientos / Energía del Equipo):**
  - Alcanzar **81 Story Points acumulados** en 5 sprints consecutivos (15 + 21 + 16 + 16 + 13) con **12 suites QA** al 100% en `runner.js` más **46 pruebas reales en emulador de Firestore**.
  - Cumplir los dos acuerdos técnicos principales de la Retrospectiva del Sprint 4 (`normalizarFecha` transversal y regla SDK `10.13.0` en la DoD).
- **💨 EL VIENTO EN LAS VELAS (¿Qué nos impulsó en el Sprint 5?):**
  - **Adelanto proactivo de infraestructura (`firebase.json`, `.firebaserc`, `docs/guia-despliegue.md`):** Permitió cerrar Sprint 5 dejando el terreno listo para el despliegue inmediato en Sprint 6.
  - **Desacoplamiento SoC en `exportador.js`:** Separar el serializador CSV del DOM permitió probar RFC 4180, BOM UTF-8 e inyección de fórmulas directamente en Node sin depender del navegador.
  - **Offline útil sin frustración:** Mientras `aplicarEstadoConexion()` bloquea escrituras riesgosas en red caída, los botones de exportación CSV e impresión PDF permanecen activos porque operan sobre la memoria filtrada local.
- **⚓ LAS ANCLAS (¿Qué nos frenó o dificultó el avance?):**
  - **Ancla 1 — Aviso de baja de Firebase Dynamic Links en Consola Auth:** La consola de Firebase emitió alerta de fin de soporte para Dynamic Links en vínculos de correo móvil y OAuth de Cordova; obligó a auditar `src/services/auth.js` para confirmar que nuestro flujo web estándar (`createUserWithEmailAndPassword` / `signInWithEmailAndPassword`) no depende de Dynamic Links.
  - **Ancla 2 — Dependencia local de Java y `node_modules` en `tests/emulador/`:** Al excluirse `node_modules` del repositorio por buenas prácticas Git, cada máquina nueva requiere ejecutar `npm install` dentro de `tests/emulador/` antes de lanzar las pruebas contra el emulador.
  - **Ancla 3 — Integración tardía de artefactos de cierre:** Varias piezas de código y actas de HU-15 se consolidaron sobre el límite de cierre (13–14 nov), exigiendo sincronización estrecha para arrancar Sprint 6 con la rama limpia.
- **🪨 LAS ROCAS / ICEBERGS (Riesgos que vemos hacia el Sprint 6 y el 21 de Noviembre):**
  - **Roca 1:** Reglas nuevas en Firebase Console sin publicar manualmente tras los cambios de `firestore.rules` (riesgo de `permission-denied` o reglas desactualizadas en producción).
  - **Roca 2:** Dominios autorizados en Firebase Auth o restricciones HTTP de la API Key que bloqueen el dominio `.web.app` / `.firebaseapp.com` durante la demo en vivo.
  - **Roca 3:** Que no se valide el flujo completo CSV + PDF + Cuadre en navegador móvil y escritorio sobre la URL desplegada antes del 21 de noviembre.

### 5.2 Plan de Acción de Mejora Continua (El Timón hacia el Sprint 6)

| Hallazgo del Barco | Acción Concreta Verificable en Sprint 6 | Artefacto / Módulo Asociado | Responsable |
|---|---|---|---|
| **⚓ Ancla 1:** Alerta Dynamic Links en Auth | Documentar en Sprint 6 que `auth.js` usa exclusivamente correo/contraseña web estándar (sin enlaces dinámicos ni Cordova) y verificar estado limpio de Auth. | `docs/acta-planning-sprint6.md` y Consola Firebase | Daniel Cortes / Juan Diego Peraza |
| **🪨 Roca 1 y 2:** Publicación de reglas y Hosting | Ejecutar checklist de `docs/guia-despliegue.md`: publicar `firestore.rules`, desplegar Hosting y restringir API Key a los dominios reales en Google Cloud. | `.firebaserc`, `firebase.json`, `docs/guia-despliegue.md` | Daniel Cortes / Juan Diego Peraza |
| **🪨 Roca 3:** Validación integral UAT | Ejecutar protocolo de pruebas de aceptación de extremo a extremo sobre la URL de producción y preparar guion de sustentación final para el 21/11/2026. | `docs/bitacora-sprint6.md` | Todo el equipo |
