import { Op } from "sequelize";
import Permiso from "../models/permisos.model.js";

/**
 * Repositorio para obtener permisos con filtros, orden y paginación.
 */
export const getPermissionsRepository = async ({
    id,
    nombre,
    descripcion,
    estado,
    search, // Nuevo parámetro para búsqueda global
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
}) => {
    const whereClause = {};

    if (id) {
        whereClause.id = { [Op.eq]: id };
    }

    if (estado !== undefined) {
        whereClause.estado = { [Op.eq]: estado };
    }

    // Búsqueda global: buscar en múltiples campos y formatos
    if (search) {
        // Convertir el término de búsqueda a snake_case para coincidir con la BD
        const searchSnakeCase = search
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
            .replace(/[^a-z0-9_]/g, ''); // Eliminar caracteres especiales excepto guiones bajos

        whereClause[Op.or] = [
            { nombre: { [Op.like]: `%${search}%` } }, // Búsqueda original
            { nombre: { [Op.like]: `%${searchSnakeCase}%` } }, // Búsqueda en formato snake_case
            { descripcion: { [Op.like]: `%${search}%` } }
        ];
    } else {
        // Solo aplicar filtros específicos si no hay búsqueda global
        if (nombre) {
            whereClause.nombre = { [Op.like]: `%${nombre}%` };
        }
        if (descripcion) {
            whereClause.descripcion = { [Op.like]: `%${descripcion}%` };
        }
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Permiso.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order]],
        limit: parseInt(limit),
        offset: parseInt(offset),
    });

    return {
        data: rows,
        count,
    };
};

/**
 * Repositorio para la lista de permisos.
 */
export const getListPermissionsRepository = async (estado, sortBy = "id", order = "ASC") => {
    const whereClause = {};

    if (estado !== undefined) {
        whereClause.estado = { [Op.eq]: estado };
    }

    const { count, rows } = await Permiso.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order]],
    });

    return {
        data: rows,
        count,
    };
};

/**
 * Buscar un permiso por id.
 */
export const showPermissionRepository = async (id) => {
    return await Permiso.findByPk(id);
};