import fs from "fs";
import path from "path";

// Crea el directorio de logs si no existe
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "error.log");
const infoLogFile = path.join(logDir, "info.log");

/**
 * Registra mensajes de error en un archivo de log.
 * @param {string} message - Mensaje principal del error.
 * @param {object} meta - Información adicional (stack, url, etc).
 */
export const logError = (message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ERROR: ${message}\n${JSON.stringify(meta, null, 2)}\n\n`;
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error("Error al escribir en el archivo de log:", err);
  });
};

/**
 * Registra mensajes informativos en un archivo de log.
 * @param {string} message - Mensaje principal.
 * @param {object} meta - Información adicional.
 */
export const logInfo = (message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] INFO: ${message}\n${JSON.stringify(meta, null, 2)}\n\n`;
  fs.appendFile(infoLogFile, logEntry, (err) => {
    if (err) console.error("Error al escribir en el archivo de log:", err);
  });
};