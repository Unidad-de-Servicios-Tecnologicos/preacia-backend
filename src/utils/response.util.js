// src/utils/response.util.js
/**
 * Envía una respuesta JSON de éxito bajo el estándar JSON:API,
 * permitiendo datos directos y links/metadatos opcionales.
 * @param {Response} res - Objeto response de Express.
 * @param {any} data - Datos a retornar (array u objeto).
 * @param {number} [code=200] - Código de estado HTTP.
 * @param {object} [meta] - Información adicional opcional.
 * @param {object} [links] - Links de paginación u otros (opcional).
 */
export const successResponse = (res, data, code = 200, meta = undefined, links = undefined) => {
  const response = { data };
  if (meta) response.meta = meta;
  if (links) response.links = links;
  return res.status(code).json(response);
};

/**
 * Envía una respuesta JSON de error bajo el estándar JSON:API.
 * @param {Response} res - Objeto response de Express.
 * @param {string} [title='Error'] - Título del error.
 * @param {number} [code=500] - Código de estado HTTP.
 * @param {object|array} [errors=null] - Detalles adicionales del error.
 */
export const errorResponse = (res, title = 'Error', code = 500, errors = null) => {
  const response = {
    errors: Array.isArray(errors)
      ? errors.map(e => ({
        status: String(code),
        title,
        detail: e?.detail || e,
        // ...e,
      }))
      : [
        {
          status: String(code),
          title,
          detail: errors?.detail || errors,
          // ...errors,
        },
      ],
  };
  return res.status(code).json(response);
};