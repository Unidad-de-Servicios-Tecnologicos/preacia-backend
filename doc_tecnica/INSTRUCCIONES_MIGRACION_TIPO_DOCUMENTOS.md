# 🚀 Instrucciones de Migración - Módulo Tipo de Documentos

## Pasos para Aplicar los Cambios

### 1️⃣ Backup de la Base de Datos (IMPORTANTE)

Antes de aplicar cualquier cambio, haz un backup de tu base de datos:

```bash
# Backup completo
mysqldump -u usuario -p preacia_sena > backup_antes_migracion_$(date +%Y%m%d_%H%M%S).sql

# O solo la tabla tipo_documentos
mysqldump -u usuario -p preacia_sena tipo_documentos > backup_tipo_documentos_$(date +%Y%m%d_%H%M%S).sql
```

---

### 2️⃣ Verificar Datos Existentes

Revisa los datos actuales en la tabla:

```sql
USE preacia_sena;
SELECT * FROM tipo_documentos;
```

---

### 3️⃣ Ejecutar Script de Migración

```bash
# Opción 1: Desde terminal
mysql -u usuario -p preacia_sena < src/database/migrations/001_update_tipo_documentos_table.sql

# Opción 2: Desde cliente MySQL
mysql -u usuario -p
USE preacia_sena;
SOURCE src/database/migrations/001_update_tipo_documentos_table.sql;
```

**Nota:** El script actualizará automáticamente los registros existentes con códigos por defecto basados en sus nombres.

---

### 4️⃣ Verificar la Migración

```sql
-- Verificar estructura de la tabla
DESCRIBE tipo_documentos;

-- Verificar datos migrados
SELECT * FROM tipo_documentos;

-- Verificar índices
SHOW INDEX FROM tipo_documentos;
```

**Estructura esperada:**
```
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| id         | int          | NO   | PRI | NULL    | auto_increment |
| codigo     | varchar(10)  | NO   | UNI | NULL    |                |
| nombre     | varchar(100) | NO   | UNI | NULL    |                |
| activo     | tinyint(1)   | NO   | MUL | 1       |                |
| created_at | timestamp    | NO   |     | CURRENT_TIMESTAMP |        |
| updated_at | timestamp    | YES  |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+
```

---

### 5️⃣ (Opcional) Ejecutar Seeder de Datos

Si deseas insertar tipos de documentos predefinidos:

```bash
# Opción 1: Desde terminal
mysql -u usuario -p preacia_sena < src/database/seeders/001_seed_tipo_documentos.sql

# Opción 2: Desde cliente MySQL
mysql -u usuario -p
USE preacia_sena;
SOURCE src/database/seeders/001_seed_tipo_documentos.sql;
```

**Tipos de documentos que se insertarán:**
- CC - Cédula de Ciudadanía
- CE - Cédula de Extranjería
- TI - Tarjeta de Identidad
- PASAPORTE - Pasaporte
- NIT - Número de Identificación Tributaria
- RC - Registro Civil
- PPT - Permiso por Protección Temporal

---

### 6️⃣ Reiniciar el Servidor de Node.js

```bash
# Detener el servidor actual
# Ctrl + C (si está corriendo en terminal)

# O con PM2
pm2 restart preacia-backend

# O con npm
npm start
```

---

### 7️⃣ Verificar que el API Funciona

```bash
# 1. Listar tipos de documentos
curl -X GET http://localhost:3000/api/v1/tipo-documento \
  -H "Authorization: Bearer <tu_token_jwt>"

# 2. Crear un tipo de documento (requiere rol ADMIN)
curl -X POST http://localhost:3000/api/v1/tipo-documento \
  -H "Authorization: Bearer <tu_token_admin>" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "PEP",
    "nombre": "Permiso Especial de Permanencia",
    "activo": true
  }'

# 3. Obtener un tipo de documento específico
curl -X GET http://localhost:3000/api/v1/tipo-documento/1 \
  -H "Authorization: Bearer <tu_token_jwt>"

# 4. Actualizar un tipo de documento (requiere rol ADMIN)
curl -X PUT http://localhost:3000/api/v1/tipo-documento/1 \
  -H "Authorization: Bearer <tu_token_admin>" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "CC",
    "nombre": "Cédula de Ciudadanía Colombiana",
    "activo": true
  }'

# 5. Cambiar estado (requiere rol ADMIN)
curl -X PATCH http://localhost:3000/api/v1/tipo-documento/1/estado \
  -H "Authorization: Bearer <tu_token_admin>" \
  -H "Content-Type: application/json" \
  -d '{
    "activo": false
  }'
```

---

## 🔄 Rollback (Revertir Cambios)

Si necesitas revertir los cambios:

### 1. Restaurar desde Backup

```bash
# Restaurar backup completo
mysql -u usuario -p preacia_sena < backup_antes_migracion_YYYYMMDD_HHMMSS.sql

# O solo la tabla
mysql -u usuario -p preacia_sena < backup_tipo_documentos_YYYYMMDD_HHMMSS.sql
```

### 2. O ejecutar script de rollback manual

Edita el archivo `src/database/migrations/001_update_tipo_documentos_table.sql` y descomenta la sección de ROLLBACK al final del archivo, luego ejecuta:

```sql
-- 1. Eliminar columna 'codigo'
ALTER TABLE tipo_documentos DROP COLUMN codigo;

-- 2. Renombrar 'activo' de vuelta a 'estado'
ALTER TABLE tipo_documentos CHANGE COLUMN activo estado BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. Restaurar tamaño de 'nombre'
ALTER TABLE tipo_documentos MODIFY COLUMN nombre VARCHAR(45) NOT NULL;

-- 4. Eliminar índice
ALTER TABLE tipo_documentos DROP INDEX idx_activo;
```

---

## ⚠️ Consideraciones Importantes

### Ajuste de Códigos Automáticos

El script de migración asigna códigos automáticos basados en los nombres existentes. **Revisa y ajusta** estos códigos según tus necesidades:

```sql
-- Revisar códigos asignados
SELECT id, codigo, nombre FROM tipo_documentos;

-- Ajustar códigos si es necesario
UPDATE tipo_documentos SET codigo = 'NUEVO_CODIGO' WHERE id = X;
```

### Validación de Datos Únicos

Si tienes tipos de documentos con nombres muy similares, podrías tener conflictos. Revisa:

```sql
-- Buscar posibles duplicados
SELECT nombre, COUNT(*) as total 
FROM tipo_documentos 
GROUP BY nombre 
HAVING total > 1;
```

### Actualización de Roles de Usuario

Si tu sistema tiene usuarios con roles antiguos, actualiza sus roles:

```sql
-- Ver roles actuales
SELECT DISTINCT rol FROM usuarios;

-- Actualizar roles (ajustar según tu caso)
UPDATE usuarios SET rol = 'admin' WHERE rol = 'SuperAdministrador';
UPDATE usuarios SET rol = 'administrador_centro' WHERE rol = 'Administrador';
UPDATE usuarios SET rol = 'revisor' WHERE rol = 'Usuario';
```

---

## 📋 Checklist de Migración

Marca cada paso a medida que lo completes:

- [ ] Backup de base de datos realizado
- [ ] Script de migración ejecutado sin errores
- [ ] Estructura de tabla verificada (DESCRIBE)
- [ ] Datos migrados correctamente
- [ ] Índices creados correctamente
- [ ] Seeder ejecutado (si aplica)
- [ ] Servidor de Node.js reiniciado
- [ ] Endpoint GET funciona correctamente
- [ ] Endpoint POST funciona (requiere rol ADMIN)
- [ ] Endpoint PUT funciona (requiere rol ADMIN)
- [ ] Endpoint PATCH funciona (requiere rol ADMIN)
- [ ] Roles de usuarios actualizados
- [ ] Documentación revisada

---

## 🆘 Soporte

Si encuentras problemas durante la migración:

1. **Revisa los logs del servidor:**
   ```bash
   # Si usas PM2
   pm2 logs preacia-backend
   
   # O revisa el archivo de logs
   tail -f logs/error.log
   ```

2. **Verifica la estructura de la tabla:**
   ```sql
   SHOW CREATE TABLE tipo_documentos;
   ```

3. **Revisa el changelog detallado:**
   - Ver: `doc_tecnica/CHANGELOG_TIPO_DOCUMENTOS.md`

---

**Última actualización:** Octubre 7, 2025  
**Versión:** 3.0.0  
**Sistema:** SENA - Gestión de Listas de Chequeo Precontractuales

