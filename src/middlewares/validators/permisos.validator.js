import { body, param } from "express-validator";

// Validador para el parámetro id
const idParamValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo.")
        .notEmpty()
        .withMessage("El ID es obligatorio."),
];


export {
    idParamValidator,
};
