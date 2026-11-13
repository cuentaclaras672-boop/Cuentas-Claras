# Pruebas de reglas contra el emulador de Firebase (Tarea 14.1)

`auditoria-reglas.mjs` ataca [`firestore.rules`](../../firestore.rules) escribiendo directo con el SDK, y
comprueba que los flujos normales de la app (con los servicios reales de `src/services`) sigan funcionando.
No toca la base de datos real: todo corre en el emulador local.

Requisitos: Node 18+ y Java 11+. Necesita `src/services/firebase-config.js` (el emulador ignora la API key).

Desde la raíz del repositorio:

```bash
cd tests/emulador && npm install && cd ../..
npx --prefix tests/emulador firebase emulators:exec --only firestore,auth \
  "node --import ./tests/emulador/registrar.mjs tests/emulador/auditoria-reglas.mjs ."
```

Al final imprime `TODO PASA` o el número de fallos. `hooks.mjs` hace que Node cargue el SDK de Firebase
desde npm en lugar de las URLs de gstatic que usa el navegador.
