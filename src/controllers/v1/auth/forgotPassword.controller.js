import { forgotPasswordValidator } from "../../../middlewares/validators/forgotPassword.validator.js";
import { validationResult } from "express-validator";
import { successResponse, errorResponse } from "../../../utils/response.util.js";
import { forgotPasswordService } from "../../../services/v1/auth.service.js";

const forgotPassword = [
    ...forgotPasswordValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Error de validación en los datos enviados.', 422, errors.array());
        }
        try {
            const result = await forgotPasswordService(req.body);
            if (!result.success) {
                return errorResponse(res, result.message, result.status || 400);
            }
            return successResponse(res, { message: result.message }, 200);
        } catch (error) {
            return errorResponse(res, error.message || "Error al enviar el enlace.", 500);
        }
    }
];

export default forgotPassword;