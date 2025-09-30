# Preacia Backend API

API REST desarrollada con Node.js, Express.js y Sequelize para el sistema **Preacia**, una plataforma especializada en la gestión de documentación previa para procesos de contratación. Esta API proporciona endpoints para la carga, gestión y control de documentos requeridos en procesos contractuales, incluyendo autenticación, gestión de usuarios, tipos de documentos, roles y permisos.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Documentación API](#documentación-api)
- [Scripts Disponibles](#scripts-disponibles)
- [Variables de Entorno](#variables-de-entorno)

## 🚀 Características

- **Gestión de Documentación**: Sistema especializado para la carga y gestión de documentos previos a procesos de contratación
- **Tipos de Documentos**: Clasificación y categorización de documentos contractuales (RUT, certificados, pólizas, etc.)
- **Autenticación JWT**: Sistema de autenticación seguro con tokens JWT
- **Autorización por Roles**: Control de acceso basado en roles y permisos para diferentes tipos de usuarios
- **Validación de Documentos**: Validación robusta de archivos y datos con express-validator
- **Documentación Swagger**: API documentada automáticamente para facilitar la integración
- **Paginación**: Sistema de paginación estándar JSON:API para grandes volúmenes de documentos
- **Manejo de Errores**: Sistema centralizado de manejo de errores con códigos específicos
- **Base de Datos MySQL**: ORM Sequelize para gestión eficiente de datos
- **Arquitectura MVC**: Separación clara de responsabilidades y escalabilidad
- **Versionado de API**: Soporte para versionado de endpoints
- **Seguridad**: Encriptación de contraseñas y protección de datos sensibles

## 🛠 Tecnologías

- **Node.js** - Runtime de JavaScript para el backend
- **Express.js** - Framework web para Node.js
- **Sequelize** - ORM para gestión de base de datos
- **MySQL** - Base de datos relacional para almacenamiento de documentos y metadatos
- **JWT** - Autenticación segura con tokens
- **Swagger** - Documentación automática de API
- **Bcrypt** - Encriptación segura de contraseñas
- **Nodemailer** - Sistema de notificaciones por correo electrónico
- **Express-validator** - Validación robusta de datos y archivos
- **CORS** - Configuración de políticas de origen cruzado

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Unidad-de-Servicios-Tecnologicos/preacia-backend.git
   cd preacia-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

4. **Configurar la base de datos**
   - Crear una base de datos MySQL
   - Importar el archivo `src/database/database.sql`
   - Ejecutar el archivo `src/database/data.sql` para datos iniciales

5. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la aplicación
APP_PORT=3000
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Configuración de la base de datos
DB_NAME=preacia_db
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

# Configuración JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_clave_refresh_secreta
JWT_REFRESH_EXPIRES_IN=7d

# Configuración de correo
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
```

## 📁 Estructura del Proyecto

```
src/
├── app.js                      # Configuración principal de Express
├── server.js                   # Punto de entrada del servidor
├── config/                     # Configuraciones
│   ├── db.config.js           # Configuración de base de datos
│   ├── logger.config.js       # Configuración de logs
│   └── mail.config.js         # Configuración de correo
├── controllers/                # Controladores
│   ├── v1/                    # Controladores v1
│   │   ├── auth/              # Controladores de autenticación
│   │   └── tipoDocumento/     # Controladores de tipos de documento
│   └── rol/                   # Controladores de roles
├── middlewares/                # Middlewares
│   ├── auth.middleware.js     # Middleware de autenticación
│   ├── errorHandler.middleware.js # Manejo de errores
│   ├── notFound.middleware.js # Manejo de rutas 404
│   └── validators/            # Validadores
├── models/                     # Modelos de Sequelize
├── repositories/               # Capa de acceso a datos
├── routes/                     # Definición de rutas
│   └── v1/                    # Rutas v1
├── services/                   # Lógica de negocio
│   └── v1/                    # Servicios v1
├── utils/                      # Utilidades
├── docs/                       # Documentación Swagger
│   └── v1/                    # Documentación v1
├── enums/                      # Enumeraciones
├── mails/                      # Plantillas de correo
└── database/                   # Scripts de base de datos
```

## 🏗 Arquitectura

El proyecto sigue una arquitectura de **capas** bien definida:

### 1. **Capa de Rutas** (`routes/`)
- Define los endpoints de la API
- Aplica middlewares de autenticación y validación
- Delega la lógica a los controladores

### 2. **Capa de Controladores** (`controllers/`)
- Maneja las peticiones HTTP
- Valida los datos de entrada
- Llama a los servicios correspondientes
- Formatea las respuestas

### 3. **Capa de Servicios** (`services/`)
- Contiene la lógica de negocio
- Valida reglas de negocio
- Coordina múltiples repositorios si es necesario
- Maneja transacciones

### 4. **Capa de Repositorios** (`repositories/`)
- Acceso directo a la base de datos
- Consultas complejas con Sequelize
- Operaciones CRUD básicas

### 5. **Capa de Modelos** (`models/`)
- Define la estructura de las tablas
- Relaciones entre entidades
- Validaciones a nivel de modelo

### 6. **Capa de Utilidades** (`utils/`)
- Funciones auxiliares reutilizables
- Formateo de respuestas
- Utilidades de paginación

## 📖 Guía de Desarrollo

### Cómo Crear una Nueva Entidad

Para crear una nueva entidad relacionada con la gestión de documentos de contratación (por ejemplo, "Documento"), sigue estos pasos:

#### 1. **Crear el Modelo**

```javascript
// src/models/documento.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import { EstadoEnum } from '../enums/estado.enum.js';

const Documento = sequelize.define(
  'Documento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_archivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ruta_archivo: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    tipo_documento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipo_documentos',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    proceso_contratacion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'procesos_contratacion',
        key: 'id'
      }
    },
    fecha_vencimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: EstadoEnum.ACTIVO,
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
    tableName: 'documentos',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default Documento;
```

#### 2. **Crear el Repositorio**

```javascript
// src/repositories/documento.repository.js
import { Op } from "sequelize";
import Documento from "../models/documento.model.js";
import TipoDocumento from "../models/tipoDocumento.model.js";
import Usuario from "../models/usuario.model.js";

export const getDocumentosRepository = async ({
  id,
  nombre_archivo,
  tipo_documento_id,
  usuario_id,
  proceso_contratacion_id,
  estado,
  search,
  sortBy = "id",
  order = "ASC",
  page = 1,
  limit = 10
}) => {
  const whereClause = {};

  if (id) {
    whereClause.id = { [Op.eq]: id };
  }

  if (tipo_documento_id) {
    whereClause.tipo_documento_id = { [Op.eq]: tipo_documento_id };
  }

  if (usuario_id) {
    whereClause.usuario_id = { [Op.eq]: usuario_id };
  }

  if (proceso_contratacion_id) {
    whereClause.proceso_contratacion_id = { [Op.eq]: proceso_contratacion_id };
  }

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  if (search) {
    whereClause[Op.or] = [
      { id: { [Op.like]: `%${search}%` } },
      { nombre_archivo: { [Op.like]: `%${search}%` } },
      { observaciones: { [Op.like]: `%${search}%` } },
    ];
  } else {
    if (nombre_archivo) {
      whereClause.nombre_archivo = { [Op.like]: `%${nombre_archivo}%` };
    }
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await Documento.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: TipoDocumento,
        as: 'tipoDocumento',
        attributes: ['id', 'nombre']
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido']
      }
    ],
    order: [[sortBy, order]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return { data: rows, count };
};

export const getListDocumentosRepository = async (estado, sortBy = "id", order = "ASC") => {
  const whereClause = {};

  if (estado !== undefined) {
    whereClause.estado = { [Op.eq]: estado };
  }

  const { count, rows } = await Documento.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: TipoDocumento,
        as: 'tipoDocumento',
        attributes: ['id', 'nombre']
      }
    ],
    order: [[sortBy, order]],
  });

  return { data: rows, count };
};

export const showDocumentoRepository = async (id) => {
  return await Documento.findOne({
    where: { id },
    include: [
      {
        model: TipoDocumento,
        as: 'tipoDocumento',
        attributes: ['id', 'nombre']
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido']
      }
    ]
  });
};

export const storeDocumentoRepository = async (data) => {
  return await Documento.create(data);
};

export const updateDocumentoRepository = async (id, data) => {
  const documento = await Documento.findOne({ where: { id } });
  if (!documento) return null;

  const updateData = {
    ...data,
    updated_at: new Date()
  };

  await documento.update(updateData);
  await documento.reload();
  return documento;
};

export const findDocumentoByNombreRepository = async (nombre_archivo) => {
  return await Documento.findOne({
    where: { nombre_archivo: { [Op.like]: nombre_archivo } },
    attributes: ['id', 'nombre_archivo']
  });
};

export const findDocumentoByNombreExcludingIdRepository = async (nombre_archivo, idExcluir) => {
  return await Documento.findOne({
    where: {
      nombre_archivo: { [Op.like]: nombre_archivo },
      id: { [Op.ne]: idExcluir }
    },
    attributes: ['id', 'nombre_archivo']
  });
};
```

#### 3. **Crear el Servicio**

```javascript
// src/services/v1/documento.service.js
import { buildPagination } from "../../utils/buildPagination.util.js";
import {
  getDocumentosRepository,
  getListDocumentosRepository,
  storeDocumentoRepository,
  showDocumentoRepository,
  updateDocumentoRepository,
  findDocumentoByNombreRepository,
  findDocumentoByNombreExcludingIdRepository,
} from "../../repositories/documento.repository.js";
import { EstadoEnum } from "../../enums/estado.enum.js";

export const getDocumentosService = async (req) => {
  const {
    id,
    nombre_archivo,
    tipo_documento_id,
    usuario_id,
    proceso_contratacion_id,
    estado,
    search,
    sortBy = "id",
    order = "ASC",
    page = 1,
    limit = 10
  } = req.query;

  let estadoBoolean = estado;
  if (estado === 'true' || estado === 'activo') estadoBoolean = true;
  if (estado === 'false' || estado === 'inactivo') estadoBoolean = false;
  if (estado === undefined || estado === null || estado === 'todos') estadoBoolean = undefined;

  const { data, count } = await getDocumentosRepository({
    id,
    nombre_archivo,
    tipo_documento_id,
    usuario_id,
    proceso_contratacion_id,
    estado: estadoBoolean,
    search,
    sortBy,
    order,
    page,
    limit
  });

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const queryWithoutPage = Object.entries({ ...req.query, page: undefined })
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const { meta, links } = buildPagination({
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    baseUrl,
    queryWithoutPage,
  });

  return { data, count, meta, links, isPaginated: true };
};

export const getListDocumentosService = async (estado, sortBy = "id", order = "ASC") => {
  return await getListDocumentosRepository(estado, sortBy, order);
};

export const storeDocumentoService = async (data) => {
  // Verificar si ya existe un documento con el mismo nombre de archivo
  const existingDocumento = await findDocumentoByNombreRepository(data.nombre_archivo);
  if (existingDocumento) {
    const error = new Error(`El archivo "${data.nombre_archivo}" ya está registrado. No se puede repetir el nombre del archivo.`);
    error.code = "DUPLICATE_DOCUMENTO_NAME";
    throw error;
  }

  return await storeDocumentoRepository(data);
};

export const showDocumentoService = async (id) => {
  return await showDocumentoRepository(id);
};

export const updateDocumentoService = async (id, data) => {
  const documento = await showDocumentoRepository(id);
  if (!documento) {
    const error = new Error("Documento no encontrado");
    error.code = "NOT_FOUND";
    throw error;
  }

  // Si se está actualizando el nombre del archivo, verificar que no exista otro documento con el mismo nombre
  if (data.nombre_archivo && data.nombre_archivo !== documento.nombre_archivo) {
    const existingDocumento = await findDocumentoByNombreExcludingIdRepository(data.nombre_archivo, id);
    if (existingDocumento) {
      const error = new Error(`El archivo "${data.nombre_archivo}" ya está registrado. No se puede repetir el nombre del archivo.`);
      error.code = "DUPLICATE_DOCUMENTO_NAME";
      throw error;
    }
  }

  return await updateDocumentoRepository(id, data);
};

export const changeDocumentoStatusService = async (id, nuevoEstado) => {
  const documento = await showDocumentoRepository(id);
  if (!documento) {
    const error = new Error("Documento no encontrado");
    error.code = "NOT_FOUND";
    throw error;
  }

  let nuevoEstadoEnum;
  
  if (typeof nuevoEstado === 'boolean') {
    nuevoEstadoEnum = nuevoEstado ? EstadoEnum.ACTIVO : EstadoEnum.INACTIVO;
  } else if (nuevoEstado === 'true') {
    nuevoEstadoEnum = EstadoEnum.ACTIVO;
  } else if (nuevoEstado === 'false') {
    nuevoEstadoEnum = EstadoEnum.INACTIVO;
  } else {
    const estadoActual = documento.estado;
    nuevoEstadoEnum = estadoActual ? EstadoEnum.INACTIVO : EstadoEnum.ACTIVO;
  }

  const updatedDocumento = await updateDocumentoRepository(id, { estado: nuevoEstadoEnum });
  return updatedDocumento;
};
```

#### 4. **Crear el Controlador**

```javascript
// src/controllers/v1/documento/documento.controller.js
import { validationResult } from "express-validator";
import { errorResponse, successResponse } from "../../../utils/response.util.js";
import { formatJsonApiData } from "../../../utils/formatJsonData.util.js";
import {
  getDocumentosService,
  getListDocumentosService,
  storeDocumentoService,
  showDocumentoService,
  updateDocumentoService,
  changeDocumentoStatusService
} from "../../../services/v1/documento.service.js";

export const getDocumentos = async (req, res) => {
  try {
    const { data, meta, links } = await getDocumentosService(req);

    return successResponse(
      res,
      data,
      200,
      meta,
      links
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener los documentos", 500, [
      {
        code: "GET_DOCUMENTOS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const getListDocumentos = async (req, res) => {
  try {
    let { estado, sortBy = "id", order = "ASC" } = req.query;
    if (estado !== undefined) {
      if (estado === "true") estado = true;
      else if (estado === "false") estado = false;
      else estado = undefined;
    }

    const { data, count } = await getListDocumentosService(estado, sortBy, order);

    return successResponse(
      res,
      formatJsonApiData(data, ["id", "nombre_archivo", "tipo_documento_id", "estado"]),
      200,
      { count }
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener la lista de documentos", 500, [
      {
        code: "GET_LIST_DOCUMENTOS_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const storeDocumento = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const documento = await storeDocumentoService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Documento cargado exitosamente',
      data: {
        id: documento.id,
        nombre_archivo: documento.nombre_archivo,
        ruta_archivo: documento.ruta_archivo,
        tipo_documento_id: documento.tipo_documento_id,
        usuario_id: documento.usuario_id,
        proceso_contratacion_id: documento.proceso_contratacion_id,
        fecha_vencimiento: documento.fecha_vencimiento,
        observaciones: documento.observaciones,
        estado: documento.estado,
      }
    });
  } catch (error) {
    console.error("Error al cargar documento:", error);

    if (error.code === "DUPLICATE_DOCUMENTO_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al cargar el documento",
      error: error.message
    });
  }
};

export const showDocumento = async (req, res) => {
  try {
    const documento = await showDocumentoService(req.params.id);

    if (!documento) {
      return errorResponse(res, "No existe un documento con el ID", 404, [
        {
          code: "DOCUMENTO_NOT_FOUND",
          detail: `No existe un documento con ID ${req.params.id}`,
        },
      ]);
    }

    return successResponse(
      res,
      {
        id: documento.id,
        nombre_archivo: documento.nombre_archivo,
        ruta_archivo: documento.ruta_archivo,
        tipo_documento_id: documento.tipo_documento_id,
        usuario_id: documento.usuario_id,
        proceso_contratacion_id: documento.proceso_contratacion_id,
        fecha_vencimiento: documento.fecha_vencimiento,
        observaciones: documento.observaciones,
        estado: documento.estado,
        tipoDocumento: documento.tipoDocumento,
        usuario: documento.usuario,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "Error al obtener el documento", 500, [
      {
        code: "SHOW_DOCUMENTO_ERROR",
        detail: error.message,
      },
    ]);
  }
};

export const updateDocumento = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array()
    });
  }

  try {
    const documento = await updateDocumentoService(req.params.id, req.body);

    if (!documento) {
      return res.status(404).json({
        success: false,
        message: `No existe un documento con ID ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: documento
    });
  } catch (error) {
    console.error("Error al actualizar el documento:", error);

    if (error.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: `No existe un documento con ID ${req.params.id}`
      });
    }

    if (error.code === "DUPLICATE_DOCUMENTO_NAME") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error al actualizar el documento",
      error: error.message
    });
  }
};

export const changeDocumentoStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, "Errores de validación", 400,
      errors.array().map(error => ({
        code: "VALIDATION_ERROR",
        detail: error.msg,
        field: error.path
      }))
    );
  }

  try {
    const documento = await changeDocumentoStatusService(req.params.id, req.body.estado);

    return successResponse(
      res,
      {
        id: documento.id,
        nombre_archivo: documento.nombre_archivo,
        estado: documento.estado,
      },
      200
    );
  } catch (error) {
    console.error("Error al cambiar estado:", error);

    if (error.code === "NOT_FOUND") {
      return errorResponse(res, "Documento no encontrado", 404, [
        {
          code: "DOCUMENTO_NOT_FOUND",
          detail: error.message,
        },
      ]);
    }

    return errorResponse(res, "Error al cambiar el estado del documento", 500, [
      {
        code: "CHANGE_DOCUMENTO_STATUS_ERROR",
        detail: error.message,
      },
    ]);
  }
};
```

#### 5. **Crear las Validaciones**

```javascript
// src/middlewares/validators/documento.validator.js
import { body, param } from 'express-validator';
import { EstadoEnum } from '../../enums/estado.enum.js';

const idParamValidator = [
  param('id')
    .isNumeric()
    .withMessage('El id debe ser numérico.')
    .notEmpty()
    .withMessage('El id es obligatorio.')
];

const cambiarEstadoValidator = [
  body('estado')
    .isIn(Object.values(EstadoEnum))
    .withMessage('El estado debe ser un valor enum (ACTIVO o INACTIVO).')
    .notEmpty()
    .withMessage('El estado es obligatorio.')
];

const createDocumentoValidator = [
  body('nombre_archivo')
    .isString()
    .withMessage('El nombre del archivo debe ser una cadena de texto.')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre del archivo debe tener entre 3 y 255 caracteres.')
    .notEmpty()
    .withMessage('El nombre del archivo es obligatorio.')
    .trim(),

  body('ruta_archivo')
    .isString()
    .withMessage('La ruta del archivo debe ser una cadena de texto.')
    .isLength({ min: 3, max: 500 })
    .withMessage('La ruta del archivo debe tener entre 3 y 500 caracteres.')
    .notEmpty()
    .withMessage('La ruta del archivo es obligatoria.')
    .trim(),

  body('tipo_documento_id')
    .isInt({ min: 1 })
    .withMessage('El tipo de documento debe ser un número entero válido.')
    .notEmpty()
    .withMessage('El tipo de documento es obligatorio.'),

  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario debe ser un número entero válido.')
    .notEmpty()
    .withMessage('El usuario es obligatorio.'),

  body('proceso_contratacion_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El proceso de contratación debe ser un número entero válido.'),

  body('fecha_vencimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO8601.'),

  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser una cadena de texto.')
    .trim(),

  body('estado')
    .isIn(Object.values(EstadoEnum))
    .withMessage('El estado debe ser un valor enum (ACTIVO o INACTIVO).')
    .notEmpty()
    .withMessage('El estado es obligatorio.')
    .trim(),
];

const updateDocumentoValidator = [
  body('nombre_archivo')
    .optional()
    .trim()
    .isString()
    .withMessage('El nombre del archivo debe ser una cadena de texto.')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre del archivo debe tener entre 3 y 255 caracteres.'),

  body('ruta_archivo')
    .optional()
    .trim()
    .isString()
    .withMessage('La ruta del archivo debe ser una cadena de texto.')
    .isLength({ min: 3, max: 500 })
    .withMessage('La ruta del archivo debe tener entre 3 y 500 caracteres.'),

  body('tipo_documento_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El tipo de documento debe ser un número entero válido.'),

  body('usuario_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El usuario debe ser un número entero válido.'),

  body('proceso_contratacion_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El proceso de contratación debe ser un número entero válido.'),

  body('fecha_vencimiento')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO8601.'),

  body('observaciones')
    .optional()
    .trim()
    .isString()
    .withMessage('Las observaciones deben ser una cadena de texto.'),

  body('estado')
    .optional()
    .isIn(Object.values(EstadoEnum))
    .withMessage('El estado debe ser un valor enum (ACTIVO o INACTIVO).')
    .trim(),
];

export { 
  idParamValidator, 
  createDocumentoValidator, 
  updateDocumentoValidator, 
  cambiarEstadoValidator 
};
```

#### 6. **Crear las Rutas**

```javascript
// src/routes/v1/documento.routes.js
import express from 'express';
import * as documentoController from '../../controllers/v1/documento/documento.controller.js';
import { 
  createDocumentoValidator, 
  updateDocumentoValidator, 
  idParamValidator, 
  cambiarEstadoValidator 
} from '../../middlewares/validators/documento.validator.js';
import { verificarToken, verificarCuentaActiva, verificarRolOPermiso } from '../../middlewares/auth.middleware.js';
import { RolEnum } from '../../enums/rol.enum.js';
import { PermisoEnum } from '../../enums/permiso.enum.js';

const router = express.Router();

// Ruta para obtener todos los documentos
router.get('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO],
      [PermisoEnum.GESTIONAR_DOCUMENTOS]
    ),
  ],
  documentoController.getDocumentos
);

// Ruta para obtener lista simple de documentos
router.get('/list',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO],
      [PermisoEnum.GESTIONAR_DOCUMENTOS]
    ),
  ],
  documentoController.getListDocumentos
);

// Ruta para cargar un nuevo documento
router.post('/',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO], 
      [PermisoEnum.CARGAR_DOCUMENTOS]
    )
  ],
  createDocumentoValidator,
  documentoController.storeDocumento
);

// Ruta para obtener un documento por ID
router.get('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso(
      [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO, RolEnum.USUARIO],
      [PermisoEnum.GESTIONAR_DOCUMENTOS]
    )
  ],
  idParamValidator,
  documentoController.showDocumento
);

// Ruta para editar un documento por ID
router.put('/:id',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO], [PermisoEnum.GESTIONAR_DOCUMENTOS])
  ],
  [...idParamValidator, ...updateDocumentoValidator],
  documentoController.updateDocumento
);

// Ruta para cambiar el estado de un documento por ID
router.patch('/:id/estado',
  [
    verificarToken,
    verificarCuentaActiva,
    verificarRolOPermiso([RolEnum.ADMINISTRADOR], [PermisoEnum.GESTIONAR_DOCUMENTOS])
  ],
  [...idParamValidator, ...cambiarEstadoValidator],
  documentoController.changeDocumentoStatus
);

export default router;
```

#### 7. **Registrar las Rutas**

```javascript
// src/routes/v1/index.route.js
import express from 'express';
import tipoDocumentoRoutes from './tipoDocumento.routes.js';
import documentoRoutes from './documento.routes.js'; // Agregar la nueva ruta
import authRoutes from './auth.routes.js';
import rolRoutes from './rol.routes.js';
// ... otras rutas

const router = express.Router();

// Registrar las rutas
router.use('/auth', authRoutes);
router.use('/tipo-documentos', tipoDocumentoRoutes);
router.use('/documentos', documentoRoutes); // Registrar la nueva ruta
router.use('/roles', rolRoutes);
// ... otras rutas

export default router;
```

#### 8. **Crear Documentación Swagger**

```javascript
// src/docs/v1/paths/documento/documento.path.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Documento:
 *       type: object
 *       required:
 *         - nombre_archivo
 *         - ruta_archivo
 *         - tipo_documento_id
 *         - usuario_id
 *         - estado
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del documento
 *           example: 1
 *         nombre_archivo:
 *           type: string
 *           description: Nombre del archivo del documento
 *           example: "RUT_Empresa_2024.pdf"
 *         ruta_archivo:
 *           type: string
 *           description: Ruta donde se almacena el archivo
 *           example: "/uploads/documentos/2024/01/RUT_Empresa_2024.pdf"
 *         tipo_documento_id:
 *           type: integer
 *           description: ID del tipo de documento
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que cargó el documento
 *           example: 1
 *         proceso_contratacion_id:
 *           type: integer
 *           description: ID del proceso de contratación asociado
 *           example: 1
 *         fecha_vencimiento:
 *           type: string
 *           format: date
 *           description: Fecha de vencimiento del documento
 *           example: "2024-12-31"
 *         observaciones:
 *           type: string
 *           description: Observaciones adicionales del documento
 *           example: "Documento actualizado para el proceso de contratación"
 *         estado:
 *           type: boolean
 *           description: Estado del documento (activo/inactivo)
 *           example: true
 */

/**
 * @swagger
 * /api/v1/documentos:
 *   get:
 *     summary: Obtener todos los documentos
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda global por nombre de archivo o observaciones
 *       - in: query
 *         name: tipo_documento_id
 *         schema:
 *           type: integer
 *         description: Filtrar por tipo de documento
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Filtrar por usuario
 *       - in: query
 *         name: proceso_contratacion_id
 *         schema:
 *           type: integer
 *         description: Filtrar por proceso de contratación
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [true, false, todos]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de documentos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Documento'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                 links:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/documentos:
 *   post:
 *     summary: Cargar un nuevo documento
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_archivo
 *               - ruta_archivo
 *               - tipo_documento_id
 *               - usuario_id
 *               - estado
 *             properties:
 *               nombre_archivo:
 *                 type: string
 *                 example: "RUT_Empresa_2024.pdf"
 *               ruta_archivo:
 *                 type: string
 *                 example: "/uploads/documentos/2024/01/RUT_Empresa_2024.pdf"
 *               tipo_documento_id:
 *                 type: integer
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               proceso_contratacion_id:
 *                 type: integer
 *                 example: 1
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               observaciones:
 *                 type: string
 *                 example: "Documento actualizado para el proceso de contratación"
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Documento cargado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documento cargado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Documento'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
```

### Patrones y Mejores Prácticas

#### 1. **Nomenclatura de Archivos**
- **Modelos**: `entidad.model.js` (ej: `documento.model.js`, `usuario.model.js`)
- **Controladores**: `entidad.controller.js` (ej: `documento.controller.js`, `usuario.controller.js`)
- **Servicios**: `entidad.service.js` (ej: `documento.service.js`, `usuario.service.js`)
- **Repositorios**: `entidad.repository.js` (ej: `documento.repository.js`, `usuario.repository.js`)
- **Validadores**: `entidad.validator.js` (ej: `documento.validator.js`, `usuario.validator.js`)
- **Rutas**: `entidad.routes.js` (ej: `documento.routes.js`, `usuario.routes.js`)

#### 2. **Nomenclatura de Funciones**
- **Repositorios**: `operacionEntidadRepository` (ej: `getDocumentosRepository`, `getUsuariosRepository`)
- **Servicios**: `operacionEntidadService` (ej: `getDocumentosService`, `getUsuariosService`)
- **Controladores**: `operacionEntidad` (ej: `getDocumentos`, `getUsuarios`)

#### 3. **Estructura de Respuestas**
```javascript
// Respuesta exitosa
{
  "data": { /* datos */ },
  "meta": { /* metadatos opcionales */ },
  "links": { /* enlaces de paginación opcionales */ }
}

// Respuesta de error
{
  "errors": [
    {
      "status": "400",
      "title": "Error de validación",
      "detail": "El campo nombre es requerido",
      "code": "VALIDATION_ERROR"
    }
  ]
}
```

#### 4. **Manejo de Errores**
```javascript
// En servicios
const error = new Error("Mensaje descriptivo");
error.code = "CUSTOM_ERROR_CODE";
throw error;

// En controladores
if (error.code === "CUSTOM_ERROR_CODE") {
  return res.status(400).json({
    success: false,
    message: error.message
  });
}
```

#### 5. **Validaciones**
```javascript
// Validaciones básicas
body('campo')
  .isString()
  .withMessage('El campo debe ser una cadena de texto.')
  .isLength({ min: 3, max: 50 })
  .withMessage('El campo debe tener entre 3 y 50 caracteres.')
  .notEmpty()
  .withMessage('El campo es obligatorio.')
  .trim()
```

#### 6. **Autenticación y Autorización**
```javascript
// Middleware de autenticación
[
  verificarToken,
  verificarCuentaActiva,
  verificarRolOPermiso(
    [RolEnum.ADMINISTRADOR, RolEnum.EMPLEADO],
    [PermisoEnum.GESTIONAR_USUARIOS]
  )
]
```

## 📚 Documentación API

La documentación completa de la API está disponible en:
- **Desarrollo**: `http://localhost:3000/api-docs/v1`
- **Producción**: `{APP_URL}/api-docs/v1`

### Endpoints Principales

#### Autenticación y Usuarios
- `POST /api/v1/auth/login` - Iniciar sesión en el sistema
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/refresh-token` - Renovar token de acceso
- `POST /api/v1/auth/forgot-password` - Solicitar restablecimiento de contraseña
- `POST /api/v1/auth/reset-password` - Restablecer contraseña
- `POST /api/v1/auth/change-password` - Cambiar contraseña actual

#### Gestión de Tipos de Documentos
- `GET /api/v1/tipo-documentos` - Obtener tipos de documentos con paginación
- `GET /api/v1/tipo-documentos/list` - Lista simple de tipos de documentos
- `POST /api/v1/tipo-documentos` - Crear nuevo tipo de documento
- `GET /api/v1/tipo-documentos/:id` - Obtener tipo de documento por ID
- `PUT /api/v1/tipo-documentos/:id` - Actualizar tipo de documento
- `PATCH /api/v1/tipo-documentos/:id/estado` - Cambiar estado del tipo de documento

#### Gestión de Roles y Permisos
- `GET /api/v1/roles` - Obtener roles del sistema
- `POST /api/v1/roles` - Crear nuevo rol
- `GET /api/v1/permisos` - Obtener permisos disponibles
- `POST /api/v1/roles/:id/permisos` - Asignar permisos a un rol

#### Documentos y Contratación
- `GET /api/v1/documentos` - Obtener documentos cargados
- `POST /api/v1/documentos` - Cargar nuevo documento
- `GET /api/v1/documentos/:id` - Obtener documento específico
- `PUT /api/v1/documentos/:id` - Actualizar documento
- `DELETE /api/v1/documentos/:id` - Eliminar documento
- `GET /api/v1/procesos-contratacion` - Obtener procesos de contratación
- `POST /api/v1/procesos-contratacion` - Crear nuevo proceso de contratación

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo con nodemon

# Producción
npm start           # Ejecutar en modo producción

# Utilidades
npm run format      # Formatear código con Prettier
```

## 🔧 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `APP_PORT` | Puerto del servidor | `3000` |
| `APP_URL` | URL base de la aplicación | `http://localhost:3000` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |
| `DB_NAME` | Nombre de la base de datos | `preacia_db` |
| `DB_USER` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `password` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `JWT_SECRET` | Clave secreta para JWT | `tu_clave_secreta` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT | `24h` |
| `JWT_REFRESH_SECRET` | Clave para refresh token | `refresh_secret` |
| `JWT_REFRESH_EXPIRES_IN` | Tiempo de expiración del refresh | `7d` |
| `MAIL_HOST` | Host del servidor de correo | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto del servidor de correo | `587` |
| `MAIL_USER` | Usuario del correo | `tu_email@gmail.com` |
| `MAIL_PASSWORD` | Contraseña del correo | `tu_contraseña` |

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo o crea un issue en el repositorio.

---

**Desarrollado por**: Unidad de Servicios Tecnológicos  
**Repositorio**: [GitHub](https://github.com/Unidad-de-Servicios-Tecnologicos/preacia-backend)
