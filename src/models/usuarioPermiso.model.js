import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const UsuarioPermiso = sequelize.define(
  'UsuarioPermiso',
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    permiso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permisos',
        key: 'id',
      },
    },
  },
  {
    tableName: 'usuario_permiso',
    timestamps: false,
  }
);

export default UsuarioPermiso;