import { Op } from "sequelize";
import Rol from "../models/rol.model.js";
import Usuario from "../models/usuario.model.js";
import RolPermiso from "../models/rolPermiso.model.js";
import Permiso from "../models/permiso.model.js";

/**
 * Repositorio para obtener roles con filtros, orden y paginación.
 */
export const getRolesRepository = async ({
    id,
    nombre,
    descripcion,
    estado,
    search,
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

    // Búsqueda global: buscar en múltiples campos
    if (search) {
        whereClause[Op.or] = [
            { nombre: { [Op.like]: `%${search}%` } },
            { descripcion: { [Op.like]: `%${search}%` } },
        ];
    } else {
        if (nombre) {
            whereClause.nombre = { [Op.like]: `%${nombre}%` };
        }
        if (descripcion) {
            whereClause.descripcion = { [Op.like]: `%${descripcion}%` };
        }
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Rol.findAndCountAll({
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
 * Repositorio para la lista de roles.
 */
export const getListRolesRepository = async (estado, sortBy = "nombre", order = "ASC") => {
    const whereClause = {};

    if (estado !== undefined) {
        whereClause.estado = { [Op.eq]: estado };
    }

    const roles = await Rol.findAll({
        where: whereClause,
        order: [[sortBy, order]],
        attributes: ['id', 'nombre', 'descripcion', 'estado', 'created_at', 'updated_at'],
    });

    return {
        data: roles,
        count: roles.length,
    };
};

/**
 * Buscar un rol por nombre.
 */
export const findRolByNombreRepository = async (nombre) => {
    return await Rol.findOne({
        where: { 
            nombre: nombre
        },
        attributes: ['id', 'nombre', 'descripcion', 'estado']
    });
};

/**
 * Buscar un rol por nombre excluyendo un ID.
 */
export const findRolByNombreExcludingIdRepository = async (nombre, idExcluir) => {
    return await Rol.findOne({
        where: {
            nombre: {
                [Op.like]: nombre
            },
            id: {
                [Op.ne]: idExcluir
            }
        },
        attributes: ['id', 'nombre', 'descripcion', 'estado']
    });
};

/**
 * Buscar rol por nombre (legacy - mantener compatibilidad).
 */
export const getRoleByNameRepository = async (nombre) => {
    return await Rol.findOne({
        where: {
            nombre,
        },
    });
}

/**
 * Buscar un rol por ID.
 */
export const findRolByIdRepository = async (id) => {
    return await Rol.findOne({
        where: { id },
        attributes: ['id', 'nombre', 'descripcion', 'estado']
    });
};

/**
 * Crear un nuevo rol.
 */
export const storeRoleRepository = async (data) => {
    return await Rol.create({
        nombre: data.nombre.trim(),
        descripcion: data.descripcion ? data.descripcion.trim() : null,
        estado: data.estado !== undefined ? data.estado : true,
    });
};

/**
 * Buscar un rol por id.
 */
export const showRoleRepository = async (id) => {
    return await Rol.findByPk(id, {
        include: [
            {
                model: Permiso,
                as: 'permisos',
                attributes: ['id', 'nombre', 'descripcion'],
                required: false,
                through: { attributes: [] }
            }
        ]
    });
};

/**
 * Actualizar un rol por ID.
 */
export const updateRoleRepository = async (id, data) => {
    const rol = await Rol.findOne({ where: { id } });
    if (!rol) return null;

    // Agregar timestamp de actualización
    const updateData = {
        ...data,
        updated_at: new Date()
    };

    if (updateData.nombre) {
        updateData.nombre = updateData.nombre.trim();
    }

    if (updateData.descripcion !== undefined && updateData.descripcion) {
        updateData.descripcion = updateData.descripcion.trim();
    }

    await rol.update(updateData);
    await rol.reload();
    return rol;
};

/**
 * Eliminar un rol.
 */
export const deleteRoleRepository = async (id) => {
    const rol = await Rol.findByPk(id);
    if (rol) {
        await rol.destroy();
    }
};

/**
 * Contar usuarios por rol.
 */
export const countUsuariosByRolRepository = async (id) => {
    return await Usuario.count({
        where: { rol_id: id }
    });
};

/**
 * Verificar si un rol tiene usuarios asociados.
 */
export const checkRoleHasUsersRepository = async (id) => {
    const count = await countUsuariosByRolRepository(id);
    return count > 0;
};

/**
 * Contar permisos asociados a un rol.
 */
export const countPermisosByRolRepository = async (rolId) => {
    return await RolPermiso.count({
        where: { rol_id: rolId }
    });
};

/**
 * Verificar si un rol tiene permisos asociados.
 */
export const checkRoleHasPermisosRepository = async (rolId) => {
    const count = await countPermisosByRolRepository(rolId);
    return count > 0;
};

/**
 * Asociar permisos a un rol (sobrescribe los existentes).
 * Valida que se asocie al menos 1 permiso.
 */
export const setPermisosToRol = async (rolId, permisosIds = []) => {
    // Validar que se proporcione al menos un permiso
    if (!permisosIds || permisosIds.length === 0) {
        const error = new Error("Un rol debe tener al menos 1 permiso asociado");
        error.code = "ROLE_NEEDS_PERMISSION";
        throw error;
    }

    // Validar que los IDs de permisos existan
    const permisos = await Permiso.findAll({
        where: { id: permisosIds }
    });
    
    if (permisos.length === 0) {
        const error = new Error("No se encontraron permisos válidos con los IDs proporcionados");
        error.code = "INVALID_PERMISSION_IDS";
        throw error;
    }

    const validPermisosIds = permisos.map(p => p.id);

    // Elimina las asociaciones actuales
    await RolPermiso.destroy({ where: { rol_id: rolId } });

    // Crea las nuevas asociaciones
    const bulkData = validPermisosIds.map(permisoId => ({
        rol_id: rolId,
        permiso_id: permisoId
    }));
    
    await RolPermiso.bulkCreate(bulkData);
    
    return validPermisosIds.length;
};