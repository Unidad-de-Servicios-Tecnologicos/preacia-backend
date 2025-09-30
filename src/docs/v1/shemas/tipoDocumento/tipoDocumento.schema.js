export const tipoDocumentoSchemas = {
    TipoDocumento: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Identificador único del tipo de documento',
                example: 1
            },
            nombre: {
                type: 'string',
                maxLength: 45,
                description: 'Nombre completo del tipo de documento',
                example: 'Tipo de Documento 1'
            },
            estado: {
                type: 'string',
                maxLength: 45,
                description: 'Estado del tipo de documento',
                example: 'activo',
                enum: ['activo', 'inactivo'],
                default: 'activo'
            },
            fecha_creacion: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de creación del registro',
                example: '2024-01-15T10:30:00.000Z'
            },
            fecha_actualizacion: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de última actualización del registro',
                example: '2024-01-15T10:30:00.000Z'
            }
        },
        required: ['nombre', 'estado']
    },



    CentrosPaginados: {
        type: 'object',
        properties: {
            centros: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Centro'
                },
                description: 'Lista de centros'
            },
            totalPages: {
                type: 'integer',
                description: 'Número total de páginas',
                example: 5
            },
            currentPage: {
                type: 'integer',
                description: 'Página actual',
                example: 1
            },
            totalItems: {
                type: 'integer',
                description: 'Número total de elementos',
                example: 47
            },
            itemsPerPage: {
                type: 'integer',
                description: 'Elementos por página',
                example: 10
            },
            hasNextPage: {
                type: 'boolean',
                description: 'Indica si hay una página siguiente',
                example: true
            },
            hasPreviousPage: {
                type: 'boolean',
                description: 'Indica si hay una página anterior',
                example: false
            }
        }
    },
    ErrorResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Indica si la operación fue exitosa',
                example: false
            },
            message: {
                type: 'string',
                description: 'Mensaje descriptivo del error',
                example: 'Error en la operación'
            },
            error: {
                type: 'string',
                description: 'Descripción detallada del error',
                example: 'Descripción específica del error'
            },
            errors: {
                type: 'array',
                description: 'Lista de errores de validación',
                items: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            example: 'field'
                        },
                        msg: {
                            type: 'string',
                            example: 'El campo es requerido'
                        },
                        path: {
                            type: 'string',
                            example: 'nombre'
                        },
                        location: {
                            type: 'string',
                            example: 'body'
                        }
                    }
                }
            }
        }
    }
};