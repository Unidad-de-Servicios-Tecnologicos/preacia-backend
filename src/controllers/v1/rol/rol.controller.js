import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import {
  getRolesService,
  getListRolesService,
  storeRoleService,
  showRoleService,
  updateRoleService,
  deleteRoleService,
  changeRoleStatusService
} from "../../../services/v1/rol.service.js";

/**
 * Controlador para obtener roles con filtros, orden y paginación usando servicios.
 */
export const getRoles = async (req, res) => {
  try {
    const {
      data,
      meta,
      links
    } = await getRolesService(req);

    // Retornar los datos completos incluyendo las relaciones
    return successResponse(
      res,
      data, // Retornar los datos tal como vienen del servicio
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los roles", 500, [
      {
        code: "GET_ROLES_ERROR",
        detail: error.message,
      },
    ]);
  }
};


export const getListRoles = async (req, res) => {
  try {
    let { estado, sortBy = "id", order = "ASC" } = req.query;
    if (estado !== undefined) {
      if (estado === "true") estado = true;
      else if (estado === "false") estado = false;
      else estado = undefined;
    }

    const { data, count } = await getListRolesService(estado, sortBy, order);

    return successResponse(
      res,
      formatJsonApiData(data, ["id", "nombre", "descripcion", "estado"]),
      200,
      { count }
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener la lista de roles", 500, [
      {
        code: "GET_LIST_ROLES_ERROR",
        detail: error.message,
      },
    ]);
  }
};


export const storeRole = async (req, res) => {
  try {
    const rol = await storeRoleService(req.body);

    return successResponse(
      res,
      {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        estado: rol.estado,
      },
      201
    );
  } catch (error) {

    // Manejar errores de validación específicos
    if (error.code === "VALIDATION_ERROR" || error.code === "DUPLICATE_ROLE_NAME") {
      return errorResponse(res, error.message, 400, [
        {
          code: error.code,
          field: error.field,
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al crear el rol", 500, [
      {
        code: "CREATE_ROLE_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const showRole = async (req, res) => {
  try {
    const rol = await showRoleService(req.params.id);

    if (!rol) {
      return errorResponse(res, "No existe un rol con id", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con id ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        estado: rol.estado,
        permisos: rol.permisos || [],
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener el rol", 500, [
      {
        code: "SHOW_ROLE_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const updateRole = async (req, res) => {
  try {
    const rol = await updateRoleService(req.params.id, req.body);

    return successResponse(
      res,
      {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        estado: rol.estado,
      },
      200
    );
  } catch (error) {

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Rol no encontrado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con id ${req.params.id}`,
        },
      ]);
    }

    if (error.code === "VALIDATION_ERROR" || error.code === "DUPLICATE_ROLE_NAME") {
      return errorResponse(res, error.message, 400, [
        {
          code: error.code,
          field: error.field,
          detail: error.message,
        },
      ]);
    }

    if (error.code === "SYSTEM_ROLE_UPDATE_FORBIDDEN") {
      return errorResponse(res, "No permitido", 403, [
        {
          code: error.code,
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al actualizar el rol", 500, [
      {
        code: "UPDATE_ROLE_ERROR",
        detail: error.message,
      },
    ]);
  }
};


export const deleteRole = async (req, res) => {
  try {
    const deleted = await deleteRoleService(req.params.id);
    return res.status(204).json();
  } catch (error) {

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Rol no encontrado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con id ${req.params.id}`,
        },
      ]);
    }

    if (error.code === "SYSTEM_ROLE_DELETE_FORBIDDEN") {
      return errorResponse(res, "No permitido", 403, [
        {
          code: "SYSTEM_ROLE_DELETE_FORBIDDEN",
          detail: error.message,
        },
      ]);
    }

    if (error.code === "ROLE_HAS_USERS") {
      return errorResponse(res, "No se puede eliminar", 409, [
        {
          code: "ROLE_HAS_USERS",
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al eliminar el rol", 500, [
      {
        code: "DELETE_ROLE_ERROR",
        detail: error.message,
      },
    ]);
  }
};


export const changeRoleStatus = async (req, res) => {
  try {
    const rol = await changeRoleStatusService(req.params.id, req.body.estado);

    if (rol === "NOT_FOUND") {
      return errorResponse(res, "Rol no encontrado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con id ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        estado: rol.estado,
      },
      200
    );
  } catch (error) {

    // Manejar errores específicos
    if (error.code === "SYSTEM_ROLE_UPDATE_FORBIDDEN") {
      return errorResponse(res, "No permitido", 403, [
        {
          code: "SYSTEM_ROLE_UPDATE_FORBIDDEN",
          detail: error.message,
        },
      ]);
    }

    if (error.code === "ROLE_HAS_USERS") {
      return errorResponse(res, "No se puede desactivar", 409, [
        {
          code: "ROLE_HAS_USERS",
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al cambiar el estado del rol", 500, [
      {
        code: "CHANGE_ROLE_STATUS_ERROR",
        detail: error.message,
      },
    ]);
  }
};