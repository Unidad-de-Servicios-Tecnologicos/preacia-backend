export const usuarioPaths = {
    '/usuarios': {
        get: {
            tags: ['Usuario'],
            summary: 'Obtener lista paginada de usuarios',
            description: 'Retorna una lista paginada de usuarios con filtros opcionales',
            security: [{ bearerAuth: [] }],
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
                        default: 'id',
                        enum: ['id', 'documento', 'nombres', 'apellidos', 'correo', 'created_at']
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
                    name: 'documento',
                    in: 'query',
                    description: 'Filtrar por documento',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'nombres',
                    in: 'query',
                    description: 'Filtrar por nombres',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'apellidos',
                    in: 'query',
                    description: 'Filtrar por apellidos',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'correo',
                    in: 'query',
                    description: 'Filtrar por correo',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'rol_nombre',
                    in: 'query',
                    description: 'Filtrar por nombre de rol',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'Búsqueda global en documento, nombres, apellidos, correo y teléfono',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Lista de usuarios obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UsuariosPaginados'
                            }
                        }
                    }
                },
                401: {
                    description: 'No autorizado - Token inválido o ausente',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - No tiene permisos para esta operación',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Usuario'],
            summary: 'Crear un nuevo usuario',
            description: 'Crea un nuevo usuario en el sistema. La contraseña es opcional y se generará automáticamente si no se proporciona. Los campos centro_ids y regional_id son obligatorios según el rol asignado.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UsuarioInput'
                        },
                        examples: {
                            usuarioRevisor: {
                                summary: 'Usuario con rol Revisor',
                                value: {
                                    tipo_documento_id: 1,
                                    rol_ids: [2],
                                    centro_ids: [1, 2],
                                    documento: '1234567890',
                                    nombres: 'Juan Carlos',
                                    apellidos: 'Pérez García',
                                    correo: 'juan.perez@example.com',
                                    telefono: '3001234567',
                                    direccion: 'Calle 123 # 45-67',
                                    password_debe_cambiar: true
                                }
                            },
                            usuarioDirectorRegional: {
                                summary: 'Usuario con rol Director Regional',
                                value: {
                                    tipo_documento_id: 1,
                                    rol_ids: [3],
                                    regional_id: 1,
                                    documento: '9876543210',
                                    nombres: 'María',
                                    apellidos: 'Rodríguez López',
                                    correo: 'maria.rodriguez@example.com',
                                    telefono: '3009876543',
                                    contrasena: 'Password123!',
                                    password_debe_cambiar: false
                                }
                            },
                            usuarioAdmin: {
                                summary: 'Usuario con rol Admin',
                                value: {
                                    tipo_documento_id: 1,
                                    rol_ids: [1],
                                    documento: '5555555555',
                                    nombres: 'Admin',
                                    apellidos: 'Sistema',
                                    correo: 'admin@example.com'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Usuario creado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Usuario creado exitosamente'
                                    },
                                    data: {
                                        $ref: '#/components/schemas/Usuario'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Error de validación o datos inválidos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                401: {
                    description: 'No autorizado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - No tiene permisos para crear usuarios',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                409: {
                    description: 'Conflicto - Usuario duplicado (documento o correo ya existe)',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        }
    },
    '/usuarios/list': {
        get: {
            tags: ['Usuario'],
            summary: 'Obtener lista simplificada de usuarios',
            description: 'Retorna una lista sin paginación de usuarios para selects y dropdowns',
            security: [{ bearerAuth: [] }],
            parameters: [
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
                    name: 'rol_nombre',
                    in: 'query',
                    description: 'Filtrar por nombre de rol',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    description: 'Campo para ordenar',
                    schema: {
                        type: 'string',
                        default: 'nombres',
                        enum: ['id', 'nombres', 'apellidos', 'documento']
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
                    description: 'Lista simplificada obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/UsuarioSimplificado'
                                        }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            count: {
                                                type: 'integer',
                                                example: 150
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'No autorizado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        }
    },
    '/usuarios/{id}': {
        get: {
            tags: ['Usuario'],
            summary: 'Obtener un usuario por ID',
            description: 'Retorna los detalles de un usuario específico',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID del usuario',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Usuario encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    data: {
                                        $ref: '#/components/schemas/Usuario'
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Usuario no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ['Usuario'],
            summary: 'Actualizar un usuario',
            description: 'Actualiza los datos de un usuario existente. Todos los campos son opcionales.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID del usuario',
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
                            $ref: '#/components/schemas/UsuarioUpdate'
                        },
                        examples: {
                            actualizarDatosBasicos: {
                                summary: 'Actualizar datos básicos',
                                value: {
                                    nombres: 'Juan Carlos Actualizado',
                                    telefono: '3001111111',
                                    direccion: 'Nueva dirección 456'
                                }
                            },
                            cambiarRoles: {
                                summary: 'Cambiar roles del usuario',
                                value: {
                                    rol_ids: [2, 4]
                                }
                            },
                            actualizarCentros: {
                                summary: 'Actualizar centros asignados',
                                value: {
                                    centro_ids: [3, 4, 5]
                                }
                            },
                            actualizarTodo: {
                                summary: 'Actualización completa',
                                value: {
                                    tipo_documento_id: 2,
                                    rol_ids: [2],
                                    centro_ids: [1],
                                    regional_id: 2,
                                    documento: '9999999999',
                                    nombres: 'Nuevo Nombre',
                                    apellidos: 'Nuevo Apellido',
                                    correo: 'nuevo@example.com',
                                    telefono: '3002222222',
                                    direccion: 'Nueva dirección completa'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Usuario actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Usuario actualizado exitosamente'
                                    },
                                    data: {
                                        $ref: '#/components/schemas/Usuario'
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
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - No tiene permisos para actualizar usuarios',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                404: {
                    description: 'Usuario no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                409: {
                    description: 'Conflicto - Campo duplicado (documento o correo)',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        }
    },
    '/usuarios/{id}/estado': {
        patch: {
            tags: ['Usuario'],
            summary: 'Cambiar estado de un usuario',
            description: 'Activa o desactiva un usuario',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID del usuario',
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
                            $ref: '#/components/schemas/CambiarEstadoUsuario'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Estado cambiado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Usuario desactivado exitosamente'
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            documento: { type: 'string' },
                                            nombres: { type: 'string' },
                                            apellidos: { type: 'string' },
                                            correo: { type: 'string' },
                                            estado: { type: 'boolean' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Error de validación o estado sin cambios',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - No tiene permisos',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                404: {
                    description: 'Usuario no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                500: {
                    description: 'Error del servidor',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        }
    }
};

