import express from 'express';
import * as RolController from '../../controllers/v1/rol/rol.controller.js';
import { createRoleValidator, updateRoleValidator } from "../../middlewares/validators/rol.validator.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

router.get(
    '/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMINISTRADOR,
            RolEnum.EMPLEADO,
            RolEnum.USUARIO
        ], [PermisoEnum.VER_ROLES])
    ],
    RolController.getRoles
);

router.get(
    '/list',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO
        ], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.getListRoles
);


router.post("/",
    createRoleValidator, validateRequest,
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.storeRole
);

router.get('/:id(\\d+)',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMINISTRADOR,
            RolEnum.EMPLEADO,
            RolEnum.USUARIO
        ], [PermisoEnum.VER_ROLES])
    ],
    RolController.showRole
);

router.put('/:id(\\d+)',
    updateRoleValidator,
    validateRequest,
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.updateRole

);

router.patch('/:id(\\d+)/estado',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.changeRoleStatus
);

router.delete('/:id(\\d+)',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([
            RolEnum.ADMIN
        ], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.deleteRole
);




export default router;