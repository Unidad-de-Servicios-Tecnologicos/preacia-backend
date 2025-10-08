import { Op } from "sequelize";
import Regional from "../models/regional.model.js";

/**
 * Repositorio para obtener regionales con filtros, orden y paginación.
 */
export const getRegionalesRepository = async ({
  id,
  codigo,
  nombre,
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

  const { count, rows } = await Regional.findAndCountAll({
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
 * Repositorio para la lista de regionales.
 */
export const getListRegionalesRepository = async (activo, sortBy = "nombre", order = "ASC") => {
  const whereClause = {};

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  const { count, rows } = await Regional.findAndCountAll({
    where: whereClause,
    order: [[sortBy, order]],
    attributes: ['id', 'codigo', 'nombre', 'estado'],
  });

  return {
    data: rows,
    count,
  };
};

/**
 * Buscar una regional por ID.
 */
export const showRegionalRepository = async (id) => {
  return await Regional.findOne({
    where: { id },
  });
};

/**
 * Buscar una regional por código.
 */
export const findRegionalByCodigoRepository = async (codigo) => {
  return await Regional.findOne({
    where: { 
      codigo: codigo.toUpperCase()
    },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Buscar una regional por código excluyendo un ID.
 */
export const findRegionalByCodigoExcludingIdRepository = async (codigo, idExcluir) => {
  return await Regional.findOne({
    where: {
      codigo: codigo.toUpperCase(),
      id: {
        [Op.ne]: idExcluir
      }
    },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Crear una nueva regional.
 */
export const storeRegionalRepository = async (data) => {
  return await Regional.create({
    ...data,
    codigo: data.codigo.toUpperCase()
  });
};

/**
 * Actualizar una regional por ID.
 */
export const updateRegionalRepository = async (id, data) => {
  const regional = await Regional.findOne({ where: { id } });
  if (!regional) return null;

  // Agregar timestamp de actualización y convertir código a mayúsculas si se proporciona
  const updateData = {
    ...data,
    updated_at: new Date()
  };

  if (data.codigo) {
    updateData.codigo = data.codigo.toUpperCase();
  }

  await regional.update(updateData);
  await regional.reload();
  return regional;
};

/**
 * Verificar si existe una regional con el mismo ID.
 */
export const findRegionalByIdRepository = async (id) => {
  return await Regional.findOne({
    where: { id },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Verificar si existe una regional con el mismo nombre.
 */
export const findRegionalByNombreRepository = async (nombre) => {
  return await Regional.findOne({
    where: {
      nombre: nombre,
      estado: true
    },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Verificar si existe una regional con el mismo nombre, excluyendo un ID específico.
 */
export const findRegionalByNombreExcludingIdRepository = async (nombre, idExcluir) => {
  return await Regional.findOne({
    where: {
      nombre: {
        [Op.like]: nombre
      },
      id: {
        [Op.ne]: idExcluir
      }
    },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Verificar si una regional tiene centros asociados.
 */
export const checkRegionalHasCentrosRepository = async (id) => {
  const { countCentrosByRegionalRepository } = await import("./centro.repository.js");
  const count = await countCentrosByRegionalRepository(id);
  return count > 0;
};

