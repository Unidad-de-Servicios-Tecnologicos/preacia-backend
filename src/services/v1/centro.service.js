import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getCentrosRepository,
    getListCentrosRepository,
    storeCentroRepository,
    showCentroRepository,
    updateCentroRepository,
    findCentroByCodigoRepository,
    findCentroByNombreRepository,
    findCentroByNombreExcludingCodigoRepository,
} from "../../repositories/centro.repository.js";

/**
 * Servicio para obtener centros con filtros, orden y paginación.
 */
export const getCentrosService = async (req) => {
    const {
        id,
        codigo,
        nombre,
        direccion,
        ciudad_id,
        regional_id,
        supervisores_id,
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
    const { data, count } = await getCentrosRepository({
        id,
        codigo,
        nombre,
        direccion,
        ciudad_id,
        regional_id,
        supervisores_id,
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
 * Servicio para obtener la lista de centros.
 */
export const getListCentrosService = async (estado, sortBy = "id", order = "ASC") => {
    return await getListCentrosRepository(estado, sortBy, order);
};

/**
 * Servicio para crear un nuevo centro.
 */
export const storeCentroService = async (data) => {
    // Verificar si ya existe un centro con el mismo código
    const existingCentroByCodigo = await findCentroByCodigoRepository(data.codigo);
    if (existingCentroByCodigo) {
        const error = new Error(`El código ${data.codigo} ya está registrado. No se puede repetir el código.`);
        error.code = "DUPLICATE_CENTRO_CODE";
        throw error;
    }

    // Verificar si ya existe un centro con el mismo nombre
    const existingCentroByNombre = await findCentroByNombreRepository(data.nombre);
    if (existingCentroByNombre) {
        const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
        error.code = "DUPLICATE_CENTRO_NAME";
        throw error;
    }

    return await storeCentroRepository(data);
};

/**
 * Servicio para mostrar un centro por código.
 */
export const showCentroService = async (code) => {
    return await showCentroRepository(code);
};

/**
 * Servicio para actualizar un centro.
 */
export const updateCentroService = async (code, data) => {
    const centro = await showCentroRepository(code);
    if (!centro) {
        const error = new Error("Centro no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Si se está actualizando el nombre, verificar que no exista otro centro con el mismo nombre
    if (data.nombre && data.nombre !== centro.nombre) {
        const existingCentroByNombre = await findCentroByNombreExcludingCodigoRepository(data.nombre, code);
        if (existingCentroByNombre) {
            const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
            error.code = "DUPLICATE_CENTRO_NAME";
            throw error;
        }
    }

    return await updateCentroRepository(code, data);
};

/**
 * Servicio para cambiar estado de un centro.
 */
export const changeCentroStatusService = async (code, nuevoEstado) => {
    const centro = await showCentroRepository(code);
    if (!centro) {
        const error = new Error("Centro no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Convertir el estado recibido a boolean si es necesario
    let estadoBoolean;
    if (typeof nuevoEstado === 'boolean') {
        estadoBoolean = nuevoEstado;
    } else if (nuevoEstado === 'true') {
        estadoBoolean = true;
    } else if (nuevoEstado === 'false') {
        estadoBoolean = false;
    } else {
        // Si no se envía estado, cambiar al opuesto
        estadoBoolean = !centro.estado;
    }



    // Actualizar el estado del centro
    const updatedCentro = await updateCentroRepository(code, { estado: estadoBoolean });
    return updatedCentro;
};
