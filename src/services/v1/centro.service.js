import { buildPagination } from "../../utils/buildPagination.util.js";
import {
    getCentrosRepository,
    getListCentrosRepository,
    storeCentroRepository,
    showCentroRepository,
    updateCentroRepository,
    findCentroByIdRepository,
    findCentroByCodigoAndRegionalRepository,
    findCentroByCodigoAndRegionalExcludingIdRepository,
    findCentroByNombreAndRegionalRepository,
    findCentroByNombreAndRegionalExcludingIdRepository,
    checkCentroHasUsuariosRepository,
} from "../../repositories/centro.repository.js";
import { findRegionalByIdRepository } from "../../repositories/regional.repository.js";

/**
 * Servicio para obtener centros con filtros, orden y paginación.
 */
export const getCentrosService = async (req) => {
    const {
        id,
        regional_id,
        codigo,
        nombre,
        estado,
        search,
        sortBy = "nombre",
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
        regional_id,
        codigo,
        nombre,
        estado: estadoBoolean,
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
 * Servicio para obtener la lista de centros.
 */
export const getListCentrosService = async (regional_id, estado, sortBy = "nombre", order = "ASC") => {
    return await getListCentrosRepository(regional_id, estado, sortBy, order);
};

/**
 * Servicio para crear un nuevo centro.
 */
export const storeCentroService = async (data) => {
    // Verificar que la regional existe
    const regional = await findRegionalByIdRepository(data.regional_id);
    if (!regional) {
        const error = new Error(`La regional con ID ${data.regional_id} no existe.`);
        error.code = "REGIONAL_NOT_FOUND";
        throw error;
    }

    // Verificar que la regional esté activa
    if (!regional.estado) {
        const error = new Error(`La regional ${regional.nombre} está inactiva. No se pueden crear centros en regionales inactivas.`);
        error.code = "REGIONAL_INACTIVE";
        throw error;
    }

    // Verificar si ya existe un centro con el mismo código en la regional
    const existingCentro = await findCentroByCodigoAndRegionalRepository(data.codigo, data.regional_id);
    if (existingCentro) {
        const error = new Error(`El código ${data.codigo.toUpperCase()} ya está registrado en la regional ${regional.nombre}.`);
        error.code = "DUPLICATE_CENTRO_CODIGO";
        throw error;
    }

    // Verificar si ya existe un centro con el mismo nombre en la regional
    const existingCentroByNombre = await findCentroByNombreAndRegionalRepository(data.nombre, data.regional_id);
    if (existingCentroByNombre) {
        const error = new Error(`El nombre "${data.nombre}" ya está registrado en la regional ${regional.nombre}.`);
        error.code = "DUPLICATE_CENTRO_NAME";
        throw error;
    }

    return await storeCentroRepository(data);
};

/**
 * Servicio para mostrar un centro por id.
 */
export const showCentroService = async (id) => {
    return await showCentroRepository(id);
};

/**
 * Servicio para actualizar un centro.
 */
export const updateCentroService = async (id, data) => {
    const centro = await showCentroRepository(id);
    if (!centro) {
        const error = new Error("Centro no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Si se está cambiando la regional, verificar que existe y está activa
    if (data.regional_id && data.regional_id !== centro.regional_id) {
        const regional = await findRegionalByIdRepository(data.regional_id);
        if (!regional) {
            const error = new Error(`La regional con ID ${data.regional_id} no existe.`);
            error.code = "REGIONAL_NOT_FOUND";
            throw error;
        }

        if (!regional.activo) {
            const error = new Error(`La regional ${regional.nombre} está inactiva. No se puede asignar el centro a una regional inactiva.`);
            error.code = "REGIONAL_INACTIVE";
            throw error;
        }
    }

    const targetRegionalId = data.regional_id || centro.regional_id;

    // Si se está actualizando el código, verificar que no exista otro centro con el mismo código en la regional
    if (data.codigo && data.codigo.toUpperCase() !== centro.codigo) {
        const existingCentro = await findCentroByCodigoAndRegionalExcludingIdRepository(
            data.codigo, 
            targetRegionalId, 
            id
        );
        if (existingCentro) {
            const error = new Error(`El código "${data.codigo.toUpperCase()}" ya está registrado en esta regional.`);
            error.code = "DUPLICATE_CENTRO_CODIGO";
            throw error;
        }
    }

    // Si se está actualizando el nombre, verificar que no exista otro centro con el mismo nombre en la regional
    if (data.nombre && data.nombre !== centro.nombre) {
        const existingCentroByNombre = await findCentroByNombreAndRegionalExcludingIdRepository(
            data.nombre, 
            targetRegionalId, 
            id
        );
        if (existingCentroByNombre) {
            const error = new Error(`El nombre "${data.nombre}" ya está registrado en esta regional.`);
            error.code = "DUPLICATE_CENTRO_NAME";
            throw error;
        }
    }

    return await updateCentroRepository(id, data);
};

/**
 * Servicio para cambiar estado de un centro.
 */
export const changeCentroStatusService = async (id, nuevoEstado) => {
    const centro = await showCentroRepository(id);
    if (!centro) {
        const error = new Error("Centro no encontrado");
        error.code = "NOT_FOUND";
        throw error;
    }

    // Si se intenta desactivar, verificar que no tenga usuarios asociados
    if (nuevoEstado === false || nuevoEstado === 'false') {
        const hasUsuarios = await checkCentroHasUsuariosRepository(id);
        if (hasUsuarios) {
            const error = new Error("No se puede desactivar el centro porque tiene usuarios asociados. Primero desactive o reasigne los usuarios.");
            error.code = "CENTRO_HAS_USUARIOS";
            throw error;
        }
    }

    // Determinar el nuevo estado basado en el parámetro recibido
    let estadoFinal;
    
    if (typeof nuevoEstado === 'boolean') {
        // Si es boolean, usar directamente
        estadoFinal = nuevoEstado;
    } else if (nuevoEstado === 'true') {
        // Si es string 'true', activar
        estadoFinal = true;
    } else if (nuevoEstado === 'false') {
        // Si es string 'false', desactivar
        estadoFinal = false;
    } else {
        // Si no se especifica estado, alternar el estado actual
        estadoFinal = !centro.estado;
    }

    // Actualizar el estado del centro
    const updatedCentro = await updateCentroRepository(id, { estado: estadoFinal });
    return updatedCentro;
};

