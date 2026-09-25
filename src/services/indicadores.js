/**
 * @file indicadores.js
 * @description Capa de Infraestructura / Servicios - Integración Externa con API pública de la TRM.
 * Cumple con la Condición Técnica Obligatoria #3 de la materia Práctica Aplicada.
 * @module services/indicadores
 */

const URL_API_TRM = "https://trm-colombia.vercel.app/api/trm/current";

/**
 * Consulta la Tasa Representativa del Mercado (TRM) oficial colombiana desde una API pública.
 * Implementa programación defensiva con fallback ante contingencias de red.
 * 
 * @async
 * @returns {Promise<{ valor: number, fecha: string, fuente: string }>} Objeto con el valor de la TRM.
 */
export async function consultarTRM() {
  try {
    const respuesta = await fetch(URL_API_TRM, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Respuesta no satisfactoria del servidor TRM (Status: ${respuesta.status})`);
    }

    const datos = await respuesta.json();

    // Validación defensiva de la estructura de datos recibida
    const valorTRM = datos?.data?.value || datos?.valor;
    if (typeof valorTRM !== "number" || isNaN(valorTRM) || valorTRM <= 0) {
      throw new Error("Estructura de respuesta de TRM no reconocida.");
    }

    return {
      valor: valorTRM,
      fecha: datos?.data?.date || new Date().toISOString().split("T")[0],
      fuente: "Superintendencia Financiera de Colombia"
    };
  } catch (error) {
    console.warn("[IndicadoresService.consultarTRM] Fallo al consumir API externa:", error.message);
    // Retorna valor referencial defensivo para evitar que la interfaz falle si la API externa cae
    return {
      valor: 4150,
      fecha: new Date().toISOString().split("T")[0],
      fuente: "Valor de referencia local (Offline)"
    };
  }
}
