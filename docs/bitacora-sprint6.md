# Bitácora de Seguimiento — Sprint 6 (Cierre y Despliegue)
**Proyecto:** Cuentas Claras — Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Scrum Master:** Fabián Eduardo Córdoba (`cuentaclaras672@gmail.com`)  
**Product Owner:** Juan Diego Peraza Amado  
**Periodo:** 14 de noviembre al 27 de noviembre de 2026 (Parcial Corte III: 21 de noviembre)  

---

## 1. Resumen Ejecutivo del Sprint 6 (En Curso)

El Sprint 6 inicia hoy **14 de noviembre de 2026** con dos tareas de infraestructura adelantadas desde el cierre previo (**Tareas 16.1 y 16.2**) y con enfoque total en el despliegue productivo en Firebase Hosting, el endurecimiento de dominios/API Key, las pruebas UAT en navegador y la sustentación final del **Parcial Corte III (21/11/2026)**.

| Métrica | Planificado | Estado al 14 de Noviembre de 2026 |
|---|:---:|:---:|
| **Story Points (SP)** | 13 SP (HU-16: 8 SP · HU-17: 5 SP) | 🚀 **En Ejecución (2/6 tareas adelantadas)** |
| **Tareas Técnicas** | 6 tareas (`16.1`–`16.4`, `17.1`–`17.2`) | ✅ 2 cerradas (`16.1`, `16.2`) · 🚀 4 en curso / por iniciar |
| **Base QA Heredada (`runner.js`)** | 12 suites al 100% | ✅ **12 / 12 Aprobadas (100% PASS)** |
| **Fecha de Inicio** | 14 de noviembre de 2026 | ✅ En curso |
| **Hito Parcial Corte III** | 21 de noviembre de 2026 | ⏳ Próximo hito |
| **Fecha de Cierre Semestral** | 27 de noviembre de 2026 | ⏳ Planificado |

### Responsables Asignados por Tarea (Sprint 6)
- **Daniel Felipe Cortes:** Tareas `16.1` (`.firebaserc` / `firebase.json` — adelantada), `16.2` (`docs/guia-despliegue.md` — adelantada), `16.3` (publicación de reglas/Hosting y restricciones Google Cloud) y apoyo en `17.1`.
- **Juan Diego Peraza Amado:** Co-responsable de `16.3` (auditoría Dynamic Links / validación de consola) y líder de `17.1` (guion y demo técnica del Parcial Corte III).
- **Jorman Palacios Murillo y Yerson Niño Guerrero:** Tarea `16.4` (pruebas UAT en URL pública `bdcuentasclaras-b1814.web.app`, vista PDF y verificación de CSV en producción).
- **Fabián Eduardo Córdoba:** Tarea `17.2` (auditoría final QA, retrospectiva de cierre y acta final del Sprint 6).

---

## 2. Registro Cronológico de Daily Scrums

### Daily 1 — Sábado, 14 de Noviembre de 2026 (Kick-off de Sprint 6)
- **Facilitador:** Juan Diego Peraza / Fabián Córdoba.
- **Ayer / Cierre Sprint 5:**
  - Sincronizados los commits de Daniel Cortes (`82b0c90`, `a1f7ccd`, `79315bd`, `2f0638f`) con la auditoría de seguridad en emulador (46 casos), el módulo de resiliencia `conexion.js`, la configuración `.firebaserc` / `firebase.json` y `docs/guia-despliegue.md`.
  - Consolidada la entrega completa de Sprint 5 en `main`: `normalizarFecha()` en `formateo.js`, `tests/pruebas-seguridad-carga.test.js` (50 ops en 0.41 ms), `src/utils/exportador.js`, botones CSV/PDF en `dashboard.js` y `index.html`, estilos `@media print` en `public/style.css`, y `tests/pruebas-exportador.test.js`. Suite maestra certificada con **12/12 PASS**.
  - Publicadas las actas de cierre de Sprint 5 (`acta-review-sprint5.md`, `informe-pruebas-sprint5.md`, cierre de `bitacora-sprint5.md`) y apertura formal del Sprint 6 (`acta-planning-sprint6.md`).
- **Hoy (Arranque Sprint 6):**
  - Se validan y dan por completadas en tablero las **Tareas 16.1** y **16.2** (adelantadas en `firebase.json`, `.firebaserc` y `docs/guia-despliegue.md`).
  - Se inicia la planificación operativa de la **Tarea 16.3**: verificación del aviso de baja de Firebase Dynamic Links reportado en consola de Firebase Auth (confirmando que la app emplea `createUserWithEmailAndPassword` / `signInWithEmailAndPassword` estándar en `src/services/auth.js`, sin vínculos de correo móvil ni OAuth de Cordova) y programación del despliegue con `firebase-tools` (`firestore:rules` y `hosting`).
  - Se programa para la semana previa al 21 de noviembre la validación UAT de producción (**Tarea 16.4**) y el ensayo del guion de sustentación Corte III (**Tarea 17.1**).
- **Impedimentos:** Pendiente coordinar sesión conjunta con cuenta propietaria del proyecto Firebase `bdcuentasclaras-b1814` para ejecutar `firebase deploy` y verificar restricciones HTTP en Google Cloud.

---

## 3. Análisis Técnico de Alertas Observadas en Consola (14/11/2026)

1. **Aviso de Firebase Authentication sobre baja de Firebase Dynamic Links:**
   - **Mensaje en Consola Firebase:** Indica que la autenticación mediante vínculos de correo electrónico en apps móviles y la compatibilidad OAuth para Cordova dejarán de operar al cerrarse Firebase Dynamic Links.
   - **Impacto en Cuentas Claras:** **Nulo / No bloqueante**. Tras auditar `src/services/auth.js` y `src/ui/ui-auth.js`, la autenticación del proyecto opera 100% en navegador web mediante `createUserWithEmailAndPassword` y `signInWithEmailAndPassword` de Firebase Auth JS SDK `10.13.0`. No utiliza Email Link Sign-In (`sendSignInLinkToEmail`), aplicaciones móviles nativas ni Cordova. Se deja documentado para responder cualquier inquietud durante la sustentación del Corte III.
2. **Recordatorio operativo sobre `apiKey` y publicación de `firestore.rules`:**
   - Documentado en `docs/guia-despliegue.md`: la `apiKey` del cliente identifica el proyecto Firebase en web y debe acotarse por referente HTTP en Google Cloud (`bdcuentasclaras-b1814.web.app`, `bdcuentasclaras-b1814.firebaseapp.com`, `localhost`), mientras la seguridad de datos reside estrictamente en `firestore.rules` publicadas en el servidor.

---

## 4. Próximos Pasos (Semana 11: 14 al 20 de Noviembre de 2026)

1. Ejecutar `npx firebase-tools deploy --only firestore:rules` y `npx firebase-tools deploy --only hosting` sobre el proyecto `bdcuentasclaras-b1814`.
2. Configurar restricción de referentes HTTP para la `apiKey` web en Google Cloud Console.
3. Realizar pruebas UAT de extremo a extremo sobre `https://bdcuentasclaras-b1814.web.app` (registro, hogar compartido, cuadre mensual, bolsillos, préstamos, CSV y vista PDF `@media print`) verificando consola F12 en ceros.
4. Ensayar la presentación de 30 minutos para el **Parcial Corte III del 21 de noviembre de 2026**.
