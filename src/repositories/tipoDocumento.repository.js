import { Op } from "sequelize";
import TipoDocumento from "../models/tipoDocumento.model.js";

/**
 * Repositorio para obtener tipos de documentos con filtros, orden y paginación.
 */
export const getTipoDocumentosRepository = async ({
  id,
  nombre,
  estado,
  search, // Nuevo parámetro para búsqueda global por ID        
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
    // Convertir el término de búsqueda a snake_case para coincidir con IDs
    const searchSnakeCase = search
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    whereClause[Op.or] = [
      { id: { [Op.like]: `%${search}%` } },
      { id: { [Op.like]: `%${searchSnakeCase}%` } },
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
    include: [
      {
        model: TipoDocumento,
        as: 'tipo_documento',
        attributes: ['id', 'nombre']
      },
      {
        model: TipoDocumento,
        as: 'tipo_documento',
        attributes: ['id', 'nombre']
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
 * Repositorio para la lista de tipos de documentos.
 */
export const getListTipoDocumentosRepository = async (estado, sortBy = "id", order = "ASC", tipo_documento_filtro = null) => {
  const whereClause = {};

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  // Aplicar filtro por tipo de documento específico (admin ve solo su tipo de documento)
  if (tipo_documento_filtro) {
    whereClause.id = { [Op.eq]: parseInt(tipo_documento_filtro) };
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
 * Crear un nuevo tipo de documento.
 */
export const storeTipoDocumentoRepository = async (data) => {
  return await TipoDocumento.create(data);
};

/**
 * Actualizar un tipo de documento por ID.
 */
export const updateTipoDocumentoRepository = async (id, data) => {
  const tipoDocumento = await TipoDocumento.findOne({ where: { id } });
  if (!tipoDocumento) return null;

  // Agregar timestamp de actualización
  const updateData = {
    ...data,
    updated_at: new Date()
  };

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
    attributes: ['id',  'nombre']
  });
};

/**
 * Verificar si existe un tipo de documento con el mismo nombre.
 */
export const findTipoDocumentoByNombreRepository = async (nombre) => {
  return await TipoDocumento.findOne({
    where: {
      nombre: {
        [Op.like]: nombre
      }
    },
    attributes: ['id', 'nombre']
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
    attributes: ['id', 'nombre']
  });
};

