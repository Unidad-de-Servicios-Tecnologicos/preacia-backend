export const rolesSchemas = {
    Role: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                example: 1
            },
            nombre: {
                type: 'string',
                example: 'Administrador'
            },
            descripcion: {
                type: 'string',
                example: 'Rol con todos los permisos'
            },
            estado: {
                type: 'boolean',
                example: true
            }
        }
    }
};