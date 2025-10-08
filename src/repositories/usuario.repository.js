import { Op } from 'sequelize';
import Usuario from '../models/usuario.model.js';
import Rol from '../models/rol.model.js';
import Permiso from '../models/permiso.model.js'; // Asegúrate de tener este modelo creado y exportado

/**
 * Valida si un campo específico ya existe en la base de datos
 * @param {string} campo - El nombre del campo a validar
 * @param {string} valor - El valor a validar
 * @param {number} usuarioId - ID del usuario actual para excluir de la validación
 * @returns {boolean} - true si el campo está disponible, false si ya existe
 */
export const validateUniqueField = async (campo, valor, usuarioId = null) => {
    const whereClause = { [campo]: valor };

    // Si se proporciona un ID de usuario, excluirlo de la búsqueda
    if (usuarioId) {
        whereClause.id = {
            [Op.ne]: usuarioId
        };
    }

    try {
        const existingUser = await Usuario.findOne({
            where: whereClause,
            attributes: ['id', campo] // Solo obtener los campos necesarios
        });

        // Retorna true si NO existe (disponible), false si ya existe
        return !existingUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Repositorio para obtener usuarios con filtros, orden y paginación.
 */
export const getUsersRepository = async ({
    id,
    documento,
    nombres,
    apellidos,
    correo,
    telefono,
    estado,
    rol_nombre, // Nuevo parámetro para buscar por nombre de rol
    search, // Nuevo parámetro para búsqueda global
    centro_id, // Nuevo parámetro para filtrar por centro
    centro_filtro, // Parámetro para filtrado global desde middleware
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
}) => {
    const where = {};
    if (id) where.id = id;
    if (documento) where.documento = { [Op.like]: `%${documento}%` };
    if (nombres) where.nombres = { [Op.like]: `%${nombres}%` };
    if (apellidos) where.apellidos = { [Op.like]: `%${apellidos}%` };
    if (correo) where.correo = { [Op.like]: `%${correo}%` };
    if (telefono) where.telefono = { [Op.like]: `%${telefono}%` };

    // Filtro de estado
    if (estado !== undefined) {
        where.estado = estado;
    }

    // Búsqueda global: buscar en múltiples campos
    if (search) {
        where[Op.or] = [
            { documento: { [Op.like]: `%${search}%` } },
            { nombres: { [Op.like]: `%${search}%` } },
            { apellidos: { [Op.like]: `%${search}%` } },
            { correo: { [Op.like]: `%${search}%` } },
            { telefono: { [Op.like]: `%${search}%` } }
        ];
    }

    const allowedSort = [
        "id", "documento", "nombres", "apellidos", "correo", "telefono", "direccion", "estado"
    ];
    const orderBy = allowedSort.includes(sortBy) ? sortBy : "id";
    const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Include para relación N:M con roles
    let include = [
        {
            model: Rol,
            as: 'roles',
            attributes: ['id', 'nombre'],
            through: { 
                attributes: ['estado'],
                where: { estado: true }
            },
            where: rol_nombre
                ? { nombre: { [Op.like]: `%${rol_nombre}%` } }
                : undefined
        }
    ];


    const queryOptions = {
        where,
        order: [[orderBy, orderDirection]],
        include
    };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = offset;

    const { rows, count } = await Usuario.findAndCountAll(queryOptions);

    return { data: rows, count };
};

export const findUsuarioById = async (id) => {
    return await Usuario.findByPk(id, {
        include: [
            {
                model: Rol,
                as: 'roles',
                attributes: ['id', 'nombre'],
                through: { 
                    attributes: ['estado'],
                    where: { estado: true }
                }
            },
            {
                association: 'centros',
                attributes: ['id', 'nombre', 'codigo'],
                through: { 
                    attributes: ['estado'],
                    where: { estado: true }
                }
            }
        ]
    });
};


/**
 * Busca un usuario por correo.
 */
export const findUserByEmail = async (correo) => {
    return await Usuario.findOne({
        where: { correo }
    });
};


/**
 * Obtiene los permisos asociados a un usuario por su ID.
 * Retorna un array de permisos.
 */
export const findPermisosByUsuarioId = async (usuarioId) => {
    const usuario = await Usuario.findByPk(usuarioId, {
        include: [
            {
                model: Permiso,
                as: 'permisos', // Permisos directos del usuario
                attributes: ['id', 'nombre', 'descripcion'],
                through: { attributes: [] }
            },
            {
                model: Rol,
                as: 'roles', // Múltiples roles
                attributes: ['id', 'nombre'],
                through: { 
                    attributes: [],
                    where: { estado: true }
                },
                include: [
                    {
                        model: Permiso,
                        as: 'permisos', // Permisos asociados a cada rol
                        attributes: ['id', 'nombre', 'descripcion'],
                        through: { attributes: [] }
                    }
                ]
            }
        ]
    });

    // Permisos directos del usuario
    const permisosUsuario = usuario?.permisos || [];
    
    // Permisos de todos los roles del usuario
    const permisosRoles = [];
    if (usuario?.roles) {
        usuario.roles.forEach(rol => {
            if (rol.permisos) {
                permisosRoles.push(...rol.permisos);
            }
        });
    }

    // Unifica y elimina duplicados por id
    const permisosMap = new Map();
    [...permisosUsuario, ...permisosRoles].forEach(permiso => {
        permisosMap.set(permiso.id, permiso);
    });

    return Array.from(permisosMap.values());
};

/**
 * Actualiza los datos de un usuario por su ID
 * @param {number} usuarioId - ID del usuario a actualizar
 * @param {object} updateData - Datos a actualizar
 * @returns {Promise<Usuario>} - Usuario actualizado
 */
export const updateUsuario = async (usuarioId, updateData) => {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    // Actualizar solo los campos que se proporcionaron
    const updatedUser = await usuario.update(updateData);

    // Retornar el usuario actualizado con los roles incluidos
    return await Usuario.findByPk(usuarioId, {
        include: [
            {
                model: Rol,
                as: 'roles',
                attributes: ['id', 'nombre'],
                through: { 
                    attributes: ['estado'],
                    where: { estado: true }
                }
            }
        ]
    });
};
