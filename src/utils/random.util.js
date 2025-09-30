// utils/random.util.js
export const generateCode = (length = 6) => {
  return Math.random().toString(36).substr(2, length).toUpperCase();
};