# Acta de Sprint Planning — Sprint 2
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas  
**Duración del Sprint:** 4 semanas (Semanas 6 a 9: del 7 de septiembre al 10 de octubre de 2026)  
**Fecha de Corte:** 26 de septiembre de 2026 (Promedio del Sprint 2)  
**Cierre Programado:** Sustentación 2 (entre el 5 y el 10 de octubre de 2026)  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad Principal en Sprint 2 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Priorización del Backlog de Sprint 2, definición de criterios de aceptación de Bolsillos y Deudas. |
| **Scrum Master** | Fabián Eduardo Córdoba | Monitoreo del flujo de trabajo en el tablero de Miro/Planner, límites WIP y facilitación de Dailies. |
| **Development Team** | Daniel Felipe Cortes | Persistencia en Firestore de bolsillos y cálculo de amortizaciones de deudas. |
| **Development Team** | Jorman Palacios Murillo | Diseño e integración visual en Tailwind de las tarjetas de bolsillos y filtros interactivos. |
| **Development Team** | Yerson Niño Guerrero | Modelos de dominio (`Bolsillo.js`, `Deuda.js`) y validaciones defensivas de negocio. |

---

## 2. Objetivo del Sprint 2 (Sprint Goal)
> *"Expandir las capacidades del hogar implementando el módulo de bolsillos de ahorro para propósitos fijos, el registro y control de préstamos informales a terceros, la optimización de consultas de historial con filtrado dinámico y la consolidación del manejo visible de errores, garantizando un incremento funcional robusto para la Sustentación 2."*

---

## 3. Estado de Historias de Usuario en el Tablero de Miro / Planner (Al 26 de Septiembre de 2026)

De acuerdo con el avance del equipo promediando el Sprint 2, las historias comprometidas se distribuyen en las columnas del tablero:

```
+------------------+-----------------------------+-----------------------+---------------------+
|   POR HACER      |   WORK IN PROGRESS (WIP)    |      EN PRUEBAS       |   TERMINADO (DONE)  |
+------------------+-----------------------------+-----------------------+---------------------+
|                  | [HU-04] Bolsillos de Ahorro | [HU-05] Historial con | [HU-01] Auth (S1)   |
|                  | [HU-06] Control de Deudas   |         Filtros       | [HU-02] CRUD (S1)   |
|                  |                             | [HU-07] Manejo de     | [HU-03] Saldo (S1)  |
|                  |                             |         Errores       |                     |
+------------------+-----------------------------+-----------------------+---------------------+
```

### Detalle de las Historias de Usuario del Sprint 2:

#### [HU-04] Bolsillos de Ahorro / Cajas con Propósitos Fijos
- **Estado Actual:** **En Desarrollo (Work In Progress - WIP)**
- **Descripción:** Como miembro del hogar, quiero crear bolsillos específicos (ej. citas, bebé, viajes, emergencias) asignándoles una meta monetaria y fondos, para separar el dinero disponible para gastos inmediatos del dinero con un propósito específico.
- **Criterios de Aceptación:**
  - Creación de bolsillos con nombre, meta y saldo acumulado.
  - Transferencia de fondos desde el saldo general hacia el bolsillo.
  - Barra de progreso porcentual respecto a la meta.

#### [HU-05] Historial de Movimientos con Búsqueda y Filtros Dinámicos
- **Estado Actual:** **En Pruebas (Testing)**
- **Descripción:** Como usuario, quiero buscar transacciones por concepto y filtrarlas simultáneamente por categoría, fecha o ámbito (Personal/Compartido), para conciliar rápidamente cualquier movimiento sin revisar libretas ni múltiples extractos bancarios.
- **Criterios de Aceptación:**
  - Búsqueda en tiempo real por texto descriptivo.
  - Filtro combinado por ámbito y categoría.
  - Cumplimiento de la Condición Técnica #4 de la materia.

#### [HU-06] Registro y Seguimiento de Deudas / Préstamos Informales
- **Estado Actual:** **En Desarrollo (Work In Progress - WIP)**
- **Descripción:** Como usuario, quiero registrar los préstamos informales realizados a amigos o familiares indicando monto, deudor, fecha y estado (Pendiente / Saldado), para evitar olvidos y recuperar el dinero prestado sin generar fricciones interpersonales.
- **Criterios de Aceptación:**
  - Registro de cuenta por cobrar con nombre del deudor y monto.
  - Registro de abonos parciales o liquidación total.
  - Impacto en el balance patrimonial (activo diferido vs saldo líquido).

#### [HU-07] Manejo de Errores Visible y Notificaciones Contextuales
- **Estado Actual:** **En Pruebas (Testing)**
- **Descripción:** Como usuario, quiero recibir alertas visuales claras e instantáneas ante fallos de conexión, campos incompletos o rechazos de base de datos, para entender qué ocurrió y corregirlo sin que la aplicación quede congelada o en blanco.
- **Criterios de Aceptación:**
  - Notificaciones flotantes Toasts con tiempos de expiración y códigos de color según severidad.
  - Cumplimiento de la Condición Técnica #5 de la materia.

---

## 4. Proyección hacia el Cierre de Sprint (Primera Semana de Octubre)
- **27 sep - 01 oct:** Finalización del desarrollo de HU-04 (Bolsillos) y HU-06 (Deudas).
- **02 oct - 04 oct:** Pruebas de integración, verificación de persistencia en Firestore y simulación de modificación en vivo (§7.2).
- **05 oct - 10 oct:** **Sustentación 2** frente al docente evaluador.
