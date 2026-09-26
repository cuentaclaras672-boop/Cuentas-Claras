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

## 📋 4. Product Backlog Inicial

1. **Módulo de "Cajas / Bolsillos":** Separación y visualización de fondos con propósitos fijos (ej. citas, bebé, viajes, emergencias).
2. **Registro y Seguimiento de Préstamos Informales:** Control de estado de deudas y préstamos a amigos o familiares.
3. **Dashboard Centralizado:** Visualización en tiempo real del saldo consolidado del hogar, balance neto e ingresos vs. gastos.
4. **Control de Acceso Seguro:** Sistema de autenticación para que solo los miembros autorizados visualicen y gestionen la información financiera.

---

## 🛠️ 5. Cumplimiento de las Siete Condiciones Técnicas

| # | Condición Técnica | Implementación en Cuentas Claras | Módulo Responsable |
|---|---|---|---|
| **1** | **Persistencia Real** | Almacenamiento persistente en base de datos NoSQL Cloud Firestore. Prohibido el uso de memoria volátil o `localStorage` para balances financieros. Operaciones CRUD y sincronización en tiempo real (`onSnapshot`). | [`src/services/firestore.js`](src/services/firestore.js) |
| **2** | **Sesión o Control de Acceso** | Autenticación basada en Firebase Authentication SDK v10 (email y contraseña), asegurando la privacidad y el aislamiento de datos por usuario y hogar. | [`src/services/auth.js`](src/services/auth.js) |
| **3** | **Integración Externa** | Consumo asíncrono vía `fetch` de API pública de indicadores económicos (TRM del dólar en tiempo real) para fundamentar decisiones de ahorro en el hogar. | [`src/services/indicadores.js`](src/services/indicadores.js) |
| **4** | **Consulta con Filtrado** | Historial dinámico e interactivo de movimientos con capacidad de filtrado por ámbito (Personal / Compartido), tipo (Ingreso / Gasto) y categoría. | [`src/ui/dashboard.js`](src/ui/dashboard.js) |
| **5** | **Manejo de Errores Visible** | Captura defensiva de fallos de red, validaciones y base de datos con `try/catch`, proyectados en pantalla mediante notificaciones flotantes contextuales (Toasts). El usuario nunca experimenta pantallas en blanco. | [`src/ui/notificaciones.js`](src/ui/notificaciones.js) |
| **6** | **Repositorio de Código** | Repositorio formal en GitHub con trazabilidad de commits semánticos, ramas por funcionalidad y contribuciones individuales del equipo. | Control de versiones Git / GitHub |
| **7** | **Documentación Técnica** | Documentación exhaustiva en `README.md` junto con los artefactos de gestión ágil en la carpeta `docs/` (`acta-planning.md`, `definition-of-done.md`, `sprint-goals.md`). | [`README.md`](README.md) y [`docs/`](docs/) |

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
│   │   └── Transaccion.js  # Entidad Transaccion, categorías y validación defensiva
│   ├── services/           # CAPA DE INFRAESTRUCTURA (Conexión Externa)
│   │   ├── auth.js         # Firebase Auth (Registro, Login, Logout, Observer)
│   │   └── firestore.js    # Firebase Firestore (Persistencia y Real-time)
│   ├── ui/                 # CAPA DE PRESENTACIÓN (Manipulación del DOM)
│   │   ├── ui-auth.js      # Formularios de acceso y alternancia de vistas
│   │   ├── dashboard.js    # Renderizado reactivo de tarjetas y tabla con filtros
│   │   └── notificaciones.js # Notificaciones flotantes (Toasts) para errores visibles
│   ├── utils/              # CAPA TRANSVERSAL
│   │   └── formateo.js     # Formato de divisa (COP), fechas y parseo seguro
│   └── app.js              # Orquestador del ciclo de vida de la aplicación
├── docs/                   # Documentación de Gestión Ágil (Scrum)
│   ├── acta-planning.md    # Acta de Sprint Planning y Backlog priorizado
│   ├── definition-of-done.md # Criterios de calidad Definition of Done (DoD)
│   └── sprint-goals.md     # Metas de los Sprints del semestre
└── README.md               # Documentación general del proyecto
```

---

## 🔥 7. Configuración del Entorno Firebase

La conexión con Firebase se realiza mediante el SDK modular v10. Para configurar el proyecto:

1. Crear un proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
2. Habilitar **Firebase Authentication** con el proveedor de **Correo electrónico / Contraseña**.
3. Crear una base de datos **Cloud Firestore** en modo de producción o prueba con la colección `transacciones`.
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

> [!IMPORTANT]
> **Condición de Entrada a la Sustentación (§7.1):** El software debe correr localmente y sin errores de consola. De lo contrario, de acuerdo con la normativa innegociable de la cátedra TIC42695, la sustentación no se califica.

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

---

## 📄 10. Licencia
Proyecto desarrollado con fines académicos bajo licencia MIT.