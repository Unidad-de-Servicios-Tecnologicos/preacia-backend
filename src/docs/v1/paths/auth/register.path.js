export const registerPaths = {
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Registrar usuario',
            description: 'Permite registrar un nuevo usuario en el sistema.',
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
                                documento: {
                                    type: 'string',
                                    description: 'Número de documento del usuario',
                                    example: '1234567890'
                                },
                                nombres: {
                                    type: 'string',
                                    description: 'Nombres del usuario',
                                    example: 'Juan'
                                },
                                apellidos: {
                                    type: 'string',
                                    description: 'Apellidos del usuario',
                                    example: 'Pérez'
                                },
                                correo: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'Correo electrónico del usuario',
                                    example: 'juanperez@email.com'
                                },
                                telefono: {
                                    type: 'string',
                                    description: 'Número de teléfono del usuario',
                                    example: '3001234567'
                                },
                                contrasena: {
                                    type: 'string',
                                    description: 'Contraseña del usuario',
                                    example: 'contrasenaSegura123'
                                },
                                confirmar_contrasena: {
                                    type: 'string',
                                    description: 'Confirmación de la contraseña',
                                    example: 'contrasenaSegura123'
                                }
                            },
                            required: ['documento', 'nombres', 'apellidos',  'correo', 'contrasena', 'confirmar_contrasena'],
                            example: {
                                documento: '1234567890',
                                nombres: 'Juan',
                                apellidos: 'Pérez',
                                correo: 'juanperez@email.com',
                                telefono: '3001234567',
                                contrasena: 'contrasenaSegura123',
                                confirmar_contrasena: 'contrasenaSegura123'
                            }
                        },
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Registro exitoso',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    example: 'Usuario registrado correctamente. Por favor, verifica tu correo electrónico con el código enviado para habilitar la cuenta.'
                                },
                                usuario: {
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
                                            example: 'Juan'
                                        },
                                        apellidos: {
                                            type: 'string',
                                            example: 'Pérez'
                                        },
                                        correo: {
                                            type: 'string',
                                            example: 'juanperez@email.com'
                                        },
                                        telefono: {
                                            type: 'string',
                                            example: '3001234567'
                                        },
                                        estado: {
                                            type: 'boolean',
                                            example: false
                                        },
                                        rol: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer', example: 1 },
                                                nombre: { type: 'string', example: 'Usuario' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
};