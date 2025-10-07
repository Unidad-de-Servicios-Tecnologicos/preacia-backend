import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import {
    getPermissionsService,
    getListPermissionsService,
    showPermissionService,
    // changePermissionStatusService,
    // crearPermiso,
    // editarPermiso,
    // obtenerPermisoPorId,
    // getAllPermisos,
    // cambiarEstadoPermiso,
    // getPermisosPorModulo
} from "../../../services/v1/permiso.service.js";
//import { validationResult } from "express-validator";

/**
 * Controlador para obtener permisos con filtros, orden y paginación usando servicios.
 */
export const getPermissions = async (req, res) => {
    try {
        const {
            data,
            meta,
            links
        } = await getPermissionsService(req);

        return successResponse(
            res,
            formatJsonApiData(data, ["id", "nombre", "descripcion", "estado"]),
            200,
            meta,
            links
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener los permisos", 500, [
            {
                code: "GET_PERMISSIONS_ERROR",
                detail: error.message,
            },
        ]);
    }
};

export const getListPermissions = async (req, res) => {
    try {
        let { estado, sortBy = "id", order = "ASC" } = req.query;
        if (estado !== undefined) {
            if (estado === "true") estado = true;
            else if (estado === "false") estado = false;
            else estado = undefined;
        }

        const { data, count } = await getListPermissionsService(estado, sortBy, order);

        return successResponse(
            res,
            formatJsonApiData(data, ["id", "nombre", "descripcion", "estado"]),
            200,
            { count }
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener la lista de permisos", 500, [
            {
                code: "GET_LIST_PERMISSIONS_ERROR",
                detail: error.message,
            },
        ]);
    }
};


export const showPermission = async (req, res) => {
    try {
        const permiso = await showPermissionService(req.params.id);

        if (!permiso) {
            return errorResponse(res, "Permiso no encontrado", 404, [
                {
                    code: "PERMISSION_NOT_FOUND",
                    detail: `No existe un permiso con id ${req.params.id}`,
                },
            ]);
        }

        return successResponse(
            res,
            {
                id: permiso.id,
                nombre: permiso.nombre,
                descripcion: permiso.descripcion,
                estado: permiso.estado,
            },
            200
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener el permiso", 500, [
            {
                code: "SHOW_PERMISSION_ERROR",
                detail: error.message,
            },
        ]);
    }
};

// export const changePermissionStatus = async (req, res) => {
//     try {
//         const permission = await changePermissionStatusService(req.params.id);

//         if (permission === "NOT_FOUND") {
//             return errorResponse(res, "Permiso no encontrado", 404, [
//                 {
//                     code: "PERMISSION_NOT_FOUND",
//                     detail: `No existe un permiso con id ${req.params.id}`,
//                 },
//             ]);
//         }

//         return successResponse(
//             res,
//             {
//                 id: permission.id,
//                 nombre: permission.nombre,
//                 descripcion: permission.descripcion,
//                 estado: permission.estado,
//             },
//             200
//         );
//     } catch (error) {
//         return errorResponse(res, "Error al cambiar el estado del permiso", 500, [
//             {
//                 code: "CHANGE_PERMISSION_STATUS_ERROR",
//                 detail: error.message,
//             },
//         ]);
//     }
// };

// export const crearPermisoController = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: 'Errores de validación',
//             errors: errors.array()
//         });
//     }

//     const { nombre, descripcion, estado } = req.body;

//     try {
//         const data = {
//             nombre,
//             descripcion,
//             estado: estado !== undefined ? estado : true
//         };

//         const nuevoPermiso = await crearPermiso(data);
//         return res.status(201).json({
//             success: true,
//             message: 'Permiso creado exitosamente',
//             data: nuevoPermiso
//         });
//     } catch (error) {
//         if (error.message.includes('Ya existe un permiso con este nombre')) {
//             return res.status(409).json({
//                 success: false,
//                 message: error.message
//             });
//         }
//         return res.status(500).json({
//             success: false,
//             message: 'Error interno del servidor',
//             error: error.message
//         });
//     }
// };

// export const editarPermisoController = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: 'Errores de validación',
//             errors: errors.array()
//         });
//     }

//     const { id } = req.params;
//     const { nombre, descripcion } = req.body;

//     try {
//         const data = {
//             nombre,
//             descripcion
//         };

//         // Filtrar campos vacíos o undefined
//         const dataLimpia = {};
//         Object.keys(data).forEach(key => {
//             if (data[key] !== undefined && data[key] !== '' && data[key] !== null) {
//                 dataLimpia[key] = data[key];
//             }
//         });

//         const permisoActualizado = await editarPermiso(parseInt(id), dataLimpia);

//         if (!permisoActualizado) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Permiso no encontrado'
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Permiso actualizado exitosamente',
//             data: permisoActualizado
//         });
//     } catch (error) {
//         console.error('Error al editar permiso:', error);

//         if (error.message.includes('Permiso no encontrado')) {
//             return res.status(404).json({
//                 success: false,
//                 message: error.message
//             });
//         }

//         if (error.message.includes('Errores de validación')) {
//             return res.status(400).json({
//                 success: false,
//                 message: error.message
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: 'Error interno del servidor',
//             error: error.message
//         });
//     }
// };

// export const obtenerTodosLosPermisosController = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, nombre, estado } = req.query;

//         const filters = {};
//         if (nombre) filters.nombre = nombre;
//         if (estado !== undefined) filters.estado = estado === 'true';

//         const permisos = await getAllPermisos(filters, Number(page), Number(limit));

//         if (!permisos || permisos.count === 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "No hay permisos disponibles",
//                 data: {
//                     permisos: [],
//                     totalPages: 0,
//                     currentPage: Number(page),
//                     totalItems: 0
//                 }
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Lista de permisos obtenida exitosamente",
//             data: permisos
//         });
//     } catch (error) {
//         console.error("Error al obtener permisos:", error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error interno del servidor',
//             error: error.message
//         });
//     }
// };

// export const cambiarEstadoPermisoController = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: 'Errores de validación',
//             errors: errors.array()
//         });
//     }

//     const { id } = req.params;
//     const { estado } = req.body;

//     try {
//         const permisoActualizado = await cambiarEstadoPermiso(parseInt(id), estado);

//         if (!permisoActualizado) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Permiso no encontrado'
//             });
//         }

//         const accion = estado ? 'activado' : 'desactivado';

//         return res.status(200).json({
//             success: true,
//             message: `Permiso ${accion} exitosamente`,
//             data: {
//                 id: permisoActualizado.id,
//                 nombre: permisoActualizado.nombre,
//                 estadoAnterior: !estado,
//                 estadoActual: permisoActualizado.estado
//             }
//         });
//     } catch (error) {
//         console.error('Error al cambiar estado del permiso:', error);

//         if (error.message.includes('Permiso no encontrado')) {
//             return res.status(404).json({
//                 success: false,
//                 message: error.message
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: 'Error interno del servidor',
//             error: error.message
//         });
//     }
// };

// export const obtenerPermisosPorModuloController = async (req, res) => {
//     const { modulo } = req.params;

//     try {
//         const permisos = await getPermisosPorModulo(modulo);

//         return res.status(200).json({
//             success: true,
//             message: `Permisos del módulo ${modulo} obtenidos exitosamente`,
//             data: permisos
//         });
//     } catch (error) {
//         console.error('Error al obtener permisos por módulo:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error interno del servidor',
//             error: error.message
//         });
//     }
// };