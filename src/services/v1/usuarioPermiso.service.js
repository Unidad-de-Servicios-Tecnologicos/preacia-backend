import { createUsuarioPermisoRepository, findByUsuarioYPermisoRepository, deleteUsuarioPermisoRepository, getPermisosByUsuarioRepository, getUsuariosByPermisoRepository } from '../../repositories/usuarioPermiso.repository.js';
import Usuario from '../../../models/usuario.model.js';
import Permiso from '../../../models/permiso.model.js';

/**
 * Asocia uno o varios permisos a un usuario
 * @param {number} usuarioId
 * @param {number|number[]} permisoIds
 */
export const asociarPermisosAUsuarioService = async (usuarioId, permisoIds) => {
    if (!usuarioId || !permisoIds) return [];
    const permisos = Array.isArray(permisoIds) ? permisoIds : [permisoIds];
    const relaciones = [];
    for (const permisoId of permisos) {
        // Evita duplicados usando el repository
        const existe = await findByUsuarioYPermisoRepository(usuarioId, permisoId);
        if (!existe) {
            const relacion = await createUsuarioPermisoRepository({ usuario_id: usuarioId, permiso_id: permisoId });
            relaciones.push(relacion);
        }
    }
    return relaciones;
};

/**
 * Quita uno o varios permisos a un usuario
 * @param {number} usuarioId
 * @param {number|number[]} permisoIds
 */
export const quitarPermisosDeUsuarioService = async (usuarioId, permisoIds) => {
    if (!usuarioId || !permisoIds) return 0;
    const permisos = Array.isArray(permisoIds) ? permisoIds : [permisoIds];
    let deletedCount = 0;
    for (const permisoId of permisos) {
        const deleted = await deleteUsuarioPermisoRepository(usuarioId, permisoId);
        deletedCount += deleted;
    }
    return deletedCount;
};

/**
 * Obtener los permisos asociados a un usuario
 * @param {number} usuarioId
 */
export const getPermisosPorUsuarioService = async (usuarioId) => {
    if (!usuarioId) return [];
    return await getPermisosByUsuarioRepository(usuarioId);
};

/**
 * Obtener los usuarios que tienen un permiso
 * @param {number} permisoId
 */
export const getUsuariosPorPermisoService = async (permisoId) => {
    if (!permisoId) return [];
    return await getUsuariosByPermisoRepository(permisoId);
};

// alias
export const asociarPermisosAUsuario = asociarPermisosAUsuarioService;
export const quitarPermisosDeUsuario = quitarPermisosDeUsuarioService;
