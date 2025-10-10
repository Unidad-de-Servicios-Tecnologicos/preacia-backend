import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
//import Supervisor from './supervisor.model.js';

const Centro = sequelize.define(
    'Centro',
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
        },
        nombre: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        // ciudad_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        // regional_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        // supervisores_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        // },
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
    }
);


export default Centro;