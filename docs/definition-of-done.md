# Definición de Preparado (DoR) y Definición de Terminado (DoD)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Estándar de Calidad y Gobierno Ágil del Equipo Scrum**

Este documento establece los acuerdos oficiales del equipo para determinar cuándo una Historia de Usuario está lista para entrar a un sprint (**Definition of Ready — DoR**) y cuándo cumple todos los criterios de ingeniería para considerarse entregada (**Definition of Done — DoD**).

---

## 📋 1. Definición de Preparado (Definition of Ready — DoR)

Para que una Historia de Usuario (HU) sea aceptada en el Sprint Planning e incorporada al Sprint Backlog, debe cumplir obligatoriamente con el estándar **INVEST** y los siguientes criterios de preparación:

- [x] **Formato Estándar de Usuario:** La historia está redactada en la estructura canónica:  
  *Como [rol de usuario en el hogar], quiero [acción o funcionalidad], para [beneficio tangible o valor de negocio].*
- [x] **Criterios de Aceptación Claros y Testeables:** Cuenta con criterios de aceptación explícitos, numerados y medibles, redactados sin ambigüedad y acordados entre el Product Owner y el equipo de desarrollo.
- [x] **Prioridad Asignada y Justificada:** La prioridad (1 a 4 / Alta / Crítica) está explícita, fundamentada en su aporte al Product Goal o su correspondencia con una de las **Siete Condiciones Técnicas Obligatorias** de la asignatura.
- [x] **Estimación en Story Points:** La historia ha sido dimensionada por el equipo mediante Planning Poker o consenso de tallas (S = 3 a 5 SP, M = 8 SP), respetando la capacidad del sprint.
- [x] **Desglose en Tareas Técnicas:** La historia está descompuesta en tareas atómicas con responsable asignado y fechas planificadas que no excedan el límite de trabajo en progreso (WIP).
- [x] **Dependencias y Viabilidad Resueltas:** Se verificó que los servicios externos (Firebase SDK, APIs públicas) o datos previos requeridos estén disponibles antes de iniciar el desarrollo.
- [x] **Interfaz o Flujo Acordado:** Se cuenta con un wireframe, boceto o acuerdo de diseño visual en Tailwind CSS validado antes de codificar.

---

## ✅ 2. Definición de Terminado (Definition of Done — DoD)

Para que una Historia de Usuario, funcionalidad o tarea se considere **TERMINADA (DONE)** y apta para la sustentación ante el docente evaluador, debe cumplir estrictamente con los siguientes estándares:

### 2.1 Arquitectura y Diseño de Software
- [x] **Separación Estricta de Responsabilidades (SoC):**
  - `src/models/`: Clases de dominio con validación interna (`validar()`) y métodos de serialización (`aFirestore()`, `desdeFirestore()`).
  - `src/services/`: Capa de infraestructura y conexión con Firebase/APIs externas. **Prohibido manipular el DOM o acceder a elementos HTML desde esta capa.**
  - `src/ui/`: Capa de presentación que manipula el DOM y consume servicios. **Prohibido realizar llamadas directas al SDK de Firebase desde la UI.**
  - `src/utils/`: Funciones puras e independientes de formateo de moneda, fechas y sanitización.
- [x] **Sin Monolitos:** Código modular en Vanilla JS con ES6 Modules nativos (`import`/`export`), sin empaquetadores pesados ni dependencias ocultas.

### 2.2 Persistencia e Integridad de Datos
- [x] **Persistencia Real:** Toda información financiera se almacena de forma asíncrona en Cloud Firestore.
- [x] **Prohibición de Datos Financieros en Memoria/LocalStorage:** Prohibido usar `localStorage` o variables globales volátiles para balances, bolsillos o transacciones.
- [x] **Aislamiento de Seguridad en Backend:** Reglas en `firestore.rules` que validan en servidor que solo el usuario autenticado (`request.auth.uid`) pueda leer, crear o mutar sus datos, impidiendo reasignaciones no autorizadas.

### 2.3 Resiliencia y Manejo Visible de Errores
- [x] **Manejo Visible de Errores:** Todos los bloques `try/catch` capturan fallos y los proyectan al usuario mediante el sistema de Toasts (`src/ui/notificaciones.js`) o mensajes por campo.
- [x] **Cero Pantallas en Blanco:** Ante caídas de red, valores nulos o peticiones rechazadas, la aplicación se recupera y mantiene la interfaz operable.
- [x] **Código Defensivo y Sanitización:** Validación preventiva de tipos y rangos numéricos. Sanitización con `escaparHTML` para blindar la UI contra vulnerabilidades XSS.

### 2.4 Calidad de Código y Mantenibilidad
- [x] **Documentación JSDoc:** Todas las funciones, métodos y clases cuentan con tipado `@param`, `@returns`, `@throws` y descripciones claras.
- [x] **Código Limpio:** Nombres descriptivos en español, sin números mágicos y sin `console.log` de depuración en producción.
- [x] **Facilidad de Sustentación:** Código estructurado de forma que cualquier cambio en vivo solicitado por el docente evaluador pueda ubicarse y ejecutarse en menos de 2 minutos.

### 2.5 Pruebas y Verificación en Vivo
- [x] **Cero Errores de Consola:** La aplicación corre localmente en el navegador (`Live Server` o servidor HTTP) sin ningún error ni advertencia en DevTools (F12 en ceros).
- [x] **Criterios de Aceptación 100% Verificados:** Cada criterio de aceptación de la historia fue probado manualmente por el Scrum Master o encargado de QA.

### 2.6 Control de Versiones (Git y GitHub)
- [x] **Commits Semánticos:** Registro de cambios con prefijos convencionales (`feat:`, `fix:`, `docs:`, `refactor:`) en la rama `main`.
- [x] **Trazabilidad de Autoría:** Commits distribuidos en el tiempo evidenciando la contribución individual de los integrantes del equipo.
