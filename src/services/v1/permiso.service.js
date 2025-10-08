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



// =============================================================================
// NOTA: Los permisos son SOLO LECTURA
// Los permisos se gestionan mediante seeders/migraciones SQL
// No se permite crear, editar o eliminar permisos desde la API
// =============================================================================