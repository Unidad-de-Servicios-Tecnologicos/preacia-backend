import { Router } from "express";

import tipoDocumentoRoutes from "./tipoDocumento.routes.js";
import AuthRoutes from "./auth.routes.js";
import PermisoRoutes from "./permisos.routes.js";
import CentrosRoutes from "./centros.routes.js";
import CentroUsuarioRoutes from "./centroUsuario.routes.js";
import UsuarioRoutes from "./usuario.routes.js";
import UsuarioPermisoRoutes from "./usuarioPermiso.routes.js";


const router = Router();

router.use("/tipo-documentos", tipoDocumentoRoutes);
router.use("/auth", AuthRoutes);
router.use("/permiso", PermisoRoutes);
router.use("/centros", CentrosRoutes);
router.use("/centro-usuario", CentroUsuarioRoutes);
router.use("/usuarios", UsuarioRoutes);
router.use("/usuario-permiso", UsuarioPermisoRoutes);

export default router;