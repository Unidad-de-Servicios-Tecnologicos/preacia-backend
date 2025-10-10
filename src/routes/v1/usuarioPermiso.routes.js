import express from 'express';
import * as usuarioPermisoController from '../../controllers/v1/usuario/usuarioPermiso.controller.js';
import { asignarValidator, quitarValidator, usuarioIdParamValidator, permisoIdParamValidator } from '../../middlewares/validators/usuarioPermiso.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Asignar permiso a usuario
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_PERMISOS])
  ],
  asignarValidator,
  usuarioPermisoController.asignarPermisoAUsuario
);

// Quitar permiso a usuario
router.delete('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_PERMISOS])
  ],
  quitarValidator,
  usuarioPermisoController.quitarPermisoAUsuario
);

// Listar permisos de un usuario
router.get('/:usuario_id/permisos',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO], [PermisoEnum.VER_PERMISOS])
  ],
  usuarioIdParamValidator,
  usuarioPermisoController.listarPermisosDeUsuario
);

// Listar usuarios con un permiso
router.get('/permiso/:permiso_id/usuarios',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.VER_PERMISOS])
  ],
  permisoIdParamValidator,
  usuarioPermisoController.listarUsuariosConPermiso
);

export default router;
