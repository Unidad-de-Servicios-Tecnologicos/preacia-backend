export const refreshTokenPaths = {
    '/auth/refresh': {
        post: {
            tags: ['Auth'],
            summary: 'Obtener nuevo token de acceso',
            description: 'Permite a un usuario obtener un nuevo token de acceso utilizando un refresh token válido. El refresh token debe enviarse en la cabecera Authorization con el esquema Bearer.',
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
                    description: 'Refresh token en formato Bearer'
                }
            ],
            responses: {
                200: {
                    description: 'Nuevo token de acceso generado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    accessToken: { type: 'string', description: 'Nuevo token de acceso JWT' }
                                }
                            },
                            example: {
                                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                            }
                        }
                    }
                },
                401: {
                    description: 'Refresh token inválido o no proporcionado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string' }
                                }
                            },
                            example: {
                                message: 'Refresh token inválido o expirado.'
                            }
                        }
                    }
                },
                422: {
                    description: 'Error de validación en la cabecera',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        msg: { type: 'string' },
                                        param: { type: 'string' },
                                        location: { type: 'string' }
                                    }
                                }
                            },
                            example: [
                                {
                                    msg: "El refresh token es requerido en la cabecera 'Authorization'.",
                                    param: "authorization",
                                    location: "headers"
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
}