import express from 'express';
import * as centroController from '../../controllers/v1/centros/centro.controller.js';
import { createCentroValidator, updateCentroValidator, codigoParamValidator, cambiarEstadoValidator } from '../../middlewares/validators/centro.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Obtener centros
router.get('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    centroController.getCentros
);

// Lista simplificada
router.get('/list',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    centroController.getListCentros
);

// Crear centro
router.post('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    createCentroValidator,
    centroController.storeCentro
);

// Actualizar centro por código
router.put('/:codigo',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    [...codigoParamValidator, ...updateCentroValidator],
    centroController.updateCentro
);

// Cambiar estado
router.patch('/:codigo/estado',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.CAMBIAR_ESTADO_CENTROS])
    ],
    [...codigoParamValidator, ...cambiarEstadoValidator],
    centroController.changeCentroStatus
);

// Obtener centro por código
router.get('/:codigo',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_CENTROS])
    ],
    codigoParamValidator,
    centroController.showCentro
);

// Obtener áreas por centro id (controller usa getAreasByCentro)
// Endpoint de áreas eliminado: la relación áreas ya no es parte de centros.

export default router;
