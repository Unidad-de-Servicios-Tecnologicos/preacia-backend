import { body } from "express-validator";

export const resetPasswordValidator = [
    body("correo")
        .trim()
        .notEmpty().withMessage("El correo es requerido.")
        .isEmail().withMessage("El correo no es válido.")
        .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres."),
    body("token")
        .trim()
        .notEmpty().withMessage("El token es requerido."),
    body("nueva_contrasena")
        .notEmpty().withMessage("La nueva contraseña es requerida.")
        .isLength({ min: 8, max: 64 }).withMessage("La nueva contraseña debe tener entre 8 y 64 caracteres.")
];