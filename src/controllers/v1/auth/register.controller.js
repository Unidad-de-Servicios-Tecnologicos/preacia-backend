import { registerUserService } from '../../../services/v1/auth.service.js';
import { createUserWithEmailValidator } from '../../../middlewares/validators/usuario.validator.js';
import { validationResult } from 'express-validator';
import { successResponse, errorResponse } from '../../../utils/response.util.js';

/**
 * Controlador para el registro público de usuarios
 * La contraseña se genera automáticamente y se envía por correo
 * El usuario debe ser activado por un administrador
 */
const register = [
    ...createUserWithEmailValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Error de validación', 422, errors.array());
        }
        try {
            const result = await registerUserService(req.body);
            return successResponse(res, result, 201);
        } catch (error) {
            console.error('Error en registro de usuario:', error);
            return errorResponse(res, error.message || 'Error al registrar el usuario.', error.status || 500, error.details);
        }
    }
];

export default register;