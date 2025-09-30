export const loginPaths = {
    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Iniciar sesión',
            description: 'Permite a un usuario iniciar sesión en el sistema.',
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
                                login: {
                                    type: 'string',
                                    description: 'documento o correo electrónico del usuario',
                                    example: 'usuario123'
                                },
                                contrasena: {
                                    type: 'string',
                                    description: 'Contraseña del usuario',
                                    example: 'contrasenaSegura123'
                                }
                            },
                            required: ['login', 'contrasena'],
                            example: {
                                login: 'usuario123',
                                contrasena: 'contrasenaSegura123'
                            },
                        }

                    }
                }
            },
            responses: {
                200: {
                    description: 'Inicio de sesión exitoso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'Inicio de sesión exitoso.' },
                                    usuario: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type:
                                                    'integer', example: 1
                                            },
                                            documento: {
                                                type: 'string', example: '1234567890'
                                            },
                                            nombres: {
                                                type: 'string', example: 'Juan'
                                            },
                                            apellidos: {
                                                type: 'string', example: 'Pérez'
                                            },
                                            nombre_usuario: {
                                                type: 'string', example: 'juanperez'
                                            },
                                            correo: {
                                                type: 'string',
                                                example: 'juanperez@email.com'
                                            },
                                            telefono: {
                                                type: 'string', example: '3001234567'
                                            },
                                            estado: {
                                                type: 'boolean', example: true
                                            },
                                            rol: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer', example: 1 },
                                                    nombre: { type: 'string', example: 'Usuario' }
                                                }
                                            },
                                            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    },
};