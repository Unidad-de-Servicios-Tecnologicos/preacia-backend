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
        .isIn(Object.values(EstadoEnum))
        .withMessage('El estado debe ser un valor enum (ACTIVO o INACTIVO).')
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
        .isIn(Object.values(EstadoEnum))
        .withMessage('El estado debe ser un valor enum (ACTIVO o INACTIVO).')
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
        .isIn(Object.values(EstadoEnum))
        .withMessage('El estado debe ser un valor enum (ACTIVO o INACTIVO).')
        .trim(),
];

export { idParamValidator, createTipoDocumentoValidator, updateTipoDocumentoValidator, cambiarEstadoValidator };