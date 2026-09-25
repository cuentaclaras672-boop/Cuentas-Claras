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

## 4. Historias de Usuario del Sprint 2 y Descomposición de Tareas

### [HU-04] Bolsillos de Ahorro / Cajas con Propósitos Fijos
- **Talla y Estimación:** Talla M (8 Story Points).
- **Prioridad:** **Alta** (Núcleo funcional del Product Goal).
- **Estado Actual:** **En Desarrollo (Work In Progress - WIP)**.
- **Descripción:** Como miembro del hogar, quiero crear bolsillos específicos (ej. citas, bebé, viajes, emergencias) asignándoles una meta monetaria y fondos, para separar el dinero disponible para gastos inmediatos del dinero con un propósito específico.
- **Criterios de Aceptación:**
  - Creación de bolsillos con nombre, meta y saldo acumulado.
  - Transferencia de fondos desde el saldo general hacia el bolsillo.
  - Barra de progreso porcentual respecto a la meta.
- **Descomposición de Tareas (Ejecución: 25 de septiembre al 1 de octubre):**
  - **Tarea 4.1:** Modelar la colección y estructura de datos de los bolsillos.  
    *Responsable:* Yerson Niño (Capa de Dominio).  
    *Acción esperada:* Crear el archivo `src/models/Bolsillo.js` con validaciones defensivas y métodos de serialización Firestore.
  - **Tarea 4.2:** Funciones asíncronas para transferir fondos.  
    *Responsable:* Daniel Cortes (Integración Firebase).  
    *Acción esperada:* Programar en `src/services/firestore.js` la transacción que descuenta dinero del saldo disponible y lo suma al bolsillo.
  - **Tarea 4.3:** Maquetar las tarjetas de bolsillos y barra de progreso.  
    *Responsable:* Jorman Palacios (Capa UI/UX).  
    *Acción esperada:* Diseñar en Tailwind CSS dentro de `public/index.html` las tarjetas dinámicas de bolsillos con su barra de progreso.
  - **Tarea 4.4:** Lógica matemática del porcentaje y pruebas de integración.  
    *Responsable:* Fabián Córdoba (Calidad / Scrum Master).  
    *Acción esperada:* Programar el cálculo que llena la barra de progreso (ej. meta \$100.000, acumulado \$50.000 = 50%) y certificar que la UI no sufra desbordamientos.

---

### [HU-05] Historial de Movimientos con Búsqueda y Filtros Dinámicos
- **Talla y Estimación:** Talla S (5 Story Points).
- **Prioridad:** **Alta** (Garantiza el cumplimiento obligatorio de la **Condición Técnica #4** de la rúbrica).
- **Estado Actual:** **En Pruebas (Testing)**.
- **Descripción:** Como usuario, quiero buscar transacciones por concepto y filtrarlas simultáneamente por categoría, fecha o ámbito (Personal/Compartido), para conciliar rápidamente cualquier movimiento sin revisar libretas ni múltiples extractos bancarios.
- **Criterios de Aceptación:** Búsqueda en tiempo real por texto descriptivo y filtro combinado por ámbito y categoría.
- **Descomposición de Tareas (Ejecución: 21 al 28 de septiembre):**
  - **Tarea 5.1:** Diseñar barra de búsqueda y selectores en HTML/Tailwind.  
    *Responsable:* Jorman Palacios (UI).  
    *Acción esperada:* Integrar el campo de búsqueda por texto (`input[type="search"]`) en la cabecera del historial en `public/index.html`.
  - **Tarea 5.2:** Programar lógica de filtrado combinado en el array de memoria.  
    *Responsable:* Yerson Niño (Lógica).  
    *Acción esperada:* Refactorizar la función de filtrado en `src/ui/dashboard.js` para aplicar filtros compuestos (ámbito + categoría + texto).
  - **Tarea 5.3:** Adaptar la consulta `onSnapshot` en `firestore.js` para indexar datos.  
    *Responsable:* Daniel Cortes (Servicios).  
    *Acción esperada:* Optimizar la consulta en tiempo real para traer datos limpios ordenados cronológicamente.
  - **Tarea 5.4:** Pruebas de renderizado de resultados y estados vacíos.  
    *Responsable:* Fabián Córdoba (Calidad).  
    *Acción esperada:* Validar que al no encontrar coincidencias se muestre un mensaje amigable ("No se encontraron transacciones").

---

### [HU-06] Integración Externa de Indicadores Económicos y Conversión Multidivisa
- **Talla y Estimación:** Talla S (5 Story Points).
- **Prioridad:** **Alta** (Garantiza el cumplimiento obligatorio de la **Condición Técnica #3** de la rúbrica).
- **Estado Actual:** **En Pruebas (Testing)**.
- **Descripción:** Como miembro del hogar, quiero consultar en tiempo real la TRM oficial del dólar y visualizar la equivalencia de mis saldos y metas de ahorro en USD, para tomar decisiones financieras informadas frente a compras en moneda extranjera o inflación.
- **Criterios de Aceptación:**
  - Consumo asíncrono vía `fetch` de una API pública oficial con la TRM del día.
  - Mecanismo defensivo de respaldo (fallback offline) ante fallos de conexión externa.
  - Visualización del indicador en la cabecera del Dashboard y conversión referencial COP/USD.
- **Descomposición de Tareas (Ejecución: 25 de septiembre al 2 de octubre):**
  - **Tarea 6.1:** Servicio modular de consumo de API TRM con fallback offline.  
    *Responsable:* Daniel Cortes (Servicios).  
    *Acción esperada:* Modularizar y blindar `src/services/indicadores.js` con tipado defensivo y control de latencia.
  - **Tarea 6.2:** Función de conversión monetaria (COP a USD) y utilidades matemáticas.  
    *Responsable:* Yerson Niño (Dominio / Utilidades).  
    *Acción esperada:* Implementar en `src/utils/formateo.js` el cálculo de equivalencia de divisas y formateo internacional.
  - **Tarea 6.3:** Componente visual de indicador y toggle multidivisa en el Dashboard.  
    *Responsable:* Juan Diego Peraza / Jorman Palacios (Product Owner / UI).  
    *Acción esperada:* Integrar el badge interactivo de la TRM en el header y permitir alternar visualización de metas de ahorro en USD.
  - **Tarea 6.4:** Pruebas de latencia, excepciones de red y validación en vivo.  
    *Responsable:* Fabián Córdoba (Calidad / Scrum Master).  
    *Acción esperada:* Simular caídas del endpoint externo y verificar que la aplicación continúe operando con el valor referencial seguro.

---

### [HU-07] Manejo de Errores Visible y Notificaciones Contextuales
- **Talla y Estimación:** Talla S (3 Story Points).
- **Prioridad:** **Crítica** (Garantiza la **Condición Técnica #5**: *"El usuario se entera de forma útil. No pantallazos en blanco"*).
- **Estado Actual:** **En Pruebas (Testing)**.
- **Descripción:** Como usuario, quiero recibir alertas visuales claras e instantáneas ante fallos de conexión o rechazos de base de datos, para entender qué ocurrió sin que la aplicación quede congelada.
- **Criterios de Aceptación:** Uso de notificaciones flotantes (Toasts) con tiempos de expiración y códigos de color según la severidad del error.
- **Descomposición de Tareas (Ejecución: 28 de septiembre al 4 de octubre):**
  - **Tarea 7.1:** Maquetar la alerta Toast en Tailwind CSS (Estados: Éxito, Error, Info, Advertencia).  
    *Responsable:* Jorman Palacios (UI).  
    *Acción esperada:* Diseñar y afinar los estilos visuales de los badges en `src/ui/notificaciones.js`.
  - **Tarea 7.2:** Escribir el módulo independiente `notificaciones.js` para renderizar Toasts dinámicos.  
    *Responsable:* Fabián Córdoba (Scrum Master / Calidad).  
    *Acción esperada:* Validar la creación dinámica del contenedor `#cc-toast-container` y el temporizador de auto-cierre.
  - **Tarea 7.3:** Inyectar las llamadas de Toast dentro de todos los bloques `catch` de `auth.js` y `firestore.js`.  
    *Responsable:* Daniel Cortes (Servicios).  
    *Acción esperada:* Asegurar que cualquier promesa rechazada desencadene un Toast visible con mensaje traducido al español.
  - **Tarea 7.4:** Forzar caídas de red desde el navegador para probar la visibilidad de los errores en pantalla.  
    *Responsable:* Fabián Córdoba (Calidad).  
    *Acción esperada:* Simular modo offline en DevTools (F12) y documentar capturas de pantalla para la Sustentación 2.

---

## 5. Resumen de Capacidad del Sprint 2
- **Historias Planificadas:** 4 Historias de Usuario (Todas con Prioridad Alta o Crítica).
- **Total Story Points:** **21 SP** ($8 + 5 + 5 + 3$).
- **Velocidad Promedio Requerida:** 5.25 SP por semana para el equipo (ritmo ágil balanceado, sostenible y seguro).
- **Alineación Académica:** Al finalizar este sprint, el equipo certifica el **100% de las 7 condiciones técnicas obligatorias** de la asignatura TIC42695.
- **Nota de Backlog:** La historia de *Control de Deudas y Préstamos a Terceros* se traslada estratégicamente al **Sprint 3**, integrándose con la liquidación avanzada entre convivientes.
