import { errorResponse } from "../utils/response.util.js";
import { RolEnum } from "../enums/rol.enum.js";
import Usuario from "../models/usuario.model.js";
import Centro from "../models/centro.model.js";
import Regional from "../models/regional.model.js";
import Rol from "../models/rol.model.js";
import { Op } from "sequelize";

/**
 * Middleware para verificar el scope (alcance) del usuario según su rol.
 * 
 * @param {Object} config - Configuración del scope
 * @param {string} config.resource - Tipo de recurso: 'regional' | 'centro'
 * @param {string} config.source - Origen del ID: 'params' | 'query' | 'body' (default: 'params')
 * @param {string} config.param - Nombre del parámetro que contiene el ID (ej: 'id', 'regionalId', 'centroId')
 * @param {boolean} config.required - Si el parámetro es obligatorio (default: true)
 * @param {boolean} config.allowRead - Permite lectura sin restricciones para roles de centro (default: false)
 * 
 * @example
 * // Validar acceso a una regional específica
 * verificarScope({ resource: 'regional', param: 'id' })
 * 
 * @example
 * // Validar acceso a un centro con lectura permitida
 * verificarScope({ resource: 'centro', param: 'centroId', allowRead: true })
 * 
 * @example
 * // Validar regional desde query params (opcional)
 * verificarScope({ resource: 'regional', source: 'query', param: 'regional_id', required: false })
 */
export const verificarScope = (config = {}) => {
  const {
    resource,
    source = 'params',
    param,
    required = true,
    allowRead = false
  } = config;

  return async (req, res, next) => {
    try {
      // 1. Verificar que el usuario esté autenticado
      if (!req.usuario) {
        return errorResponse(res, "Usuario no autenticado", 401, [{
          code: 'UNAUTHENTICATED',
          detail: 'Debe estar autenticado para realizar esta acción'
        }]);
      }

      // 2. Obtener el ID del recurso según la fuente
      const resourceId = req[source]?.[param];

      // 3. Si no hay ID y no es requerido, continuar
      if (!resourceId && !required) {
        return next();
      }

      // 4. Si no hay ID y es requerido, retornar error
      if (!resourceId && required) {
        return errorResponse(res, `El parámetro ${param} es requerido`, 400, [{
          code: 'MISSING_PARAMETER',
          detail: `Debe proporcionar ${param} en ${source}`
        }]);
      }

      // 5. Cargar el usuario completo con sus roles, regional y centros
      const usuario = await Usuario.findByPk(req.usuario.id, {
        include: [
          {
            model: Rol,
            as: 'roles',
            attributes: ['id', 'nombre'],
            through: {
              attributes: [],
              where: { estado: true }
            }
          },
          {
            model: Regional,
            as: 'regional',
            attributes: ['id', 'nombre']
          },
          {
            model: Centro,
            as: 'centros',
            attributes: ['id', 'nombre', 'regional_id'],
            through: {
              attributes: [],
              where: { estado: true }
            }
          }
        ]
      });

      if (!usuario || !usuario.roles || usuario.roles.length === 0) {
        return errorResponse(res, "Usuario sin roles asignados", 403, [{
          code: 'NO_ROLES',
          detail: 'El usuario no tiene roles activos'
        }]);
      }

      // 6. Obtener nombres de roles del usuario
      const rolesUsuario = usuario.roles.map(r => r.nombre);

      // 7. ADMIN: Acceso total - bypass
      if (rolesUsuario.includes(RolEnum.ADMIN)) {
        return next();
      }

      // 8. Validar según el tipo de recurso
      if (resource === 'regional') {
        return await validarScopeRegional(
          usuario,
          rolesUsuario,
          resourceId,
          allowRead,
          req,
          res,
          next
        );
      } else if (resource === 'centro') {
        return await validarScopeCentro(
          usuario,
          rolesUsuario,
          resourceId,
          allowRead,
          req,
          res,
          next
        );
      } else {
        return errorResponse(res, "Tipo de recurso no válido", 500, [{
          code: 'INVALID_RESOURCE_TYPE',
          detail: `El tipo de recurso '${resource}' no es válido`
        }]);
      }

    } catch (error) {
      console.error('Error en verificarScope:', error);
      return errorResponse(res, "Error al verificar permisos de acceso", 500, [{
        code: 'SCOPE_VERIFICATION_ERROR',
        detail: error.message
      }]);
    }
  };
};

/**
 * Valida el scope para recursos de tipo 'regional'
 */
async function validarScopeRegional(usuario, rolesUsuario, regionalId, allowRead, req, res, next) {
  const regionalIdNum = parseInt(regionalId);

  // DIRECTOR_REGIONAL: Solo su regional asignada
  if (rolesUsuario.includes(RolEnum.DIRECTOR_REGIONAL)) {
    if (usuario.regional_id === regionalIdNum) {
      return next();
    } else {
      return errorResponse(res, "No tiene acceso a esta regional", 403, [{
        code: 'SCOPE_DENIED',
        detail: `No tiene permisos para acceder a la regional ${regionalId}. Solo puede acceder a su regional asignada.`
      }]);
    }
  }

  // ADMINISTRADOR_CENTRO o REVISOR
  if (rolesUsuario.includes(RolEnum.ADMINISTRADOR_CENTRO) || 
      rolesUsuario.includes(RolEnum.REVISOR)) {
    
    // Si allowRead es true y es una operación GET, permitir lectura
    if (allowRead && req.method === 'GET') {
      return next();
    }

    // Si no es lectura, verificar si la regional corresponde a alguno de sus centros
    const tieneAcceso = usuario.centros.some(centro => centro.regional_id === regionalIdNum);
    
    if (tieneAcceso) {
      return next();
    } else {
      return errorResponse(res, "No tiene acceso a esta regional", 403, [{
        code: 'SCOPE_DENIED',
        detail: `No tiene permisos para acceder a la regional ${regionalId}. Solo puede acceder a las regionales de sus centros asignados.`
      }]);
    }
  }

  // Si no tiene ningún rol que permita acceso a regionales
  return errorResponse(res, "No tiene permisos para acceder a regionales", 403, [{
    code: 'INSUFFICIENT_PERMISSIONS',
    detail: 'Su rol no tiene permisos para acceder a este recurso'
  }]);
}

/**
 * Valida el scope para recursos de tipo 'centro'
 */
async function validarScopeCentro(usuario, rolesUsuario, centroId, allowRead, req, res, next) {
  const centroIdNum = parseInt(centroId);

  // DIRECTOR_REGIONAL: Acceso a todos los centros de su regional
  if (rolesUsuario.includes(RolEnum.DIRECTOR_REGIONAL)) {
    if (!usuario.regional_id) {
      return errorResponse(res, "Director regional sin regional asignada", 500, [{
        code: 'MISSING_REGIONAL',
        detail: 'El usuario tiene rol de director regional pero no tiene regional asignada'
      }]);
    }

    // Verificar que el centro pertenece a su regional
    const centro = await Centro.findOne({
      where: { id: centroIdNum },
      attributes: ['id', 'nombre', 'regional_id']
    });

    if (!centro) {
      return errorResponse(res, "Centro no encontrado", 404, [{
        code: 'CENTRO_NOT_FOUND',
        detail: `No existe un centro con ID ${centroId}`
      }]);
    }

    if (centro.regional_id === usuario.regional_id) {
      return next();
    } else {
      return errorResponse(res, "No tiene acceso a este centro", 403, [{
        code: 'SCOPE_DENIED',
        detail: `El centro ${centroId} no pertenece a su regional`
      }]);
    }
  }

  // ADMINISTRADOR_CENTRO o REVISOR: Solo sus centros asignados
  if (rolesUsuario.includes(RolEnum.ADMINISTRADOR_CENTRO) || 
      rolesUsuario.includes(RolEnum.REVISOR)) {
    
    const tieneAcceso = usuario.centros.some(centro => centro.id === centroIdNum);
    
    if (tieneAcceso) {
      return next();
    } else {
      return errorResponse(res, "No tiene acceso a este centro", 403, [{
        code: 'SCOPE_DENIED',
        detail: `No tiene permisos para acceder al centro ${centroId}. Solo puede acceder a sus centros asignados.`
      }]);
    }
  }

  // Si no tiene ningún rol que permita acceso a centros
  return errorResponse(res, "No tiene permisos para acceder a centros", 403, [{
    code: 'INSUFFICIENT_PERMISSIONS',
    detail: 'Su rol no tiene permisos para acceder a este recurso'
  }]);
}

/**
 * Utility: Agrega filtros de scope automáticos al query
 * Útil para endpoints de listado
 * 
 * @param {Object} req - Request de Express con req.usuario
 * @returns {Object} Objeto con filtros de Sequelize según el scope del usuario
 * 
 * @example
 * // En un servicio de listado
 * const scopeFilters = await aplicarFiltrosScope(req);
 * const where = { ...scopeFilters, estado: true };
 * const centros = await Centro.findAll({ where });
 */
export const aplicarFiltrosScope = async (req) => {
  if (!req.usuario) {
    return {};
  }

  // Cargar usuario con roles y asignaciones
  const usuario = await Usuario.findByPk(req.usuario.id, {
    include: [
      {
        model: Rol,
        as: 'roles',
        attributes: ['nombre'],
        through: { 
          attributes: [],
          where: { estado: true }
        }
      },
      {
        model: Centro,
        as: 'centros',
        attributes: ['id', 'regional_id'],
        through: {
          attributes: [],
          where: { estado: true }
        }
      }
    ]
  });

  if (!usuario || !usuario.roles) {
    return {};
  }

  const rolesUsuario = usuario.roles.map(r => r.nombre);

  // ADMIN: Sin filtros
  if (rolesUsuario.includes(RolEnum.ADMIN)) {
    return {};
  }

  // DIRECTOR_REGIONAL: Filtrar por su regional
  if (rolesUsuario.includes(RolEnum.DIRECTOR_REGIONAL)) {
    return {
      regional_id: usuario.regional_id
    };
  }

  // ADMINISTRADOR_CENTRO o REVISOR: Filtrar por sus centros
  if (rolesUsuario.includes(RolEnum.ADMINISTRADOR_CENTRO) || 
      rolesUsuario.includes(RolEnum.REVISOR)) {
    const centroIds = usuario.centros.map(c => c.id);
    return {
      id: { [Op.in]: centroIds }
    };
  }

  return {};
};

export default verificarScope;

