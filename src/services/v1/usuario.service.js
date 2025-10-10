import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getUsersRepository,
    findUsuarioById
} from "../../repositories/usuario.repository.js";

/**
 * Servicio para obtener usuarios con filtros, orden y paginación usando el repositorio.
 * @param {Request} req
 * @returns {Promise<Object>}
 */
export const getUsersService = async (req) => {
    const {
        id,
        documento,
        nombres,
        apellidos,
        nombre_usuario,
        correo,
        telefono,
        estado,
        rol_nombre,
        search, // Nuevo parámetro para búsqueda global
        centro_id, // Aseguramos que se recibe el parámetro centro_id
        sortBy = "id",
        order = "ASC",
        page = 1,
        limit = 10
    } = req.query;

    // Obtener centro_filtro desde el middleware
    const centro_filtro = req.centro_filtro || null;

    // Convertir string a boolean si es necesario
    let estadoBoolean = estado;
    if (typeof estado === 'string') {
        if (estado === 'true') {
            estadoBoolean = true;
        } else if (estado === 'false') {
            estadoBoolean = false;
        }
    }

    // Lógica de filtros y paginación delegada al repositorio
    const { data, count } = await getUsersRepository({
        id,
        documento,
        nombres,
        apellidos,
        nombre_usuario,
        correo,
        telefono,
        estado: estadoBoolean, // Usar el valor convertido
        rol_nombre,
        search, // Pasar el parámetro de búsqueda
        centro_id, // Pasar el parámetro centro_id para filtrar por centro
        centro_filtro, // Agregar el filtro desde el middleware
        sortBy,
        order,
        page,
        limit
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const queryWithoutPage = Object.entries({ ...req.query, page: undefined })
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");

    const { meta, links } = buildPagination({
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        baseUrl,
        queryWithoutPage,
    });
    return {
        data,
        count,
        meta,
        links
    };
};

/**
 * Servicio para mostrar un usuario por id.
 */
export const showUserService = async (id) => {
    return await findUsuarioById(id);
};

/**
 * Servicio para actualizar un usuario por id.
 */
export const updateUserService = async (id, userData) => {
    try {
        const user = await findUsuarioById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Actualizar los campos del usuario
        await user.update(userData);

        // Si se envía centro_id, actualizar la relación N:M
        if (userData.centro_id) {
            await user.setCentros([userData.centro_id]);
        }

        // Recargar el usuario con las relaciones
        await user.reload({
            include: [
                { association: 'rol', attributes: ['id', 'nombre'] },
                { association: 'centros', attributes: ['id', 'nombre', 'codigo'], through: { attributes: [] } }
            ]
        });

        return user;
    } catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

/**
 * Servicio para cambiar el estado de un usuario (activar/desactivar).
 */
export const toggleUserStatusService = async (id, newStatus) => {
    try {
        const user = await findUsuarioById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Actualizar solo el estado del usuario
        await user.update({ estado: newStatus });

        // Recargar el usuario con las relaciones
        await user.reload({
            include: [{
                association: 'rol',
                attributes: ['id', 'nombre']
            }]
        });

        return user;
    } catch (error) {
        throw new Error(`Error al cambiar estado del usuario: ${error.message}`);
    }
};
