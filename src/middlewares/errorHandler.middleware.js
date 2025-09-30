import { logError } from "../config/logger.config.js";
import { errorResponse } from "../utils/response.util.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log del error para debugging
  logError(`Error ${statusCode}: ${message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Errores específicos de Sequelize
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const details = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));

    return errorResponse(res, message, statusCode, [
      {
        code: 'VALIDATION_ERROR',
        details
      }
    ]);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Resource already exists';

    return errorResponse(res, message, statusCode, [
      {
        code: 'DUPLICATE_RESOURCE',
        details: 'A resource with this information already exists'
      }
    ]);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid foreign key reference';

    return errorResponse(res, message, statusCode, [
      {
        code: 'FOREIGN_KEY_ERROR',
        details: 'Referenced resource does not exist'
      }
    ]);
  }

  // Error de JSON malformado
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'Invalid JSON format', 400, [
      {
        code: 'INVALID_JSON',
        details: 'Request body contains malformed JSON'
      }
    ]);
  }

  // Error genérico
  const errorData = {
    code: err.code || 'INTERNAL_ERROR'
  };

  // Solo mostrar stack trace en desarrollo
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    errorData.stack = err.stack;
  }

  return errorResponse(
    res,
    statusCode === 500 ? 'Internal Server Error' : message,
    statusCode,
    [errorData]
  );
};