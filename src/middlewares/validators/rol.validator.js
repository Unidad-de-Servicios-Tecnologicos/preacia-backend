import { body } from "express-validator";
import Rol from "../../models/rol.model.js";

export const createRoleValidator = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre es requerido.")
        .isString().withMessage("El nombre debe ser un string.")
        .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres.")
        .custom(async (nombre) => {
            const exists = await Rol.findOne({ where: { nombre } });
            if (exists) {
                throw new Error("Ya existe un rol con ese nombre.");
            }
            return true;
        }),
    body("descripcion")
        .optional()
        .isString().withMessage("La descripción debe ser un string.")
        .isLength({ max: 500 }).withMessage("La descripción debe tener máximo 500 caracteres."),
    body("estado")
        .optional()
        .isBoolean().withMessage("El estado debe ser booleano (true o false)."),
    body("permisos")
        .isArray({ min: 1 })
        .withMessage("Debes asociar al menos un permiso.")
        .custom((permisos) => {
            return permisos.every(id => {
                const numId = parseInt(id, 10);
                return !isNaN(numId) && numId > 0;
            });
        })
        .withMessage("Todos los IDs de permisos deben ser enteros positivos.")
];

// Validador para updateRole (permite actualizar sin cambiar el nombre, pero si lo cambia, debe ser único)
export const updateRoleValidator = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre es requerido.")
        .isString().withMessage("El nombre debe ser un string.")
        .isLength({ min: 3, max: 50 }).withMessage("El nombre debe tener entre 3 y 50 caracteres.")
        .custom(async (nombre, { req }) => {
            const id = req.params.id;
            // Busca el rol actual
            const currentRol = await Rol.findByPk(id);
            if (!currentRol) {
                throw new Error("El rol a actualizar no existe.");
            }
            // Si el nombre es diferente al actual, verifica unicidad
            if (nombre !== currentRol.nombre) {
                const exists = await Rol.findOne({ where: { nombre } });
                if (exists) {
                    throw new Error("Ya existe un rol con ese nombre.");
                }
            }
            return true;
        }),
    body("descripcion")
        .optional()
        .isString().withMessage("La descripción debe ser un string.")
        .isLength({ max: 500 }).withMessage("La descripción debe tener máximo 500 caracteres."),
    body("estado")
        .optional()
        .isBoolean().withMessage("El estado debe ser booleano (true o false)."),
    body("permisos")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Debes asociar al menos un permiso.")
        .custom((permisos) => {
            return permisos.every(id => {
                const numId = parseInt(id, 10);
                return !isNaN(numId) && numId > 0;
            });
        })
        .withMessage("Todos los IDs de permisos deben ser enteros positivos.")
];