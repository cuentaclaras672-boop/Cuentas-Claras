# Cifrado de los datos antes de guardarlos en Firestore

**Responsable:** Daniel Cortes · **Algoritmo:** AES-256-GCM (Web Crypto API del navegador, sin librerías externas)

## Historia de usuario (HU-18)

**Como** miembro de un hogar que registra sus finanzas en Cuentas Claras, **quiero** que las descripciones,
categorías, nombres de deudores, notas y nombres de bolsillos se guarden cifrados, **para que** nadie que mire la
base de datos en la consola de Firebase pueda leer en qué gasto mi dinero ni a quién le presto.

**Criterios de aceptación**

1. Los textos de la tabla "Qué se cifra" se cifran en el navegador antes de enviarse y en la consola se ven como
   `enc:v1:...`; la app los muestra descifrados.
2. Los montos quedan en claro y las reglas de dinero de Firestore siguen validándose en el servidor.
3. Cada usuario tiene su clave y cada hogar una clave compartida; solo su dueño o los miembros pueden leerla y
   nadie puede cambiarla ni borrarla.
4. Las reglas rechazan un texto sensible que llegue en claro.
5. Un registro alterado o mal formado se descarta al leerlo sin romper el resto de la lista.
6. Los datos guardados antes del cambio se siguen leyendo.
7. Al cerrar sesión las claves se borran de la memoria del navegador.
8. Pasan `node tests/runner.js` y la auditoría de reglas en el emulador (79 casos).
9. `firestore.rules` se publica en Firebase junto con el código.

## Problema

Firebase cifra los datos en tránsito (HTTPS) y en sus discos, pero la consola de Firebase los muestra tal como
llegan: cualquiera con acceso al proyecto veía descripciones, montos, nombres de deudores y metas de ahorro en
texto plano. Ahora los **textos** sensibles se cifran **en el navegador**, antes de enviarse, y solo la app los
descifra al leerlos. Los **montos quedan en claro a propósito**: así las reglas de Firestore siguen validando
el dinero en el servidor (monto > 0, abono ≤ saldo pendiente, saldo de bolsillo ≥ 0). Esta decisión salió de
comparar 10 métodos de cifrado y de una revisión cruzada con un segundo agente (Codex).

## Qué se cifra

| Colección       | Cifrado                                                     | En claro (lo necesitan consultas y reglas)       |
|-----------------|-------------------------------------------------------------|--------------------------------------------------|
| `transacciones` | `descripcion`, `categoria`, `nombreUsuario`                 | `monto`, `tipo`, `ambito`, `creadoPor`, `fecha`, `hogarId` |
| `bolsillos`     | `nombre`                                                    | `meta`, `montoAcumulado`, `creadoPor`, `fecha`   |
| `prestamos`     | `deudor`, `nota`                                            | `monto`, `abonos`, `totalAbonado`, `estado`, `creadoPor`, `fecha` |
| `liquidaciones` | —                                                           | todo (son UIDs y montos)                         |
| `categorias`    | `nombre`                                                    | `uid`, `tipo`, `fechaCreacion`                   |
| `hogares`       | — (nombre del hogar y nombres de miembros quedan en claro)  | todo                                             |

`hogares` queda en claro porque quien se une con el código necesita leer el hogar **antes** de ser miembro, y
la clave del hogar solo la pueden leer sus miembros. Los filtros del historial (categoría, tipo, texto) ya se
hacían en memoria sobre los datos descifrados, así que siguen funcionando igual.

Así queda una transacción en la consola:

```
descripcion:   "enc:v1:VbjidDhaSha8MeZX:Rx423/F2nmxKJZwp2N6MJbYL2OP4UHPj3LeFrfFvdW4xaMrLLChN6LJHUVg09g=="
monto:         185400
tipo:          "GASTO"
ambito:        "COMPARTIDO"
...
```

Formato: `enc:v1:<IV de 96 bits en base64>:<datos cifrados + etiqueta GCM en base64>`. El IV es nuevo en cada
cifrado (el mismo valor nunca produce el mismo texto) y el nombre del campo se autentica como dato adicional
(AAD), así que copiar un valor cifrado de un campo a otro, o cambiarle un solo carácter, hace que el descifrado
falle y la app omita el registro en vez de mostrar datos falsos.

## Claves

| Clave             | Dónde vive                   | Quién la lee (reglas)   | Cifra                                         |
|-------------------|------------------------------|-------------------------|-----------------------------------------------|
| Clave del usuario | `clavesUsuario/{uid}.clave`  | solo ese usuario        | movimientos personales, bolsillos, préstamos, categorías |
| Clave del hogar   | `clavesHogar/{codigo}.clave` | solo miembros del hogar | movimientos COMPARTIDOS                        |

- Las claves son AES de 256 bits generadas con `crypto.subtle.generateKey` la primera vez que se necesitan
  (`src/services/claves.js`). Se crean dentro de una transacción para que dos pestañas no creen dos claves.
- Las reglas no permiten cambiar ni borrar una clave: perderla dejaría ilegibles los datos.
- Cada usuario guarda una copia de la clave de su hogar en `clavesUsuario/{uid}.hogares`, para poder seguir
  leyendo sus propios movimientos compartidos si sale del hogar.
- Al cerrar sesión, las claves se borran de la memoria del navegador.

## Qué cambió en las reglas (`firestore.rules`)

- Los textos de la tabla deben llegar cifrados (`esCifrado`): un texto en claro se rechaza. Se limita el tamaño
  del texto cifrado al que tendría el texto más largo permitido (`8 * caracteres + 48`).
- El servidor ya no puede validar el **largo** de esos textos (descripción de 3 a 120, deudor de 3 a 60...).
  Lo validan los modelos antes de cifrar y **otra vez al leer**: una transacción, un bolsillo o un préstamo
  inválido (por ejemplo, escrito por un cliente modificado) se descarta sin romper el resto de la lista.
  En préstamos se comprueba además que `totalAbonado` sea la suma de los abonos y no supere el monto.
- Todas las reglas de dinero se mantienen igual que en la Tarea 14.1.
- Nuevas colecciones `clavesUsuario` y `clavesHogar`, con lectura restringida y sin modificación ni borrado.

## Límites (para la sustentación)

- **Protege contra:** quien mire los documentos en la consola de Firebase o una copia parcial **sin** las
  colecciones de claves, y usuarios de la app que no tienen la clave (otro hogar, alguien que no es miembro).
- **No protege contra:** un administrador del proyecto, ni una exportación completa de la base (incluye
  `clavesUsuario` y `clavesHogar`). Tampoco oculta los montos, a propósito. Para eso las claves tendrían que protegerse con algo
  que Firebase no tenga, como una clave derivada de la contraseña del usuario (PBKDF2). Se descartó por ahora
  porque si el usuario recupera su contraseña por correo perdería todos sus datos, y compartir la clave con
  los miembros del hogar exigiría criptografía de clave pública.
- **Miembros que salen del hogar** conservan la clave del hogar. Sin acceso de lectura (las reglas se lo
  quitan) no les sirve, salvo que consigan una copia de la base. Mejora prevista: rotar la clave del hogar por
  versiones cuando alguien sale.
- **Datos anteriores:** lo guardado antes de este cambio sigue en claro y la app lo sigue leyendo (si un valor
  no empieza por `enc:v1:` se usa tal cual). Una versión vieja de la app que aún mande textos en claro será
  rechazada por las reglas nuevas: reglas y código se publican juntos.

## Pruebas

- `node tests/runner.js`: suite `pruebas-cifrado.test.js` (ida y vuelta, IV aleatorio, clave/campo/alteración
  detectados, datos antiguos y tamaños máximos de las reglas).
- Emulador (`tests/emulador/README.md`): `auditoria-reglas.mjs` (79 casos) comprueba en Firestore que los
  textos quedan cifrados y los montos en claro, que las reglas de dinero siguen rechazando montos inválidos,
  que un miembro del hogar descifra los movimientos compartidos de otro, que nadie ajeno lee las claves, que los
  textos en claro se rechazan, que un dato alterado en la consola se detecta y que los registros mal formados o
  cifrados con otra clave se omiten uno por uno sin afectar al resto de la lista.
