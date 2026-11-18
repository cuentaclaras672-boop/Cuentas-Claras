# Cifrado de los datos antes de guardarlos en Firestore

**Responsable:** Daniel Cortes · **Algoritmo:** AES-256-GCM (Web Crypto API del navegador, sin librerías externas)

## Historia de usuario (HU-18)

**Como** miembro de un hogar que registra sus finanzas en Cuentas Claras, **quiero** que las descripciones,
categorías, nombres de deudores, notas, nombres de bolsillos y **montos** se guarden cifrados, **para que** nadie
que mire la base de datos en la consola de Firebase pueda leer en qué gasto mi dinero, cuánto, ni a quién le presto.

**Criterios de aceptación**

1. Los campos de la tabla "Qué se cifra" se cifran en el navegador antes de enviarse y en la consola se ven como
   `enc:v1:...`; la app los muestra descifrados.
2. Los montos (movimientos, bolsillos, préstamos, abonos y liquidaciones) también llegan cifrados; como el
   servidor ya no los ve, la app valida el dinero antes de guardar y otra vez al leer.
3. Cada usuario tiene su clave y cada hogar una clave compartida; solo su dueño o los miembros pueden leerla y
   nadie puede cambiarla ni borrarla.
4. Las reglas rechazan un texto o monto sensible que llegue en claro.
5. Un registro alterado o mal formado se descarta al leerlo sin romper el resto de la lista.
6. Los datos guardados antes del cambio se siguen leyendo.
7. Al cerrar sesión las claves se borran de la memoria del navegador.
8. Pasan `node tests/runner.js` y la auditoría de reglas en el emulador (88 casos).
9. `firestore.rules` se publica en Firebase junto con el código.

## Problema

Firebase cifra los datos en tránsito (HTTPS) y en sus discos, pero la consola de Firebase los muestra tal como
llegan: cualquiera con acceso al proyecto veía descripciones, montos, nombres de deudores y metas de ahorro en
texto plano. Ahora los campos sensibles se cifran **en el navegador**, antes de enviarse, y solo la app los
descifra al leerlos.

## Qué se cifra

| Colección       | Cifrado                                                     | En claro (lo necesitan consultas y reglas)       |
|-----------------|-------------------------------------------------------------|--------------------------------------------------|
| `transacciones` | `descripcion`, `monto`, `categoria`, `nombreUsuario`        | `tipo`, `ambito`, `creadoPor`, `fecha`, `hogarId` |
| `bolsillos`     | `nombre`, `meta`, `montoAcumulado`                          | `creadoPor`, `fecha`                             |
| `prestamos`     | `deudor`, `monto`, `nota`, `totalAbonado`, `abonos[].monto` | `estado`, `creadoPor`, `fecha`, `abonos[].fecha` |
| `liquidaciones` | `transferencias` (la lista completa)                        | `hogarId`, `periodo`, `saldadaPor`, `fecha`      |
| `categorias`    | `nombre`                                                    | `uid`, `tipo`, `fechaCreacion`                   |
| `hogares`       | — (nombre del hogar y nombres de miembros quedan en claro)  | todo                                             |

`hogares` queda en claro porque quien se une con el código necesita leer el hogar **antes** de ser miembro, y
la clave del hogar solo la pueden leer sus miembros. Los filtros del historial (categoría, tipo, texto) ya se
hacían en memoria sobre los datos descifrados, así que siguen funcionando igual.

Así queda una transacción en la consola:

```
descripcion:   "enc:v1:VbjidDhaSha8MeZX:Rx423/F2nmxKJZwp2N6MJbYL2OP4UHPj3LeFrfFvdW4xaMrLLChN6LJHUVg09g=="
monto:         "enc:v1:Fx5KoeJbhlYGMbnX:dQQDKZj7xin+BnMWddH5Frg+j1OJ6w=="
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
| Clave del hogar   | `clavesHogar/{codigo}.clave` | solo miembros del hogar | movimientos COMPARTIDOS y liquidaciones        |

- Las claves son AES de 256 bits generadas con `crypto.subtle.generateKey` la primera vez que se necesitan
  (`src/services/claves.js`). Se crean dentro de una transacción para que dos pestañas no creen dos claves.
- Las reglas no permiten cambiar ni borrar una clave: perderla dejaría ilegibles los datos.
- Cada usuario guarda una copia de la clave de su hogar en `clavesUsuario/{uid}.hogares`, para poder seguir
  leyendo sus propios movimientos compartidos si sale del hogar.
- Al cerrar sesión, las claves se borran de la memoria del navegador.

## Qué cambió en las reglas (`firestore.rules`)

- Los campos de la tabla deben llegar cifrados (`esCifrado`): un texto o número en claro se rechaza. Se limita
  el tamaño del texto cifrado al que tendría el texto más largo permitido (`8 * caracteres + 48`).
- El servidor ya no puede validar el **contenido** de lo cifrado (descripción de 3 a 120 caracteres, monto
  mayor que 0, abono menor o igual al saldo). Esas validaciones siguen en los modelos y servicios del cliente:
  `Transaccion.validar()`, `Bolsillo.validar()` y `registrarAbonoPrestamo()` (dentro de una transacción).
- Préstamos: las reglas siguen impidiendo reescribir abonos anteriores y ahora impiden abonar a un préstamo
  `SALDADO`.
- **Validación al leer:** como el servidor no ve el contenido, una transacción, un bolsillo o un préstamo
  imposible (monto negativo, descripción de 2 letras, total abonado que no cuadra con la suma de los abonos,
  escrito por un cliente modificado) se descarta al leerlo, uno por uno, sin romper el resto de la lista.
- Bolsillos: como el servidor no puede sumar un monto cifrado, `abonarFondosBolsillo` usa `runTransaction`
  (leer, descifrar, sumar, cifrar); dos abonos simultáneos no se pierden.

## Límites (para la sustentación)

- **Protege contra:** quien mire los documentos en la consola de Firebase o una copia parcial **sin** las
  colecciones de claves, y usuarios de la app que no tienen la clave (otro hogar, alguien que no es miembro).
- **No protege contra:** un administrador del proyecto, ni una exportación completa de la base (incluye
  `clavesUsuario` y `clavesHogar`). Para eso las claves tendrían que protegerse con algo
  que Firebase no tenga, como una clave derivada de la contraseña del usuario (PBKDF2). Se descartó por ahora
  porque si el usuario recupera su contraseña por correo perdería todos sus datos, y compartir la clave con
  los miembros del hogar exigiría criptografía de clave pública.
- **Datos anteriores:** lo guardado antes de este cambio sigue en claro y la app lo sigue leyendo (si un valor
  no empieza por `enc:v1:` se usa tal cual). Al abonar a un bolsillo o préstamo antiguo, sus campos nuevos
  quedan cifrados.

## Pruebas

- `node tests/runner.js`: suite `pruebas-cifrado.test.js` (ida y vuelta, IV aleatorio, clave/campo/alteración
  detectados, datos antiguos y tamaños máximos de las reglas).
- Emulador (`tests/emulador/README.md`): `auditoria-reglas.mjs` comprueba en Firestore que lo guardado queda
  cifrado, que un miembro del hogar descifra los movimientos compartidos de otro, que nadie ajeno lee las claves,
  que los datos en claro se rechazan y que un dato alterado en la consola se detecta.
- **Qué sigue visible:** fecha, tipo (GASTO/INGRESO), ámbito (PERSONAL/COMPARTIDO), UIDs, estado del préstamo,
  y el nombre del hogar con sus miembros. Las consultas y las reglas de acceso los necesitan.
- **Decisión:** primero (16/11/2026) se cifraron solo los textos para que el servidor siguiera validando el
  dinero. El 17/11/2026 se decidió cifrar también los montos: se pierde la validación del dinero en el
  servidor, que pasa a la app (antes de guardar y al leer).

## Pruebas

- `node tests/runner.js`: suite `pruebas-cifrado.test.js` (ida y vuelta, IV aleatorio, clave/campo/alteración
  detectados, datos antiguos y tamaños máximos de las reglas).
- Emulador (`tests/emulador/README.md`): `auditoria-reglas.mjs` (88 casos) comprueba en Firestore que textos y
  montos quedan cifrados, que los valores en claro se rechazan, que dos abonos simultáneos a un bolsillo no se
  pierden, que un abono mayor que el saldo se rechaza, que un miembro del hogar descifra los movimientos y la
  liquidación del hogar, que nadie ajeno lee las claves, que un dato alterado en la consola se detecta y que
  los registros imposibles o cifrados con otra clave se omiten uno por uno.
