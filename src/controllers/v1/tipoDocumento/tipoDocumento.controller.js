import { validationResult } from "express-validator";
import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import {
  getTipoDocumentosService,
  getListTipoDocumentosService,
  storeTipoDocumentoService,
  showTipoDocumentoService,
  updateTipoDocumentoService,
  changeTipoDocumentoStatusService
} from "../../../services/v1/tipoDocumento.service.js";

/**
 * Controlador para obtener tipos de documentos con filtros, orden y paginación usando servicios.
 */
export const getTipoDocumentos = async (req, res) => {
  try {
    const {
      data,
      meta,
      links
    } = await getTipoDocumentosService(req);

    // Retornar los datos completos incluyendo las relaciones
    return successResponse(
      res,
      data, // Retornar los datos tal como vienen del servicio
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los tipos de documentos", 500, [
      {
        code: "GET_TIPO_DOCUMENTOS_ERROR",
        detail: error.message,
      },
    ]);
  }
};


export const getListTipoDocumentos = async (req, res) => {
  try {
    let { estado, sortBy = "id", order = "ASC" } = req.query;
    if (estado !== undefined) {
      if (estado === "true") estado = true;
      else if (estado === "false") estado = false;
      else estado = undefined;
    }

    const { data, count } = await getListTipoDocumentosService(estado, sortBy, order);

    return successResponse(
      res,
      formatJsonApiData(data, ["id", "codigo", "nombre", "estado"]),
      200,
      { count }
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener la lista de tipos de documentos", 500, [
      {
        code: "GET_LIST_TIPO_DOCUMENTOS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const storeTipoDocumento = async (req, res) => {
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
    const tipoDocumento = await storeTipoDocumentoService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tipo de documento creado exitosamente',
      data: {
        id: tipoDocumento.id,
        codigo: tipoDocumento.codigo,
        nombre: tipoDocumento.nombre,
        estado: tipoDocumento.estado,
      }
    });
  } catch (error) {
    console.error("Error al crear tipo de documento:", error);

    // Si es error de código duplicado, mostrar mensaje claro
    if (error.code === "DUPLICATE_TIPO_DOCUMENTO_CODIGO") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Si es error de nombre duplicado
    if (error.code === "DUPLICATE_TIPO_DOCUMENTO_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al crear el tipo de documento",
      error: error.message
    });
  }
};

export const showTipoDocumento = async (req, res) => {
  try {
    const tipoDocumento = await showTipoDocumentoService(req.params.id);

    if (!tipoDocumento) {
      return errorResponse(res, "No existe un tipo de documento con el ID especificado", 404, [
        {
          code: "TIPO_DOCUMENTO_NOT_FOUND",
          detail: `No existe un tipo de documento con ID ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: tipoDocumento.id,
        codigo: tipoDocumento.codigo,
        nombre: tipoDocumento.nombre,
        estado: tipoDocumento.estado,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener el tipo de documento", 500, [
      {
        code: "SHOW_TIPO_DOCUMENTO_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const updateTipoDocumento = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const tipoDocumento = await updateTipoDocumentoService(req.params.id, req.body);

    if (!tipoDocumento) {
      return res.status(404).json({
        success: false,
        message: `No existe un tipo de documento con ID ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tipo de documento actualizado exitosamente',
      data: {
        id: tipoDocumento.id,
        codigo: tipoDocumento.codigo,
        nombre: tipoDocumento.nombre,
        estado: tipoDocumento.estado,
      }
    });
  } catch (error) {
    console.error("Error al actualizar el tipo de documento:", error);

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: `No existe un tipo de documento con ID ${req.params.id}`
      });
    }

    // Manejo del error de código duplicado
    if (error.code === "DUPLICATE_TIPO_DOCUMENTO_CODIGO") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "DUPLICATE_TIPO_DOCUMENTO_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el tipo de documento",
      error: error.message
    });
  }
};

export const changeTipoDocumentoStatus = async (req, res) => {
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
    const tipoDocumento = await changeTipoDocumentoStatusService(req.params.id, req.body.estado);

    return successResponse(
      res,
      {
        id: tipoDocumento.id,
        codigo: tipoDocumento.codigo,
        nombre: tipoDocumento.nombre,
        estado: tipoDocumento.estado,
      },
      200
    );
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    // Manejar errores específicos
    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Tipo de documento no encontrado", 404, [
        {
          code: "TIPO_DOCUMENTO_NOT_FOUND",
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al cambiar el estado del tipo de documento", 500, [
      {
        code: "CHANGE_TIPO_DOCUMENTO_STATUS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

// Mantener compatibilidad con nombres anteriores
export const crearTipoDocumento = storeTipoDocumento;
export const obtenerTipoDocumentoPorId = showTipoDocumento;
export const editarTipoDocumento = updateTipoDocumento;
export const cambiarEstadoTipoDocumento = changeTipoDocumentoStatus;
