import { Router } from "express";

import tipoDocumentoRoutes from "./tipoDocumento.routes.js";
import AuthRoutes from "./auth.routes.js";



const router = Router();

router.use("/tipo-documentos", tipoDocumentoRoutes);
router.use("/auth", AuthRoutes);

export default router;