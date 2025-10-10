import CentroUsuario from '../../models/centro_usuario.model.js';

/**
 * Asocia uno o varios centros a un usuario
 * @param {number} usuarioId
 * @param {number|number[]} centroIds
 */
export const asociarCentrosAUsuarioService = async (usuarioId, centroIds) => {
    if (!usuarioId || !centroIds) return;
    const centros = Array.isArray(centroIds) ? centroIds : [centroIds];
    const relaciones = [];
    for (const centro_id of centros) {
        // Evita duplicados
        const existe = await CentroUsuario.findOne({ where: { usuario_id: usuarioId, centro_id } });
        if (!existe) {
            const relacion = await CentroUsuario.create({ usuario_id: usuarioId, centro_id });
            relaciones.push(relacion);
        }
    }
    return relaciones;
};