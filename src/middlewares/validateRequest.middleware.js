import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.util.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    
    const formattedErrors = errors.array().map(err => ({
      type: "field",
      value: err.value,
      msg: err.msg,
      path: err.path || err.param,
      location: err.location
    }));

    return errorResponse(
      res,
      "Errores de validación",
      422,
      formattedErrors
    );
  }
  next();
};