export const registerPaths = {
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Registrar usuario administrativo',
            description: `
                Permite registrar un nuevo usuario administrativo en el sistema.
                
                **Importante:**
                - La contraseña se genera automáticamente y se envía por correo electrónico.
                - El usuario debe cambiar la contraseña en el primer inicio de sesión.
                - Un usuario puede tener múltiples roles asignados.
                - Los roles Revisor (id: 1) y Administrador de Centro (id: 2) requieren al menos un centro asignado.
                - El rol Director Regional (id: 3) requiere una regional_id.
                - Todos los IDs deben existir previamente en la base de datos.
            `,
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Content-Type',
                    required: true,
                    schema: { type: 'string', example: 'application/json' },
                    description: 'Tipo de contenido de la solicitud'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                rol_ids: {
                                    type: 'array',
                                    items: { type: 'integer' },
                                    description: 'Array de IDs de roles a asignar (mínimo 1). IDs: 1=revisor, 2=administrador_centro, 3=director_regional, 4=admin',
                                    example: [1, 2]
                                },
                                tipo_documento_id: {
                                    type: 'integer',
                                    description: 'ID del tipo de documento. Debe existir en la tabla tipo_documentos.',
                                    example: 1
                                },
                                documento: {
                                    type: 'string',
                                    description: 'Número de documento del usuario (único, 5-20 caracteres, solo números)',
                                    example: '1234567890'
                                },
                                nombres: {
                                    type: 'string',
                                    description: 'Nombres del usuario (máximo 150 caracteres, solo letras)',
                                    example: 'María Camila'
                                },
                                apellidos: {
                                    type: 'string',
                                    description: 'Apellidos del usuario (máximo 150 caracteres, solo letras)',
                                    example: 'Rodríguez González'
                                },
                                correo: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'Correo electrónico del usuario (único)',
                                    example: 'maria.rodriguez@sena.edu.co'
                                },
                                telefono: {
                                    type: 'string',
                                    description: 'Número de teléfono del usuario (opcional, 7-20 caracteres)',
                                    example: '3001234567'
                                },
                                direccion: {
                                    type: 'string',
                                    description: 'Dirección del usuario (opcional, máximo 200 caracteres)',
                                    example: 'Calle 52 No. 48-09, Medellín'
                                },
                                regional_id: {
                                    type: 'integer',
                                    description: 'ID de la regional (OBLIGATORIO para Director Regional). Debe existir en la tabla regionales.',
                                    example: 1
                                },
                                centro_ids: {
                                    type: 'array',
                                    items: { type: 'integer' },
                                    description: 'Array de IDs de centros a asignar (OBLIGATORIO para Revisor y Admin Centro). Deben existir en la tabla centros.',
                                    example: [1, 2, 3]
                                }
                            },
                            required: ['rol_ids', 'tipo_documento_id', 'documento', 'nombres', 'apellidos', 'correo'],
                            example: {
                                rol_ids: [1],
                                tipo_documento_id: 1,
                                documento: '1234567890',
                                nombres: 'María Camila',
                                apellidos: 'Rodríguez González',
                                correo: 'maria.rodriguez@sena.edu.co',
                                telefono: '3001234567',
                                direccion: 'Calle 52 No. 48-09, Medellín',
                                regional_id: null,
                                centro_ids: [1, 2]
                            }
                        },
                    }
                }
            },
            responses: {
                201: {
                    description: 'Usuario registrado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Usuario registrado correctamente. Se ha enviado un correo electrónico con las credenciales de acceso. Ya puedes iniciar sesión en el sistema.'
                                    },
                                    usuario: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                example: 5
                                            },
                                            documento: {
                                                type: 'string',
                                                example: '1234567890'
                                            },
                                            nombres: {
                                                type: 'string',
                                                example: 'María Camila'
                                            },
                                            apellidos: {
                                                type: 'string',
                                                example: 'Rodríguez González'
                                            },
                                            correo: {
                                                type: 'string',
                                                example: 'maria.rodriguez@sena.edu.co'
                                            },
                                            telefono: {
                                                type: 'string',
                                                example: '3001234567'
                                            },
                                            direccion: {
                                                type: 'string',
                                                example: 'Calle 52 No. 48-09, Medellín'
                                            },
                                            estado: {
                                                type: 'boolean',
                                                example: true
                                            },
                                            password_debe_cambiar: {
                                                type: 'boolean',
                                                example: true
                                            },
                                            roles: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer', example: 1 },
                                                        nombre: { type: 'string', example: 'revisor' }
                                                    }
                                                },
                                                example: [
                                                    { id: 1, nombre: 'revisor' }
                                                ]
                                            },
                                            centros: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer', example: 1 },
                                                        codigo: { type: 'string', example: 'CTR-ANT-001' },
                                                        nombre: { type: 'string', example: 'Centro de Gestión de Mercados' }
                                                    }
                                                },
                                                example: [
                                                    { 
                                                        id: 1, 
                                                        codigo: 'CTR-ANT-001', 
                                                        nombre: 'Centro de Gestión de Mercados' 
                                                    },
                                                    { 
                                                        id: 2, 
                                                        codigo: 'CTR-ANT-002', 
                                                        nombre: 'Centro de Tecnología de la Manufactura' 
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Error de validación',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Errores de validación'
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                type: { type: 'string' },
                                                value: { type: 'string' },
                                                msg: { type: 'string' },
                                                path: { type: 'string' },
                                                location: { type: 'string' }
                                            }
                                        },
                                        example: [
                                            {
                                                type: 'field',
                                                value: '',
                                                msg: 'El campo rol_ids es requerido.',
                                                path: 'rol_ids',
                                                location: 'body'
                                            },
                                            {
                                                type: 'field',
                                                value: 999,
                                                msg: 'El tipo de documento con ID 999 no existe o está inactivo.',
                                                path: 'tipo_documento_id',
                                                location: 'body'
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'No autorizado - Token inválido o no proporcionado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Token no proporcionado o inválido'
                                    }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: 'Permisos insuficientes',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'No tienes permisos para realizar esta acción'
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Error interno del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Error al registrar el usuario'
                                    },
                                    error: {
                                        type: 'string',
                                        example: 'Database connection failed'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};