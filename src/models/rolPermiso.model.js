import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const RolPermiso = sequelize.define(
  'RolPermiso',
  {
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
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
    tableName: 'rol_permiso',
    timestamps: false,
  }
);

export default RolPermiso;