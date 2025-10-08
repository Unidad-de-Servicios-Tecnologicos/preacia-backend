// utils/random.util.js

/**
 * Genera un código aleatorio alfanumérico
 * @param {number} length - Longitud del código
 * @returns {string} Código generado
 */
export const generateCode = (length = 6) => {
  return Math.random().toString(36).substr(2, length).toUpperCase();
};

/**
 * Genera una contraseña segura aleatoria
 * Incluye mayúsculas, minúsculas, números y caracteres especiales
 * @param {number} length - Longitud de la contraseña (mínimo 12)
 * @returns {string} Contraseña generada
 */
export const generateSecurePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '@#$%&*!?';
  
  // Asegurar que la contraseña tenga al menos un carácter de cada tipo
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Completar el resto de la contraseña con caracteres aleatorios
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mezclar la contraseña para que los caracteres obligatorios no estén siempre al inicio
  return password.split('').sort(() => Math.random() - 0.5).join('');
};