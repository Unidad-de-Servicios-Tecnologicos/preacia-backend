import { buildPagination } from "../../utils/buildPagination.util.js";
import { RolEnum } from "../../enums/rol.enum.js";
import Usuario from "../../models/usuario.model.js";
import {
  getRolesRepository,
  getListRolesRepository,
  storeRoleRepository,
  showRoleRepository,
  updateRoleRepository,
  deleteRoleRepository,
  checkRoleHasUsersRepository,
  setPermisosToRol,
} from "../../repositories/rol.repository.js";

/**
 * Servicio para obtener roles con filtros, orden y paginación usando el repositorio.
 * @param {Request} req
 * @returns {Promise<Object>}
 */
export const getRolesService = async (req) => {
  const {
    id,
    nombre,
    descripcion,
    estado,
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
  } = req.query;

  // Convertir estado string a boolean si es necesario
  let estadoBoolean = estado;
  if (estado === 'true') estadoBoolean = true;
  if (estado === 'false') estadoBoolean = false;
  if (estado === undefined || estado === null) estadoBoolean = undefined;

  // Lógica de filtros y paginación delegada al repositorio
  const { data, count } = await getRolesRepository({
    id,
    nombre,
    descripcion,
    estado: estadoBoolean,
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
 * @returns {Promise<Object>}
 */
export const getListRolesService = async (estado, sortBy = "id", order = "ASC") => {
  return await getListRolesRepository(estado, sortBy, order);
}

/**
 * Servicio para crear un nuevo rol.
 */
export const storeRoleService = async (data) => {
  // Validaciones
  if (!data.nombre || !data.nombre.trim()) {
    const error = new Error("El nombre del rol es obligatorio");
    error.code = "VALIDATION_ERROR";
    error.field = "nombre";
    throw error;
  }

  if (data.nombre.trim().length < 3) {
    const error = new Error("El nombre del rol debe tener al menos 3 caracteres");
    error.code = "VALIDATION_ERROR";
    error.field = "nombre";
    throw error;
  }

  if (data.nombre.trim().length > 50) {
    const error = new Error("El nombre del rol no puede exceder 50 caracteres");
    error.code = "VALIDATION_ERROR";
    error.field = "nombre";
    throw error;
  }

  if (data.descripcion && data.descripcion.trim().length > 500) {
    const error = new Error("La descripción no puede exceder 500 caracteres");
    error.code = "VALIDATION_ERROR";
    error.field = "descripcion";
    throw error;
  }

  // Verificar que el nombre no esté duplicado
  const existingRole = await getRolesRepository({
    nombre: data.nombre.trim(),
    limit: 1,
    page: 1
  });

  if (existingRole.data && existingRole.data.length > 0) {
    const error = new Error("Ya existe un rol con este nombre");
    error.code = "DUPLICATE_ROLE_NAME";
    error.field = "nombre";
    throw error;
  }

  // Crea el rol
  const rol = await storeRoleRepository(data);

  // Asocia los permisos si vienen en el payload
  if (Array.isArray(data.permisos)) {
    await setPermisosToRol(rol.id, data.permisos);
  }

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

  // Validaciones
  if (data.nombre !== undefined) {
    if (!data.nombre || !data.nombre.trim()) {
      const error = new Error("El nombre del rol es obligatorio");
      error.code = "VALIDATION_ERROR";
      error.field = "nombre";
      throw error;
    }

    if (data.nombre.trim().length < 3) {
      const error = new Error("El nombre del rol debe tener al menos 3 caracteres");
      error.code = "VALIDATION_ERROR";
      error.field = "nombre";
      throw error;
    }

    if (data.nombre.trim().length > 50) {
      const error = new Error("El nombre del rol no puede exceder 50 caracteres");
      error.code = "VALIDATION_ERROR";
      error.field = "nombre";
      throw error;
    }

    // Verificar que el nombre no esté duplicado (excepto el mismo rol)
    const existingRole = await getRolesRepository({
      nombre: data.nombre.trim(),
      limit: 1,
      page: 1
    });

    if (existingRole.data && existingRole.data.length > 0) {
      const foundRole = existingRole.data[0];
      if (foundRole.id !== parseInt(id)) {
        const error = new Error("Ya existe un rol con este nombre");
        error.code = "DUPLICATE_ROLE_NAME";
        error.field = "nombre";
        throw error;
      }
    }
  }

  if (data.descripcion !== undefined && data.descripcion && data.descripcion.trim().length > 500) {
    const error = new Error("La descripción no puede exceder 500 caracteres");
    error.code = "VALIDATION_ERROR";
    error.field = "descripcion";
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

  // Actualiza el rol
  await updateRoleRepository(id, data);

  // Actualiza los permisos si vienen en el payload
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

  // Verificar si el rol tiene usuarios asociados (ahora en tabla usuario_rol)
  const hasUsers = await checkRoleHasUsersRepository(id);
  if (hasUsers) {
    const error = new Error(`No se puede eliminar el rol porque tiene usuario(s) asociado(s). Debe reasignar los usuarios primero.`);
    error.code = "ROLE_HAS_USERS";
    throw error;
  }

  await deleteRoleRepository(id);
  return "DELETED";
};

/**
 * Servicio para cambiar estado a un rol.
 */
export const changeRoleStatusService = async (id, newState) => {
  const rol = await showRoleRepository(id);
  if (!rol) return "NOT_FOUND";

  // No permitir modificar el estado de roles propios del sistema
  const rolesProtegidos = [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR];
  if (rolesProtegidos.includes(rol.nombre)) {
    const error = new Error(`El rol "${rol.nombre}" es propio del sistema y no puede ser desactivado.`);
    error.code = "SYSTEM_ROLE_UPDATE_FORBIDDEN";
    throw error;
  }

  // Usar el nuevo estado si se proporciona, sino invertir el actual
  const estadoFinal = newState !== undefined ? newState : !rol.estado;

  // Si se está intentando desactivar el rol, verificar que no tenga usuarios asociados
  if (!estadoFinal) {
    const hasUsers = await checkRoleHasUsersRepository(id);
    if (hasUsers) {
      const error = new Error(`No se puede desactivar el rol porque tiene usuario(s) asociado(s). Debe reasignar los usuarios primero.`);
      error.code = "ROLE_HAS_USERS";
      throw error;
    }
  }

  return await updateRoleRepository(id, { estado: estadoFinal });
}