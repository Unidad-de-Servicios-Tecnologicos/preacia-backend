import { changePasswordService } from "../../../services/v1/auth.service.js";
import { successResponse, errorResponse } from "../../../utils/response.util.js";
import { changePasswordValidator } from "../../../middlewares/validators/changePassword.validator.js";
import { validationResult } from "express-validator";

const changePassword = [
    ...changePasswordValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Error de validación en los datos enviados.', 422, errors.array());
        }

        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.usuario.id; // Del middleware de autenticación

            const result = await changePasswordService(userId, currentPassword, newPassword);

            return successResponse(
                res,
                {
                    message: "Contraseña actualizada exitosamente",
                    success: true,
                },
                200
            );
        } catch (error) {
            console.error("❌ Error en changePassword:", error);

            // Manejar errores específicos del servicio
            if (error.code === "INVALID_CURRENT_PASSWORD") {
                return errorResponse(res, "La contraseña actual es incorrecta", 400, [
                    {
                        code: "INVALID_CURRENT_PASSWORD",
                        detail: "La contraseña actual que ingresaste no es correcta",
                    },
                ]);
            }

            if (error.code === "USER_NOT_FOUND") {
                return errorResponse(res, "Usuario no encontrado", 404, [
                    {
                        code: "USER_NOT_FOUND",
                        detail: "No se encontró el usuario especificado",
                    },
                ]);
            }

            return errorResponse(res, "Error interno del servidor", 500, [
                {
                    code: "INTERNAL_ERROR",
                    detail: error.message,
                },
            ]);
        }
    }
];

export default changePassword;
