import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getUsersRepository,
    findUsuarioById,
    updateUsuario,
    validateUniqueField
} from "../../repositories/usuario.repository.js";
import Usuario from "../../models/usuario.model.js";
import TipoDocumento from "../../models/tipoDocumento.model.js";
import Rol from "../../models/rol.model.js";
import { RolEnum } from "../../enums/rol.enum.js";

/**
 * Servicio para obtener usuarios con filtros, orden y paginación.
 */
export const getUsuariosService = async (req) => {
    const {
        id,
        documento,
        nombres,
        apellidos,
        correo,
        telefono,
        estado,
        rol_nombre,
        search,
        centro_id,
        sortBy = "id",
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
    const { data, count } = await getUsersRepository({
        id,
        documento,
        nombres,
        apellidos,
        correo,
        telefono,
        estado: estadoBoolean,
        rol_nombre,
        search,
        centro_id,
        sortBy,
        order,
        page,
        limit
    });

    // Formatear datos de usuarios
    const formattedData = data.map(usuario => ({
        id: usuario.id,
        tipo_documento_id: usuario.tipo_documento_id,
        rol_id: usuario.rol_id,
        rol: usuario.rol ? {
            id: usuario.rol.id,
            nombre: usuario.rol.nombre
        } : null,
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        estado: usuario.estado,
        ultimo_acceso: usuario.ultimo_acceso,
        verificado_acia: usuario.verificado_acia,
        created_at: usuario.created_at,
        updated_at: usuario.updated_at
    }));

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const queryParams = { ...req.query };

    // Construir paginación con links
    const pagination = buildPagination(
        count,
        parseInt(page),
        parseInt(limit),
        baseUrl,
        queryParams
    );

    return {
        data: formattedData,
        meta: pagination.meta,
        links: pagination.links
    };
};

/**
 * Servicio para obtener lista simplificada de usuarios (sin paginación)
 */
export const getListUsuariosService = async (req) => {
    const {
        estado,
        rol_nombre,
        sortBy = "nombres",
        order = "ASC"
    } = req.query;

    // Convertir estado string a boolean si es necesario
    let estadoBoolean = estado;
    if (estado === 'true' || estado === 'activo') estadoBoolean = true;
    if (estado === 'false' || estado === 'inactivo') estadoBoolean = false;

    // Obtener todos los registros sin paginación
    const { data, count } = await getUsersRepository({
        estado: estadoBoolean,
        rol_nombre,
        sortBy,
        order,
        page: 1,
        limit: 1000 // Límite alto para obtener todos
    });

    // Formatear datos de forma simplificada
    const formattedData = data.map(usuario => ({
        id: usuario.id,
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol ? usuario.rol.nombre : null,
        estado: usuario.estado
    }));

    return {
        data: formattedData,
        meta: {
            count: count
        }
    };
};

/**
 * Servicio para crear un nuevo usuario
 */
export const storeUsuarioService = async (data) => {
    // Buscar el tipo de documento
    const tipoDocumento = await TipoDocumento.findOne({
        where: { nombre: data.tipo_documento, estado: true }
    });

    if (!tipoDocumento) {
        throw new Error("El tipo de documento especificado no existe o está inactivo");
    }

    // Buscar el rol (por defecto APRENDIZ si no se especifica)
    let rol;
    if (data.rol_nombre) {
        rol = await Rol.findOne({
            where: { nombre: data.rol_nombre, estado: true }
        });
    } else {
        // Buscar rol por defecto (APRENDIZ)
        rol = await Rol.findOne({
            where: { nombre: RolEnum.APRENDIZ, estado: true }
        });
    }

    if (!rol) {
        throw new Error("El rol especificado no existe o está inactivo");
    }

    // Encriptar contraseña
    const hashedPassword = await Usuario.generatePassword(data.contrasena);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
        rol_id: rol.id,
        tipo_documento_id: tipoDocumento.id,
        documento: data.documento,
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        contrasena: hashedPassword,
        estado: true,
        verificado_acia: false
    });

    // Obtener el usuario creado con relaciones
    const usuarioCreado = await findUsuarioById(nuevoUsuario.id);

    return {
        id: usuarioCreado.id,
        tipo_documento_id: usuarioCreado.tipo_documento_id,
        rol_id: usuarioCreado.rol_id,
        rol: usuarioCreado.rol ? {
            id: usuarioCreado.rol.id,
            nombre: usuarioCreado.rol.nombre
        } : null,
        documento: usuarioCreado.documento,
        nombres: usuarioCreado.nombres,
        apellidos: usuarioCreado.apellidos,
        correo: usuarioCreado.correo,
        telefono: usuarioCreado.telefono,
        direccion: usuarioCreado.direccion,
        estado: usuarioCreado.estado,
        verificado_acia: usuarioCreado.verificado_acia,
        created_at: usuarioCreado.created_at
    };
};

/**
 * Servicio para obtener un usuario por ID
 */
export const showUsuarioService = async (id) => {
    const usuario = await findUsuarioById(id);

    if (!usuario) {
        return null;
    }

    return {
        id: usuario.id,
        tipo_documento_id: usuario.tipo_documento_id,
        rol_id: usuario.rol_id,
        rol: usuario.rol ? {
            id: usuario.rol.id,
            nombre: usuario.rol.nombre
        } : null,
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        estado: usuario.estado,
        ultimo_acceso: usuario.ultimo_acceso,
        verificado_acia: usuario.verificado_acia,
        centros: usuario.centros || [],
        created_at: usuario.created_at,
        updated_at: usuario.updated_at
    };
};

/**
 * Servicio para actualizar un usuario
 */
export const updateUsuarioService = async (id, data) => {
    // Verificar que el usuario existe
    const usuarioExiste = await findUsuarioById(id);
    if (!usuarioExiste) {
        throw new Error("Usuario no encontrado");
    }

    const updateData = {};

    // Si se va a cambiar el documento, validar que no exista
    if (data.documento && data.documento !== usuarioExiste.documento) {
        const documentoDisponible = await validateUniqueField('documento', data.documento, id);
        if (!documentoDisponible) {
            throw new Error("Ya existe un usuario con ese documento");
        }
        updateData.documento = data.documento;
    }

    // Si se va a cambiar el correo, validar que no exista
    if (data.correo && data.correo !== usuarioExiste.correo) {
        const correoDisponible = await validateUniqueField('correo', data.correo, id);
        if (!correoDisponible) {
            throw new Error("Ya existe un usuario con ese correo");
        }
        updateData.correo = data.correo;
    }

    // Si se especifica un rol, validar y actualizar
    if (data.rol_nombre) {
        const rol = await Rol.findOne({
            where: { nombre: data.rol_nombre, estado: true }
        });
        if (!rol) {
            throw new Error("El rol especificado no existe o está inactivo");
        }
        updateData.rol_id = rol.id;
    }

    // Si se especifica tipo de documento, validar y actualizar
    if (data.tipo_documento) {
        const tipoDocumento = await TipoDocumento.findOne({
            where: { nombre: data.tipo_documento, estado: true }
        });
        if (!tipoDocumento) {
            throw new Error("El tipo de documento especificado no existe o está inactivo");
        }
        updateData.tipo_documento_id = tipoDocumento.id;
    }

    // Actualizar campos simples
    if (data.nombres) updateData.nombres = data.nombres;
    if (data.apellidos) updateData.apellidos = data.apellidos;
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.direccion !== undefined) updateData.direccion = data.direccion;

    // Actualizar usuario
    const usuarioActualizado = await updateUsuario(id, updateData);

    return {
        id: usuarioActualizado.id,
        tipo_documento_id: usuarioActualizado.tipo_documento_id,
        rol_id: usuarioActualizado.rol_id,
        rol: usuarioActualizado.rol ? {
            id: usuarioActualizado.rol.id,
            nombre: usuarioActualizado.rol.nombre
        } : null,
        documento: usuarioActualizado.documento,
        nombres: usuarioActualizado.nombres,
        apellidos: usuarioActualizado.apellidos,
        correo: usuarioActualizado.correo,
        telefono: usuarioActualizado.telefono,
        direccion: usuarioActualizado.direccion,
        estado: usuarioActualizado.estado,
        verificado_acia: usuarioActualizado.verificado_acia,
        updated_at: usuarioActualizado.updated_at
    };
};

/**
 * Servicio para cambiar el estado de un usuario
 */
export const changeUsuarioStatusService = async (id, nuevoEstado) => {
    // Verificar que el usuario existe
    const usuario = await findUsuarioById(id);
    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    // Validar que el estado sea diferente al actual
    if (usuario.estado === nuevoEstado) {
        throw new Error(
            `El usuario ya está ${nuevoEstado ? 'activo' : 'inactivo'}`
        );
    }

    // Actualizar estado
    const usuarioActualizado = await updateUsuario(id, { estado: nuevoEstado });

    return {
        id: usuarioActualizado.id,
        documento: usuarioActualizado.documento,
        nombres: usuarioActualizado.nombres,
        apellidos: usuarioActualizado.apellidos,
        correo: usuarioActualizado.correo,
        estado: usuarioActualizado.estado
    };
};

