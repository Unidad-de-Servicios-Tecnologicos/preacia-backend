import { body } from "express-validator";

export const forgotPasswordValidator = [
    body("correo")
        .trim()
        .notEmpty().withMessage("El correo es requerido.")
        .isEmail().withMessage("El correo no es válido.")
        .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres.")
];