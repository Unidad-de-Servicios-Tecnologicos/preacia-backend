import express from 'express';
import * as usuarioController from '../../controllers/v1/usuario/usuario.controller.js';
import { getUsersService } from '../../services/v1/usuario.service.js';
import { registerUserValidator, updateUserValidator, createUserWithEmailValidator } from '../../middlewares/validators/usuario.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Obtener usuarios (paginado y filtros)
router.get('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.GESTIONAR_USUARIOS])
    ],
    usuarioController.getUsers
);

// Obtener usuario por id
router.get('/:id',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.VER_USUARIOS])
    ],
    usuarioController.showUser
);

// Actualizar usuario
router.put('/:id',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.EDITAR_USUARIOS])
    ],
    updateUserValidator,
    usuarioController.updateUser
);

// Cambiar estado
router.patch('/:id/estado',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.CAMBIAR_ESTADO_USUARIOS])
    ],
    usuarioController.toggleUserStatus
);


export default router;
