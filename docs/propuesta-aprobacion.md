# Propuesta de Proyecto Integrador — Práctica Aplicada
**Código de Materia:** TIC42695 · **Programa:** Ingeniería de Sistemas  
**Semestre Académico:** 2026-2 · **Nombre del Producto:** Cuentas Claras  

---

## 1. El Problema (Descrito sin términos técnicos)

La convivencia en pareja y las relaciones interpersonales (familiares o amigos) suelen deteriorarse e incluso terminar debido a la mala gestión del dinero y la falta de acuerdos financieros. Al compartir una vida, surge la necesidad de dividir equitativamente gastos comunes (arriendo, servicios, mercado) y establecer fondos conjuntos (para un activo, viajes), además de lidiar con préstamos informales a terceros que rara vez se devuelven. 

Llevar este control en libretas, actualizando tablas de cálculo de forma manual o revisando múltiples aplicaciones bancarias dispersas resulta desgastante, genera desconfianza y provoca discusiones por la falta de claridad sobre "quién puso qué" y con cuánto dinero real se cuenta en el día a día.

---

## 2. A quién observamos y qué aprendimos de esa conversación

Observamos a parejas jóvenes que recién inician la convivencia (basado en nuestra propia experiencia directa) y a personas que prestan dinero a su círculo cercano.

Aprendimos que el principal detonante de los problemas no es la falta de ingresos, sino la falta de claridad y herramientas para conciliar las cuentas. Descubrimos que tener la información financiera descentralizada impide visualizar cuánto dinero es de uso personal y cuánto está comprometido para las responsabilidades conjuntas o metas a corto plazo (como el fondo de citas).

---

## 3. Product Goal

> **Lograr que las parejas y usuarios individuales centralicen la gestión de sus compromisos financieros (gastos compartidos, metas de ahorro y control de préstamos a terceros), reduciendo el estrés y el tiempo de cuadre de cuentas a menos de 5 minutos semanales, y logrando un registro activo de al menos el 80% de sus movimientos financieros al finalizar las 16 semanas del semestre.**

---

## 4. Product Backlog Inicial

1. **Módulo de "Cajas / Bolsillos":** Separación y visualización de fondos con propósitos fijos (ej. citas, bebé, viajes).
2. **Registro y seguimiento de estado de deudas / préstamos informales:** Control de cuentas por cobrar a amigos o familiares.
3. **Dashboard centralizado con el saldo consolidado del hogar:** Visualización en tiempo real de ingresos, gastos y balance neto.
4. **Control de acceso seguro:** Autenticación para que solo los miembros autorizados visualicen la información del hogar.

---

## 5. Cómo se cumplirán las Siete Condiciones Técnicas Obligatorias

1. **Persistencia Real:** Integración con la base de datos NoSQL Cloud Firestore para almacenar de forma persistente y en tiempo real las transacciones, saldos y movimientos del hogar. Cero almacenamiento en memoria volátil o `localStorage`.
2. **Sesión o Control de Acceso:** Implementación de Firebase Authentication para validar credenciales (correo/contraseña) y asegurar que cada persona solo acceda a la información de su respectivo hogar.
3. **Integración Externa:** Consumo asíncrono mediante `fetch` de una API pública gratuita (TRM oficial del dólar en Colombia en `src/services/indicadores.js`) para que el hogar consulte indicadores económicos relevantes al tomar decisiones de ahorro o compras.
4. **Consulta con Filtrado o Búsqueda:** Vista dinámica de historial donde el usuario puede buscar y filtrar sus movimientos financieros por categoría, ámbito (Personal / Compartido) y tipo (Ingreso / Gasto).
5. **Manejo de Errores Visible:** Implementación de alertas visuales en la interfaz (Toasts flotantes y modales) que notifican amigablemente al usuario ante fallos de red, validaciones de formulario o errores de autenticación, evitando pantallas en blanco.
6. **Repositorio en GitHub:** Proyecto alojado en un repositorio oficial de GitHub con acceso concedido al docente, ramas por funcionalidad y commits distribuidos con autoría individual verificable.
7. **Documentación Versionada:** Archivo `README.md` y artefactos ágiles en carpeta `docs/` actualizados en cada sprint, detallando la configuración del entorno de Firebase y la arquitectura en capas del sistema.

---

## 6. Integrantes del Equipo y Enlaces de Evaluación

| Nombre Completo | Correo Institucional / Usuario GitHub |
|---|---|
| **Juan Diego Peraza Amado** | `@pony-svg` / jdperaza@shd.gov.co |
| **Daniel Felipe Cortes** | Integrante Equipo Cuentas Claras |
| **Jorman Palacios Murillo** | Integrante Equipo Cuentas Claras |
| **Fabián Eduardo Córdoba** | Integrante Equipo Cuentas Claras |
| **Yerson Niño Guerrero** | Integrante Equipo Cuentas Claras |

🔗 **Accesos del Proyecto:**
- **Repositorio en GitHub:** [https://github.com/cuentaclaras672-boop/Cuentas-Claras.git](https://github.com/cuentaclaras672-boop/Cuentas-Claras.git)
- **Tablero de Gestión (Miro):** [Tablero Scrum Cuentas Claras](https://miro.com/welcomeonboard/YVBLdkdFZm96Ujdjb2tKRFFuZVA2QUQrOVdFbDc2dzRHU0tZT0hvRG1lVVNiSVNISHJyNVJZbFJyeHBRZUYzaEFqcnFuQWhJZzlBeExhYTVhUTlpdjB4SGhFS2dFNjFZcjlwNHpIa3pXblhlbVRYam1ERGtKMnpDSzhINDFZWUtyVmtkMG5hNDA3dVlncnBvRVB2ZXBnPT0hdjE=?share_link_id=694372715874)
