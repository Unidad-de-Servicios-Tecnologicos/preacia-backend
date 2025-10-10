import { body, param } from 'express-validator';
import { EstadoEnum } from '../../enums/estado.enum.js';

const idParamValidator = [
    param('id')
        .isNumeric()
        .withMessage('El id debe ser numérico.')
        .notEmpty()
];


const cambiarEstadoValidator = [
    body('estado')
        .custom((value) => {
            // Aceptar booleanos true/false o strings 'true'/'false' o los valores del enum
            if (typeof value === 'boolean') return true;
            if (value === 'true' || value === 'false') return true;
            if (Object.values(EstadoEnum).includes(value)) return true;
            return false;
        })
        .withMessage('El estado debe ser booleano o string "true"/"false" o un valor válido del enum.')
        .notEmpty()
        .withMessage('El estado es obligatorio.')
];

const createTipoDocumentoValidator = [

    body('nombre')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ min: 3, max: 45 })
        .withMessage('El nombre debe tener entre 3 y 45 caracteres.')
        .notEmpty()
        .withMessage('El nombre es obligatorio.')
        .trim(),

    body('estado')
        .custom((value) => {
            if (typeof value === 'boolean') return true;
            if (value === 'true' || value === 'false') return true;
            if (Object.values(EstadoEnum).includes(value)) return true;
            return false;
        })
        .withMessage('El estado debe ser booleano o string "true"/"false" o un valor válido del enum.')
        .notEmpty()
        .withMessage('El estado es obligatorio.')
        .trim(),
];

// Validador para actualización (NO valida el código porque ya existe)
const updateTipoDocumentoValidator = [
    // Permitir cambio de código solo si es diferente al actual

    body('nombre')
        .optional()
        .trim()
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ min: 3, max: 45 })
        .withMessage('El nombre debe tener entre 3 y 45 caracteres.'),

    body('estado')
        .optional()
        .custom((value) => {
            if (typeof value === 'boolean') return true;
            if (value === 'true' || value === 'false') return true;
            if (Object.values(EstadoEnum).includes(value)) return true;
            return false;
        })
        .withMessage('El estado debe ser booleano o string "true"/"false" o un valor válido del enum.')
        .trim(),
];

export { idParamValidator, createTipoDocumentoValidator, updateTipoDocumentoValidator, cambiarEstadoValidator };