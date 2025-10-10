import UsuarioPermiso from "../../../models/usuarioPermiso.model.js";
import Usuario from "../../../models/usuario.model.js";
import Permiso from "../../../models/permiso.model.js";
import { validationResult } from "express-validator";

// Asignar permiso a usuario
export const asignarPermisoAUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { usuario_id, permiso_id } = req.body;
    try {
        // Verifica que no exista ya la relacion
        const existe = await UsuarioPermiso.findOne({ where: { usuario_id, permiso_id } });
        if (existe) {
            return res.status(400).json({ success: false, message: "Ya existe la relación usuario-permiso." });
        }

        const relacion = await UsuarioPermiso.create({ usuario_id, permiso_id });
        return res.status(201).json({ success: true, data: relacion });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Quitar permiso a usuario
export const quitarPermisoAUsuario = async (req, res) => {
    const { usuario_id, permiso_id } = req.body;
    try {
        const deleted = await UsuarioPermiso.destroy({ where: { usuario_id, permiso_id } });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Relación no encontrada." });
        }
        return res.json({ success: true, message: "Relación eliminada." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Listar permisos de un usuario
export const listarPermisosDeUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const usuario = await Usuario.findOne({
            where: { id: usuario_id },
            include: [
                {
                    model: Permiso,
                    through: { attributes: [] }
                }
            ]
        });

        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }

        return res.json({ success: true, data: usuario.permisos || [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Listar usuarios que tienen un permiso
export const listarUsuariosConPermiso = async (req, res) => {
    const { permiso_id } = req.params;
    try {
        const permiso = await Permiso.findOne({
            where: { id: permiso_id },
            include: [
                {
                    model: Usuario,
                    through: { attributes: [] }
                }
            ]
        });

        if (!permiso) {
            return res.status(404).json({ success: false, message: "Permiso no encontrado." });
        }

        return res.json({ success: true, data: permiso.usuarios || [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Mantener compatibilidad con nombres antiguos
export const asociarPermisoUsuario = asignarPermisoAUsuario;
export const quitarPermisoUsuario = quitarPermisoAUsuario;
