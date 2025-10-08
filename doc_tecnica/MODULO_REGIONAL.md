# 📍 Módulo Regional - Documentación Completa

## Sistema Nacional de Gestión de Listas de Chequeo Precontractuales - SENA

**Fecha:** Octubre 7, 2025  
**Versión:** 1.0.0

---

## 📋 Descripción General

El módulo **Regional** permite la gestión de las 33 regionales del SENA a nivel nacional. Este módulo es fundamental para la estructura organizacional del sistema y es la base para la gestión de centros de formación.

---

## 🎯 Características Principales

- ✅ CRUD completo de regionales
- ✅ Validación de códigos y nombres únicos
- ✅ Búsqueda y filtrado avanzado
- ✅ Paginación de resultados
- ✅ Control de estado activo/inactivo
- ✅ Validación de integridad referencial (no se pueden desactivar regionales con centros asociados)
- ✅ Solo Administrador Nacional puede gestionar regionales
- ✅ Todos los roles administrativos pueden consultar

---

## 🏗️ Estructura del Módulo

### Archivos Creados

```
src/
├── models/
│   └── regional.model.js                    # Modelo Sequelize
├── repositories/
│   └── regional.repository.js               # Capa de acceso a datos
├── services/
│   └── v1/
│       └── regional.service.js              # Lógica de negocio
├── controllers/
│   └── v1/
│       └── regional/
│           └── regional.controller.js       # Controladores HTTP
├── middlewares/
│   └── validators/
│       └── regional.validator.js            # Validaciones de entrada
├── routes/
│   └── v1/
│       ├── regional.routes.js               # Definición de rutas
│       └── index.route.js                   # Integración de rutas
└── docs/
    └── v1/
        ├── shemas/
        │   └── regional.schema.js           # Schemas Swagger
        └── paths/
            └── regional/
                └── regional.path.js         # Paths Swagger
```

### Scripts de Base de Datos

```
src/database/
└── seeders/
    └── 002_seed_regionales.sql              # Datos de las 33 regionales del SENA
```

---

## 📊 Estructura de Base de Datos

### Tabla: `regionales`

```sql
CREATE TABLE regionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE COMMENT 'Código único de la regional',
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la regional',
    direccion VARCHAR(300) COMMENT 'Dirección de la regional',
    telefono VARCHAR(20) COMMENT 'Teléfono de contacto',
    activo BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_activo (activo),
    INDEX idx_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Campos

| Campo | Tipo | Descripción | Validaciones |
|-------|------|-------------|--------------|
| `id` | INT | Identificador único | Auto-incremental, PK |
| `codigo` | VARCHAR(20) | Código de la regional | Único, 2-20 caracteres, mayúsculas |
| `nombre` | VARCHAR(200) | Nombre de la regional | 3-200 caracteres |
| `direccion` | VARCHAR(300) | Dirección física | Opcional, max 300 caracteres |
| `telefono` | VARCHAR(20) | Teléfono de contacto | Opcional, formato: números, espacios, guiones, paréntesis |
| `activo` | BOOLEAN | Estado | true/false, default: true |
| `created_at` | TIMESTAMP | Fecha de creación | Automático |
| `updated_at` | TIMESTAMP | Fecha de actualización | Automático |

---

## 🛣️ Rutas del API

### Base URL: `/api/v1/regionales`

| Método | Ruta | Descripción | Roles Permitidos |
|--------|------|-------------|------------------|
| `GET` | `/` | Listar regionales (paginado) | Todos los roles |
| `GET` | `/list` | Lista simplificada | Todos los roles |
| `GET` | `/:id` | Obtener una regional | Todos los roles |
| `POST` | `/` | Crear regional | Solo ADMIN |
| `PUT` | `/:id` | Actualizar regional | Solo ADMIN |
| `PATCH` | `/:id/estado` | Cambiar estado | Solo ADMIN |

---

## 📝 Ejemplos de Uso

### 1. Listar Regionales (Paginado)

**Request:**
```http
GET /api/v1/regionales?page=1&limit=10&activo=true&search=antioquia
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo": "REG-ANT",
      "nombre": "Regional Antioquia",
      "direccion": "Calle 52 No. 48-09",
      "telefono": "(604) 360-0000",
      "activo": true,
      "created_at": "2025-10-07T10:00:00.000Z",
      "updated_at": "2025-10-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "links": {
    "first": "/api/v1/regionales?page=1&limit=10",
    "last": "/api/v1/regionales?page=1&limit=10",
    "prev": null,
    "next": null
  }
}
```

### 2. Crear Regional

**Request:**
```http
POST /api/v1/regionales
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "codigo": "REG-TEST",
  "nombre": "Regional de Prueba",
  "direccion": "Calle 123 No. 45-67",
  "telefono": "(601) 123-4567",
  "activo": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Regional creada exitosamente",
  "data": {
    "id": 34,
    "codigo": "REG-TEST",
    "nombre": "Regional de Prueba",
    "direccion": "Calle 123 No. 45-67",
    "telefono": "(601) 123-4567",
    "activo": true
  }
}
```

### 3. Actualizar Regional

**Request:**
```http
PUT /api/v1/regionales/1
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "nombre": "Regional Antioquia Actualizada",
  "direccion": "Nueva Dirección 123",
  "telefono": "(604) 999-9999"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Regional actualizada exitosamente",
  "data": {
    "id": 1,
    "codigo": "REG-ANT",
    "nombre": "Regional Antioquia Actualizada",
    "direccion": "Nueva Dirección 123",
    "telefono": "(604) 999-9999",
    "activo": true
  }
}
```

### 4. Cambiar Estado

**Request:**
```http
PATCH /api/v1/regionales/1/estado
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "activo": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "codigo": "REG-ANT",
    "nombre": "Regional Antioquia",
    "activo": false
  }
}
```

### 5. Lista Simplificada (para dropdowns)

**Request:**
```http
GET /api/v1/regionales/list?activo=true&sortBy=nombre&order=ASC
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo": "REG-ANT",
      "nombre": "Regional Antioquia",
      "activo": true
    },
    {
      "id": 2,
      "codigo": "REG-ATL",
      "nombre": "Regional Atlántico",
      "activo": true
    }
  ],
  "meta": {
    "count": 33
  }
}
```

---

## 🔒 Permisos y Roles

### Matriz de Permisos

| Operación | ADMIN | DIRECTOR_REGIONAL | ADMINISTRADOR_CENTRO | REVISOR |
|-----------|-------|-------------------|----------------------|---------|
| Ver listado | ✅ | ✅ | ✅ | ✅ |
| Ver detalle | ✅ | ✅ | ✅ | ✅ |
| Crear | ✅ | ❌ | ❌ | ❌ |
| Actualizar | ✅ | ❌ | ❌ | ❌ |
| Cambiar estado | ✅ | ❌ | ❌ | ❌ |

**Nota:** Solo el **Administrador Nacional** puede crear, editar o cambiar el estado de regionales.

---

## ✅ Validaciones

### Creación

```javascript
{
  codigo: {
    tipo: 'string',
    longitud: '2-20 caracteres',
    formato: 'Solo mayúsculas, números, guiones y guiones bajos',
    único: true,
    obligatorio: true
  },
  nombre: {
    tipo: 'string',
    longitud: '3-200 caracteres',
    único: true,
    obligatorio: true
  },
  direccion: {
    tipo: 'string',
    longitud: 'max 300 caracteres',
    opcional: true
  },
  telefono: {
    tipo: 'string',
    longitud: 'max 20 caracteres',
    formato: 'Números, espacios, guiones, más y paréntesis',
    opcional: true
  },
  activo: {
    tipo: 'boolean',
    default: true,
    opcional: true
  }
}
```

### Actualización

Todos los campos son opcionales en actualización. Las mismas validaciones aplican para los campos proporcionados.

---

## 🚨 Códigos de Error

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| `DUPLICATE_REGIONAL_CODIGO` | El código XXX ya está registrado | Código duplicado |
| `DUPLICATE_REGIONAL_NAME` | El nombre XXX ya está registrado | Nombre duplicado |
| `NOT_FOUND` | Regional no encontrada | ID no existe |
| `REGIONAL_HAS_CENTROS` | No se puede desactivar la regional porque tiene centros asociados | Validación de integridad |
| `VALIDATION_ERROR` | Errores de validación | Datos inválidos |

---

## 🗄️ Seeder de Datos

### Las 33 Regionales del SENA

El seeder incluye las 33 regionales oficiales del SENA en Colombia:

**Archivo:** `src/database/seeders/002_seed_regionales.sql`

**Ejecutar:**
```bash
mysql -u usuario -p preacia_sena < src/database/seeders/002_seed_regionales.sql
```

**Regionales incluidas:**
1. Regional Antioquia (REG-ANT)
2. Regional Atlántico (REG-ATL)
3. Regional Distrito Capital (REG-BOG)
4. Regional Bolívar (REG-BOL)
5. Regional Boyacá (REG-BOY)
6. Regional Caldas (REG-CAL)
7. Regional Quindío (REG-QUI)
8. Regional Risaralda (REG-RIS)
... y 25 más

Cada regional incluye:
- Código único
- Nombre oficial
- Dirección
- Teléfono de contacto

---

## 🔍 Búsqueda y Filtrado

### Parámetros de Búsqueda

```javascript
{
  // Paginación
  page: 1,              // Número de página
  limit: 10,            // Registros por página
  
  // Ordenamiento
  sortBy: 'nombre',     // Campo: id, codigo, nombre, created_at
  order: 'ASC',         // ASC o DESC
  
  // Filtros específicos
  codigo: 'REG-',       // Buscar por código (parcial)
  nombre: 'Antioquia',  // Buscar por nombre (parcial)
  activo: 'true',       // Filtrar por estado
  
  // Búsqueda global
  search: 'antioquia'   // Busca en código, nombre y dirección
}
```

### Ejemplos de Búsqueda

```bash
# Buscar regionales activas con "Regional" en el nombre
GET /api/v1/regionales?activo=true&nombre=Regional

# Buscar por código que empiece con "REG-A"
GET /api/v1/regionales?codigo=REG-A

# Búsqueda global
GET /api/v1/regionales?search=medellin

# Ordenar por código descendente
GET /api/v1/regionales?sortBy=codigo&order=DESC
```

---

## 🧪 Testing

### Verificar el módulo

```bash
# 1. Linter
npm run lint

# 2. Ejecutar seeder
mysql -u usuario -p preacia_sena < src/database/seeders/002_seed_regionales.sql

# 3. Probar endpoint de listado
curl -X GET http://localhost:3000/api/v1/regionales \
  -H "Authorization: Bearer <token>"

# 4. Probar creación (requiere rol ADMIN)
curl -X POST http://localhost:3000/api/v1/regionales \
  -H "Authorization: Bearer <token_admin>" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo":"REG-TEST",
    "nombre":"Regional Test",
    "activo":true
  }'
```

---

## 📈 Próximas Mejoras

- [ ] Integración con el módulo de Centros
- [ ] Estadísticas por regional
- [ ] Exportación de reportes
- [ ] Histórico de cambios
- [ ] Geolocalización de regionales

---

## 🐛 Troubleshooting

### Error: "El código ya está registrado"
**Solución:** Usar un código diferente o actualizar la regional existente.

### Error: "No se puede desactivar la regional porque tiene centros asociados"
**Solución:** Primero desactivar o reasignar los centros de formación asociados.

### Error 403: "Prohibido"
**Solución:** Verificar que el usuario tenga rol `ADMIN` para crear/editar regionales.

---

## 📚 Referencias

- **Requerimientos:** `doc_tecnica/functional_requirements.md` (RF-002.1)
- **Base de Datos:** `src/database/database_v3_sena.sql`
- **Enum de Roles:** `src/enums/rol.enum.js`

---

**Documentación creada:** Octubre 7, 2025  
**Módulo:** Regional  
**Sistema:** SENA - Gestión de Listas de Chequeo Precontractuales

