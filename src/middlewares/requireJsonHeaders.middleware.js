import { errorResponse } from "../utils/response.util.js";

const JSON_TYPE = 'application/json';
const methodsWithBody = ['POST', 'PUT', 'PATCH'];

export function requireJsonHeaders(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  const accept = req.headers['accept'] || '';

  const validations = [
    {
      condition:
        methodsWithBody.includes(req.method.toUpperCase()) &&
        !contentType.includes(JSON_TYPE),
      status: 415,
      message: `El encabezado Content-Type debe ser ${JSON_TYPE}`,
      code: 'UNSUPPORTED_MEDIA_TYPE'
    }
    // Comentamos la validación del Accept header que está causando problemas
    // {
    //   condition: !accept.includes(JSON_TYPE),
    //   status: 406,
    //   message: `El encabezado Accept debe ser ${JSON_TYPE}`,
    //   code: 'NOT_ACCEPTABLE'
    // },
  ];

  for (const { condition, status, message, code } of validations) {
    if (condition) {
      return errorResponse(res, message, status, { code });
    }
  }

  next();
}

export default requireJsonHeaders;