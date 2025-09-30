import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Encripta una contraseña usando bcrypt.
 * @param {string} contrasena - Contraseña en texto plano.
 * @returns {Promise<string>} Contraseña encriptada.
 */
export async function encriptPassword(password, saltRounds = 10) {
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Genera un access token JWT para un usuario.
 * @param {Object} user - Objeto usuario con propiedades relevantes.
 * @param {string} [expiresIn='24h'] - Tiempo de expiración del token.
 * @returns {string} Token JWT firmado.
 */
export function generateAccessToken(user, expiresIn = '24h') {
    const payload = {
        id: user.id,
        correo: user.correo,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre,
        estado: user.estado
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
}
