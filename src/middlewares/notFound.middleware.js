import { errorResponse } from "../utils/response.util.js";

const notFound = (req, res) => {
  return errorResponse(
    res,
    'El endpoint solicitado no existe',
    404,
    [{
      code: 'ROUTE_NOT_FOUND',
      detail: `No se encontró la ruta: ${req.originalUrl}`,
      method: req.method,
      path: req.originalUrl,
    }]
  );
};

export default notFound;