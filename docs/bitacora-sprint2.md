# Bitácora de Sprint 2 — Cuentas Claras
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Marco de Trabajo:** Scrum · **Sprint:** 2 (Semanas 6 a 9: 7 de septiembre al 10 de octubre de 2026)  
**Fecha de Corte:** 26 de septiembre de 2026 (Semana 8 · Promedio del Sprint)  

---

## 1. Estado del Tablero de Miro / Planner

A fecha del **26 de septiembre de 2026**, el equipo se encuentra a mitad del Sprint 2. Las historias de usuario aprobadas y terminadas corresponden estrictamente al Sprint 1, mientras que las del Sprint 2 transitan activamente por el flujo del tablero:

| Historia de Usuario | Story Points | Responsable Principal | Columna en Tablero |
|---|:---:|---|:---:|
| **HU-01: Autenticación (Firebase Auth)** | 5 SP | Juan Diego Peraza | **Terminado (Done - S1)** |
| **HU-02: Registro Transacciones (Firestore)** | 8 SP | Daniel Cortes / Yerson Niño | **Terminado (Done - S1)** |
| **HU-03: Dashboard Saldo Líquido** | 5 SP | Jorman Palacios | **Terminado (Done - S1)** |
| **HU-04: Bolsillos de Ahorro / Metas** | 8 SP | Yerson Niño / Daniel Cortes | **Work in Progress (WIP)** |
| **HU-05: Historial y Búsqueda Avanzada** | 5 SP | Jorman Palacios | **En Pruebas (Testing)** |
| **HU-06: Control de Préstamos a Terceros** | 8 SP | Juan Diego Peraza / Daniel Cortes | **Work in Progress (WIP)** |
| **HU-07: Manejo Visible de Errores** | 3 SP | Fabián Córdoba | **En Pruebas (Testing)** |

---

## 2. Registro de Dailies de Sprint 2 (Muestreo del Periodo)

### Daily — 14 de Septiembre de 2026 (Semana 7 - Arranque Sprint 2)
- **Ayer:** Cierre y consolidación del Sprint 1 tras la Sustentación 1 (5 de septiembre). Inicio del refinamiento de las historias de Bolsillos (HU-04) y Deudas (HU-06).
- **Hoy:** Diseñar la estructura de datos NoSQL para subcolecciones de bolsillos en Firestore y maquetar los filtros de historial.
- **Impedimentos:** Ninguno.

### Daily — 21 de Septiembre de 2026 (Semana 8)
- **Ayer:** Pruebas del componente de búsqueda y filtrado dinámico en la capa de presentación (HU-05).
- **Hoy:** Avanzar en la lógica de separación de saldo líquido vs. saldo comprometido en bolsillos de ahorro (HU-04).
- **Impedimentos:** Definir si los bolsillos restan inmediatamente del saldo líquido disponible en el dashboard (se acuerda en reunión de diseño que sí, para reflejar liquidez real del hogar).

### Daily — 26 de Septiembre de 2026 (Semana 8 - Estado Actual)
- **Ayer:** Estabilización del servicio de notificaciones Toast para capturar errores de red en la integración externa de la TRM.
- **Hoy:** Continuar el desarrollo de los modelos de `Bolsillo` y `Deuda` para pasarlos a la fase de pruebas durante la primera semana de octubre.
- **Impedimentos:** Ninguno. El equipo mantiene ritmo sostenible de acuerdo con el calendario hacia la Sustentación 2 (5 - 10 de octubre).

---

## 3. Registro de Uso de Inteligencia Artificial en Sprint 2 (§8)

### 3.1 ¿Qué le pedimos a la IA?
1. Apoyo en la formulación de consultas compuestas para Firestore en filtros por rango de fechas y categorías.
2. Sugerencias de diseño en Tailwind CSS para representar visualmente el avance porcentual de los bolsillos de ahorro.
3. Asistencia en el modelado de la clase `Deuda` y su impacto en el cálculo patrimonial.

### 3.2 ¿Qué aceptamos?
- La inclusión de barras de progreso accesibles con Tailwind para las metas de ahorro.
- El cálculo puro en cliente de saldos líquidos para evitar lecturas excesivas en la base de datos Firestore.

### 3.3 ¿Qué rechazamos y por qué?
- **Rechazamos crear una colección independiente separada de usuarios para los bolsillos:** La IA sugirió una colección raíz global de bolsillos. Se rechazó técnicamente porque violaba la regla de control de acceso y privacidad del hogar; los bolsillos deben asociarse directamente al UID del usuario o ID del hogar compartido para garantizar el aislamiento de datos (§2.1 Condición 2).
