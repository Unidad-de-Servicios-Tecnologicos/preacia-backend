import CentroUsuario from "../../../models/centroUsuario.model.js";
import Usuario from "../../../models/usuario.model.js";
import Centro from "../../../models/centro.model.js";
import { validationResult } from "express-validator";

// Asociar usuario a centro
export const asociarUsuarioCentro = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { usuario_id, centro_id } = req.body;
    try {
        // Verifica que no exista ya la relación
        const existe = await CentroUsuario.findOne({ where: { usuario_id, centro_id } });
        if (existe) {
            return res.status(400).json({ success: false, message: "Ya existe la relación usuario-centro." });
        }
        const relacion = await CentroUsuario.create({ usuario_id, centro_id });
        return res.status(201).json({ success: true, data: relacion });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Quitar usuario de centro
export const quitarUsuarioCentro = async (req, res) => {
    const { usuario_id, centro_id } = req.body;
    try {
        const deleted = await CentroUsuario.destroy({ where: { usuario_id, centro_id } });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Relación no encontrada." });
        }
        return res.json({ success: true, message: "Relación eliminada." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Listar usuarios de un centro
export const listarUsuariosDeCentro = async (req, res) => {
    const { centro_id } = req.params;
    try {
        const usuarios = await Usuario.findAll({
            include: [{
                model: Centro,
                as: 'centros',
                where: { id: centro_id },
                through: { attributes: [] }
            }]
        });
        return res.json({ success: true, data: usuarios });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Listar centros de un usuario
export const listarCentrosDeUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const centros = await Centro.findAll({
            include: [{
                model: Usuario,
                as: 'usuarios',
                where: { id: usuario_id },
                through: { attributes: [] }
            }]
        });
        return res.json({ success: true, data: centros });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};