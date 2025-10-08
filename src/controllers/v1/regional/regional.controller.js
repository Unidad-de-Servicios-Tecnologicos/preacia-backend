import { validationResult } from "express-validator";
import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import {
  getRegionalesService,
  getListRegionalesService,
  storeRegionalService,
  showRegionalService,
  updateRegionalService,
  changeRegionalStatusService
} from "../../../services/v1/regional.service.js";

/**
 * Controlador para obtener regionales con filtros, orden y paginación.
 */
export const getRegionales = async (req, res) => {
  try {
    const {
      data,
      meta,
      links
    } = await getRegionalesService(req);

    return successResponse(
      res,
      data,
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener las regionales", 500, [
      {
        code: "GET_REGIONALES_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para obtener lista simplificada de regionales.
 */
export const getListRegionales = async (req, res) => {
  try {
    let { activo, sortBy = "nombre", order = "ASC" } = req.query;
    if (activo !== undefined) {
      if (activo === "true") activo = true;
      else if (activo === "false") activo = false;
      else activo = undefined;
    }

    const { data, count } = await getListRegionalesService(activo, sortBy, order);

    return successResponse(
      res,
      formatJsonApiData(data, ["id", "codigo", "nombre", "activo"]),
      200,
      { count }
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener la lista de regionales", 500, [
      {
        code: "GET_LIST_REGIONALES_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para crear una nueva regional.
 */
export const storeRegional = async (req, res) => {
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
    const regional = await storeRegionalService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Regional creada exitosamente',
      data: {
        id: regional.id,
        codigo: regional.codigo,
        nombre: regional.nombre,
        direccion: regional.direccion,
        telefono: regional.telefono,
        activo: regional.activo,
      }
    });
  } catch (error) {
    console.error("Error al crear regional:", error);

    // Si es error de código duplicado
    if (error.code === "DUPLICATE_REGIONAL_CODIGO") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Si es error de nombre duplicado
    if (error.code === "DUPLICATE_REGIONAL_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al crear la regional",
      error: error.message
    });
  }
};

/**
 * Controlador para obtener una regional por ID.
 */
export const showRegional = async (req, res) => {
  try {
    const regional = await showRegionalService(req.params.id);

    if (!regional) {
      return errorResponse(res, "No existe una regional con el ID especificado", 404, [
        {
          code: "REGIONAL_NOT_FOUND",
          detail: `No existe una regional con ID ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: regional.id,
        codigo: regional.codigo,
        nombre: regional.nombre,
        direccion: regional.direccion,
        telefono: regional.telefono,
        activo: regional.activo,
        created_at: regional.created_at,
        updated_at: regional.updated_at,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener la regional", 500, [
      {
        code: "SHOW_REGIONAL_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para actualizar una regional.
 */
export const updateRegional = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const regional = await updateRegionalService(req.params.id, req.body);

    if (!regional) {
      return res.status(404).json({
        success: false,
        message: `No existe una regional con ID ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Regional actualizada exitosamente',
      data: {
        id: regional.id,
        codigo: regional.codigo,
        nombre: regional.nombre,
        direccion: regional.direccion,
        telefono: regional.telefono,
        activo: regional.activo,
      }
    });
  } catch (error) {
    console.error("Error al actualizar la regional:", error);

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: `No existe una regional con ID ${req.params.id}`
      });
    }

    // Manejo del error de código duplicado
    if (error.code === "DUPLICATE_REGIONAL_CODIGO") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "DUPLICATE_REGIONAL_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al actualizar la regional",
      error: error.message
    });
  }
};

/**
 * Controlador para cambiar el estado de una regional.
 */
export const changeRegionalStatus = async (req, res) => {
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
    const regional = await changeRegionalStatusService(req.params.id, req.body.activo);

    return successResponse(
      res,
      {
        id: regional.id,
        codigo: regional.codigo,
        nombre: regional.nombre,
        activo: regional.activo,
      },
      200
    );
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Regional no encontrada", 404, [
        {
          code: "REGIONAL_NOT_FOUND",
          detail: error.message,
        },
      ]);
    }

    if (error.code === "REGIONAL_HAS_CENTROS") {
      return errorResponse(res, "No se puede desactivar", 409, [
        {
          code: "REGIONAL_HAS_CENTROS",
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al cambiar el estado de la regional", 500, [
      {
        code: "CHANGE_REGIONAL_STATUS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

/**
 * Controlador para obtener los centros de una regional específica.
 */
export const getCentrosByRegional = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      activo, 
      sortBy = "nombre", 
      order = "ASC",
      page = 1,
      limit = 10 
    } = req.query;

    // Verificar que la regional existe
    const regional = await showRegionalService(id);
    if (!regional) {
      return errorResponse(res, "Regional no encontrada", 404, [
        {
          code: "REGIONAL_NOT_FOUND",
          detail: `No existe una regional con ID ${id}`,
        },
      ]);
    }

    // Importar el servicio de centros
    const { getCentrosService } = await import("../../../services/v1/centro.service.js");

    // Crear un request modificado con el filtro de regional
    const modifiedReq = {
      ...req,
      query: {
        ...req.query,
        regional_id: id,
        activo,
        sortBy,
        order,
        page,
        limit
      }
    };

    const {
      data,
      meta,
      links
    } = await getCentrosService(modifiedReq);

    return successResponse(
      res,
      data,
      200,
      {
        ...meta,
        regional: {
          id: regional.id,
          codigo: regional.codigo,
          nombre: regional.nombre
        }
      },
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los centros de la regional", 500, [
      {
        code: "GET_CENTROS_BY_REGIONAL_ERROR",
        detail: error.message,
      },
    ]);
  }
};

// Mantener compatibilidad con nombres anteriores si es necesario
export const crearRegional = storeRegional;
export const obtenerRegionalPorId = showRegional;
export const editarRegional = updateRegional;
export const cambiarEstadoRegional = changeRegionalStatus;

