/**
 * @file dashboard.js
 * @description Capa de Presentación - Renderizado reactivo del Dashboard financiero y tabla de transacciones.
 * @module ui/dashboard
 */

import { registrarTransaccion, eliminarTransaccion, calcularTotales } from "../services/firestore.js";
import { Transaccion, TIPO_TRANSACCION, AMBITO_TRANSACCION, CATEGORIAS_GASTO, CATEGORIAS_INGRESO } from "../models/Transaccion.js";
import { formatearMoneda, formatearFecha, formatearTRM } from "../utils/formateo.js?v=2";
import { consultarTRM } from "../services/indicadores.js?v=2";
import { mostrarToast } from "./notificaciones.js";

let usuarioActual = null;
let transaccionesEnMemoria = [];
let filtroAmbitoActual = "TODOS";
let divisaActiva = "COP";
let tasaTRM = 3329.61;

/**
 * Inicializa y enlaza todos los eventos del Dashboard.
 * @param {object} usuario - Datos del usuario autenticado.
 */
export function inicializarDashboardUI(usuario) {
  usuarioActual = usuario;

  const elementoNombre = document.getElementById("nav-user-name");
  const elementoEmail = document.getElementById("nav-user-email");
  if (elementoNombre) elementoNombre.textContent = usuario.displayName || "Usuario";
  if (elementoEmail) elementoEmail.textContent = usuario.email;

  // Cargar indicador externo de TRM (Condición Técnica #3)
  cargarIndicadorTRM();

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

  // Manejador de filtros por ámbito
  if (selectFiltroAmbito) {
    selectFiltroAmbito.addEventListener("change", (e) => {
      filtroAmbitoActual = e.target.value;
      renderizarListaTransacciones();
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
 * Renderiza el listado visual de transacciones con soporte para borrado y filtros.
 */
function renderizarListaTransacciones() {
  const contenedor = document.getElementById("lista-transacciones");
  const contador = document.getElementById("contador-transacciones");
  if (!contenedor) return;

  const filtradas = transaccionesEnMemoria.filter((t) => {
    if (filtroAmbitoActual === "TODOS") return true;
    return t.ambito === filtroAmbitoActual;
  });

  if (contador) {
    contador.textContent = `${filtradas.length} ${filtradas.length === 1 ? 'registro' : 'registros'}`;
  }

  if (filtradas.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 14l6-6m0 0l-6-6m6 6H3"/>
        </svg>
        <p class="text-base font-medium">No hay transacciones registradas</p>
        <p class="text-xs text-slate-500 mt-1">Registra tus ingresos o gastos utilizando el formulario superior.</p>
      </div>
    `;
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
              <h4 class="font-medium text-white text-sm">${t.descripcion}</h4>
              <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full ${esCompartido ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700 text-slate-300'}">
                ${t.ambito}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              <span class="text-slate-300 font-medium">${t.categoria}</span> • ${formatearFecha(t.fecha)}
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

  // Asignar listeners a los botones de eliminación
  contenedor.querySelectorAll(".btn-eliminar-transaccion").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("¿Confirmas que deseas eliminar esta transacción de Firestore?")) {
        try {
          await eliminarTransaccion(id);
          mostrarToast("Transacción eliminada exitosamente.", "info");
        } catch (error) {
          mostrarToast(error.message, "error");
        }
      }
    });
  });
}

/**
 * Carga las opciones de categorías según sea Ingreso o Gasto.
 * @param {'INGRESO'|'GASTO'} tipo 
 * @param {HTMLSelectElement} elementoSelect 
 */
function poblarCategorias(tipo, elementoSelect) {
  const lista = tipo === TIPO_TRANSACCION.INGRESO ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO;
  elementoSelect.innerHTML = lista.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
}

/**
 * Controla el estado visual de los botones del formulario.
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
 * Consulta la TRM oficial externa y actualiza el indicador visual en el header.
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
 * @param {HTMLButtonElement} btnActivo 
 * @param {HTMLButtonElement} btnInactivo 
 */
function actualizarEstilosBotonesDivisa(btnActivo, btnInactivo) {
  btnActivo.className = "px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm transition-all";
  btnInactivo.className = "px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-all";
}


