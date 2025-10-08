import { body, param } from "express-validator";
import { Op } from "sequelize";
import Usuario from "../../models/usuario.model.js";
import TipoDocumento from "../../models/tipoDocumento.model.js";
import Rol from "../../models/rol.model.js";
import { RolEnum } from "../../enums/rol.enum.js";

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
    // Validar rol_ids (obligatorio, debe ser array de IDs)
    body("rol_ids")
        .notEmpty().withMessage("El campo rol_ids es requerido.")
        .isArray({ min: 1 }).withMessage("rol_ids debe ser un array con al menos un rol.")
        .custom(async (rol_ids) => {
            // Validar que todos sean números enteros válidos
            const sonNumeros = rol_ids.every(id => Number.isInteger(id) && id > 0);
            if (!sonNumeros) {
                throw new Error("Todos los rol_ids deben ser números enteros válidos.");
            }
            
            // Verificar que todos los roles existan y estén activos
            const roles = await Rol.findAll({ 
                where: { 
                    id: rol_ids, 
                    estado: true 
                } 
            });
            
            if (roles.length !== rol_ids.length) {
                const rolesEncontrados = roles.map(r => r.id);
                const rolesFaltantes = rol_ids.filter(id => !rolesEncontrados.includes(id));
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
            
            // Consultar los roles para verificar si requieren centros
            const roles = await Rol.findAll({
                where: {
                    id: rol_ids,
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
                const sonNumeros = centro_ids.every(id => Number.isInteger(id) && id > 0);
                if (!sonNumeros) {
                    throw new Error("Todos los centro_ids deben ser números enteros válidos.");
                }
                
                // Importar modelo Centro
                const { default: Centro } = await import('../../models/centro.model.js');
                
                // Verificar que todos los centros existan y estén activos
                const centros = await Centro.findAll({
                    where: {
                        id: centro_ids,
                        estado: true
                    }
                });
                
                if (centros.length !== centro_ids.length) {
                    const centrosEncontrados = centros.map(c => c.id);
                    const centrosFaltantes = centro_ids.filter(id => !centrosEncontrados.includes(id));
                    throw new Error(`Los siguientes centros no existen o están inactivos: ${centrosFaltantes.join(', ')}`);
                }
            } else if (centro_ids && Array.isArray(centro_ids) && centro_ids.length > 0) {
                // Si NO requiere centro pero enviaron centro_ids, validar que existan
                const sonNumeros = centro_ids.every(id => Number.isInteger(id) && id > 0);
                if (!sonNumeros) {
                    throw new Error("Todos los centro_ids deben ser números enteros válidos.");
                }
                
                const { default: Centro } = await import('../../models/centro.model.js');
                const centros = await Centro.findAll({
                    where: {
                        id: centro_ids,
                        estado: true
                    }
                });
                
                if (centros.length !== centro_ids.length) {
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
            
            // Consultar los roles para verificar si alguno es Director Regional
            const roles = await Rol.findAll({
                where: {
                    id: rol_ids,
                    estado: true
                }
            });
            
            const esDirectorRegional = roles.some(rol => rol.nombre === RolEnum.DIRECTOR_REGIONAL);
            
            // Si es Director Regional, regional_id es OBLIGATORIO
            if (esDirectorRegional) {
                if (!regional_id) {
                    throw new Error(`El rol ${RolEnum.DIRECTOR_REGIONAL} requiere que se especifique una regional_id.`);
                }
                
                // Validar que sea un número entero válido
                if (!Number.isInteger(regional_id) || regional_id < 1) {
                    throw new Error("El regional_id debe ser un número entero válido mayor a 0.");
                }
                
                // Verificar que la regional exista
                const { default: Regional } = await import('../../models/regional.model.js');
                const regional = await Regional.findOne({
                    where: {
                        id: regional_id,
                        estado: true
                    }
                });
                
                if (!regional) {
                    throw new Error(`La regional con ID ${regional_id} no existe o está inactiva.`);
                }
            } else if (regional_id) {
                // Si NO es Director Regional pero enviaron regional_id, validar que exista
                if (!Number.isInteger(regional_id) || regional_id < 1) {
                    throw new Error("El regional_id debe ser un número entero válido mayor a 0.");
                }
                
                const { default: Regional } = await import('../../models/regional.model.js');
                const regional = await Regional.findOne({
                    where: {
                        id: regional_id,
                        estado: true
                    }
                });
                
                if (!regional) {
                    throw new Error(`La regional con ID ${regional_id} no existe o está inactiva.`);
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
        .isLength({ max: 200 }).withMessage("La direccion debe tener máximo 200 caracteres.")
];

// NOTA: No se valida contraseña porque se genera automáticamente en el backend

export const updateUserValidator = [
    // Los roles se actualizan con un endpoint separado, no en update general
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
    // Este validador usa la misma lógica que registerUserValidator
    // ya que ambos crean usuarios con generación automática de contraseña
    ...registerUserValidator.filter(validation => {
        // Excluir validaciones de documento y correo ya que se validarán de nuevo
        const fieldName = validation.builder?.fields[0];
        return fieldName !== 'documento' && fieldName !== 'correo';
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
        .isLength({ max: 150 }).withMessage("El nombre debe tener máximo 150 caracteres.")
        .matches(onlyLetters).withMessage("El nombre solo debe contener letras."),
    body("apellidos")
        .optional()
        .trim()
        .isLength({ max: 150 }).withMessage("El apellido debe tener máximo 150 caracteres.")
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
    body("regional_id")
        .optional()
        .isNumeric().withMessage("El ID de la regional debe ser numérico."),
];