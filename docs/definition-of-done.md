# Definición de Terminado (Definition of Done — DoD)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Estándar de Calidad de Ingeniería de Software**

Para que cualquier Historia de Usuario, funcionalidad o tarea se considere **TERMINADA (DONE)** y lista para sustentación, debe cumplir rigurosamente con los siguientes criterios:

---

## 1. Arquitectura y Diseño de Software
- [x] **Separación Estricta de Capas:**
  - `src/services/`: Única capa autorizada para comunicarse con Firebase SDK (Auth y Firestore). Prohibido acceder al DOM.
  - `src/models/`: Estructuras de dominio con validación de negocio interna y métodos de serialización.
  - `src/ui/`: Capa de presentación y manipulación del DOM. Consume servicios y modelos.
  - `src/utils/`: Funciones puras e independientes de formateo y validación general.
- [x] **Sin Monolitos:** Prohibido consolidar lógica en un único archivo `app.js`. La modularización ES6+ debe respetarse.

## 2. Persistencia e Integridad de Datos
- [x] **Persistencia Real en Firestore:** Toda transacción financiera debe almacenarse asíncronamente en Cloud Firestore.
- [x] **Prohibición de Datos Financieros en Memoria/LocalStorage:** LocalStorage queda restringido exclusivamente a estado de sesión o preferencias si fuera necesario; nunca saldos ni transacciones.

## 3. Resiliencia y Manejo de Errores
- [x] **Manejo Visible de Errores:** Todos los bloques `try/catch` deben capturar excepciones de red, validación o base de datos y delegar su presentación al módulo de Toasts (`src/ui/notificaciones.js`).
- [x] **No Pantallas en Blanco:** Bajo ninguna circunstancia el usuario debe quedar atrapado en pantallas congeladas o estados inconsistentes.
- [x] **Código Defensivo:** Validación de tipos, nulos y rangos antes de invocar cualquier llamada de red.

## 4. Calidad de Código y Mantenibilidad
- [x] **Documentación JSDoc:** Todas las funciones, métodos y clases cuentan con tipado `@param`, `@returns` y descripción de propósito.
- [x] **Código Limpio:** Nombres de variables autodescriptivos en español, sin números mágicos ni logs innecesarios en producción.
- [x] **Sustentación en Vivo:** El código está estructurado de modo que cualquier cambio solicitado por el docente evaluador pueda localizarse y modificarse en menos de 2 minutos.

## 5. Control de Versiones (Git)
- [x] Commits semánticos (`feat:`, `fix:`, `docs:`, `refactor:`) en la rama `main`.
- [x] Repositorio remoto sincronizado en GitHub sin conflictos de ramas ni referencias.
