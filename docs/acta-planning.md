# Acta de Sprint Planning — Sprint 1
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Metodología:** Scrum / Ágil  
**Duración del Sprint:** 2 semanas (semanas 3 y 4, del 17 al 29 de agosto de 2026). La semana 5 (31 ago - 5 sep) se usó para pruebas finales antes de la sustentación.  
**Cierre y Aprobación:** Sustentación 1 (5 de septiembre de 2026, Grupo 2 - sábado)  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad Principal |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Priorización del Backlog, definición de valor de negocio y validación de criterios de aceptación. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilitación de ceremonias ágiles, remoción de impedimentos y cumplimiento de la Definition of Done. |
| **Development Team** | Daniel Felipe Cortes | Integración con servicios de Firebase y persistencia NoSQL. |
| **Development Team** | Jorman Palacios Murillo | Capa de presentación (UI/UX) con Tailwind CSS y componentes visuales. |
| **Development Team** | Yerson Niño Guerrero | Capa de dominio, modelos de datos y programación defensiva. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Construir e integrar la arquitectura base por capas de Cuentas Claras, implementando el flujo completo de autenticación de usuarios con Firebase Auth y la persistencia en tiempo real de transacciones (ingresos/gastos personales y compartidos) en Cloud Firestore, con cálculo consolidado de saldo líquido."*

---

## 3. Historias de Usuario Seleccionadas (Sprint Backlog)

Todas las historias del Sprint 1 están estimadas en **talla pequeña (S)** para dar cumplimiento estricto a las reglas de alcance de la asignatura (máximo 3 historias, todas de talla pequeña y al menos una con persistencia real). Cada historia incorpora su Definición de Preparado (DoR), Criterios de Aceptación, Definición de Terminado (DoD) y Prioridad explícita.

---

### [HU-01] Autenticación y Control de Acceso
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 1 (Alta / Bloqueante)
- **Condición técnica obligatoria:** #2 (Sesión o Control de Acceso).
- **Descripción:** Como usuario del hogar, quiero registrarme e iniciar sesión con mi correo electrónico y contraseña, para proteger la privacidad de mis finanzas y acceder a mis movimientos de forma segura.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia estructurada en formato canónico de usuario con rol, acción y beneficio claro.
- [x] Criterios de aceptación detallados y consensuados entre Product Owner y el equipo de desarrollo.
- [x] Estimación aprobada en 5 SP (talla S) en la sesión de Planning.
- [x] Proyecto creado en Firebase Console con proveedor de Email/Password habilitado.
- [x] Tareas técnicas identificadas con responsables, fechas y alcance atómico.
- [x] Maquetación preliminar acordada para alternancia entre vista de Login y Registro.

#### • Criterios de Aceptación
- **CA-1.1:** El formulario valida preventivamente que el correo tenga formato válido (`usuario@dominio.ext`) y la contraseña al menos 6 caracteres antes de consultar la red.
- **CA-1.2:** Creación e inicio de sesión gestionados mediante Firebase Authentication SDK v10 de forma asíncrona.
- **CA-1.3:** La sesión permanece activa ante recargas de página mediante el observador `onAuthStateChanged()`.
- **CA-1.4:** Al hacer clic en "Salir", la sesión se destruye en Firebase (`signOut`), se cancela la suscripción en tiempo real y la interfaz conmuta a la pantalla de acceso sin dejar datos residuales.
- **CA-1.5:** Errores de autenticación (credenciales inválidas, correo repetido, red caída) se traducen a español y se notifican mediante Toasts flotantes.

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-1.1 a CA-1.5) verificados manualmente en navegador.
- [x] Lógica de red aislada en `src/services/auth.js` sin tocar el DOM; manipulación de interfaz delegada a `src/ui/ui-auth.js`.
- [x] Manejo de errores defensivo con `try/catch` y Toasts visibles (cero pantallas congeladas).
- [x] Documentación JSDoc completa en todas las funciones del servicio (`@param`, `@returns`, `@throws`).
- [x] Código limpio: sin `console.log` de depuración residuales en producción.
- [x] Verificado en consola de DevTools (F12) corriendo sin errores ni advertencias.
- [x] Commits semánticos registrados en GitHub en la rama `main`.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Periodo | Estado |
|---|---|---|:---:|:---:|
| **1.1** | Configurar credenciales y SDK Firebase | Juan Diego Peraza | 18 ago - 21 ago | **Done** |
| **1.2** | Diseñar formulario visual de Login en HTML/Tailwind | Juan Diego Peraza | 20 ago - 23 ago | **Done** |
| **1.3** | Lógica de autenticación con Firebase Auth | Juan Diego Peraza | 23 ago - 27 ago | **Done** |
| **1.4** | Persistencia de sesión y logout | Juan Diego Peraza | 27 ago - 30 ago | **Done** |

---

### [HU-02] Registro de Transacciones con Persistencia Real
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Alta / Crítica)
- **Condición técnica obligatoria:** #1 (Persistencia Real en base de datos NoSQL).
- **Descripción:** Como miembro del hogar, quiero registrar ingresos y gastos con descripción, monto, tipo, ámbito y categoría, para almacenarlos de forma permanente en la nube y consultarlos en cualquier momento.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia estructurada y alineada con la meta de persistencia del Sprint 1.
- [x] Entidad de dominio `Transaccion` especificada con tipos de datos, categorías y reglas de validación.
- [x] Base de datos Cloud Firestore inicializada con la colección `transacciones`.
- [x] Estimación consensuada en 5 SP (talla S) por el equipo.
- [x] Formulario de captura diseñado en Tailwind CSS con campos obligatorios identificados.
- [x] Reglas iniciales de seguridad planificadas para restringir accesos no autorizados.

#### • Criterios de Aceptación
- **CA-2.1:** Todo movimiento se persiste de forma asíncrona en Cloud Firestore en la colección `transacciones`. Prohibido el uso de `localStorage` para montos financieros.
- **CA-2.2:** Validación de negocio: la descripción debe tener al menos 3 caracteres y el monto debe ser un número estrictamente mayor a 0 ($ > 0$).
- **CA-2.3:** El selector de categorías se adapta dinámicamente según el tipo elegido (Ingreso o Gasto).
- **CA-2.4:** Cada registro almacena el UID del creador (`creadoPor`), nombre del usuario y la marca de tiempo oficial (`fecha`).
- **CA-2.5:** Reglas de seguridad en `firestore.rules` validan en backend que solo el autor pueda crear registros a su nombre.

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-2.1 a CA-2.5) probados; los datos sobreviven al cierre del navegador y refresco (F5).
- [x] Modelo `Transaccion.js` implementado en `src/models/` con método `validar()` y serializador `aFirestore()`.
- [x] Operaciones de inserción encapsuladas en `src/services/firestore.js` sin acoplamiento con la interfaz.
- [x] Sanitización anti-XSS aplicada a los campos de texto antes de la inyección en el DOM (`escaparHTML`).
- [x] Documentación JSDoc con tipado en todas las funciones del modelo y servicio.
- [x] Sin errores en consola F12 al enviar formularios válidos e inválidos.
- [x] Commits semánticos en GitHub con autoría del equipo de desarrollo.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Periodo | Estado |
|---|---|---|:---:|:---:|
| **2.1** | Definir colección transacciones en Firestore | Daniel Cortes / Juan Diego Peraza | 21 ago - 24 ago | **Done** |
| **2.2** | Modal y formulario para captura de montos y categorías | Jorman Palacios Murillo | 24 ago - 27 ago | **Done** |
| **2.3** | Función de inserción `addDoc` a Firestore | Juan Diego Peraza | 27 ago - 31 ago | **Done** |
| **2.4** | Pruebas de persistencia ante recarga de página | Fabián Córdoba | 31 ago - 03 sep | **Done** |

---

### [HU-03] Dashboard de Saldo Líquido y Métricas en Tiempo Real
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 3 (Alta / Funcional)
- **Condición técnica obligatoria:** Entrega principal de valor financiero del hogar.
- **Descripción:** Como miembro del hogar, quiero visualizar en un dashboard interactivo mi saldo neto consolidado, ingresos, gastos y gastos compartidos en tiempo real, para conocer el estado de nuestra economía sin demoras.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia redactada con valor de negocio enfocado en la transparencia de cuentas.
- [x] Fórmulas matemáticas de balance consolidado acordadas ($Balance = Ingresos - Gastos$).
- [x] Dependencia resuelta: colección de transacciones funcional en Firestore (HU-02).
- [x] Estimación aprobada en 5 SP (talla S).
- [x] Diseño responsivo del grid de métricas (4 tarjetas superiores) aprobado en Tailwind CSS.

#### • Criterios de Aceptación
- **CA-3.1:** Consulta en tiempo real (`onSnapshot`) que actualiza balances y tabla instantáneamente sin recargar la página ante altas o bajas.
- **CA-3.2:** Cálculo agregado que discrimina Balance Neto, Ingresos Totales, Gastos Totales y Gastos Compartidos del Hogar.
- **CA-3.3:** Código de colores semántico: Balance $\ge 0$ en verde esmeralda (`text-emerald-400`); Balance negativo en rojo carmesí (`text-rose-400`).
- **CA-3.4:** Capacidad de eliminar transacciones propias con diálogo de confirmación y verificación defensiva de propiedad en cliente y backend.
- **CA-3.5:** Filtro inicial por ámbito para alternar entre Todos, Solo Compartidos y Solo Personales.

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-3.1 a CA-3.5) verificados en pruebas de laboratorio en vivo.
- [x] Algoritmo `calcularTotales` implementado como función pura sin mutaciones en `src/services/firestore.js`.
- [x] Ordenamiento cronológico en cliente con `sort()` descendente, eliminando la necesidad de índices compuestos en Firestore.
- [x] Bandera `listenersInicializados` en `dashboard.js` para evitar duplicación de eventos al reingresar a la aplicación.
- [x] JSDoc exhaustivo en todas las funciones del dashboard y formateo.
- [x] Consola limpia (cero errores en F12 al navegar, filtrar o eliminar).
- [x] Commits semánticos sincronizados en `main`.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Periodo | Estado |
|---|---|---|:---:|:---:|
| **3.1** | Diseñar tarjeta hero de Saldo Disponible y métricas | Jorman Palacios Murillo | 26 ago - 29 ago | **Done** |
| **3.2** | Consulta reactiva `onSnapshot` a Firestore | Daniel Cortes | 29 ago - 01 sep | **Done** |
| **3.3** | Algoritmo de cálculo de saldos en JavaScript | Yerson Niño Guerrero | 01 sep - 03 sep | **Done** |
| **3.4** | Pruebas de actualización de balance en vivo | Fabián Córdoba / Juan Diego Peraza | 03 sep - 05 sep | **Done** |

---

## 4. Definición de Estimaciones y Capacidad
- **Capacidad del Sprint:** 3 Historias de Usuario (Todas talla S).
- **Estimación en Story Points (referencial):** 15 SP (5 SP por historia; escala S = 3 a 5 SP).
- **Herramientas de seguimiento:** Tablero en Miro (autorizado por el docente en lugar de Planner, que requiere licencia) y Bitácora de Sprint.
- **Límite WIP:** máximo 5 tareas en "En progreso" en todo el equipo y máximo 3 por persona.
