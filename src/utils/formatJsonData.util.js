/**
 * Formatea un recurso o lista de recursos al estándar JSON:API,
 * dejando los datos directos sin el objeto attributes.
 * @param {object|array} data - Objeto o array de objetos a formatear.
 * @param {array} [fields] - Campos a incluir (opcional).
 * @returns {object|array}
 */
export function formatJsonApiData(data, fields = null) {
  const formatItem = (item) =>
    fields
      ? Object.fromEntries(fields.map(f => [f, item[f]]))
      : Object.fromEntries(Object.entries(item).filter(([key]) => key !== "id"));

  if (Array.isArray(data)) {
    return data.map(formatItem);
  }
  return formatItem(data);
}