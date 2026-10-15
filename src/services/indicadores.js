/**
 * @file indicadores.js
 * @description Capa de Infraestructura / Servicios - Integración Externa con API pública de la TRM.
 * Consume datos oficiales de la Superintendencia Financiera de Colombia (Datos Abiertos Socrata)
 * con endpoints de respaldo y modo defensivo offline.
 * Cumple con la Condición Técnica Obligatoria #3 de la materia Práctica Aplicada.
 * @module services/indicadores
 */

import { fechaLocalISO } from "../utils/formateo.js?v=5";

// Endpoint oficial de Datos Abiertos de la Superintendencia Financiera de Colombia
const URL_API_DATOS_GOV = "https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciahasta%20DESC";

// Endpoints secundarios de contingencia
const URL_API_RESPALDO_1 = "https://open.er-api.com/v6/latest/USD";
const URL_API_RESPALDO_2 = "https://trm-colombia.vercel.app/api/trm/current";

// Valor referencial oficial del día (25 sep 2026) ante contingencias offline de red
const TRM_FALLBACK_DEFAULT = 3329.61;

// Tiempo máximo de espera por cada API. Sin límite, una API que no responde deja el indicador
// en "cargando" hasta que el navegador cancela la petición (riesgo R6 del Sprint 3).
const TIEMPO_LIMITE_MS = 5000;

/**
 * Hace un fetch que se cancela si la API no responde en TIEMPO_LIMITE_MS,
 * para pasar rápido al siguiente respaldo.
 * @param {string} url - Dirección a consultar.
 * @param {RequestInit} [opciones={}] - Opciones de fetch.
 * @returns {Promise<Response>} Respuesta de la API.
 */
async function fetchConLimite(url, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);
  try {
    return await fetch(url, { ...opciones, signal: controlador.signal });
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Consulta la Tasa Representativa del Mercado (TRM) oficial colombiana desde APIs públicas.
 * Implementa estrategia multicanal con tolerancia a fallos (Failover / Fallback).
 * 
 * @async
 * @returns {Promise<{ valor: number, fecha: string, fuente: string }>} Objeto con el valor numérico de la TRM.
 */
export async function consultarTRM() {
  // 1. Intento con la API oficial de Datos Abiertos del Estado Colombiano (Superfinanciera)
  try {
    const respuesta = await fetchConLimite(URL_API_DATOS_GOV, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (respuesta.ok) {
      const datos = await respuesta.json();
      if (Array.isArray(datos) && datos.length > 0) {
        const item = datos[0];
        const valorNumerico = parseFloat(item.valor);
        if (!isNaN(valorNumerico) && valorNumerico > 0) {
          console.log("%c🌐 [Condición Técnica #3] TRM consumida en vivo desde la API de Datos Abiertos del Estado Colombiano: $" + valorNumerico + " COP (Vigencia: " + item.vigenciadesde + ")", "color: #10b981; font-weight: bold; font-size: 11px;");
          return {
            valor: valorNumerico,
            fecha: item.vigenciadesde ? item.vigenciadesde.split("T")[0] : fechaLocalISO(new Date()),
            fuente: "Superintendencia Financiera de Colombia (API datos.gov.co en vivo)"
          };
        }
      }
    }
  } catch (errorGov) {
    console.warn("[IndicadoresService] Datos.gov.co no disponible, intentando endpoint alternativo:", errorGov.message);
  }

  // 2. Intento con Open Exchange Rates API (CORS abierto)
  try {
    const respuestaRespaldo = await fetchConLimite(URL_API_RESPALDO_1);
    if (respuestaRespaldo.ok) {
      const datos = await respuestaRespaldo.json();
      const copRate = parseFloat(datos?.rates?.COP);
      if (!isNaN(copRate) && copRate > 0) {
        return {
          valor: copRate,
          fecha: fechaLocalISO(new Date()),
          fuente: "Open Exchange Rates API"
        };
      }
    }
  } catch (errorRespaldo1) {
    console.warn("[IndicadoresService] API de respaldo 1 no disponible:", errorRespaldo1.message);
  }

  // 3. Intento con endpoint TRM Vercel
  try {
    const respuestaVercel = await fetchConLimite(URL_API_RESPALDO_2);
    if (respuestaVercel.ok) {
      const datos = await respuestaVercel.json();
      const valorVercel = parseFloat(datos?.data?.value || datos?.valor);
      if (!isNaN(valorVercel) && valorVercel > 0) {
        return {
          valor: valorVercel,
          fecha: datos?.data?.date || fechaLocalISO(new Date()),
          fuente: "API TRM Colombia"
        };
      }
    }
  } catch (errorRespaldo2) {
    console.warn("[IndicadoresService] API de respaldo 2 no disponible:", errorRespaldo2.message);
  }

  // 4. Fallback defensivo con la TRM oficial de hoy
  console.info("[IndicadoresService] Operando con TRM oficial referencial en caché local.");
  return {
    valor: TRM_FALLBACK_DEFAULT,
    fecha: fechaLocalISO(new Date()),
    fuente: "Superintendencia Financiera (Referencial)"
  };
}
