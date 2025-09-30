export const tipoDocumentoPaths = {
    '/tipo-documentos': {
        get: {
            tags: ['Tipo documentos'],
            summary: 'Obtener todos los tipos de documentos',
            description: 'Devuelve una lista de todos los tipos de documentos disponibles en el sistema.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <access_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'query',
                    name: 'nombre',
                    schema: { type: 'string' },
                    description: 'Filtrar por nombre del tipo de documento'
                },

                {
                    in: 'query',
                    name: 'estado',
                    schema: { type: 'enum', enum: ['activo', 'inactivo'] },
                    description: 'Filtrar por estado del tipo de documento'
                },
                {
                    in: 'query',
                    name: 'sortBy',
                    schema: { type: 'string', enum: ['nombre', 'estado'] },
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
                }
            ],
            responses: {
                200: {
                    description: 'Lista de tipos de documentos obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/TipoDocumento' }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            total: { type: 'integer', example: 10 }
                                        }
                                    },
                                    links: {
                                        type: 'object',
                                        properties: {
                                            self: { type: 'string', example: 'http://localhost:3000/tipo-documentos/?pagination=false' }
                                        }
                                    }
                                }
                            },
                            example: {
                                data: [
                                    {
                                        id: 1,
                                        nombre: "Tipo de Documento 1",
                                        estado: "activo"
                                    },
                                    {
                                        id: 2,
                                        nombre: "Tipo de Documento 2",
                                        estado: "activo"
                                    }
                                ],
                                meta: {
                                    total: 2
                                },
                                links: {
                                    self: "http://localhost:3000/tipo-documentos/?pagination=false"
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Tipo documentos'],
            summary: 'Crear un nuevo tipo de documento',
            description: 'Crea un nuevo tipo de documento en el sistema.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <access_token>' },
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
                        schema: { $ref: '#/components/schemas/TipoDocumento' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Tipo de documento creado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/TipoDocumento' }
                                }
                            },
                            example: {
                                data: {
                                    id: 3,
                                    nombre: "Nuevo Tipo de Documento",
                                    estado: "activo"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/tipo-documentos/{id}': {
        get: {
            tags: ['Tipo documentos'],
            summary: 'Obtener un tipo de documento por ID',
            description: 'Devuelve un tipo de documento específico según su ID.',
            security: [{ bearerAuth: [] }], 
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <access_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID del tipo de documento a consultar'
                }
            ],
            responses: {
                200: {
                    description: 'Tipo de documento obtenido exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/TipoDocumento' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    nombre: "Tipo de Documento 1",
                                    estado: "activo"
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ['Tipo documentos'],
            summary: 'Actualizar un tipo de documento por ID',
            description: 'Actualiza un tipo de documento específico según su ID.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <access_token>' },
                    description: 'Token de acceso en formato Bearer'
                },  
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID del tipo de documento a actualizar'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/TipoDocumento' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Tipo de documento actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/TipoDocumento' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    nombre: "Tipo de Documento Actualizado",
                                    estado: "activo"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/tipo-documentos/{id}/estado': {
        patch: {
            tags: ['Tipo documentos'],
            summary: 'Cambiar el estado de un tipo de documento',
            description: 'Cambia el estado de un tipo de documento específico según su ID.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'header',
                    name: 'Authorization',
                    required: true,
                    schema: { type: 'string', example: 'Bearer <access_token>' },
                    description: 'Token de acceso en formato Bearer'
                },
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID del tipo de documento a modificar estado'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                estado: { type: 'string', enum: ['activo', 'inactivo'], example: 'inactivo' }
                            },
                            required: ['estado']
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Estado del tipo de documento actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {   
                                    data: { $ref: '#/components/schemas/TipoDocumento' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    nombre: "Tipo de Documento Actualizado",
                                    estado: "inactivo"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/tipo-documentos/list': {
        get: {
            tags: ['Tipo documentos'],
            summary: 'Obtener lista simplificada de tipos de documentos',
            description: 'Devuelve una lista simplificada de tipos de documentos activos.',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Lista simplificada de tipos de documentos obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer', example: 1 },
                                                nombre: { type: 'string', example: 'Tipo de Documento 1' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                data: [
                                    { id: 1, nombre: "Tipo de Documento 1" },
                                    { id: 2, nombre: "Tipo de Documento 2" }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};