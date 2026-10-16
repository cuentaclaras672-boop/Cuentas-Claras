# Cuentas Claras 🏠💳
**Plataforma Web para la Gestión de Finanzas Compartidas en el Hogar**

Aplicación web desarrollada como proyecto de ingeniería de sistemas bajo el marco de trabajo ágil (**Scrum**). Diseñada con una arquitectura modular por capas en Vanilla JavaScript (ES6+) y Tailwind CSS, respaldada por Firebase SDK v10 como Backend as a Service (BaaS).

---

## 📌 1. La Propuesta

La convivencia en pareja y las relaciones interpersonales (familiares o amigos) suelen deteriorarse e incluso terminar debido a la mala gestión del dinero y la falta de acuerdos financieros. Al compartir una vida, surge la necesidad de dividir equitativamente gastos comunes (arriendo, servicios, mercado) y establecer fondos conjuntos (para un activo, viajes), además de lidiar con préstamos informales a terceros que rara vez se devuelven. 

Llevar este control en libretas, actualizando tablas de cálculo de forma manual o revisando múltiples aplicaciones bancarias dispersas resulta desgastante, genera desconfianza y provoca discusiones por la falta de claridad sobre *"quién puso qué"* y con cuánto dinero real se cuenta.

---

## 🔍 2. A quién observamos y qué aprendimos

Observamos a parejas jóvenes que recién inician la convivencia (basado en nuestra propia experiencia directa) y a personas que prestan dinero a su círculo cercano. 

Aprendimos que el principal detonante de los problemas no es la falta de ingresos, sino la falta de claridad y herramientas para conciliar las cuentas. Descubrimos que tener la información financiera descentralizada impide visualizar cuánto dinero es de uso personal y cuánto está comprometido para las responsabilidades conjuntas o metas a corto plazo (como el fondo de citas).

---

## 🎯 3. Product Goal

> **Lograr que las parejas y usuarios individuales centralicen la gestión de sus compromisos financieros (gastos compartidos, metas de ahorro y control de préstamos a terceros), reduciendo el estrés y el tiempo de cuadre de cuentas a menos de 5 minutos semanales, y logrando un registro activo de al menos el 80% de sus movimientos financieros al finalizar las 16 semanas del semestre.**

---

## 📋 4. Product Backlog y Estado de Historias de Usuario (Scrum)

El backlog del producto se encuentra organizado, estimado en Story Points (escala Fibonacci) y clasificado por valor y dependencia técnica:

| ID | Historia de Usuario | Story Points | Condición Técnica Vinculada | Sprint | Estado de Entrega |
|:---:|---|:---:|:---:|:---:|:---:|
| **HU-01** | **Autenticación y Control de Acceso:** registro e inicio de sesión seguro con Firebase Auth. | 5 SP | Condición #2 (Control de Acceso) | 1 | ✅ **Terminado (Done - S1)** |
| **HU-02** | **Registro de Transacciones:** persistencia NoSQL de ingresos/gastos personales y compartidos. | 5 SP | Condición #1 (Persistencia Real) | 1 | ✅ **Terminado (Done - S1)** |
| **HU-03** | **Dashboard de Saldo Líquido:** balance neto consolidado e ingresos vs. gastos en tiempo real. | 5 SP | Product Goal (Valor Núcleo) | 1 | ✅ **Terminado (Done - S1)** |
| **HU-04** | **Bolsillos de Ahorro con Metas:** separación de fondos con barra de progreso y deducción de saldo. | 8 SP | Condición #1 (Persistencia Real) | 2 | ✅ **Terminado (Done - S2)** |
| **HU-05** | **Historial y Búsqueda Avanzada:** filtros combinados por texto, categoría, tipo, ámbito y fechas. | 5 SP | Condición #4 (Filtrado y Búsqueda) | 2 | ✅ **Terminado (Done - S2)** |
| **HU-06** | **Integración Externa TRM y Divisas:** consumo de API pública con respaldo y conversión COP/USD. | 5 SP | Condición #3 (API Externa) | 2 | ✅ **Terminado (Done - S2)** |
| **HU-07** | **Resiliencia y Avisos Offline:** banner de desconexión, validaciones por campo y Toasts contextuales. | 3 SP | Condición #5 (Manejo de Errores) | 2 | ✅ **Terminado (Done - S2)** |
| **HU-08** | **Préstamos a Terceros con Abonos:** seguimiento de cuentas por cobrar y abonos atómicos. | 8 SP | Refuerzo #1 y #4 | 3 | 🟡 **En Desarrollo (Backend y QA Done)** |
| **HU-09** | **Hogar Compartido entre Convivientes:** código de 6 letras y aislamiento estricto de datos. | 5 SP | Refuerzo #2 (Seguridad RBAC) | 3 | 🟡 **En Desarrollo (Backend y QA Done)** |
| **HU-10** | **Gráfica de Gastos por Categoría:** visualización de barras horizontales nativas en Tailwind CSS. | 3 SP | Refuerzo #4 (Filtrado y Agrupación) | 3 | ✅ **Terminado (Done - S3)** |

> El detalle de criterios de aceptación, Definition of Ready (DoR) y Definition of Done (DoD) de cada historia se encuentra documentado en [docs/acta-planning-sprint2.md](docs/acta-planning-sprint2.md) y [docs/acta-planning-sprint3.md](docs/acta-planning-sprint3.md).

---

## 🛠️ 5. Cumplimiento de las Siete Condiciones Técnicas

| # | Condición Técnica | Implementación en Cuentas Claras | Módulos Responsables | Verificación Automatizada |
|---|---|---|---|---|
| **1** | **Persistencia Real** | Almacenamiento persistente en Cloud Firestore para transacciones, bolsillos y préstamos. Prohibido `localStorage` para balances. Sincronización en tiempo real (`onSnapshot`) y transacciones atómicas (`runTransaction`). | [`src/services/firestore.js`](src/services/firestore.js)<br>[`src/services/prestamos.js`](src/services/prestamos.js) | [`tests/pruebas-bolsillos.test.js`](tests/pruebas-bolsillos.test.js)<br>[`tests/pruebas-prestamos.test.js`](tests/pruebas-prestamos.test.js) |
| **2** | **Sesión o Control de Acceso** | Autenticación con Firebase Auth SDK v10 (email y contraseña), aislamiento estricto por UID y privacidad de movimientos compartidos en el hogar mediante reglas de backend en `firestore.rules`. | [`src/services/auth.js`](src/services/auth.js)<br>[`src/services/hogares.js`](src/services/hogares.js)<br>[`firestore.rules`](firestore.rules) | [`tests/pruebas-hogares.test.js`](tests/pruebas-hogares.test.js) (Pruebas de aislamiento y prueba negativa) |
| **3** | **Integración Externa** | Consumo asíncrono vía `fetch` de API pública de indicadores económicos (TRM del dólar oficial) con estrategia de failover (3 endpoints), timeout de 5 s y fallback referencial offline. | [`src/services/indicadores.js`](src/services/indicadores.js) | [`tests/pruebas-indicadores.test.js`](tests/pruebas-indicadores.test.js) (Simulación de caída de red) |
| **4** | **Consulta con Filtrado** | Historial interactivo con búsqueda en tiempo real insensible a tildes, filtros combinados por ámbito, tipo, categoría y rango de fechas, más gráfica de gastos reactiva a los filtros. | [`src/ui/dashboard.js`](src/ui/dashboard.js)<br>[`src/utils/estadisticas.js`](src/utils/estadisticas.js) | [`tests/pruebas-filtros.test.js`](tests/pruebas-filtros.test.js)<br>[`tests/pruebas-grafica.test.js`](tests/pruebas-grafica.test.js) |
| **5** | **Manejo de Errores Visible** | Captura defensiva de fallos con `try/catch`, proyectados en pantalla mediante notificaciones flotantes contextuales (Toasts), validaciones en rojo por campo y banner persistente ante pérdida de conexión a Internet. | [`src/ui/notificaciones.js`](src/ui/notificaciones.js)<br>[`src/services/conexion.js`](src/services/conexion.js) | [`tests/pruebas-conexion.test.js`](tests/pruebas-conexion.test.js) (Simulación de modo offline y campos vacíos) |
| **6** | **Repositorio de Código** | Repositorio formal en GitHub con trazabilidad de commits semánticos, ramas de trabajo, contribuciones individuales y suite de pruebas automatizadas con ejecutor maestro (`tests/runner.js`). | Control de versiones Git / GitHub | [`tests/runner.js`](tests/runner.js) (7 suites · 100% PASS) |
| **7** | **Documentación Técnica** | Documentación exhaustiva en `README.md` junto con los artefactos formales de gestión ágil en la carpeta `docs/` (Actas de Planning, Bitácoras de seguimiento, Dailies, DoD/DoR, Registro de IA e Informes de QA). | [`README.md`](README.md)<br>[`docs/`](docs/) | [`docs/informe-pruebas-sprint2.md`](docs/informe-pruebas-sprint2.md)<br>[`docs/informe-pruebas-sprint3.md`](docs/informe-pruebas-sprint3.md) |

---

## 🏛️ 6. Arquitectura de Software por Capas

El proyecto implementa una estricta **Separación de Responsabilidades (SoC - Separation of Concerns)** para garantizar alta cohesión, bajo acoplamiento y facilidad de mantenimiento:

```
cuentas-claras/
├── public/                 # Capa de Presentación Estática (Cliente)
│   ├── index.html          # Interfaz de usuario (Autenticación y Dashboard)
│   ├── style.css           # Estilos personalizados y utilidades de Tailwind
│   └── assets/             # Recursos multimedia e iconografía
├── src/                    # Código Fuente Modular (ES6+ Modules)
│   ├── models/             # CAPA DE DOMINIO
│   │   ├── Transaccion.js  # Entidad Transaccion, categorías y validación defensiva
│   │   ├── Bolsillo.js     # Entidad Bolsillo con metas de ahorro (HU-04)
│   │   ├── Prestamo.js     # Entidad Prestamo con abonos parciales (HU-08)
│   │   └── Hogar.js        # Entidad Hogar y membresía de convivientes (HU-09)
│   ├── services/           # CAPA DE INFRAESTRUCTURA (Conexión Externa)
│   │   ├── auth.js         # Firebase Auth (Registro, Login, Logout, Observer)
│   │   ├── firestore.js    # Firebase Firestore (Transacciones, bolsillos y Real-time)
│   │   ├── prestamos.js    # Préstamos a terceros y abonos parciales (HU-08)
│   │   ├── hogares.js      # Hogar compartido: crear, unirse con código y salir (HU-09)
│   │   ├── indicadores.js  # API externa de la TRM con respaldos y tiempo límite
│   │   └── conexion.js     # Detección de conexión online / offline (HU-07)
│   ├── ui/                 # CAPA DE PRESENTACIÓN (Manipulación del DOM)
│   │   ├── ui-auth.js      # Formularios de acceso y alternancia de vistas
│   │   ├── dashboard.js    # Renderizado reactivo de tarjetas y tabla con filtros
│   │   └── notificaciones.js # Notificaciones flotantes (Toasts) para errores visibles
│   ├── utils/              # CAPA TRANSVERSAL
│   │   ├── formateo.js     # Formato de divisa (COP), fechas y parseo seguro
│   │   └── estadisticas.js # Agregación de gastos y cálculo de porcentajes (HU-10)
│   └── app.js              # Orquestador del ciclo de vida de la aplicación
├── docs/                   # Documentación de Gestión Ágil (Scrum)
│   ├── acta-planning.md    # Acta de Planning y Backlog Sprint 1
│   ├── acta-planning-sprint2.md # Acta de Planning y Backlog Sprint 2
│   ├── acta-planning-sprint3.md # Acta de Planning y Backlog Sprint 3
│   ├── bitacora-sprint1.md # Bitácora de seguimiento y Dailies Sprint 1
│   ├── bitacora-sprint2.md # Bitácora de seguimiento y Dailies Sprint 2
│   ├── bitacora-sprint3.md # Bitácora de seguimiento y Dailies Sprint 3
│   ├── informe-pruebas-sprint2.md # Certificación formal de pruebas QA Sprint 2
│   ├── informe-pruebas-sprint3.md # Certificación formal de pruebas QA Sprint 3
│   ├── definition-of-done.md # Criterios de calidad Definition of Done (DoD) y DoR
│   └── sprint-goals.md     # Metas consolidadas de los Sprints
├── tests/                  # SUITE AUTOMATIZADA DE PRUEBAS DE CALIDAD (QA)
│   ├── runner.js           # Orquestador maestro de pruebas (100% PASS)
│   ├── pruebas-bolsillos.test.js # Pruebas Tarea 4.4 (HU-04)
│   ├── pruebas-filtros.test.js   # Pruebas Tarea 5.4 (HU-05)
│   ├── pruebas-indicadores.test.js # Pruebas Tarea 6.4 (HU-06)
│   ├── pruebas-conexion.test.js  # Pruebas Tarea 7.4 (HU-07)
│   ├── pruebas-prestamos.test.js # Pruebas Tarea 8.4 (HU-08)
│   ├── pruebas-hogares.test.js   # Pruebas Tarea 9.4 (HU-09)
│   └── pruebas-grafica.test.js   # Pruebas Tarea 10.3 (HU-10)
└── README.md               # Documentación general del proyecto
```

---

## 🔥 7. Configuración del Entorno Firebase

La conexión con Firebase se realiza mediante el SDK modular v10. Para configurar el proyecto:

1. Crear un proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
2. Habilitar **Firebase Authentication** con el proveedor de **Correo electrónico / Contraseña**.
3. Crear una base de datos **Cloud Firestore** en modo de producción. Las colecciones `transacciones`, `bolsillos`, `prestamos` y `hogares` se crean solas al guardar el primer documento.
4. Registrar una aplicación web en Firebase y verificar que las credenciales en [`src/services/auth.js`](src/services/auth.js) coincidan con el proyecto:

```javascript
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

5. Publicar las reglas de seguridad: en la consola, **Firestore Database → Reglas**, pegar el contenido de [`firestore.rules`](firestore.rules) y pulsar **Publicar**. Mientras no se publiquen, la consola sigue usando las reglas anteriores y las colecciones nuevas responden `permission-denied`.

---

## 💻 8. Ejecución en Entorno Local

Dado que la aplicación emplea módulos nativos de JavaScript (`import`/`export`), debe ejecutarse mediante un servidor HTTP local para cumplir con las directivas CORS del navegador:

### Usando Visual Studio Code
- Instalar la extensión **Live Server**.
- Hacer clic derecho sobre [`public/index.html`](public/index.html) y seleccionar **"Open with Live Server"**.

### Usando Node.js
```bash
npx serve .
```
Acceder a: `http://localhost:3000/public/index.html`

### Usando Python
```bash
python -m http.server 8000
```
Acceder a: `http://localhost:8000/public/index.html`

### Ejecución de Pruebas Automatizadas (QA)
Para ejecutar la suite integral de pruebas unitarias, de integración y de seguridad:
```bash
node tests/runner.js
```
Ejecuta las 7 suites automatizadas de los Sprints 2 y 3, verificando el 100% de los criterios de aceptación (CA) sin dependencias externas.

> [!IMPORTANT]
> **Condición de Entrada a la Sustentación (Lineamientos de la Asignatura):** El software debe correr localmente y sin errores de consola. De lo contrario, de acuerdo con la normativa innegociable de la cátedra TIC42695, la sustentación no se califica.

---

## 👥 9. Equipo de Desarrollo y Accesos de Evaluación

| Integrante | Rol en el Proyecto |
|---|---|
| **Juan Diego Peraza Amado** | Product Owner / Desarrollo Frontend |
| **Fabián Eduardo Córdoba** | Scrum Master / Calidad y Gestión Ágil |
| **Daniel Felipe Cortes** | Development Team / Integración de Servicios |
| **Jorman Palacios Murillo** | Development Team / UI & Experiencia de Usuario |
| **Yerson Niño Guerrero** | Development Team / Modelado de Datos y Dominio |

🔗 **Accesos del Proyecto:**
*   **Repositorio GitHub:** [Cuentas-Claras.git](https://github.com/cuentaclaras672-boop/Cuentas-Claras.git)
*   **Tablero de Gestión (Scrum/Kanban):** [Tablero en Miro](https://miro.com/welcomeonboard/YVBLdkdFZm96Ujdjb2tKRFFuZVA2QUQrOVdFbDc2dzRHU0tZT0hvRG1lVVNiSVNISHJyNVJZbFJyeHBRZUYzaEFqcnFuQWhJZzlBeExhYTVhUTlpdjB4SGhFS2dFNjFZcjlwNHpIa3pXblhlbVRYam1ERGtKMnpDSzhINDFZWUtyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=694372715874)
*   **Nota sobre el tablero:** usamos Miro porque Planner requiere licencia premium; el docente lo autorizó. Límite WIP: máximo 5 tareas en "En progreso" en todo el equipo y máximo 3 por persona.

---

## 📄 10. Licencia
Proyecto desarrollado con fines académicos bajo licencia MIT.