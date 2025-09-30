import { Op } from "sequelize";
import Rol from "../models/rol.model.js";
import Usuario from "../models/usuario.model.js";
import RolPermiso from "../models/rol_permiso.model.js";
import Permiso from "../models/permiso.model.js";

/**
 * Repositorio para obtener roles con filtros, orden y paginación.
 */
export const getRolesRepository = async ({
    id,
    nombre,
    descripcion,
    estado,
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
}) => {
    const where = {};
    if (id) where.id = id;
    if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
    if (descripcion) where.descripcion = { [Op.like]: `%${descripcion}%` };
    if (estado !== undefined) where.estado = estado;

    const allowedSort = ["id", "nombre", "descripcion", "estado", "created_at"];
    const orderBy = allowedSort.includes(sortBy) ? sortBy : "id";
    const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Primero obtenemos el total sin las relaciones para count correcto
    const totalCount = await Rol.count({ where });

    // Luego obtenemos los roles con las relaciones
    const roles = await Rol.findAll({
        where,
        include: [
            {
                model: Usuario,
                as: 'usuarios',
                attributes: ['id'],
                required: false,
            },
            {
                model: Permiso,
                as: 'permisos',
                attributes: ['id', 'nombre'],
                required: false,
                through: { attributes: [] }
            }
        ],
        order: [[orderBy, orderDirection]],
        limit: parseInt(limit),
        offset,
    });

    // Formatear los datos con las cantidades calculadas
    const formattedRoles = roles.map(rol => {
        const rolData = rol.toJSON();
        return {
            id: rolData.id,
            nombre: rolData.nombre,
            descripcion: rolData.descripcion,
            estado: rolData.estado,
            created_at: rolData.created_at,
            cantidadUsuarios: rolData.usuarios ? rolData.usuarios.length : 0,
            cantidadPermisos: rolData.permisos ? rolData.permisos.length : 0,
            permisos: rolData.permisos || [],
            usuarios: rolData.usuarios || []
        };
    });

    return { data: formattedRoles, count: totalCount };
};

/**
 * Repositorio para la lista de roles.
 */
export const getListRolesRepository = async (estado, sortBy = "id", order = "ASC") => {
    const where = {};
    if (estado !== undefined) where.estado = estado;

    const allowedSort = ["id", "nombre", "descripcion", "estado"];
    const orderBy = allowedSort.includes(sortBy) ? sortBy : "id";
    const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const roles = await Rol.findAll({
        attributes: ["id", "nombre", "descripcion", "estado"],
        where,
        order: [[orderBy, orderDirection]],
    });
    return { data: roles, count: roles.length };
};


export const getRoleByNameRepository = async (nombre) => {
    return await Rol.findOne({
        where: {
            nombre,
        },
    });
}

/**
 * Crear un nuevo rol.
 */
export const storeRoleRepository = async (data) => {
    return await Rol.create({
        nombre: data.nombre.trim(),
        descripcion: data.descripcion ? data.descripcion.trim() : 'no registra',
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
 * Actualizar un rol.
 */
export const updateRoleRepository = async (id, data) => {
    const rol = await Rol.findByPk(id);
    if (!rol) return null;
    rol.nombre = data.nombre ? data.nombre.trim() : rol.nombre;
    rol.descripcion = data.descripcion !== undefined ? data.descripcion.trim() : rol.descripcion;
    rol.estado = data.estado !== undefined ? data.estado : rol.estado;
    await rol.save();
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
 * Verificar si un rol tiene usuarios asociados.
 */
export const checkRoleHasUsersRepository = async (id) => {
    const count = await Usuario.count({
        where: { rol_id: id }
    });
    return count > 0;
};

/**
 * Asociar permisos a un rol (sobrescribe los existentes)
 */
export const setPermisosToRol = async (rolId, permisosIds = []) => {
    // Validar que los IDs de permisos existan
    const permisos = await Permiso.findAll({
        where: { id: permisosIds }
    });
    const validPermisosIds = permisos.map(p => p.id);

    // Elimina las asociaciones actuales
    await RolPermiso.destroy({ where: { rol_id: rolId } });

    // Crea las nuevas asociaciones
    const bulkData = validPermisosIds.map(permisoId => ({
        rol_id: rolId,
        permiso_id: permisoId
    }));
    if (bulkData.length > 0) {
        await RolPermiso.bulkCreate(bulkData);
    }
};