import { body } from "express-validator";

export const loginValidator = [
    body("login")
        .notEmpty().withMessage("El campo de usuario, numero de documento o correo es requerido."),
    body("contrasena")
        .notEmpty().withMessage("La contraseña es requerida.")
        .isLength({ max: 100 }).withMessage("La contraseña debe tener máximo 100 caracteres."),
];