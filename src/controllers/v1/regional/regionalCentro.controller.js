import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { showRegionalService } from "../../../services/v1/regional.service.js";
import { getListCentrosService } from "../../../services/v1/centro.service.js";

/**
 * Controlador para obtener todos los centros de una regional específica (sin paginación)
 * @route GET /api/v1/regional/:id/centros
 */
export const getCentrosByRegional = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      estado, 
      sortBy = "nombre", 
      order = "ASC"
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

    // Obtener centros sin paginación
    const { data, count } = await getListCentrosService(id, estado, sortBy, order);

    return successResponse(
      res,
      data,
      200,
      {
        count
      }
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

