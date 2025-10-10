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
 * Controlador para obtener centros con filtros, orden y paginación usando servicios.
 */
export const getCentros = async (req, res) => {
    try {
        const {
            data,
            meta,
            links
        } = await getCentrosService(req);

        // Retornar los datos completos incluyendo las relaciones
        return successResponse(
            res,
            data, // Retornar los datos tal como vienen del servicio
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
 * Controlador para obtener las áreas asociadas a un centro por su ID.
 */
// La funcionalidad de áreas fue removida: no exportamos getAreasByCentro.
export const getListCentros = async (req, res) => {
    try {
        let { estado, sortBy = "id", order = "ASC" } = req.query;
        if (estado !== undefined) {
            if (estado === "true") estado = true;
            else if (estado === "false") estado = false;
            else estado = undefined;
        }

        const { data, count } = await getListCentrosService(estado, sortBy, order);

        return successResponse(
            res,
            formatJsonApiData(data, ["id", "codigo", "nombre", "estado"]),
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
                codigo: centro.codigo,
                nombre: centro.nombre,
                direccion: centro.direccion,
                ciudad_id: centro.ciudad_id,
                regional_id: centro.regional_id,
                supervisores_id: centro.supervisores_id,
                estado: centro.estado,
            }
        });
    } catch (error) {
        console.error("Error al crear centro:", error);

        // Si es error de código duplicado, mostrar mensaje claro
        if (error.code === "DUPLICATE_CENTRO_CODE") {
            return res.status(400).json({
                success: false,
                message: error.message // "El código XXXX ya está registrado. No se puede repetir el código."
            });
        }

        // Si es error de nombre duplicado
        if (error.code === "DUPLICATE_CENTRO_NAME") {
            return res.status(400).json({
                success: false,
                message: error.message // "El nombre XXXX ya está registrado. No se puede repetir el nombre."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al crear el centro",
            error: error.message
        });
    }
};

export const showCentro = async (req, res) => {
    try {
        const centro = await showCentroService(req.params.codigo);

        if (!centro) {
            return errorResponse(res, "No existe un centro con el código", 404, [
                {
                    code: "CENTRO_NOT_FOUND",
                    detail: `No existe un centro con código ${req.params.codigo}`,
                },
            ]);
        }

        return successResponse(
            res,
            {
                id: centro.id,
                codigo: centro.codigo,
                nombre: centro.nombre,
                direccion: centro.direccion,
                ciudad_id: centro.ciudad_id,
                regional_id: centro.regional_id,
                supervisores_id: centro.supervisores_id,
                estado: centro.estado,
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
        const centro = await updateCentroService(req.params.codigo, req.body);

        if (!centro) {
            return res.status(404).json({
                success: false,
                message: `No existe un centro con código ${req.params.codigo}`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Centro actualizado exitosamente',
            data: centro
        });
    } catch (error) {
        console.error("Error al actualizar el centro:", error);

        if (error.code === "NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: `No existe un centro con código ${req.params.codigo}`
            });
        }

        // Manejo del error de código duplicado
        if (error.code === "DUPLICATE_CENTRO_CODE") {
            return res.status(400).json({
                success: false,
                message: error.message // "El código XXXX ya está registrado. No se puede repetir el código."
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
        const centro = await changeCentroStatusService(req.params.codigo, req.body.estado);

        return successResponse(
            res,
            {
                id: centro.id,
                codigo: centro.codigo,
                nombre: centro.nombre,
                estado: centro.estado, // Esto debe ser true o false
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

        if (error.code === "CENTRO_HAS_SUPERVISORES") {
            return errorResponse(res, "No se puede desactivar", 409, [
                {
                    code: "CENTRO_HAS_SUPERVISORES",
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

// Mantener compatibilidad con nombres anteriores
export const crearCentro = storeCentro;
export const obtenerCentroPorCodigo = showCentro;
export const editarCentro = updateCentro;
export const cambiarEstadoCentro = changeCentroStatus;