import CentroUsuario from '../models/centroUsuario.model.js';
import Usuario from '../models/usuario.model.js';
import Centro from '../models/centro.model.js';

/**
 * Crear relación usuario-centro
 */
export const createCentroUsuarioRepository = async (data) => {
    return await CentroUsuario.create(data);
};

/**
 * Eliminar relación usuario-centro
 */
export const deleteCentroUsuarioRepository = async (usuarioId, centroId) => {
    return await CentroUsuario.destroy({ where: { usuario_id: usuarioId, centro_id: centroId } });
};

/**
 * Buscar relación por usuario y centro
 */
export const findByUsuarioYCentroRepository = async (usuarioId, centroId) => {
    return await CentroUsuario.findOne({ where: { usuario_id: usuarioId, centro_id: centroId } });
};

/**
 * Obtener usuarios asociados a un centro
 */
export const getUsuariosByCentroRepository = async (centroId) => {
    const centro = await Centro.findByPk(centroId, {
        include: [{ model: Usuario, through: { attributes: [] } }]
    });
    return centro ? centro.usuarios || [] : [];
};

/**
 * Obtener centros asociados a un usuario
 */
export const getCentrosByUsuarioRepository = async (usuarioId) => {
    const usuario = await Usuario.findByPk(usuarioId, {
        include: [{ model: Centro, through: { attributes: [] } }]
    });
    return usuario ? usuario.centros || [] : [];
};
