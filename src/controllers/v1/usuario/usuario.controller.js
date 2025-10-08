import {
    getUsuariosService,
    getListUsuariosService,
    storeUsuarioService,
    showUsuarioService,
    updateUsuarioService,
    changeUsuarioStatusService
} from "../../../services/v1/usuario.service.js";
import { successResponse, errorResponse } from "../../../utils/response.util.js";

/**
 * Controlador para obtener la lista paginada de usuarios con filtros opcionales.
 */
export const getUsuarios = async (req, res) => {
    try {
        const { data, meta, links } = await getUsuariosService(req);

        return successResponse(
            res,
            data,
            200,
            meta,
            links
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener los usuarios", 500, [
            {
                code: "GET_USUARIOS_ERROR",
                detail: error.message,
            },
        ]);
    }
};

/**
 * Controlador para obtener lista simplificada de usuarios (sin paginación)
 */
export const getListUsuarios = async (req, res) => {
    try {
        const { data, meta } = await getListUsuariosService(req);

        return successResponse(
            res,
            data,
            200,
            meta
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener la lista de usuarios", 500, [
            {
                code: "GET_LIST_USUARIOS_ERROR",
                detail: error.message,
            },
        ]);
    }
};

/**
 * Controlador para crear un nuevo usuario.
 */
export const storeUsuario = async (req, res) => {
    try {
        const data = req.body;
        const usuarioCreadorId = req.usuario ? req.usuario.id : null;
        const nuevoUsuario = await storeUsuarioService(data, usuarioCreadorId);

        return successResponse(
            res,
            nuevoUsuario,
            201,
            null,
            null,
            "Usuario creado exitosamente"
        );
    } catch (error) {
        // Manejar errores específicos
        if (error.message.includes("tipo de documento")) {
            return errorResponse(res, error.message, 400, [
                {
                    code: "INVALID_TIPO_DOCUMENTO",
                    detail: error.message,
                },
            ]);
        }

        if (error.message.includes("rol")) {
            return errorResponse(res, error.message, 400, [
                {
                    code: "INVALID_ROL",
                    detail: error.message,
                },
            ]);
        }

        if (error.message.includes("ya existe")) {
            return errorResponse(res, error.message, 409, [
                {
                    code: "DUPLICATE_USUARIO",
                    detail: error.message,
                },
            ]);
        }

        return errorResponse(res, "Error al crear el usuario", 500, [
            {
                code: "CREATE_USUARIO_ERROR",
                detail: error.message,
            },
        ]);
    }
};

/**
 * Controlador para obtener un usuario por ID.
 */
export const showUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await showUsuarioService(id);

        if (!usuario) {
            return errorResponse(res, "Usuario no encontrado", 404, [
                {
                    code: "USUARIO_NOT_FOUND",
                    detail: `No existe un usuario con ID ${id}`,
                },
            ]);
        }

        return successResponse(res, usuario, 200);
    } catch (error) {
        return errorResponse(res, "Error al obtener el usuario", 500, [
            {
                code: "GET_USUARIO_ERROR",
                detail: error.message,
            },
        ]);
    }
};

/**
 * Controlador para actualizar un usuario.
 */
export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const usuarioActualizado = await updateUsuarioService(id, data);

        return successResponse(
            res,
            usuarioActualizado,
            200,
            null,
            null,
            "Usuario actualizado exitosamente"
        );
    } catch (error) {
        if (error.message === "Usuario no encontrado") {
            return errorResponse(res, error.message, 404, [
                {
                    code: "USUARIO_NOT_FOUND",
                    detail: error.message,
                },
            ]);
        }

        if (error.message.includes("ya existe")) {
            return errorResponse(res, error.message, 409, [
                {
                    code: "DUPLICATE_FIELD",
                    detail: error.message,
                },
            ]);
        }

        if (error.message.includes("rol") || error.message.includes("tipo de documento")) {
            return errorResponse(res, error.message, 400, [
                {
                    code: "INVALID_DATA",
                    detail: error.message,
                },
            ]);
        }

        return errorResponse(res, "Error al actualizar el usuario", 500, [
            {
                code: "UPDATE_USUARIO_ERROR",
                detail: error.message,
            },
        ]);
    }
};

/**
 * Controlador para cambiar el estado de un usuario.
 */
export const changeUsuarioStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que se envió el estado
        if (typeof estado !== 'boolean') {
            return errorResponse(res, "El campo 'estado' es requerido y debe ser booleano", 400, [
                {
                    code: "INVALID_ESTADO",
                    detail: "El campo 'estado' debe ser true o false",
                },
            ]);
        }

        const usuarioActualizado = await changeUsuarioStatusService(id, estado);

        const mensaje = estado
            ? "Usuario activado exitosamente"
            : "Usuario desactivado exitosamente";

        return successResponse(
            res,
            usuarioActualizado,
            200,
            null,
            null,
            mensaje
        );
    } catch (error) {
        if (error.message === "Usuario no encontrado") {
            return errorResponse(res, error.message, 404, [
                {
                    code: "USUARIO_NOT_FOUND",
                    detail: error.message,
                },
            ]);
        }

        if (error.message.includes("ya está")) {
            return errorResponse(res, error.message, 400, [
                {
                    code: "ESTADO_UNCHANGED",
                    detail: error.message,
                },
            ]);
        }

        return errorResponse(res, "Error al cambiar el estado del usuario", 500, [
            {
                code: "CHANGE_ESTADO_ERROR",
                detail: error.message,
            },
        ]);
    }
};

// Mantener compatibilidad con nombres anteriores si es necesario
export const crearUsuario = storeUsuario;
export const obtenerUsuarioPorId = showUsuario;
export const editarUsuario = updateUsuario;
export const cambiarEstadoUsuario = changeUsuarioStatus;

