import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Centro = sequelize.define(
  'Centro',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    regional_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Regional a la que pertenece',
      references: {
        model: 'regionales',
        key: 'id'
      }
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Código del centro',
    },
    nombre: {
      type: DataTypes.STRING(300),
      allowNull: false,
      comment: 'Nombre del centro de formación',
    },
    direccion: {
      type: DataTypes.STRING(300),
      allowNull: true,
      comment: 'Dirección del centro',
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Teléfono de contacto',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Estado activo/inactivo',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'centros',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        name: 'idx_regional',
        fields: ['regional_id'],
      },
      {
        name: 'idx_activo',
        fields: ['activo'],
      },
      {
        name: 'unique_codigo_regional',
        unique: true,
        fields: ['regional_id', 'codigo'],
      },
    ],
  }
);

export default Centro;

