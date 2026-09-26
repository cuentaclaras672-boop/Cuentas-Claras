/**
 * @file dashboard.js
 * @description Capa de Presentación - Renderizado reactivo del Dashboard financiero y tabla de transacciones.
 * @module ui/dashboard
 */

import { registrarTransaccion, eliminarTransaccion, calcularTotales } from "../services/firestore.js";
import { Transaccion, TIPO_TRANSACCION, AMBITO_TRANSACCION, CATEGORIAS_GASTO, CATEGORIAS_INGRESO } from "../models/Transaccion.js";
import { formatearMoneda, formatearFecha, formatearTRM, escaparHTML } from "../utils/formateo.js?v=3";
import { consultarTRM } from "../services/indicadores.js?v=3";
import { mostrarToast } from "./notificaciones.js";

let usuarioActual = null;
let transaccionesEnMemoria = [];
let filtroBusquedaTexto = "";
let filtroTipoActual = "TODOS";
let filtroAmbitoActual = "TODOS";
let filtroCategoriaActual = "TODAS";
let filtroFechaDesdeActual = "";
let filtroFechaHastaActual = "";
let divisaActiva = "COP";
let tasaTRM = 3329.61;
let listenersInicializados = false;

/**
 * Normaliza un texto removiendo diacríticos/tildes y convirtiendo a minúsculas para búsqueda insensible.
 * @param {string} str - Cadena de texto a normalizar.
 * @returns {string} Cadena normalizada en minúsculas y sin acentos.
 */
function normalizarTexto(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Inicializa y enlaza todos los eventos del Dashboard.
 * Emplea un flag de control para evitar la duplicación de manejadores de eventos (submit, filtros)
 * ante inicios y cierres de sesión repetidos en la misma sesión de navegador.
 * 
 * @param {object} usuario - Datos del usuario autenticado.
 * @returns {void}
 */
export function inicializarDashboardUI(usuario) {
  usuarioActual = usuario;

  const elementoNombre = document.getElementById("nav-user-name");
  const elementoEmail = document.getElementById("nav-user-email");
  if (elementoNombre) elementoNombre.textContent = usuario.displayName || "Usuario";
  if (elementoEmail) elementoEmail.textContent = usuario.email;

  // Cargar indicador externo de TRM (Condición Técnica #3)
  cargarIndicadorTRM();

  // Si los listeners del DOM ya fueron configurados previamente, evitar duplicación
  if (listenersInicializados) {
    return;
  }
  listenersInicializados = true;

  // Selector Multidivisa COP / USD (Tarea 6.3 - Juan Diego Peraza)
  const btnDivisaCOP = document.getElementById("btn-divisa-cop");
  const btnDivisaUSD = document.getElementById("btn-divisa-usd");

  if (btnDivisaCOP && btnDivisaUSD) {
    btnDivisaCOP.addEventListener("click", () => {
      if (divisaActiva === "COP") return;
      divisaActiva = "COP";
      actualizarEstilosBotonesDivisa(btnDivisaCOP, btnDivisaUSD);
      renderizarTarjetasResumen();
      renderizarListaTransacciones();
      mostrarToast("Visualizando saldos en Pesos Colombianos (COP)", "info", 2000);
    });

    btnDivisaUSD.addEventListener("click", () => {
      if (divisaActiva === "USD") return;
      divisaActiva = "USD";
      actualizarEstilosBotonesDivisa(btnDivisaUSD, btnDivisaCOP);
      renderizarTarjetasResumen();
      renderizarListaTransacciones();
      mostrarToast(`Saldos convertidos a Dólares (USD) a tasa oficial TRM ($${tasaTRM.toLocaleString('es-CO')})`, "info", 3000);
    });
  }

  const selectTipo = document.getElementById("transaccion-tipo");
  const selectCategoria = document.getElementById("transaccion-categoria");
  const formTransaccion = document.getElementById("form-transaccion");
  const selectFiltroAmbito = document.getElementById("filtro-ambito");

  // Actualizar categorías dinámicamente según el tipo seleccionado
  if (selectTipo && selectCategoria) {
    poblarCategorias(selectTipo.value, selectCategoria);
    selectTipo.addEventListener("change", () => {
      poblarCategorias(selectTipo.value, selectCategoria);
    });
  }

  // Manejador del formulario de nueva transacción
  if (formTransaccion) {
    formTransaccion.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputDescripcion = document.getElementById("transaccion-descripcion");
      const inputMonto = document.getElementById("transaccion-monto");
      const selectAmbito = document.getElementById("transaccion-ambito");
      const btnSubmit = formTransaccion.querySelector("button[type='submit']");

      try {
        cambiarEstadoBoton(btnSubmit, true, "Registrando...");

        const nuevaTransaccion = new Transaccion({
          descripcion: inputDescripcion.value,
          monto: inputMonto.value,
          tipo: selectTipo.value,
          ambito: selectAmbito.value,
          categoria: selectCategoria.value,
          creadoPor: usuarioActual.uid,
          nombreUsuario: usuarioActual.displayName || usuarioActual.email,
          fecha: new Date()
        });

        await registrarTransaccion(nuevaTransaccion);
        mostrarToast("Transacción registrada con éxito en Firestore.", "exito");
        formTransaccion.reset();
        poblarCategorias(selectTipo.value, selectCategoria);
      } catch (error) {
        mostrarToast(error.message, "error");
      } finally {
        cambiarEstadoBoton(btnSubmit, false, "Guardar Movimiento");
      }
    });
  }

  // Poblado inicial del selector de categorías en la barra de filtros
  const selectFiltroCategoria = document.getElementById("filtro-categoria");
  if (selectFiltroCategoria) {
    const todasCategorias = [...new Set([...CATEGORIAS_GASTO, ...CATEGORIAS_INGRESO])].sort();
    selectFiltroCategoria.innerHTML = `<option value="TODAS">Todas las categorías</option>` +
      todasCategorias.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  }

  // CA-5.1: Búsqueda en tiempo real por texto (descripción/concepto o categoría)
  const inputBusqueda = document.getElementById("filtro-busqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", (e) => {
      filtroBusquedaTexto = normalizarTexto(e.target.value);
      renderizarListaTransacciones();
    });
  }

  // CA-5.2: Filtro por tipo de flujo (Ingreso / Gasto)
  const selectFiltroTipo = document.getElementById("filtro-tipo");
  if (selectFiltroTipo) {
    selectFiltroTipo.addEventListener("change", (e) => {
      filtroTipoActual = e.target.value;
      renderizarListaTransacciones();
    });
  }

  // CA-5.2: Filtro por ámbito (Personal / Compartido)
  if (selectFiltroAmbito) {
    selectFiltroAmbito.addEventListener("change", (e) => {
      filtroAmbitoActual = e.target.value;
      renderizarListaTransacciones();
    });
  }

  // CA-5.2: Filtro por categoría temática
  if (selectFiltroCategoria) {
    selectFiltroCategoria.addEventListener("change", (e) => {
      filtroCategoriaActual = e.target.value;
      renderizarListaTransacciones();
    });
  }

  // CA-5.3: Filtro por rango de fechas (desde / hasta) con validación
  const inputFechaDesde = document.getElementById("filtro-fecha-desde");
  const inputFechaHasta = document.getElementById("filtro-fecha-hasta");

  const manejarCambioFechas = () => {
    const desde = inputFechaDesde?.value || "";
    const hasta = inputFechaHasta?.value || "";

    if (desde && hasta && desde > hasta) {
      mostrarToast("La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.", "advertencia");
      return;
    }
    filtroFechaDesdeActual = desde;
    filtroFechaHastaActual = hasta;
    renderizarListaTransacciones();
  };

  if (inputFechaDesde) inputFechaDesde.addEventListener("change", manejarCambioFechas);
  if (inputFechaHasta) inputFechaHasta.addEventListener("change", manejarCambioFechas);

  // CA-5.5: Botón para limpiar y restablecer todos los filtros
  const btnLimpiar = document.getElementById("btn-limpiar-filtros");
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
      filtroBusquedaTexto = "";
      filtroTipoActual = "TODOS";
      filtroAmbitoActual = "TODOS";
      filtroCategoriaActual = "TODAS";
      filtroFechaDesdeActual = "";
      filtroFechaHastaActual = "";

      if (inputBusqueda) inputBusqueda.value = "";
      if (selectFiltroTipo) selectFiltroTipo.value = "TODOS";
      if (selectFiltroAmbito) selectFiltroAmbito.value = "TODOS";
      if (selectFiltroCategoria) selectFiltroCategoria.value = "TODAS";
      if (inputFechaDesde) inputFechaDesde.value = "";
      if (inputFechaHasta) inputFechaHasta.value = "";

      renderizarListaTransacciones();
      mostrarToast("Filtros restablecidos al estado inicial.", "info", 2000);
    });
  }
}

/**
 * Actualiza la lista de transacciones en memoria y desencadena el renderizado en el DOM.
 * @param {Transaccion[]} lista - Arreglo de transacciones devuelto por el listener en tiempo real.
 */
export function actualizarDashboard(lista) {
  transaccionesEnMemoria = lista;
  renderizarTarjetasResumen();
  renderizarListaTransacciones();
}

/**
 * Renderiza las tarjetas de balance general, ingresos, gastos y gastos compartidos.
 */
function renderizarTarjetasResumen() {
  const { totalIngresos, totalGastos, balanceNeto, totalCompartido } = calcularTotales(transaccionesEnMemoria);

  const elBalance = document.getElementById("resumen-balance");
  const elIngresos = document.getElementById("resumen-ingresos");
  const elGastos = document.getElementById("resumen-gastos");
  const elCompartido = document.getElementById("resumen-compartido");

  const esUSD = divisaActiva === "USD";
  const divisor = esUSD ? tasaTRM : 1;
  const decimales = esUSD ? 2 : 0;
  const divisaLabel = divisaActiva;

  if (elBalance) {
    elBalance.textContent = formatearMoneda(balanceNeto / divisor, divisaLabel, decimales);
    elBalance.className = `text-2xl font-bold ${balanceNeto >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
  }

  if (elIngresos) elIngresos.textContent = formatearMoneda(totalIngresos / divisor, divisaLabel, decimales);
  if (elGastos) elGastos.textContent = formatearMoneda(totalGastos / divisor, divisaLabel, decimales);
  if (elCompartido) elCompartido.textContent = formatearMoneda(totalCompartido / divisor, divisaLabel, decimales);
}

/**
 * Renderiza el listado visual de transacciones aplicando los filtros combinados de búsqueda, tipo, categoría, ámbito y fechas.
 * Preserva la inmutabilidad del arreglo original en memoria (DoD HU-05 y Condición #4).
 * @returns {void}
 */
function renderizarListaTransacciones() {
  const contenedor = document.getElementById("lista-transacciones");
  const contador = document.getElementById("contador-transacciones");
  const btnLimpiar = document.getElementById("btn-limpiar-filtros");
  if (!contenedor) return;

  const hayFiltrosActivos = Boolean(
    filtroBusquedaTexto ||
    filtroTipoActual !== "TODOS" ||
    filtroAmbitoActual !== "TODOS" ||
    filtroCategoriaActual !== "TODAS" ||
    filtroFechaDesdeActual ||
    filtroFechaHastaActual
  );

  // Mostrar u ocultar el botón de limpiar filtros (CA-5.5)
  if (btnLimpiar) {
    if (hayFiltrosActivos) {
      btnLimpiar.classList.remove("hidden");
      btnLimpiar.classList.add("flex");
    } else {
      btnLimpiar.classList.add("hidden");
      btnLimpiar.classList.remove("flex");
    }
  }

  // Filtrado como función pura sin mutar transaccionesEnMemoria (CA-5.1, CA-5.2, CA-5.3)
  const filtradas = transaccionesEnMemoria.filter((t) => {
    // CA-5.1: Búsqueda textual insensible a mayúsculas y acentos en descripción o categoría
    if (filtroBusquedaTexto) {
      const descNorm = normalizarTexto(t.descripcion);
      const catNorm = normalizarTexto(t.categoria);
      if (!descNorm.includes(filtroBusquedaTexto) && !catNorm.includes(filtroBusquedaTexto)) {
        return false;
      }
    }

    // CA-5.2: Filtro por tipo (GASTO / INGRESO)
    if (filtroTipoActual !== "TODOS" && t.tipo !== filtroTipoActual) {
      return false;
    }

    // CA-5.2: Filtro por ámbito (PERSONAL / COMPARTIDO)
    if (filtroAmbitoActual !== "TODOS" && t.ambito !== filtroAmbitoActual) {
      return false;
    }

    // CA-5.2: Filtro por categoría temática
    if (filtroCategoriaActual !== "TODAS" && t.categoria !== filtroCategoriaActual) {
      return false;
    }

    // CA-5.3: Filtro por rango de fechas (desde / hasta)
    if (filtroFechaDesdeActual || filtroFechaHastaActual) {
      let fechaObj = t.fecha;
      if (fechaObj && typeof fechaObj.toDate === "function") {
        fechaObj = fechaObj.toDate();
      } else if (fechaObj && fechaObj.seconds) {
        fechaObj = new Date(fechaObj.seconds * 1000);
      } else if (!(fechaObj instanceof Date)) {
        fechaObj = new Date(fechaObj);
      }

      if (!isNaN(fechaObj.getTime())) {
        const fechaIso = fechaObj.toISOString().split("T")[0];
        if (filtroFechaDesdeActual && fechaIso < filtroFechaDesdeActual) return false;
        if (filtroFechaHastaActual && fechaIso > filtroFechaHastaActual) return false;
      }
    }

    return true;
  });

  // CA-5.4: Contador visual interactivo
  if (contador) {
    const total = transaccionesEnMemoria.length;
    if (hayFiltrosActivos) {
      contador.textContent = `${filtradas.length} de ${total} ${total === 1 ? 'registro' : 'registros'} filtrados`;
    } else {
      contador.textContent = `${filtradas.length} ${filtradas.length === 1 ? 'registro' : 'registros'}`;
    }
  }

  // CA-5.4: Estado vacío contextual si no hay registros o no hay coincidencias con filtros
  if (filtradas.length === 0) {
    if (hayFiltrosActivos) {
      contenedor.innerHTML = `
        <div class="text-center py-12 text-slate-400 bg-slate-800/20 border border-dashed border-slate-700/60 rounded-xl">
          <svg class="w-10 h-10 mx-auto mb-2.5 opacity-40 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="text-sm font-semibold text-slate-300">No hay movimientos con esos filtros</p>
          <p class="text-xs text-slate-500 mt-1">Intenta ajustando los criterios de búsqueda o restablece los filtros.</p>
        </div>
      `;
    } else {
      contenedor.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 14l6-6m0 0l-6-6m6 6H3"/>
          </svg>
          <p class="text-base font-medium">No hay transacciones registradas</p>
          <p class="text-xs text-slate-500 mt-1">Registra tus ingresos o gastos utilizando el formulario superior.</p>
        </div>
      `;
    }
    return;
  }

  const esUSD = divisaActiva === "USD";
  const divisor = esUSD ? tasaTRM : 1;
  const decimales = esUSD ? 2 : 0;
  const divisaLabel = divisaActiva;

  contenedor.innerHTML = filtradas.map((t) => {
    const esIngreso = t.tipo === TIPO_TRANSACCION.INGRESO;
    const esCompartido = t.ambito === AMBITO_TRANSACCION.COMPARTIDO;

    return `
      <div class="flex items-center justify-between p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg ${esIngreso ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}">
            ${esIngreso 
              ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>'
              : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>'
            }
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-medium text-white text-sm">${escaparHTML(t.descripcion)}</h4>
              <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full ${esCompartido ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700 text-slate-300'}">
                ${escaparHTML(t.ambito)}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              <span class="text-slate-300 font-medium">${escaparHTML(t.categoria)}</span> • ${formatearFecha(t.fecha)}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="font-semibold text-sm ${esIngreso ? 'text-emerald-400' : 'text-rose-400'}">
            ${esIngreso ? '+' : '-'} ${formatearMoneda(t.monto / divisor, divisaLabel, decimales)}
          </span>
          <button 
            type="button" 
            data-id="${t.id}" 
            class="btn-eliminar-transaccion p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Eliminar transacción"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Asignar listeners a los botones de eliminación verificando propiedad defensiva
  contenedor.querySelectorAll(".btn-eliminar-transaccion").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("¿Confirmas que deseas eliminar esta transacción de Firestore?")) {
        try {
          await eliminarTransaccion(id, usuarioActual?.uid);
          mostrarToast("Transacción eliminada exitosamente.", "info");
        } catch (error) {
          mostrarToast(error.message, "error");
        }
      }
    });
  });
}

/**
 * Carga las opciones de categorías según sea Ingreso o Gasto en el elemento select correspondiente.
 * @param {'INGRESO'|'GASTO'} tipo - Tipo de transacción actual.
 * @param {HTMLSelectElement} elementoSelect - Elemento select del formulario a poblar.
 * @returns {void}
 */
function poblarCategorias(tipo, elementoSelect) {
  const lista = tipo === TIPO_TRANSACCION.INGRESO ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO;
  elementoSelect.innerHTML = lista.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
}

/**
 * Controla el estado visual y de interacción de los botones durante peticiones asíncronas.
 * @param {HTMLButtonElement} boton - Elemento botón del DOM a manipular.
 * @param {boolean} cargando - Indica si la petición se encuentra en progreso.
 * @param {string} texto - Texto descriptivo a presentar en el botón.
 * @returns {void}
 */
function cambiarEstadoBoton(boton, cargando, texto) {
  if (!boton) return;
  boton.disabled = cargando;
  boton.textContent = texto;
  if (cargando) {
    boton.classList.add("opacity-60", "cursor-not-allowed");
  } else {
    boton.classList.remove("opacity-60", "cursor-not-allowed");
  }
}

/**
 * Consulta la TRM oficial externa y actualiza el indicador visual en el header de la aplicación.
 * @async
 * @returns {Promise<void>}
 */
async function cargarIndicadorTRM() {
  const elValorTRM = document.getElementById("valor-trm");
  const badgeTRM = document.getElementById("badge-trm");
  if (!elValorTRM) return;

  try {
    const { valor, fuente } = await consultarTRM();
    tasaTRM = valor;
    elValorTRM.textContent = formatearTRM(valor);
    if (badgeTRM) {
      badgeTRM.title = `Fuente oficial: ${fuente}`;
    }
  } catch (error) {
    elValorTRM.textContent = "$ 3.329,61";
    if (badgeTRM) {
      badgeTRM.title = "Fuente: Modo contingencia local";
    }
  }
}

/**
 * Alterna visualmente el estado activo/inactivo entre los botones de divisa COP y USD.
 * @param {HTMLButtonElement} btnActivo - Botón que pasa a estado seleccionado.
 * @param {HTMLButtonElement} btnInactivo - Botón que pasa a estado deseleccionado.
 * @returns {void}
 */
function actualizarEstilosBotonesDivisa(btnActivo, btnInactivo) {
  btnActivo.className = "px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm transition-all";
  btnInactivo.className = "px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all";
}


