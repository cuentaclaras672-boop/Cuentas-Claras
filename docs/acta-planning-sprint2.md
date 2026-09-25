# Acta de Sprint Planning — Sprint 2
**Proyecto:** Cuentas Claras — Gestión de Finanzas Compartidas en el Hogar  
**Materia:** Práctica Aplicada (TIC42695) · Ingeniería de Sistemas · Semestre 2026-2  
**Duración del Sprint:** 4 semanas (del 07 de septiembre al 10 de octubre de 2026)  
**Fecha de Corte:** 26 de septiembre de 2026 (Semana 8 · Promedio del Sprint 2)  
**Cierre Programado:** Sustentación 2 (entre el 5 y el 10 de octubre de 2026)  

---

## 1. Roles del Equipo Scrum

| Rol | Integrante | Responsabilidad Principal en Sprint 2 |
|---|---|---|
| **Product Owner** | Juan Diego Peraza Amado | Priorización del Backlog, validación de condiciones técnicas obligatorias y apoyo en UI. |
| **Scrum Master** | Fabián Eduardo Córdoba | Monitoreo del flujo de trabajo en Miro, gestión de calidad, pruebas de resiliencia y verificación de Toasts. |
| **Development Team** | Daniel Felipe Cortes | Persistencia en Firestore de bolsillos, integración externa con API TRM y control de excepciones. |
| **Development Team** | Jorman Palacios Murillo | Diseño e integración visual en Tailwind de tarjetas de bolsillos, filtros dinámicos y modales. |
| **Development Team** | Yerson Niño Guerrero | Modelado de entidades de dominio (`Bolsillo.js`), algoritmos de filtrado y conversión monetaria. |

---

## 2. Objetivo del Sprint 2 (Sprint Goal)
> *"Incorporar la gestión de bolsillos de ahorro para metas del hogar, la integración externa con la API oficial de la TRM del dólar para conversión multidivisa, el historial con filtrado dinámico y la consolidación del manejo visible de errores, garantizando el cumplimiento verificable del 100% de las condiciones técnicas obligatorias de la asignatura para la Sustentación 2."*

---

## 3. Estado de Historias de Usuario en el Tablero de Miro / Planner (Al 26 de Septiembre de 2026)

```
+--------------------+--------------------------------+-----------------------+---------------------+
|     POR HACER      |     WORK IN PROGRESS (WIP)     |      EN PRUEBAS       |   TERMINADO (DONE)  |
+--------------------+--------------------------------+-----------------------+---------------------+
|                    | • [HU-04] Bolsillos de Ahorro  | • [HU-05] Historial y | • [HU-01] Auth (S1) |
|                    |                                |           Filtros     | • [HU-02] CRUD (S1) |
|                    |                                | • [HU-06] Integración | • [HU-03] Saldo (S1)|
|                    |                                |           Externa TRM |                     |
|                    |                                | • [HU-07] Manejo de   |                     |
|                    |                                |           Errores     |                     |
+--------------------+--------------------------------+-----------------------+---------------------+
```

---

## 4. Descomposición y Cronograma de Tareas por Historia de Usuario (4 Semanas)

El trabajo se distribuye a lo largo de las 4 semanas del sprint (Semanas 6, 7, 8 y 9) para garantizar un flujo continuo y sostenible:

### [HU-05] Historial de Movimientos con Búsqueda y Filtros Dinámicos
- **Talla y Estimación:** Talla S (5 Story Points).
- **Prioridad:** **Alta** (Garantiza el cumplimiento obligatorio de la **Condición Técnica #4**).
- **Estado Actual al 26 de septiembre:** **En Pruebas (Testing)**.
- **Descripción:** Como usuario, quiero buscar transacciones por concepto y filtrarlas simultáneamente por categoría, fecha o ámbito (Personal/Compartido), para conciliar rápidamente cualquier movimiento sin revisar libretas ni múltiples extractos bancarios.
- **Descomposición de Tareas:**
  - **Tarea 5.1:** Diseñar barra de búsqueda y selectores en HTML/Tailwind.  
    *Responsable:* Jorman Palacios (UI) | **09 sep - 12 sep** | *Estado:* Done.
  - **Tarea 5.2:** Programar lógica de filtrado combinado en el array en `dashboard.js`.  
    *Responsable:* Yerson Niño (Lógica) | **13 sep - 16 sep** | *Estado:* Done.
  - **Tarea 5.3:** Adaptar la consulta `onSnapshot` en `firestore.js` para indexar datos.  
    *Responsable:* Daniel Cortes (Servicios) | **16 sep - 20 sep** | *Estado:* Done.
  - **Tarea 5.4:** Pruebas de renderizado de resultados y validación de estados vacíos.  
    *Responsable:* Fabián Córdoba (Calidad) | **21 sep - 26 sep** | *Estado:* **En Pruebas**.

---

### [HU-06] Integración Externa de Indicadores Económicos y Conversión Multidivisa
- **Talla y Estimación:** Talla S (5 Story Points).
- **Prioridad:** **Alta** (Garantiza el cumplimiento obligatorio de la **Condición Técnica #3**).
- **Estado Actual al 26 de septiembre:** **En Pruebas (Testing)**.
- **Descripción:** Como miembro del hogar, quiero consultar en tiempo real la TRM oficial del dólar y visualizar la equivalencia de mis saldos y metas de ahorro en USD, para tomar decisiones financieras informadas frente a compras en moneda extranjera o inflación.
- **Descomposición de Tareas:**
  - **Tarea 6.1:** Spike técnico y servicio modular de consumo de API TRM con fallback offline (`indicadores.js`).  
    *Responsable:* Daniel Cortes (Servicios) | **10 sep - 14 sep** | *Estado:* Done.
  - **Tarea 6.2:** Función de conversión de divisa (COP a USD) y utilidades matemáticas en `formateo.js`.  
    *Responsable:* Yerson Niño (Dominio / Utilidades) | **15 sep - 19 sep** | *Estado:* Done.
  - **Tarea 6.3:** Componente visual de indicador y toggle multidivisa en el Dashboard (`index.html`).  
    *Responsable:* Juan Diego Peraza / Jorman Palacios (PO / UI) | **20 sep - 24 sep** | *Estado:* Done.
  - **Tarea 6.4:** Pruebas de latencia, excepciones de red y validación en vivo frente a evaluadores.  
    *Responsable:* Fabián Córdoba (Calidad / Scrum Master) | **24 sep - 28 sep** | *Estado:* **En Pruebas**.

---

### [HU-07] Manejo de Errores Visible y Notificaciones Contextuales
- **Talla y Estimación:** Talla S (3 Story Points).
- **Prioridad:** **Crítica** (Garantiza la **Condición Técnica #5**: *"El usuario se entera de forma útil. No pantallazos en blanco"*).
- **Estado Actual al 26 de septiembre:** **En Pruebas (Testing)**.
- **Descripción:** Como usuario, quiero recibir alertas visuales claras e instantáneas ante fallos de conexión o rechazos de base de datos, para entender qué ocurrió sin que la aplicación quede congelada.
- **Descomposición de Tareas:**
  - **Tarea 7.1:** Maquetar la alerta Toast en Tailwind CSS (Estados: Éxito, Error, Info, Advertencia).  
    *Responsable:* Jorman Palacios (UI) | **12 sep - 16 sep** | *Estado:* Done.
  - **Tarea 7.2:** Escribir el módulo independiente `notificaciones.js` para renderizar Toasts dinámicos.  
    *Responsable:* Fabián Córdoba (Scrum Master / Calidad) | **16 sep - 20 sep** | *Estado:* Done.
  - **Tarea 7.3:** Inyectar las llamadas de Toast dentro de todos los bloques `catch` de servicios.  
    *Responsable:* Daniel Cortes (Servicios) | **21 sep - 24 sep** | *Estado:* Done.
  - **Tarea 7.4:** Forzar caídas de red desde el navegador para probar la visibilidad de los errores en pantalla (Modo offline en F12).  
    *Responsable:* Fabián Córdoba (Calidad) | **25 sep - 29 sep** | *Estado:* **En Pruebas**.

---

### [HU-04] Bolsillos de Ahorro / Cajas con Propósitos Fijos
- **Talla y Estimación:** Talla M (8 Story Points).
- **Prioridad:** **Alta** (Núcleo funcional del Product Goal del Hogar).
- **Estado Actual al 26 de septiembre:** **En Desarrollo (Work In Progress - WIP)**.
- **Descripción:** Como miembro del hogar, quiero crear bolsillos específicos (ej. citas, bebé, viajes, emergencias) asignándoles una meta monetaria y fondos, para separar el dinero disponible para gastos inmediatos del dinero con un propósito específico.
- **Descomposición de Tareas:**
  - **Tarea 4.1:** Modelar la colección y estructura de datos de `Bolsillo.js` en dominio.  
    *Responsable:* Yerson Niño (Capa de Dominio) | **18 sep - 22 sep** | *Estado:* Done.
  - **Tarea 4.2:** Funciones asíncronas para transferir fondos en Firestore.  
    *Responsable:* Daniel Cortes (Integración Firebase) | **23 sep - 27 sep** | *Estado:* **WIP (En Desarrollo)**.
  - **Tarea 4.3:** Maquetar las tarjetas de bolsillos y barra de progreso en Tailwind.  
    *Responsable:* Jorman Palacios (Capa UI/UX) | **27 sep - 30 sep** | *Estado:* Por Hacer.
  - **Tarea 4.4:** Lógica matemática del porcentaje y pruebas de integración final.  
    *Responsable:* Fabián Córdoba (Calidad / Scrum Master) | **30 sep - 03 oct** | *Estado:* Por Hacer.

---

## 5. Resumen de Capacidad y Ritmo del Sprint 2
- **Historias Planificadas:** 4 Historias de Usuario (Todas Prioridad Alta o Crítica).
- **Total Story Points:** **21 SP** ($5 + 5 + 3 + 8$).
- **Ritmo Semanal:** ~5.25 SP por semana, distribuido equitativamente entre los 5 miembros del equipo.
- **Cadencia hacia la Sustentación 2:**
  - **Semana 6 (07 - 12 sep):** Planning, estimación, diseño y arranque de tareas visuales y de servicio.
  - **Semana 7 (14 - 19 sep):** Construcción de filtros, TRM y toasts.
  - **Semana 8 (21 - 26 sep - HOY):** Fase de QA/Testing en HU-05, HU-06 y HU-07; desarrollo activo de transferencias de bolsillos (HU-04 WIP).
  - **Semana 9 (28 sep - 04 oct):** Integración completa, pruebas de regresión, verificación de consola en cero y preparación para la Sustentación 2 (05 - 10 oct).
