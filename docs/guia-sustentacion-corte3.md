# Guía Maestra de Sustentación Final — Parcial Corte III (Sprints 1 a 6)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Asignatura:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Docente Evaluadora:** Vilma Yenny Bohórquez  
**Hito:** Parcial Corte III y Sustentación Final (21 de noviembre de 2026)  
**Alcance Total:** 18 Historias de Usuario (`HU-01` a `HU-18`) · 102 Story Points · 13 Suites QA (100% PASS) · 88 Casos en Emulador

---

## 🗺️ 1. Mapa Rápido de Archivos (Sprints 1 a 6): ¿Dónde está cada módulo?

| Qué te pide abrir o explicar la docente | Archivo responsable | Ruta y Funciones Clave |
|---|---|---|
| **Interfaz HTML completa (Auth, Hogar, Cuadre, Bolsillos, Préstamos, Historial)** | `index.html` | [`public/index.html`](../public/index.html) |
| **Estilos y vista de impresión PDF (`@media print`)** | `style.css` | [`public/style.css`](../public/style.css) (`.no-print`, `.only-print`) |
| **Orquestador de la aplicación (conecta Auth, Hogar, Transacciones, Bolsillos, Préstamos)** | `app.js` | [`src/app.js`](../src/app.js) (`iniciarAplicacion`) |
| **Renderizado del Dashboard, filtros, gráfica, cuadre, bolsillos, préstamos, CSV/PDF** | `dashboard.js` | [`src/ui/dashboard.js`](../src/ui/dashboard.js) |
| **Cifrado criptográfico AES-256-GCM en navegador (HU-18)** | `cifrado.js` | [`src/utils/cifrado.js`](../src/utils/cifrado.js) (`cifrarValor`, `descifrarValor`, `cifrarCampos`, `descifrarCampos`) |
| **Llavero de cifrado por usuario y por hogar (HU-18)** | `claves.js` | [`src/services/claves.js`](../src/services/claves.js) (`obtenerClaveUsuario`, `obtenerClaveHogar`, `limpiarClavesEnMemoria`) |
| **Persistencia de transacciones y bolsillos con cifrado AES-256-GCM** | `firestore.js` | [`src/services/firestore.js`](../src/services/firestore.js) (`registrarTransaccion`, `escucharTransacciones`, `abonarFondosBolsillo`) |
| **Préstamos a terceros y abonos atómicos cifrados (HU-08 / HU-18)** | `prestamos.js` | [`src/services/prestamos.js`](../src/services/prestamos.js) (`registrarPrestamo`, `registrarAbonoPrestamo`, `validarPrestamoLeido`) |
| **Hogar compartido con código de 6 caracteres (HU-09)** | `hogares.js` | [`src/services/hogares.js`](../src/services/hogares.js) (`crearHogar`, `unirseAHogar`, `salirDelHogar`) |
| **Algoritmo matemático Greedy del cuadre mensual ($N-1$ transferencias, HU-11)** | `cuadre.js` | [`src/utils/cuadre.js`](../src/utils/cuadre.js) (`calcularCuadreMes`) |
| **Persistencia atómica e inmutable de liquidaciones del hogar (HU-11 / HU-18)** | `liquidaciones.js` | [`src/services/liquidaciones.js`](../src/services/liquidaciones.js) (`marcarLiquidacionSaldada`, `escucharLiquidacion`) |
| **Categorías personalizadas CRUD cifradas (HU-12 / HU-18)** | `categorias.js` | [`src/services/categorias.js`](../src/services/categorias.js) (`guardarCategoria`, `obtenerCategorias`, `actualizarCategoria`, `eliminarCategoria`) |
| **Resiliencia offline y reintentos con espera exponencial (HU-07 / HU-14)** | `conexion.js` | [`src/services/conexion.js`](../src/services/conexion.js) (`asegurarConexion`, `conReintentos`, `ErrorSinConexion`) |
| **Exportador CSV RFC 4180 + BOM UTF-8 + anti-Formula Injection (HU-15)** | `exportador.js` | [`src/utils/exportador.js`](../src/utils/exportador.js) (`escaparCampoCSV`, `generarCSVTransacciones`) |
| **Normalización transversal de fechas y moneda (Ancla 1 S4)** | `formateo.js` | [`src/utils/formateo.js`](../src/utils/formateo.js) (`normalizarFecha`, `formatearMoneda`, `parsearMontoCOP`) |
| **Reglas de seguridad en servidor (8 colecciones + `esCifrado` + `deny-all`)** | `firestore.rules` | [`firestore.rules`](../firestore.rules) |
| **Ejecutor maestro de las 13 suites QA** | `runner.js` | [`tests/runner.js`](../tests/runner.js) (`node tests/runner.js`) |
| **Suite de penetración contra emulador (88 casos)** | `auditoria-reglas.mjs` | [`tests/emulador/auditoria-reglas.mjs`](../tests/emulador/auditoria-reglas.mjs) |

---

## 🔐 2. Cómo Defender las Funcionalidades Críticas de los Sprints 4, 5 y 6

### 2.1 Cifrado Extremo a Extremo AES-256-GCM en Cliente ([HU-18] — Sprint 6)
- **¿Por qué lo hicimos?** Aunque Firestore cifra en tránsito (HTTPS) y en disco, en la consola de Firebase cualquier administrador veía en texto plano en qué gasta la pareja, cuánto gana y a quién le presta.
- **¿Cómo funciona técnicamente?**
  1. Antes de enviar un documento a Firestore, [`src/utils/cifrado.js`](../src/utils/cifrado.js) usa la **Web Crypto API nativa (`crypto.subtle`)** con **AES-256-GCM**, un **IV aleatorio de 96 bits (12 bytes)** nuevo en cada operación y el **nombre del campo como dato autenticado adicional (AAD)**.
  2. El valor guardado en Firestore tiene el formato `enc:v1:<IV_base64>:<ciphertext_mas_tag_GCM_base64>`.
  3. **Dos tipos de clave ([`src/services/claves.js`](../src/services/claves.js)):**
     - `clavesUsuario/{uid}`: cifra movimientos personales, bolsillos, préstamos y categorías (solo la lee ese usuario).
     - `clavesHogar/{codigo}`: cifra los movimientos `COMPARTIDO` y las `liquidaciones` del hogar (solo la leen los miembros del hogar).
  4. **¿Qué pasa si alguien altera un dato en la consola o copia el monto cifrado en la descripción?** Como el nombre del campo viaja en el AAD y GCM verifica una etiqueta de autenticación de 128 bits, `crypto.subtle.decrypt` lanza error y la app descarta ese registro corrupto sin romper el resto de la lista (`convertirDocumentos`).
  5. **¿Cómo valida la app los montos si ahora van cifrados?** Como el servidor solo ve `enc:v1:...` (validado con `esNumeroCifrado` en `firestore.rules`), la app valida el monto antes de cifrar (`Transaccion.validar()`, `Bolsillo.validar()`, `registrarAbonoPrestamo()` dentro de `runTransaction`) y vuelve a validarlo al descifrar (`validarPrestamoLeido`, `bolsillo.validar()`, etc.).

### 2.2 Cuadre Mensual e Idempotencia ([HU-11] — Sprint 4)
- **Algoritmo Greedy ([`src/utils/cuadre.js`](../src/utils/cuadre.js)):** Calcula `cuotaPorMiembro = totalGastos / N` y el balance de cada conviviente (`pagado - cuota`). Ordena deudores y acreedores ($O(N \log N)$) y empareja siempre al mayor deudor con el mayor acreedor, generando como máximo **$N - 1$ transferencias** (máximo 5 para 6 convivientes).
- **Idempotencia e Inmutabilidad ([`src/services/liquidaciones.js`](../src/services/liquidaciones.js) y [`firestore.rules`](../firestore.rules)):** El documento se guarda en `liquidaciones/{hogarId}_{AAAA-MM}` dentro de `runTransaction` verificando que no exista previamente, y `firestore.rules` prohíbe `update` y `delete`.

### 2.3 Resiliencia de Red y Exportación CSV/PDF ([HU-14] y [HU-15] — Sprint 5)
- **Guarda Offline y Backoff ([`src/services/conexion.js`](../src/services/conexion.js)):** `asegurarConexion()` lanza `ErrorSinConexion` de inmediato si `navigator.onLine === false`, evitando que Firestore deje promesas de escritura colgadas. `conReintentos()` aplica espera exponencial (`400 ms` a `4000 ms`, hasta 3 intentos) solo ante errores transitorios (`unavailable`, `deadline-exceeded`, `aborted`) en operaciones idempotentes.
- **Exportación CSV RFC 4180 ([`src/utils/exportador.js`](../src/utils/exportador.js)):** Antepone **BOM UTF-8 (`\uFEFF`)** para que Excel en Windows respete tildes y `ñ`, usa saltos `\r\n`, escapa comillas dobles (`""`) y neutraliza **CSV Formula Injection** anteponiendo `'` si un texto inicia con `=`, `+`, `-` o `@`. Tanto el CSV como la impresión PDF (`@media print` en [`public/style.css`](../public/style.css)) funcionan incluso sin conexión a Internet porque operan sobre `obtenerTransaccionesFiltradas()` en memoria.

---

## ⚡ 3. Simulacros de Modificación de Código en Vivo (Corte III)

### Simulacro A: *"Cambien el límite máximo de caracteres de la descripción de 120 a 150"*
1. En [`src/models/Transaccion.js`](../src/models/Transaccion.js#L13): cambiar `export const MAX_DESCRIPCION = 120;` por `150`.
2. En [`public/index.html`](../public/index.html): buscar `id="transaccion-descripcion"` y cambiar `maxlength="120"` por `maxlength="150"`.
3. Al recargar, el contador mostrará automáticamente `"Quedan 150 caracteres"`.

### Simulacro B: *"Agreguen una columna 'Moneda' al archivo CSV exportado"*
1. Abrir [`src/utils/exportador.js`](../src/utils/exportador.js):
   - En `CABECERAS_CSV` agregar `"Moneda"`.
   - En el arreglo `celdas` dentro de `generarCSVTransacciones` agregar `escaparCampoCSV(opciones.moneda || "COP")`.

### Simulacro C: *"Cambien el límite máximo de miembros de un hogar de 6 a 4"*
1. Abrir [`src/services/hogares.js`](../src/services/hogares.js#L37): cambiar `export const MAX_MIEMBROS_HOGAR = 6;` por `4` (esto actualiza automáticamente `MAX_TRANSFERENCIAS = MAX_MIEMBROS_HOGAR - 1` en `liquidaciones.js`).
2. En [`firestore.rules`](../firestore.rules): cambiar `request.resource.data.miembros.size() <= 6` por `<= 4`.

---

## ✅ 4. Checklist de 5 Minutos Antes de Entrar a la Sustentación

1. Levantar servidor local en la raíz del repositorio:
   ```bash
   python3 -m http.server 8000
   ```
2. Abrir `http://localhost:8000/public/index.html` y verificar que **F12 → Console** esté en **0 errores** y que en el header aparezcan los badges **`AES-256-GCM`** y **`TRM Hoy`**.
3. Ejecutar en terminal:
   ```bash
   node tests/runner.js
   ```
   y dejar visible el resumen **`Total Suites: 13 | Aprobadas: 13 | Fallidas: 0 | Tasa de Éxito: 100%`**.
4. Tener abierta la consola de Firebase (**Firestore Database → Datos**) para mostrar en vivo cómo un movimiento recién creado se ve en la base como `enc:v1:...` mientras en la aplicación se ve descifrado.
