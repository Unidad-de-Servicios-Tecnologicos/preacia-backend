import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import swaggerUi from "swagger-ui-express";
// import swaggerV1 from './docs/v1/v1.js';
// import v1Routes from "./routes/v1/index.route.js";
// import notFound from "./middlewares/notFound.middleware.js";
// import { errorHandler } from "./middlewares/errorHandler.middleware.js";
// import { requireJsonHeaders } from './middlewares/requireJsonHeaders.middleware.js';
// import './models/index.js'; // Importa solo para ejecutar las asociaciones

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// Documentación Swagger
// app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerV1));

// Middleware para manejar JSON y datos de formularios
//app.use(requireJsonHeaders); // Aplica antes de cualquier ruta
app.use(express.json());     // Parseo del JSON
app.use(express.urlencoded({ extended: true }));

// Prefijo de versión para la API
const API_VERSION = '/api/v1';

// Rutas versionadas
// app.use(API_VERSION, v1Routes);



// // Middleware para manejar rutas inexistentes (404)
// app.use(notFound);

// // Middleware global de manejo de errores
// app.use(errorHandler);

export default app;