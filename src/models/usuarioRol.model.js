import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const UsuarioRol = sequelize.define(
  'UsuarioRol',
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    rol_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado de la asignación del rol',
    },
  },
  {
    tableName: 'usuario_rol',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default UsuarioRol;

