export const regionalSchemas = {
    Regional: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Identificador único de la regional',
                example: 1
            },
            codigo: {
                type: 'string',
                maxLength: 20,
                description: 'Código único de la regional',
                example: 'REG-ANT'
            },
            nombre: {
                type: 'string',
                maxLength: 200,
                description: 'Nombre de la regional',
                example: 'Regional Antioquia'
            },
            direccion: {
                type: 'string',
                maxLength: 300,
                description: 'Dirección de la regional',
                example: 'Calle 52 No. 48-09'
            },
            telefono: {
                type: 'string',
                maxLength: 20,
                description: 'Teléfono de contacto',
                example: '(604) 360-0000'
            },
            estado: {
                type: 'boolean',
                description: 'Estado activo/inactivo de la regional',
                example: true,
                default: true
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de creación del registro',
                example: '2024-01-15T10:30:00.000Z'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de última actualización del registro',
                example: '2024-01-15T10:30:00.000Z'
            }
        },
        required: ['codigo', 'nombre']
    },

    RegionalesPaginados: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Regional'
                },
                description: 'Lista de regionales'
            },
            meta: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer',
                        description: 'Total de registros',
                        example: 33
                    },
                    page: {
                        type: 'integer',
                        description: 'Página actual',
                        example: 1
                    },
                    limit: {
                        type: 'integer',
                        description: 'Registros por página',
                        example: 10
                    },
                    totalPages: {
                        type: 'integer',
                        description: 'Total de páginas',
                        example: 4
                    }
                }
            },
            links: {
                type: 'object',
                properties: {
                    first: {
                        type: 'string',
                        example: '/api/v1/regional?page=1&limit=10'
                    },
                    last: {
                        type: 'string',
                        example: '/api/v1/regional?page=4&limit=10'
                    },
                    prev: {
                        type: 'string',
                        nullable: true,
                        example: null
                    },
                    next: {
                        type: 'string',
                        example: '/api/v1/regional?page=2&limit=10'
                    }
                }
            }
        }
    },

    RegionalInput: {
        type: 'object',
        properties: {
            codigo: {
                type: 'string',
                maxLength: 20,
                description: 'Código único de la regional',
                example: 'REG-ANT'
            },
            nombre: {
                type: 'string',
                maxLength: 200,
                description: 'Nombre de la regional',
                example: 'Regional Antioquia'
            },
            direccion: {
                type: 'string',
                maxLength: 300,
                description: 'Dirección de la regional',
                example: 'Calle 52 No. 48-09'
            },
            telefono: {
                type: 'string',
                maxLength: 20,
                description: 'Teléfono de contacto',
                example: '(604) 360-0000'
            },
            estado: {
                type: 'boolean',
                description: 'Estado activo/inactivo',
                example: true
            }
        },
        required: ['codigo', 'nombre']
    },

    RegionalUpdate: {
        type: 'object',
        properties: {
            codigo: {
                type: 'string',
                maxLength: 20,
                description: 'Código único de la regional',
                example: 'REG-ANT'
            },
            nombre: {
                type: 'string',
                maxLength: 200,
                description: 'Nombre de la regional',
                example: 'Regional Antioquia'
            },
            direccion: {
                type: 'string',
                maxLength: 300,
                description: 'Dirección de la regional',
                example: 'Calle 52 No. 48-09'
            },
            telefono: {
                type: 'string',
                maxLength: 20,
                description: 'Teléfono de contacto',
                example: '(604) 360-0000'
            },
            estado: {
                type: 'boolean',
                description: 'Estado activo/inactivo',
                example: true
            }
        }
    },

    CambiarEstadoRegional: {
        type: 'object',
        properties: {
            estado: {
                type: 'boolean',
                description: 'Nuevo estado de la regional',
                example: false
            }
        },
        required: ['estado']
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
            errors: {
                type: 'array',
                description: 'Lista de errores',
                items: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                            example: 'VALIDATION_ERROR'
                        },
                        detail: {
                            type: 'string',
                            example: 'El campo es requerido'
                        }
                    }
                }
            }
        }
    }
};

