import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuario from "../models/usuario.model.js";
import Rol from "../models/rol.model.js";
import Permiso from "../models/permiso.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";
import { RolEnum } from "../enums/rol.enum.js";

dotenv.config();

/**
 * Middleware para verificar si la cuenta ya está verificada.
 * Asume que req.usuario está presente (por ejemplo, después de verificar el token).
 */
const verificarCuentaActiva = async (req, res, next) => {
  if (!req.usuario) {
    return errorResponse(res, "Usuario no autenticado", 401);
  }

  // Busca el usuario actualizado en la base de datos
  const usuario = await Usuario.findByPk(req.usuario.id);
  if (!usuario || !usuario.estado) {
    return errorResponse(res, "La cuenta no ha sido verificada. Por favor, verifica tu correo electrónico.", 403);
  }

  next();
};

/**
 * Middleware para verificar si el usuario tiene al menos uno de los roles o permisos requeridos.
 * Soporta usuarios con múltiples roles.
 * @param {Array<string>} rolesPermitidos - Nombres de roles permitidos (usando RolEnum).
 * @param {Array<string>} permisosRequeridos - Nombres de permisos permitidos (usando PermisoEnum).
 */
const verificarRolOPermiso = (rolesPermitidos = [], permisosRequeridos = []) => {
  return async (req, res, next) => {
    if (!req.usuario) {
      return errorResponse(res, "Usuario no autenticado", 401);
    }

    // Traer el usuario con TODOS sus roles y permisos
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [
        {
          model: Rol,
          as: 'roles', // Ahora es roles (plural) porque un usuario puede tener múltiples
          attributes: ['id', 'nombre'],
          through: { 
            attributes: [],
            where: { estado: true } // Solo roles activos
          },
          include: [
            {
              model: Permiso,
              as: 'permisos',
              attributes: ['nombre'],
              through: { attributes: [] }
            }
          ]
        },
        {
          model: Permiso,
          as: 'permisos', // Permisos directos del usuario
          attributes: ['nombre'],
          through: { attributes: [] }
        }
      ]
    });

    if (!usuario) {
      return errorResponse(res, "Usuario no encontrado.", 403);
    }

    if (!usuario.roles || usuario.roles.length === 0) {
      return errorResponse(res, "No tienes roles asignados.", 403);
    }

    // Obtener todos los nombres de roles del usuario
    const rolesUsuario = usuario.roles.map(r => r.nombre);

    // ADMIN: Acceso total a todo el sistema
    if (rolesUsuario.includes(RolEnum.ADMIN)) {
      return next();
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const tieneRolPermitido = rolesPermitidos.length === 0 || 
                              rolesPermitidos.some(rol => rolesUsuario.includes(rol));

    // Combinar todos los permisos (de todos los roles + permisos directos)
    const permisosMap = new Map();

    // Agregar permisos directos del usuario
    if (usuario.permisos) {
      usuario.permisos.forEach(permiso => {
        permisosMap.set(permiso.nombre, true);
      });
    }

    // Agregar permisos de todos los roles
    usuario.roles.forEach(rol => {
      if (rol.permisos) {
        rol.permisos.forEach(permiso => {
          permisosMap.set(permiso.nombre, true);
        });
      }
    });

    const permisosUsuario = Array.from(permisosMap.keys());

    // Verificar si el usuario tiene alguno de los permisos requeridos
    const tienePermisoRequerido = permisosRequeridos.length === 0 || 
                                  permisosRequeridos.some(permiso => permisosUsuario.includes(permiso));

    // El usuario debe tener al menos un rol permitido O un permiso requerido
    if (!tieneRolPermitido && !tienePermisoRequerido) {
      return errorResponse(res, "Acceso denegado. No tienes los permisos suficientes para realizar esta acción.", 403);
    }

    next();
  };
};

//verifica token
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return errorResponse(res, "No se proporcionó un token", 401);
  }

  // Soporta formato "Bearer <token>" o solo "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return errorResponse(res, "Token inválido", 403);
    }
    req.usuario = decoded;
    next();
  });
};

export { verificarCuentaActiva, verificarRolOPermiso, verificarToken };