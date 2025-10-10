import { body, param } from 'express-validator';

const asociarValidator = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario_id debe ser un entero positivo.')
    .notEmpty()
    .withMessage('El usuario_id es obligatorio.'),

  body('centro_id')
    .isInt({ min: 1 })
    .withMessage('El centro_id debe ser un entero positivo.')
    .notEmpty()
    .withMessage('El centro_id es obligatorio.'),
];

const quitarValidator = [...asociarValidator];

const centroIdParamValidator = [
  param('centro_id')
    .isInt({ min: 1 })
    .withMessage('El centro_id debe ser un entero positivo.')
    .notEmpty()
    .withMessage('El centro_id es obligatorio.'),
];

const usuarioIdParamValidator = [
  param('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario_id debe ser un entero positivo.')
    .notEmpty()
    .withMessage('El usuario_id es obligatorio.'),
];

export { asociarValidator, quitarValidator, centroIdParamValidator, usuarioIdParamValidator };
