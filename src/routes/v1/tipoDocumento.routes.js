import express from 'express';
import * as tipoDocumentoController from '../../controllers/v1/tipoDocumento/tipoDocumento.controller.js';

import { createTipoDocumentoValidator, updateTipoDocumentoValidator, idParamValidator, cambiarEstadoValidator } from '../../middlewares/validators/tipoDocumento.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';
  
const router = express.Router();

// Ruta para obtener todos los tipos de documentos (PÚBLICA)
router.get('/',
  tipoDocumentoController.getTipoDocumentos
);

// Ruta para obtener lista simplificada de tipos de documentos (PÚBLICA)
router.get('/list',
  tipoDocumentoController.getListTipoDocumentos
);

// Ruta para crear un nuevo tipo de documento (solo Admin Nacional)
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  createTipoDocumentoValidator,
  tipoDocumentoController.storeTipoDocumento
);

// Ruta para editar un tipo de documento por ID (solo Admin Nacional)
router.put('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  [...idParamValidator, ...updateTipoDocumentoValidator],
  tipoDocumentoController.updateTipoDocumento
);

// Ruta para cambiar el estado de un tipo de documento por id (solo Admin Nacional)
router.patch('/:id/estado',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMIN], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  [...idParamValidator, ...cambiarEstadoValidator],
  tipoDocumentoController.changeTipoDocumentoStatus
);

// Ruta para obtener un tipo de documento por id (PÚBLICA)
router.get('/:id',
  idParamValidator,
  tipoDocumentoController.showTipoDocumento
);

export default router;


