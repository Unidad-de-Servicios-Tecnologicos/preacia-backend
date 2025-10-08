import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { showRoleService } from "../../../services/v1/rol.service.js";
import { getListPermissionsService } from "../../../services/v1/permiso.service.js";

/**
 * Controlador para obtener todos los permisos de un rol específico (sin paginación)
 * @route GET /api/v1/roles/:id/permisos
 */
export const getPermisosByRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      estado, 
      sortBy = "nombre", 
      order = "ASC"
    } = req.query;

    // Verificar que el rol existe
    const rol = await showRoleService(id);
    if (!rol) {
      return errorResponse(res, "Rol no encontrado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con ID ${id}`,
        },
      ]);
    }

    // Obtener permisos sin paginación
    const { data, count } = await getListPermissionsService(estado, sortBy, order);

    // Marcar los permisos que están asociados al rol
    const permisosConEstado = data.map(permiso => {
      const estaAsociado = rol.permisos && rol.permisos.some(p => p.id === permiso.id);
      return {
        ...permiso.toJSON(),
        asociado: estaAsociado
      };
    });

    return successResponse(
      res,
      permisosConEstado,
      200,
      {
        count,
        asociados: rol.permisos ? rol.permisos.length : 0
      }
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los permisos del rol", 500, [
      {
        code: "GET_PERMISOS_BY_ROL_ERROR",
        detail: error.message,
      },
    ]);
  }
};

