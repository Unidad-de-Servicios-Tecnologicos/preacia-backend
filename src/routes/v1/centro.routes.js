import express from 'express';
import * as centroController from '../../controllers/v1/centro/centro.controller.js';

import { 
    createCentroValidator, 
    updateCentroValidator, 
    idParamValidator, 
    cambiarEstadoValidator 
} from '../../middlewares/validators/centro.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';
  
const router = express.Router();

// Ruta para obtener todos los centros (todos los roles administrativos pueden ver)
router.get('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.VER_CENTROS_TODOS, PermisoEnum.VER_CENTROS_REGIONAL, PermisoEnum.VER_CENTROS_PROPIOS]
    ),
  ],
  centroController.getCentros
);

// Ruta para obtener lista simplificada de centros
router.get('/list',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.VER_CENTROS_TODOS, PermisoEnum.VER_CENTROS_REGIONAL, PermisoEnum.VER_CENTROS_PROPIOS]
    ),
  ],
  centroController.getListCentros
);

// Ruta para crear un nuevo centro (Admin Nacional y Director Regional)
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL], [PermisoEnum.CREAR_CENTROS_TODOS, PermisoEnum.CREAR_CENTROS_REGIONAL])
  ],
  createCentroValidator,
  centroController.storeCentro
);

// Ruta para editar un centro por ID (Admin Nacional y Director Regional)
router.put('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL], [PermisoEnum.EDITAR_CENTROS_TODOS, PermisoEnum.EDITAR_CENTROS_REGIONAL])
  ],
  [...idParamValidator, ...updateCentroValidator],
  centroController.updateCentro
);

// Ruta para cambiar el estado de un centro por id (Admin Nacional y Director Regional)
router.patch('/:id/estado',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL], [PermisoEnum.EDITAR_CENTROS_TODOS, PermisoEnum.EDITAR_CENTROS_REGIONAL])
  ],
  [...idParamValidator, ...cambiarEstadoValidator],
  centroController.changeCentroStatus
);

// Ruta para obtener un centro por id
router.get('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.VER_CENTROS_TODOS, PermisoEnum.VER_CENTROS_REGIONAL, PermisoEnum.VER_CENTROS_PROPIOS]
    )
  ],
  idParamValidator,
  centroController.showCentro
);

export default router;

