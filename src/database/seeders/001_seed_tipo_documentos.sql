-- =============================================================================
-- SEEDER: Datos iniciales para tabla tipo_documentos
-- Fecha: Octubre 2025
-- Descripción: Inserta tipos de documentos comunes en Colombia
-- =============================================================================

USE preacia_sena;

-- Limpiar tabla (solo en desarrollo, comentar en producción)
-- TRUNCATE TABLE tipo_documentos;

-- Insertar tipos de documentos comunes en Colombia
INSERT INTO tipo_documentos (codigo, nombre, activo, created_at, updated_at) VALUES
('CC', 'Cédula de Ciudadanía', TRUE, NOW(), NOW()),
('CE', 'Cédula de Extranjería', TRUE, NOW(), NOW()),
('TI', 'Tarjeta de Identidad', TRUE, NOW(), NOW()),
('PASAPORTE', 'Pasaporte', TRUE, NOW(), NOW()),
('NIT', 'Número de Identificación Tributaria', TRUE, NOW(), NOW()),
('RC', 'Registro Civil', TRUE, NOW(), NOW()),
('PPT', 'Permiso por Protección Temporal', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    activo = VALUES(activo),
    updated_at = NOW();

-- Verificar datos insertados
SELECT * FROM tipo_documentos ORDER BY id;

SELECT 'Seeder ejecutado exitosamente!' as mensaje;
SELECT CONCAT('Total de tipos de documentos: ', COUNT(*)) as total FROM tipo_documentos;

