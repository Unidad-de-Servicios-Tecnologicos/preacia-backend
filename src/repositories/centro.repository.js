import { Op } from "sequelize";
import Centro from "../models/centro.model.js";
//import Regional from "../models/regional.model.js";
// import Ciudad from "../models/ciudad.model.js";
// import Provincia from "../models/provincia.model.js";
// import Supervisor from "../models/supervisor.model.js";
//import Area from "../models/area.model.js";

/**
 * Repositorio para obtener centros con filtros, orden y paginación.
 */
export const getCentrosRepository = async ({
    id,
    codigo,
    nombre,
    direccion,
    // ciudad_id,
    // regional_id,
    // supervisores_id,
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

    // if (ciudad_id) {
    //     whereClause.ciudad_id = { [Op.eq]: ciudad_id };
    // }
    // if (regional_id) {
    //     whereClause.regional_id = { [Op.eq]: regional_id };
    // }
    // if (supervisores_id) {
    //     whereClause.supervisores_id = { [Op.eq]: supervisores_id };
    // }
    if (estado !== undefined) {
        whereClause.estado = { [Op.eq]: estado };
    }

    // Búsqueda global: buscar en múltiples campos y formatos
    if (search) {
        // Convertir el término de búsqueda a snake_case para coincidir con códigos
        const searchSnakeCase = search
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        whereClause[Op.or] = [
            { codigo: { [Op.like]: `%${search}%` } },
            { codigo: { [Op.like]: `%${searchSnakeCase}%` } },
            { nombre: { [Op.like]: `%${search}%` } },
            { direccion: { [Op.like]: `%${search}%` } }
        ];
    } else {
        // Solo aplicar filtros específicos si no hay búsqueda global
        if (codigo) {
            whereClause.codigo = { [Op.eq]: codigo };
        }
        if (nombre) {
            whereClause.nombre = { [Op.like]: `%${nombre}%` };
        }
        if (direccion) {
            whereClause.direccion = { [Op.like]: `%${direccion}%` };
        }
    }

    const offset = (page - 1) * limit;

    // const { count, rows } = await Centro.findAndCountAll({
    //     where: whereClause,
    //     include: [
    //         {
    //             model: Regional,
    //             as: 'regional',
    //             attributes: ['id', 'nombre']
    //         },
    //         {
    //             model: Ciudad,
    //             as: 'ciudad',
    //             attributes: ['id', 'nombre'],
    //             include: [
    //                 {
    //                     model: Provincia,
    //                     as: 'provincia',
    //                     attributes: ['id', 'nombre']
    //                 }
    //             ]
    //         },
    //         {
    //             model: Supervisor,
    //             as: 'supervisor',
    //             attributes: ['id', 'nombres', 'apellidos']
    //         }
    //     ],
    //     order: [[sortBy, order]],
    //     limit: parseInt(limit),
    //     offset: parseInt(offset),
    // });

    return {
        data: rows,
        count,
    };
};

/**
 * Repositorio para la lista de centros.
 */
export const getListCentrosRepository = async (estado, sortBy = "id", order = "ASC", centro_filtro = null) => {
    const whereClause = {};

    if (estado !== undefined) {
        whereClause.estado = { [Op.eq]: estado };
    }

    // Aplicar filtro por centro específico (admin ve solo su centro)
    if (centro_filtro) {
        whereClause.id = { [Op.eq]: parseInt(centro_filtro) };
    }

    const { count, rows } = await Centro.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order]],
    });

    return {
        data: rows,
        count,
    };
};

/**
 * Buscar un centro por código.
 */
export const showCentroRepository = async (code) => {
    return await Centro.findOne({
        where: { codigo: code },
    });
};

/**
 * Crear un nuevo centro.
 */
export const storeCentroRepository = async (data) => {
    return await Centro.create(data);
};

/**
 * Actualizar un centro por código.
 */
export const updateCentroRepository = async (code, data) => {
    const centro = await Centro.findOne({ where: { codigo: code } });
    if (!centro) return null;

    // Agregar timestamp de actualización
    const updateData = {
        ...data,
        updated_at: new Date()
    };

    await centro.update(updateData);
    await centro.reload();
    return centro;
};



/**
 * Verificar si existe un centro con el mismo código.
 */
export const findCentroByCodigoRepository = async (codigo) => {
    return await Centro.findOne({
        where: { codigo },
        attributes: ['id', 'codigo', 'nombre']
    });
};

/**
 * Verificar si existe un centro con el mismo nombre.
 */
export const findCentroByNombreRepository = async (nombre) => {
    return await Centro.findOne({
        where: {
            nombre: {
                [Op.like]: nombre
            }
        },
        attributes: ['id', 'codigo', 'nombre']
    });
};

/**
 * Verificar si existe un centro con el mismo nombre, excluyendo un código específico.
 */
export const findCentroByNombreExcludingCodigoRepository = async (nombre, codigoExcluir) => {
    return await Centro.findOne({
        where: {
            nombre: {
                [Op.like]: nombre
            },
            codigo: {
                [Op.ne]: codigoExcluir
            }
        },
        attributes: ['id', 'codigo', 'nombre']
    });
};

// /**
//  * Obtener las áreas asociadas a un centro por su ID.
//  */
/**
 * Obtener las áreas asociadas a un centro por su ID.
 *
 * Esta implementación intenta resolver el modelo `Area` a través de
 * `Centro.sequelize.models.Area`. Si no existe el modelo `Area` en la
 * instancia de Sequelize, la función devuelve null para indicar que la
 * relación no está disponible en esta instalación.
 */
export const getAreasByCentroRepository = async (centroId) => {
    // Intentar obtener el modelo Area desde la instancia de Sequelize registrada
    const AreaModel = Centro && Centro.sequelize && Centro.sequelize.models && Centro.sequelize.models.Area ? Centro.sequelize.models.Area : null;

    if (!AreaModel) {
        // No hay modelo Area definido en este proyecto: retornar null para
        // que el controlador pueda responder con 404 o mensaje apropiado.
        return null;
    }

    const centro = await Centro.findByPk(centroId, {
        include: [
            {
                model: AreaModel,
                as: 'areas',
                through: { attributes: [] },
            },
        ],
    });

    if (!centro) return null;
    return centro.areas;
};
