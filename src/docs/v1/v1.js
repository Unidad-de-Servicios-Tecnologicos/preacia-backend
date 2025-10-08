import { loginPaths } from './paths/auth/login.path.js';
import { registerPaths } from './paths/auth/register.path.js';
import { forgotPasswordPaths } from './paths/auth/forgotPassword.path.js';
import { resetPasswordPaths } from './paths/auth/resetPassword.path.js';
import { refreshTokenPaths } from './paths/auth/refreshToken.path.js';
import { tipoDocumentoPaths } from './paths/tipoDocumento/tipoDocumento.path.js';
import { regionalPaths } from './paths/regional/regional.path.js';
import { centroPaths } from './paths/centro/centro.path.js';
import { usuarioPaths } from './paths/usuario/usuario.path.js';
import { permisosPaths } from './paths/permiso/permiso.path.js';



// Importar esquemas
import { tipoDocumentoSchemas } from './shemas/tipoDocumento/tipoDocumento.schema.js';
import { regionalSchemas } from './shemas/regional.schema.js';
import { centroSchemas } from './shemas/centro.schema.js';
import { usuarioSchemas } from './shemas/usuario.schema.js';
import { permisosSchemas } from './shemas/permiso.shemas.js';


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
        ...loginPaths,
        ...registerPaths,
        ...forgotPasswordPaths,
        ...resetPasswordPaths,
        ...refreshTokenPaths,
        ...tipoDocumentoPaths,
        ...regionalPaths,
        ...centroPaths,
        ...usuarioPaths,
        ...permisosPaths
    },
    components: {
        schemas: {
            ...tipoDocumentoSchemas,
            ...regionalSchemas,
            ...centroSchemas,
            ...usuarioSchemas,
            ...permisosSchemas
        }
    }
};