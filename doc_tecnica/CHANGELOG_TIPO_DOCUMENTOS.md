# Changelog - Módulo Tipo de Documentos

## Actualización según database_v3_sena.sql
**Fecha:** Octubre 7, 2025

---

## 📋 Resumen de Cambios

Se actualizó completamente el módulo de Tipo de Documentos para alinearlo con el esquema de base de datos v3 del Sistema Nacional de Gestión de Listas de Chequeo Precontractuales para el SENA.

---

## 🔄 Cambios Realizados

### 1. **Actualización del Enum de Roles** (`src/enums/rol.enum.js`)

#### Antes:
```javascript
export const RolEnum = Object.freeze({
    SUPERADMINISTRADOR: "SuperAdministrador",
    ADMINISTRADOR: "Administrador",
    USUARIO: "Usuario",
});
```

#### Después:
```javascript
export const RolEnum = Object.freeze({
    REVISOR: "revisor",
    ADMINISTRADOR_CENTRO: "administrador_centro",
    DIRECTOR_REGIONAL: "director_regional",
    ADMIN: "admin",
});
```

**Razón:** Alineación con los roles definidos en `functional_requirements.md`.

---

### 2. **Actualización del Modelo** (`src/models/tipoDocumento.model.js`)

#### Cambios principales:
- ✅ **Nuevo campo `codigo`**: VARCHAR(10), único, obligatorio
- ✅ **Campo `nombre`**: Aumentado de 45 a 100 caracteres
- ✅ **Campo `estado` → `activo`**: Renombrado para consistencia
- ✅ **Tipo de dato `activo`**: Cambiado de ENUM a BOOLEAN
- ✅ **Índice agregado**: `idx_activo` para optimización de consultas

#### Estructura Final:
```javascript
{
  id: INTEGER (PK, AUTO_INCREMENT),
  codigo: STRING(10) UNIQUE NOT NULL,
  nombre: STRING(100) UNIQUE NOT NULL,
  activo: BOOLEAN NOT NULL DEFAULT TRUE,
  created_at: DATE,
  updated_at: DATE
}
```

---

### 3. **Actualización de Validadores** (`src/middlewares/validators/tipoDocumento.validator.js`)

#### Nuevas validaciones:
- **Campo `codigo`**:
  - Longitud: 2-10 caracteres
  - Solo letras mayúsculas, números, guiones y guiones bajos
  - Conversión automática a mayúsculas
  - Obligatorio en creación
  
- **Campo `activo`**:
  - Tipo: booleano
  - Reemplaza validación de ENUM

#### Ejemplo de validación:
```javascript
body('codigo')
  .isString()
  .isLength({ min: 2, max: 10 })
  .matches(/^[A-Z0-9_-]+$/)
  .notEmpty()
  .trim()
  .toUpperCase()
```

---

### 4. **Actualización del Repositorio** (`src/repositories/tipoDocumento.repository.js`)

#### Nuevas funciones:
- `findTipoDocumentoByCodigoRepository()`: Buscar por código
- `findTipoDocumentoByCodigoExcludingIdRepository()`: Validar código único en actualización

#### Mejoras:
- Conversión automática de código a mayúsculas
- Búsqueda global incluye campo `codigo`
- Soporte para filtrar por `activo` en lugar de `estado`

---

### 5. **Actualización del Servicio** (`src/services/v1/tipoDocumento.service.js`)

#### Mejoras principales:
- Validación de código único en creación y actualización
- Conversión de parámetro `activo` de string a boolean
- Manejo mejorado de errores con códigos específicos

#### Códigos de error:
- `DUPLICATE_TIPO_DOCUMENTO_CODIGO`: Código duplicado
- `DUPLICATE_TIPO_DOCUMENTO_NAME`: Nombre duplicado
- `NOT_FOUND`: Tipo de documento no encontrado

---

### 6. **Actualización del Controlador** (`src/controllers/v1/tipoDocumento/tipoDocumento.controller.js`)

#### Cambios:
- Respuestas incluyen campo `codigo`
- Cambio de `estado` a `activo` en todas las respuestas
- Mensajes de error más descriptivos
- Manejo de nuevos códigos de error

#### Ejemplo de respuesta:
```json
{
  "success": true,
  "message": "Tipo de documento creado exitosamente",
  "data": {
    "id": 1,
    "codigo": "CC",
    "nombre": "Cédula de Ciudadanía",
    "activo": true
  }
}
```

---

### 7. **Actualización de Rutas** (`src/routes/v1/tipoDocumento.routes.js`)

#### Permisos actualizados:

| Operación | Roles Permitidos | Descripción |
|-----------|------------------|-------------|
| `GET /` | ADMIN, DIRECTOR_REGIONAL, ADMINISTRADOR_CENTRO, REVISOR | Listar tipos de documentos |
| `GET /list` | ADMIN, DIRECTOR_REGIONAL, ADMINISTRADOR_CENTRO, REVISOR | Lista simplificada |
| `GET /:id` | ADMIN, DIRECTOR_REGIONAL, ADMINISTRADOR_CENTRO, REVISOR | Ver detalle |
| `POST /` | ADMIN | Crear tipo de documento |
| `PUT /:id` | ADMIN | Actualizar tipo de documento |
| `PATCH /:id/estado` | ADMIN | Cambiar estado |

**Nota:** Solo el rol `ADMIN` (Administrador Nacional) puede crear, editar y cambiar estado de tipos de documentos.

---

### 8. **Actualización de Schemas Swagger** (`src/docs/v1/shemas/tipoDocumento/tipoDocumento.schema.js`)

#### Cambios:
- Campo `codigo` agregado a la documentación
- Campo `estado` reemplazado por `activo` (boolean)
- Campo `nombre` con longitud máxima de 100 caracteres
- Ejemplos actualizados

---

## 📁 Archivos de Migración

### Script de Migración SQL
**Archivo:** `src/database/migrations/001_update_tipo_documentos_table.sql`

**Ejecutar:**
```bash
mysql -u usuario -p < src/database/migrations/001_update_tipo_documentos_table.sql
```

**Cambios que realiza:**
1. Agrega columna `codigo`
2. Actualiza datos existentes con códigos por defecto
3. Renombra `estado` a `activo`
4. Aumenta tamaño de `nombre` a 100 caracteres
5. Agrega índice en `activo`
6. Actualiza charset y collation

### Seeder de Datos
**Archivo:** `src/database/seeders/001_seed_tipo_documentos.sql`

**Ejecutar:**
```bash
mysql -u usuario -p < src/database/seeders/001_seed_tipo_documentos.sql
```

**Tipos de documentos insertados:**
- CC - Cédula de Ciudadanía
- CE - Cédula de Extranjería
- TI - Tarjeta de Identidad
- PASAPORTE - Pasaporte
- NIT - Número de Identificación Tributaria
- RC - Registro Civil
- PPT - Permiso por Protección Temporal

---

## 🔧 Uso del API

### Crear Tipo de Documento
```http
POST /api/v1/tipo-documento
Content-Type: application/json
Authorization: Bearer <token>

{
  "codigo": "CC",
  "nombre": "Cédula de Ciudadanía",
  "activo": true
}
```

### Listar Tipos de Documentos (con paginación)
```http
GET /api/v1/tipo-documento?page=1&limit=10&activo=true&search=cedula
Authorization: Bearer <token>
```

### Actualizar Tipo de Documento
```http
PUT /api/v1/tipo-documento/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "codigo": "CE",
  "nombre": "Cédula de Extranjería",
  "activo": true
}
```

### Cambiar Estado
```http
PATCH /api/v1/tipo-documento/:id/estado
Content-Type: application/json
Authorization: Bearer <token>

{
  "activo": false
}
```

---

## ✅ Testing

### Verificar que no hay errores de linter:
```bash
npm run lint
```

### Probar endpoints:
```bash
# Listar tipos de documentos
curl -X GET http://localhost:3000/api/v1/tipo-documento \
  -H "Authorization: Bearer <token>"

# Crear tipo de documento
curl -X POST http://localhost:3000/api/v1/tipo-documento \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"codigo":"CC","nombre":"Cédula de Ciudadanía","activo":true}'
```

---

## 📝 Notas Importantes

1. **Compatibilidad hacia atrás**: Los nombres de funciones anteriores se mantienen como alias para compatibilidad.

2. **Códigos únicos**: El campo `codigo` es único y se convierte automáticamente a mayúsculas.

3. **Permisos**: Solo usuarios con rol `ADMIN` pueden crear, editar o cambiar el estado de tipos de documentos.

4. **Paginación**: Se mantiene la funcionalidad de paginación existente.

5. **Búsqueda**: La búsqueda global ahora incluye el campo `codigo`.

---

## 🐛 Troubleshooting

### Error: "El código ya está registrado"
**Solución:** Usar un código diferente o actualizar el registro existente.

### Error: "Tabla tipo_documentos no tiene columna codigo"
**Solución:** Ejecutar el script de migración:
```bash
mysql -u usuario -p < src/database/migrations/001_update_tipo_documentos_table.sql
```

### Error de permisos al crear tipo de documento
**Solución:** Verificar que el usuario tenga rol `ADMIN` en el token JWT.

---

## 📚 Referencias

- **Schema de Base de Datos:** `src/database/database_v3_sena.sql`
- **Requerimientos Funcionales:** `doc_tecnica/functional_requirements.md`
- **Enum de Roles:** `src/enums/rol.enum.js`

---

**Documentación actualizada:** Octubre 7, 2025  
**Versión:** 3.0.0  
**Autor:** Sistema Nacional de Gestión de Listas de Chequeo Precontractuales - SENA

