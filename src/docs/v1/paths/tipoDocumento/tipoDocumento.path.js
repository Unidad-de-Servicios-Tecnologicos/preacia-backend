export const centrosPaths = {
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
                    name: 'codigo',
                    schema: { type: 'string' },
                    description: 'Filtrar por código del centro'
                },
                {
                    in: 'query',
                    name: 'nombre',
                    schema: { type: 'string' },
                    description: 'Filtrar por nombre del centro'
                },
                {
                    in: 'query',
                    name: 'ciudad_id',
                    schema: { type: 'integer' },
                    description: 'Filtrar por ID de ciudad'
                },
                {
                    in: 'query',
                    name: 'regional_id',
                    schema: { type: 'integer' },
                    description: 'Filtrar por ID de regional'
                },
                {
                    in: 'query',
                    name: 'estado',
                    schema: { type: 'string', enum: ['activo', 'inactivo'] },
                    description: 'Filtrar por estado del centro'
                },
                {
                    in: 'query',
                    name: 'sortBy',
                    schema: { type: 'string', enum: ['codigo', 'nombre', 'estado'] },
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
                    description: 'Lista de centros obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Centro' }
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
                                            self: { type: 'string', example: 'http://localhost:3000/centros/?pagination=false' }
                                        }
                                    }
                                }
                            },
                            example: {
                                data: [
                                    {
                                        id: 1,
                                        codigo: "CEN001",
                                        nombre: "Centro de Biotecnología Industrial",
                                        estado: "activo"
                                    },
                                    {
                                        id: 2,
                                        codigo: "CEN002",
                                        nombre: "Centro de Tecnologías de la Información",
                                        estado: "activo"
                                    }
                                ],
                                meta: {
                                    total: 2
                                },
                                links: {
                                    self: "http://localhost:3000/centros/?pagination=false"
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Centros'],
            summary: 'Crear un nuevo centro',
            description: 'Crea un nuevo centro en el sistema.',
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
                        schema: { $ref: '#/components/schemas/CentroInput' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Centro creado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Centro' }
                                }
                            },
                            example: {
                                data: {
                                    id: 3,
                                    codigo: "CEN003",
                                    nombre: "Nuevo Centro",
                                    estado: "activo"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/centros/{codigo}': {
        get: {
            tags: ['Centros'],
            summary: 'Obtener un centro por código',
            description: 'Devuelve un centro específico según su código.',
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
                    name: 'codigo',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Código del centro a consultar'
                }
            ],
            responses: {
                200: {
                    description: 'Centro obtenido exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Centro' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    codigo: "CEN001",
                                    nombre: "Centro de Biotecnología Industrial",
                                    estado: "activo"
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ['Centros'],
            summary: 'Actualizar un centro por código',
            description: 'Actualiza un centro específico según su código.',
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
                    name: 'codigo',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Código del centro a actualizar'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CentroUpdate' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Centro actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Centro' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    codigo: "CEN001",
                                    nombre: "Centro Actualizado",
                                    estado: "activo"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/centros/{codigo}/estado': {
        patch: {
            tags: ['Centros'],
            summary: 'Cambiar el estado de un centro',
            description: 'Cambia el estado de un centro específico según su código.',
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
                    name: 'codigo',
                    required: true,
                    schema: { type: 'string' },
                    description: 'Código del centro a modificar estado'
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
                    description: 'Estado del centro actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: { $ref: '#/components/schemas/Centro' }
                                }
                            },
                            example: {
                                data: {
                                    id: 1,
                                    codigo: "CEN001",
                                    nombre: "Centro de Biotecnología Industrial",
                                    estado: "inactivo"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/centros/list': {
        get: {
            tags: ['Centros'],
            summary: 'Obtener lista simplificada de centros',
            description: 'Devuelve una lista simplificada de centros activos.',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Lista simplificada de centros obtenida exitosamente',
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
                                                codigo: { type: 'string', example: 'CEN001' },
                                                nombre: { type: 'string', example: 'Centro de Biotecnología Industrial' }
                                            }
                                        }
                                    }
                                }
                            },
                            example: {
                                data: [
                                    { id: 1, codigo: "CEN001", nombre: "Centro de Biotecnología Industrial" },
                                    { id: 2, codigo: "CEN002", nombre: "Centro de Tecnologías de la Información" }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};