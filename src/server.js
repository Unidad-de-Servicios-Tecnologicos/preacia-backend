import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";




const PORT = process.env.APP_PORT || 3000;
const APP_URL = process.env.APP_URL?.replace('${APP_PORT}', PORT) || `http://localhost:${PORT}`;


app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto: ${PORT}`);
  console.log(`✅ Servidor corriendo en: ${APP_URL}`);
  console.log(`✅ Documentación V1: ${APP_URL}/api-docs/v1`);
});
