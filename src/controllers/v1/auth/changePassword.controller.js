import { changePasswordService } from "../../../services/v1/auth.service.js";
import { successResponse, errorResponse } from "../../../utils/response.util.js";

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.usuario.id; // Del middleware de autenticación

    // Las validaciones ya se manejan completamente en el middleware validator
    // Llamar directamente al servicio para cambiar la contraseña
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
};

export default changePassword;
