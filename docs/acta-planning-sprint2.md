# Acta de Sprint Planning — Sprint 2
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Fecha del Planning:** 7 de septiembre de 2026  
**Duración del Sprint:** 4 semanas (semanas 6 a 9, del 7 de septiembre al 3 de octubre de 2026)  
**Cierre:** Sustentación 2 (10 de octubre de 2026, Grupo 2 - sábado). La semana 10 se usa para pruebas finales.  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad en el Sprint 2 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Prioriza el backlog, valida criterios de aceptación y apoya la UI del selector de divisas. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilita las ceremonias, cuida el límite WIP, lleva el burndown y coordina las pruebas. |
| **Development Team** | Daniel Felipe Cortes | Servicios: Firestore para bolsillos, API de la TRM y detección de conexión. |
| **Development Team** | Jorman Palacios Murillo | UI: barra de búsqueda, tarjetas de bolsillos y avisos visuales. |
| **Development Team** | Yerson Niño Guerrero | Dominio: modelo `Bolsillo`, lógica de filtros y conversión de divisas. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Que el hogar pueda separar su dinero en bolsillos con metas de ahorro, encontrar cualquier movimiento con búsqueda y filtros, y ver sus saldos en dólares con la TRM oficial, recibiendo avisos claros cuando algo falle."*

---

## 3. Velocidad de referencia y capacidad
- **Velocidad del Sprint 1:** 3 historias terminadas, 15 SP, en un sprint de 2 semanas.
- **Compromiso del Sprint 2:** 4 historias, **21 SP**, en un sprint de 4 semanas. Es menos del doble de la velocidad del Sprint 1, porque la HU-04 es la primera historia talla M y trae más incertidumbre.
- **Escala de tallas usada:** S = 3 a 5 SP · M = 8 SP · L = 13 SP (Fibonacci).
- **Límite WIP del tablero:** máximo 5 tareas en "En progreso" en todo el equipo y máximo 3 por persona.

---

## 4. Historias de Usuario Seleccionadas (Sprint Backlog)

Orden de prioridad: primero las condiciones técnicas obligatorias que impactan los datos existentes (búsqueda e integración externa), luego el módulo de bolsillos (historia central de valor en persistencia) y finalmente la resiliencia en formularios y conectividad.

Cada historia incluye su **Prioridad**, **Talla/Estimación**, **Condición Técnica Vinculada**, **Definición de Preparado (DoR)**, **Criterios de Aceptación**, **Definición de Terminado (DoD)** y **Desglose de Tareas**.

---

### [HU-05] Búsqueda y filtros avanzados del historial
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 1 (Alta / Obligatoria)
- **Condición técnica obligatoria:** #4 (Consulta con filtrado o búsqueda).
- **Descripción:** Como miembro del hogar, quiero buscar movimientos por texto y filtrarlos por categoría, tipo y rango de fechas, para encontrar rápido cualquier registro sin revisar manualmente todo el historial.
- **Qué cambia frente al Sprint 1:** En el Sprint 1 solo existía el filtro por ámbito (Personal / Compartido). Esta historia agrega búsqueda por coincidencia textual, categoría temática, tipo de flujo (Ingreso / Gasto) y filtro por fechas.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia descrita bajo estándar ágil con rol, objetivo y valor claro para el usuario.
- [x] Criterios de aceptación consensuados para búsquedas insensibles a mayúsculas/tildes y combinaciones de filtros.
- [x] Dependencia resuelta: colección de transacciones poblada y renderizada en el DOM desde el Sprint 1.
- [x] Estimación aprobada en 5 SP (talla S) por el equipo de desarrollo.
- [x] Boceto de la barra de filtros (input texto, selectores y selector de fechas) validado en Tailwind CSS.

#### • Criterios de Aceptación
- **CA-5.1:** Búsqueda en tiempo real por texto en la descripción, insensible a mayúsculas, minúsculas y tildes ("cafe" encuentra "Café").
- **CA-5.2:** Filtrado simultáneo o independiente por categoría, por tipo (Ingreso / Gasto) y por ámbito (Personal / Compartido).
- **CA-5.3:** Filtro por rango de fechas (desde / hasta); si "desde" > "hasta", salta una notificación Toast de advertencia y no se aplica el filtro.
- **CA-5.4:** Contador visual interactivo que muestra cuántos registros cumplen los criterios; si no hay coincidencias, muestra el estado vacío "No hay movimientos con esos filtros".
- **CA-5.5:** Botón "Limpiar filtros" que restablece todos los campos a su estado por defecto y recarga la lista completa.
- **CA-5.6:** Las tarjetas superiores de saldo no se alteran por la búsqueda: siempre reflejan el balance real total del hogar.

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-5.1 a CA-5.6) probados y validados en navegador.
- [x] Algoritmo de filtrado implementado como función pura en `src/ui/dashboard.js` sin mutar el arreglo original de Firestore.
- [x] Sanitización anti-XSS preservada en los resultados filtrados mediante `escaparHTML`.
- [x] Documentación JSDoc con `@param` y `@returns` en todas las funciones de búsqueda y filtrado.
- [x] Cero errores en DevTools (F12) al combinar o limpiar filtros sucesivamente.
- [x] Commits semánticos registrados en GitHub en la rama `main`.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **5.1** | Barra de búsqueda y selectores de categoría, tipo y fechas en HTML/Tailwind | Jorman Palacios | 09 sep - 12 sep |
| **5.2** | Función de filtrado combinado (texto, categoría, tipo, ámbito) en `dashboard.js` | Yerson Niño | 13 sep - 16 sep |
| **5.3** | Filtro por rango de fechas con validación "desde ≤ hasta" | Daniel Cortes | 16 sep - 20 sep |
| **5.4** | Pruebas de combinaciones de filtros, estado vacío y botón limpiar | Fabián Córdoba | 21 sep - 26 sep |

---

### [HU-06] Integración externa de la TRM y vista en dólares
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Alta / Obligatoria)
- **Condición técnica obligatoria:** #3 (Integración externa con API pública).
- **Descripción:** Como miembro del hogar, quiero ver la TRM oficial del día y mis saldos convertidos a dólares, para fundamentar decisiones de compras, ahorros o viajes en moneda extranjera.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia definida con rol, necesidad y beneficio para la planificación financiera del hogar.
- [x] API pública identificada: Socrata Open Data de la Superfinanciera en `datos.gov.co` (gratuita, oficial, sin API key).
- [x] Estrategia multicanal de contingencia definida (Open Exchange Rates y TRM Colombia) y fallback offline referencial.
- [x] Estimación aprobada en 5 SP (talla S).
- [x] Diseño visual del indicador de TRM en el header y botones de conmutación COP/USD acordados.

#### • Criterios de Aceptación
- **CA-6.1:** Al cargar el dashboard, se consulta asíncronamente vía `fetch` la TRM oficial y se despliega en el encabezado con 2 decimales (`$ X.XXX,XX`).
- **CA-6.2:** Tolerancia a fallos: si la API principal falla, intenta automáticamente con endpoints de respaldo; si todos fallan, usa el valor de contingencia local. La pantalla nunca queda en blanco.
- **CA-6.3:** El usuario puede alternar entre COP y USD; las tarjetas de saldo y la lista de transacciones se recalculan al instante.
- **CA-6.4:** Integridad contable: los datos en Cloud Firestore permanecen siempre en COP; la conversión es exclusivamente de presentación en la interfaz.
- **CA-6.5:** Badge interactivo que indica la fuente oficial del dato al posicionar el cursor sobre él.

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-6.1 a CA-6.5) verificados en vivo y mediante simulación offline.
- [x] Servicio aislado en `src/services/indicadores.js` sin tocar el DOM ni acoplarse a la UI.
- [x] Utilidades de conversión y formateo de precisión con 2 decimales implementadas en `src/utils/formateo.js`.
- [x] Documentación JSDoc exhaustiva en llamadas de red y transformaciones matemáticas.
- [x] Cero errores no capturados en consola al simular bloqueo de red en DevTools.
- [x] Commits semánticos registrados en GitHub en la rama `main`.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **6.1** | Servicio `indicadores.js`: consumo de la API de la TRM con respaldos | Daniel Cortes | 10 sep - 14 sep |
| **6.2** | Conversión COP → USD y formato con decimales en `formateo.js` | Yerson Niño | 15 sep - 19 sep |
| **6.3** | Indicador de TRM y selector COP / USD en el dashboard | Juan Diego Peraza / Jorman Palacios | 20 sep - 24 sep |
| **6.4** | Pruebas con la API caída (bloqueo en F12) y verificación del valor referencial | Fabián Córdoba | 24 sep - 28 sep |

---

### [HU-04] Bolsillos de ahorro con metas
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 3 (Alta / Núcleo del Product Goal)
- **Condición técnica obligatoria:** #1 (Persistencia real NoSQL en nueva colección).
- **Descripción:** Como miembro del hogar, quiero crear bolsillos específicos (ej. citas, bebé, viajes, emergencias) asignándoles una meta monetaria y fondos, para separar el dinero disponible para gastos inmediatos del dinero reservado con un propósito específico.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia estructurada y alineada con el objetivo central del Product Goal del hogar.
- [x] Entidad de dominio `Bolsillo` modelada (nombre, meta, monto acumulado, creadoPor, fecha).
- [x] Reglas de negocio acordadas: no se puede asignar a un bolsillo más dinero que el saldo disponible real.
- [x] Estimación aprobada en 8 SP (talla M) debido a la complejidad de sincronización con el saldo líquido.
- [x] Maquetación acordada para tarjetas de bolsillos, formulario de creación y barra de progreso porcentual.

#### • Criterios de Aceptación
- **CA-4.1:** Creación de bolsillo con nombre (mínimo 3 caracteres) y meta en pesos mayor a 0 ($ > 0$); ante campos vacíos o inválidos, se muestra error contextual.
- **CA-4.2:** Persistencia real en Cloud Firestore en la colección `bolsillos`, asociados al UID del usuario (`creadoPor`), sobreviviendo a recargas de página.
- **CA-4.3:** Transferencia controlada de fondos: no se puede transferir más dinero del disponible en el balance general; ante intentos excesivos, salta notificación de error y la base de datos no se altera.
- **CA-4.4:** Cada bolsillo muestra una barra de progreso visual con el porcentaje alcanzado frente a la meta (tope 100%).
- **CA-4.5:** El saldo disponible del dashboard recalcula y descuenta los fondos comprometidos en los bolsillos.
- **CA-4.6:** Al eliminar un bolsillo, sus fondos vuelven automáticamente al saldo disponible del hogar.
- **CA-4.7:** Reglas en `firestore.rules` aíslan los bolsillos por usuario (`creadoPor == request.auth.uid`).

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-4.1 a CA-4.7) probados y funcionales.
- [x] Modelo `Bolsillo.js` implementado en `src/models/` con métodos `validar()` y `aFirestore()`.
- [x] Operaciones de base de datos aisladas en `src/services/firestore.js` sin tocar el DOM.
- [x] Reglas de seguridad publicadas y verificadas en Firestore para la colección `bolsillos`.
- [x] JSDoc completo en modelo, servicio y presentación.
- [x] Consola limpia (cero errores en F12 durante creación, asignación y borrado de bolsillos).
- [x] Commits semánticos registrados en GitHub en la rama `main`.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **4.1** | Modelo `Bolsillo.js` con validaciones (nombre, meta, monto asignado) | Yerson Niño | 18 sep - 22 sep |
| **4.2** | Servicio en Firestore: crear, asignar dinero y eliminar bolsillos, y reglas de seguridad | Daniel Cortes | 23 sep - 27 sep |
| **4.3** | Tarjetas de bolsillos con barra de progreso y formulario de creación | Jorman Palacios | 27 sep - 30 sep |
| **4.4** | Descuento del saldo disponible y pruebas de integración de toda la HU | Fabián Córdoba | 30 sep - 03 oct |

---

### [HU-07] Resiliencia: avisos de conexión y validaciones en los formularios
- **Talla:** S · **Estimación:** 3 SP · **Prioridad:** 4 (Crítica / Resiliencia)
- **Condición técnica obligatoria:** #5 (Manejo de errores visible y amigable).
- **Descripción:** Como usuario, quiero saber de inmediato cuando pierdo la conexión a internet y ver claramente en cada campo qué dato está mal, para no perder lo que estoy registrando ni enfrentar pantallas congeladas.
- **Qué cambia frente al Sprint 1:** Los Toasts flotantes ya existían desde el Sprint 1. Esta historia agrega la detección proactiva de pérdida de red con banner de alerta y la validación visual inline por campo en los formularios.

#### • Definición de Preparado (Definition of Ready — DoR)
- [x] Historia estructurada con foco en resiliencia y experiencia de usuario ante fallos.
- [x] Criterios de aceptación definidos para eventos `online`/`offline` del navegador y marcado de campos inválidos.
- [x] Sistema base de Toasts (`src/ui/notificaciones.js`) funcional y reutilizable.
- [x] Estimación aprobada en 3 SP (talla S).
- [x] Diseño del banner de aviso y estilo de inputs erróneos acordado en Tailwind CSS (`border-rose-500`).

#### • Criterios de Aceptación
- **CA-7.1:** Al perder la conexión a internet, se despliega un aviso fijo "Sin conexión" y se inhabilitan los botones de acción para evitar peticiones fallidas.
- **CA-7.2:** Al restablecerse la conexión, el aviso desaparece de inmediato y se emite un Toast verde "Conexión restablecida".
- **CA-7.3:** En formularios de movimientos y bolsillos, el campo con error se marca con borde rojo y despliega el mensaje descriptivo debajo del input, además del Toast.
- **CA-7.4:** Ningún error deja la pantalla en blanco ni el botón permanentemente bloqueado en estado "Guardando..." (`try/catch/finally`).

#### • Definición de Terminado (Definition of Done — DoD)
- [x] Criterios de aceptación (CA-7.1 a CA-7.4) validados en pruebas de red offline (F12 → Network → Offline).
- [x] Módulo `conexion.js` y escuchadores de eventos del navegador implementados sin fugas de memoria.
- [x] Separación de capas respetada: manipulación de DOM exclusivamente en capa `ui`.
- [x] Documentación JSDoc en todas las nuevas funciones de conectividad y validación.
- [x] Código limpio: sin `console.log` de desarrollo.
- [x] Commits semánticos en GitHub en la rama `main`.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **7.1** | Diseño del aviso "Sin conexión" y del estilo de error por campo en Tailwind | Jorman Palacios | 12 sep - 16 sep |
| **7.2** | Módulo `conexion.js` que escucha los eventos `online` / `offline` | Daniel Cortes | 16 sep - 20 sep |
| **7.3** | Mensajes de validación debajo de cada campo en los formularios | Yerson Niño | 21 sep - 24 sep |
| **7.4** | Pruebas en modo offline (F12 → Network → Offline) y con datos inválidos | Fabián Córdoba | 25 sep - 29 sep |

---

## 5. Cronograma por semana

| Semana | Fechas | Foco |
|:---:|---|---|
| 6 | 07 - 12 sep | Planning, estimación, diseño de la búsqueda y arranque del servicio de la TRM. |
| 7 | 14 - 19 sep | Filtros combinados, conversión de divisas, aviso de conexión y modelo `Bolsillo`. |
| 8 | 21 - 26 sep | Pruebas de HU-05 y HU-06, validaciones por campo y servicio de bolsillos. |
| 9 | 28 sep - 03 oct | Interfaz de bolsillos, integración, pruebas de regresión, Sprint Review y Retrospectiva. |
| 10 | 05 - 10 oct | Verificación final (app corriendo sin errores de consola) y Sustentación 2. |

---

## 6. Definition of Done y Cierre del Sprint
Se mantiene la [Definition of Done](definition-of-done.md) oficial del proyecto. Para este sprint, además, una historia solo pasa a "Terminado" si todos sus criterios de aceptación se probaron en la app corriendo localmente sin errores en la consola DevTools.
