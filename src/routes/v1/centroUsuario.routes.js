import express from 'express';
import * as centroUsuarioController from '../../controllers/v1/centros/centroUsuario.controller.js';
import { asociarValidator, quitarValidator, centroIdParamValidator, usuarioIdParamValidator } from '../../middlewares/validators/centroUsuario.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Asociar usuario a centro
router.post('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    asociarValidator,
    centroUsuarioController.asociarUsuarioCentro
);

// Quitar usuario de centro
router.delete('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    quitarValidator,
    centroUsuarioController.quitarUsuarioCentro
);

// Listar usuarios de un centro
router.get('/:centro_id/usuarios',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    centroIdParamValidator,
    centroUsuarioController.listarUsuariosDeCentro
);

// Listar centros de un usuario
router.get('/usuario/:usuario_id/centros',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    usuarioIdParamValidator,
    centroUsuarioController.listarCentrosDeUsuario
);

export default router;
