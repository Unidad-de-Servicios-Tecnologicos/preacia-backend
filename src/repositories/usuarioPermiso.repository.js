import UsuarioPermiso from '../models/usuarioPermiso.model.js';
import Usuario from '../models/usuario.model.js';
import Permiso from '../models/permiso.model.js';

/**
 * Crear una relación usuario-permiso
 */
export const createUsuarioPermisoRepository = async (data) => {
	return await UsuarioPermiso.create(data);
};

/**
 * Eliminar una relación usuario-permiso
 */
export const deleteUsuarioPermisoRepository = async (usuarioId, permisoId) => {
	return await UsuarioPermiso.destroy({ where: { usuario_id: usuarioId, permiso_id: permisoId } });
};

/**
 * Buscar relación por usuario y permiso
 */
export const findByUsuarioYPermisoRepository = async (usuarioId, permisoId) => {
	return await UsuarioPermiso.findOne({ where: { usuario_id: usuarioId, permiso_id: permisoId } });
};

/**
 * Obtener permisos asociados a un usuario (lista de permisos)
 */
export const getPermisosByUsuarioRepository = async (usuarioId) => {
	const usuario = await Usuario.findByPk(usuarioId, {
		include: [{ model: Permiso, through: { attributes: [] } }]
	});
	return usuario ? usuario.permisos || [] : [];
};

/**
 * Obtener usuarios asociados a un permiso (lista de usuarios)
 */
export const getUsuariosByPermisoRepository = async (permisoId) => {
	const permiso = await Permiso.findByPk(permisoId, {
		include: [{ model: Usuario, through: { attributes: [] } }]
	});
	return permiso ? permiso.usuarios || [] : [];
};

c