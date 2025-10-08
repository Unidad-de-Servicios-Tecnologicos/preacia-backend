export const regionalPaths = {
    '/regionales': {
        get: {
            tags: ['Regional'],
            summary: 'Obtener lista paginada de regionales',
            description: 'Retorna una lista paginada de regionales con filtros opcionales. **ENDPOINT PÚBLICO - No requiere autenticación**',
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
                        default: 'nombre',
                        enum: ['id', 'codigo', 'nombre', 'created_at']
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
                    name: 'codigo',
                    in: 'query',
                    description: 'Filtrar por código',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'nombre',
                    in: 'query',
                    description: 'Filtrar por nombre',
                    schema: {
                        type: 'string'
                    }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'Búsqueda global en código, nombre y dirección',
                    schema: {
                        type: 'string'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Lista de regionales obtenida exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RegionalesPaginados'
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
            tags: ['Regional'],
            summary: 'Crear una nueva regional',
            description: 'Crea una nueva regional en el sistema (Solo Admin Nacional)',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/RegionalInput'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Regional creada exitosamente',
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
                                        example: 'Regional creada exitosamente'
                                    },
                                    data: {
                                        $ref: '#/components/schemas/Regional'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Error de validación o código/nombre duplicado',
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
                    description: 'Prohibido - Solo Admin Nacional puede crear regionales',
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
    '/regionales/list': {
        get: {
            tags: ['Regional'],
            summary: 'Obtener lista simplificada de regionales',
            description: 'Retorna una lista sin paginación de regionales para selects y dropdowns. **ENDPOINT PÚBLICO - No requiere autenticación**',
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
                    name: 'sortBy',
                    in: 'query',
                    description: 'Campo para ordenar',
                    schema: {
                        type: 'string',
                        default: 'nombre',
                        enum: ['id', 'codigo', 'nombre']
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
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer' },
                                                codigo: { type: 'string' },
                                                nombre: { type: 'string' },
                                                estado: { type: 'boolean' }
                                            }
                                        }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            count: {
                                                type: 'integer',
                                                example: 33
                                            }
                                        }
                                    }
                                }
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
    '/regionales/{id}': {
        get: {
            tags: ['Regional'],
            summary: 'Obtener una regional por ID',
            description: `Retorna los detalles de una regional específica. 
            
**Requiere autenticación**

**Permisos por rol:**
- **ADMIN:** Puede ver cualquier regional
- **DIRECTOR_REGIONAL:** Puede ver cualquier regional (lectura)
- **ADMINISTRADOR_CENTRO:** Puede ver cualquier regional (lectura)
- **REVISOR:** Puede ver cualquier regional (lectura)`,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID de la regional',
                    schema: {
                        type: 'integer'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Regional encontrada',
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
                                        $ref: '#/components/schemas/Regional'
                                    }
                                }
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
                            },
                            examples: {
                                noToken: {
                                    summary: 'Sin token',
                                    value: {
                                        success: false,
                                        message: 'Usuario no autenticado',
                                        errors: [{
                                            code: 'UNAUTHENTICATED',
                                            detail: 'Debe estar autenticado para realizar esta acción'
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - Sin permisos o cuenta no verificada',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            examples: {
                                noRoles: {
                                    summary: 'Sin roles asignados',
                                    value: {
                                        success: false,
                                        message: 'Usuario sin roles asignados',
                                        errors: [{
                                            code: 'NO_ROLES',
                                            detail: 'El usuario no tiene roles activos'
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Regional no encontrada',
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
            tags: ['Regional'],
            summary: 'Actualizar una regional',
            description: 'Actualiza los datos de una regional existente (Solo Admin Nacional)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID de la regional',
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
                            $ref: '#/components/schemas/RegionalUpdate'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Regional actualizada exitosamente',
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
                                        example: 'Regional actualizada exitosamente'
                                    },
                                    data: {
                                        $ref: '#/components/schemas/Regional'
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
                    description: 'Prohibido - Solo Admin Nacional puede actualizar regionales',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                404: {
                    description: 'Regional no encontrada',
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
    '/regionales/{id}/estado': {
        patch: {
            tags: ['Regional'],
            summary: 'Cambiar estado de una regional',
            description: 'Activa o desactiva una regional (Solo Admin Nacional)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID de la regional',
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
                            $ref: '#/components/schemas/CambiarEstadoRegional'
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
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            codigo: { type: 'string' },
                                            nombre: { type: 'string' },
                                            estado: { type: 'boolean' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - Solo Admin Nacional',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                404: {
                    description: 'Regional no encontrada',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                409: {
                    description: 'Conflicto - Regional tiene centros asociados',
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
    '/regionales/{id}/centros': {
        get: {
            tags: ['Regional'],
            summary: 'Obtener centros de formación de una regional',
            description: `Retorna una lista completa (sin paginación) de centros de formación asociados a una regional específica.

**Requiere autenticación y validación de scope**

**Permisos por rol:**
- **ADMIN:** Puede ver centros de cualquier regional
- **DIRECTOR_REGIONAL:** Solo puede ver centros de su regional asignada
- **ADMINISTRADOR_CENTRO:** No tiene acceso
- **REVISOR:** No tiene acceso

**Validación de scope:** El sistema verifica que el DIRECTOR_REGIONAL solo pueda acceder a los centros de su regional.`,
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID de la regional',
                    schema: {
                        type: 'integer'
                    }
                },
                {
                    name: 'sortBy',
                    in: 'query',
                    description: 'Campo para ordenar',
                    schema: {
                        type: 'string',
                        default: 'nombre',
                        enum: ['id', 'codigo', 'nombre', 'created_at']
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
                }
            ],
            responses: {
                200: {
                    description: 'Lista de centros de la regional obtenida exitosamente',
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
                                            $ref: '#/components/schemas/Centro'
                                        }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            count: {
                                                type: 'integer',
                                                description: 'Total de centros de la regional',
                                                example: 5
                                            }
                                        }
                                    }
                                }
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
                            },
                            examples: {
                                noToken: {
                                    summary: 'Sin token',
                                    value: {
                                        success: false,
                                        message: 'Usuario no autenticado',
                                        errors: [{
                                            code: 'UNAUTHENTICATED',
                                            detail: 'Debe estar autenticado para realizar esta acción'
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: 'Prohibido - Sin acceso al scope o sin roles',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            },
                            examples: {
                                scopeDenied: {
                                    summary: 'Acceso denegado por scope',
                                    value: {
                                        success: false,
                                        message: 'No tiene acceso a esta regional',
                                        errors: [{
                                            code: 'SCOPE_DENIED',
                                            detail: 'No tiene permisos para acceder a la regional 5. Solo puede acceder a su regional asignada.'
                                        }]
                                    }
                                },
                                noRoles: {
                                    summary: 'Sin roles asignados',
                                    value: {
                                        success: false,
                                        message: 'Usuario sin roles asignados',
                                        errors: [{
                                            code: 'NO_ROLES',
                                            detail: 'El usuario no tiene roles activos'
                                        }]
                                    }
                                },
                                insufficientPermissions: {
                                    summary: 'Sin permisos suficientes',
                                    value: {
                                        success: false,
                                        message: 'No tiene permisos para acceder a regionales',
                                        errors: [{
                                            code: 'INSUFFICIENT_PERMISSIONS',
                                            detail: 'Su rol no tiene permisos para acceder a este recurso'
                                        }]
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Regional no encontrada',
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
                            },
                            examples: {
                                scopeError: {
                                    summary: 'Error en verificación de scope',
                                    value: {
                                        success: false,
                                        message: 'Error al verificar permisos de acceso',
                                        errors: [{
                                            code: 'SCOPE_VERIFICATION_ERROR',
                                            detail: 'Error interno al validar el scope del usuario'
                                        }]
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

