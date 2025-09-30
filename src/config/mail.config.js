import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM,
} = process.env;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: Number(MAIL_PORT) === 465, // SSL para puerto 465
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify()
  .then(() => {
    console.log("Servidor de correo listo para enviar mensajes");
  })
  .catch((error) => {
    console.error("Error en la conexión de correo:", error);
  });

/**
 * Envía un correo electrónico usando la configuración actual.
 * @param {Object} options - Opciones de envío (to, subject, text, html, etc.)
 * @returns {Promise}
 */
export const sendMail = (options) => {
  return transporter.sendMail({
    from: MAIL_FROM || MAIL_USERNAME,
    ...options,
  });
};

export default transporter;