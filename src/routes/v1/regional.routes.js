import express from 'express';
import * as regionalController from '../../controllers/v1/regional/regional.controller.js';

import { 
    createRegionalValidator, 
    updateRegionalValidator, 
    idParamValidator, 
    cambiarEstadoValidator 
} from '../../middlewares/validators/regional.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';
  
const router = express.Router();

// Ruta para obtener todas las regionales (todos los roles administrativos pueden ver)
router.get('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.GESTIONAR_REGIONALES]
    ),
  ],
  regionalController.getRegionales
);

// Ruta para obtener lista simplificada de regionales
router.get('/list',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.GESTIONAR_REGIONALES]
    ),
  ],
  regionalController.getListRegionales
);

// Ruta para obtener centros de una regional específica
router.get('/:id/centros',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.GESTIONAR_REGIONALES, PermisoEnum.GESTIONAR_CENTROS]
    ),
  ],
  idParamValidator,
  regionalController.getCentrosByRegional
);

// Ruta para crear una nueva regional (solo Admin Nacional)
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_REGIONALES])
  ],
  createRegionalValidator,
  regionalController.storeRegional
);

// Ruta para editar una regional por ID (solo Admin Nacional)
router.put('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_REGIONALES])
  ],
  [...idParamValidator, ...updateRegionalValidator],
  regionalController.updateRegional
);

// Ruta para cambiar el estado de una regional por id (solo Admin Nacional)
router.patch('/:id/estado',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_REGIONALES])
  ],
  [...idParamValidator, ...cambiarEstadoValidator],
  regionalController.changeRegionalStatus
);

// Ruta para obtener una regional por id
router.get('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMIN, RolEnum.DIRECTOR_REGIONAL, RolEnum.ADMINISTRADOR_CENTRO, RolEnum.REVISOR],
      [PermisoEnum.GESTIONAR_REGIONALES]
    )
  ],
  idParamValidator,
  regionalController.showRegional
);

export default router;

