# Cuentas Claras 🏠💳
**Aplicación Web para la Gestión de Finanzas Compartidas en el Hogar**

Proyecto universitario de ingeniería de software desarrollado bajo metodologías ágiles (**Scrum**), diseñado con arquitectura en capas, alta cohesión, bajo acoplamiento y preparado para sustentaciones con modificación de código en vivo.

---

## 🚀 Stack Tecnológico

- **Frontend:** HTML5 semántico, Vanilla JavaScript (Módulos ES6+ nativos) y Tailwind CSS. Sin frameworks pesados.
- **Backend as a Service (BaaS):** Firebase SDK v10 (Cloud Firestore & Firebase Authentication).
- **Control de Versiones:** Git & GitHub bajo convención de commits semánticos.

---

## 🏛️ Arquitectura por Capas

El proyecto implementa una estricta separación de responsabilidades:

```
cuentas-claras/
├── public/                 # Capa Estática accesible por el cliente
│   ├── index.html          # Interfaz principal (Dashboard y Autenticación)
│   ├── style.css           # Estilos personalizados y directivas de Tailwind
│   └── assets/             # Recursos gráficos e iconografía
├── src/                    # Código Fuente Modular
│   ├── models/             # CAPA DE DOMINIO: Entidades y reglas de negocio
│   │   └── Transaccion.js  # Modelo Transaccion, categorías, tipos y validación defensiva
│   ├── services/           # CAPA DE INFRAESTRUCTURA: Conexión externa (Firebase)
│   │   ├── auth.js         # Servicio de autenticación (Login, Registro, Logout)
│   │   └── firestore.js    # Persistencia asíncrona y listeners en tiempo real
│   ├── ui/                 # CAPA DE PRESENTACIÓN: Manipulación del DOM
│   │   ├── ui-auth.js      # Interacción de formularios y estados de autenticación
│   │   ├── dashboard.js    # Renderizado reactivo de balances, filtros y movimientos
│   │   └── notificaciones.js # Notificaciones flotantes (Toasts) para errores visibles
│   ├── utils/              # CAPA TRANSVERSAL: Funciones puras
│   │   └── formateo.js     # Formato de moneda COP, parseo y fechas legibles
│   └── app.js              # Orquestador principal del ciclo de vida de la aplicación
├── docs/                   # Documentación de Gestión Ágil (Scrum)
│   ├── acta-planning.md    # Acta de Sprint Planning y Backlog priorizado
│   ├── definition-of-done.md # Criterios de calidad Definition of Done (DoD)
│   └── sprint-goals.md     # Metas de los Sprints
└── README.md               # Documentación técnica general
```

### Reglas de Diseño Obligatorias Cumplidas:
1. **Independencia de la Capa de Servicios:** `auth.js` y `firestore.js` no interactúan con el DOM (`document.getElementById`). Únicamente retornan promesas o notifican mediante callbacks.
2. **Persistencia Real:** Cero almacenamiento de finanzas en memoria volátil o `localStorage`. Todo movimiento se sincroniza en Cloud Firestore.
3. **Manejo Visible de Errores:** Ninguna excepción queda silenciada ni deja pantallas en blanco. Todos los fallos se traducen al español y se despliegan mediante el módulo de Toasts.
4. **Programación Defensiva (Fail-Fast):** Las entidades y servicios validan tipos y datos antes de realizar peticiones de red.

---

## ⚙️ Cómo Ejecutar el Proyecto

Dado que la aplicación utiliza módulos nativos de JavaScript (`import`/`export`), debe servirse mediante un servidor HTTP local para evitar restricciones CORS del protocolo `file://`:

### Opción 1: Con VS Code (Live Server)
1. Instala la extensión **Live Server** en Visual Studio Code.
2. Haz clic derecho sobre `public/index.html` (o `index.html` raíz).
3. Selecciona **"Open with Live Server"**.

### Opción 2: Con Node.js (npx serve)
```bash
npx serve .
```
Abre en el navegador: `http://localhost:3000/public/index.html`

### Opción 3: Con Python
```bash
python -m http.server 8000
```
Abre en el navegador: `http://localhost:8000/public/index.html`

---

## 🎯 Guía para Sustentación en Vivo (Defensa con Docentes)

| Petición del Evaluador | Archivo a Modificar | Línea / Función |
|---|---|---|
| *"Cambia las reglas de validación de contraseña o email"* | `src/services/auth.js` | `validarCredenciales()` |
| *"Agrega o cambia una categoría de gasto"* | `src/models/Transaccion.js` | `CATEGORIAS_GASTO` |
| *"Exige que el monto mínimo de gasto sea $1.000 COP"* | `src/models/Transaccion.js` | `validar()` |
| *"Cambia el diseño o color de las notificaciones Toast"* | `src/ui/notificaciones.js` | `ESTILOS_TOAST` |
| *"Modifica el formato de la moneda o fecha"* | `src/utils/formateo.js` | `formatearMoneda()` / `formatearFecha()` |
| *"Cambia la consulta para filtrar solo gastos"* | `src/services/firestore.js` | `escucharTransacciones()` |

---

## 👥 Equipo de Desarrollo
- **Estudiante / Desarrollador:** Juan Diego Peraza (`pony-svg`)
- **Organización / Repositorio:** [cuentaclaras672-boop/Cuentas-Claras](https://github.com/cuentaclaras672-boop/Cuentas-Claras)