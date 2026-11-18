# Guion corto para la sustentación presencial — Review Sprints 4 y 5

**Proyecto:** Cuentas Claras · **Duración:** ≈ 22 minutos (al final hay cómo bajarlo a ≈ 18)
**Diapositivas:** [Review Sprints 4 y 5 — Cuentas Claras](https://claude.ai/artifact/TcU2QDeGfaE3NdCsubG9mA). Son las mismas 29 del video y los números de diapositiva de este guion coinciden con las del deck.
**Versión larga (para el video):** [guion-review-sprints-4-5.md](guion-review-sprints-4-5.md)

> **Cómo usarlo:** lo que va entre [corchetes] es lo que se hace o se señala en la pantalla; no se dice. No memoricen palabra por palabra: apréndanse la idea de cada párrafo y díganla a su manera, mirando a la profe y no a la pantalla. Cada uno termina pasándole la palabra al siguiente, así la presentación fluye sola.

---

## Reparto rápido

| Integrante | Diapositivas | Tiempo aprox. |
|---|---|:---:|
| **Juan Diego** | 1, 4, 6, 9, 11 (pasos 4–5), 17, 18 (paso 6), 22 (P5), 24 (P5), 28, 29 | ~5 min |
| **Fabián** | 3, 5, 13, 15, 18 (paso 3), 19, modera las preguntas 21–24, 25 | ~5 min |
| **Daniel** | 8, 12, 14, 18 (pasos 1–2), 20, 23 (P1), 24 (P4), 27 | ~5 min |
| **Jorman** | 10, 11 (pasos 1–3 y 6), 18 (paso 4), 21 (P3), 24 (P6), 26 | ~3½ min |
| **Yerson** | 7, 16, 18 (paso 5), 21 (P1), 22 (P6), 23 (P1) | ~3½ min |
| **Todos** | 2 (presentación) y las preguntas de emoción (P2) | — |

## Antes de entrar al salón

- La app abierta con la sesión iniciada, **F12 → Console** sin errores y una segunda ventana con el otro conviviente del hogar.
- Un mes con gastos compartidos **sin saldar** para la demo del cuadre.
- Terminal lista en la carpeta del proyecto con `node tests/runner.js`.
- Excel o LibreOffice para abrir el CSV.
- Capturas o un video corto de las demos, por si el internet del salón falla.
- Acuerden quién pasa las diapositivas (mejor alguien que no esté hablando en ese bloque) y la señal para avanzar: “siguiente”.

---

## Apertura · ≈ 3 min

### Diapositiva 1 · Portada — Juan Diego · 0:30

**JUAN DIEGO:** “Buenos días, profe. Somos el equipo de Cuentas Claras y le vamos a presentar la Review de los Sprints 4 y 5. En pocas palabras, Cuentas Claras ayuda a las parejas y a la gente que vive junta a llevar sus gastos compartidos sin pelear por plata. [señalar el anillo] Y como ve aquí, ya llevamos el 88 % de las historias del proyecto terminadas. Primero nos presentamos.”

### Diapositiva 2 · Equipo — Todos · 0:50

> Cada uno dice una sola frase cuando le toca.

**JUAN DIEGO:** “Juan Diego, Product Owner. En estos sprints me tocaron las categorías en el formulario y la vista para imprimir en PDF.”
**FABIÁN:** “Fabián, Scrum Master y encargado de calidad: las dailies y las pruebas.”
**DANIEL:** “Daniel, servicios: las liquidaciones, la seguridad de la base de datos y lo que pasa cuando se cae el internet.”
**JORMAN:** “Jorman, la interfaz: el panel del cuadre, el contador de caracteres y los botones de exportar.”
**YERSON:** “Yerson, dominio y datos: el algoritmo de quién le debe a quién y el formato del CSV.”

### Diapositiva 3 · Agenda — Fabián · 0:20

**FABIÁN:** “Rapidito, el orden: contexto, Sprint 4 con su demo, Sprint 5 con su demo, los riesgos, las preguntas de la Review y cerramos con el avance. Abajo en cada diapositiva dice quién está presentando.”

### Diapositiva 4 · El problema — Juan Diego · 0:45

**JUAN DIEGO:** “¿Por qué existe la app? [señalar las tres tarjetas] Estas tres preguntas son las que arman peleas en una casa: quién puso qué, cuánto de mi plata es mía y cuánto es del hogar, y cuándo me devuelven lo que presté. El problema casi nunca es la falta de dinero, es la falta de claridad.
[señalar el recuadro oscuro] Por eso nuestro Product Goal es que cuadrar cuentas tome menos de 5 minutos a la semana. Los Sprints 4 y 5 van directo a eso.”

### Diapositiva 5 · Hoja de ruta — Fabián · 0:30

**FABIÁN:** “Son seis sprints de dos semanas. Los tres primeros armaron la base: acceso, transacciones, ahorro, préstamos y el hogar compartido. Hoy revisamos los dos resaltados, el 4 y el 5, y los dos cerraron al 100 %. [señalar la franja de abajo] De hecho, en cinco sprints hemos entregado 81 de 81 puntos comprometidos. El Sprint 6 ya está en marcha: despliegue y sustentación final.”

---

## Sprint 4 · ≈ 6½ min

### Diapositiva 6 · Objetivo del Sprint 4 — Juan Diego · 0:30

**JUAN DIEGO:** “Arrancamos con el Sprint 4. La meta, en una frase: que el hogar pueda cuadrar cuentas a fin de mes sabiendo quién le debe a quién y cerrar el mes sin discusiones. [señalar las tres cajas] Eran tres historias y cumplimos todo: 3 de 3 historias y 16 de 16 puntos. Yerson, ¿nos explicas el cuadre?”

### Diapositiva 7 · HU-11, el ejemplo — Yerson · 1:15

> Esta diapositiva avanza con clics: el Paso 2 y el Paso 3 aparecen al hacer clic.

**YERSON:** “Claro, mejor con un ejemplo. [Paso 1] Ana, Luis y Sofía viven juntos. Ana pagó el arriendo, Luis el mercado y Sofía los servicios: en total, 750 mil.
[clic] Partimos en tres: 250 mil cada uno. Ana puso 200 mil de más, entonces le deben; Luis debe 10 mil y Sofía 190.
[clic] Y el algoritmo junta al que más debe con el que más le deben: Sofía le pasa 190 a Ana y Luis le pasa 10. Listo, todos en cero con solo dos transferencias. Nunca da más de N menos 1. Y como es una función pura, que no depende ni de internet ni de la pantalla, la probamos en milisegundos. Daniel, cuéntales cómo se guarda.”

### Diapositiva 8 · HU-11, cómo lo garantizamos — Daniel · 0:50

**DANIEL:** “Calcular es la mitad; la otra mitad es guardar bien el cierre. Tres cosas. [tarjeta 1] El cálculo está probado. [tarjeta 2] Solo puede haber un cierre por mes: si dos personas le dan ‘Marcar saldado’ al mismo tiempo, se guarda uno solo, porque usamos una transacción atómica con un ID fijo por mes. [tarjeta 3] Y una vez saldado, nadie lo puede editar ni borrar. Si alguien se equivocó, se corrige con una transacción en el mes actual. Como en contabilidad.”

### Diapositiva 9 · HU-12, categorías — Juan Diego · 0:40

**JUAN DIEGO:** “La HU-12 es sencilla pero útil: cada uno crea sus propias categorías, como ‘Mascotas’ o ‘Gimnasio’. Le das ‘+ Nueva’, escribes entre 3 y 40 caracteres y aparece de una vez en el formulario y en el filtro. Y solo la ve su dueño.
[señalar la nota honesta] Siendo sinceros: editar y borrar ya funcionan por dentro, pero falta la pantalla. Al final le preguntamos si lo prioriza.”

### Diapositiva 10 · HU-13, 120 caracteres — Jorman · 0:30

**JORMAN:** “La HU-13 cuida los datos: la descripción tiene máximo 120 caracteres y el usuario ve cuántos le quedan mientras escribe. [señalar las tres capas] Lo importante es que la regla está en tres lugares: la pantalla, el modelo y el servidor. Así, aunque alguien se salte la app, la base de datos rechaza el dato. Ahora se lo mostramos.”

### Diapositiva 11 · Demo del Sprint 4 — Jorman y Juan Diego · 2:00

> Cambiar a la pestaña de la aplicación.

**JORMAN:** “[Paso 1] Entro a ‘Mi Hogar’ y escojo el mes. [Paso 2] Aquí está lo que explicó Yerson: el total, la cuota de cada uno y las transferencias sugeridas. [Paso 3] Le doy ‘Marcar mes como saldado’… y sale el sello. Miren la otra ventana: se actualizó sola.”
**JUAN DIEGO:** “[Paso 4] Ahora las categorías. ‘+ Nueva’, pongo ‘Ab’… y me avisa que es muy corto. [Paso 5] Pongo ‘Mascotas’ y ya aparece en el formulario y en el filtro del historial.”
**JORMAN:** “[Paso 6] Y el contador: escribo y va bajando; en 120 ya no deja escribir más. Esas son las tres historias del Sprint 4.”

### Diapositiva 12 · Retro del Sprint 4 — Daniel · 0:40

**DANIEL:** “Al cerrar el Sprint 4 hicimos la retro con la dinámica del barco. [señalar ‘Nos frenó’] Lo que más nos frenó: las fechas llegaban en tres formatos distintos y se mezclaron dos versiones de Firebase. [señalar la tarjeta verde] De ahí salió el plan del Sprint 5, que ahora le mostramos cumplido.”

---

## Sprint 5 · ≈ 6 min

### Diapositiva 13 · Objetivo del Sprint 5 — Fabián · 0:30

**FABIÁN:** “El Sprint 5 fue para blindar el sistema: seguridad, pruebas de carga, que aguante caídas de red y, además, poder sacar reportes. Dos historias, y otra vez todo cumplido: 13 de 13 puntos, 12 de 12 suites de pruebas y 46 de 46 casos en el emulador.”

### Diapositiva 14 · HU-14, seguridad — Daniel · 1:00

**DANIEL:** “Aquí nos pusimos en los zapatos de un atacante. Escribimos 40 ataques directos a la base de datos, saltándonos la app. [señalar la lista] Por ejemplo: leer datos de otra persona, reescribir abonos viejos de un préstamo o meter campos de más.
[barra naranja] Al principio las reglas paraban 27 de 40; o sea, había 13 huecos. Los cerramos en las seis colecciones y [barra verde] quedamos en 40 de 40. Y lo importante: todo lo que hace un usuario normal sigue funcionando, 6 de 6.”

### Diapositiva 15 · HU-14, carga y caídas de red — Fabián · 0:50

**FABIÁN:** “Y además, que aguante. [tarjeta izquierda] Probamos 50 abonos al mismo préstamo al mismo tiempo: cero conflictos y en menos de 2 milisegundos, cuando la meta eran 500. Y 50 personas cerrando el mismo mes: se guarda uno y los otros 49 se bloquean.
[tarjeta derecha] Si se cae el internet, la app avisa y bloquea lo de guardar, pero deja consultar y exportar. Y si es un corte de un segundo, reintenta sola hasta tres veces.”

### Diapositiva 16 · HU-15, reportes — Yerson · 0:50

**YERSON:** “La HU-15 es para sacar la información. La regla es simple [señalar la franja de arriba]: lo que ves filtrado es lo que se exporta. [tarjeta izquierda] El CSV abre bien en Excel, con tildes y eñes, y lo protegimos para que nadie pueda colar una fórmula en una descripción. [tarjeta derecha] Y el PDF sale limpio, sin botones ni menús. Las dos opciones funcionan hasta sin internet.”

### Diapositiva 17 · Acuerdos cumplidos — Juan Diego · 0:30

**JUAN DIEGO:** “Y algo que queríamos mostrar: lo que prometimos en la retro, lo cumplimos. [recorrer las filas] Las fechas, con una sola función; Firebase en una sola versión y escrito en la Definition of Done; la seguridad y la carga, que acaban de ver. Y de extra, Daniel dejó listo el despliegue.”

### Diapositiva 18 · Demo del Sprint 5 — Daniel, Fabián, Jorman, Yerson y Juan Diego · 2:30

**DANIEL:** “[Paso 1] F12, Network, Offline… ahí está el aviso y los botones de guardar se apagan. Vuelvo a Online y todo normal. [Paso 2] Y este es el informe de la auditoría, con los 46 casos.”
**FABIÁN:** “[Paso 3] Ahora corro todas las pruebas: node tests/runner.js… 12 de 12 aprobadas.”
**JORMAN:** “[Paso 4] Filtro el historial por gastos compartidos y le doy ‘Exportar CSV’.”
**YERSON:** “[Paso 5] Lo abro en Excel: las tildes bien y solo lo que estaba filtrado.”
**JUAN DIEGO:** “[Paso 6] Y ‘Imprimir / PDF’: sale limpio, listo para guardar.”

---

## Riesgos · ≈ 1½ min

### Diapositiva 19 · Impedimentos superados — Fabián · 0:45

**FABIÁN:** “No todo fue fácil. [recorrer las tarjetas] En el Sprint 4, tres de nosotros no pudimos ir a la Review del 30 de octubre por fuerza mayor, y Juan Diego y Daniel la sacaron adelante; por eso hoy estamos los cinco. Lo de las versiones y las fechas ya quedó resuelto. Coordinar a cinco personas en Git lo manejamos con pull diario, y como no teníamos licencia de Planner, nos pasamos a Miro. En el Sprint 5 el dashboard quedó desconectado después de un cambio, y Daniel lo arregló al día siguiente.”

### Diapositiva 20 · Lo que sigue abierto — Daniel · 0:45

**DANIEL:** “Y esto es lo que sigue abierto. [tarjetas naranjas] Lo más importante: para publicar las reglas nuevas y desplegar necesitamos la cuenta dueña de Firebase; lo hacemos en el Sprint 6, ya con la guía lista. También hay que restringir la API Key sin romper el inicio de sesión, y nos faltan las pruebas en celular, que Jorman y Yerson hacen antes del 21. [tarjeta punteada] Y hay una decisión que es suya, profe: la pantalla para editar categorías.”

---

## Preguntas de la Review · ≈ 3 min

> Fabián lee cada pregunta en voz alta y da la palabra. Respuestas de una o dos frases: el detalle ya está en la diapositiva. En la emoción (P2), cada uno dice **su** palabra real; las de aquí son solo ideas.

### Diapositiva 21 · Sprint 4, P1 a P3

**FABIÁN:** “Ahora las preguntas de la Review. Sprint 4: ¿qué aprendimos?”
**YERSON (P1):** “Que separar la lógica la vuelve fácil de probar, y que una regla tiene que ser igual en la pantalla, el modelo y el servidor.”
**FABIÁN:** “¿Qué emoción predominó?”
**TODOS (P2):** una palabra cada uno, por ejemplo “satisfacción”, “confianza”, “orgullo”, “solidaridad”.
**FABIÁN:** “Y algo de alerta por los choques de versiones. ¿Cómo nos sentimos con la nueva forma de trabajar?”
**JORMAN (P3):** “Más cómodos y organizados: sprints cortos, Miro con límite de tareas y una retro que convierte los problemas en acciones.”

### Diapositiva 22 · Sprint 4, P4 a P6

**FABIÁN (P4):** “¿Impedimentos? Coordinar ramas entre cinco, las versiones y las fechas, y las tres ausencias del 30 de octubre.”
**JUAN DIEGO (P5):** “¿Qué puede hacer para ayudarnos? Profe, decirnos si el cuadre en partes iguales y el mes que no se reabre es lo que esperaba. Y lo nuestro era cumplir el plan de la retro, que ya cumplimos.”
**YERSON (P6):** “¿Y el valor? Que un hogar sabe en segundos quién le paga a quién y cierra el mes sin discusiones. Con eso llegamos al 76 % del proyecto.”

### Diapositiva 23 · Sprint 5, P1 a P3

**FABIÁN:** “Mismas preguntas para el Sprint 5. ¿Aprendizajes?”
**DANIEL (P1):** “Que la seguridad no se supone, se prueba atacando: desde la app todo se veía bien y había 13 huecos.”
**YERSON:** “Y que un CSV ‘sencillo’ tiene sus trampas: tildes, comillas y fórmulas.”
**TODOS (P2):** una palabra cada uno, por ejemplo “tensión”, “alivio”, “orgullo”.
**FABIÁN (P3):** “Rigor y recta final, y al cerrar, alivio. ¿Y la forma de trabajar? Más seguros y coordinados: la Definition of Done volvió medibles los acuerdos y trabajamos en cinco frentes a la vez.”

### Diapositiva 24 · Sprint 5, P4 a P6

**DANIEL (P4):** “¿Impedimentos? El dashboard desconectado, que el emulador pide Java en cada computador, cerrar muy sobre la fecha y depender de la cuenta dueña de Firebase.”
**JUAN DIEGO (P5):** “Para ayudarnos, profe: su opinión sobre el CSV y el PDF, y si quiere la pantalla de categorías para el 21. Lo nuestro: desplegar, asegurar la API Key y probar en celular.”
**JORMAN (P6):** “¿El valor? Pasamos de una app que funciona a un producto robusto: 40 de 40 ataques bloqueados, aguanta carga y caídas de red, y exporta reportes. Ya vamos en el 88 % del proyecto.”

---

## Avance y cierre · ≈ 2½ min

### Diapositiva 25 · Gráfica de avance — Fabián · 0:45

**FABIÁN:** “Esta es la gráfica de avance. [señalar las barras] Cada barra son las historias cerradas en un sprint: en verde el 4 y en naranja el 5. [señalar la fila de acumulado] Y esta fila es la clave: después del Sprint 4 íbamos en 76 % y después del 5 en 88 %, 15 de 17 historias. Y en ningún sprint dejamos algo a medias.”

### Diapositiva 26 · 88 % — Jorman · 0:20

**JORMAN:** “En una sola cifra: 88 %. [señalar la barra] Los Sprints 4 y 5 aportaron casi un tercio del proyecto, y solo faltan 2 historias, que son las del Sprint 6.”

### Diapositiva 27 · Sprint 6 — Daniel · 0:30

**DANIEL:** “El Sprint 6 es desplegar y sustentar: publicar las reglas, subir la app a Firebase Hosting, probarla en celular y en computador, y llegar listos al 21 de noviembre.”

### Diapositiva 28 · Feedback — Juan Diego · 0:30 (+ lo que responda la profe)

**JUAN DIEGO:** “Profe, ahora sí, su turno. Nos sirve mucho saber cuatro cosas [señalar las tarjetas]: si el cuadre es como lo esperaba, si el CSV y el PDF le sirven, si prioriza la pantalla de categorías y qué le gustaría ver en la demo final. Todo lo que nos diga lo pasamos al backlog del Sprint 6.”

> Pausa. Dejar que la profe responda y que alguien tome nota.

### Diapositiva 29 · Cierre — Juan Diego y todos · 0:15

**JUAN DIEGO:** “Eso es todo de nuestra parte: dos sprints al 100 % y el 88 % del proyecto listo. Muchas gracias, profe.”
**TODOS:** “¡Gracias!”

---

## Si la profe pregunta…

| Pregunta posible | Responde | Respuesta corta |
|---|---|---|
| ¿Por qué un algoritmo Greedy? | Yerson | “Garantiza máximo N − 1 transferencias, es fácil de probar y para hogares de hasta 6 personas sobra. No necesitamos librerías.” |
| ¿Qué pasa si dos personas marcan el mes al tiempo? | Daniel | “Se guarda una sola liquidación: el ID es fijo por mes y se guarda con runTransaction.” |
| ¿Y si se equivocaron después de saldar? | Juan Diego | “El mes no se reabre: se registra una transacción correctiva en el mes actual. Así queda auditable.” |
| ¿Cómo saben que las reglas son seguras? | Daniel | “Las atacamos en el emulador de Firestore: 40 ataques, los 40 bloqueados, y los 6 flujos normales siguen funcionando.” |
| ¿Qué es la inyección de fórmulas en un CSV? | Yerson | “Si una descripción empieza con =, +, − o @, Excel la puede ejecutar como fórmula. Le anteponemos un apóstrofo para que quede como texto.” |
| ¿Funciona sin internet? | Fabián | “Consultar, filtrar y exportar, sí. Guardar, no, para no perder datos. Y si la red falla un momento, reintenta sola.” |
| ¿Usaron inteligencia artificial? | Fabián | “Sí, como apoyo, y quedó registrado en las bitácoras. Aceptamos el patrón Greedy, rechazamos librerías externas y la idea de reabrir meses, y todo lo validamos con pruebas.” |
| ¿Dónde está eso en el código? | Quien sepa | Cuadre: `src/utils/cuadre.js` · liquidaciones: `src/services/liquidaciones.js` · categorías: `src/services/categorias.js` · red: `src/services/conexion.js` · CSV: `src/utils/exportador.js` · impresión: `public/style.css` · reglas: `firestore.rules` |

## Si les dan menos tiempo (≈ 18 min)

- Pasen rápido, con una sola frase, la agenda (3), la retro (12), los acuerdos (17) y el 88 % (26).
- Demos: solo los pasos 1, 3 y 6 del Sprint 4, y los pasos 1, 4 y 6 del Sprint 5.
- Preguntas de la Review: una frase por respuesta y la emoción en una sola ronda rápida.
