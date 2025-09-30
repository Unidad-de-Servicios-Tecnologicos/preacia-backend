import { registerUserService } from '../../../services/v1/auth.service.js';
import { registerUserValidator } from '../../../middlewares/validators/usuario.validator.js';
import { validationResult } from 'express-validator';
import { successResponse, errorResponse } from '../../../utils/response.util.js';

const register = [
    ...registerUserValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation Error', 422, errors.array());
        }
        try {
            const result = await registerUserService(req.body);
            return successResponse(res, result, 201);
        } catch (error) {
            return errorResponse(res, error.message || 'Error al registrar el usuario.', error.status || 500, error.details);
        }
    }
];

export default register;