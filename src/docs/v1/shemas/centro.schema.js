export const centroSchemas = {
    Centro: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Identificador único del centro',
                example: 1
            },
            regional_id: {
                type: 'integer',
                description: 'ID de la regional a la que pertenece',
                example: 1
            },
            codigo: {
                type: 'string',
                maxLength: 20,
                description: 'Código único del centro',
                example: 'CTR-001'
            },
            nombre: {
                type: 'string',
                maxLength: 300,
                description: 'Nombre del centro de formación',
                example: 'Centro de Gestión de Mercados, Logística y Tecnologías de la Información'
            },
            direccion: {
                type: 'string',
                maxLength: 300,
                description: 'Dirección del centro',
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
                description: 'Estado activo/inactivo del centro',
                example: true,
                default: true
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de creación del registro',
                example: '2025-10-07T10:00:00.000Z'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de última actualización del registro',
                example: '2025-10-07T10:00:00.000Z'
            },
            regional: {
                type: 'object',
                description: 'Información de la regional',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },
                    codigo: {
                        type: 'string',
                        example: 'REG-ANT'
                    },
                    nombre: {
                        type: 'string',
                        example: 'Regional Antioquia'
                    }
                }
            }
        },
        required: ['regional_id', 'codigo', 'nombre']
    },

    CentrosPaginados: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Centro'
                },
                description: 'Lista de centros'
            },
            meta: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer',
                        description: 'Total de registros',
                        example: 150
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
                        example: 15
                    }
                }
            },
            links: {
                type: 'object',
                properties: {
                    first: {
                        type: 'string',
                        example: '/api/v1/centros?page=1&limit=10'
                    },
                    last: {
                        type: 'string',
                        example: '/api/v1/centros?page=15&limit=10'
                    },
                    prev: {
                        type: 'string',
                        nullable: true,
                        example: null
                    },
                    next: {
                        type: 'string',
                        example: '/api/v1/centros?page=2&limit=10'
                    }
                }
            }
        }
    },

    CentroInput: {
        type: 'object',
        properties: {
            regional_id: {
                type: 'integer',
                description: 'ID de la regional',
                example: 1
            },
            codigo: {
                type: 'string',
                maxLength: 20,
                description: 'Código único del centro',
                example: 'CTR-001'
            },
            nombre: {
                type: 'string',
                maxLength: 300,
                description: 'Nombre del centro de formación',
                example: 'Centro de Gestión de Mercados'
            },
            direccion: {
                type: 'string',
                maxLength: 300,
                description: 'Dirección del centro',
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
        required: ['regional_id', 'codigo', 'nombre']
    },

    CentroUpdate: {
        type: 'object',
        properties: {
            regional_id: {
                type: 'integer',
                description: 'ID de la regional',
                example: 1
            },
            codigo: {
                type: 'string',
                maxLength: 20,
                description: 'Código único del centro',
                example: 'CTR-001'
            },
            nombre: {
                type: 'string',
                maxLength: 300,
                description: 'Nombre del centro de formación',
                example: 'Centro de Gestión de Mercados'
            },
            direccion: {
                type: 'string',
                maxLength: 300,
                description: 'Dirección del centro',
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

    CambiarEstadoCentro: {
        type: 'object',
        properties: {
            estado: {
                type: 'boolean',
                description: 'Nuevo estado del centro',
                example: false
            }
        },
        required: ['estado']
    }
};

