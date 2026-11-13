# Guía de publicación y despliegue (Tareas 14.4, 16.1 y 16.2)

**Responsable:** Daniel Felipe Cortes  
**Proyecto de Firebase:** `bdcuentasclaras-b1814` (definido en [`.firebaserc`](../.firebaserc))  
**URL pública:** https://bdcuentasclaras-b1814.web.app (alternativa: https://bdcuentasclaras-b1814.firebaseapp.com)

Los comandos se ejecutan en **Git Bash** desde la carpeta del repositorio. No hace falta instalar nada
globalmente: `npx` descarga la herramienta de Firebase la primera vez.

## 0. Antes de empezar (una sola vez por computador)

```bash
cd ~/Cuentas-Claras
git pull upstream main
npx firebase-tools login
```

`login` abre el navegador: entra con la cuenta de Google que tiene acceso al proyecto en la consola de Firebase.
Para comprobar que quedó bien:

```bash
npx firebase-tools projects:list
```

Debe aparecer `bdcuentasclaras-b1814`. Además debe existir `src/services/firebase-config.js` con las credenciales
reales (no está en Git); sin ese archivo la página publicada no puede conectarse a Firebase.

```bash
ls src/services/firebase-config.js
```

## 1. Publicar las reglas de Firestore (Tarea 14.4)

```bash
npx firebase-tools deploy --only firestore:rules
```

Debe terminar con `Deploy complete!`. Se puede confirmar en la consola:
**Firestore Database → Reglas** muestra la fecha de la última publicación.

> Las reglas nuevas (auditoría 14.1) solo afectan escrituras malintencionadas; la app sigue funcionando igual.
> Si algo falla, la consola guarda el historial de reglas y permite volver a la versión anterior.

## 2. Desplegar la app en Firebase Hosting (Tarea 16.1)

```bash
npx firebase-tools deploy --only hosting
```

[`firebase.json`](../firebase.json) publica la raíz del repositorio (porque `public/index.html` importa
módulos de `../src`) y deja por fuera `docs/`, `tests/`, los `.md`, `firestore.rules` y los archivos ocultos.
La raíz redirige a `public/index.html`. También agrega cabeceras de seguridad (`X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`) y `Cache-Control: no-cache` para que cada despliegue se vea
de inmediato sin borrar caché.

Para probar antes de publicar, en http://localhost:5000 :

```bash
npx firebase-tools emulators:start --only hosting
```

Reglas y app en un solo paso:

```bash
npx firebase-tools deploy --only firestore:rules,hosting
```

## 3. Dominio autorizado y API key (Tarea 16.2)

Esto se hace en las consolas web, no con comandos.

### 3.1 Dominios autorizados de Authentication

Consola de Firebase → **Authentication → Configuración → Dominios autorizados**
(https://console.firebase.google.com/project/bdcuentasclaras-b1814/authentication/settings).

La lista debe quedar solo con:

| Dominio | Para qué |
|---|---|
| `localhost` | Desarrollo local |
| `bdcuentasclaras-b1814.firebaseapp.com` | Dominio de Hosting |
| `bdcuentasclaras-b1814.web.app` | Dominio de Hosting (URL pública) |

Firebase agrega estos tres al crear el proyecto; si falta alguno, se agrega con **Agregar dominio**. Cualquier
otro dominio que no reconozcan se elimina.

### 3.2 Restringir la API key

La `apiKey` de `firebase-config.js` viaja al navegador y cualquiera la puede ver; eso es normal en Firebase.
Lo que evita el abuso es limitar desde qué sitios y para qué APIs se puede usar.

Google Cloud Console → **APIs y servicios → Credenciales**
(https://console.cloud.google.com/apis/credentials?project=bdcuentasclaras-b1814) → abrir
**Browser key (auto created by Firebase)** (la que coincide con la `apiKey` del archivo):

1. **Restricciones de aplicaciones → Sitios web**, con estos referentes:
   - `https://bdcuentasclaras-b1814.web.app/*`
   - `https://bdcuentasclaras-b1814.firebaseapp.com/*`
   - `http://localhost/*`
   - `http://localhost:*/*`
   - `http://127.0.0.1:*/*`
2. **Restricciones de API → Restringir clave**, marcando solo:
   - Identity Toolkit API (inicio de sesión)
   - Token Service API (renovar la sesión)
   - Cloud Firestore API
3. **Guardar**. El cambio tarda hasta 5 minutos en aplicarse.

### 3.3 Verificación

1. Abrir https://bdcuentasclaras-b1814.web.app, iniciar sesión y registrar un movimiento: debe funcionar.
2. Abrir la app en local (`python -m http.server 8000` → http://localhost:8000/public/index.html): debe funcionar.
3. La consola del navegador (F12) no debe mostrar `API key not valid` ni `auth/unauthorized-domain`.
   Si aparece, revisar que el dominio esté en las dos listas de arriba.
