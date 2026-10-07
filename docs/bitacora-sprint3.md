# Bitácora de Sprint 3 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 3 (Semanas 11 a 13: 12 de octubre al 31 de octubre de 2026)  
**Cierre:** Sprint Review y Retrospectiva internos (31 de octubre de 2026)  

---

## 1. Estado del Tablero (Miro)

Historias comprometidas en el Sprint 3. La columna de estado se actualiza a medida que avanza el sprint, igual que en Miro.

| Historia de Usuario | Condición técnica que refuerza | Story Points | Columna en Tablero |
|---|---|:---:|:---:|
| **HU-08: Préstamos a terceros con abonos parciales** | #1 (Persistencia) y #4 (Filtrado) | 8 SP | Por Hacer |
| **HU-09: Hogar compartido entre convivientes** | #2 (Control de acceso) | 5 SP | Por Hacer |
| **HU-10: Gráfica de gastos por categoría** | #4 (Filtrado) | 3 SP | Por Hacer |

---

### 1.1 Tareas del Sprint Backlog (detalle y criterios en el [Acta de Planning](acta-planning-sprint3.md))

| ID Tarea | Descripción | Responsable | Periodo | Estado en Miro |
|---|---|---|:---:|:---:|
| **Tarea 8.1** | Modelo `Prestamo.js` con validaciones y cálculo de saldo pendiente | Yerson Niño | 12 oct - 15 oct | Por Hacer |
| **Tarea 8.2** | Servicio Firestore: colección `prestamos`, abonos y reglas de seguridad | Daniel Cortes | 15 oct - 19 oct | Por Hacer |
| **Tarea 8.3** | Tarjetas de préstamos, formulario de abono, filtro por estado y tarjeta "Por cobrar" | Jorman Palacios | 19 oct - 23 oct | Por Hacer |
| **Tarea 8.4** | Pruebas: abonos parciales, abono mayor al pendiente y cambio a "Saldado" | Fabián Córdoba | 23 oct - 26 oct | Por Hacer |
| **Tarea 9.1** | Modelo `Hogar.js` y generación del código de invitación (6 caracteres) | Yerson Niño | 15 oct - 18 oct | Por Hacer |
| **Tarea 9.2** | Servicio de hogares (crear, unirse, salir) y reglas de seguridad | Daniel Cortes | 19 oct - 23 oct | Por Hacer |
| **Tarea 9.3** | Pantalla "Mi hogar" y etiqueta de autor en movimientos compartidos | Jorman Palacios | 23 oct - 27 oct | Por Hacer |
| **Tarea 9.4** | Pruebas con dos cuentas y prueba negativa con una tercera cuenta | Fabián Córdoba | 27 oct - 30 oct | Por Hacer |
| **Tarea 10.1** | Función pura que agrupa los gastos por categoría y calcula porcentajes | Yerson Niño | 21 oct - 23 oct | Por Hacer |
| **Tarea 10.2** | Gráfica de barras en Tailwind conectada a filtros y divisa | Juan Diego Peraza | 24 oct - 28 oct | Por Hacer |
| **Tarea 10.3** | Pruebas con filtros, cambio de divisa y estado vacío | Fabián Córdoba | 28 oct - 30 oct | Por Hacer |

---

### 1.2 Burndown del Sprint 3 (medido en tareas)
Total de tareas del sprint: **11**. Se mide al cierre de cada semana (sábado). "Ideal" baja de forma pareja; "Planificado" sale de la fecha de fin de cada tarea; "Real" se llena con lo que esté en "Terminado" en Miro ese día.

| Semana | Corte | Ideal (restantes) | Planificado (restantes) | Real (restantes) |
|:---:|:---:|:---:|:---:|:---:|
| Inicio | 12 oct | 11 | 11 | 11 |
| 11 | 17 oct | 7,3 | 10 | |
| 12 | 24 oct | 3,7 | 5 | |
| 13 | 31 oct | 0 | 0 | |

> El plan va por encima de la línea ideal en la semana 11 porque esa semana también se cierran los pendientes del Sprint 2 (ver sección 3.1 del acta) y solo termina una tarea nueva (8.1).

### 1.3 Velocidad
| Sprint | Duración | Historias terminadas | SP terminados |
|:---:|:---:|:---:|:---:|
| 1 | 2 semanas | 3 | 15 |
| 2 | 4 semanas | *(llenar con el resultado del Sprint Review 2)* | *(de 21 comprometidos)* |
| 3 | 3 semanas | *(llenar al cierre)* | *(de 16 comprometidos)* |

---

## 2. Registro de Dailies

*(Se registra durante el sprint. Formato por cada daily:)*

### Daily — [fecha]
- **Ayer:**
- **Hoy:**
- **Impedimentos:**

---

## 3. Registro de Uso de Inteligencia Artificial en el Sprint 3

### 3.1 ¿Qué le pedimos a la IA? (durante el planning)
1. Ideas para diseñar la colección `hogares` en Firestore y las reglas de seguridad para que los convivientes vean solo los movimientos compartidos.
2. Cómo calcular el saldo pendiente de un préstamo para que ningún abono lo deje en negativo.
3. Opciones para mostrar una gráfica de gastos por categoría sin agregar librerías al proyecto.

### 3.2 ¿Qué aceptamos?
- Hacer la gráfica con barras de HTML y Tailwind, sin librerías externas.
- Mostrar los préstamos aparte, en una tarjeta "Por cobrar", sin descontarlos del saldo disponible.
- Validar el hogar en dos niveles: el filtro en la consulta del cliente y las reglas de Firestore en el servidor.

### 3.3 ¿Qué rechazamos y por qué?
1. **Usar Chart.js u otra librería de gráficas:** el proyecto usa módulos ES6 sin empaquetador; una librería agregaba una dependencia para algo que se resuelve con barras de HTML.
2. **Permitir que un usuario esté en varios hogares a la vez:** exigía un selector de hogar en toda la app y reglas mucho más complejas. Con un solo hogar por usuario se cubre el caso real (una pareja que convive) con menos riesgo.

*(Agregar durante el sprint lo que se le pida a la IA al programar cada tarea.)*

---

## 4. Retrospectiva del Sprint 3 (llenar en la semana 13, antes del cierre)

| ¿Qué funcionó? | ¿Qué no funcionó? | Acción de mejora para el Sprint 4 | Responsable |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

> Cada acción de mejora debe ser concreta y verificable en el Sprint 4 (por ejemplo: "correr las pruebas de regresión antes de congelar la versión final", no "esforzarnos más").
