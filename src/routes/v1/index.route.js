import { Router } from "express";

import tipoDocumentoRoutes from "./tipoDocumento.routes.js";
import regionalRoutes from "./regional.routes.js";
import centroRoutes from "./centro.routes.js";
import usuarioRoutes from "./usuarios.routes.js";
import AuthRoutes from "./auth.routes.js";
import PermisoRoutes from "./permisos.routes.js";
import rolRoutes from "./roles.routes.js";


const router = Router();

router.use("/tipo-documentos", tipoDocumentoRoutes);
router.use("/roles", rolRoutes);
router.use("/regionales", regionalRoutes);
router.use("/centros", centroRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/auth", AuthRoutes);
router.use("/permisos", PermisoRoutes);

export default router;
