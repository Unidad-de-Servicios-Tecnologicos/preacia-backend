/**
 * Enumerador para el estado de los recursos.
 */
export const EstadoEnum = Object.freeze({
  ACTIVO: true,
  INACTIVO: false,
  toString: (estado) => (estado === true ? "ACTIVO" : "INACTIVO"),
});