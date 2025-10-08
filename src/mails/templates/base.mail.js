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
        title: "Credenciales de acceso - Sistema PRE-ACIA SENA",
        content: `
            <p style="font-size: 16px; color: #374151;">Hola ${usuario.nombres},</p>
            <p style="font-size: 14px; color: #6b7280;">Tu cuenta ha sido creada exitosamente en el Sistema Nacional de Gestión de Listas de Chequeo Precontractuales. A continuación, encontrarás tus credenciales de acceso:</p>
            
            <div style="background-color: #f9fafb; border: 2px solid #39A900; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #1a202c; font-size: 14px;">📧 Correo electrónico:</p>
                <p style="margin: 0 0 16px 0; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px; border-radius: 6px; font-size: 16px; color: #1f2937; border: 1px solid #e5e7eb;">${usuario.correo}</p>
                
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #1a202c; font-size: 14px;">🔒 Contraseña temporal:</p>
                <p style="margin: 0; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 12px; border-radius: 6px; font-size: 16px; color: #1f2937; border: 1px solid #e5e7eb; font-weight: bold;">${password}</p>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>⚠️ Importante:</strong> Por razones de seguridad, deberás cambiar tu contraseña después del primer inicio de sesión.</p>
            </div>
            
            <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>✅ ¡Listo!</strong> Tu cuenta ya está activa y puedes iniciar sesión inmediatamente usando las credenciales proporcionadas.</p>
            </div>
            
            <p style="text-align: center; margin: 24px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/ingresar" style="display:inline-block;padding:14px 32px;background-color:#39A900;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Iniciar sesión</a>
            </p>
        `,
        footer: `
            <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                Este es un correo automático del Sistema PRE-ACIA SENA, por favor no responda a este mensaje.<br>
                Si tienes alguna pregunta, contacta al administrador del sistema.
            </p>
        `
    });

    await sendMail({
        to: usuario.correo,
        subject: "Bienvenido al Sistema PRE-ACIA SENA - Credenciales de acceso",
        html
    });
};