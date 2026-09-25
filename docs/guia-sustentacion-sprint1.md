# Guía Maestra de Sustentación — Sprint 1
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas  
**Objetivo de este documento:** Explicar con precisión qué se hizo en cada Historia de Usuario y Tarea, qué archivo es responsable de cada parte del sistema, y cómo responder con éxito ante las pruebas de **Modificación de Código en Vivo (§7.2)** frente al docente evaluador.

---

## 🗺️ 1. Mapa Rápido de Archivos: ¿Dónde está qué?

Si el docente te pide abrir un archivo o cambiar algo de la interfaz, busca aquí de inmediato:

| Qué buscas cambiar / explicar | Archivo responsable | Ruta exacta |
|---|---|---|
| **La interfaz visual, HTML, formularios y tarjetas** | `index.html` | [`public/index.html`](file:///c:/Users/jdperaza/Cuentas_Claras/public/index.html) |
| **Estilos CSS personalizados y tema visual** | `style.css` | [`public/style.css`](file:///c:/Users/jdperaza/Cuentas_Claras/public/style.css) |
| **Lógica de botones de Login/Registro y cambios de vista** | `ui-auth.js` | [`src/ui/ui-auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/ui-auth.js) |
| **Pintar tarjetas de saldo, tabla de movimientos y filtros** | `dashboard.js` | [`src/ui/dashboard.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/dashboard.js) |
| **Las alertas flotantes Toasts (errores, éxitos)** | `notificaciones.js` | [`src/ui/notificaciones.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/notificaciones.js) |
| **Conexión con Firebase Auth (Login, Registro, Logout)** | `auth.js` | [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js) |
| **Guardar y leer de la base de datos Firestore** | `firestore.js` | [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js) |
| **Consumo de la API pública externa de la TRM del dólar** | `indicadores.js` | [`src/services/indicadores.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/indicadores.js) |
| **Reglas de negocio y estructura de una Transacción** | `Transaccion.js` | [`src/models/Transaccion.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/models/Transaccion.js) |
| **Formateo de moneda ($ COP) y fechas legibles** | `formateo.js` | [`src/utils/formateo.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/utils/formateo.js) |
| **El cerebro principal que arranca la aplicación** | `app.js` | [`src/app.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/app.js) |

---

## 🔍 2. Desglose por Historias de Usuario y Tareas

---

### 🛡️ [HU-01] Autenticación y Control de Acceso
> **Propósito:** Que el sistema identifique quién lo usa y aísle los datos de su hogar (Condición Técnica #2).

#### • Tarea 1.1: Configurar credenciales y SDK Firebase
- **Responsable:** Juan Diego Peraza (18 ago - 21 ago).
- **¿Qué se hizo?**: Se configuró el objeto `firebaseConfig` con las credenciales del proyecto de Google Cloud (`bdcuentasclaras-b1814`) y se importó el SDK modular v10 oficial mediante CDN sin necesidad de empaquetadores pesados.
- **¿Dónde está?**: En [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js) (Líneas 25 a 40).
- **Cómo defenderlo:** *"Se implementó un patrón Singleton usando `getApps().length` para garantizar que la conexión con Firebase se instancie una sola vez en toda la aplicación"*.

#### • Tarea 1.2: Diseñar formulario visual de Login en HTML/Tailwind
- **Responsable:** Juan Diego Peraza (20 ago - 23 ago).
- **¿Qué se hizo?**: Se maquetó la vista `#auth-view` con diseño moderno en modo oscuro (Dark Slate), inputs con validaciones HTML5 (`required`, `type="email"`, `minlength="6"`) y botones para alternar dinámicamente entre la vista de Login y Registro.
- **¿Dónde está?**: En [`public/index.html`](file:///c:/Users/jdperaza/Cuentas_Claras/public/index.html) (Líneas 45 a 145).
- **Cómo defenderlo:** *"Los formularios no recargan la página porque sus eventos `submit` son interceptados de forma asíncrona mediante JavaScript modular"*.

#### • Tarea 1.3: Lógica de autenticación con Firebase Auth
- **Responsable:** Juan Diego Peraza (23 ago - 27 ago).
- **¿Qué se hizo?**: Se construyeron las funciones asíncronas `iniciarSesion(email, password)` y `registrarUsuario(email, password, nombre)`. Incluyen validación defensiva con expresiones regulares (Regex) y mapeo de errores para traducir códigos crudos de Google (como `auth/wrong-password`) a mensajes amigables en español.
- **¿Dónde está?**: En [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js) (Líneas 95 a 160).
- **Cómo defenderlo:** *"El servicio de autenticación no toca el DOM; si ocurre un error, lanza una excepción tipificada que la capa visual captura y muestra en un Toast"*.

#### • Tarea 1.4: Persistencia de sesión y logout
- **Responsable:** Juan Diego Peraza (27 ago - 30 ago).
- **¿Qué se hizo?**: Se implementó el observador reactivo `suscribirEstadoAuth(callback)` envolviendo `onAuthStateChanged()`. Cuando el usuario inicia sesión o recarga la página, Firebase recupera su token y el orquestador conmuta la pantalla de Login al Dashboard. Al dar clic en "Salir", ejecuta `cerrarSesion()` y regresa al Login de forma instantánea.
- **¿Dónde está?**: En [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js) (Líneas 180 a 210) y orquestado en [`src/app.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/app.js) (Líneas 30 a 65).

---

### 💾 [HU-02] Registro de Transacciones con Persistencia Real
> **Propósito:** Que los ingresos y gastos se guarden permanentemente en la nube y sobrevivan al cerrar la página (Condición Técnica #1).

#### • Tarea 2.1: Definir colección transacciones en Firestore
- **Responsable:** Daniel Felipe Cortes / Juan Diego Peraza (21 ago - 24 ago).
- **¿Qué se hizo?**: Se diseñó la estructura del documento NoSQL en Cloud Firestore dentro de la colección `transacciones`. Cada documento almacena: `descripcion`, `monto` (número), `tipo` ('INGRESO'|'GASTO'), `ambito` ('PERSONAL'|'COMPARTIDO'), `categoria`, `creadoPor` (UID del usuario), `nombreUsuario` y `fecha` (Timestamp).
- **¿Dónde está?**: Definido formalmente en [`src/models/Transaccion.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/models/Transaccion.js) y consumido en [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js).

#### • Tarea 2.2: Modal y formulario para captura de montos y categorías
- **Responsable:** Jorman Palacios Murillo (24 ago - 27 ago).
- **¿Qué se hizo?**: Se construyó la sección `#form-transaccion` en el Dashboard. Cuando el usuario cambia el tipo entre "Gasto" e "Ingreso", el selector de categorías cambia dinámicamente mediante JavaScript para mostrar las categorías correspondientes (ej. Alimentación, Vivienda, Transporte para gastos; Salario, Honorarios para ingresos).
- **¿Dónde está?**: HTML en [`public/index.html`](file:///c:/Users/jdperaza/Cuentas_Claras/public/index.html) (Líneas 230 a 305) y lógica de selección en [`src/ui/dashboard.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/ui/dashboard.js) (función `poblarCategorias`).

#### • Tarea 2.3: Función de inserción `addDoc` a Firestore
- **Responsable:** Juan Diego Peraza (27 ago - 31 ago).
- **¿Qué se hizo?**: Se creó la función asíncrona `registrarTransaccion(transaccion)`. Recibe la instancia validada del modelo, la serializa mediante `.aFirestore()` y la envía a Cloud Firestore usando `addDoc(collection(db, "transacciones"), payload)`.
- **¿Dónde está?**: En [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js) (Líneas 65 a 95).
- **Cómo defenderlo:** *"No se almacena nada en arreglos temporales ni en `localStorage`. La inserción viaja de forma asíncrona a los servidores de Firestore y el listener reactivo actualiza la pantalla automáticamente"*.

#### • Tarea 2.4: Pruebas de persistencia ante recarga
- **Responsable:** Fabián Eduardo Córdoba (31 ago - 03 sep).
- **¿Qué se hizo?**: Pruebas de integridad consistentes en registrar movimientos, forzar el refresco de página (F5 o Ctrl+Shift+R) y verificar que los datos reaparecen intactos desde la base de datos sin pérdida de sincronía.

---

### 📊 [HU-03] Dashboard de Saldo Líquido
> **Propósito:** Mostrar de un vistazo cuánto dinero real tiene el hogar y la separación entre gastos personales y compartidos (Condición Técnica #4).

#### • Tarea 3.1: Diseñar tarjeta hero de Saldo Disponible y métricas
- **Responsable:** Jorman Palacios Murillo (26 ago - 29 ago).
- **¿Qué se hizo?**: Se construyó el grid superior con 4 tarjetas de métricas: **Balance Neto** (Ingresos - Gastos), **Ingresos Totales**, **Gastos Totales** y **Gastos del Hogar (Compartidos)**. Cada una cuenta con tipografía destacada y código de colores semántico (verde para positivo/ingreso, rojo para negativo/gasto, índigo para compartido).
- **¿Dónde está?**: En [`public/index.html`](file:///c:/Users/jdperaza/Cuentas_Claras/public/index.html) (Líneas 205 a 240).

#### • Tarea 3.2: Consulta reactiva `onSnapshot` a Firestore
- **Responsable:** Daniel Felipe Cortes (29 ago - 01 sep).
- **¿Qué se hizo?**: Se implementó `escucharTransacciones(usuarioId, onActualizacion, onError)`. Utiliza la tecnología WebSocket de Firebase (`onSnapshot`) filtrando por el UID del usuario (`where("creadoPor", "==", usuarioId)`). Cualquier cambio en la base de datos (registro nuevo o borrado) se refleja en milisegundos en la pantalla sin recargar.
- **¿Dónde está?**: En [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js) (Líneas 120 a 165).

#### • Tarea 3.3: Algoritmo de cálculo de saldos en JavaScript
- **Responsable:** Yerson Niño Guerrero (01 sep - 03 sep).
- **¿Qué se hizo?**: Función pura `calcularTotales(listaTransacciones)`. Itera la lista una sola vez ($O(n)$) sumando ingresos, egresos y acumulando por separado aquellos cuyo ámbito sea `COMPARTIDO`. Calcula el balance neto (`totalIngresos - totalGastos`).
- **¿Dónde está?**: En [`src/services/firestore.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/firestore.js) (Líneas 170 a 195).
- **Cómo defenderlo:** *"Es una función matemática pura: no muta datos externos, no depende del DOM y es 100% testeable de forma unitaria"*.

#### • Tarea 3.4: Pruebas de actualización de balance en vivo
- **Responsable:** Fabián Eduardo Córdoba / Juan Diego Peraza (03 sep - 05 sep).
- **¿Qué se hizo?**: Validación del renderizado condicional: si el Balance Neto es mayor o igual a 0 se tiñe de verde (`text-emerald-400`); si los gastos superan a los ingresos se tiñe de rojo (`text-rose-400`).

---

## ⚡ 3. Simulacros de Modificación en Vivo (§7.2)

En la sustentación, el docente te dará **15 a 20 minutos** para modificar algo en vivo. Aquí tienes las soluciones exactas a las peticiones más habituales:

### Simulacro 1: *"Cambien el diseño o color de una tarjeta o botón"*
- **Qué te piden:** Cambiar por ejemplo el botón "Guardar Movimiento" para que sea de color violeta o naranja en lugar de índigo, o agrandar una tarjeta.
- **Dónde ir:** Abre [`public/index.html`](file:///c:/Users/jdperaza/Cuentas_Claras/public/index.html).
- **Qué hacer:** Busca la línea del botón (aprox. línea 295):
  - Cambia `bg-indigo-600 hover:bg-indigo-500` por `bg-amber-600 hover:bg-amber-500` (naranja) o `bg-purple-600 hover:bg-purple-500` (violeta).
- **Tiempo que te tomará:** 30 segundos.

---

### Simulacro 2: *"Exijan una nueva regla de validación en el formulario"*
- **Qué te piden:** *"Exijan que el monto mínimo de una transacción sea de al menos $2.000 COP"*.
- **Dónde ir:** Abre [`src/models/Transaccion.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/models/Transaccion.js).
- **Qué hacer:** Ve al método `validar()` (alrededor de la línea 85).
  - Verás: `if (typeof this.monto !== 'number' || isNaN(this.monto) || this.monto <= 0)`
  - Cámbialo por:
    ```javascript
    if (typeof this.monto !== 'number' || isNaN(this.monto) || this.monto < 2000) {
      throw new Error('El monto mínimo para registrar un movimiento es de $ 2.000 COP.');
    }
    ```
- **Resultado:** Al intentar guardar un monto menor a 2.000, automáticamente saltará el Toast rojo en pantalla diciendo el mensaje exacto.
- **Tiempo que te tomará:** 1 minuto.

---

### Simulacro 3: *"Agreguen una nueva categoría de gasto"*
- **Qué te piden:** *"Añadan la categoría 'Gimnasio y Deporte' a las opciones de gasto"*.
- **Dónde ir:** Abre [`src/models/Transaccion.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/models/Transaccion.js).
- **Qué hacer:** En las primeras líneas (aprox. línea 30), busca el arreglo `CATEGORIAS_GASTO` y agrega `'Gimnasio y Deporte'`:
  ```javascript
  export const CATEGORIAS_GASTO = Object.freeze([
    'Vivienda y Alquiler',
    'Servicios Públicos',
    'Alimentación y Mercado',
    'Gimnasio y Deporte', // <-- AGREGADO AQUÍ
    ...
  ]);
  ```
- **Resultado:** Al recargar la página, el `<select>` del formulario mostrará inmediatamente la nueva categoría sin tocar nada de HTML. Demuestra la alta cohesión de tu modelo.

---

### Simulacro 4: *"Cambien las reglas de contraseña en el registro"*
- **Qué te piden:** *"Exijan que la contraseña tenga mínimo 8 caracteres en vez de 6"*.
- **Dónde ir:** Abre [`src/services/auth.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/services/auth.js).
- **Qué hacer:** Ve a la función `validarCredenciales` (alrededor de la línea 50):
  - Cambia `password.length < 6` por `password.length < 8`.
  - Cambia el mensaje: `"La contraseña debe tener al menos 8 caracteres."`
- **Tiempo que te tomará:** 45 segundos.

---

### Simulacro 5: *"Cambien el formato de la moneda o muestren centavos"*
- **Qué te piden:** *"Muestren centavos (decimales) en los valores monetarios"* o *"Cambien el símbolo a USD"*.
- **Dónde ir:** Abre [`src/utils/formateo.js`](file:///c:/Users/jdperaza/Cuentas_Claras/src/utils/formateo.js).
- **Qué hacer:** En `formatearMoneda()`:
  - Cambia `minimumFractionDigits: 0` a `minimumFractionDigits: 2`.
  - O cambia `currency: moneda` por `'USD'`.
- **Resultado:** Todas las tarjetas de saldo y registros de la tabla cambiarán de formato al instante en toda la aplicación.

---

## 🧠 4. Preguntas Frecuentes del Docente y Cómo Responderlas

1. **¿Por qué usaron Vanilla JS en lugar de React o Angular?**
   - *Respuesta:* *"Para este proyecto integrador priorizamos el control total del ciclo de vida y un rendimiento óptimo sin sobrecarga de empaquetadores (`node_modules`). Vanilla JS con módulos ES6 nativos nos permite demostrar una arquitectura por capas pura, donde la separación de responsabilidades y la modificación en vivo son transparentes y verificables línea por línea."*

2. **¿Dónde se guardan los datos si cierro el navegador?**
   - *Respuesta:* *"En Google Cloud Firestore, en la colección `transacciones`. Cumplimos la Condición Técnica #1 de persistencia real: no utilizamos memoria volátil ni `localStorage` para datos financieros. Al abrir la app en cualquier otro dispositivo con la misma cuenta, los datos se descargan de Firestore en tiempo real."*

3. **¿Cómo garantizan que la interfaz no se congele ante un error de red?**
   - *Respuesta:* *"Todos los llamados de red en `src/services/` están protegidos con bloques `try/catch`. Si la red falla o Firebase rechaza una operación, la promesa rechazada es interceptada y enviada a `src/ui/notificaciones.js`, la cual renderiza un Toast emergente flotante con el motivo del fallo, cumpliendo con la regla de manejo visible de errores."*
