export const permisosSchemas = {
    Permiso: {
        type: 'object',
        description: 'NOTA: Los permisos son SOLO LECTURA. Se gestionan mediante src/database/data.sql',
        properties: {
            id: {
                type: 'integer',
                description: 'Identificador único del permiso',
                example: 1
            },
            nombre: {
                type: 'string',
                maxLength: 100,
                description: 'Nombre único del permiso',
                example: 'ver_usuarios_centro'
            },
            descripcion: {
                type: 'string',
                maxLength: 500,
                description: 'Descripción detallada del permiso',
                example: 'Permite ver usuarios del centro',
                nullable: true
            },
            estado: {
                type: 'boolean',
                description: 'Estado del permiso (activo/inactivo)',
                example: true,
                default: true
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de creación del registro',
                example: '2025-10-08T10:30:00.000Z'
            },
            updated_at: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha de última actualización del registro',
                example: '2025-10-08T10:30:00.000Z',
                nullable: true
            }
        },
        required: ['nombre']
    },

    PermisosPaginados: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Permiso'
                },
                description: 'Lista de permisos'
            },
            meta: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer',
                        description: 'Número total de permisos',
                        example: 25
                    },
                    page: {
                        type: 'integer',
                        description: 'Página actual',
                        example: 1
                    },
                    limit: {
                        type: 'integer',
                        description: 'Elementos por página',
                        example: 10
                    },
                    totalPages: {
                        type: 'integer',
                        description: 'Número total de páginas',
                        example: 3
                    }
                }
            },
            links: {
                type: 'object',
                properties: {
                    self: {
                        type: 'string',
                        description: 'URL de la página actual',
                        example: 'http://localhost:3000/api/v1/permisos?page=1&limit=10'
                    },
                    next: {
                        type: 'string',
                        description: 'URL de la página siguiente',
                        example: 'http://localhost:3000/api/v1/permisos?page=2&limit=10',
                        nullable: true
                    },
                    prev: {
                        type: 'string',
                        description: 'URL de la página anterior',
                        example: null,
                        nullable: true
                    }
                }
            }
        }
    },

    PermisoFiltros: {
        type: 'object',
        properties: {
            page: {
                type: 'integer',
                description: 'Número de página',
                example: 1,
                minimum: 1,
                default: 1
            },
            limit: {
                type: 'integer',
                description: 'Cantidad de elementos por página',
                example: 10,
                minimum: 1,
                maximum: 100,
                default: 10
            },
            nombre: {
                type: 'string',
                description: 'Filtrar por nombre del permiso (búsqueda parcial)',
                example: 'usuarios'
            },
            descripcion: {
                type: 'string',
                description: 'Filtrar por descripción del permiso (búsqueda parcial)',
                example: 'crear'
            },
            estado: {
                type: 'boolean',
                description: 'Filtrar por estado del permiso',
                example: true
            },
            sortBy: {
                type: 'string',
                description: 'Campo por el cual ordenar',
                example: 'nombre',
                enum: ['id', 'nombre', 'descripcion', 'estado', 'created_at']
            },
            order: {
                type: 'string',
                description: 'Orden ascendente o descendente',
                example: 'ASC',
                enum: ['ASC', 'DESC']
            }
        }
    },

    PermisoResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Indica si la operación fue exitosa',
                example: true
            },
            message: {
                type: 'string',
                description: 'Mensaje descriptivo de la operación',
                example: 'Permiso creado exitosamente'
            },
            data: {
                $ref: '#/components/schemas/Permiso',
                description: 'Datos del permiso'
            }
        }
    },

    PermisosListResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Indica si la operación fue exitosa',
                example: true
            },
            message: {
                type: 'string',
                description: 'Mensaje descriptivo de la operación',
                example: 'Lista de permisos obtenida exitosamente'
            },
            data: {
                $ref: '#/components/schemas/PermisosPaginados',
                description: 'Datos paginados de permisos'
            }
        }
    },

    PermisoEstadoResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Indica si la operación fue exitosa',
                example: true
            },
            message: {
                type: 'string',
                description: 'Mensaje descriptivo de la operación',
                example: 'Permiso desactivado exitosamente'
            },
            data: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID del permiso',
                        example: 1
                    },
                    nombre: {
                        type: 'string',
                        description: 'Nombre del permiso',
                        example: 'crear_usuarios'
                    },
                    estadoAnterior: {
                        type: 'boolean',
                        description: 'Estado anterior del permiso',
                        example: true
                    },
                    estadoActual: {
                        type: 'boolean',
                        description: 'Estado actual del permiso',
                        example: false
                    }
                }
            }
        }
    },

    PermisoSimpleList: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Indica si la operación fue exitosa',
                example: true
            },
            message: {
                type: 'string',
                description: 'Mensaje descriptivo de la operación',
                example: 'Lista de permisos obtenida exitosamente'
            },
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        nombre: {
                            type: 'string',
                            example: 'ver_usuarios'
                        },
                        descripcion: {
                            type: 'string',
                            example: 'Permite ver la lista de usuarios'
                        },
                        estado: {
                            type: 'boolean',
                            example: true
                        }
                    }
                },
                description: 'Lista simple de permisos'
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