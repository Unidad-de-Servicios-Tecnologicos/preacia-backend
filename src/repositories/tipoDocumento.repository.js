import { Op } from "sequelize";
import TipoDocumento from "../models/tipoDocumento.model.js";

/**
 * Repositorio para obtener tipos de documentos con filtros, orden y paginación.
 */
export const getTipoDocumentosRepository = async ({
  id,
  codigo,
  nombre,
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
    ];
  } else {
    if (nombre) {
      whereClause.nombre = { [Op.like]: `%${nombre}%` };
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await TipoDocumento.findAndCountAll({
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
 * Repositorio para la lista de tipos de documentos.
 */
export const getListTipoDocumentosRepository = async (estado, sortBy = "id", order = "ASC") => {
  const whereClause = {};

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  const { count, rows } = await TipoDocumento.findAndCountAll({
    where: whereClause,
    order: [[sortBy, order]],
  });

  return {
    data: rows,
    count,
  };
};

/**
 * Buscar un tipo de documento por ID.
 */
export const showTipoDocumentoRepository = async (id) => {
  return await TipoDocumento.findOne({
    where: { id },
  });
};

/**
 * Buscar un tipo de documento por código.
 */
export const findTipoDocumentoByCodigoRepository = async (codigo) => {
  return await TipoDocumento.findOne({
    where: { 
      codigo: codigo.toUpperCase()
    },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Buscar un tipo de documento por código excluyendo un ID.
 */
export const findTipoDocumentoByCodigoExcludingIdRepository = async (codigo, idExcluir) => {
  return await TipoDocumento.findOne({
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
 * Crear un nuevo tipo de documento.
 */
export const storeTipoDocumentoRepository = async (data) => {
  return await TipoDocumento.create({
    ...data,
    codigo: data.codigo.toUpperCase()
  });
};

/**
 * Actualizar un tipo de documento por ID.
 */
export const updateTipoDocumentoRepository = async (id, data) => {
  const tipoDocumento = await TipoDocumento.findOne({ where: { id } });
  if (!tipoDocumento) return null;

  // Agregar timestamp de actualización y convertir código a mayúsculas si se proporciona
  const updateData = {
    ...data,
    updated_at: new Date()
  };

  if (data.codigo) {
    updateData.codigo = data.codigo.toUpperCase();
  }

  await tipoDocumento.update(updateData);
  await tipoDocumento.reload();
  return tipoDocumento;
};

/**
 * Verificar si existe un tipo de documento con el mismo ID.
 */
export const findTipoDocumentoByIdRepository = async (id) => {
  return await TipoDocumento.findOne({
    where: { id },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Verificar si existe un tipo de documento con el mismo nombre.
 */
export const findTipoDocumentoByNombreRepository = async (nombre) => {
  return await TipoDocumento.findOne({
    where: {
      nombre: nombre,
      estado: true
    },
    attributes: ['id', 'codigo', 'nombre', 'estado']
  });
};

/**
 * Verificar si existe un tipo de documento con el mismo nombre, excluyendo un ID específico.
 */
export const findTipoDocumentoByNombreExcludingIdRepository = async (nombre, idExcluir) => {
  return await TipoDocumento.findOne({
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
