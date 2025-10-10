import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getTipoDocumentosRepository,
    getListTipoDocumentosRepository,
    storeTipoDocumentoRepository,
    showTipoDocumentoRepository,
    updateTipoDocumentoRepository,
    findTipoDocumentoByIdRepository,
    findTipoDocumentoByNombreRepository,
    findTipoDocumentoByNombreExcludingIdRepository,
} from "../../repositories/tipoDocumento.repository.js";
import { EstadoEnum } from "../../enums/estado.enum.js";

/**
 * Servicio para obtener centros con filtros, orden y paginación.
 */
export const getTipoDocumentosService = async (req) => {
    const {
        id,
        nombre,
        estado,
        search, // Agregamos el parámetro search
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
    const { data, count } = await getTipoDocumentosRepository({
        id,
        nombre,
        estado: estadoBoolean,
        search, // Pasamos el parámetro search al repositorio
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
 * Servicio para obtener la lista de tipos de documentos.
 */
export const getListTipoDocumentosService = async (estado, sortBy = "id", order = "ASC") => {
    return await getListTipoDocumentosRepository(estado, sortBy, order);
};

/**
 * Servicio para crear un nuevo tipo de documento.
 */
export const storeTipoDocumentoService = async (data) => {
    // Verificar si ya existe un tipo de documento con el mismo ID (solo si se proporcionó)
    if (data.id !== undefined && data.id !== null) {
        const existingTipoDocumentoById = await findTipoDocumentoByIdRepository(data.id);
        if (existingTipoDocumentoById) {
            const error = new Error(`El ID ${data.id} ya está registrado. No se puede repetir el ID.`);
            error.code = "DUPLICATE_TIPO_DOCUMENTO_ID";
            throw error;
        }
    }

    // Verificar si ya existe un tipo de documento con el mismo nombre
    const existingTipoDocumentoByNombre = await findTipoDocumentoByNombreRepository(data.nombre);
    if (existingTipoDocumentoByNombre) {
        const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
        error.code = "DUPLICATE_TIPO_DOCUMENTO_NAME";
        throw error;
    }

    return await storeTipoDocumentoRepository(data);
};

/**
 * Servicio para mostrar un tipo de documento por id.
 */
export const showTipoDocumentoService = async (id) => {
    return await showTipoDocumentoRepository(id);
};

/**
 * Servicio para actualizar un tipo de documento.
 */
export const updateTipoDocumentoService = async (id, data) => {
    const tipoDocumento = await showTipoDocumentoRepository(id);
    if (!tipoDocumento) {
        const error = new Error("Tipo de documento no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Si se está actualizando el nombre, verificar que no exista otro tipo de documento con el mismo nombre
    if (data.nombre && data.nombre !== tipoDocumento.nombre) {
        const existingTipoDocumentoByNombre = await findTipoDocumentoByNombreExcludingIdRepository(data.nombre, id);
        if (existingTipoDocumentoByNombre) {
            const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
            error.code = "DUPLICATE_TIPO_DOCUMENTO_NAME";
            throw error;
        }
    }

    return await updateTipoDocumentoRepository(id, data);
};

/**
 * Servicio para cambiar estado de un tipo de documento.
 */
export const changeTipoDocumentoStatusService = async (id, nuevoEstado) => {
    const tipoDocumento = await showTipoDocumentoRepository(id);
    if (!tipoDocumento) {
        const error = new Error("Tipo de documento no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Determinar el nuevo estado basado en el parámetro recibido
    let nuevoEstadoEnum;
    
    if (typeof nuevoEstado === 'boolean') {
        // Si es boolean, usar directamente
        nuevoEstadoEnum = nuevoEstado ? EstadoEnum.ACTIVO : EstadoEnum.INACTIVO;
    } else if (nuevoEstado === 'true') {
        // Si es string 'true', activar
        nuevoEstadoEnum = EstadoEnum.ACTIVO;
    } else if (nuevoEstado === 'false') {
        // Si es string 'false', desactivar
        nuevoEstadoEnum = EstadoEnum.INACTIVO;
    } else {
        // Si no se especifica estado, alternar el estado actual
        const estadoActual = tipoDocumento.estado;
        nuevoEstadoEnum = estadoActual ? EstadoEnum.INACTIVO : EstadoEnum.ACTIVO;
    }

    // Actualizar el estado del tipo de documento
    const updatedTipoDocumento = await updateTipoDocumentoRepository(id, { estado: nuevoEstadoEnum });
    return updatedTipoDocumento;
};
