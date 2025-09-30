import { loginUserService } from '../../../services/v1/auth.service.js';
import { loginValidator } from '../../../middlewares/validators/login.validator.js';
import { validationResult } from 'express-validator';
import { successResponse, errorResponse } from '../../../utils/response.util.js';

const login = [
    ...loginValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Error de validación', 422, errors.array());
        }
        try {
            const result = await loginUserService(req.body);
            if (!result.success) {
                return errorResponse(res, result.message, 401);
            }
            return successResponse(res, {
                message: 'Inicio de sesión exitoso.',
                usuario: result.usuario,
                token: result.token
            }, 200);
        } catch (error) {
            return errorResponse(res, error.message || 'Error al iniciar sesión.', 500, error.details);
        }
    }
];

export default login;