import express from 'express';
import * as regionalController from '../../controllers/v1/regional/regional.controller.js';
import * as regionalCentroController from '../../controllers/v1/regional/regionalCentro.controller.js';

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

// Ruta para obtener todas las regionales (PÚBLICA)
router.get('/',
  regionalController.getRegionales
);

// Ruta para obtener lista simplificada de regionales (PÚBLICA)
router.get('/list',
  regionalController.getListRegionales
);

// Ruta para obtener centros de una regional específica (PÚBLICA)
router.get('/:id/centros',
  idParamValidator,
  regionalCentroController.getCentrosByRegional
);

// Ruta para crear una nueva regional (solo Admin Nacional)
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.CREAR_REGIONALES])
  ],
  createRegionalValidator,
  regionalController.storeRegional
);

// Ruta para editar una regional por ID (solo Admin Nacional)
router.put('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.EDITAR_REGIONALES])
  ],
  [...idParamValidator, ...updateRegionalValidator],
  regionalController.updateRegional
);

// Ruta para cambiar el estado de una regional por id (solo Admin Nacional)
router.patch('/:id/estado',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.EDITAR_REGIONALES])
  ],
  [...idParamValidator, ...cambiarEstadoValidator],
  regionalController.changeRegionalStatus
);

// Ruta para obtener una regional por id (PÚBLICA)
router.get('/:id',
  idParamValidator,
  regionalController.showRegional
);

export default router;

