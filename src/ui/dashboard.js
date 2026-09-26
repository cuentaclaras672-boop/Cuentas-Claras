/**
 * @file dashboard.js
 * @description Capa de Presentación - Renderizado reactivo del Dashboard financiero y tabla de transacciones.
 * @module ui/dashboard
 */

import { 
  registrarTransaccion, 
  eliminarTransaccion, 
  calcularTotales,
  registrarBolsillo,
  eliminarBolsillo,
  abonarFondosBolsillo,
  calcularTotalBolsillos
} from "../services/firestore.js";
import { Transaccion, TIPO_TRANSACCION, AMBITO_TRANSACCION, CATEGORIAS_GASTO, CATEGORIAS_INGRESO } from "../models/Transaccion.js";
import { Bolsillo } from "../models/Bolsillo.js";
import { formatearMoneda, formatearFecha, formatearTRM, escaparHTML } from "../utils/formateo.js?v=4";
import { consultarTRM } from "../services/indicadores.js?v=4";
import { mostrarToast } from "./notificaciones.js";

let usuarioActual = null;
let transaccionesEnMemoria = [];
let bolsillosEnMemoria = [];
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
      renderizarListaBolsillos();
      mostrarToast("Visualizando saldos en Pesos Colombianos (COP)", "info", 2000);
    });

    btnDivisaUSD.addEventListener("click", () => {
      if (divisaActiva === "USD") return;
      divisaActiva = "USD";
      actualizarEstilosBotonesDivisa(btnDivisaUSD, btnDivisaCOP);
      renderizarTarjetasResumen();
      renderizarListaTransacciones();
      renderizarListaBolsillos();
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

  // =========================================================================
  // MANEJADORES PARA BOLSILLOS DE AHORRO CON METAS (Tarea 4.3 - Jorman Palacios)
  // =========================================================================
  const btnToggleBolsillo = document.getElementById("btn-toggle-form-bolsillo");
  const btnCancelarBolsillo = document.getElementById("btn-cancelar-bolsillo");
  const contenedorFormBolsillo = document.getElementById("contenedor-form-bolsillo");
  const formBolsillo = document.getElementById("form-bolsillo");

  if (btnToggleBolsillo && contenedorFormBolsillo) {
    btnToggleBolsillo.addEventListener("click", () => {
      contenedorFormBolsillo.classList.toggle("hidden");
      if (!contenedorFormBolsillo.classList.contains("hidden")) {
        document.getElementById("bolsillo-nombre")?.focus();
      }
    });
  }

  if (btnCancelarBolsillo && contenedorFormBolsillo) {
    btnCancelarBolsillo.addEventListener("click", () => {
      contenedorFormBolsillo.classList.add("hidden");
      formBolsillo?.reset();
    });
  }

  if (formBolsillo) {
    formBolsillo.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputNombre = document.getElementById("bolsillo-nombre");
      const inputMeta = document.getElementById("bolsillo-meta");
      const btnSubmit = formBolsillo.querySelector("button[type='submit']");

      try {
        cambiarEstadoBoton(btnSubmit, true, "Creando...");
        const nuevoBolsillo = new Bolsillo({
          nombre: inputNombre.value,
          meta: inputMeta.value,
          montoAcumulado: 0,
          creadoPor: usuarioActual.uid,
          fecha: new Date()
        });

        await registrarBolsillo(nuevoBolsillo);
        mostrarToast(`Bolsillo "${nuevoBolsillo.nombre}" creado exitosamente.`, "exito");
        formBolsillo.reset();
        contenedorFormBolsillo.classList.add("hidden");
      } catch (error) {
        mostrarToast(error.message, "error");
      } finally {
        cambiarEstadoBoton(btnSubmit, false, "Crear Bolsillo");
      }
    });
  }

  // =========================================================================
  // MANEJADORES DE RESILIENCIA Y CONEXIÓN (Tarea 7.1 / HU-07 - Condición #5)
  // =========================================================================
  const bannerOffline = document.getElementById("banner-offline");

  window.addEventListener("offline", () => {
    if (bannerOffline) bannerOffline.classList.remove("hidden");
    document.querySelectorAll("button[type='submit'], .btn-eliminar-transaccion, .btn-eliminar-bolsillo, .btn-abonar-bolsillo").forEach((btn) => {
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
    });
    mostrarToast("Sin conexión a Internet. Las acciones se inhabilitan para proteger tus datos.", "error", 4000);
  });

  window.addEventListener("online", () => {
    if (bannerOffline) bannerOffline.classList.add("hidden");
    document.querySelectorAll("button[type='submit'], .btn-eliminar-transaccion, .btn-eliminar-bolsillo, .btn-abonar-bolsillo").forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
    });
    mostrarToast("Conexión a Internet restablecida con éxito.", "exito", 2500);
  });
}

/**
 * Actualiza la lista de bolsillos en memoria y refresca el DOM (CA-4.4).
 * @param {Bolsillo[]} lista - Lista de bolsillos devuelta por Firestore.
 * @returns {void}
 */
export function actualizarBolsillosUI(lista) {
  bolsillosEnMemoria = lista;
  renderizarTarjetasResumen();
  renderizarListaBolsillos();
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
 * Renderiza las tarjetas de balance general, saldo disponible, ingresos, gastos y fondos en bolsillos.
 */
function renderizarTarjetasResumen() {
  const { totalIngresos, totalGastos, balanceNeto, totalCompartido } = calcularTotales(transaccionesEnMemoria);
  const totalBolsillos = calcularTotalBolsillos(bolsillosEnMemoria);
  const saldoDisponible = balanceNeto - totalBolsillos;

  const elBalance = document.getElementById("resumen-balance");
  const elDisponible = document.getElementById("resumen-disponible");
  const elIngresos = document.getElementById("resumen-ingresos");
  const elGastos = document.getElementById("resumen-gastos");
  const elBolsillos = document.getElementById("resumen-bolsillos");

  const esUSD = divisaActiva === "USD";
  const divisor = esUSD ? tasaTRM : 1;
  const decimales = esUSD ? 2 : 0;
  const divisaLabel = divisaActiva;

  if (elBalance) {
    elBalance.textContent = formatearMoneda(balanceNeto / divisor, divisaLabel, decimales);
    elBalance.className = `text-2xl font-bold ${balanceNeto >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;
  }

  // CA-4.5: El saldo disponible del dashboard recalcula y descuenta los fondos comprometidos en los bolsillos
  if (elDisponible) {
    elDisponible.textContent = formatearMoneda(saldoDisponible / divisor, divisaLabel, decimales);
    elDisponible.className = `text-2xl font-bold ${saldoDisponible >= 0 ? 'text-indigo-300' : 'text-rose-400'}`;
  }

  if (elIngresos) elIngresos.textContent = formatearMoneda(totalIngresos / divisor, divisaLabel, decimales);
  if (elGastos) elGastos.textContent = formatearMoneda(totalGastos / divisor, divisaLabel, decimales);
  if (elBolsillos) elBolsillos.textContent = formatearMoneda(totalBolsillos / divisor, divisaLabel, decimales);
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

/**
 * Renderiza las tarjetas de bolsillos de ahorro con barra de progreso porcentual y acciones (Tarea 4.3 - Jorman Palacios).
 * Cumple con los criterios de aceptación CA-4.3, CA-4.4 y CA-4.6 de la HU-04.
 * @returns {void}
 */
function renderizarListaBolsillos() {
  const contenedor = document.getElementById("lista-bolsillos");
  if (!contenedor) return;

  if (bolsillosEnMemoria.length === 0) {
    contenedor.innerHTML = `
      <div class="col-span-full text-center py-10 bg-slate-800/30 border border-dashed border-slate-700/60 rounded-2xl">
        <svg class="w-10 h-10 mx-auto mb-2 text-amber-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-sm font-semibold text-slate-300">No tienes bolsillos de ahorro aún</p>
        <p class="text-xs text-slate-500 mt-1">Crea un bolsillo para separar dinero con un propósito específico (ej. viajes, citas, emergencias).</p>
      </div>
    `;
    return;
  }

  const esUSD = divisaActiva === "USD";
  const divisor = esUSD ? tasaTRM : 1;
  const decimales = esUSD ? 2 : 0;
  const divisaLabel = divisaActiva;

  contenedor.innerHTML = bolsillosEnMemoria.map((b) => {
    const porcentaje = b.calcularPorcentaje();
    const acumuladoFormateado = formatearMoneda(b.montoAcumulado / divisor, divisaLabel, decimales);
    const metaFormateada = formatearMoneda(b.meta / divisor, divisaLabel, decimales);

    return `
      <div class="p-5 bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-slate-600 rounded-2xl transition-all shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
                🎯
              </div>
              <div>
                <h3 class="font-semibold text-white text-sm leading-tight">${escaparHTML(b.nombre)}</h3>
                <p class="text-[10px] text-slate-400 mt-0.5">Meta: ${metaFormateada}</p>
              </div>
            </div>
            
            <!-- Botón Eliminar Bolsillo (CA-4.6) -->
            <button 
              type="button" 
              data-id="${b.id}" 
              data-nombre="${escaparHTML(b.nombre)}"
              class="btn-eliminar-bolsillo p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Eliminar bolsillo (sus fondos vuelven automáticamente al saldo disponible)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>

          <!-- Barra de Progreso Visual (CA-4.4) -->
          <div class="mt-4 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-medium">Progreso</span>
              <span class="font-bold ${porcentaje >= 100 ? 'text-emerald-400' : 'text-amber-300'}">${porcentaje}%</span>
            </div>
            <div class="w-full bg-slate-900/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                class="h-full rounded-full transition-all duration-500 ${porcentaje >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-indigo-500'}" 
                style="width: ${porcentaje}%"
              ></div>
            </div>
          </div>

          <!-- Métricas de Ahorro y Faltante -->
          <div class="mt-3.5 flex justify-between items-baseline pt-3 border-t border-slate-700/40">
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-wider">Ahorrado</p>
              <p class="text-base font-bold text-emerald-400">${acumuladoFormateado}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-slate-400 uppercase tracking-wider">Faltante</p>
              <p class="text-xs font-semibold text-slate-300">
                ${b.montoAcumulado >= b.meta ? '¡Meta cumplida! 🎉' : formatearMoneda(Math.max(0, b.meta - b.montoAcumulado) / divisor, divisaLabel, decimales)}
              </p>
            </div>
          </div>
        </div>

        <!-- Botón Transferir Fondos (CA-4.3) -->
        <button 
          type="button" 
          data-id="${b.id}" 
          data-nombre="${escaparHTML(b.nombre)}"
          class="btn-abonar-bolsillo w-full py-2 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-600/40 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Transferir Fondos</span>
        </button>
      </div>
    `;
  }).join("");

  // Asignar listeners para eliminar bolsillos (CA-4.6)
  contenedor.querySelectorAll(".btn-eliminar-bolsillo").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const nombre = btn.getAttribute("data-nombre");
      if (confirm(`¿Confirmas que deseas eliminar el bolsillo "${nombre}"?\nSus fondos volverán automáticamente al saldo disponible del hogar.`)) {
        try {
          await eliminarBolsillo(id, usuarioActual?.uid);
          mostrarToast(`Bolsillo "${nombre}" eliminado. Los fondos volvieron al saldo disponible.`, "info");
        } catch (error) {
          mostrarToast(error.message, "error");
        }
      }
    });
  });

  // Asignar listeners para transferir fondos a un bolsillo con validación (CA-4.3)
  contenedor.querySelectorAll(".btn-abonar-bolsillo").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const nombre = btn.getAttribute("data-nombre");

      const { balanceNeto } = calcularTotales(transaccionesEnMemoria);
      const totalEnBolsillos = calcularTotalBolsillos(bolsillosEnMemoria);
      const disponible = balanceNeto - totalEnBolsillos;

      if (disponible <= 0) {
        mostrarToast("No tienes saldo disponible en el balance general para asignar a este bolsillo.", "advertencia");
        return;
      }

      const inputUsuario = prompt(
        `Transferir fondos a "${nombre}":\nSaldo disponible actual: $ ${disponible.toLocaleString("es-CO")} COP\n\nIngresa el monto a transferir ($ COP):`
      );

      if (!inputUsuario) return;
      const montoAbono = Number(inputUsuario.trim());

      if (isNaN(montoAbono) || montoAbono <= 0) {
        mostrarToast("Por favor ingresa un monto válido mayor a cero.", "error");
        return;
      }

      // Regla de Negocio CA-4.3: No se puede transferir más dinero del disponible en el balance general
      if (montoAbono > disponible) {
        mostrarToast(
          `No puedes transferir más dinero ($${montoAbono.toLocaleString("es-CO")}) del disponible en el balance general ($${disponible.toLocaleString("es-CO")}).`,
          "error"
        );
        return;
      }

      try {
        await abonarFondosBolsillo(id, montoAbono, usuarioActual?.uid);
        mostrarToast(`Se transfirieron exitosamente $ ${montoAbono.toLocaleString("es-CO")} al bolsillo "${nombre}".`, "exito");
      } catch (error) {
        mostrarToast(error.message, "error");
      }
    });
  });
}



