import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getRegionalesRepository,
    getListRegionalesRepository,
    storeRegionalRepository,
    showRegionalRepository,
    updateRegionalRepository,
    findRegionalByIdRepository,
    findRegionalByCodigoRepository,
    findRegionalByCodigoExcludingIdRepository,
    findRegionalByNombreRepository,
    findRegionalByNombreExcludingIdRepository,
    checkRegionalHasCentrosRepository,
} from "../../repositories/regional.repository.js";

/**
 * Servicio para obtener regionales con filtros, orden y paginación.
 */
export const getRegionalesService = async (req) => {
    const {
        id,
        codigo,
        nombre,
        activo,
        search,
        sortBy = "nombre",
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
    const { data, count } = await getRegionalesRepository({
        id,
        codigo,
        nombre,
        activo: activoBoolean,
        search,
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
 * Servicio para obtener la lista de regionales.
 */
export const getListRegionalesService = async (activo, sortBy = "nombre", order = "ASC") => {
    return await getListRegionalesRepository(activo, sortBy, order);
};

/**
 * Servicio para crear una nueva regional.
 */
export const storeRegionalService = async (data) => {
    // Verificar si ya existe una regional con el mismo código
    const existingRegionalByCodigo = await findRegionalByCodigoRepository(data.codigo);
    if (existingRegionalByCodigo) {
        const error = new Error(`El código ${data.codigo.toUpperCase()} ya está registrado. No se puede repetir el código.`);
        error.code = "DUPLICATE_REGIONAL_CODIGO";
        throw error;
    }

    // Verificar si ya existe una regional con el mismo nombre
    const existingRegionalByNombre = await findRegionalByNombreRepository(data.nombre);
    if (existingRegionalByNombre) {
        const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
        error.code = "DUPLICATE_REGIONAL_NAME";
        throw error;
    }

    return await storeRegionalRepository(data);
};

/**
 * Servicio para mostrar una regional por id.
 */
export const showRegionalService = async (id) => {
    return await showRegionalRepository(id);
};

/**
 * Servicio para actualizar una regional.
 */
export const updateRegionalService = async (id, data) => {
    const regional = await showRegionalRepository(id);
    if (!regional) {
        const error = new Error("Regional no encontrada");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Si se está actualizando el código, verificar que no exista otra regional con el mismo código
    if (data.codigo && data.codigo.toUpperCase() !== regional.codigo) {
        const existingRegionalByCodigo = await findRegionalByCodigoExcludingIdRepository(data.codigo, id);
        if (existingRegionalByCodigo) {
            const error = new Error(`El código "${data.codigo.toUpperCase()}" ya está registrado. No se puede repetir el código.`);
            error.code = "DUPLICATE_REGIONAL_CODIGO";
            throw error;
        }
    }

    // Si se está actualizando el nombre, verificar que no exista otra regional con el mismo nombre
    if (data.nombre && data.nombre !== regional.nombre) {
        const existingRegionalByNombre = await findRegionalByNombreExcludingIdRepository(data.nombre, id);
        if (existingRegionalByNombre) {
            const error = new Error(`El nombre "${data.nombre}" ya está registrado. No se puede repetir el nombre.`);
            error.code = "DUPLICATE_REGIONAL_NAME";
            throw error;
        }
    }

    return await updateRegionalRepository(id, data);
};

/**
 * Servicio para cambiar estado de una regional.
 */
export const changeRegionalStatusService = async (id, nuevoActivo) => {
    const regional = await showRegionalRepository(id);
    if (!regional) {
        const error = new Error("Regional no encontrada");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Si se intenta desactivar, verificar que no tenga centros asociados
    if (nuevoActivo === false || nuevoActivo === 'false') {
        const hasCentros = await checkRegionalHasCentrosRepository(id);
        if (hasCentros) {
            const error = new Error("No se puede desactivar la regional porque tiene centros de formación asociados. Primero desactive o reasigne los centros.");
            error.code = "REGIONAL_HAS_CENTROS";
            throw error;
        }
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
        nuevoEstado = !regional.activo;
    }

    // Actualizar el estado de la regional
    const updatedRegional = await updateRegionalRepository(id, { activo: nuevoEstado });
    return updatedRegional;
};

