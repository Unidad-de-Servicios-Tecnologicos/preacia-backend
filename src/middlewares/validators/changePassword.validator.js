import { body } from "express-validator";

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty().withMessage("La contraseña actual es requerida.")
        .isLength({ min: 1, max: 100 }).withMessage("La contraseña actual debe tener máximo 100 caracteres."),
    body("newPassword")
        .notEmpty().withMessage("La nueva contraseña es requerida.")
        .isLength({ min: 8, max: 100 }).withMessage("La nueva contraseña debe tener entre 8 y 100 caracteres.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-,:;¡!¿])[A-Za-z\d@$!%*?&.#_\-,:;¡!¿]{8,}$/)
        .withMessage("La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&.#_-,:;¡!¿).")
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error("La nueva contraseña debe ser diferente a la contraseña actual.");
            }
            return true;
        }),
    body("confirmPassword")
        .notEmpty().withMessage("Debe confirmar la nueva contraseña.")
        .isLength({ min: 8, max: 100 }).withMessage("La confirmación debe tener entre 8 y 100 caracteres.")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Las contraseñas no coinciden.");
            }
            return true;
        })
];