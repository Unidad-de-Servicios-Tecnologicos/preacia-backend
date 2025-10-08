import { buildPagination } from "../../utils/buildPagination.util.js";
import { RolEnum } from "../../enums/rol.enum.js";
import {
  getRolesRepository,
  getListRolesRepository,
  storeRoleRepository,
  showRoleRepository,
  updateRoleRepository,
  deleteRoleRepository,
  findRolByNombreRepository,
  findRolByNombreExcludingIdRepository,
  checkRoleHasUsersRepository,
  checkRoleHasPermisosRepository,
  setPermisosToRol,
} from "../../repositories/rol.repository.js";

/**
 * Servicio para obtener roles con filtros, orden y paginación.
 */
export const getRolesService = async (req) => {
  const {
    id,
    nombre,
    descripcion,
    estado,
    search,
    sortBy = "nombre",
    order = "ASC",
    page = 1,
    limit = 10
  } = req.query;

  // Convertir estado string a boolean si es necesario
  let estadoBoolean = estado;
  if (estado === 'true' || estado === 'activo') estadoBoolean = true;
  if (estado === 'false' || estado === 'inactivo') estadoBoolean = false;
  if (estado === undefined || estado === null || estado === 'todos') estadoBoolean = undefined;

  // Lógica de filtros y paginación delegada al repositorio
  const { data, count } = await getRolesRepository({
    id,
    nombre,
    descripcion,
    estado: estadoBoolean,
    search,
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
 * Servicio para obtener la lista de roles.
 */
export const getListRolesService = async (estado, sortBy = "nombre", order = "ASC") => {
  return await getListRolesRepository(estado, sortBy, order);
}

/**
 * Servicio para crear un nuevo rol.
 */
export const storeRoleService = async (data) => {
  // Validar que el nombre no esté vacío
  if (!data.nombre || !data.nombre.trim()) {
    const error = new Error("El nombre del rol es obligatorio");
    error.code = "VALIDATION_ERROR";
    error.field = "nombre";
    throw error;
  }

  // Verificar si ya existe un rol con el mismo nombre
  const existingRolByNombre = await findRolByNombreRepository(data.nombre.trim());
  if (existingRolByNombre) {
    const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
    error.code = "DUPLICATE_ROLE_NAME";
    throw error;
  }

  // Validar que se proporcione al menos un permiso
  if (!data.permisos || !Array.isArray(data.permisos) || data.permisos.length === 0) {
    const error = new Error("Un rol debe tener al menos 1 permiso asociado");
    error.code = "ROLE_NEEDS_PERMISSION";
    throw error;
  }

  // Crear el rol
  const rol = await storeRoleRepository(data);

  // Asociar los permisos (la validación de al menos 1 permiso se hace en setPermisosToRol)
  await setPermisosToRol(rol.id, data.permisos);

  return rol;
};

/**
 * Servicio para mostrar un rol por id.
 */
export const showRoleService = async (id) => {
  return await showRoleRepository(id);
};

/**
 * Servicio para actualizar un rol.
 */
export const updateRoleService = async (id, data) => {
  const rol = await showRoleRepository(id);
  if (!rol) {
    const error = new Error("Rol no encontrado");
    error.code = "NOT_FOUND";
    throw error;
  }

  // No permitir modificar el nombre de roles propios del sistema
  const rolesProtegidos = [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR];
  if (
    rolesProtegidos.includes(rol.nombre) &&
    data.nombre &&
    data.nombre.trim() !== rol.nombre
  ) {
    const error = new Error(`El rol "${rol.nombre}" es propio del sistema y no puede cambiar su nombre.`);
    error.code = "SYSTEM_ROLE_UPDATE_FORBIDDEN";
    throw error;
  }

  // Si se está actualizando el nombre, verificar que no exista otro rol con el mismo nombre
  if (data.nombre && data.nombre.trim() !== rol.nombre) {
    const existingRolByNombre = await findRolByNombreExcludingIdRepository(data.nombre.trim(), id);
    if (existingRolByNombre) {
      const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
      error.code = "DUPLICATE_ROLE_NAME";
      throw error;
    }
  }

  // Actualizar el rol
  await updateRoleRepository(id, data);

  // Actualizar los permisos si vienen en el payload
  // Validar que tenga al menos 1 permiso (la validación se hace en setPermisosToRol)
  if (Array.isArray(data.permisos)) {
    await setPermisosToRol(id, data.permisos);
  }

  return await showRoleRepository(id);
};

/**
 * Servicio para eliminar un rol.
 */
export const deleteRoleService = async (id) => {
  const rol = await showRoleRepository(id);
  if (!rol) {
    const error = new Error("Rol no encontrado");
    error.code = "NOT_FOUND";
    throw error;
  }

  // No permitir eliminar roles propios del sistema
  const rolesProtegidos = [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR];
  if (rolesProtegidos.includes(rol.nombre)) {
    const error = new Error(`El rol "${rol.nombre}" es propio del sistema y no puede ser eliminado.`);
    error.code = "SYSTEM_ROLE_DELETE_FORBIDDEN";
    throw error;
  }

  // Verificar si el rol tiene usuarios asociados
  const hasUsers = await checkRoleHasUsersRepository(id);
  if (hasUsers) {
    const error = new Error("No se puede eliminar el rol porque tiene usuario(s) asociado(s). Primero reasigne los usuarios.");
    error.code = "ROLE_HAS_USERS";
    throw error;
  }

  await deleteRoleRepository(id);
  return "DELETED";
};

/**
 * Servicio para cambiar estado de un rol.
 */
export const changeRoleStatusService = async (id, nuevoEstado) => {
  const rol = await showRoleRepository(id);
  if (!rol) {
    const error = new Error("Rol no encontrado");
    error.code = "NOT_FOUND";
    throw error;
  }

  // No permitir modificar el estado de roles propios del sistema
  const rolesProtegidos = [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR];
  if (rolesProtegidos.includes(rol.nombre)) {
    const error = new Error(`El rol "${rol.nombre}" es propio del sistema y no puede ser desactivado.`);
    error.code = "SYSTEM_ROLE_UPDATE_FORBIDDEN";
    throw error;
  }

  // Si se intenta desactivar, verificar que no tenga usuarios asociados
  if (nuevoEstado === false || nuevoEstado === 'false') {
    const hasUsers = await checkRoleHasUsersRepository(id);
    if (hasUsers) {
      const error = new Error("No se puede desactivar el rol porque tiene usuario(s) asociado(s). Primero reasigne los usuarios.");
      error.code = "ROLE_HAS_USERS";
      throw error;
    }
  }

  // Determinar el nuevo estado basado en el parámetro recibido
  let estadoFinal;
  
  if (typeof nuevoEstado === 'boolean') {
    // Si es boolean, usar directamente
    estadoFinal = nuevoEstado;
  } else if (nuevoEstado === 'true') {
    // Si es string 'true', activar
    estadoFinal = true;
  } else if (nuevoEstado === 'false') {
    // Si es string 'false', desactivar
    estadoFinal = false;
  } else {
    // Si no se especifica estado, alternar el estado actual
    estadoFinal = !rol.estado;
  }

  // Actualizar el estado del rol
  const updatedRol = await updateRoleRepository(id, { estado: estadoFinal });
  return updatedRol;
}