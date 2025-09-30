const ApplyPagination = async (model, page = 1, limit = 10, options = {}) => {

  try {
    const offset = (page - 1) * limit;

    // Obtener total de registros con las mismas opciones (filtros, etc.)
    const totalItems = await model.count({ ...options });

    // Obtener los datos paginados
    const data = await model.findAll({
      ...options, // Permite agregar include, where, etc.
      limit,
      offset,
    });

    return {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      data,
    };
  } catch (error) {
    throw new Error(`Error en paginación: ${error.message}`);
  }
};

export default ApplyPagination;
