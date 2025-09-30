import { Router } from "express";

import tipoDocumentoRoutes from "./tipoDocumento.routes.js";




const router = Router();

router.use("/tipo-documentos", tipoDocumentoRoutes);

export default router;