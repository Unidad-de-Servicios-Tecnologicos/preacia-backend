import { Router } from "express";

import tipoDocumentoRoutes from "./tipoDocumento.routes.js";
import AuthRoutes from "./auth.routes.js";
import rolesRoutes from "./roles.routes.js";

const router = Router();

router.use("/tipo-documentos", tipoDocumentoRoutes);
router.use("/auth", AuthRoutes);
router.use("/roles", rolesRoutes);

export default router;
