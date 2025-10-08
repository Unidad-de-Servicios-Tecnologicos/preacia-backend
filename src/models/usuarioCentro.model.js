import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const UsuarioCentro = sequelize.define(
  'UsuarioCentro',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    centro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'centros',
        key: 'id',
      },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Estado de la asignación',
    },
  },
  {
    tableName: 'usuario_centro',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'centro_id'],
        name: 'unique_usuario_centro',
      },
      {
        fields: ['usuario_id'],
        name: 'idx_usuario',
      },
      {
        fields: ['centro_id'],
        name: 'idx_centro',
      },
      {
        fields: ['estado'],
        name: 'idx_estado',
      },
    ],
  }
);

export default UsuarioCentro;

