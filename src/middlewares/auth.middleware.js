import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuario from "../models/usuario.model.js";
import Rol from "../models/rol.model.js";
import Permiso from "../models/permiso.model.js";
import { successResponse, errorResponse } from "../utils/response.util.js";

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
 * Si se pasa al menos un rol o permiso, el usuario debe cumplir con alguno de ellos.
 * @param {Array<string>} rolesPermitidos - Nombres de roles permitidos.
 * @param {Array<string>} permisosRequeridos - Nombres de permisos permitidos.
 */
const verificarRolOPermiso = (rolesPermitidos = [], permisosRequeridos = []) => {
  return async (req, res, next) => {
    if (!req.usuario) {
      return errorResponse(res, "Usuario no autenticado", 401);
    }

    // Trae el usuario con su rol y permisos directos y por rol
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [
        {
          model: Rol,
          as: 'rol',
          attributes: ['nombre'],
          include: [
            {
              model: Permiso,
              as: 'permisos',
              attributes: ['nombre']
            }
          ]
        },
        {
          model: Permiso,
          as: 'permisos',
          attributes: ['nombre'],
          through: { attributes: [] }
        }
      ]
    });

    if (!usuario || !usuario.rol) {
      return errorResponse(res, "Rol no asignado o usuario no encontrado.", 403);
    }

    // SUPERADMINISTRADOR: acceso total
    if (usuario.rol.nombre === 'Administrador') {
      return next();
    }

    // ADMINISTRADOR: solo puede ver permisos, supervisores, usuarios, roles y dashboard
    if (usuario.rol.nombre === 'Administrador') {
      const permisosAdmin = [
        'gestionar_permisos',
        'gestionar_supervisores',
        'gestionar_usuarios',
        'gestionar_roles',
        'ver_dashboard'
      ];
      const permisosPorRol = usuario.rol.permisos ? usuario.rol.permisos.map(p => p.nombre) : [];
      const permisosDirectos = usuario.permisos ? usuario.permisos.map(p => p.nombre) : [];
      const permisosUsuario = Array.from(new Set([...permisosPorRol, ...permisosDirectos]));
      const tienePermisoAdmin = permisosAdmin.some(permiso => permisosUsuario.includes(permiso));
      if (!tienePermisoAdmin) {
        return errorResponse(res, "Acceso denegado. Solo puedes acceder a permisos, supervisores, usuarios, roles y dashboard.", 403);
      }
      return next();
    }

    // USUARIO: solo puede ver dashboard y cuenta
    if (usuario.rol.nombre === 'Usuario') {
      const permisosUsuarioPermitidos = [
        'ver_dashboard',
        'gestionar_cuenta'
      ];
      const permisosPorRol = usuario.rol.permisos ? usuario.rol.permisos.map(p => p.nombre) : [];
      const permisosDirectos = usuario.permisos ? usuario.permisos.map(p => p.nombre) : [];
      const permisosUsuario = Array.from(new Set([...permisosPorRol, ...permisosDirectos]));
      const tienePermisoUsuario = permisosUsuarioPermitidos.some(permiso => permisosUsuario.includes(permiso));
      if (!tienePermisoUsuario) {
        return errorResponse(res, "Acceso denegado. Solo puedes acceder a dashboard y cuenta.", 403);
      }
      return next();
    }

    // Otros roles: lógica estándar
    const tieneRol = rolesPermitidos.length === 0 || rolesPermitidos.includes(usuario.rol.nombre);
    const permisosPorRol = usuario.rol.permisos ? usuario.rol.permisos.map(p => p.nombre) : [];
    const permisosDirectos = usuario.permisos ? usuario.permisos.map(p => p.nombre) : [];
    const permisosUsuario = Array.from(new Set([...permisosPorRol, ...permisosDirectos]));
    const tienePermiso = permisosRequeridos.length === 0 || permisosRequeridos.some(permiso => permisosUsuario.includes(permiso));
    if (!tieneRol && !tienePermiso) {
      return errorResponse(res, "Acceso denegado. No tienes permisos suficientes", 403);
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