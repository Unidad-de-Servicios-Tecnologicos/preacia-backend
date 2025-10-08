import { validationResult } from "express-validator";
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
 * Controlador para obtener roles con filtros, orden y paginación.
 */
export const getRoles = async (req, res) => {
  try {
    const {
      data,
      meta,
      links
    } = await getRolesService(req);

    return successResponse(
      res,
      data,
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

/**
 * Controlador para obtener lista simplificada de roles.
 */
export const getListRoles = async (req, res) => {
  try {
    let { estado, sortBy = "nombre", order = "ASC" } = req.query;
    if (estado !== undefined) {
      if (estado === "true") estado = true;
      else if (estado === "false") estado = false;
      else estado = undefined;
    }

    const { data, count } = await getListRolesService(estado, sortBy, order);

    return successResponse(
      res,
      formatJsonApiData(data, ["id", "nombre", "descripcion", "estado", "created_at", "updated_at"]),
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

/**
 * Controlador para crear un nuevo rol.
 */
export const storeRole = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const rol = await storeRoleService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Rol creado exitosamente',
      data: {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        estado: rol.estado,
      }
    });
  } catch (error) {
    console.error("Error al crear rol:", error);

    // Si es error de nombre duplicado
    if (error.code === "DUPLICATE_ROLE_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Si es error de validación de permisos
    if (error.code === "ROLE_NEEDS_PERMISSION" || error.code === "INVALID_PERMISSION_IDS") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al crear el rol",
      error: error.message
    });
  }
};

/**
 * Controlador para obtener un rol por ID.
 */
export const showRole = async (req, res) => {
  try {
    const rol = await showRoleService(req.params.id);

    if (!rol) {
      return errorResponse(res, "No existe un rol con el ID especificado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con ID ${req.params.id}`,
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
        created_at: rol.created_at,
        updated_at: rol.updated_at,
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

/**
 * Controlador para actualizar un rol.
 */
export const updateRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const rol = await updateRoleService(req.params.id, req.body);

    if (!rol) {
      return res.status(404).json({
        success: false,
        message: `No existe un rol con ID ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        estado: rol.estado,
      }
    });
  } catch (error) {
    console.error("Error al actualizar el rol:", error);

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: `No existe un rol con ID ${req.params.id}`
      });
    }

    // Manejo del error de nombre duplicado
    if (error.code === "DUPLICATE_ROLE_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "SYSTEM_ROLE_UPDATE_FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    // Si es error de validación de permisos
    if (error.code === "ROLE_NEEDS_PERMISSION" || error.code === "INVALID_PERMISSION_IDS") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el rol",
      error: error.message
    });
  }
};

/**
 * Controlador para eliminar un rol.
 */
export const deleteRole = async (req, res) => {
  try {
    await deleteRoleService(req.params.id);
    return res.status(204).json();
  } catch (error) {
    console.error("Error al eliminar rol:", error);

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Rol no encontrado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: `No existe un rol con ID ${req.params.id}`,
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

/**
 * Controlador para cambiar el estado de un rol.
 */
export const changeRoleStatus = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, "Errores de validación", 400,
      errors.array().map(error => ({
        code: "VALIDATION_ERROR",
        detail: error.msg,
        field: error.path
      }))
    );
  }

  try {
    const rol = await changeRoleStatusService(req.params.id, req.body.estado);

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
    console.error("Error al cambiar estado:", error);

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Rol no encontrado", 404, [
        {
          code: "ROLE_NOT_FOUND",
          detail: error.message,
        },
      ]);
    }

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
