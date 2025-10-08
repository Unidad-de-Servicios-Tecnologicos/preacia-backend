import { resetPasswordService } from "../../../services/v1/auth.service.js";
import { successResponse, errorResponse } from "../../../utils/response.util.js";
import { resetPasswordValidator } from "../../../middlewares/validators/resetPassword.validator.js";
import { validationResult } from "express-validator";

const resetPassword = [
    ...resetPasswordValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Error de validación en los datos enviados.', 422, errors.array());
        }
        try {
            const result = await resetPasswordService(req.body);
            if (!result.success) {
                return errorResponse(res, result.message, result.status || 400);
            }
            return successResponse(res, { message: result.message }, 200);
        } catch (error) {
            return errorResponse(res, error.message || "Error al cambiar la contraseña.", 500);
        }
    }
];

export default resetPassword;