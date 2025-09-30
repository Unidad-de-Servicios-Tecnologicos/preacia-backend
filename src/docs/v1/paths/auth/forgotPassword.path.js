export const forgotPasswordPaths = {
    '/auth/forgot-password': {
        post: {
            tags: ['Auth'],
            summary: 'Olvidé mi contraseña',
            description: 'Permite a un usuario solicitar un enlace para restablecer su contraseña si ha olvidado la actual.',
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
                                    description: 'Correo electrónico del usuario para el restablecimiento de contraseña',
                                    example: 'example@email.com',
                                },
                                required: ['correo'],
                                example: {
                                    correo: 'example@email.com',
                                },
                            }

                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Solicitud de restablecimiento de contraseña exitosa',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Se ha enviado un enlace de restablecimiento de contraseña a su correo.',
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