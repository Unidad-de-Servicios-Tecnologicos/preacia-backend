import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import { getUsersService, showUserService, updateUserService, toggleUserStatusService } from "../../../services/v1/usuario.service.js";
import { getRoleByNameRepository } from "../../../repositories/rol.repository.js";

/**
 * Controlador para obtener usuarios con filtros, orden y paginación usando servicios.
 */
export const getUsers = async (req, res) => {
    try {
        const { data, meta, links } = await getUsersService(req);

        // Incluye los campos relevantes del usuario y el rol asociado
        return successResponse(
            res,
            formatJsonApiData(
                data,
                [
                    "id",
                    "documento",
                    "nombres",
                    "apellidos",
                    "nombre_usuario",
                    "correo",
                    "telefono",
                    "estado",
                    "rol",
                    "centros" // Incluye la relación de centros
                ]
            ),
            200,
            meta,
            links
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener los usuarios", 500, [
            {
                code: "GET_USERS_ERROR",
                detail: error.message,
            },
        ]);
    }
};

export const showUser = async (req, res) => {
    try {
        const user = await showUserService(req.params.id);

        if (!user) {
            return errorResponse(res, "No existe un usuario con id", 404, [
                {
                    code: "USER_NOT_FOUND",
                    detail: `No existe un usuario con id ${req.params.id}`,
                },
            ]);
        }

        return successResponse(
            res,
            {
                id: user.id,
                documento: user.documento,
                nombres: user.nombres,
                apellidos: user.apellidos,
                nombre_usuario: user.nombre_usuario,
                correo: user.correo,
                telefono: user.telefono,
                estado: user.estado,
                rol: user.rol
                    ? {
                        id: user.rol.id,
                        nombre: user.rol.nombre
                    }
                    : null
            },
            200
        );
    } catch (error) {
        return errorResponse(res, "Error al obtener el usuario", 500, [
            {
                code: "SHOW_USER_ERROR",
                detail: error.message,
            },
        ]);
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { documento, nombres, apellidos, correo, telefono, nombre_usuario, rol_nombre, centro_id } = req.body;

        // Buscar el usuario
        const user = await showUserService(id);
        if (!user) {
            return errorResponse(res, "No existe un usuario con id", 404, [
                {
                    code: "USER_NOT_FOUND",
                    detail: `No existe un usuario con id ${id}`,
                },
            ]);
        }

        // Buscar el rol si se proporciona
        let rolId = user.rol_id; // Mantener el rol actual por defecto
        if (rol_nombre && rol_nombre.trim() !== '') {
            const rol = await getRoleByNameRepository(rol_nombre.trim());
            if (!rol) {
                return errorResponse(res, "El rol especificado no existe", 400, [
                    {
                        code: "ROLE_NOT_FOUND",
                        detail: `No existe el rol "${rol_nombre}"`,
                    },
                ]);
            }
            rolId = rol.id;
        }

        // Actualizar el usuario
        const updatedUser = await updateUserService(id, {
            documento,
            nombres,
            apellidos,
            correo,
            telefono,
            nombre_usuario,
            rol_id: rolId,
            centro_id
        });

        if (!updatedUser) {
            return errorResponse(res, "Error al actualizar el usuario", 500, [
                {
                    code: "USER_UPDATE_ERROR",
                    detail: "No se pudo actualizar el usuario",
                },
            ]);
        }

        return successResponse(
            res,
            {
                id: updatedUser.id,
                documento: updatedUser.documento,
                nombres: updatedUser.nombres,
                apellidos: updatedUser.apellidos,
                nombre_usuario: updatedUser.nombre_usuario,
                correo: updatedUser.correo,
                telefono: updatedUser.telefono,
                estado: updatedUser.estado,
                rol: updatedUser.rol
                    ? {
                        id: updatedUser.rol.id,
                        nombre: updatedUser.rol.nombre
                    }
                    : null
            },
            200
        );
    } catch (error) {
        return errorResponse(res, "Error al actualizar el usuario", 500, [
            {
                code: "UPDATE_USER_ERROR",
                detail: error.message,
            },
        ]);
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea un booleano
        if (typeof estado !== 'boolean') {
            return errorResponse(res, "El estado debe ser un valor booleano", 400, [
                {
                    code: "INVALID_STATUS",
                    detail: "El campo 'estado' debe ser true o false",
                },
            ]);
        }

        // Buscar el usuario
        const user = await showUserService(id);
        if (!user) {
            return errorResponse(res, "No existe un usuario con id", 404, [
                {
                    code: "USER_NOT_FOUND",
                    detail: `No existe un usuario con id ${id}`,
                },
            ]);
        }

        // Cambiar el estado del usuario
        const updatedUser = await toggleUserStatusService(id, estado);

        if (!updatedUser) {
            return errorResponse(res, "Error al cambiar el estado del usuario", 500, [
                {
                    code: "USER_STATUS_UPDATE_ERROR",
                    detail: "No se pudo cambiar el estado del usuario",
                },
            ]);
        }

        return successResponse(
            res,
            {
                id: updatedUser.id,
                documento: updatedUser.documento,
                nombres: updatedUser.nombres,
                apellidos: updatedUser.apellidos,
                nombre_usuario: updatedUser.nombre_usuario,
                correo: updatedUser.correo,
                telefono: updatedUser.telefono,
                estado: updatedUser.estado,
                rol: updatedUser.rol
                    ? {
                        id: updatedUser.rol.id,
                        nombre: updatedUser.rol.nombre
                    }
                    : null
            },
            200,
            null,
            null,
            `Estado del usuario ${updatedUser.nombres} ${updatedUser.apellidos} cambiado a ${updatedUser.estado ? 'activo' : 'inactivo'} correctamente`
        );
    } catch (error) {
        return errorResponse(res, "Error al cambiar el estado del usuario", 500, [
            {
                code: "TOGGLE_USER_STATUS_ERROR",
                detail: error.message,
            },
        ]);
    }
};