import { header } from "express-validator";

export const refreshTokenValidator = [
    header("authorization")
        .notEmpty()
        .withMessage("El refresh token es requerido en la cabecera 'Authorization'.")
        .custom((value) => {
            if (!value.startsWith("Bearer ")) {
                throw new Error("Formato de cabecera Authorization inválido. Debe ser 'Bearer <token>'.");
            }
            const token = value.split(" ")[1];
            if (!token || token.trim() === "") {
                throw new Error("Refresh token no proporcionado en la cabecera Authorization.");
            }
            return true;
        })
];

