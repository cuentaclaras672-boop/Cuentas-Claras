# Acta de Sprint Planning — Sprint 3
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Fecha del Planning:** 12 de octubre de 2026  
**Duración del Sprint:** 3 semanas (semanas 11 a 13, del 12 al 31 de octubre de 2026)  
**Cierre:** Sprint Review y Retrospectiva internos (31 de octubre de 2026). El Sprint 4 (semanas 14 a 16) prepara la Sustentación 3 — Entrega Final.  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad en el Sprint 3 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Prioriza el backlog, valida criterios de aceptación y construye la gráfica de gastos por categoría. |
| **Scrum Master** | Fabián Eduardo Córdoba | Facilita las ceremonias, cuida el límite WIP, actualiza el burndown cada sábado y coordina las pruebas. |
| **Development Team** | Daniel Felipe Cortes | Servicios: colecciones `prestamos` y `hogares` en Firestore y sus reglas de seguridad. |
| **Development Team** | Jorman Palacios Murillo | UI: tarjetas de préstamos, formulario de abonos y pantalla de hogar compartido. |
| **Development Team** | Yerson Niño Guerrero | Dominio: modelos `Prestamo` y `Hogar`, cálculo de saldo pendiente y agrupación por categoría. |

---

## 2. Objetivo del Sprint (Sprint Goal)
> *"Que el usuario pueda registrar lo que le presta a amigos o familiares y seguir sus abonos hasta saldarlo, que dos convivientes compartan un mismo hogar para ver juntos los gastos comunes, y que el hogar vea en una gráfica en qué se le va el dinero."*

---

## 3. Velocidad de referencia y capacidad
- **Velocidad del Sprint 1:** 3 historias terminadas, 15 SP, en 2 semanas (7,5 SP por semana).
- **Velocidad del Sprint 2:** 21 SP comprometidos en 4 semanas. *(Completar con los SP realmente terminados en el Sprint Review del Sprint 2.)*
- **Compromiso del Sprint 3:** 3 historias, **16 SP**, en 3 semanas (~5,3 SP por semana). Se compromete menos que la velocidad del Sprint 1 porque dos historias tocan las reglas de seguridad de Firestore, que es la parte con más riesgo de errores de permisos.
- **Escala de tallas usada:** S = 3 a 5 SP · M = 8 SP · L = 13 SP (Fibonacci).
- **Límite WIP del tablero:** máximo 5 tareas en "En progreso" en todo el equipo y máximo 3 por persona.

### 3.1 Antes de iniciar: pendientes que vienen del Sprint 2
El Sprint 3 solo arranca con el Sprint 2 cerrado. Si alguno de estos puntos sigue abierto el 12 de octubre, se trata como **deuda técnica** y se resuelve en la semana 11, antes de las historias nuevas:

| Pendiente | Origen | Responsable sugerido |
|---|---|---|
| Crear un bolsillo falla siempre: el constructor de `Bolsillo` llama `parsearMonto(0)` para `montoAcumulado`, y `parsearMonto` rechaza el cero. | Revisión de código del commit `e06328a` (HU-04) | Yerson Niño (dueño del modelo) |
| Tarea 7.3 (mensajes de validación debajo de cada campo) sin terminar. | Bitácora del Sprint 2 | Yerson Niño |
| Tarea 4.4 (descuento del saldo disponible y pruebas de integración) en pruebas. | Bitácora del Sprint 2 | Fabián Córdoba |
| La bitácora marca la Tarea 7.2 como terminada con un módulo `conexion.js`, pero ese archivo no existe: la detección de conexión quedó dentro de `dashboard.js`. Hay que corregir la descripción o crear el módulo. | Revisión de código del commit `e06328a` | Daniel Cortes |
| Publicar en Firebase Console las reglas actualizadas (incluyen la colección `bolsillos`). | `firestore.rules` | Daniel Cortes |

---

## 4. Historias de Usuario Seleccionadas (Sprint Backlog)

Orden de prioridad: primero los préstamos, porque es la funcionalidad del Product Goal que se aplazó en el Sprint 2 para cubrir las condiciones técnicas; luego el hogar compartido, que es la base para que "gastos compartidos" tenga sentido entre dos personas; por último la gráfica, que solo lee datos que ya existen.

Cada historia incluye su **Prioridad**, **Talla/Estimación**, **Condición Técnica Vinculada**, **Definición de Preparado (DoR)**, **Criterios de Aceptación**, **Definición de Terminado (DoD)** y **Desglose de Tareas**.

---

### [HU-08] Préstamos a terceros con abonos parciales
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 1 (Alta / Núcleo del Product Goal)
- **Condiciones técnicas que refuerza:** #1 (Persistencia real en una colección nueva) y #4 (Filtrado por estado).
- **Descripción:** Como usuario, quiero registrar el dinero que le presto a un amigo o familiar y anotar cada abono que me hace, para saber cuánto me falta por cobrar sin depender de mi memoria ni de chats.
- **Por qué ahora:** esta historia se sacó del Sprint 2 para priorizar las condiciones técnicas obligatorias (ver Bitácora del Sprint 2, sección de uso de IA).

#### • Definición de Preparado (Definition of Ready — DoR)
- [ ] Historia redactada en formato de usuario con rol, acción y beneficio.
- [ ] Entidad `Prestamo` acordada: deudor, monto prestado, fecha, nota opcional, lista de abonos (monto y fecha), `creadoPor`.
- [ ] Regla de negocio acordada: un abono nunca puede superar el saldo pendiente; cuando el pendiente llega a 0 el préstamo pasa a "Saldado".
- [ ] Decisión registrada sobre el saldo: el dinero prestado **no** se descuenta del saldo disponible (se muestra aparte como "Por cobrar"), para no mezclarlo con los movimientos.
- [ ] Estimación aprobada en 8 SP (talla M).
- [ ] Boceto de la tarjeta de préstamo y del formulario de abono aprobado en Tailwind CSS.

#### • Criterios de Aceptación
- **CA-8.1:** Se registra un préstamo con nombre del deudor (mínimo 3 caracteres), monto mayor a 0 y fecha; si falta un dato, el campo se marca en rojo y aparece el mensaje.
- **CA-8.2:** Los préstamos se guardan en Firestore en la colección `prestamos`, asociados al usuario (`creadoPor`), y siguen ahí al recargar la página.
- **CA-8.3:** Se puede registrar un abono parcial; el saldo pendiente se recalcula (`monto prestado − suma de abonos`) y se ve el historial de abonos con su fecha.
- **CA-8.4:** Si el abono es mayor que el saldo pendiente, aparece un aviso y no se guarda nada.
- **CA-8.5:** Cuando el pendiente llega a 0, el préstamo cambia automáticamente a estado "Saldado".
- **CA-8.6:** Se pueden filtrar los préstamos por estado (Todos / Pendientes / Saldados).
- **CA-8.7:** El dashboard muestra una tarjeta "Por cobrar" con la suma de los saldos pendientes.
- **CA-8.8:** Las reglas de Firestore solo dejan leer, crear, modificar y borrar los préstamos propios, y no permiten cambiar `creadoPor`.

#### • Definición de Terminado (Definition of Done — DoD)
- [ ] Criterios de aceptación CA-8.1 a CA-8.8 probados en la app corriendo localmente.
- [ ] Modelo `Prestamo.js` en `src/models/` con `validar()`, `aFirestore()`, `desdeFirestore()` y cálculo del saldo pendiente.
- [ ] Operaciones de Firestore en `src/services/` sin tocar el DOM.
- [ ] Reglas de la colección `prestamos` agregadas a `firestore.rules` **y publicadas** en Firebase Console.
- [ ] Textos del usuario (nombre del deudor, nota) pasan por `escaparHTML` antes de pintarse.
- [ ] JSDoc completo; sin `console.log` de depuración; consola F12 sin errores.
- [ ] Commits semánticos hechos por el responsable de cada tarea.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **8.1** | Modelo `Prestamo.js` con validaciones y cálculo del saldo pendiente | Yerson Niño | 12 oct - 15 oct |
| **8.2** | Servicio en Firestore: crear préstamo, registrar abono, eliminar y escuchar en tiempo real; reglas de seguridad | Daniel Cortes | 15 oct - 19 oct |
| **8.3** | Tarjetas de préstamos, formulario de abono, filtro por estado y tarjeta "Por cobrar" | Jorman Palacios | 19 oct - 23 oct |
| **8.4** | Pruebas: abonos parciales, abono mayor al pendiente, cambio a "Saldado" y recarga de página | Fabián Córdoba | 23 oct - 26 oct |

---

### [HU-09] Hogar compartido entre convivientes
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2 (Alta / Base de los gastos compartidos)
- **Condición técnica que refuerza:** #2 (Control de acceso: qué puede ver cada usuario).
- **Descripción:** Como conviviente, quiero crear un hogar e invitar a mi pareja con un código, para que los dos veamos los gastos marcados como "Compartido" sin ver los gastos personales del otro.
- **Por qué ahora:** hoy cada usuario solo ve lo suyo. Las reglas de Firestore se dejaron así a propósito "hasta que exista el concepto de hogar". Esta historia crea ese concepto.

#### • Definición de Preparado (Definition of Ready — DoR)
- [ ] Historia redactada en formato de usuario con rol, acción y beneficio.
- [ ] Entidad `Hogar` acordada: nombre, código de invitación de 6 caracteres, lista de miembros (UIDs), `creadoPor`.
- [ ] Regla de privacidad acordada: un miembro del hogar ve los movimientos **compartidos** de los demás miembros, nunca los **personales**.
- [ ] Diseño de la regla de Firestore revisado por el equipo antes de programar (lectura de `transacciones` cuando `ambito == 'COMPARTIDO'` y el lector pertenece al mismo hogar).
- [ ] Estimación aprobada en 5 SP (talla S).
- [ ] Boceto de la pantalla "Mi hogar" (crear, unirse con código, ver miembros) aprobado.

#### • Criterios de Aceptación
- **CA-9.1:** Un usuario sin hogar puede crear uno con un nombre; el sistema genera un código de invitación de 6 caracteres.
- **CA-9.2:** Otro usuario puede unirse escribiendo ese código; si el código no existe, aparece un aviso.
- **CA-9.3:** Un usuario pertenece a un solo hogar; si ya tiene uno, no puede unirse a otro sin salir primero.
- **CA-9.4:** Los movimientos nuevos guardan el `hogarId` del usuario.
- **CA-9.5:** En la lista de movimientos, cada miembro ve sus movimientos y los **compartidos** de los demás miembros, con el nombre de quién lo registró. Los personales del otro no aparecen.
- **CA-9.6:** Las reglas de Firestore lo garantizan en el servidor: un usuario fuera del hogar no puede leer sus movimientos compartidos, y nadie puede leer movimientos personales ajenos.
- **CA-9.7:** Un miembro puede salir del hogar; desde ese momento deja de ver los compartidos de los demás.

#### • Definición de Terminado (Definition of Done — DoD)
- [ ] Criterios de aceptación CA-9.1 a CA-9.7 probados con **dos cuentas distintas** en dos navegadores.
- [ ] Prueba negativa documentada: una tercera cuenta fuera del hogar intenta leer y recibe `permission-denied`.
- [ ] Modelo `Hogar.js` y servicio en `src/services/` sin tocar el DOM.
- [ ] Reglas de `hogares` y la nueva regla de lectura de `transacciones` publicadas en Firebase Console.
- [ ] JSDoc completo; sin `console.log` de depuración; consola F12 sin errores.
- [ ] Commits semánticos hechos por el responsable de cada tarea.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **9.1** | Modelo `Hogar.js` y generación del código de invitación | Yerson Niño | 15 oct - 18 oct |
| **9.2** | Servicio de hogares (crear, unirse, salir) y reglas de seguridad de `hogares` y `transacciones` | Daniel Cortes | 19 oct - 23 oct |
| **9.3** | Pantalla "Mi hogar" y etiqueta con el autor en los movimientos compartidos | Jorman Palacios | 23 oct - 27 oct |
| **9.4** | Pruebas con dos cuentas y prueba negativa con una tercera cuenta | Fabián Córdoba | 27 oct - 30 oct |

---

### [HU-10] Gráfica de gastos por categoría
- **Talla:** S · **Estimación:** 3 SP · **Prioridad:** 3 (Media / Visualización)
- **Condición técnica que refuerza:** #4 (Consulta con filtrado: la gráfica respeta los filtros del historial).
- **Descripción:** Como miembro del hogar, quiero ver en una gráfica cuánto gastamos en cada categoría, para identificar en qué se nos va el dinero y dónde recortar.

#### • Definición de Preparado (Definition of Ready — DoR)
- [ ] Historia redactada en formato de usuario con rol, acción y beneficio.
- [ ] Decisión técnica registrada: gráfica de barras horizontales hecha con HTML y Tailwind (o SVG nativo), **sin librerías externas**, para mantener el proyecto sin dependencias.
- [ ] Dependencia resuelta: filtros del historial de la HU-05 funcionando.
- [ ] Estimación aprobada en 3 SP (talla S).
- [ ] Boceto de la gráfica aprobado.

#### • Criterios de Aceptación
- **CA-10.1:** La gráfica muestra una barra por categoría de **gasto**, ordenadas de mayor a menor, con el monto y el porcentaje sobre el total de gastos.
- **CA-10.2:** La gráfica usa los mismos filtros del historial (fechas, ámbito); al cambiar un filtro, la gráfica se actualiza.
- **CA-10.3:** Respeta el selector COP / USD.
- **CA-10.4:** Si no hay gastos con los filtros elegidos, muestra el mensaje "No hay gastos para mostrar" en vez de una gráfica vacía.
- **CA-10.5:** Los nombres de categoría se pintan con `escaparHTML`.

#### • Definición de Terminado (Definition of Done — DoD)
- [ ] Criterios de aceptación CA-10.1 a CA-10.5 probados.
- [ ] Función pura de agrupación por categoría (sin tocar el DOM) con JSDoc.
- [ ] Sin librerías nuevas en el proyecto.
- [ ] Consola F12 sin errores; commits semánticos del responsable.

#### • Tareas Asignadas:
| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| **10.1** | Función pura que agrupa los gastos por categoría y calcula porcentajes | Yerson Niño | 21 oct - 23 oct |
| **10.2** | Componente visual de barras en Tailwind conectado a filtros y divisa | Juan Diego Peraza | 24 oct - 28 oct |
| **10.3** | Pruebas con filtros, cambio de divisa y estado vacío | Fabián Córdoba | 28 oct - 30 oct |

---

## 5. Lo que queda en el Product Backlog (no entra en este sprint)

| Historia candidata | Motivo para no incluirla ahora | Sprint candidato |
|---|---|---|
| Liquidación entre convivientes ("quién le debe a quién" en los gastos compartidos) | Depende de la HU-09 (hogar compartido). Primero hay que probar que el hogar funciona y es seguro. | Sprint 4 |
| Exportar el historial a CSV | Aporta poco valor frente a las historias elegidas. | Sprint 4 |

---

## 6. Cronograma por semana

| Semana | Fechas | Foco |
|:---:|---|---|
| 11 | 12 - 17 oct | Planning. Cierre de la deuda técnica del Sprint 2 (sección 3.1). Modelos `Prestamo` y `Hogar`. Servicio de préstamos. |
| 12 | 19 - 24 oct | Servicio de hogares y reglas de seguridad. Interfaz de préstamos. Función de agrupación por categoría. |
| 13 | 26 - 31 oct | Pantalla "Mi hogar", gráfica, pruebas con dos cuentas, Sprint Review y Retrospectiva. |

---

## 7. Definition of Done y Cierre del Sprint
Se mantiene la [Definition of Done](definition-of-done.md) oficial del proyecto. Para este sprint, además:
- Una historia solo pasa a "Terminado" si todos sus criterios de aceptación se probaron en la app corriendo localmente sin errores en la consola.
- Toda historia que cambie `firestore.rules` solo se cierra cuando las reglas están **publicadas** en Firebase Console (no basta con el archivo en GitHub).
- Cada tarea la sube a GitHub **la persona responsable**, con su propia cuenta, para que el historial muestre la autoría individual.
