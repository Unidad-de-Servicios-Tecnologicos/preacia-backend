import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const TipoDocumento = sequelize.define(
  'TipoDocumento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      comment: 'Código único del tipo de documento (CC, CE, NIT, etc.)',
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nombre del tipo de documento',
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Estado activo/inactivo',
    },
  },
  {
    tableName: 'tipo_documentos',
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
    ],
  }
);


export default TipoDocumento;