import express from "express";
import register from "../../controllers/v1/auth/register.controller.js";
import login from "../../controllers/v1/auth/login.controller.js";
import forgotPassword from "../../controllers/v1/auth/forgotPassword.controller.js";
import resetPassword from "../../controllers/v1/auth/resetPassword.controller.js";
import refreshToken from "../../controllers/v1/auth/refreshToken.controller.js";
import changePassword from "../../controllers/v1/auth/changePassword.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js"; 
import { changePasswordValidator } from "../../middlewares/validators/changePassword.validator.js"; 
import { validateRequest } from "../../middlewares/validateRequest.middleware.js"; 

const router = express.Router();

router.post("/register", register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', refreshToken);
router.patch('/change-password', verificarToken, changePasswordValidator, validateRequest, changePassword);

export default router;