import express from 'express';
import * as usuarioController from '../../controllers/v1/usuario/usuario.controller.js';

import {
    registerUserValidator,
    updateUserValidator,
    idParamValidator,
    cambiarEstadoUsuarioValidator
} from '../../middlewares/validators/usuario.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Ruta para obtener todos los usuarios (Admin Nacional y Directores)
router.get('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso(
            [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO],
            [PermisoEnum.GESTIONAR_USUARIOS]
        ),
    ],
    usuarioController.getUsuarios
);

// Ruta para obtener lista simplificada de usuarios
router.get('/list',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso(
            [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO],
            [PermisoEnum.GESTIONAR_USUARIOS]
        ),
    ],
    usuarioController.getListUsuarios
);

// Ruta para crear un nuevo usuario
router.post('/',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso(
            [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO],
            [PermisoEnum.GESTIONAR_USUARIOS]
        )
    ],
    registerUserValidator,
    usuarioController.storeUsuario
);

// Ruta para editar un usuario por ID
router.put('/:id',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso(
            [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO],
            [PermisoEnum.GESTIONAR_USUARIOS]
        )
    ],
    [...idParamValidator, ...updateUserValidator],
    usuarioController.updateUsuario
);

// Ruta para cambiar el estado de un usuario por id
router.patch('/:id/estado',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso(
            [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO],
            [PermisoEnum.GESTIONAR_USUARIOS]
        )
    ],
    [...idParamValidator, ...cambiarEstadoUsuarioValidator],
    usuarioController.changeUsuarioStatus
);

// Ruta para obtener un usuario por id
router.get('/:id',
    [
        verificarToken,
        verificarCuentaActiva,
        verificarRolOPermiso(
            [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO],
            [PermisoEnum.GESTIONAR_USUARIOS]
        )
    ],
    idParamValidator,
    usuarioController.showUsuario
);

export default router;

