import {
    createUser,
    findUserForLogin,
    saveResetToken,
    updateUserPassword,
    updateRefreshToken
} from '../../repositories/auth.repository.js';
import { findUserByEmail } from '../../repositories/usuario.repository.js';
import { encriptPassword } from '../../utils/global.util.js';
import { getRoleByNameRepository } from '../../repositories/rol.repository.js';
import { findTipoDocumentoByNombreRepository } from '../../repositories/tipoDocumento.repository.js';
import { RolEnum } from '../../enums/rol.enum.js';
import jwt from "jsonwebtoken";
import Usuario from '../../models/usuario.model.js';
import { sendResetPassword, sendPasswordCredentialsEmail } from '../../mails/templates/base.mail.js';
import { hashPassword } from '../../utils/global.util.js';
import bcrypt from "bcrypt";
import { findUsuarioById } from "../../repositories/usuario.repository.js";
import { generateAccessToken } from '../../utils/global.util.js';
import { generateSecurePassword } from '../../utils/random.util.js';

export const registerUserService = async (data) => {
    const { rol_ids, tipo_documento_id, regional_id, centro_ids } = data;

    // Validación: tipo_documento_id es obligatorio y ya fue validado por el validator
    // Validación: rol_ids es obligatorio y ya fue validado por el validator
    // Validación: centro_ids y regional_id ya fueron validados según los roles
    
    // NOTA: Las validaciones de negocio ya se hicieron en el validator usando RolEnum
    // Aquí solo ejecutamos la lógica de creación

    // Generar una contraseña segura automáticamente
    const generatedPassword = generateSecurePassword(12);
    const hashedPassword = await encriptPassword(generatedPassword, 10);

    // Preparar los datos del usuario
    const userData = {
        ...data,
        tipo_documento_id,
        regional_id: regional_id || null,
        password_debe_cambiar: true // El usuario debe cambiar la contraseña en el primer login
    };

    // Crea el usuario con TODOS los roles asignados (estado activo desde el inicio)
    const usuario = await createUser(userData, hashedPassword, rol_ids, true);

    // Si se proporcionaron centros, asociar el usuario con los centros
    if (centro_ids && Array.isArray(centro_ids) && centro_ids.length > 0) {
        for (const centroId of centro_ids) {
            await usuario.addCentro(centroId, {
                through: { estado: true }
            });
        }
    }

    // Enviar correo con las credenciales
    try {
        await sendPasswordCredentialsEmail({
            nombres: usuario.nombres,
            correo: usuario.correo
        }, generatedPassword);
    } catch (emailError) {
        console.error('Error al enviar correo de credenciales:', emailError);
        // No lanzamos error aquí, el usuario fue creado exitosamente
        // Solo registramos el error del correo
    }

    // Obtener usuario con roles cargados
    const usuarioCreado = await findUsuarioById(usuario.id);

    return {
        message: 'Usuario registrado correctamente. Se ha enviado un correo electrónico con las credenciales de acceso. Ya puedes iniciar sesión en el sistema.',
        usuario: {
            id: usuarioCreado.id,
            documento: usuarioCreado.documento,
            nombres: usuarioCreado.nombres,
            apellidos: usuarioCreado.apellidos,
            correo: usuarioCreado.correo,
            telefono: usuarioCreado.telefono,
            direccion: usuarioCreado.direccion,
            estado: usuarioCreado.estado,
            password_debe_cambiar: usuarioCreado.password_debe_cambiar,
            roles: usuarioCreado.roles ? usuarioCreado.roles.map(r => ({
                id: r.id,
                nombre: r.nombre
            })) : [],
            centros: usuarioCreado.centros ? usuarioCreado.centros.map(c => ({
                id: c.id,
                codigo: c.codigo,
                nombre: c.nombre
            })) : []
        }
    };
};

/**
 * Lógica para iniciar sesión.
 */
export const loginUserService = async ({ login, contrasena }) => {
    const user = await findUserForLogin(login);

    if (!user) {
        return { success: false, message: 'Usuario, numero de documento o correo no encontrado.', status: 404 };
    }

    if (!user.estado) {
        return { success: false, message: 'La cuenta está inactiva.', status: 403 };
    }

    // Verificar si el usuario está bloqueado
    if (user.bloqueado_hasta && new Date() < new Date(user.bloqueado_hasta)) {
        const minutosRestantes = Math.ceil((new Date(user.bloqueado_hasta) - new Date()) / 60000);
        return { 
            success: false, 
            message: `Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente nuevamente en ${minutosRestantes} minutos.`, 
            status: 403 
        };
    }

    const isMatch = await Usuario.comparePassword(contrasena, user.contrasena);
    if (!isMatch) {
        // Incrementar intentos fallidos
        const nuevosIntentos = (user.intentos_fallidos || 0) + 1;
        const MAX_INTENTOS = 5;
        const TIEMPO_BLOQUEO_MINUTOS = 30;

        if (nuevosIntentos >= MAX_INTENTOS) {
            // Bloquear usuario
            const bloqueadoHasta = new Date(Date.now() + TIEMPO_BLOQUEO_MINUTOS * 60000);
            await user.update({
                intentos_fallidos: nuevosIntentos,
                bloqueado_hasta: bloqueadoHasta
            });

            return { 
                success: false, 
                message: `Demasiados intentos fallidos. Cuenta bloqueada por ${TIEMPO_BLOQUEO_MINUTOS} minutos.`, 
                status: 403 
            };
        } else {
            // Incrementar contador
            await user.update({
                intentos_fallidos: nuevosIntentos
            });

            const intentosRestantes = MAX_INTENTOS - nuevosIntentos;
            return { 
                success: false, 
                message: `Contraseña incorrecta. Le quedan ${intentosRestantes} intento(s) antes de que su cuenta sea bloqueada.`, 
                status: 401 
            };
        }
    }

    // Obtener nombres de todos los roles
    const roles_nombres = user.roles ? user.roles.map(r => r.nombre) : [];
    const tipo_documento_nombre = user.tipo_documento ? user.tipo_documento.nombre : null;

    // Combinar permisos del usuario y de todos los roles
    const permisosMap = new Map();

    // Agregar permisos directos del usuario
    if (user.permisos) {
        user.permisos.forEach(permiso => {
            permisosMap.set(permiso.id, {
                id: permiso.id,
                nombre: permiso.nombre,
                descripcion: permiso.descripcion
            });
        });
    }

    // Agregar permisos de todos los roles
    if (user.roles) {
        user.roles.forEach(rol => {
            if (rol.permisos) {
                rol.permisos.forEach(permiso => {
                    permisosMap.set(permiso.id, {
                        id: permiso.id,
                        nombre: permiso.nombre,
                        descripcion: permiso.descripcion
                    });
                });
            }
        });
    }

    // Convertir el mapa a array
    const permisosCombinados = Array.from(permisosMap.values());

    // Resetear intentos fallidos y actualizar último acceso
    await user.update({
        intentos_fallidos: 0,
        bloqueado_hasta: null,
        ultimo_acceso: new Date()
    });

    // Genera el accessToken usando la función utilitaria
    const accessToken = generateAccessToken({
        id: user.id,
        correo: user.correo,
        roles: roles_nombres, // Array de nombres de roles
        estado: user.estado
    });

    return {
        success: true,
        password_debe_cambiar: user.password_debe_cambiar || false,
        usuario: {
            id: user.id,
            documento: user.documento,
            nombres: user.nombres,
            apellidos: user.apellidos,
            correo: user.correo,
            telefono: user.telefono,
            direccion: user.direccion,
            estado: user.estado,
            password_debe_cambiar: user.password_debe_cambiar || false,
            tipo_documento: user.tipo_documento ? {
                id: user.tipo_documento.id,
                codigo: user.tipo_documento.codigo,
                nombre: user.tipo_documento.nombre
            } : null,
            regional: user.regional ? {
                id: user.regional.id,
                codigo: user.regional.codigo,
                nombre: user.regional.nombre
            } : null,
            roles: user.roles ? user.roles.map(r => ({
                id: r.id,
                nombre: r.nombre,
                descripcion: r.descripcion
            })) : [],
            centros: user.centros ? user.centros.map(c => ({
                id: c.id,
                codigo: c.codigo,
                nombre: c.nombre
            })) : [],
            permisos: permisosCombinados
        },
        token: accessToken,
        message: 'Inicio de sesión exitoso.',
        status: 200
    };
};

export const forgotPasswordService = async ({ correo }) => {
    try {
        const usuario = await findUserByEmail(correo, ['id', 'correo', 'nombre', 'estado', 'rol_id']);

        if (!usuario) {
            return { success: false, message: 'Correo inválido.', status: 404 };
        }

        if (usuario.estado === false) {
            return { success: false, message: 'La cuenta está inactiva.', status: 403 };
        }

        const resetToken = generateAccessToken({
            id: usuario.id,
            correo: usuario.correo,
            roles: usuario.roles ? usuario.roles.map(r => r.nombre) : [],
            estado: usuario.estado
        });

        await saveResetToken(usuario, resetToken);

        const resetLink = `${process.env.FRONTEND_URL}/restablecer-contraseña?token=${resetToken}&correo=${encodeURIComponent(usuario.correo)}`;
        await sendResetPassword(usuario, resetLink);

        return {
            success: true,
            message: 'Se ha enviado un enlace de restablecimiento de contraseña a su correo.',
            resetToken,
            status: 200
        };
    } catch (error) {
        console.error('Error en forgotPasswordService:', error);
        return {
            success: false,
            message: 'Error interno del servidor al procesar la solicitud.',
            status: 500
        };
    }
};

export const resetPasswordService = async ({ correo, token, nueva_contrasena }) => {

    try {
        // 1. Verifica el token y extrae el correo original
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        // 2. Compara el correo del body con el del token
        if (correo !== payload.correo) {
            return { success: false, message: "El correo no coincide con el del enlace de recuperación.", status: 401 };
        }

        // 3. Busca el usuario por el correo del token (que ya validaste)
        const usuario = await findUserByEmail(payload.correo);
        if (!usuario) {
            return { success: false, message: "Usuario no encontrado.", status: 404 };
        }

        // 4. Valida que la nueva contraseña sea diferente a la anterior
        const isSamePassword = await bcrypt.compare(nueva_contrasena, usuario.contrasena);
        if (isSamePassword) {
            return { success: false, message: "La nueva contraseña debe ser diferente a la anterior.", status: 400 };
        }

        // 5. Cambia la contraseña solo si todo coincide
        const hashedPassword = await hashPassword(nueva_contrasena);
        
        // Actualizar contraseña y campos relacionados
        await Usuario.update(
            {
                contrasena: hashedPassword,
                ultimo_cambio_password: new Date(),
                password_debe_cambiar: false,
                reset_token: null,
                reset_token_expires: null,
                intentos_fallidos: 0,
                bloqueado_hasta: null
            },
            {
                where: { id: usuario.id }
            }
        );

        return { success: true, message: "Contraseña actualizada correctamente.", status: 200 };
    } catch (error) {
        return { success: false, message: "Token inválido o expirado.", status: 401 };
    }
};

export const refreshTokenService = async (refreshToken) => {
    if (!refreshToken) {
        return { success: false, message: "Refresh token no proporcionado.", status: 401 };
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);

        if (!decoded || !decoded.id || !decoded.correo) {
            return { success: false, message: "Refresh token inválido.", status: 401 };
        }

        // Busca el usuario por ID
        const usuario = await findUsuarioById(decoded.id);
        if (!usuario) {
            return { success: false, message: "Usuario no encontrado.", status: 404 };
        }

        // Genera un nuevo accessToken usando la función utilitaria
        const accessToken = generateAccessToken({
            id: usuario.id,
            correo: usuario.correo,
            roles: usuario.roles ? usuario.roles.map(r => r.nombre) : [],
            estado: usuario.estado
        });

        // Opcional: Actualiza el refreshToken si lo necesitas
        await updateRefreshToken(decoded.id, refreshToken);

        return { success: true, accessToken };
    } catch (error) {
        return { success: false, message: "Refresh token inválido o expirado.", status: 401 };
    }
};

export const createUserWithEmailSetupService = async (data) => {
    const { rol_nombre, correo, documento, tipo_documento } = data;

    let rolUsuario;

    // Si se especifica un rol, buscarlo por nombre
    if (rol_nombre && rol_nombre.trim() !== '') {
        rolUsuario = await getRoleByNameRepository(rol_nombre.trim());
        if (!rolUsuario) {
            const error = new Error(`No se encontró el rol "${rol_nombre}".`);
            error.status = 400;
            throw error;
        }
    } else {
        // Si no se especifica rol, usar el rol por defecto
        rolUsuario = await getRoleByNameRepository(RolEnum.REVISOR);
        if (!rolUsuario) {
            const error = new Error('No se encontró el rol por defecto para usuarios.');
            error.status = 500;
            throw error;
        }
    }

    // Buscar el tipo de documento por nombre y obtener su ID
    let tipoDocumentoId = null;
    if (tipo_documento && tipo_documento.trim() !== '') {
        const tipoDocumento = await findTipoDocumentoByNombreRepository(tipo_documento.trim());
        if (!tipoDocumento) {
            const error = new Error(`No se encontró el tipo de documento "${tipo_documento}".`);
            error.status = 400;
            throw error;
        }
        tipoDocumentoId = tipoDocumento.id;
    } else {
        const error = new Error('El tipo de documento es requerido.');
        error.status = 400;
        throw error;
    }

    // Genera una contraseña basada en correo + documento + carácter especial
    const emailPrefix = correo.split('@')[0].substring(0, 4); // Primeros 4 caracteres del correo
    const docSuffix = documento.toString().slice(-4); // Últimos 4 dígitos del documento
    const defaultPassword = `${emailPrefix}${docSuffix}@1`; // Formato: email+doc+@1

    const hashedPassword = await encriptPassword(defaultPassword, 10);

    // Preparar los datos del usuario con el tipo_documento_id
    const userData = {
        ...data,
        tipo_documento_id: tipoDocumentoId
    };

    // Crea el usuario con la contraseña ya establecida
    const usuario = await createUser(userData, hashedPassword, [rolUsuario.id]);

    // Envía el correo con la contraseña generada
    await sendPasswordCredentialsEmail(usuario, defaultPassword);

    return {
        message: 'Usuario creado correctamente. Se ha enviado un correo electrónico con las credenciales de acceso.',
        usuario: {
            id: usuario.id,
            tipo_documento: tipo_documento,
            documento: usuario.documento,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            rol: rolUsuario.nombre,
            estado: usuario.estado
        }
    };
};

/**
 * Servicio para cambiar la contraseña de un usuario autenticado
 */
export const changePasswordService = async (userId, currentPassword, newPassword) => {
    try {
        // Buscar el usuario por ID
        const user = await findUsuarioById(userId);
        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.code = "USER_NOT_FOUND";
            throw error;
        }

        // Verificar que la contraseña actual sea correcta
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.contrasena);
        if (!isCurrentPasswordValid) {
            const error = new Error("La contraseña actual es incorrecta");
            error.code = "INVALID_CURRENT_PASSWORD";
            throw error;
        }

        // Encriptar la nueva contraseña
        const hashedNewPassword = await hashPassword(newPassword);

        // Actualizar la contraseña y campos relacionados en la base de datos
        await Usuario.update(
            {
                contrasena: hashedNewPassword,
                ultimo_cambio_password: new Date(),
                password_debe_cambiar: false,
                reset_token: null,
                reset_token_expires: null
            },
            {
                where: { id: userId }
            }
        );

        return {
            success: true,
            message: "Contraseña actualizada exitosamente"
        };
    } catch (error) {
        console.error("Error en changePasswordService:", error);
        throw error;
    }
};
