import Usuario from '../models/usuario.model.js';
import Rol from '../models/rol.model.js';
import Permiso from '../models/permiso.model.js';
import { Op } from 'sequelize';

/**
 * Crea un usuario en la base de datos.
 */
export const createUser = async (data, hashedPassword, roleId, estado = false) => {
    const {
        tipo_docuemento_id, 
        documento,
        nombres,
        apellidos,
        correo,
        telefono,
        direccion
    } = data;

    return await Usuario.create({
        rol_id: roleId,
        tipo_docuemento_id,
        documento,
        nombres,
        apellidos,
        correo,
        telefono,
        direccion,
        contrasena: hashedPassword,
        estado
    });
};

/**
 * Busca un usuario por correo y código de verificación.
 */
export const findUserByEmailAndCode = async (correo, codigo_verificacion) => {
    return await Usuario.findOne({
        where: { correo, codigo_verificacion }
    });
};

/**
 * Actualiza el estado de un usuario a activo.
 */
export const activateUserAccount = async (usuario) => {
    usuario.estado = true;
    await usuario.save();
    return usuario;
};

/**
 * Busca un usuario por nombre de usuario, documento o correo.
 * Incluye el rol y todos los permisos (directos del usuario + permisos del rol)
 */
export const findUserForLogin = async (login) => {
    return await Usuario.findOne({
        where: {
            [Op.or]: [
                { documento: login },
                { correo: login }
            ]
        },
        include: [
            {
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre'],
                include: [
                    {
                        model: Permiso,
                        as: 'permisos',
                        attributes: ['id', 'nombre', 'descripcion'],
                        through: { attributes: [] } // Excluir datos de la tabla intermedia
                    }
                ]
            },
            {
                model: Permiso,
                as: 'permisos',
                attributes: ['id', 'nombre', 'descripcion'],
                through: { attributes: [] } // Excluir datos de la tabla intermedia
            }
        ]
    });
};

/**
 * Guardar el token de restablecimiento y su expiración en la base de datos
 */
export const saveResetToken = async (usuario, resetToken) => {
    usuario.reset_token = resetToken;
    usuario.reset_token_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora desde ahora
    await usuario.save();
    return usuario;
};

/**
 * Buscar usuario por token de restablecimiento válido
 */
export const findUserByResetToken = async (resetToken) => {
    return await Usuario.findOne({
        where: {
            reset_token: resetToken,
            reset_token_expires: {
                [Op.gt]: new Date() // Token no expirado
            }
        }
    });
};

/**
 * Actualizar contraseña del usuario
 */
export const updateUserPassword = async (usuarioId, hashedPassword) => {
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) throw new Error("Usuario no encontrado");

    usuario.contrasena = hashedPassword;
    usuario.reset_token = null; // Limpiar el token después de usar
    usuario.reset_token_expires = null; // Limpiar la expiración
    await usuario.save();
    return usuario;
};

/**
 * Actualizar refresh token del usuario
 */
export const updateRefreshToken = async (id, refreshToken) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    usuario.refreshToken = refreshToken;
    await usuario.save();
    return usuario;
};