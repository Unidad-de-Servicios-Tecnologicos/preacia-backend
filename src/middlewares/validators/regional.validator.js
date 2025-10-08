import { body, param } from 'express-validator';

const idParamValidator = [
    param('id')
        .isNumeric()
        .withMessage('El ID debe ser numérico.')
        .notEmpty()
        .withMessage('El ID es obligatorio.')
];

const cambiarEstadoValidator = [
    body('estado')
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).')
        .notEmpty()
        .withMessage('El estado es obligatorio.')
];

const createRegionalValidator = [
    body('codigo')
        .isString()
        .withMessage('El código debe ser una cadena de texto.')
        .isLength({ min: 2, max: 20 })
        .withMessage('El código debe tener entre 2 y 20 caracteres.')
        .matches(/^[A-Z0-9_-]+$/)
        .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos.')
        .notEmpty()
        .withMessage('El código es obligatorio.')
        .trim()
        .toUpperCase(),

    body('nombre')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ min: 3, max: 200 })
        .withMessage('El nombre debe tener entre 3 y 200 caracteres.')
        .notEmpty()
        .withMessage('El nombre es obligatorio.')
        .trim(),

    body('direccion')
        .optional()
        .isString()
        .withMessage('La dirección debe ser una cadena de texto.')
        .isLength({ max: 300 })
        .withMessage('La dirección no puede exceder 300 caracteres.')
        .trim(),

    body('telefono')
        .optional()
        .isString()
        .withMessage('El teléfono debe ser una cadena de texto.')
        .isLength({ max: 20 })
        .withMessage('El teléfono no puede exceder 20 caracteres.')
        .matches(/^[0-9\s\-\+\(\)]+$/)
        .withMessage('El teléfono solo puede contener números, espacios, guiones, más y paréntesis.')
        .trim(),

    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).'),
];

// Validador para actualización
const updateRegionalValidator = [
    body('codigo')
        .optional()
        .trim()
        .isString()
        .withMessage('El código debe ser una cadena de texto.')
        .isLength({ min: 2, max: 20 })
        .withMessage('El código debe tener entre 2 y 20 caracteres.')
        .matches(/^[A-Z0-9_-]+$/)
        .withMessage('El código solo puede contener letras mayúsculas, números, guiones y guiones bajos.')
        .toUpperCase(),

    body('nombre')
        .optional()
        .trim()
        .isString()
        .withMessage('El nombre debe ser una cadena de texto.')
        .isLength({ min: 3, max: 200 })
        .withMessage('El nombre debe tener entre 3 y 200 caracteres.'),

    body('direccion')
        .optional()
        .trim()
        .isString()
        .withMessage('La dirección debe ser una cadena de texto.')
        .isLength({ max: 300 })
        .withMessage('La dirección no puede exceder 300 caracteres.'),

    body('telefono')
        .optional()
        .trim()
        .isString()
        .withMessage('El teléfono debe ser una cadena de texto.')
        .isLength({ max: 20 })
        .withMessage('El teléfono no puede exceder 20 caracteres.')
        .matches(/^[0-9\s\-\+\(\)]+$/)
        .withMessage('El teléfono solo puede contener números, espacios, guiones, más y paréntesis.'),

    body('estado')
        .optional()
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).'),
];

export { 
    idParamValidator, 
    createRegionalValidator, 
    updateRegionalValidator, 
    cambiarEstadoValidator 
};

