import { body, param } from "express-validator";
import { Op } from "sequelize";
import Usuario from "../../models/usuario.model.js";
import TipoDocumento from "../../models/tipoDocumento.model.js";
import Rol from "../../models/rol.model.js";

// Expresiones regulares
const onlyNumbers = /^[0-9]+$/;
const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

// Validador para parámetro ID
export const idParamValidator = [
    param('id')
        .isNumeric()
        .withMessage('El ID debe ser numérico.')
        .notEmpty()
        .withMessage('El ID es obligatorio.')
];

// Validador para cambiar estado
export const cambiarEstadoUsuarioValidator = [
    body('estado')
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).')
        .notEmpty()
        .withMessage('El estado es obligatorio.')
];

export const registerUserValidator = [
    body("rol_nombre")
        .optional()
        .trim()
        .custom(async (rol_nombre) => {
            if (rol_nombre) {
                const rol = await Rol.findOne({ where: { nombre: rol_nombre, estado: true } });
                if (!rol) {
                    throw new Error("El rol especificado no existe o está inactivo.");
                }
            }
            return true;
        }),
    body("tipo_documento")
        .trim()
        .notEmpty().withMessage("El tipo de documento es requerido.")
        .custom(async (tipoDocumentoNombre) => {
            if (tipoDocumentoNombre) {
                const tipoDocumento = await TipoDocumento.findOne({ where: { nombre: tipoDocumentoNombre, estado: true } });
                if (!tipoDocumento) {
                    throw new Error("El tipo documento especificado no existe o está inactivo.");
                }
            }
            return true;
        }),
    body("documento")
        .trim()
        .notEmpty().withMessage("El documento es requerido.")
        .isLength({ min: 5, max: 20 }).withMessage("El documento debe tener entre 5 y 20 caracteres.")
        .matches(onlyNumbers).withMessage("El documento solo debe contener números.")
        .custom(async (documento) => {
            const exists = await Usuario.findOne({ where: { documento } });
            if (exists) {
                throw new Error("Ya existe un usuario con ese documento.");
            }
            return true;
        }),
    body("nombres")
        .trim()
        .notEmpty().withMessage("El nombre es requerido.")
        .isLength({ max: 50 }).withMessage("El nombre debe tener máximo 50 caracteres.")
        .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
    body("apellidos")
        .trim()
        .notEmpty().withMessage("El apellido es requerido.")
        .isLength({ max: 50 }).withMessage("El apellido debe tener máximo 50 caracteres.")
        .matches(onlyLetters).withMessage("El apellido solo debe contener letras."),

    body("correo")
        .trim()
        .notEmpty().withMessage("El correo es requerido.")
        .isEmail().withMessage("El correo no es válido.")
        .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres.")
        .custom(async (correo) => {
            const exists = await Usuario.findOne({ where: { correo } });
            if (exists) {
                throw new Error("Ya existe un usuario con ese correo.");
            }
            return true;
        }),
    body("telefono")
        .optional()
        .trim()
        .isLength({ max: 15 }).withMessage("El teléfono debe tener máximo 15 caracteres.")
        .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
    body("direccion")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La direccion debe tener máximo 100 caracteres."),
    body("contrasena")
        .notEmpty().withMessage("La contraseña es requerida.")
        .isLength({ min: 8, max: 100 }).withMessage("La contraseña debe tener entre 8 y 100 caracteres.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
        .withMessage("La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."),
    body("confirmar_contrasena")
        .notEmpty().withMessage("Debe confirmar la contraseña.")
        .isLength({ min: 8, max: 100 }).withMessage("La confirmación debe tener entre 8 y 100 caracteres.")
        .custom((value, { req }) => {
            if (value !== req.body.contrasena) {
                throw new Error("Las contraseñas no coinciden.");
            }
            return true;
        }),

];

export const updateUserValidator = [
    body("rol_nombre")
        .optional()
        .trim()
        .custom(async (rol_nombre) => {
            if (rol_nombre) {
                const rol = await Rol.findOne({ where: { nombre: rol_nombre, estado: true } });
                if (!rol) {
                    throw new Error("El rol especificado no existe o está inactivo.");
                }
            }
            return true;
        }),
    body("documento")
        .optional()
        .trim()
        .isLength({ min: 5, max: 20 }).withMessage("El documento debe tener entre 5 y 20 caracteres.")
        .matches(onlyNumbers).withMessage("El documento solo debe contener números.")
        .custom(async (documento, { req }) => {
            if (documento) {
                const exists = await Usuario.findOne({
                    where: {
                        documento,
                        id: { [Op.ne]: req.params.id }
                    }
                });
                if (exists) {
                    throw new Error("Ya existe un usuario con ese documento.");
                }
            }
            return true;
        }),
    body("nombres")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("El nombre debe tener máximo 50 caracteres.")
        .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
    body("apellidos")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("El apellido debe tener máximo 50 caracteres.")
        .matches(onlyLetters).withMessage("El apellido solo debe contener letras."),
    body("correo")
        .optional()
        .trim()
        .isEmail().withMessage("El correo no es válido.")
        .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres.")
        .custom(async (correo, { req }) => {
            if (correo) {
                const exists = await Usuario.findOne({
                    where: {
                        correo,
                        id: { [Op.ne]: req.params.id }
                    }
                });
                if (exists) {
                    throw new Error("Ya existe un usuario con ese correo.");
                }
            }
            return true;
        }),
    body("telefono")
        .optional()
        .trim()
        .isLength({ max: 15 }).withMessage("El teléfono debe tener máximo 15 caracteres.")
        .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
    body("direcion")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La direccion debe tener máximo 100 caracteres."),
    body("direccion")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La direccion debe tener máximo 100 caracteres."),

];

export const createUserWithEmailValidator = [
    body("rol_nombre")
        .optional()
        .trim()
        .custom(async (rol_nombre) => {
            if (rol_nombre) {
                const rol = await Rol.findOne({ where: { nombre: rol_nombre, estado: true } });
                if (!rol) {
                    throw new Error("El rol especificado no existe o está inactivo.");
                }
            }
            return true;
        }),
    body("documento")
        .trim()
        .notEmpty().withMessage("El documento es requerido.")
        .isLength({ min: 5, max: 20 }).withMessage("El documento debe tener entre 5 y 20 caracteres.")
        .matches(onlyNumbers).withMessage("El documento solo debe contener números.")
        .custom(async (documento) => {
            const exists = await Usuario.findOne({ where: { documento } });
            if (exists) {
                throw new Error("Ya existe un usuario con ese documento.");
            }
            return true;
        }),
    body("nombres")
        .trim()
        .notEmpty().withMessage("El nombre es requerido.")
        .isLength({ max: 50 }).withMessage("El nombre debe tener máximo 50 caracteres.")
        .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
    body("apellidos")
        .trim()
        .notEmpty().withMessage("El apellido es requerido.")
        .isLength({ max: 50 }).withMessage("El apellido debe tener máximo 50 caracteres.")
        .matches(onlyLetters).withMessage("El apellido solo debe contener letras."),
    body("correo")
        .trim()
        .notEmpty().withMessage("El correo es requerido.")
        .isEmail().withMessage("El correo no es válido.")
        .isLength({ max: 100 }).withMessage("El correo debe tener máximo 100 caracteres.")
        .custom(async (correo) => {
            const exists = await Usuario.findOne({ where: { correo } });
            if (exists) {
                throw new Error("Ya existe un usuario con ese correo.");
            }
            return true;
        }),
    body("telefono")
        .optional()
        .trim()
        .isLength({ max: 15 }).withMessage("El teléfono debe tener máximo 15 caracteres.")
        .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
    body("direccion")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("La direccion debe tener máximo 100 caracteres."),
];