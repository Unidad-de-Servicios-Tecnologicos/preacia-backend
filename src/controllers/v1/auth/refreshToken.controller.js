import { successResponse, errorResponse } from "../../../utils/response.util.js";
import { header, validationResult } from "express-validator";
import { refreshTokenService } from "../../../services/v1/auth.service.js";

// Validador: el refresh token debe venir en la cabecera 'Authorization'
const refreshTokenValidator = [
  header("authorization")
    .notEmpty()
    .withMessage("El refresh token es requerido en la cabecera 'Authorization'.")
];

const refreshToken = [
  ...refreshTokenValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), 422);
    }

    // Obtiene el refresh token desde la cabecera Authorization: Bearer <token>
    const authHeader = req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Formato de cabecera Authorization inválido. Debe ser 'Bearer <token>'.", 401);
    }

    const refreshToken = authHeader.split(" ")[1];
    if (!refreshToken) {
      return errorResponse(res, "Refresh token no proporcionado en la cabecera Authorization.", 401);
    }

    const result = await refreshTokenService(refreshToken);

    if (!result.success) {
      return errorResponse(res, result.message, result.status || 400);
    }

    return successResponse(res, { accessToken: result.accessToken }, 200);
  }
];

export default refreshToken;