import { body, param } from 'express-validator';

const asignarValidator = [
    body('usuario_id')
        .isInt({ min: 1 })
        .withMessage('El usuario_id debe ser un entero positivo.')
        .notEmpty()
        .withMessage('El usuario_id es obligatorio.'),

    body('permiso_id')
        .isInt({ min: 1 })
        .withMessage('El permiso_id debe ser un entero positivo.')
        .notEmpty()
        .withMessage('El permiso_id es obligatorio.'),
];

const quitarValidator = [...asignarValidator];

const usuarioIdParamValidator = [
    param('usuario_id')
        .isInt({ min: 1 })
        .withMessage('El usuario_id debe ser un entero positivo.')
        .notEmpty()
        .withMessage('El usuario_id es obligatorio.'),
];

const permisoIdParamValidator = [
    param('permiso_id')
        .isInt({ min: 1 })
        .withMessage('El permiso_id debe ser un entero positivo.')
        .notEmpty()
        .withMessage('El permiso_id es obligatorio.'),
];

export { asignarValidator, quitarValidator, usuarioIdParamValidator, permisoIdParamValidator };
