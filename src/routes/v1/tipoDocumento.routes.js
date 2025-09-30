import express from 'express';
import * as tipoDocumentoController from '../../controllers/v1/tipoDocumento/tipoDocumento.controller.js';

import { createTipoDocumentoValidator, updateTipoDocumentoValidator, idParamValidator, cambiarEstadoValidator } from '../../middlewares/validators/tipoDocumento.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';
  
const router = express.Router();

// Ruta para obtener todos los tipos de documentos
router.get('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO],
      [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS]
    ),
  ],
  tipoDocumentoController.getTipoDocumentos
);

router.get('/list',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO],
      [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS]
    ),
  ],
  tipoDocumentoController.getListTipoDocumentos
);

// Ruta para crear un nuevo tipo de documento
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  createTipoDocumentoValidator,
  tipoDocumentoController.storeTipoDocumento
);

// Ruta para editar un tipo de documento por ID
router.put('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  [...idParamValidator, ...updateTipoDocumentoValidator],
  tipoDocumentoController.updateTipoDocumento
);

// Ruta para cambiar el estado de un tipo de documento por id
router.patch('/:id/estado',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  [...idParamValidator, ...cambiarEstadoValidator],
  tipoDocumentoController.changeTipoDocumentoStatus
);

// Ruta para obtener un tipo de documento por id
router.get('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_TIPO_DOCUMENTOS])
  ],
  idParamValidator,
  tipoDocumentoController.showTipoDocumento
);

export default router;


