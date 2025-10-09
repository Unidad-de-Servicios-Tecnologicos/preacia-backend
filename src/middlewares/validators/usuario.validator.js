import { body, param, validationResult } from "express-validator";
import { Op } from "sequelize";
import Usuario from "../../models/usuario.model.js";
import TipoDocumento from "../../models/tipoDocumento.model.js";
import Rol from "../../models/rol.model.js";
import { RolEnum } from "../../enums/rol.enum.js";
import { errorResponse } from "../../utils/response.util.js";

// Expresiones regulares
const onlyNumbers = /^[0-9]+$/;
const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

// Middleware para validar los resultados
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            type: "field",
            value: err.value,
            msg: err.msg,
            path: err.path || err.param,
            location: err.location
        }));

        return errorResponse(
            res,
            "Errores de validación",
            422,
            formattedErrors
        );
    }
    next();
};

// Validador para parámetro ID
export const idParamValidator = [
    param('id')
        .isNumeric()
        .withMessage('El ID debe ser numérico.')
        .notEmpty()
        .withMessage('El ID es obligatorio.'),
    validateResults
];

// Validador para cambiar estado
export const cambiarEstadoUsuarioValidator = [
    body('estado')
        .isBoolean()
        .withMessage('El estado debe ser un valor booleano (true o false).')
        .notEmpty()
        .withMessage('El estado es obligatorio.'),
    validateResults
];

export const registerUserValidator = [
    // Validar rol_ids (obligatorio, debe ser array de IDs)
    body("rol_ids")
        .notEmpty().withMessage("El campo rol_ids es requerido.")
        .isArray({ min: 1 }).withMessage("rol_ids debe ser un array con al menos un rol.")
        .custom(async (rol_ids) => {
            // Validar que todos sean números enteros válidos
            const sonNumeros = rol_ids.every(id => Number.isInteger(Number(id)) && Number(id) > 0);
            if (!sonNumeros) {
                throw new Error("Todos los rol_ids deben ser números enteros válidos.");
            }
            
            // Convertir a números
            const rolIdsNumeros = rol_ids.map(id => Number(id));
            
            // Verificar que todos los roles existan y estén activos
            const roles = await Rol.findAll({ 
                where: { 
                    id: rolIdsNumeros, 
                    estado: true 
                } 
            });
            
            if (roles.length !== rolIdsNumeros.length) {
                const rolesEncontrados = roles.map(r => r.id);
                const rolesFaltantes = rolIdsNumeros.filter(id => !rolesEncontrados.includes(id));
                throw new Error(`Los siguientes roles no existen o están inactivos: ${rolesFaltantes.join(', ')}`);
            }
            
            return true;
        }),
    
    // Validar tipo_documento_id (obligatorio)
    body("tipo_documento_id")
        .notEmpty().withMessage("El tipo_documento_id es requerido.")
        .isInt({ min: 1 }).withMessage("El tipo_documento_id debe ser un número entero válido.")
        .custom(async (tipo_documento_id) => {
            const tipoDocumento = await TipoDocumento.findOne({ 
                where: { 
                    id: tipo_documento_id, 
                    estado: true 
                } 
            });
            if (!tipoDocumento) {
                throw new Error(`El tipo de documento con ID ${tipo_documento_id} no existe o está inactivo.`);
            }
            return true;
        }),
    
    // Validar centro_ids (OBLIGATORIO para Revisor y Administrador de Centro)
    body("centro_ids")
        .custom(async (centro_ids, { req }) => {
            const rol_ids = req.body.rol_ids;
            
            // Si no hay rol_ids, dejar que la otra validación lo maneje
            if (!rol_ids || !Array.isArray(rol_ids)) {
                return true;
            }
            
            // Convertir rol_ids a números
            const rolIdsNumeros = rol_ids.map(id => Number(id));
            
            // Consultar los roles para verificar si requieren centros
            const roles = await Rol.findAll({
                where: {
                    id: rolIdsNumeros,
                    estado: true
                }
            });
            
            const rolesQueRequierenCentro = [RolEnum.REVISOR, RolEnum.ADMINISTRADOR_CENTRO];
            const requiereCentro = roles.some(rol => rolesQueRequierenCentro.includes(rol.nombre));
            
            // Si tiene roles que requieren centro, centro_ids es OBLIGATORIO
            if (requiereCentro) {
                if (!centro_ids || !Array.isArray(centro_ids) || centro_ids.length === 0) {
                    throw new Error(`Los roles ${RolEnum.REVISOR} y ${RolEnum.ADMINISTRADOR_CENTRO} requieren al menos un centro asignado en centro_ids.`);
                }
                
                // Validar que todos sean números enteros válidos
                const sonNumeros = centro_ids.every(id => Number.isInteger(Number(id)) && Number(id) > 0);
                if (!sonNumeros) {
                    throw new Error("Todos los centro_ids deben ser números enteros válidos.");
                }
                
                // Convertir a números
                const centroIdsNumeros = centro_ids.map(id => Number(id));
                
                // Importar modelo Centro
                const { default: Centro } = await import('../../models/centro.model.js');
                
                // Verificar que todos los centros existan y estén activos
                const centros = await Centro.findAll({
                    where: {
                        id: centroIdsNumeros,
                        estado: true
                    }
                });
                
                if (centros.length !== centroIdsNumeros.length) {
                    const centrosEncontrados = centros.map(c => c.id);
                    const centrosFaltantes = centroIdsNumeros.filter(id => !centrosEncontrados.includes(id));
                    throw new Error(`Los siguientes centros no existen o están inactivos: ${centrosFaltantes.join(', ')}`);
                }
            } else if (centro_ids && Array.isArray(centro_ids) && centro_ids.length > 0) {
                // Si NO requiere centro pero enviaron centro_ids, validar que existan
                const sonNumeros = centro_ids.every(id => Number.isInteger(Number(id)) && Number(id) > 0);
                if (!sonNumeros) {
                    throw new Error("Todos los centro_ids deben ser números enteros válidos.");
                }
                
                // Convertir a números
                const centroIdsNumeros = centro_ids.map(id => Number(id));
                
                const { default: Centro } = await import('../../models/centro.model.js');
                const centros = await Centro.findAll({
                    where: {
                        id: centroIdsNumeros,
                        estado: true
                    }
                });
                
                if (centros.length !== centroIdsNumeros.length) {
                    throw new Error("Uno o más centros especificados no existen o están inactivos.");
                }
            }
            
            return true;
        }),
    
    // Validar regional_id (OBLIGATORIO para Director Regional)
    body("regional_id")
        .custom(async (regional_id, { req }) => {
            const rol_ids = req.body.rol_ids;
            
            // Si no hay rol_ids, dejar que la otra validación lo maneje
            if (!rol_ids || !Array.isArray(rol_ids)) {
                return true;
            }
            
            // Convertir rol_ids a números
            const rolIdsNumeros = rol_ids.map(id => Number(id));
            
            // Consultar los roles para verificar si alguno es Director Regional
            const roles = await Rol.findAll({
                where: {
                    id: rolIdsNumeros,
                    estado: true
                }
            });
            
            const esDirectorRegional = roles.some(rol => rol.nombre === RolEnum.DIRECTOR_REGIONAL);
            
            // Si es Director Regional, regional_id es OBLIGATORIO
            if (esDirectorRegional) {
                if (!regional_id) {
                    throw new Error(`El rol ${RolEnum.DIRECTOR_REGIONAL} requiere que se especifique una regional_id.`);
                }
                
                // Convertir a número y validar
                const regionalIdNumero = Number(regional_id);
                if (!Number.isInteger(regionalIdNumero) || regionalIdNumero < 1) {
                    throw new Error("El regional_id debe ser un número entero válido mayor a 0.");
                }
                
                // Verificar que la regional exista
                const { default: Regional } = await import('../../models/regional.model.js');
                const regional = await Regional.findOne({
                    where: {
                        id: regionalIdNumero,
                        estado: true
                    }
                });
                
                if (!regional) {
                    throw new Error(`La regional con ID ${regionalIdNumero} no existe o está inactiva.`);
                }
            } else if (regional_id) {
                // Si NO es Director Regional pero enviaron regional_id, validar que exista
                const regionalIdNumero = Number(regional_id);
                if (!Number.isInteger(regionalIdNumero) || regionalIdNumero < 1) {
                    throw new Error("El regional_id debe ser un número entero válido mayor a 0.");
                }
                
                const { default: Regional } = await import('../../models/regional.model.js');
                const regional = await Regional.findOne({
                    where: {
                        id: regionalIdNumero,
                        estado: true
                    }
                });
                
                if (!regional) {
                    throw new Error(`La regional con ID ${regionalIdNumero} no existe o está inactiva.`);
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
        .isLength({ max: 20 }).withMessage("El teléfono debe tener máximo 20 caracteres.")
        .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
    body("direccion")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("La direccion debe tener máximo 200 caracteres."),
    body("contrasena")
        .optional()
        .trim()
        .isLength({ min: 8, max: 100 }).withMessage("La contraseña debe tener entre 8 y 100 caracteres."),
    validateResults
];

// NOTA: La contraseña es opcional, si no se proporciona se genera automáticamente

export const updateUserValidator = [
    // Validar rol_ids (opcional en actualización)
    body("rol_ids")
        .optional()
        .isArray({ min: 1 }).withMessage("rol_ids debe ser un array con al menos un rol.")
        .custom(async (rol_ids) => {
            if (rol_ids) {
                // Validar que todos sean números enteros válidos
                const sonNumeros = rol_ids.every(id => Number.isInteger(Number(id)) && Number(id) > 0);
                if (!sonNumeros) {
                    throw new Error("Todos los rol_ids deben ser números enteros válidos.");
                }
                
                // Convertir a números
                const rolIdsNumeros = rol_ids.map(id => Number(id));
                
                // Verificar que todos los roles existan y estén activos
                const roles = await Rol.findAll({ 
                    where: { 
                        id: rolIdsNumeros, 
                        estado: true 
                    } 
                });
                
                if (roles.length !== rolIdsNumeros.length) {
                    const rolesEncontrados = roles.map(r => r.id);
                    const rolesFaltantes = rolIdsNumeros.filter(id => !rolesEncontrados.includes(id));
                    throw new Error(`Los siguientes roles no existen o están inactivos: ${rolesFaltantes.join(', ')}`);
                }
            }
            return true;
        }),
    
    // Validar tipo_documento_id (opcional en actualización)
    body("tipo_documento_id")
        .optional()
        .isInt({ min: 1 }).withMessage("El tipo_documento_id debe ser un número entero válido.")
        .custom(async (tipo_documento_id) => {
            if (tipo_documento_id) {
                const tipoDocumento = await TipoDocumento.findOne({ 
                    where: { 
                        id: tipo_documento_id, 
                        estado: true 
                    } 
                });
                if (!tipoDocumento) {
                    throw new Error(`El tipo de documento con ID ${tipo_documento_id} no existe o está inactivo.`);
                }
            }
            return true;
        }),
    
    // Validar centro_ids (opcional en actualización)
    body("centro_ids")
        .optional()
        .isArray().withMessage("centro_ids debe ser un array.")
        .custom(async (centro_ids) => {
            if (centro_ids && centro_ids.length > 0) {
                const sonNumeros = centro_ids.every(id => Number.isInteger(Number(id)) && Number(id) > 0);
                if (!sonNumeros) {
                    throw new Error("Todos los centro_ids deben ser números enteros válidos.");
                }
                
                const centroIdsNumeros = centro_ids.map(id => Number(id));
                const { default: Centro } = await import('../../models/centro.model.js');
                const centros = await Centro.findAll({
                    where: {
                        id: centroIdsNumeros,
                        estado: true
                    }
                });
                
                if (centros.length !== centroIdsNumeros.length) {
                    throw new Error("Uno o más centros especificados no existen o están inactivos.");
                }
            }
            return true;
        }),
    
    // Validar regional_id (opcional en actualización)
    body("regional_id")
        .optional()
        .custom(async (regional_id) => {
            if (regional_id) {
                const regionalIdNumero = Number(regional_id);
                if (!Number.isInteger(regionalIdNumero) || regionalIdNumero < 1) {
                    throw new Error("El regional_id debe ser un número entero válido mayor a 0.");
                }
                
                const { default: Regional } = await import('../../models/regional.model.js');
                const regional = await Regional.findOne({
                    where: {
                        id: regionalIdNumero,
                        estado: true
                    }
                });
                
                if (!regional) {
                    throw new Error(`La regional con ID ${regionalIdNumero} no existe o está inactiva.`);
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
        .isLength({ max: 150 }).withMessage("El nombre debe tener máximo 150 caracteres.")
        .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
    body("apellidos")
        .optional()
        .trim()
        .isLength({ max: 150 }).withMessage("El apellido debe tener máximo 150 caracteres.")
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
        .isLength({ max: 20 }).withMessage("El teléfono debe tener máximo 20 caracteres.")
        .matches(onlyNumbers).withMessage("El teléfono solo debe contener números."),
    body("direccion")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("La direccion debe tener máximo 200 caracteres."),
    validateResults
];