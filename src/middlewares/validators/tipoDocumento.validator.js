import { body, param } from 'express-validator';
import { EstadoEnum } from '../../enums/estado.enum.js';

const idParamValidator = [
    param('id')
        .isNumeric()
        .withMessage('El id debe ser numérico.')
        .notEmpty()
];


const cambiarEstadoValidator = [
    body('activo')
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).')
        .notEmpty()
        .withMessage('El estado es obligatorio.')
];

const createTipoDocumentoValidator = [
    body('codigo')
        .isString()
        .withMessage('El código debe ser una cadena de texto.')
        .isLength({ min: 2, max: 10 })
        .withMessage('El código debe tener entre 2 y 10 caracteres.')
        .matches(/^[A-Z0-9_-]+$/)
        .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos.')
        .notEmpty()
        .withMessage('El código es obligatorio.')
        .trim()
        .toUpperCase(),

    body('nombre')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres.')
        .notEmpty()
        .withMessage('El nombre es obligatorio.')
        .trim(),

    body('activo')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).'),
];

// Validador para actualización
const updateTipoDocumentoValidator = [
    body('codigo')
        .optional()
        .trim()
        .isString()
        .withMessage('El código debe ser una cadena de texto.')
        .isLength({ min: 2, max: 10 })
        .withMessage('El código debe tener entre 2 y 10 caracteres.')
        .matches(/^[A-Z0-9_-]+$/)
        .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos.')
        .toUpperCase(),

    body('nombre')
        .optional()
        .trim()
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres.'),

    body('activo')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).'),
];

export { idParamValidator, createTipoDocumentoValidator, updateTipoDocumentoValidator, cambiarEstadoValidator };