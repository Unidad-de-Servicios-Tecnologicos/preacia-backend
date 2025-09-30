import { buildPagination } from "../../utils/buildPagination.util.js";
import {
  getPermissionsRepository,
  getListPermissionsRepository,
  showPermissionRepository,
  updatePermissionRepository,
} from "../../repositories/permiso.repository.js";
import { Op } from "sequelize";
import Permiso from "../../models/permiso.model.js";
import ApplyPagination from "../../utils/pagination.util.js";

/**
 * Servicio para obtener permisos con filtros, orden y paginación usando el repositorio.
 * @param {Request} req
 * @returns {Promise<Object>}
 */
export const getPermissionsService = async (req) => {
  const {
    id,
    nombre,
    descripcion,
    estado,
    search, // Agregamos el parámetro search
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
  } = req.query;

  // Lógica de filtros y paginación delegada al repositorio
  const { data, count } = await getPermissionsRepository({
    id,
    nombre,
    descripcion,
    estado,
    search, // Pasamos el parámetro search al repositorio
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
    links,
    isPaginated: true,
  };
};

/**
 * Servicio para obtener la lista de permisos.
 * @returns {Promise<Object>}
 */
export const getListPermissionsService = async (estado, sortBy = "id", order = "ASC") => {
  return await getListPermissionsRepository(estado, sortBy, order);
}


/**
 * Servicio para mostrar un permiso por id.
 */
export const showPermissionService = async (id) => {
  return await showPermissionRepository(id);
};



/**
 * Servicio para cambiar estado a un permiso.
 */
export const changePermissionStatusService = async (id) => {
  const permiso = await showPermissionRepository(id);
  if (!permiso) return "NOT_FOUND";

  return await updatePermissionRepository(id, { estado: !permiso.estado });
}

/**
 * Servicio para crear un nuevo permiso.
 */
export const crearPermiso = async (data) => {
  try {
    // Verificar si ya existe un permiso con el mismo nombre
    const permisoExistente = await Permiso.findOne({
      where: { nombre: data.nombre }
    });
    if (permisoExistente) {
      throw new Error('Ya existe un permiso con este nombre');
    }

    // Agregar timestamp de creación
    const permisoData = {
      ...data,
      created_at: new Date(),
      updated_at: null
    };

    return await Permiso.create(permisoData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Ya existe un permiso con este nombre');
    }
    throw new Error(`Error al crear el permiso: ${error.message}`);
  }
};

/**
 * Servicio para editar un permiso existente.
 */
export const editarPermiso = async (id, data) => {
  try {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      throw new Error('Permiso no encontrado');
    }

    // Verificar si el nuevo nombre ya existe en otro permiso
    if (data.nombre && data.nombre !== permiso.nombre) {
      const permisoExistente = await Permiso.findOne({
        where: {
          nombre: data.nombre,
          id: { [Op.ne]: id } // Excluir el permiso actual
        }
      });
      if (permisoExistente) {
        throw new Error('Ya existe otro permiso con este nombre');
      }
    }

    // Filtrar campos undefined o null para actualización parcial
    const camposActualizar = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        camposActualizar[key] = data[key];
      }
    });

    // Solo actualizar si hay campos válidos
    if (Object.keys(camposActualizar).length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // Agregar timestamp de actualización
    camposActualizar.updated_at = new Date();

    const permisoActualizado = await permiso.update(camposActualizar);

    // Recargar el permiso actualizado desde la base de datos
    await permisoActualizado.reload();

    return permisoActualizado;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error(`Errores de validación: ${error.errors.map(e => e.message).join(', ')}`);
    }
    if (error.name === 'SequelizeDatabaseError') {
      throw new Error('Error en la base de datos al actualizar el permiso');
    }
    throw new Error(`Error al editar el permiso: ${error.message}`);
  }
};

export const cambiarEstadoPermiso = async (id, nuevoEstado) => {
  try {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      throw new Error('Permiso no encontrado');
    }

    // Verificar si el estado es diferente al actual
    if (permiso.estado === nuevoEstado) {
      throw new Error(`El permiso ya se encuentra en estado ${nuevoEstado}`);
    }

    const permisoActualizado = await permiso.update({
      estado: nuevoEstado,
      updated_at: new Date()
    });

    // Recargar el permiso actualizado desde la base de datos
    await permisoActualizado.reload();

    return permisoActualizado;
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error(`Errores de validación: ${error.errors.map(e => e.message).join(', ')}`);
    }
    if (error.name === 'SequelizeDatabaseError') {
      throw new Error('Error en la base de datos al cambiar el estado del permiso');
    }
    throw new Error(`Error al cambiar el estado del permiso: ${error.message}`);
  }
};

export const obtenerPermisoPorId = async (id) => {
  try {
    return await Permiso.findByPk(id);
  } catch (error) {
    throw new Error(`Error al obtener el permiso: ${error.message}`);
  }
};

export const getAllPermisos = async (filters = {}, page = 1, limit = 10) => {
  try {
    const whereClause = {};

    if (filters.nombre) {
      whereClause.nombre = { [Op.like]: `%${filters.nombre}%` };
    }
    if (filters.estado !== undefined) {
      whereClause.estado = { [Op.eq]: filters.estado };
    }

    return await ApplyPagination(Permiso, page, limit, {
      where: whereClause,
      order: [['nombre', 'ASC']]
    });
  } catch (error) {
    throw new Error(`Error al obtener los permisos: ${error.message}`);
  }
};

export const deletePermiso = async (id) => {
  try {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) return null;
    await permiso.destroy();
    return permiso;
  } catch (error) {
    throw new Error(`Error al eliminar el permiso: ${error.message}`);
  }
};

export const getPermisosPorModulo = async (modulo) => {
  try {
    return await Permiso.findAll({
      where: {
        modulo: modulo,
        estado: 'activo'
      },
      order: [['nombre', 'ASC']]
    });
  } catch (error) {
    throw new Error(`Error al obtener permisos por módulo: ${error.message}`);
  }
};