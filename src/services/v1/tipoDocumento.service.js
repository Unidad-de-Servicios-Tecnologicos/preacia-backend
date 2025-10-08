import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getTipoDocumentosRepository,
    getListTipoDocumentosRepository,
    storeTipoDocumentoRepository,
    showTipoDocumentoRepository,
    updateTipoDocumentoRepository,
    findTipoDocumentoByIdRepository,
    findTipoDocumentoByCodigoRepository,
    findTipoDocumentoByCodigoExcludingIdRepository,
    findTipoDocumentoByNombreRepository,
    findTipoDocumentoByNombreExcludingIdRepository,
} from "../../repositories/tipoDocumento.repository.js";

/**
 * Servicio para obtener tipos de documentos con filtros, orden y paginación.
 */
export const getTipoDocumentosService = async (req) => {
    const {
        id,
        codigo,
        nombre,
        activo,
        search, // Agregamos el parámetro search
        sortBy = "id",
        order = "ASC",
        page = 1,
        limit = 10
    } = req.query;

    // Convertir activo string a boolean si es necesario
    let activoBoolean = activo;
    if (activo === 'true' || activo === 'activo') activoBoolean = true;
    if (activo === 'false' || activo === 'inactivo') activoBoolean = false;
    if (activo === undefined || activo === null || activo === 'todos') activoBoolean = undefined;

    // Lógica de filtros y paginación delegada al repositorio
    const { data, count } = await getTipoDocumentosRepository({
        id,
        codigo,
        nombre,
        activo: activoBoolean,
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
export const getListTipoDocumentosService = async (activo, sortBy = "id", order = "ASC") => {
    return await getListTipoDocumentosRepository(activo, sortBy, order);
};

/**
 * Servicio para crear un nuevo tipo de documento.
 */
export const storeTipoDocumentoService = async (data) => {
    // Verificar si ya existe un tipo de documento con el mismo código
    const existingTipoDocumentoByCodigo = await findTipoDocumentoByCodigoRepository(data.codigo);
    if (existingTipoDocumentoByCodigo) {
        const error = new Error(`El código ${data.codigo.toUpperCase()} ya está registrado. No se puede repetir el código.`);
        error.code = "DUPLICATE_TIPO_DOCUMENTO_CODIGO";
        throw error;
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

    // Si se está actualizando el código, verificar que no exista otro tipo de documento con el mismo código
    if (data.codigo && data.codigo.toUpperCase() !== tipoDocumento.codigo) {
        const existingTipoDocumentoByCodigo = await findTipoDocumentoByCodigoExcludingIdRepository(data.codigo, id);
        if (existingTipoDocumentoByCodigo) {
            const error = new Error(`El código "${data.codigo.toUpperCase()}" ya está registrado. No se puede repetir el código.`);
            error.code = "DUPLICATE_TIPO_DOCUMENTO_CODIGO";
            throw error;
        }
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
export const changeTipoDocumentoStatusService = async (id, nuevoActivo) => {
    const tipoDocumento = await showTipoDocumentoRepository(id);
    if (!tipoDocumento) {
        const error = new Error("Tipo de documento no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Determinar el nuevo estado basado en el parámetro recibido
    let nuevoEstado;
    
    if (typeof nuevoActivo === 'boolean') {
        // Si es boolean, usar directamente
        nuevoEstado = nuevoActivo;
    } else if (nuevoActivo === 'true') {
        // Si es string 'true', activar
        nuevoEstado = true;
    } else if (nuevoActivo === 'false') {
        // Si es string 'false', desactivar
        nuevoEstado = false;
    } else {
        // Si no se especifica estado, alternar el estado actual
        nuevoEstado = !tipoDocumento.activo;
    }

    // Actualizar el estado del tipo de documento
    const updatedTipoDocumento = await updateTipoDocumentoRepository(id, { activo: nuevoEstado });
    return updatedTipoDocumento;
};
