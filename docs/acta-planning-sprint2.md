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

## 4. Historias de Usuario seleccionadas (Sprint Backlog)

Orden de prioridad: primero lo que usan las demás historias (búsqueda sobre los movimientos que ya existen), luego la integración externa, después los bolsillos (la historia más grande) y por último la resiliencia, que se apoya en todo lo anterior.

### [HU-05] Búsqueda y filtros avanzados del historial
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 1
- **Condición técnica:** #4 (Consulta con filtrado o búsqueda).
- **Descripción:** Como miembro del hogar, quiero buscar movimientos por texto y filtrarlos por categoría, tipo y rango de fechas, para encontrar rápido un gasto sin revisar todo el historial.
- **Qué cambia frente al Sprint 1:** en el Sprint 1 solo existía el filtro por ámbito (Personal / Compartido). Esta historia agrega búsqueda por texto, categoría, tipo y fechas.
- **Criterios de aceptación:**
  - El campo de búsqueda encuentra movimientos por su descripción, sin importar mayúsculas ni tildes ("cafe" encuentra "Café").
  - Se puede filtrar por categoría, por tipo (Ingreso / Gasto) y por rango de fechas (desde / hasta).
  - Todos los filtros se pueden combinar entre sí y con el filtro por ámbito que ya existía.
  - Si la fecha "desde" es mayor que la fecha "hasta", se muestra un aviso y no se aplica el filtro.
  - El contador muestra cuántos registros cumplen los filtros; si no hay ninguno, aparece el mensaje "No hay movimientos con esos filtros".
  - Un botón "Limpiar filtros" deja la lista completa otra vez.
  - Las tarjetas de saldo **no** cambian con la búsqueda: siempre muestran el total real.
- **Tareas:**

| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| 5.1 | Barra de búsqueda y selectores de categoría, tipo y fechas en HTML/Tailwind | Jorman Palacios | 09 sep - 12 sep |
| 5.2 | Función de filtrado combinado (texto, categoría, tipo, ámbito) en `dashboard.js` | Yerson Niño | 13 sep - 16 sep |
| 5.3 | Filtro por rango de fechas con validación "desde ≤ hasta" | Daniel Cortes | 16 sep - 20 sep |
| 5.4 | Pruebas de combinaciones de filtros, estado vacío y botón limpiar | Fabián Córdoba | 21 sep - 26 sep |

---

### [HU-06] Integración externa de la TRM y vista en dólares
- **Talla:** S · **Estimación:** 5 SP · **Prioridad:** 2
- **Condición técnica:** #3 (Integración externa).
- **Descripción:** Como miembro del hogar, quiero ver la TRM oficial del día y mis saldos convertidos a dólares, para decidir compras o ahorros en moneda extranjera.
- **Criterios de aceptación:**
  - Al entrar al dashboard se consulta la TRM en la API de Datos Abiertos (datos.gov.co, Superintendencia Financiera) y se muestra en el encabezado con dos decimales.
  - Si la API principal falla, se intenta con las APIs de respaldo; si todas fallan, se usa un valor de referencia y el indicador dice que es referencial. La pantalla nunca queda en blanco.
  - El usuario puede cambiar entre COP y USD; las tarjetas de saldo y la lista de movimientos se convierten al instante.
  - La conversión es solo de presentación: en Firestore los montos se siguen guardando en COP.
  - Al pasar el mouse sobre el indicador se ve la fuente del dato.
- **Tareas:**

| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| 6.1 | Servicio `indicadores.js`: consumo de la API de la TRM con respaldos | Daniel Cortes | 10 sep - 14 sep |
| 6.2 | Conversión COP → USD y formato con decimales en `formateo.js` | Yerson Niño | 15 sep - 19 sep |
| 6.3 | Indicador de TRM y selector COP / USD en el dashboard | Juan Diego Peraza / Jorman Palacios | 20 sep - 24 sep |
| 6.4 | Pruebas con la API caída (bloqueo en F12) y verificación del valor referencial | Fabián Córdoba | 24 sep - 28 sep |

---

### [HU-04] Bolsillos de ahorro con metas
- **Talla:** M · **Estimación:** 8 SP · **Prioridad:** 3
- **Condición técnica:** #1 (Persistencia real) sobre una colección nueva.
- **Descripción:** Como miembro del hogar, quiero crear bolsillos (por ejemplo citas, bebé, viajes o emergencias) con una meta y asignarles dinero, para separar lo que puedo gastar de lo que está reservado para algo.
- **Criterios de aceptación:**
  - Un bolsillo tiene nombre (mínimo 3 caracteres) y meta en pesos (mayor a 0); si falta algo, se muestra el error.
  - Los bolsillos se guardan en Firestore, en la colección `bolsillos`, asociados al usuario (`creadoPor`), y siguen ahí al recargar la página.
  - Se puede asignar dinero a un bolsillo, pero nunca más que el saldo disponible; si se intenta, aparece un aviso y no se guarda nada.
  - Cada bolsillo muestra una barra de progreso con el porcentaje ahorrado frente a la meta (máximo 100 %).
  - El saldo disponible del dashboard descuenta el dinero que está en bolsillos.
  - Se puede eliminar un bolsillo; su dinero vuelve al saldo disponible.
  - Las reglas de Firestore solo dejan leer y modificar los bolsillos propios.
- **Tareas:**

| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| 4.1 | Modelo `Bolsillo.js` con validaciones (nombre, meta, monto asignado) | Yerson Niño | 18 sep - 22 sep |
| 4.2 | Servicio en Firestore: crear, asignar dinero y eliminar bolsillos, y reglas de seguridad | Daniel Cortes | 23 sep - 27 sep |
| 4.3 | Tarjetas de bolsillos con barra de progreso y formulario de creación | Jorman Palacios | 27 sep - 30 sep |
| 4.4 | Descuento del saldo disponible y pruebas de integración de toda la HU | Fabián Córdoba | 30 sep - 03 oct |

---

### [HU-07] Resiliencia: avisos de conexión y validaciones en los formularios
- **Talla:** S · **Estimación:** 3 SP · **Prioridad:** 4
- **Condición técnica:** #5 (Manejo de errores visible).
- **Descripción:** Como usuario, quiero saber cuándo perdí la conexión y ver en cada campo qué dato está mal, para no perder lo que estoy registrando ni adivinar qué falló.
- **Qué cambia frente al Sprint 1:** los Toasts de error ya existían desde el Sprint 1. Esta historia agrega el aviso de sin conexión y los mensajes de validación junto a cada campo.
- **Criterios de aceptación:**
  - Cuando el navegador pierde internet aparece un aviso fijo "Sin conexión"; al volver la conexión, el aviso desaparece y se muestra un Toast "Conexión restablecida".
  - Mientras no hay conexión, los botones de guardar quedan deshabilitados.
  - En los formularios de movimiento y de bolsillo, el campo con error se marca en rojo y muestra el mensaje debajo, además del Toast.
  - Ningún error deja la pantalla en blanco ni el botón bloqueado en "Guardando...".
- **Tareas:**

| Tarea | Descripción | Responsable | Fechas planificadas |
|---|---|---|:---:|
| 7.1 | Diseño del aviso "Sin conexión" y del estilo de error por campo en Tailwind | Jorman Palacios | 12 sep - 16 sep |
| 7.2 | Módulo `conexion.js` que escucha los eventos `online` / `offline` | Daniel Cortes | 16 sep - 20 sep |
| 7.3 | Mensajes de validación debajo de cada campo en los formularios | Yerson Niño | 21 sep - 24 sep |
| 7.4 | Pruebas en modo offline (F12 → Network → Offline) y con datos inválidos | Fabián Córdoba | 25 sep - 29 sep |

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

## 6. Definition of Done
Se mantiene la [Definition of Done](definition-of-done.md) del proyecto. Para este sprint, además, una historia solo pasa a "Terminado" si todos sus criterios de aceptación se probaron en la app corriendo localmente.
