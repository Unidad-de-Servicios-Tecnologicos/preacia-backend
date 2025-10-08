import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { showRegionalService } from "../../../services/v1/regional.service.js";
import { getCentrosService } from "../../../services/v1/centro.service.js";

/**
 * Controlador para obtener todos los centros de una regional específica
 * @route GET /api/v1/regional/:id/centros
 */
export const getCentrosByRegional = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      estado, 
      sortBy = "nombre", 
      order = "ASC",
      page = 1,
      limit = 10 
    } = req.query;

    // Verificar que la regional existe
    const regional = await showRegionalService(id);
    if (!regional) {
      return errorResponse(res, "Regional no encontrada", 404, [
        {
          code: "REGIONAL_NOT_FOUND",
          detail: `No existe una regional con ID ${id}`,
        },
      ]);
    }

    // Crear un request modificado con el filtro de regional
    const modifiedReq = {
      ...req,
      query: {
        ...req.query,
        regional_id: id,
        estado,
        sortBy,
        order,
        page,
        limit
      }
    };

    const {
      data,
      meta,
      links
    } = await getCentrosService(modifiedReq);

    return successResponse(
      res,
      data,
      200,
      {
        ...meta,
        regional: {
          id: regional.id,
          codigo: regional.codigo,
          nombre: regional.nombre
        }
      },
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los centros de la regional", 500, [
      {
        code: "GET_CENTROS_BY_REGIONAL_ERROR",
        detail: error.message,
      },
    ]);
  }
};

