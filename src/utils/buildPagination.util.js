/**
 * Utilidad para construir metadatos y links de paginación
 * @param {Object} params
 * @param {number} total - Total de elementos.
 * @param {number} page - Página actual.
 * @param {number} limit - Elementos por página.
 * @param {string} baseUrl - URL base para los links.
 * @param {string} queryWithoutPage - Query string sin el parámetro de página.
 * @returns {{ meta: Object, links: Object }}
 */
export function buildPagination({ total, page, limit, baseUrl, queryWithoutPage }) {
  const totalPages = Math.ceil(total / limit);

  const makePageLink = (p) =>
    `${baseUrl}?${queryWithoutPage ? queryWithoutPage + "&" : ""}page=${p}&limit=${limit}`;

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    links: {
      self: makePageLink(page),
      first: makePageLink(1),
      last: makePageLink(totalPages),
      prev: page > 1 ? makePageLink(page - 1) : null,
      next: page < totalPages ? makePageLink(Number(page) + 1) : null,
    },
  };
}