import { tipoDocumentoPaths } from './paths/tipoDocumento/tipoDocumento.path.js';


// Importar esquemas
import { tipoDocumentoSchemas } from './shemas/tipoDocumento/tipoDocumento.schema.js';


export default {
    openapi: '3.0.0',
    info: {
        title: process.env.APP_NAME || 'API Preacia - V1',
        version: '1.0.0',
        description: 'Documentación de la versión 1',
    },
    servers: [
        {
            url: process.env.APP_URL || 'http://localhost:3000/api/v1',
            description: 'Servidor local'
        }
    ],
    paths: {
        ...tipoDocumentoPaths,
    },
    components: {
        schemas: {
            ...tipoDocumentoSchemas,
        }
    }
};