# Auditoría de `firestore.rules` — Sprint 5 (Tarea 14.1 / HU-14)

**Responsable:** Daniel Felipe Cortes  
**Fecha:** 13 de noviembre de 2026  
**Criterio de aceptación:** CA-14.1 (ninguna colección permite lecturas o escrituras públicas; las 6 colecciones aíslan por UID u hogar).  
**Prueba:** [`tests/emulador/auditoria-reglas.mjs`](../tests/emulador/auditoria-reglas.mjs), 46 casos (40 ataques y 6 flujos normales) contra el emulador local de Firestore y Auth.

## 1. Método

1. Revisión manual de cada `match` de [`firestore.rules`](../firestore.rules) buscando tres tipos de vector:
   - **Bypass de autenticación o aislamiento:** leer o escribir datos de otro usuario o de un hogar ajeno.
   - **Inyección de campos:** agregar campos que el modelo no conoce (`esAdmin`, `payload`...) o cambiar campos que no deberían cambiar (`creadoPor`, `fecha`).
   - **Datos fuera de rango:** textos enormes, tipos equivocados o montos absurdos que inflan la base y los totales.
2. Ataque simulado: el script escribe directo con el SDK de Firebase, saltándose los servicios de `src/services`, igual que alguien que abre la consola del navegador con su propia sesión.
3. Se ejecutó el mismo script contra las reglas **antes** y **después** del cambio.

## 2. Resultado

| | Reglas anteriores | Reglas nuevas |
|---|:---:|:---:|
| Ataques bloqueados | 27 de 40 | **40 de 40** |
| Flujos normales de la app | 6 de 6 | **6 de 6** |

Las pruebas de las Tareas 8.2, 9.2 y 11.2 (`pruebas-emulador` del Sprint 3 y 4) siguen pasando con las reglas nuevas.

## 3. Hallazgos corregidos

| # | Colección | Vector | Antes | Corrección |
|:-:|---|---|---|---|
| 1 | `bolsillos` | Campos extra al crear (`esAdmin: true`) | Permitido | `esBolsilloValido`: `hasOnly` con los 5 campos del modelo |
| 2 | `bolsillos` | Nombre de 5000 caracteres | Permitido | Nombre de 3 a 40 caracteres (también en el modelo y en el formulario) |
| 3 | `bolsillos` | `fecha` como texto | Permitido | `fecha is timestamp` |
| 4 | `bolsillos` | Cambiar la fecha de creación | Permitido | Al actualizar solo cambian `nombre`, `meta` y `montoAcumulado` |
| 5 | `bolsillos` | Nombre que no es texto | Permitido | Se valida la estructura completa también al actualizar |
| 6 | `categorias` | Nombre de 1000 caracteres al editar | Permitido | `esCategoriaValida` también en `update` |
| 7 | `categorias` | Campo extra al editar | Permitido | `hasOnly(['uid', 'nombre', 'tipo', 'fechaCreacion'])` |
| 8 | `categorias` | `tipo` inventado | Permitido | `tipo in ['gasto', 'ingreso']` |
| 9 | `categorias` | Campo extra al crear | Permitido | Misma función en `create` |
| 10 | `prestamos` | Reescribir un abono anterior al agregar uno nuevo | Permitido | Los abonos anteriores deben quedar idénticos (`abonos[0:n] == abonos`) y el nuevo debe ser `{ monto, fecha }` con el mismo valor que sube `totalAbonado` (`esAbonoValido`) |
| 11 | `transacciones` | `nombreUsuario` de 5000 caracteres | Permitido | Máximo 100 caracteres |
| 12 | `transacciones` | Monto de 1e15 | Permitido | Tope de 1 billón (10¹²) |
| 13 | `hogares` | Unirse con un nombre visible de 500 caracteres | Permitido | El nombre en `nombres[uid]` es texto de máximo 60 caracteres (igual que `validarUsuario` en `hogares.js`) |

## 4. Controles que ya estaban bien y se verificaron

- Sin sesión, ninguna de las 6 colecciones se puede listar ni escribir; la regla por defecto niega cualquier otra colección.
- Un usuario no puede leer bolsillos, categorías, préstamos ni movimientos personales de otro.
- Nadie puede listar todos los hogares; solo los propios (`array-contains` por UID).
- Nadie puede crear documentos a nombre de otro (`creadoPor`/`uid` = `request.auth.uid`).
- Un movimiento no se puede mover a un hogar después de creado (`hogarId` inmutable).
- Solo un miembro puede saldar el mes de su hogar, y una liquidación no se puede editar ni borrar.

## 5. Riesgos aceptados

- **Lectura de un hogar por código (`allow get`)**: cualquier usuario con sesión que conozca el código de 6 caracteres puede leer el nombre del hogar y la lista de miembros. Es necesario para unirse (CA-9.2). Hay 36⁶ ≈ 2.176 millones de códigos posibles, y el código solo se comparte entre convivientes.
- **Contenido de `transferencias` en liquidaciones**: las reglas no pueden recorrer listas, así que solo limitan su tamaño (máximo 5). El servicio `liquidaciones.js` valida cada transferencia antes de guardar.
- **La API key de la app es pública por diseño**: va en el código del navegador. La protección real son estas reglas más la restricción de la key por dominio (Tarea 16.2, ver [`guia-despliegue.md`](guia-despliegue.md)).

## 6. Cómo repetir la auditoría

Ver [`tests/emulador/README.md`](../tests/emulador/README.md).
