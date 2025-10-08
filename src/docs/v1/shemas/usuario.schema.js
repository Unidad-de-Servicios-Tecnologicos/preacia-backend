export const usuarioSchemas = {
    Usuario: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Identificador único del usuario',
                example: 1
            },
            tipo_documento_id: {
                type: 'integer',
                description: 'ID del tipo de documento',
                example: 1
            },
            roles: {
                type: 'array',
                description: 'Roles asignados al usuario',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 2
                        },
                        nombre: {
                            type: 'string',
                            example: 'Aprendiz'
                        }
                    }
                }
            },
            documento: {
                type: 'string',
                maxLength: 20,
                description: 'Número de documento de identificación',
                example: '1234567890'
            },
            nombres: {
                type: 'string',
                maxLength: 100,
                description: 'Nombres del usuario',
                example: 'Juan Carlos'
            },
            apellidos: {
                type: 'string',
                maxLength: 100,
                description: 'Apellidos del usuario',
                example: 'Pérez García'
            },
            correo: {
                type: 'string',
                maxLength: 50,
                format: 'email',
                description: 'Correo electrónico del usuario',
                example: 'juan.perez@example.com'
            },
            telefono: {
                type: 'string',
                maxLength: 15,
                description: 'Número de teléfono',
                example: '3001234567',
                nullable: true
            },
            direccion: {
                type: 'string',
                maxLength: 100,
                description: 'Dirección de residencia',
                example: 'Calle 123 # 45-67',
                nullable: true
            },
            estado: {
                type: 'boolean',
                description: 'Estado activo/inactivo del usuario',
                example: true,
                default: true
            },
            ultimo_acceso: {
                type: 'string',
                format: 'date-time',
                description: 'Fecha del último acceso al sistema',
                example: '2024-01-15T10:30:00.000Z',
                nullable: true
            },
            acia_id: {
                type: 'string',
                maxLength: 50,
                description: 'ID en sistema externo ACIA',
                example: 'ACIA-12345',
                nullable: true
            },
            verificado_acia: {
                type: 'boolean',
                description: 'Indica si el usuario está verificado por ACIA',
                example: false,
                default: false
            },
            centros: {
                type: 'array',
                description: 'Centros asociados al usuario',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        codigo: { type: 'string' },
                        nombre: { type: 'string' }
                    }
                }
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
        required: ['tipo_documento_id', 'documento', 'nombres', 'correo']
    },

    UsuariosPaginados: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true
            },
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Usuario'
                },
                description: 'Lista de usuarios'
            },
            meta: {
                type: 'object',
                properties: {
                    totalRegistros: {
                        type: 'integer',
                        description: 'Total de registros',
                        example: 100
                    },
                    totalPaginas: {
                        type: 'integer',
                        description: 'Total de páginas',
                        example: 10
                    },
                    paginaActual: {
                        type: 'integer',
                        description: 'Página actual',
                        example: 1
                    },
                    registrosPorPagina: {
                        type: 'integer',
                        description: 'Registros por página',
                        example: 10
                    }
                }
            },
            links: {
                type: 'object',
                properties: {
                    self: {
                        type: 'string',
                        example: '/api/v1/usuarios?page=1&limit=10'
                    },
                    first: {
                        type: 'string',
                        example: '/api/v1/usuarios?page=1&limit=10'
                    },
                    last: {
                        type: 'string',
                        example: '/api/v1/usuarios?page=10&limit=10'
                    },
                    prev: {
                        type: 'string',
                        nullable: true,
                        example: null
                    },
                    next: {
                        type: 'string',
                        example: '/api/v1/usuarios?page=2&limit=10'
                    }
                }
            }
        }
    },

    UsuarioInput: {
        type: 'object',
        properties: {
            tipo_documento: {
                type: 'string',
                description: 'Nombre del tipo de documento (ej: "Cédula de Ciudadanía")',
                example: 'Cédula de Ciudadanía'
            },
            roles_nombres: {
                type: 'array',
                description: 'Nombres de los roles a asignar (opcional)',
                items: {
                    type: 'string'
                },
                example: ['Aprendiz', 'Monitor']
            },
            documento: {
                type: 'string',
                minLength: 5,
                maxLength: 20,
                description: 'Número de documento de identificación',
                example: '1234567890'
            },
            nombres: {
                type: 'string',
                maxLength: 50,
                description: 'Nombres del usuario',
                example: 'Juan Carlos'
            },
            apellidos: {
                type: 'string',
                maxLength: 50,
                description: 'Apellidos del usuario',
                example: 'Pérez García'
            },
            correo: {
                type: 'string',
                maxLength: 100,
                format: 'email',
                description: 'Correo electrónico del usuario',
                example: 'juan.perez@example.com'
            },
            telefono: {
                type: 'string',
                maxLength: 15,
                description: 'Número de teléfono',
                example: '3001234567'
            },
            direccion: {
                type: 'string',
                maxLength: 100,
                description: 'Dirección de residencia',
                example: 'Calle 123 # 45-67'
            },
            contrasena: {
                type: 'string',
                minLength: 8,
                maxLength: 100,
                format: 'password',
                description: 'Contraseña (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
                example: 'P@ssw0rd123'
            },
            confirmar_contrasena: {
                type: 'string',
                minLength: 8,
                maxLength: 100,
                format: 'password',
                description: 'Confirmación de contraseña',
                example: 'P@ssw0rd123'
            }
        },
        required: ['tipo_documento', 'documento', 'nombres', 'apellidos', 'correo', 'contrasena', 'confirmar_contrasena']
    },

    UsuarioUpdate: {
        type: 'object',
        properties: {
            tipo_documento: {
                type: 'string',
                description: 'Nombre del tipo de documento',
                example: 'Cédula de Ciudadanía'
            },
            roles_nombres: {
                type: 'array',
                description: 'Nombres de los roles a asignar',
                items: {
                    type: 'string'
                },
                example: ['Aprendiz', 'Monitor']
            },
            documento: {
                type: 'string',
                minLength: 5,
                maxLength: 20,
                description: 'Número de documento de identificación',
                example: '1234567890'
            },
            nombres: {
                type: 'string',
                maxLength: 50,
                description: 'Nombres del usuario',
                example: 'Juan Carlos'
            },
            apellidos: {
                type: 'string',
                maxLength: 50,
                description: 'Apellidos del usuario',
                example: 'Pérez García'
            },
            correo: {
                type: 'string',
                maxLength: 100,
                format: 'email',
                description: 'Correo electrónico del usuario',
                example: 'juan.perez@example.com'
            },
            telefono: {
                type: 'string',
                maxLength: 15,
                description: 'Número de teléfono',
                example: '3001234567'
            },
            direccion: {
                type: 'string',
                maxLength: 100,
                description: 'Dirección de residencia',
                example: 'Calle 123 # 45-67'
            }
        }
    },

    CambiarEstadoUsuario: {
        type: 'object',
        properties: {
            estado: {
                type: 'boolean',
                description: 'Nuevo estado del usuario (true = activo, false = inactivo)',
                example: false
            }
        },
        required: ['estado']
    },

    UsuarioSimplificado: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                example: 1
            },
            documento: {
                type: 'string',
                example: '1234567890'
            },
            nombres: {
                type: 'string',
                example: 'Juan Carlos'
            },
            apellidos: {
                type: 'string',
                example: 'Pérez García'
            },
            correo: {
                type: 'string',
                example: 'juan.perez@example.com'
            },
            roles: {
                type: 'array',
                description: 'Roles del usuario',
                items: {
                    type: 'string'
                },
                example: ['Aprendiz']
            },
            estado: {
                type: 'boolean',
                example: true
            }
        }
    }
};

