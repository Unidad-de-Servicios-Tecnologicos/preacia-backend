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
        regional_id: usuario.regional_id,
        regional: usuario.regional ? {
            id: usuario.regional.id,
            codigo: usuario.regional.codigo,
            nombre: usuario.regional.nombre
        } : null,
        tipo_documento_id: usuario.tipo_documento_id,
        tipo_documento: usuario.tipo_documento ? {
            id: usuario.tipo_documento.id,
            codigo: usuario.tipo_documento.codigo,
            nombre: usuario.tipo_documento.nombre
        } : null,
        roles: usuario.roles ? usuario.roles.map(rol => ({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion
        })) : [],
        centros: usuario.centros ? usuario.centros.map(centro => ({
            id: centro.id,
            codigo: centro.codigo,
            nombre: centro.nombre
        })) : [],
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        estado: usuario.estado,
        password_debe_cambiar: usuario.password_debe_cambiar,
        ultimo_acceso: usuario.ultimo_acceso,
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
        roles: usuario.roles ? usuario.roles.map(r => r.nombre) : [],
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
export const storeUsuarioService = async (data, usuarioCreadorId = null) => {
    // Buscar el tipo de documento
    const tipoDocumento = await TipoDocumento.findOne({
        where: { nombre: data.tipo_documento, estado: true }
    });

    if (!tipoDocumento) {
        throw new Error("El tipo de documento especificado no existe o está inactivo");
    }

    // Procesar roles (puede ser un string o un array)
    let rolesNombres = [];
    if (data.roles_nombres && Array.isArray(data.roles_nombres) && data.roles_nombres.length > 0) {
        rolesNombres = data.roles_nombres;
    } else if (data.rol_nombre) {
        rolesNombres = [data.rol_nombre];
    } else {
        rolesNombres = ['revisor']; // Rol por defecto
    }

    // Buscar todos los roles
    const roles = await Rol.findAll({
        where: { 
            nombre: rolesNombres,
            estado: true 
        }
    });

    if (roles.length === 0) {
        throw new Error("No se encontraron roles válidos");
    }

    // Verificar si algún rol es director_regional y requiere regional_id
    const esDirectorRegional = roles.some(rol => rol.nombre === 'director_regional');
    if (esDirectorRegional && !data.regional_id) {
        throw new Error("El rol 'director_regional' requiere una regional asignada");
    }

    // Encriptar contraseña
    const hashedPassword = await Usuario.generatePassword(data.contrasena);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
        regional_id: data.regional_id || null,
        tipo_documento_id: tipoDocumento.id,
        documento: data.documento,
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        contrasena: hashedPassword,
        estado: true,
        intentos_fallidos: 0,
        bloqueado_hasta: null,
        ultimo_cambio_password: new Date(),
        password_debe_cambiar: data.password_debe_cambiar !== undefined ? data.password_debe_cambiar : true,
        created_by: usuarioCreadorId
    });

    // Asignar roles al usuario
    await nuevoUsuario.setRoles(roles);

    // Asignar centros si se proporcionaron
    if (data.centros_ids && Array.isArray(data.centros_ids) && data.centros_ids.length > 0) {
        await nuevoUsuario.setCentros(data.centros_ids);
    }

    // Obtener el usuario creado con relaciones
    const usuarioCreado = await findUsuarioById(nuevoUsuario.id);

    return {
        id: usuarioCreado.id,
        regional_id: usuarioCreado.regional_id,
        regional: usuarioCreado.regional ? {
            id: usuarioCreado.regional.id,
            codigo: usuarioCreado.regional.codigo,
            nombre: usuarioCreado.regional.nombre
        } : null,
        tipo_documento_id: usuarioCreado.tipo_documento_id,
        tipo_documento: usuarioCreado.tipo_documento ? {
            id: usuarioCreado.tipo_documento.id,
            codigo: usuarioCreado.tipo_documento.codigo,
            nombre: usuarioCreado.tipo_documento.nombre
        } : null,
        roles: usuarioCreado.roles ? usuarioCreado.roles.map(rol => ({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion
        })) : [],
        centros: usuarioCreado.centros ? usuarioCreado.centros.map(centro => ({
            id: centro.id,
            codigo: centro.codigo,
            nombre: centro.nombre,
            regional_id: centro.regional_id
        })) : [],
        documento: usuarioCreado.documento,
        nombres: usuarioCreado.nombres,
        apellidos: usuarioCreado.apellidos,
        correo: usuarioCreado.correo,
        telefono: usuarioCreado.telefono,
        direccion: usuarioCreado.direccion,
        estado: usuarioCreado.estado,
        password_debe_cambiar: usuarioCreado.password_debe_cambiar,
        creador: usuarioCreado.creador ? {
            id: usuarioCreado.creador.id,
            nombres: usuarioCreado.creador.nombres,
            apellidos: usuarioCreado.creador.apellidos,
            correo: usuarioCreado.creador.correo
        } : null,
        created_at: usuarioCreado.created_at,
        updated_at: usuarioCreado.updated_at
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
        regional_id: usuario.regional_id,
        regional: usuario.regional ? {
            id: usuario.regional.id,
            codigo: usuario.regional.codigo,
            nombre: usuario.regional.nombre
        } : null,
        tipo_documento_id: usuario.tipo_documento_id,
        tipo_documento: usuario.tipo_documento ? {
            id: usuario.tipo_documento.id,
            codigo: usuario.tipo_documento.codigo,
            nombre: usuario.tipo_documento.nombre
        } : null,
        roles: usuario.roles ? usuario.roles.map(rol => ({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion
        })) : [],
        centros: usuario.centros ? usuario.centros.map(centro => ({
            id: centro.id,
            codigo: centro.codigo,
            nombre: centro.nombre,
            regional_id: centro.regional_id
        })) : [],
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        estado: usuario.estado,
        password_debe_cambiar: usuario.password_debe_cambiar,
        ultimo_acceso: usuario.ultimo_acceso,
        creador: usuario.creador ? {
            id: usuario.creador.id,
            nombres: usuario.creador.nombres,
            apellidos: usuario.creador.apellidos,
            correo: usuario.creador.correo
        } : null,
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

    // Si se especifican roles, validar y actualizar
    if (data.roles_nombres && Array.isArray(data.roles_nombres) && data.roles_nombres.length > 0) {
        const roles = await Rol.findAll({
            where: { 
                nombre: data.roles_nombres,
                estado: true 
            }
        });
        if (roles.length === 0) {
            throw new Error("No se encontraron roles válidos");
        }
        // Los roles se asignarán después de actualizar
    } else if (data.rol_nombre) {
        const rol = await Rol.findOne({
            where: { nombre: data.rol_nombre, estado: true }
        });
        if (rol) {
            // El rol se asignará después de actualizar
        }
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

    // Actualizar campos básicos
    let usuarioActualizado = await updateUsuario(id, updateData);

    // Actualizar roles si se especificaron
    if (data.roles_nombres && Array.isArray(data.roles_nombres) && data.roles_nombres.length > 0) {
        const roles = await Rol.findAll({
            where: { 
                nombre: data.roles_nombres,
                estado: true 
            }
        });
        if (roles.length > 0) {
            const usuario = await Usuario.findByPk(id);
            await usuario.setRoles(roles);
            usuarioActualizado = await findUsuarioById(id);
        }
    } else if (data.rol_nombre) {
        const rol = await Rol.findOne({
            where: { nombre: data.rol_nombre, estado: true }
        });
        if (rol) {
            const usuario = await Usuario.findByPk(id);
            await usuario.setRoles([rol]);
            usuarioActualizado = await findUsuarioById(id);
        }
    }

    return {
        id: usuarioActualizado.id,
        regional_id: usuarioActualizado.regional_id,
        regional: usuarioActualizado.regional ? {
            id: usuarioActualizado.regional.id,
            codigo: usuarioActualizado.regional.codigo,
            nombre: usuarioActualizado.regional.nombre
        } : null,
        tipo_documento_id: usuarioActualizado.tipo_documento_id,
        tipo_documento: usuarioActualizado.tipo_documento ? {
            id: usuarioActualizado.tipo_documento.id,
            codigo: usuarioActualizado.tipo_documento.codigo,
            nombre: usuarioActualizado.tipo_documento.nombre
        } : null,
        roles: usuarioActualizado.roles ? usuarioActualizado.roles.map(rol => ({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion
        })) : [],
        centros: usuarioActualizado.centros ? usuarioActualizado.centros.map(centro => ({
            id: centro.id,
            codigo: centro.codigo,
            nombre: centro.nombre,
            regional_id: centro.regional_id
        })) : [],
        documento: usuarioActualizado.documento,
        nombres: usuarioActualizado.nombres,
        apellidos: usuarioActualizado.apellidos,
        correo: usuarioActualizado.correo,
        telefono: usuarioActualizado.telefono,
        direccion: usuarioActualizado.direccion,
        estado: usuarioActualizado.estado,
        password_debe_cambiar: usuarioActualizado.password_debe_cambiar,
        creador: usuarioActualizado.creador ? {
            id: usuarioActualizado.creador.id,
            nombres: usuarioActualizado.creador.nombres,
            apellidos: usuarioActualizado.creador.apellidos,
            correo: usuarioActualizado.creador.correo
        } : null,
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

