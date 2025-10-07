import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import bcrypt from 'bcryptjs';
import { EstadoEnum } from '../enums/estado.enum.js';

const Usuario = sequelize.define(
    'Usuario',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        rol_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        tipo_documento_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tipo_documentos',
                key: 'id',
            },
        },
        documento: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        nombres: {
            type: DataTypes.STRING(100),
            allowNull: false,
            set(value) {
                this.setDataValue(
                    'nombres',
                    value
                        .toLowerCase()
                        .replace(/\b\w/g, l => l.toUpperCase())
                );
            },
        },
        apellidos: {
            type: DataTypes.STRING(100),
            allowNull: true,
            set(value) {
                this.setDataValue(
                    'apellidos',
                    value
                        .toLowerCase()
                        .replace(/\b\w/g, l => l.toUpperCase())
                );
            },
        },
        correo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            set(value) {
                this.setDataValue(
                    'correo',
                    value.toLowerCase()
                );
            },
        },
        telefono: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        direccion: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        contrasena: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: EstadoEnum.ACTIVO,
        },
        ultimo_acceso: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        acia_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        verificado_acia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        // NUEVAS PROPIEDADES PARA RESET PASSWORD
        reset_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reset_token_expires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// Método estático para comparar contraseñas
Usuario.comparePassword = async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Método estático para generar una nueva contraseña encriptada
Usuario.generatePassword = async function (plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

export default Usuario;