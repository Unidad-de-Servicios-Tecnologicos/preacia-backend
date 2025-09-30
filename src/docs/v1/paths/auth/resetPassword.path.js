export const resetPasswordPaths = {
    '/auth/reset-password': {
        post: {
            tags: ['Auth'],
            summary: 'Restablecer contraseña',
            description: 'Ingresa una credenciales válidas para restablecer la contraseña de un usuario.',
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
                                correo: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'email@email.com',
                                    description: 'Correo electrónico del usuario para restablecer la contraseña.',
                                },
                                token: {
                                    type: 'string',
                                    example: '1234567890abcdef',
                                    description: 'Token de verificación enviado al correo electrónico del usuario.',
                                },
                                nueva_contrasena: {
                                    type: 'string',
                                    format: 'password',
                                    example: 'NuevaContraseña123!',
                                    description: 'Nueva contraseña que el usuario desea establecer.',
                                }                                
                            }

                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Contraseña restablecida exitosamente',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Contraseña restablecida exitosamente.',
                                        },

                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
    }
}