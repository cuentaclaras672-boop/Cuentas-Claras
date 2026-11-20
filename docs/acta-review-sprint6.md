# Acta de Sprint Review — Sprint 6 y Cierre Semestral
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente / Evaluadora:** Vilma Yenny Bohórquez  
**Fecha de Emisión:** 18 de noviembre de 2026 (Hito de Sustentación Final: 21 de noviembre de 2026)  
**Periodo del Sprint 6:** 14 de noviembre al 27 de noviembre de 2026  
**Hito Asociado:** Cierre de Desarrollo, Cifrado AES-256-GCM, Despliegue y Sustentación Final Corte III  

---

## 1. Asistentes y Roles Scrum

| Integrante | Rol Scrum | Participación en el Sprint 6 y Cierre |
|---|---|---|
| **Juan Diego Peraza Amado** | Product Owner | Validación de criterios de aceptación de HU-16, HU-17 y HU-18, integración en UI de préstamos y edición/borrado de categorías, guía de sustentación Corte III y cierre documental. |
| **Fabián Eduardo Córdoba** | Scrum Master / QA Lead | Facilitación de cierre semestral, certificación de las **13 suites** en `tests/runner.js` (100% PASS) y auditoría estática de las 8 colecciones en `pruebas-seguridad-carga.test.js`. |
| **Daniel Felipe Cortes** | Development Team | Autoría e integración del cifrado AES-256-GCM de textos y montos (`src/utils/cifrado.js`, `src/services/claves.js`), reglas de 8 colecciones en `firestore.rules`, suite de 88 casos en emulador y configuración Hosting (`firebase.json`, `.firebaserc`, `docs/guia-despliegue.md`). |
| **Jorman Palacios Murillo** | Development Team | Componentes visuales de `#seccion-prestamos`, tarjeta `#resumen-por-cobrar`, controles de categorías personalizadas, indicador `#badge-cifrado` y validación UAT desktop/móvil. |
| **Yerson Niño Guerrero** | Development Team | Validación defensiva al descifrar en `prestamos.js`, `liquidaciones.js` y `categorias.js`, pruebas de exportación CSV con datos descifrados y soporte documental. |

---

## 2. Objetivo del Sprint (Sprint Goal)

> *"Incorporar cifrado extremo a extremo AES-256-GCM en el navegador para todos los textos y montos financieros antes de enviarlos a Firestore, completar la interfaz operativa de préstamos y categorías personalizadas, dejar lista la configuración de despliegue en Firebase Hosting y las 8 colecciones blindadas en `firestore.rules` (alcance evaluado: MVP funcional en local), y certificar las 13 suites QA y la guía de sustentación del Parcial Corte III (21 de noviembre de 2026)."*

**Resultado:** **CUMPLIDO AL 100% (21/21 Story Points entregados · 102/102 SP acumulados en el semestre · 18/18 Historias de Usuario terminadas)**.

---

## 3. Demostración del Incremento Final de Producto (Sprint Demo)

### 3.1 [HU-18] Seguridad de los datos mediante cifrado AES-256-GCM en cliente (8 SP · Prioridad 1)
- **Componentes Entregados:**
  - [`src/utils/cifrado.js`](../src/utils/cifrado.js): Cifrado simétrico **AES-256-GCM** usando la Web Crypto API nativa (`crypto.subtle`) sin librerías externas. Formato `enc:v1:<iv_base64>:<ciphertext_gcm_base64>`, con IV aleatorio de 96 bits en cada operación y el nombre del campo como dato autenticado adicional (**AAD**).
  - [`src/services/claves.js`](../src/services/claves.js): Gestión de claves por usuario (`clavesUsuario/{uid}`) y por hogar (`clavesHogar/{codigo}`), generadas con `runTransaction` para evitar colisiones entre pestañas, copia de respaldo de claves de hogar y limpieza de memoria al cerrar sesión (`limpiarClavesEnMemoria()` en [`src/services/auth.js`](../src/services/auth.js)).
  - **Cifrado de textos y montos en servicios:** [`src/services/firestore.js`](../src/services/firestore.js) (`descripcion`, `monto`, `categoria`, `nombreUsuario` en transacciones; `nombre`, `meta`, `montoAcumulado` en bolsillos con `runTransaction`), [`src/services/prestamos.js`](../src/services/prestamos.js) (`deudor`, `monto`, `nota`, `totalAbonado`, `abonos[].monto`), [`src/services/liquidaciones.js`](../src/services/liquidaciones.js) (`transferencias`) y [`src/services/categorias.js`](../src/services/categorias.js) (`nombre`).
  - **Validación defensiva al leer:** Si un documento fue alterado en consola o contiene datos fuera de rango tras descifrar, se omite individualmente sin afectar el resto de la lista; los registros antiguos sin cifrar siguen leyéndose con retrocompatibilidad.
  - [`firestore.rules`](../firestore.rules): Reglas endurecidas en **8 colecciones** exigiendo `esCifrado`, `esNumeroCifrado` y `esClaveAes`, más inmutabilidad de claves.
  - [`tests/pruebas-cifrado.test.js`](../tests/pruebas-cifrado.test.js) y [`tests/emulador/auditoria-reglas.mjs`](../tests/emulador/auditoria-reglas.mjs) (**88 casos**).
- **Resultado:** Aprobada al 100% por el Product Owner.

### 3.2 [HU-16] Preparación de despliegue en Firebase Hosting, completitud UI y endurecimiento operativo (8 SP · Prioridad 1)
- **Componentes Entregados:**
  - [`firebase.json`](../firebase.json), [`.firebaserc`](../.firebaserc), [`package.json`](../package.json) y [`docs/guia-despliegue.md`](guia-despliegue.md): Configuración declarativa lista para Hosting y `firestore:rules` en el proyecto `bdcuentasclaras-b1814` (alcance evaluado: MVP en local; publicación web pendiente como un único comando de despliegue), cabeceras de seguridad (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Cache-Control: no-cache`) y guía paso a paso de restricción de API Key.
  - [`public/index.html`](../public/index.html), [`src/ui/dashboard.js`](../src/ui/dashboard.js) y [`src/app.js`](../src/app.js):
    - Tarjeta de resumen **Por Cobrar** (`#resumen-por-cobrar`) y sección interactiva **Préstamos a Terceros (`#seccion-prestamos`)** con filtro por estado (`TODOS`, `PENDIENTE`, `SALDADO`), registro de préstamo, abonos parciales y eliminación.
    - Botones **Editar (`#btn-editar-categoria`)** y **Borrar (`#btn-eliminar-categoria`)** junto a `+ Nueva` para gestionar categorías personalizadas directamente desde la interfaz (`CA-12.3`).
    - Indicador visual **`AES-256-GCM` (`#badge-cifrado`)** en la barra de navegación superior.
- **Resultado:** Aprobada al 100% por el Product Owner.

### 3.3 [HU-17] Preparación de sustentación técnica integral y auditoría final de cierre (5 SP · Prioridad 2)
- **Componentes Entregados:**
  - [`docs/guia-sustentacion-corte3.md`](guia-sustentacion-corte3.md): Guía maestra para la sustentación final del 21 de noviembre (mapa de las 18 HUs, defensa del cifrado AES-256-GCM, cuadre Greedy, resiliencia y simulacros de modificación de código en vivo).
  - [`docs/informe-pruebas-sprint6.md`](informe-pruebas-sprint6.md) y sincronización total de `README.md`, `docs/sprint-goals.md`, `docs/definition-of-done.md` y actas S1–S6.
- **Resultado:** Aprobada al 100% por el Product Owner.

---

## 4. Métricas Finales del Sprint 6 y del Proyecto Completo (Sprints 1–6)

| Métrica | Sprint 6 | Acumulado Semestral (S1–S6) | Estado |
|---|:---:|:---:|:---:|
| **Historias de Usuario (HU)** | 3 / 3 (`HU-16`, `HU-17`, `HU-18`) | **18 / 18 Historias Terminadas** | ✅ 100% |
| **Story Points (SP)** | 21 / 21 SP | **102 / 102 SP Certificados** | ✅ 100% |
| **Tareas del Sprint Backlog** | 9 / 9 tareas | **62 / 62 tareas cerradas** | ✅ 100% |
| **Suites en `tests/runner.js`** | 13 / 13 aprobadas | **13 / 13 Suites (100% PASS · 0 warnings)** | ✅ 100% |
| **Casos en Emulador Firestore** | 88 / 88 casos | **88 casos en 8 colecciones** | ✅ Verificado |
| **Siete Condiciones Técnicas** | 7 / 7 consolidadas | **7 / 7 Cumplidas al 100%** | ✅ Certificado |

---

## 5. Declaración de Cierre del Proyecto

1. El Product Owner acepta formalmente el incremento del Sprint 6 y declara completado el 100% del Product Backlog (**18 Historias de Usuario · 102 Story Points**).
2. El equipo queda listo para presentar el **Parcial Corte III y Sustentación Final el 21 de noviembre de 2026** ante la docente **Vilma Yenny Bohórquez**.
