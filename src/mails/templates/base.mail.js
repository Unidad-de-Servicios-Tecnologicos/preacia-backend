import { sendMail } from "../../config/mail.config.js";

/**
 * Template base para correos electrónicos
 * @param {Object} options - Opciones para el template
 * @param {string} options.title - Título del correo
 * @param {string} options.content - Contenido principal del correo
 * @param {string} options.footer - Texto del pie de página (opcional)
 * @returns {string} HTML del correo
 */
export const baseEmailTemplate = ({ title, content, footer }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background-color: #ffffff; border-radius: 8px 8px 0 0; padding: 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                <h1 style="color: #1a202c; font-size: 24px; margin: 0;">${title}</h1>
            </div>

            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 20px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
                ${content}
            </div>

            <!-- Footer -->
            <div style="background-color: #ffffff; border-radius: 0 0 8px 8px; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                ${footer || `
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    Este es un correo automático, por favor no responda a este mensaje.
                </p>
                `}
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Envía el correo de restablecimiento de contraseña usando Mailtrap
 * @param {Object} usuario - Objeto usuario con al menos { nombres, correo }
 * @param {string} resetLink - Enlace para restablecer la contraseña
 */
export const sendResetPassword = async (usuario, resetLink) => {
    const html = baseEmailTemplate({
        title: "Restablece tu contraseña",
        content: `
            <p>Hola ${usuario.nombres},</p>
            <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
            <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#39A900;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Restablecer contraseña</a>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        `
    });

    await sendMail({
        to: usuario.correo,
        subject: "Restablece tu contraseña",
        html
    });
};



/**
 * Envía el correo con las credenciales de acceso (contraseña generada)
 * @param {Object} usuario - Objeto usuario con al menos { nombres, correo }
 * @param {string} password - Contraseña generada para el usuario
 */
export const sendPasswordCredentialsEmail = async (usuario, password) => {
    const html = baseEmailTemplate({
        title: "Credenciales de acceso",
        content: `
            <p>Hola ${usuario.nombres},</p>
            <p>Tu cuenta ha sido creada exitosamente. A continuación, encontrarás tus credenciales de acceso al sistema:</p>
            
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0; font-weight: bold;">Correo electrónico:</p>
                <p style="margin: 4px 0 12px 0; font-family: monospace; background-color: #ffffff; padding: 8px; border-radius: 4px;">${usuario.correo}</p>
                
                <p style="margin: 0; font-weight: bold;">Contraseña:</p>
                <p style="margin: 4px 0 0 0; font-family: monospace; background-color: #ffffff; padding: 8px; border-radius: 4px;">${password}</p>
            </div>
            
            <p><strong>Importante:</strong> Por razones de seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p>
            
            <p>Puedes acceder al sistema haciendo clic en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/ingresar" style="display:inline-block;padding:12px 24px;background-color:#39A900;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Iniciar sesión</a>
        `
    });

    await sendMail({
        to: usuario.correo,
        subject: "Bienvenido al sistema - Credenciales de acceso",
        html
    });
};