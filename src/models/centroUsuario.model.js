import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const CentroUsuario = sequelize.define(
    'CentroUsuario',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        centro_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'centros',
                key: 'id',
            },
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id',
            },
        },
    },
    {
        tableName: 'centro_usuario',
        timestamps: false,
    }
);

export default CentroUsuario;