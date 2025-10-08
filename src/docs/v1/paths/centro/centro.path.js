export const centroPaths = {
    '/centros': {
        get: {
            tags: ['Centro'],
            summary: 'Obtener lista paginada de centros',
            description: 'Retorna una lista paginada de centros con filtros opcionales. **ENDPOINT PÚBLICO - No requiere autenticación**',
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Número de página',
                    schema: {
                        type: 'integer',
                        default: 1,
                        minimum: 1
                    }
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Cantidad de registros por página',
                    schema: {
                        type: 'integer',
                        default: 10,
                        minimum: 1,
                        maximum: 100
                    }
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    description: 'Campo para ordenar',
                    schema: {
                        type: 'string',
                        default: 'nombre',
                        enum: ['id', 'codigo', 'nombre', 'regional_id', 'created_at']
                    }
                },
                {
                    name: 'order',
                    in: 'query',
                    description: 'Orden ascendente o descendente',
                    schema: {
                        type: 'string',
                        default: 'ASC',
                        enum: ['ASC', 'DESC']
                    }
                },
                {
                    name: 'estado',
                    in: 'query',
                    description: 'Filtrar por estado',
                    schema: {
                        type: 'string',
                        enum: ['true', 'false', 'todos']
                    }
                },
                {
                    name: 'regional_id',
                    in: 'query',
                    description: 'Filtrar por ID de regional',
                    schema: {
                        type: 'integer'
                    }
                },
                {
                    name: 'codigo',
                    in: 'query',
                    description: 'Filtrar por código',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'nombre',
                    in: 'query',
                    description: 'Filtrar por nombre',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'Búsqueda global en código, nombre y dirección',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Lista de centros obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CentrosPaginados'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor'
                }
            }
        },
        post: {
            tags: ['Centro'],
            summary: 'Crear un nuevo centro',
            description: 'Crea un nuevo centro de formación (Admin Nacional y Director Regional)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CentroInput'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Centro creado exitosamente'
                },
                400: {
                    description: 'Error de validación o código/nombre duplicado'
                },
                403: {
                    description: 'Prohibido - Solo Admin Nacional y Director Regional'
                },
                404: {
                    description: 'Regional no encontrada'
                },
                500: {
                    description: 'Error del servidor'
                }
            }
        }
    },
    '/centros/list': {
        get: {
            tags: ['Centro'],
            summary: 'Obtener lista simplificada de centros',
            description: 'Retorna una lista sin paginación de centros para selects y dropdowns. **ENDPOINT PÚBLICO - No requiere autenticación**',
            parameters: [
                {
                    name: 'regional_id',
                    in: 'query',
                    description: 'Filtrar por regional',
                    schema: {
                        type: 'integer'
                    }
                },
                {
                    name: 'estado',
                    in: 'query',
                    description: 'Filtrar por estado',
                    schema: {
                        type: 'string',
                        enum: ['true', 'false']
                    }
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    description: 'Campo para ordenar',
                    schema: {
                        type: 'string',
                        default: 'nombre',
                        enum: ['id', 'codigo', 'nombre']
                    }
                },
                {
                    name: 'order',
                    in: 'query',
                    description: 'Orden',
                    schema: {
                        type: 'string',
                        default: 'ASC',
                        enum: ['ASC', 'DESC']
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Lista simplificada obtenida exitosamente'
                },
                500: {
                    description: 'Error del servidor'
                }
            }
        }
    },
    '/centros/{id}': {
        get: {
            tags: ['Centro'],
            summary: 'Obtener un centro por ID',
            description: 'Retorna los detalles de un centro específico. **ENDPOINT PÚBLICO - No requiere autenticación**',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID del centro',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Centro encontrado'
                },
                404: {
                    description: 'Centro no encontrado'
                },
                500: {
                    description: 'Error del servidor'
                }
            }
        },
        put: {
            tags: ['Centro'],
            summary: 'Actualizar un centro',
            description: 'Actualiza los datos de un centro existente (Admin Nacional y Director Regional)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID del centro',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CentroUpdate'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Centro actualizado exitosamente'
                },
                400: {
                    description: 'Error de validación'
                },
                403: {
                    description: 'Prohibido'
                },
                404: {
                    description: 'Centro no encontrado'
                },
                500: {
                    description: 'Error del servidor'
                }
            }
        }
    },
    '/centros/{id}/estado': {
        patch: {
            tags: ['Centro'],
            summary: 'Cambiar estado de un centro',
            description: 'Activa o desactiva un centro (Admin Nacional y Director Regional)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID del centro',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CambiarEstadoCentro'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Estado cambiado exitosamente'
                },
                403: {
                    description: 'Prohibido'
                },
                404: {
                    description: 'Centro no encontrado'
                },
                409: {
                    description: 'Conflicto - Centro tiene usuarios asociados'
                },
                500: {
                    description: 'Error del servidor'
                }
            }
        }
    }
};

