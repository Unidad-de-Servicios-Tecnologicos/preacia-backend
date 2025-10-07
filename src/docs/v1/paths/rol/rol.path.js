export const rolesPaths = {
    '/roles': {
        get: {
            tags: ['Roles'],
            summary: 'Obtener todos los roles',
            description: 'Devuelve una lista de todos los roles disponibles en el sistema.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'query',
                    name: 'id',
                    schema: { type: 'integer' },
                    description: 'Filtrar por ID de rol'
                },
                {
                    in: 'query',
                    name: 'nombre',
                    schema: { type: 'string' },
                    description: 'Filtrar por nombre de rol'
                },
                {
                    in: 'query',
                    name: 'descripcion',
                    schema: { type: 'string' },
                    description: 'Filtrar por descripción de rol'
                },
                {
                    in: 'query',
                    name: 'estado',
                    schema: { type: 'boolean' },
                    description: 'Filtrar por estado (activo/inactivo)'
                },
                {
                    in: 'query',
                    name: 'sortBy',
                    schema: { type: 'string', enum: ['id', 'nombre', 'descripcion', 'estado'] },
                    description: 'Campo por el cual ordenar'
                },
                {
                    in: 'query',
                    name: 'order',
                    schema: { type: 'string', enum: ['asc', 'desc'] },
                    description: 'Orden ascendente o descendente'
                },
                {
                    in: 'query',
                    name: 'page',
                    schema: { type: 'integer', minimum: 1 },
                    description: 'Número de página para paginación'
                },
                {
                    in: 'query',
                    name: 'limit',
                    schema: { type: 'integer', minimum: 1 },
                    description: 'Cantidad de resultados por página'
                },
                {
                    in: 'query',
                    name: 'pagination',
                    schema: { type: 'boolean' },
                    description: 'Si es false, devuelve todos los resultados sin paginar'
                }
            ],
            responses: {
                200: {
                    description: 'Lista de roles',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Role' }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            total: { type: 'integer', example: 2 }
                                        }
                                    },
                                    links: {
                                        type: 'object',
                                        properties: {
                                            self: { type: 'string', example: 'http://localhost:3000/roles/?pagination=false' }
                                        }
                                    }
                                }
                            },
                            example: {
                                data: [
                                    {
                                        id: 1,
                                        nombre: "administrador",
                                        descripcion: "Rol con todos los permisos y acceso total al sistema",
                                        estado: true
                                    },
                                    {
                                        id: 2,
                                        nombre: "empleado",
                                        descripcion: "Rol con permisos limitados para tareas específicas",
                                        estado: true
                                    }
                                ],
                                meta: {
                                    total: 2
                                },
                                links: {
                                    self: "http://localhost:3000/roles/?pagination=false"
                                }
                            }
                        }
                    }
                },

            }
        },
        post: {
            tags: ['Roles'],
            summary: 'Crear un nuevo rol',
            description: 'Crea un nuevo rol en el sistema.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
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
                        schema: { $ref: '#/components/schemas/Role' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Rol creado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Role' }
                                }
                            },
                            example: {
                                data: {
                                    id: 3,
                                    nombre: "nuevo rol",
                                    descripcion: "Rol con todos los permisos",
                                    estado: true
                                }
                            }
                        }
                    }
                }
            }
        },

    },
    '/roles/{id}': {
        get: {
            tags: ['Roles'],
            summary: 'Obtener un rol por ID',
            description: 'Devuelve un rol específico según su ID.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'ID del rol a consultar'
                }
            ],
            responses: {
                200: {
                    description: 'Rol obtenido exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Role' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    nombre: "administrador",
                                    descripcion: "Rol con todos los permisos y acceso total al sistema",
                                    estado: true
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Rol no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                status: { type: 'string', example: '404' },
                                                title: { type: 'string', example: 'Rol no encontrado' },
                                                detail: { type: 'string', example: 'No existe un rol con id 5' },
                                                code: { type: 'string', example: 'ROLE_NOT_FOUND' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                errors: [
                                    {
                                        status: "404",
                                        title: "Rol no encontrado",
                                        detail: "No existe un rol con id 5",
                                        code: "ROLE_NOT_FOUND"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ['Roles'],
            summary: 'Actualizar un rol por ID',
            description: 'Actualiza un rol específico según su ID.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'ID del rol a actualizar'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Role' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Rol actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Role' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    nombre: "administrador",
                                    descripcion: "Rol con todos los permisos y acceso total al sistema",
                                    estado: true
                                }
                            }
                        }
                    }
                },
                403: {
                    description: 'No permitido (rol de sistema)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                code: { type: 'string', example: 'SYSTEM_ROLE_UPDATE_FORBIDDEN' },
                                                detail: { type: 'string', example: 'El rol es propio del sistema y no puede ser modificado.' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                errors: [
                                    {
                                        code: "SYSTEM_ROLE_UPDATE_FORBIDDEN",
                                        detail: "El rol es propio del sistema y no puede ser modificado."
                                    }
                                ]
                            }
                        }
                    }
                },
                404: {
                    description: 'Rol no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                status: { type: 'string', example: '404' },
                                                title: { type: 'string', example: 'Rol no encontrado' },
                                                detail: { type: 'string', example: 'No existe un rol con id 5' },
                                                code: { type: 'string', example: 'ROLE_NOT_FOUND' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                errors: [
                                    {
                                        status: "404",
                                        title: "Rol no encontrado",
                                        detail: "No existe un rol con id 5",
                                        code: "ROLE_NOT_FOUND"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        delete: {
            tags: ['Roles'],
            summary: 'Eliminar un rol por ID',
            description: 'Elimina un rol del sistema. Solo se puede eliminar un rol si no es un rol de sistema.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'header',
                    name: 'Content-Type',
                    required: true,
                    schema: { type: 'string', example: 'application/json' },
                    description: 'Tipo de contenido de la solicitud'
                },
                {
                    in: 'header',
                    name: 'Accept',
                    required: true,
                    schema: { type: 'string', example: 'application/json' },
                    description: 'Tipo de respuesta aceptada'
                },
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'ID del rol a eliminar'
                }
            ],
            responses: {
                204: {
                    description: 'Rol eliminado exitosamente (sin contenido)',
                    content: {}
                },
                403: {
                    description: 'No permitido (rol de sistema)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                code: { type: 'string', example: 'SYSTEM_ROLE_DELETE_FORBIDDEN' },
                                                detail: { type: 'string', example: 'El rol es propio del sistema y no puede ser eliminado.' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                errors: [
                                    {
                                        code: "SYSTEM_ROLE_DELETE_FORBIDDEN",
                                        detail: "El rol es propio del sistema y no puede ser eliminado."
                                    }
                                ]
                            }
                        }
                    }
                },
                404: {
                    description: 'Rol no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                status: { type: 'string', example: '404' },
                                                title: { type: 'string', example: 'Rol no encontrado' },
                                                detail: { type: 'string', example: 'No existe un rol con id 5' },
                                                code: { type: 'string', example: 'ROLE_NOT_FOUND' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                errors: [
                                    {
                                        status: "404",
                                        title: "Rol no encontrado",
                                        detail: "No existe un rol con id 5",
                                        code: "ROLE_NOT_FOUND"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    },
    '/roles/{id}/estado': {
        patch: {
            tags: ['Roles'],
            summary: 'Cambiar el estado de un rol (activar/desactivar)',
            description: 'Cambia el estado de un rol específico según su ID.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'header',
                    name: 'Content-Type',
                    required: true,
                    schema: { type: 'string', example: 'application/json' },
                    description: 'Tipo de contenido de la solicitud'
                },
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'ID del rol a modificar estado'
                }
            ],
            responses: {
                200: {
                    description: 'Estado del rol actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer', example: 1 },
                                    nombre: { type: 'string', example: 'administrador' },
                                    descripcion: { type: 'string', example: 'Rol con todos los permisos y acceso total al sistema' },
                                    estado: { type: 'boolean', example: false }
                                }
                            },
                            example: {
                                id: 1,
                                nombre: "administrador",
                                descripcion: "Rol con todos los permisos y acceso total al sistema",
                                estado: false
                            }
                        }
                    }
                },
                404: {
                    description: 'Rol no encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                status: { type: 'string', example: '404' },
                                                title: { type: 'string', example: 'Rol no encontrado' },
                                                detail: { type: 'string', example: 'No existe un rol con id 5' },
                                                code: { type: 'string', example: 'ROLE_NOT_FOUND' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                errors: [
                                    {
                                        status: "404",
                                        title: "Rol no encontrado",
                                        detail: "No existe un rol con id 5",
                                        code: "ROLE_NOT_FOUND"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    },
    '/roles/list': {
        get: {
            tags: ['Roles'],
            summary: 'Obtener lista de roles',
            description: 'Devuelve una lista de roles con atributos básicos.',
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <refresh_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'query',
                    name: 'estado',
                    schema: { type: 'boolean' },
                    description: 'Filtrar por estado (activo/inactivo)'
                },
                {
                    in: 'query',
                    name: 'sortBy',
                    schema: { type: 'string', enum: ['id', 'nombre', 'descripcion', 'estado'] },
                    description: 'Campo por el cual ordenar'
                },
                {
                    in: 'query',
                    name: 'order',
                    schema: { type: 'string', enum: ['asc', 'desc'] },
                    description: 'Orden ascendente o descendente'
                }
            ],
            responses: {
                200: {
                    description: 'Lista de roles obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/RoleList' }
                                    }
                                }
                            },
                            example: {
                                data: [
                                    {
                                        id: 1,
                                        nombre: "administrador",
                                        descripcion: "Rol con todos los permisos y acceso total al sistema",
                                        estado: true
                                    },
                                    {
                                        id: 2,
                                        nombre: "empleado",
                                        descripcion: "Rol con permisos limitados para tareas específicas",
                                        estado: true
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};