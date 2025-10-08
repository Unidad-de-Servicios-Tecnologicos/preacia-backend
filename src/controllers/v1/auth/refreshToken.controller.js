import { successResponse, errorResponse } from "../../../utils/response.util.js";
import { validationResult } from "express-validator";
import { refreshTokenService } from "../../../services/v1/auth.service.js";
import { refreshTokenValidator } from "../../../middlewares/validators/refreshToken.validator.js";

const refreshToken = [
    ...refreshTokenValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Error de validación en los datos enviados.', 422, errors.array());
        }

        try {
            // Obtiene el refresh token desde la cabecera Authorization: Bearer <token>
            const authHeader = req.header("authorization");
            const token = authHeader.split(" ")[1];

            const result = await refreshTokenService(token);

            if (!result.success) {
                return errorResponse(res, result.message, result.status || 400);
            }

            return successResponse(res, { accessToken: result.accessToken }, 200);
        } catch (error) {
            return errorResponse(res, error.message || "Error al renovar el token.", 500);
        }
    }
];

export default refreshToken;