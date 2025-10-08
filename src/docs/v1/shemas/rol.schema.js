export const rolesSchemas = {
    Role: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Identificador único del rol',
                example: 1
            },
            nombre: {
                type: 'string',
                maxLength: 50,
                description: 'Nombre único del rol (revisor, administrador_centro, director_regional, admin)',
                example: 'admin'
            },
            descripcion: {
                type: 'string',
                maxLength: 500,
                description: 'Descripción detallada del rol',
                example: 'Administrador Nacional. Alcance: Todo el sistema.',
                nullable: true
            },
            estado: {
                type: 'boolean',
                description: 'Estado del rol (activo/inactivo)',
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
                example: '2025-10-08T10:30:00.000Z'
            },
            permisos: {
                type: 'array',
                description: 'Permisos asignados al rol',
                items: {
                    $ref: '#/components/schemas/Permiso'
                }
            }
        },
        required: ['nombre']
    },

    RoleInput: {
        type: 'object',
        properties: {
            nombre: {
                type: 'string',
                maxLength: 50,
                description: 'Nombre único del rol',
                example: 'supervisor'
            },
            descripcion: {
                type: 'string',
                maxLength: 500,
                description: 'Descripción del rol',
                example: 'Supervisor de área con permisos específicos'
            },
            estado: {
                type: 'boolean',
                description: 'Estado inicial del rol',
                example: true,
                default: true
            },
            permisos: {
                type: 'array',
                description: 'IDs de permisos a asignar al rol',
                items: {
                    type: 'integer'
                },
                example: [1, 2, 3, 5, 8]
            }
        },
        required: ['nombre']
    },

    RoleUpdate: {
        type: 'object',
        properties: {
            nombre: {
                type: 'string',
                maxLength: 50,
                description: 'Nombre del rol (no editable para roles del sistema)',
                example: 'supervisor_actualizado'
            },
            descripcion: {
                type: 'string',
                maxLength: 500,
                description: 'Descripción actualizada del rol',
                example: 'Descripción actualizada del supervisor'
            },
            permisos: {
                type: 'array',
                description: 'IDs de permisos a asignar al rol',
                items: {
                    type: 'integer'
                },
                example: [1, 2, 3, 5, 8, 13]
            }
        }
    },

    CambiarEstadoRol: {
        type: 'object',
        properties: {
            estado: {
                type: 'boolean',
                description: 'Nuevo estado del rol',
                example: false
            }
        },
        required: ['estado']
    },

    RolesPaginados: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Role'
                },
                description: 'Lista de roles'
            },
            meta: {
                type: 'object',
                properties: {
                    total: {
                        type: 'integer',
                        description: 'Total de registros',
                        example: 4
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
                        example: 1
                    }
                }
            }
        }
    }
};