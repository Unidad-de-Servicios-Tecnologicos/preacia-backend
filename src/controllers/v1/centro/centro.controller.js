import { validationResult } from "express-validator";
import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import {
  getCentrosService,
  getListCentrosService,
  storeCentroService,
  showCentroService,
  updateCentroService,
  changeCentroStatusService
} from "../../../services/v1/centro.service.js";

/**
 * Controlador para obtener centros con filtros, orden y paginación.
 */
export const getCentros = async (req, res) => {
  try {
    const {
      data,
      meta,
      links
    } = await getCentrosService(req);

    return successResponse(
      res,
      data,
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los centros", 500, [
      {
        code: "GET_CENTROS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para obtener lista simplificada de centros.
 */
export const getListCentros = async (req, res) => {
  try {
    let { regional_id, estado, sortBy = "nombre", order = "ASC" } = req.query;

    if (estado !== undefined) {
      if (estado === "true") estado = true;
      else if (estado === "false") estado = false;
      else estado = undefined;
    }

    const { data, count } = await getListCentrosService(regional_id, estado, sortBy, order);

    return successResponse(
      res,
      formatJsonApiData(data, ["id", "codigo", "nombre", "regional_id", "estado", "regional"]),
      200,
      { count }
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener la lista de centros", 500, [
      {
        code: "GET_LIST_CENTROS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para crear un nuevo centro.
 */
export const storeCentro = async (req, res) => {
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
    const centro = await storeCentroService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Centro creado exitosamente',
      data: {
        id: centro.id,
        regional_id: centro.regional_id,
        codigo: centro.codigo,
        nombre: centro.nombre,
        direccion: centro.direccion,
        telefono: centro.telefono,
        estado: centro.estado,
      }
    });
  } catch (error) {
    console.error("Error al crear centro:", error);

    // Si la regional no existe
    if (error.code === "REGIONAL_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // Si la regional está inactiva
    if (error.code === "REGIONAL_INACTIVE") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Si es error de código duplicado
    if (error.code === "DUPLICATE_CENTRO_CODIGO") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Si es error de nombre duplicado
    if (error.code === "DUPLICATE_CENTRO_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al crear el centro",
      error: error.message
    });
  }
};

/**
 * Controlador para obtener un centro por ID.
 */
export const showCentro = async (req, res) => {
  try {
    const centro = await showCentroService(req.params.id);

    if (!centro) {
      return errorResponse(res, "No existe un centro con el ID especificado", 404, [
        {
          code: "CENTRO_NOT_FOUND",
          detail: `No existe un centro con ID ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: centro.id,
        regional_id: centro.regional_id,
        codigo: centro.codigo,
        nombre: centro.nombre,
        direccion: centro.direccion,
        telefono: centro.telefono,
        estado: centro.estado,
        created_at: centro.created_at,
        updated_at: centro.updated_at,
        regional: centro.regional ? {
          id: centro.regional.id,
          codigo: centro.regional.codigo,
          nombre: centro.regional.nombre,
        } : null,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener el centro", 500, [
      {
        code: "SHOW_CENTRO_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para actualizar un centro.
 */
export const updateCentro = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const centro = await updateCentroService(req.params.id, req.body);

    if (!centro) {
      return res.status(404).json({
        success: false,
        message: `No existe un centro con ID ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Centro actualizado exitosamente',
      data: {
        id: centro.id,
        regional_id: centro.regional_id,
        codigo: centro.codigo,
        nombre: centro.nombre,
        direccion: centro.direccion,
        telefono: centro.telefono,
        estado: centro.estado,
        regional: centro.regional ? {
          id: centro.regional.id,
          codigo: centro.regional.codigo,
          nombre: centro.regional.nombre,
        } : null,
      }
    });
  } catch (error) {
    console.error("Error al actualizar el centro:", error);

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: `No existe un centro con ID ${req.params.id}`
      });
    }

    if (error.code === "REGIONAL_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "REGIONAL_INACTIVE") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "DUPLICATE_CENTRO_CODIGO") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "DUPLICATE_CENTRO_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el centro",
      error: error.message
    });
  }
};

/**
 * Controlador para cambiar el estado de un centro.
 */
export const changeCentroStatus = async (req, res) => {
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
    const centro = await changeCentroStatusService(req.params.id, req.body.estado);

    return successResponse(
      res,
      {
        id: centro.id,
        codigo: centro.codigo,
        nombre: centro.nombre,
        estado: centro.estado,
      },
      200
    );
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Centro no encontrado", 404, [
        {
          code: "CENTRO_NOT_FOUND",
          detail: error.message,
        },
      ]);
    }

    if (error.code === "CENTRO_HAS_USUARIOS") {
      return errorResponse(res, "No se puede desactivar", 409, [
        {
          code: "CENTRO_HAS_USUARIOS",
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al cambiar el estado del centro", 500, [
      {
        code: "CHANGE_CENTRO_STATUS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

// Mantener compatibilidad con nombres anteriores si es necesario
export const crearCentro = storeCentro;
export const obtenerCentroPorId = showCentro;
export const editarCentro = updateCentro;
export const cambiarEstadoCentro = changeCentroStatus;

