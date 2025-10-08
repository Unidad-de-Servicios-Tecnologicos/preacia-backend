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
            [PermisoEnum.VER_USUARIOS_TODOS, PermisoEnum.VER_USUARIOS_REGIONAL, PermisoEnum.VER_USUARIOS_CENTRO]
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
            [PermisoEnum.VER_USUARIOS_TODOS, PermisoEnum.VER_USUARIOS_REGIONAL, PermisoEnum.VER_USUARIOS_CENTRO]
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
            [PermisoEnum.CREAR_USUARIOS_TODOS, PermisoEnum.CREAR_USUARIOS_REGIONAL, PermisoEnum.CREAR_USUARIOS_CENTRO]
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
            [PermisoEnum.EDITAR_USUARIOS_TODOS, PermisoEnum.EDITAR_USUARIOS_REGIONAL, PermisoEnum.EDITAR_USUARIOS_CENTRO]
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
            [PermisoEnum.DESACTIVAR_USUARIOS_TODOS, PermisoEnum.DESACTIVAR_USUARIOS_REGIONAL, PermisoEnum.DESACTIVAR_USUARIOS_CENTRO]
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
            [PermisoEnum.VER_USUARIOS_TODOS, PermisoEnum.VER_USUARIOS_REGIONAL, PermisoEnum.VER_USUARIOS_CENTRO]
        )
    ],
    idParamValidator,
    usuarioController.showUsuario
);

export default router;

