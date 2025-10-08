import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Regional = sequelize.define(
  'Regional',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Código único de la regional',
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nombre de la regional',
    },
    direccion: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: 'Dirección de la regional',
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Teléfono de contacto',
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Estado activo/inactivo',
    },
  },
  {
    tableName: 'regionales',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        name: 'idx_estado',
        fields: ['estado'],
      },
      {
        name: 'idx_codigo',
        fields: ['codigo'],
      },
    ],
  }
);

export default Regional;

