import express from 'express';
import * as RolController from '../../controllers/v1/rol/rol.controller.js';
import * as RolPermisoController from '../../controllers/v1/rol/rolPermiso.controller.js';
import { createRoleValidator, updateRoleValidator } from "../../middlewares/validators/rol.validator.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Ruta para obtener todos los roles (PÚBLICA)
router.get('/',
    RolController.getRoles
);

// Ruta para obtener lista simplificada de roles (PÚBLICA)
router.get('/list',
    RolController.getListRoles
);

// Ruta para obtener permisos de un rol específico (PÚBLICA)
router.get('/:id(\\d+)/permisos',
    RolPermisoController.getPermisosByRol
);

// Ruta para crear un nuevo rol (solo Admin)
router.post('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_ROLES])
    ],
    createRoleValidator,
    RolController.storeRole
);

// Ruta para obtener un rol por ID (PÚBLICA)
router.get('/:id(\\d+)',
    RolController.showRole
);

// Ruta para editar un rol por ID (solo Admin)
router.put('/:id(\\d+)',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_ROLES])
    ],
    updateRoleValidator,
    RolController.updateRole
);

// Ruta para cambiar el estado de un rol por ID (solo Admin)
router.patch('/:id(\\d+)/estado',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.changeRoleStatus
);

// Ruta para eliminar un rol por ID (solo Admin)
router.delete('/:id(\\d+)',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_ROLES])
    ],
    RolController.deleteRole
);




export default router;