import { Op } from "sequelize";
import Centro from "../models/centro.model.js";
import Regional from "../models/regional.model.js";

/**
 * Repositorio para obtener centros con filtros, orden y paginación.
 */
export const getCentrosRepository = async ({
  id,
  regional_id,
  codigo,
  nombre,
  estado,
  search,
  sortBy = "nombre",
  order = "ASC",
  page = 1,
  limit = 10
}) => {
  const whereClause = {};

  if (id) {
    whereClause.id = { [Op.eq]: id };
  }

  if (regional_id) {
    whereClause.regional_id = { [Op.eq]: regional_id };
  }

  if (codigo) {
    whereClause.codigo = { [Op.like]: `%${codigo}%` };
  }

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  // Búsqueda global: buscar en múltiples campos
  if (search) {
    const searchUpper = search.toUpperCase().trim();
    
    whereClause[Op.or] = [
      { codigo: { [Op.like]: `%${searchUpper}%` } },
      { nombre: { [Op.like]: `%${search}%` } },
      { direccion: { [Op.like]: `%${search}%` } },
    ];
  } else {
    if (nombre) {
      whereClause.nombre = { [Op.like]: `%${nombre}%` };
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Centro.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Regional,
        as: 'regional',
        attributes: ['id', 'codigo', 'nombre'],
      }
    ],
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
 * Repositorio para la lista de centros.
 */
export const getListCentrosRepository = async (regional_id, activo, sortBy = "nombre", order = "ASC") => {
  const whereClause = {};

  if (regional_id) {
    whereClause.regional_id = { [Op.eq]: regional_id };
  }

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  const { count, rows } = await Centro.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Regional,
        as: 'regional',
        attributes: ['id', 'codigo', 'nombre'],
      }
    ],
    order: [[sortBy, order]],
    attributes: ['id', 'codigo', 'nombre', 'regional_id', 'estado'],
  });

  return {
    data: rows,
    count,
  };
};

/**
 * Buscar un centro por ID.
 */
export const showCentroRepository = async (id) => {
  return await Centro.findOne({
    where: { id },
    include: [
      {
        model: Regional,
        as: 'regional',
        attributes: ['id', 'codigo', 'nombre'],
      }
    ],
  });
};

/**
 * Buscar un centro por código y regional.
 */
export const findCentroByCodigoAndRegionalRepository = async (codigo, regional_id) => {
  return await Centro.findOne({
    where: { 
      codigo: codigo.toUpperCase(),
      regional_id: regional_id
    },
    attributes: ['id', 'codigo', 'nombre', 'regional_id', 'estado']
  });
};

/**
 * Buscar un centro por código y regional excluyendo un ID.
 */
export const findCentroByCodigoAndRegionalExcludingIdRepository = async (codigo, regional_id, idExcluir) => {
  return await Centro.findOne({
    where: {
      codigo: codigo.toUpperCase(),
      regional_id: regional_id,
      id: {
        [Op.ne]: idExcluir
      }
    },
    attributes: ['id', 'codigo', 'nombre', 'regional_id', 'estado']
  });
};

/**
 * Crear un nuevo centro.
 */
export const storeCentroRepository = async (data) => {
  return await Centro.create({
    ...data,
    codigo: data.codigo.toUpperCase()
  });
};

/**
 * Actualizar un centro por ID.
 */
export const updateCentroRepository = async (id, data) => {
  const centro = await Centro.findOne({ where: { id } });
  if (!centro) return null;

  // Agregar timestamp de actualización y convertir código a mayúsculas si se proporciona
  const updateData = {
    ...data,
    updated_at: new Date()
  };

  if (data.codigo) {
    updateData.codigo = data.codigo.toUpperCase();
  }

  await centro.update(updateData);
  await centro.reload({
    include: [
      {
        model: Regional,
        as: 'regional',
        attributes: ['id', 'codigo', 'nombre'],
      }
    ]
  });
  return centro;
};

/**
 * Verificar si existe un centro con el mismo ID.
 */
export const findCentroByIdRepository = async (id) => {
  return await Centro.findOne({
    where: { id },
    attributes: ['id', 'codigo', 'nombre', 'regional_id', 'estado']
  });
};

/**
 * Verificar si existe un centro con el mismo nombre en una regional.
 */
export const findCentroByNombreAndRegionalRepository = async (nombre, regional_id) => {
  return await Centro.findOne({
    where: {
      nombre: nombre,
      regional_id: regional_id,
      estado: true
    },
    attributes: ['id', 'codigo', 'nombre', 'regional_id', 'estado']
  });
};

/**
 * Verificar si existe un centro con el mismo nombre en una regional, excluyendo un ID específico.
 */
export const findCentroByNombreAndRegionalExcludingIdRepository = async (nombre, regional_id, idExcluir) => {
  return await Centro.findOne({
    where: {
      nombre: {
        [Op.like]: nombre
      },
      regional_id: regional_id,
      id: {
        [Op.ne]: idExcluir
      }
    },
    attributes: ['id', 'codigo', 'nombre', 'regional_id', 'estado']
  });
};

/**
 * Verificar si un centro tiene usuarios asociados.
 */
export const checkCentroHasUsuariosRepository = async (id) => {
  // TODO: Implementar cuando se cree la tabla usuario_centro
  // Por ahora retornamos false para permitir operaciones
  return false;
};

/**
 * Contar centros por regional.
 */
export const countCentrosByRegionalRepository = async (regional_id) => {
  return await Centro.count({
    where: { regional_id }
  });
};

