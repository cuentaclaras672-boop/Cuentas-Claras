# Guion de la Sprint Review — Sprints 4 y 5

**Proyecto:** Cuentas Claras — Plataforma web para la gestión de finanzas compartidas en el hogar
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · 2026-2
**Stakeholder:** Prof. Vilma Yenny Bohórquez
**Duración objetivo del video:** 52–53 minutos (la entrega exige entre 45 y 60)
**Diapositivas:** [Review Sprints 4 y 5 — Cuentas Claras](https://claude.ai/artifact/TcU2QDeGfaE3NdCsubG9mA) (29 diapositivas; este mismo guion está en las notas del orador de cada una)

> Cómo usar este guion: cada integrante busca su nombre en la tabla de reparto, ensaya sus partes en voz alta y llega a la grabación con su pestaña o archivo abierto. No hay que leerlo palabra por palabra: es una base para decirlo con sus propias palabras. En las preguntas de **emoción (P2)**, cada uno debe decir **su emoción real**; las frases del guion son solo sugerencias.

---

## 1. Antes de grabar (15 minutos antes)

1. **Servidor local** en la raíz del proyecto:
   ```bash
   python3 -m http.server 8000
   ```
2. **Pestañas abiertas en el navegador de quien comparte pantalla:**
   - Pestaña 1: las diapositivas, en modo presentación.
   - Pestaña 2: `http://localhost:8000/public/index.html` con la sesión iniciada y **F12 → Console** abierta (debe verse sin errores).
   - Pestaña 3 (ventana de incógnito): el **segundo conviviente** del mismo hogar, para mostrar la sincronización en tiempo real.
   - Pestaña 4: repositorio en GitHub y tablero en Miro (por si preguntan).
3. **Datos de prueba listos:** un hogar con 2 convivientes y varios gastos **compartidos** en el mes actual, pagados por personas distintas, y el mes **sin saldar** todavía (si ya está saldado, usar otro mes).
4. **Terminal** abierta en la carpeta del proyecto para correr `node tests/runner.js` (Fabián).
5. **Excel o LibreOffice** abierto para el CSV (Yerson) y `docs/auditoria-seguridad-sprint5.md` abierto (Daniel).
6. **Grabación:** Meet, Teams u OBS, con **las 5 cámaras** y el nombre de cada integrante visible. Cada persona dice su nombre la primera vez que habla.
7. **Plan B:** grabar antes un video corto (1–2 minutos) de cada demo por si falla internet o Firebase durante la grabación.

---

## 2. Reparto por integrante

| Integrante | Rol | Diapositivas donde habla | Tiempo aprox. | Debe tener listo |
|---|---|---|---:|---|
| **Juan Diego Peraza** | Product Owner | 1, 2, 4, 6, 9, 11 (pasos 4–5), 17, 18 (paso 6), 22 (P5), 24 (P5), 28, 29 | ~11 min | Formulario con botón “+ Nueva”; botón “Imprimir / PDF” |
| **Fabián Córdoba** | Scrum Master · QA | 2, 3, 5, 13, 15, 18 (paso 3), 19, modera 21–24 (P4 S4, P3 S5), 25 | ~12 min | Terminal con `node tests/runner.js` |
| **Daniel Cortes** | Servicios e infraestructura | 2, 8, 12, 14, 18 (pasos 1–2), 20, 23 (P1), 24 (P4), 27 | ~12 min | F12 → Network → Offline; `firestore.rules`; informe de auditoría |
| **Jorman Palacios** | Interfaz | 2, 10, 11 (pasos 1–3 y 6), 18 (paso 4), 21 (P3), 24 (P6), 26 | ~8 min | Panel “Mi Hogar”; segunda ventana; botón “Exportar CSV” |
| **Yerson Niño** | Dominio y datos | 2, 7, 16, 18 (paso 5), 21 (P1), 22 (P6), 23 (P1) | ~8 min | `src/utils/cuadre.js` en el editor; Excel para abrir el CSV |

*Todos* participan además en la presentación inicial (diapositiva 2), en las dos rondas de **emoción (P2)** y en la despedida.

---

## 3. Cronograma minuto a minuto

| # | Diapositiva | Minuto | Duración | Presenta |
|---:|---|:---:|:---:|---|
| 1 | Portada | 00:00 | 1:00 | Juan Diego |
| 2 | Equipo Scrum | 01:00 | 1:40 | Todos |
| 3 | Agenda | 02:40 | 0:50 | Fabián |
| 4 | Problema y Product Goal | 03:30 | 1:15 | Juan Diego |
| 5 | Hoja de ruta S1–S6 | 04:45 | 1:00 | Fabián |
| 6 | Sprint 4: objetivo y resultado | 05:45 | 1:00 | Juan Diego |
| 7 | HU-11: ejemplo del cuadre | 06:45 | 2:30 | Yerson |
| 8 | HU-11: cómo lo garantizamos | 09:15 | 2:00 | Daniel |
| 9 | HU-12: categorías personalizadas | 11:15 | 1:30 | Juan Diego |
| 10 | HU-13: límite de 120 caracteres | 12:45 | 1:15 | Jorman |
| 11 | **Demo en vivo Sprint 4** | 14:00 | 5:00 | Jorman y Juan Diego |
| 12 | Retrospectiva del Sprint 4 | 19:00 | 1:30 | Daniel |
| 13 | Sprint 5: objetivo y resultado | 20:30 | 1:00 | Fabián |
| 14 | HU-14: auditoría de seguridad | 21:30 | 2:30 | Daniel |
| 15 | HU-14: carga y resiliencia | 24:00 | 2:00 | Fabián |
| 16 | HU-15: reportes CSV y PDF | 26:00 | 2:00 | Yerson |
| 17 | Acuerdos de la retro cumplidos | 28:00 | 1:00 | Juan Diego |
| 18 | **Demo en vivo Sprint 5** | 29:00 | 6:00 | Daniel, Fabián, Jorman, Yerson, Juan Diego |
| 19 | Impedimentos superados | 35:00 | 2:00 | Fabián |
| 20 | Dependencias y riesgos abiertos | 37:00 | 2:00 | Daniel |
| 21 | Preguntas S4 (P1–P3) | 39:00 | 2:15 | Yerson, todos, Jorman |
| 22 | Preguntas S4 (P4–P6) | 41:15 | 2:00 | Fabián, Juan Diego, Yerson |
| 23 | Preguntas S5 (P1–P3) | 43:15 | 2:15 | Daniel, Yerson, todos, Fabián |
| 24 | Preguntas S5 (P4–P6) | 45:30 | 2:00 | Daniel, Juan Diego, Jorman |
| 25 | Gráfica de avance | 47:30 | 2:00 | Fabián |
| 26 | 88 % del proyecto | 49:30 | 0:45 | Jorman |
| 27 | Sprint 6: próximos pasos | 50:15 | 1:00 | Daniel |
| 28 | Feedback del stakeholder | 51:15 | 1:00 | Juan Diego |
| 29 | Cierre | 52:15 | 0:30 | Juan Diego y todos |
| | **Total** | | **≈ 52:45** | |

> **Control de tiempo:** si en el minuto 20:30 todavía no han empezado el Sprint 5, acorten la retro (diapositiva 12). Si al terminar quedan por debajo de 45 minutos, alarguen las demos (mostrar más casos) o las respuestas de las preguntas; **nunca entreguen un video de menos de 45:00**.

---

## 4. Guion completo, diapositiva por diapositiva


### Bloque 1 · Apertura

#### 1. Portada

*PRESENTA: JUAN DIEGO (Product Owner) · 1:00 · minuto 00:00*

> Antes de hablar: cámaras de los 5 integrantes visibles. Compartir pantalla con esta portada.

**JUAN DIEGO:** “Buenos días, profesora Vilma, y bienvenidos a la Sprint Review de los Sprints 4 y 5 de Cuentas Claras. Soy Juan Diego Peraza Amado, Product Owner del equipo.

Cuentas Claras es una plataforma web para que las parejas y las personas que conviven manejen sus gastos compartidos, sus metas de ahorro y los préstamos a terceros, sin discusiones por el dinero.

En esta ceremonia vamos a mostrar lo que construimos entre el 17 de octubre y el 13 de noviembre: las cinco historias que terminamos, una demo en vivo de cada una, las dependencias, impedimentos y riesgos que enfrentamos, y cómo vamos frente al proyecto completo. Como ven en el anillo, ya cerramos el 88 % de las historias del backlog.

Al final le vamos a pedir su retroalimentación como stakeholder. Primero, cada integrante se presenta.”


#### 2. Equipo Scrum

*PRESENTAN: TODOS · 1:40 · minuto 01:00*

> Cada persona habla ~20 segundos y prende su cámara al hablar.

**JUAN DIEGO:** “Yo soy Juan Diego Peraza, Product Owner. En el Sprint 4 integré las categorías personalizadas en el formulario, y en el Sprint 5 hice la vista de impresión a PDF, la función normalizarFecha y la integración final del código en main.”

**FABIÁN:** “Soy Fabián Eduardo Córdoba, Scrum Master y líder de calidad. Facilité los dailies y las retrospectivas, diseñé las pruebas del cuadre mensual y las pruebas de carga de 50 operaciones simultáneas, y certifiqué la suite completa de pruebas.”

**DANIEL:** “Soy Daniel Felipe Cortes, desarrollador de servicios e infraestructura. Construí el servicio de liquidaciones, hice la auditoría de seguridad de las reglas de Firestore y el manejo de caídas de red.”

**JORMAN:** “Soy Jorman Palacios Murillo, desarrollador de interfaz. Hice el panel del cuadre mensual, el contador de caracteres de la descripción y diseñé los botones de exportar e imprimir.”

**YERSON:** “Soy Yerson Niño Guerrero, desarrollador de dominio y datos. Programé el algoritmo que calcula quién le debe a quién, el servicio de categorías y diseñé el formato del archivo CSV.”


#### 3. Agenda

*PRESENTA: FABIÁN (Scrum Master) · 0:50 · minuto 02:40*

**FABIÁN:** “Gracias. Como Scrum Master les cuento cómo va a ir la sesión. Son alrededor de 53 minutos en siete bloques.

Primero el contexto: el problema y la hoja de ruta. Luego el Sprint 4, con sus tres historias y su demo en vivo. Después el Sprint 5, con sus dos historias y su demo. Luego revisamos con transparencia las dependencias, impedimentos y riesgos. Después respondemos las seis preguntas de la Review, una vez para cada sprint. Mostramos la gráfica de avance del proyecto y cerramos con el plan del Sprint 6 y su retroalimentación.

En la parte de abajo de cada diapositiva verán quién está presentando.”


#### 4. Problema y Product Goal

*PRESENTA: JUAN DIEGO (Product Owner) · 1:15 · minuto 03:30*

**JUAN DIEGO:** “Recordemos por qué existe Cuentas Claras. Observamos parejas que empiezan a convivir —partiendo de nuestra propia experiencia— y personas que le prestan dinero a su círculo cercano.

Lo que aprendimos es que el problema casi nunca es la falta de ingresos: es la falta de claridad. Estas tres preguntas [señalar las tarjetas] son las que generan las discusiones: quién puso qué, cuánto dinero es personal y cuánto es del hogar, y cuándo me devuelven lo que presté.

De ahí sale nuestro Product Goal: que las parejas y los usuarios centralicen sus compromisos financieros —gastos compartidos, metas de ahorro y préstamos a terceros—, reduciendo el tiempo de cuadre de cuentas a menos de 5 minutos por semana y registrando al menos el 80 % de sus movimientos al final de las 16 semanas del semestre.

Los Sprints 4 y 5 atacan directamente la meta de los 5 minutos: en el Sprint 4 el cuadre mensual se volvió automático, y en el Sprint 5 el sistema quedó blindado y con reportes para descargar.”


#### 5. Hoja de ruta S1–S6

*PRESENTA: FABIÁN (Scrum Master) · 1:00 · minuto 04:45*

**FABIÁN:** “Esta es la hoja de ruta del semestre: seis sprints de dos semanas cada uno.

Los Sprints 1, 2 y 3 construyeron la base: el acceso seguro, el registro de transacciones y el saldo; los bolsillos de ahorro, la búsqueda avanzada, la TRM y el modo sin conexión; y luego los préstamos a terceros, el hogar compartido y la gráfica de gastos.

Hoy revisamos los dos sprints resaltados: el Sprint 4, del 17 al 30 de octubre, y el Sprint 5, del 31 de octubre al 13 de noviembre. Los dos se cerraron al 100 %.

En total, de los Sprints 1 a 5 entregamos 81 de 81 story points comprometidos. El Sprint 6 arrancó hoy, 14 de noviembre, y se enfoca en desplegar la aplicación y preparar la sustentación final del 21 de noviembre.”


### Bloque 2 · Sprint 4

#### 6. Sprint 4: objetivo y resultado

*PRESENTA: JUAN DIEGO (Product Owner) · 1:00 · minuto 05:45*

**JUAN DIEGO:** “Empezamos con el Sprint 4, del 17 al 30 de octubre. Este fue nuestro Sprint Goal: [leer la cita en voz alta].

Para lograrlo comprometimos tres historias de usuario: la HU-11, cuadre mensual y liquidación entre convivientes, de 8 puntos y la más importante; la HU-12, categorías personalizadas, de 5 puntos; y la HU-13, límite de descripción, de 3 puntos.

El resultado: 3 de 3 historias terminadas, 16 de 16 story points, 8 de 8 tareas cerradas y 9 de 9 suites de pruebas aprobadas. El Sprint Goal se cumplió al 100 %.

Ahora cada responsable explica su historia. Empieza Yerson con el cuadre mensual.”


#### 7. HU-11: ejemplo del cuadre mensual

*PRESENTA: YERSON (Dominio y datos) · 2:30 · minuto 06:45*

> Esta diapositiva avanza con clics: Paso 2 y Paso 3 aparecen al hacer clic.

**YERSON:** “La HU-11 es el corazón del producto: responder ‘¿quién le debe a quién?’ al final del mes. Lo explico con un ejemplo.

Paso 1. Ana, Luis y Sofía viven juntos. En noviembre Ana pagó el arriendo, 450 mil pesos; Luis hizo el mercado, 240 mil; y Sofía pagó los servicios, 60 mil. En total el hogar gastó 750 mil.

[clic] Paso 2. Dividimos en partes iguales: 750 mil entre 3 son 250 mil por persona. Luego a cada uno le restamos la cuota a lo que pagó. Ana pagó 200 mil de más, así que le deben 200 mil. Luis debe 10 mil y Sofía debe 190 mil.

[clic] Paso 3. El algoritmo empareja a quien más debe con quien más le deben. Sofía le transfiere 190 mil a Ana y Luis le transfiere 10 mil a Ana. Con eso todos quedan en cero, y solo se necesitaron dos transferencias.

Esto es un algoritmo codicioso, o Greedy: ordena a los deudores y a los acreedores y siempre genera como máximo N menos 1 transferencias; aquí, 2 para 3 personas. Si todos aportaron lo mismo, muestra que el hogar está en equilibrio y no hay transferencias.

Lo programé en src/utils/cuadre.js, en la función calcularCuadreMes, como una función pura: no toca la base de datos ni la pantalla. Por eso la podemos probar en milisegundos con cualquier caso: pareja, tres o más convivientes, o equilibrio.”

> Opcional: mostrar 20 segundos el archivo src/utils/cuadre.js en el editor.


#### 8. HU-11: cómo lo garantizamos

*PRESENTA: DANIEL (Servicios e infraestructura) · 2:00 · minuto 09:15*

**DANIEL:** “Gracias, Yerson. Yo me encargué de que ese cálculo se guarde de forma segura en Firestore. Hay tres garantías.

Primera: el cálculo es puro y está probado. Como no depende de la red ni de la pantalla, lo verificamos en la suite tests/pruebas-liquidaciones.test.js con parejas, hogares de tres o más personas y casos en equilibrio.

Segunda: un solo cierre por mes. Cada liquidación tiene un identificador fijo, que es el código del hogar más el año y el mes. Y se guarda con runTransaction, una transacción atómica. Si dos convivientes pulsan ‘Marcar mes como saldado’ al mismo tiempo, solo se crea una liquidación; la segunda ve que ya existe.

Tercera: el cierre es inmutable. En firestore.rules, solo un miembro del hogar puede crear la liquidación, la fecha la pone el servidor, se permiten máximo 5 transferencias, y nadie puede editarla ni borrarla.

Esto fue una decisión de producto que tomamos con el Product Owner: un mes saldado no se reabre. Si alguien se equivocó, registra una transacción correctiva en el mes actual. Así el historial queda auditable, como en contabilidad.

En pantalla, Jorman construyó el panel: el selector de mes, el desglose de cuánto pagó cada conviviente, las transferencias sugeridas y el sello de ‘Mes saldado’, que vamos a ver en la demo.”

> Opcional: mostrar src/services/liquidaciones.js (marcarLiquidacionSaldada) y el bloque match /liquidaciones de firestore.rules.


#### 9. HU-12: categorías personalizadas

*PRESENTA: JUAN DIEGO (Product Owner) · 1:30 · minuto 11:15*

**JUAN DIEGO:** “La HU-12 nace de algo simple: las categorías por defecto no cubren la vida de cada hogar. Alguien necesita ‘Mascotas’, otro ‘Gimnasio’ o ‘Universidad’.

Funciona en tres pasos. Uno: junto al selector de categoría del formulario hay un botón ‘+ Nueva’. Dos: el nombre debe tener entre 3 y 40 caracteres y toma el tipo que esté elegido, gasto o ingreso; si no cumple, aparece un aviso. Tres: la categoría queda disponible de inmediato en el formulario y también en el filtro del historial.

La privacidad está garantizada en el servidor: cada categoría queda ligada al UID de quien la creó, y la regla de Firestore solo deja leerla o modificarla a su dueño. Yerson programó el servicio categorias.js y Daniel las reglas.

Y queremos ser transparentes con una cosa: las operaciones de editar y eliminar categorías ya están implementadas en el servicio y protegidas en las reglas, pero todavía no hay una pantalla para gestionarlas. Es una mejora pequeña de experiencia de usuario que le vamos a consultar al final, profesora, para saber si la prioriza.”


#### 10. HU-13: límite de 120 caracteres

*PRESENTA: JORMAN (Interfaz) · 1:15 · minuto 12:45*

**JORMAN:** “La HU-13 protege la calidad de los datos. La descripción de una transacción tiene un mínimo de 3 y un máximo de 120 caracteres.

A la izquierda ven cómo lo vive el usuario: mientras escribe, debajo del campo aparece un contador, por ejemplo ‘Quedan 79 caracteres’, y el campo no le deja escribir más de 120. El contador es accesible: está conectado al campo con aria-describedby, para que un lector de pantalla también lo anuncie.

Lo importante es la columna de la derecha: la misma regla está en tres capas. En la pantalla, con maxlength en el HTML. En el modelo, con la constante MAX_DESCRIPCION en Transaccion.js, que valida antes de enviar nada a la red. Y en el servidor, en firestore.rules.

Así, aunque alguien intente saltarse la interfaz y escribir directamente en la base de datos, el servidor rechaza el dato. Aprendimos que una regla tiene que ser idéntica en el cliente, el modelo y el servidor para no tener rechazos inesperados.”


#### 11. Demo en vivo del Sprint 4

*PRESENTAN: JORMAN y JUAN DIEGO · 5:00 · minuto 14:00*

> Cambiar a la pestaña de la aplicación en vivo. Tener la consola F12 abierta en la pestaña Console. Tener una segunda ventana (incógnito) con el otro conviviente del mismo hogar.

**JORMAN:** “Ahora la demo en vivo del Sprint 4. Estoy en la aplicación con la sesión iniciada y, como ven, la consola del navegador no muestra errores.

[Paso 1] Entro a la sección ‘Mi Hogar’ y en el selector de periodo elijo el mes actual.

[Paso 2] Aquí está el panel del cuadre: el total de gastos compartidos del mes, la cuota que le toca a cada persona, cuánto pagó cada conviviente —si le deben, si debe o si está al día— y las transferencias sugeridas, que son exactamente las que calculó el algoritmo que explicó Yerson.

[Paso 3] Pulso ‘Marcar mes como saldado’ y confirmo. Aparece el sello ‘Mes saldado’. Y si miramos la otra ventana, la del otro conviviente, se actualizó en tiempo real. Si intentáramos marcarlo otra vez, no se crea una segunda liquidación.”

**JUAN DIEGO:** “[Paso 4] Ahora las categorías personalizadas. En el formulario de nueva transacción pulso ‘+ Nueva’. Primero pruebo un nombre de dos letras, ‘Ab’… y sale el aviso: el nombre debe tener entre 3 y 40 caracteres.

[Paso 5] Ahora escribo ‘Mascotas’. Se crea, queda seleccionada en el formulario y, si voy al historial, también aparece en el filtro de categorías.”

**JORMAN:** “[Paso 6] Por último, el contador. Escribo una descripción y ven cómo baja en vivo: ‘Quedan 100 caracteres’, ‘Quedan 80’… Si pego un texto muy largo, el campo se detiene en 120 caracteres. Con esto quedan demostradas las tres historias del Sprint 4.”

> PLAN B: si falla internet o Firebase, mostrar capturas o un video corto grabado antes con estos mismos 6 pasos y decirlo en voz alta.


#### 12. Retrospectiva del Sprint 4

*PRESENTA: DANIEL (Servicios e infraestructura) · 1:30 · minuto 19:00*

**DANIEL:** “Al cerrar el Sprint 4 hicimos la retrospectiva con la dinámica del barco. Yo la co-facilité con Juan Diego porque ese día Fabián tuvo una ausencia justificada.

Lo que nos impulsó: tener la lógica del cuadre separada como función pura, que pudimos probar sin red; usar la misma regla en el HTML, el modelo y el servidor; y las transacciones atómicas, que evitaron cierres duplicados.

Lo que nos frenó, nuestras anclas: primero, las fechas llegaban en tres formatos distintos —objetos Date, Timestamp de Firestore y objetos con seconds—, y eso causaba errores al filtrar por mes. Segundo, un commit importó Firebase 10.8.0 mientras el resto del proyecto usaba 10.13.0, lo que puede crear dos instancias de la base de datos. Tercero, sincronizar las ramas de cinco personas trabajando en paralelo.

Como riesgos vimos la carga de varios convivientes escribiendo al mismo tiempo, posibles huecos de permisos en las seis colecciones y las ausencias imprevistas.

De ahí salió el plan para el Sprint 5, la columna verde: crear una función única de fechas, volver obligatoria la versión 10.13.0 en la Definition of Done, auditar la seguridad y hacer pruebas de estrés, y hacer git pull diario para que todos dominemos todo el código. En unos minutos les mostramos que lo cumplimos.”


### Bloque 3 · Sprint 5

#### 13. Sprint 5: objetivo y resultado

*PRESENTA: FABIÁN (Scrum Master) · 1:00 · minuto 20:30*

**FABIÁN:** “Pasamos al Sprint 5, del 31 de octubre al 13 de noviembre. Con el núcleo del producto listo, el foco fue la robustez. Este fue el Sprint Goal: [leer la cita en voz alta].

Comprometimos dos historias: la HU-14, auditoría de seguridad, pruebas de carga y resiliencia en red, de 8 puntos; y la HU-15, exportación de reportes del hogar en CSV y PDF, de 5 puntos. Además nos comprometimos a cumplir los acuerdos de la retrospectiva del Sprint 4.

El resultado: 2 de 2 historias, 13 de 13 story points, 6 de 6 tareas, 12 de 12 suites de pruebas en verde y 46 de 46 casos aprobados en el emulador de Firestore. El Sprint Goal se cumplió al 100 %.

Daniel nos explica la auditoría de seguridad.”


#### 14. HU-14: auditoría de seguridad

*PRESENTA: DANIEL (Servicios e infraestructura) · 2:30 · minuto 21:30*

**DANIEL:** “En la HU-14 nos pusimos en el papel de un atacante. Las reglas de Firestore son la última defensa: si alguien se salta nuestra interfaz y usa el SDK directamente con su propia sesión, lo único que lo detiene son esas reglas.

Así que escribimos 40 ataques directos y los ejecutamos contra el emulador oficial de Firestore. A la derecha ven ejemplos: leer o escribir datos de otro usuario u otro hogar, reescribir los abonos anteriores de un préstamo, meter campos extra en un bolsillo o una categoría, o mandar montos absurdos y nombres sin límite de tamaño.

Cuando empezamos, las reglas bloqueaban 27 de los 40 ataques. Es decir, había 13 brechas. Las encontramos y las corregimos en las seis colecciones: transacciones, bolsillos, préstamos, hogares, liquidaciones y categorías. Y al final del archivo agregamos una regla que niega todo lo que no esté explícitamente permitido.

Resultado: 40 de 40 ataques bloqueados con permission-denied. Y algo igual de importante: los 6 flujos legítimos —crear, leer y abonar como usuario normal— siguen funcionando. Es decir, cerramos sin romper nada.

Además alineamos las validaciones del cliente con las del servidor; por ejemplo, el nombre de un bolsillo ahora es de 3 a 40 caracteres en la pantalla, en el modelo y en las reglas.

Todo quedó automatizado en tests/emulador/auditoria-reglas.mjs y documentado en docs/auditoria-seguridad-sprint5.md.”


#### 15. HU-14: carga y resiliencia

*PRESENTA: FABIÁN (Scrum Master y QA) · 2:00 · minuto 24:00*

**FABIÁN:** “La otra mitad de la HU-14 es que el sistema aguante carga y fallas de red. Yo diseñé las pruebas de carga.

Pensamos en el peor caso de un hogar: muchos convivientes haciendo lo mismo al mismo tiempo. Primero, 50 abonos simultáneos al mismo préstamo: se procesaron todos sin ninguna condición de carrera, es decir, el saldo final es exactamente el esperado, y en menos de 2 milisegundos, cuando la meta del criterio de aceptación era menos de 500. Segundo, 50 personas intentando cerrar el mismo mes al mismo tiempo: se guardó una sola liquidación y las otras 49 se bloquearon. Nunca hay doble cierre.

A la derecha está la resiliencia, que implementó Daniel en conexion.js. Uno: antes de guardar, la app revisa si hay conexión. Dos: si no hay red, aparece el banner ‘Sin conexión a Internet, modo solo lectura’ y se deshabilitan los botones de guardar, para no dejar operaciones colgadas; pero el usuario puede seguir consultando, filtrando y exportando. Tres: si la red falla solo un momento, la app reintenta sola hasta tres veces, esperando 0,4 segundos y luego 0,8, con un tope de 4 segundos. Si el error es de permisos, no reintenta: lo informa de inmediato.

Esto se aplicó en los cinco servicios que escriben en la base de datos. Todo está cubierto en las suites pruebas-seguridad-carga y pruebas-resiliencia, que vamos a correr en vivo en la demo.”


#### 16. HU-15: reportes CSV y PDF

*PRESENTA: YERSON (Dominio y datos) · 2:00 · minuto 26:00*

**YERSON:** “La HU-15 responde a una necesidad real: sacar la información del hogar para guardarla o compartirla. La historia dice: como conviviente, quiero exportar el historial filtrado en CSV y generar un comprobante imprimible.

Todo parte de los filtros activos del historial. Si filtro por gastos compartidos de mercado en noviembre, eso y solo eso es lo que se exporta.

Opción uno, el botón ‘Exportar CSV’. Yo diseñé el formato: siete columnas —fecha, descripción, monto, tipo, ámbito, categoría y autor— siguiendo el estándar RFC 4180, que define cómo escapar comas, comillas y saltos de línea. Le agregamos una marca BOM UTF-8 al inicio para que Excel en Windows muestre bien las tildes y la ñ. Y una medida de seguridad: si una descripción empieza con igual, más, menos o arroba, se neutraliza anteponiendo un apóstrofo, para que Excel no la ejecute como fórmula; eso se llama inyección de fórmulas CSV. El archivo se descarga con el nombre cuentas-claras-reporte y la fecha.

Opción dos, el botón ‘Imprimir / PDF’. Usa una hoja de estilos de impresión que oculta menús, botones y banners, y agrega una cabecera con el usuario, la fecha de generación, los filtros y la divisa. Desde el diálogo del navegador se guarda como PDF, sin librerías externas.

Y las dos opciones funcionan sin internet, porque trabajan con los datos que ya están cargados en pantalla. La lógica del CSV está en src/utils/exportador.js, separada de la pantalla, y se prueba en tests/pruebas-exportador.test.js.”


#### 17. Acuerdos de la retro cumplidos

*PRESENTA: JUAN DIEGO (Product Owner) · 1:00 · minuto 28:00*

**JUAN DIEGO:** “Algo que queremos resaltar, profesora: la retrospectiva del Sprint 4 no se quedó en el papel. Cumplimos cada acuerdo.

El ancla de las fechas se resolvió con una sola función, normalizarFecha, en formateo.js, que hoy usan las liquidaciones, el exportador y el dashboard. Yo la implementé.

El ancla de las versiones del SDK: todos los servicios importan Firebase 10.13.0 y la verificación quedó escrita en la Definition of Done, para que no vuelva a pasar.

Los riesgos de carga y seguridad se convirtieron en la HU-14, que ya vieron: 40 de 40 ataques bloqueados y 50 operaciones simultáneas sin conflictos.

El riesgo de que solo algunos conozcan el código lo trabajamos con git pull diario y un mapa de módulos; y la prueba es que hoy presentamos los cinco integrantes.

Y como extra, Daniel adelantó la configuración de despliegue del Sprint 6: firebase.json, .firebaserc y la guía de despliegue, listos desde el 13 de noviembre.”


#### 18. Demo en vivo del Sprint 5

*PRESENTAN: DANIEL, FABIÁN, JORMAN, YERSON y JUAN DIEGO · 6:00 · minuto 29:00*

> Tener abiertos: la app con F12, una terminal en la carpeta del proyecto, Excel o LibreOffice y el archivo docs/auditoria-seguridad-sprint5.md.

**DANIEL:** “[Paso 1] Empezamos la demo del Sprint 5 con la resiliencia. Abro las herramientas de desarrollo, pestaña Network, y cambio a Offline. Aparece arriba el banner ‘Sin conexión a Internet: modo solo lectura’ y los botones de guardar quedan deshabilitados. Pero puedo seguir consultando el historial y usando los filtros. Vuelvo a Online… y todo se reactiva solo.

[Paso 2] Aquí está firestore.rules: cada colección valida quién es el dueño, los campos permitidos y los tamaños, y al final está la regla que niega todo lo demás. Y este es el informe de la auditoría: 46 casos, 40 ataques bloqueados y 6 flujos legítimos aprobados.”

**FABIÁN:** “[Paso 3] Ahora corro la suite completa en la terminal: node tests/runner.js. [Esperar ~2 segundos.] Ahí está: 12 suites, 12 aprobadas, 0 fallidas, 100 % de éxito. Miren estas líneas: la ráfaga de 50 abonos concurrentes, sin condiciones de carrera; la idempotencia, con 1 cierre consolidado y 49 bloqueados; y la prueba de normalizarFecha.”

**JORMAN:** “[Paso 4] Ahora los reportes. En el historial aplico un filtro, por ejemplo ámbito Compartido. El listado se reduce. Estos botones de la cabecera los diseñé yo: pulso ‘Exportar CSV’ y se descarga el archivo.”

**YERSON:** “[Paso 5] Lo abro en Excel. Fíjense que las tildes y la ñ se ven bien gracias al BOM UTF-8, que están las siete columnas y que solo aparecen los movimientos que estaban filtrados.”

**JUAN DIEGO:** “[Paso 6] Y por último pulso ‘Imprimir / PDF’. La vista previa sale limpia: sin menús ni botones, con la cabecera del reporte —usuario, fecha y filtros— y fondo blanco. Desde aquí se guarda como PDF. Con esto quedan demostradas las dos historias del Sprint 5.”

> PLAN B: si no hay internet, el paso 1 igual funciona (modo offline); los pasos 3, 4, 5 y 6 también funcionan sin conexión.


### Bloque 4 · Dependencias, impedimentos y riesgos

#### 19. Impedimentos superados

*PRESENTA: FABIÁN (Scrum Master) · 2:00 · minuto 35:00*

**FABIÁN:** “Como Scrum Master me toca hablar con transparencia de los impedimentos. Estos son los que tuvimos y cómo los manejamos.

En el Sprint 4: primero, el 30 de octubre, día de la Review presencial, tres integrantes —Jorman, Yerson y yo— tuvimos una ausencia justificada por fuerza mayor. Juan Diego y Daniel sustentaron todo el incremento gracias a que el código es de todos. Por eso hoy presentamos los cinco.

Segundo, un commit importó Firebase 10.8.0 mientras el resto usaba 10.13.0; se resolvió en el Sprint 5 con una versión única verificada en la Definition of Done. Tercero, las fechas llegaban en formatos distintos; también se resolvió con normalizarFecha. Cuarto, sincronizar el trabajo de cinco personas en Git: lo mitigamos haciendo git pull de main antes de cada jornada. Y como barrera organizativa, no teníamos licencia de Microsoft Planner, así que, con autorización de la profesora, migramos el tablero a Miro.

En el Sprint 5: al probar el arranque después de un refactor, encontramos que el dashboard no tenía conectadas las funciones de categorías y liquidaciones, lo que podía generar un error al abrir el cuadre. Daniel lo corrigió el 3 de noviembre. Y la consola de Firebase mostró un aviso de que retiran Dynamic Links; revisamos auth.js y confirmamos que solo usamos correo y contraseña, así que no nos afecta.”


#### 20. Dependencias y riesgos abiertos

*PRESENTA: DANIEL (Servicios e infraestructura) · 2:00 · minuto 37:00*

**DANIEL:** “Y estas son las dependencias y riesgos que siguen abiertos hacia el Sprint 6, con lo que estamos haciendo para controlarlos.

La dependencia más importante: para publicar las reglas endurecidas y desplegar la aplicación necesitamos la cuenta propietaria del proyecto de Firebase. Si las reglas nuevas no se publican, producción seguiría con las reglas viejas. Lo vamos a hacer en una sesión conjunta en la tarea 16.3, con la guía de despliegue ya lista.

Un riesgo activo: vamos a restringir la API Key para que solo funcione desde nuestro dominio. Si queda mal configurada, la autenticación falla con el error unauthorized-domain justo en la demo. Por eso hay un checklist en la guía y lo vamos a probar en la URL pública antes del 21.

Otro riesgo en mitigación: el Sprint 5 cerró muy ajustado, el 13 y 14 de noviembre, y no alcanzamos a probar en celular. Jorman y Yerson harán las pruebas de aceptación en móvil y escritorio del 16 al 20 de noviembre.

Una dependencia documentada: para repetir la auditoría en otro computador se necesita Java y hacer npm install en la carpeta del emulador; está el paso a paso en el README y además hay una prueba estática que corre sin emulador.

Un riesgo aceptado: para poder unirse a un hogar con su código de 6 caracteres, cualquier usuario autenticado puede consultar un hogar si adivina el código; la probabilidad es de 1 entre más de 2 millones y está documentado.

Y una decisión de alcance pendiente: la pantalla para editar y borrar categorías, que le vamos a consultar a la profesora al final.”


### Bloque 5 · Preguntas de la Review

#### 21. Preguntas del Sprint 4 (P1–P3)

*PREGUNTAS SPRINT 4 (1 de 2) · 2:15 · minuto 39:00*

> Fabián lee cada pregunta en voz alta y da la palabra.

**FABIÁN:** “Ahora respondemos las seis preguntas de la Review, primero para el Sprint 4. Pregunta uno: ¿cuáles fueron los principales aprendizajes?”

**YERSON (P1):** “Aprendimos tres cosas. Uno: separar la lógica del cuadre como función pura nos dejó probar parejas, hogares de tres o más y casos en equilibrio en milisegundos, sin depender de la red. Dos: en una base NoSQL la idempotencia no es automática; la logramos combinando un ID fijo por mes con una transacción atómica y reglas que no permiten editar. Y tres: una regla como el límite de 120 caracteres tiene que ser idéntica en el HTML, en el modelo y en el servidor, si no aparecen rechazos tardíos. Y como equipo aprendimos que todos debemos dominar todo el código: el 30 de octubre dos compañeros sostuvieron la Review solos.”

**FABIÁN:** “Pregunta dos: ¿cuál fue la emoción que predominaba? Una frase cada uno.”

**TODOS (P2)** — cada uno dice SU emoción real en una frase. Sugerencias:

- JUAN DIEGO: “Satisfacción: ver el cuadre resolviendo en un clic lo que antes era una discusión.”
- DANIEL: “Confianza: llevábamos cuatro sprints seguidos al 100 %.”
- JORMAN: “Orgullo de ver el panel del cuadre funcionando con datos reales.”
- YERSON: “Emoción cuando el algoritmo dio las transferencias correctas a la primera prueba.”
- FABIÁN (cierra): “Y solidaridad: cuando tres no pudimos estar el 30 de octubre, el equipo respondió. También hubo alerta por los choques de versiones y de fechas, que nos obligaron a ser más rigurosos.”

**FABIÁN:** “Pregunta tres: ¿cómo se sienten con la nueva forma de trabajar?”

**JORMAN (P3):** “Nos sentimos cómodos y más maduros. Los sprints de dos semanas nos dan metas claras; el tablero en Miro con límite de trabajo en progreso —máximo cinco tareas del equipo y dos por persona— evita que abramos mil cosas a la vez; y la arquitectura por capas nos deja trabajar en paralelo sin pisarnos. La retrospectiva del barco nos ayudó mucho: convertimos lo que nos frenaba en acciones concretas. Y usamos la IA de forma crítica: aceptamos el patrón Greedy, pero rechazamos librerías externas y la idea de reabrir un mes saldado.”


#### 22. Preguntas del Sprint 4 (P4–P6)

*PREGUNTAS SPRINT 4 (2 de 2) · 2:00 · minuto 41:15*

**FABIÁN (P4):** “Pregunta cuatro, los impedimentos. Me toca a mí. Tuvimos cuatro: sincronizar las ramas de cinco personas trabajando en paralelo, lo que nos obligó a hacer git pull de main antes de cada jornada; la versión mezclada del SDK de Firebase; las fechas en varios formatos; y casos borde como hogares de una sola persona o montos inválidos, que exigieron proteger divisiones por cero. Como barreras organizativas: la ausencia justificada de tres integrantes el 30 de octubre y que no teníamos licencia de Microsoft Planner, así que migramos a Miro con autorización de la profesora.”

**FABIÁN:** “Pregunta cinco: ¿qué puedo hacer para ayudar a continuar impactando los objetivos?”

**JUAN DIEGO (P5):** “Lo respondemos en dos partes. A usted, profesora, como stakeholder, le pedimos validar si el cuadre mensual —división en partes iguales y mes saldado inmutable— cubre lo que espera, y decirnos qué escenarios críticos quiere ver probados. Y como equipo, nuestro compromiso para el Sprint 5 fue ejecutar el plan de la retro: crear normalizarFecha, fijar la versión del SDK en la Definition of Done, auditar las seis colecciones con pruebas de carga y hacer git pull diario. Ya vieron que lo cumplimos.”

**FABIÁN:** “Pregunta seis: ¿dónde está el valor capturado?”

**YERSON (P6):** “El valor está en el núcleo del Product Goal. Con la HU-11, una pareja o un grupo de convivientes pasa de hacer cuentas a mano en una libreta o en Excel a saber en segundos quién le paga a quién y cuánto, y a cerrar el mes de forma auditable. Con la HU-12 cada usuario adapta las categorías a su vida. Y con la HU-13 los datos quedan íntegros. En números: 16 story points entregados y el proyecto pasó al 76 % de las historias cerradas, 13 de 17.”


#### 23. Preguntas del Sprint 5 (P1–P3)

*PREGUNTAS SPRINT 5 (1 de 2) · 2:15 · minuto 43:15*

> Fabián lee cada pregunta y da la palabra.

**FABIÁN:** “Ahora las mismas seis preguntas para el Sprint 5. Pregunta uno: ¿cuáles fueron los principales aprendizajes?”

**DANIEL (P1, primera parte):** “El mayor aprendizaje fue que la seguridad no se supone, se demuestra atacando. Desde la interfaz todo parecía bien, pero al atacar las reglas directamente con el emulador aparecieron 13 brechas, como poder reescribir abonos antiguos. También aprendimos a degradar con elegancia: bloquear las escrituras sin red, reintentar solo los fallos temporales y dejar activo lo que sí sirve sin conexión. Y que después de cada refactor hay que probar el arranque completo: así detectamos el dashboard sin conectar.”

**YERSON (P1, segunda parte):** “Y por el lado de los reportes, aprendimos que un CSV ‘simple’ tiene trampas: el estándar RFC 4180 para escapar comas y comillas, el BOM para que Excel lea bien las tildes y la inyección de fórmulas. Lo resolvimos sin ninguna librería externa.”

**FABIÁN:** “Pregunta dos: ¿cuál fue la emoción que predominaba? Una frase cada uno.”

**TODOS (P2)** — cada uno dice SU emoción real. Sugerencias:

- DANIEL: “Satisfacción al ver pasar de 27 a 40 ataques bloqueados.”
- YERSON: “Tranquilidad al ver el CSV abrir perfecto en Excel.”
- JORMAN: “Tensión al final, porque varias piezas se unieron el 13 y 14 de noviembre.”
- JUAN DIEGO: “Alivio cuando la suite completa dio 12 de 12 después de integrar todo.”
- FABIÁN (cierra): “En resumen: rigor y tensión de recta final, y al cerrar, alivio y orgullo por llegar al 88 % de las historias del proyecto.”

**FABIÁN (P3):** “Pregunta tres: ¿cómo nos sentimos con la nueva forma de trabajar? Me toca a mí. Nos sentimos más seguros y coordinados. La Definition of Done endurecida hizo que los acuerdos de la retro se volvieran cosas medibles en el código, no solo buenas intenciones. Y dividimos el sprint en cinco frentes que avanzaron en paralelo sin chocar: auditoría y resiliencia, pruebas de carga, el formato CSV, la interfaz de impresión y la integración final. Mantuvimos una arquitectura liviana en JavaScript puro y aun así llegamos a calidad de producción.”


#### 24. Preguntas del Sprint 5 (P4–P6)

*PREGUNTAS SPRINT 5 (2 de 2) · 2:00 · minuto 45:30*

**FABIÁN:** “Pregunta cuatro: los impedimentos y barreras organizativas.”

**DANIEL (P4):** “En el Sprint 5 tuvimos cinco. Uno: después del refactor del Sprint 4, el dashboard no tenía conectadas las funciones de categorías y liquidaciones; lo detectamos en el Daily 2 y lo corregí en el Daily 3. Dos: el emulador de Firestore necesita Java y npm install en cada computador, porque node_modules no se sube a Git. Tres: el aviso de Firebase sobre Dynamic Links, que nos obligó a revisar la autenticación; no nos afecta. Cuatro: varias piezas se integraron al límite del sprint, el 13 y 14 de noviembre. Y la barrera organizativa más importante: publicar las reglas y desplegar requiere la cuenta propietaria de Firebase; eso pasó de forma ordenada al Sprint 6.”

**FABIÁN:** “Pregunta cinco: ¿qué puedo hacer para ayudar?”

**JUAN DIEGO (P5):** “A usted, profesora, le pedimos retroalimentación sobre la estructura del CSV y sobre el reporte en PDF, y que nos diga si para la sustentación del 21 de noviembre quiere ver en pantalla la edición y eliminación de categorías, que ya existe en el servicio. Como equipo, nos comprometemos a hacer la sesión de despliegue, restringir la API Key, completar las pruebas de aceptación en celular y computador sobre la URL pública con la consola sin errores, y ensayar la sustentación.”

**FABIÁN:** “Y la última: ¿dónde está el valor capturado?”

**JORMAN (P6):** “En el Sprint 5 el proyecto pasó de funcionar a ser un producto robusto. Los datos financieros del hogar están blindados: 40 de 40 ataques bloqueados. Aguanta que muchos convivientes escriban a la vez sin conflictos y no pierde operaciones si se cae el internet. Y ahora el hogar puede llevarse su información en CSV para Excel o en PDF, incluso sin conexión. Además saldamos la deuda técnica del Sprint 4 y dejamos listo el despliegue. En números: 15 de 17 historias cerradas, el 88 %, y 81 de 94 story points, el 86 %.”


### Bloque 6 · Avance del proyecto y cierre

#### 25. Gráfica de avance

*PRESENTA: FABIÁN (Scrum Master) · 2:00 · minuto 47:30*

> Esta es la gráfica que pide el punto 6 de la entrega. La versión en imagen está en docs/grafica-avance-sprints-4-5.png.

**FABIÁN:** “Esta es la gráfica de avance. El backlog completo tiene 17 historias de usuario y 94 story points.

Las barras muestran cuántas historias cerramos en cada sprint: 3 en el Sprint 1, 4 en el Sprint 2, 3 en el Sprint 3. En verde, el Sprint 4, con 3 historias; en naranja, el Sprint 5, con 2. Y punteado, el Sprint 6, que tiene 2 historias en curso.

La primera fila de abajo dice qué porcentaje del proyecto aporta cada sprint. El Sprint 4 aportó el 17.65 % y el Sprint 5 el 11.76 %; juntos, 5 historias, el 29.41 % del proyecto.

La fila más importante es el acumulado: después del Sprint 4 íbamos en 76.47 % y después del Sprint 5 llegamos al 88.24 % de las historias, 15 de 17. En story points vamos en 81 de 94, el 86.17 %.

Y algo que nos enorgullece como equipo: en los cinco sprints entregamos el 100 % de lo comprometido; nunca dejamos una historia a medias.”


#### 26. 88 % del proyecto

*PRESENTA: JORMAN (Interfaz) · 0:45 · minuto 49:30*

**JORMAN:** “En una sola cifra: el 88 % de las historias del proyecto ya están terminadas, 15 de 17.

En esta barra, cada bloque es un sprint y su tamaño es el número de historias que cerró. Los Sprints 4 y 5, los que revisamos hoy, aportaron 5 historias y 29 story points: casi un tercio del proyecto, el 29.41 %.

En esfuerzo llevamos 81 de 94 story points, el 86 %. Y solo faltan 2 historias, con 13 story points, que son el Sprint 6 que ya arrancó. Daniel nos cuenta el plan.”


#### 27. Sprint 6: próximos pasos

*PRESENTA: DANIEL (Servicios e infraestructura) · 1:00 · minuto 50:15*

**DANIEL:** “El Sprint 6 arrancó hoy, 14 de noviembre, y termina el 27. Su objetivo es desplegar Cuentas Claras con las reglas publicadas y la API Key restringida, validar todo de punta a punta sin errores en consola y preparar la sustentación.

Tiene dos historias. La HU-16, despliegue en Firebase Hosting, de 8 puntos: la configuración y la guía ya las adelanté el 13 de noviembre; falta publicar las reglas, desplegar y restringir la API Key, que haremos con Juan Diego; y Jorman y Yerson harán las pruebas de aceptación en celular y computador sobre la URL pública.

La HU-17, de 5 puntos: el checklist y el ensayo de la demo con datos reales, y la retrospectiva final con el informe del Sprint 6, que coordina Fabián.

Las fechas clave: del 16 al 20 de noviembre las pruebas de aceptación; el 21 de noviembre el parcial de Corte III y la sustentación final; y el 27 el cierre documental.”


#### 28. Feedback del stakeholder

*PRESENTA: JUAN DIEGO (Product Owner) · 1:00 · minuto 51:15*

**JUAN DIEGO:** “Una Review no está completa sin la voz del stakeholder. Profesora, le queremos hacer cuatro preguntas.

Uno: sobre el cuadre mensual, ¿la división en partes iguales y que un mes saldado no se pueda reabrir cubren lo que usted espera, o le gustaría ver otra regla, por ejemplo división por porcentajes?

Dos: sobre los reportes, ¿le sirven la estructura del CSV y el reporte en PDF? ¿Agregaría alguna columna?

Tres: ¿quiere que prioricemos la pantalla para editar y borrar categorías antes de la sustentación del 21?

Y cuatro: ¿qué escenario le gustaría ver en la demo final?

Todo lo que nos diga lo registramos en el acta y lo convertimos en ítems del Product Backlog del Sprint 6.”

> NOTA PARA EL VIDEO: si la profesora no está en la grabación, Juan Diego plantea las preguntas y dice: “Estas preguntas las llevamos a la sustentación en clase para recibir su retroalimentación”. Si alguien de la clase actúa como stakeholder, dejar 1–2 minutos para sus respuestas.


#### 29. Cierre

*PRESENTA: JUAN DIEGO y TODOS · 0:30 · minuto 52:15*

**JUAN DIEGO:** “Con esto cerramos la Sprint Review de los Sprints 4 y 5. En resumen: los dos sprints se cerraron al 100 %, con 5 historias y 29 story points, y el proyecto quedó en el 88 % de sus historias, listo para desplegarse en el Sprint 6. El código y toda la documentación están en el repositorio. Muchas gracias, profesora.”

**TODOS (cada uno con cámara):** “¡Gracias!”

> Detener la grabación. Verificar que el video dure entre 45 y 60 minutos.


---

## 5. Consejos para la grabación

- **Hablen al stakeholder, no a la pantalla.** Expliquen el *para qué* antes del *cómo*: primero qué problema resuelve la historia y luego el código.
- **Cada cambio de presentador se anuncia:** “Ahora Daniel nos explica…”. Así queda claro en el video quién participa.
- **En las demos, narren lo que hacen** (“pulso…”, “ahora ven…”) y esperen un segundo después de cada clic para que se vea el resultado.
- **Si algo falla en vivo,** díganlo con calma, muestren el video de respaldo y sigan. Mostrar cómo se maneja un error también es parte de una Review honesta.
- **Preguntas de emoción (P2):** respuestas cortas y sinceras, una frase por persona.

## 6. Checklist de entrega

- [ ] Video entre **45:00 y 60:00** minutos, con audio claro y los **5 integrantes** identificados.
- [ ] Se ven las **5 historias** (HU-11 a HU-15) explicadas y en **demo en vivo**.
- [ ] Se muestran **dependencias, impedimentos y riesgos** (diapositivas 19 y 20).
- [ ] Se responden las **6 preguntas para el Sprint 4 y para el Sprint 5** (diapositivas 21 a 24).
- [ ] Se muestra la **gráfica** de historias cerradas por sprint y el **% del proyecto** (diapositivas 25 y 26; versión en imagen: `docs/grafica-avance-sprints-4-5.png`).
- [ ] Se sube el video y el material escrito (diapositivas en PDF y `docs/entrega-review-sprint4-y-sprint5.md`) en el aula virtual.
