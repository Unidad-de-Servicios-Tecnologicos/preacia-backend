import express from 'express';
import * as PermisoController from '../../controllers/v1/permiso/permisos.controller.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from "../../middlewares/auth.middleware.js";
import {  idParamValidator } from '../../middlewares/validators/permisos.validator.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Rutas con los controladores que están funcionando - SOLO ADMINISTRADORES
router.get('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_PERMISOS])
    ],
    PermisoController.getPermissions
);

router.get('/list',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_PERMISOS])
    ],
    PermisoController.getListPermissions
);

router.get('/:id',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_PERMISOS])
    ],
    idParamValidator,
    PermisoController.showPermission
);


router.put('/:id',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_PERMISOS])
    ],
    [...idParamValidator],
    
);

// SOLO el endpoint /estado - eliminamos /status
router.patch('/:id/estado',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_PERMISOS])
    ],
    [...idParamValidator],
    
);

export default router;