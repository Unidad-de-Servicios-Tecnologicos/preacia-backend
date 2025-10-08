-- =============================================================================
-- SEEDER: Datos iniciales para tabla regionales
-- Fecha: Octubre 2025
-- Descripción: Inserta las 33 regionales del SENA en Colombia
-- =============================================================================

USE preacia_sena;

-- Limpiar tabla (solo en desarrollo, comentar en producción)
-- TRUNCATE TABLE regionales;

-- Insertar las 33 regionales del SENA en Colombia
INSERT INTO regionales (codigo, nombre, direccion, telefono, activo, created_at, updated_at) VALUES
-- Regionales principales
('REG-ANT', 'Regional Antioquia', 'Calle 52 No. 48-09', '(604) 360-0000', TRUE, NOW(), NOW()),
('REG-ATL', 'Regional Atlántico', 'Calle 44 No. 43-70', '(605) 360-1000', TRUE, NOW(), NOW()),
('REG-BOG', 'Regional Distrito Capital', 'Calle 57 No. 8-69', '(601) 546-1500', TRUE, NOW(), NOW()),
('REG-BOL', 'Regional Bolívar', 'Calle 30 No. 30-80', '(605) 653-8800', TRUE, NOW(), NOW()),
('REG-BOY', 'Regional Boyacá', 'Calle 20 No. 9-90', '(608) 740-7000', TRUE, NOW(), NOW()),

-- Regionales zona cafetera
('REG-CAL', 'Regional Caldas', 'Calle 62 No. 26-20', '(606) 880-0800', TRUE, NOW(), NOW()),
('REG-QUI', 'Regional Quindío', 'Carrera 15 No. 12N-49', '(606) 741-1535', TRUE, NOW(), NOW()),
('REG-RIS', 'Regional Risaralda', 'Avenida de las Américas', '(606) 340-5000', TRUE, NOW(), NOW()),

-- Regionales zona centro
('REG-CAQ', 'Regional Caquetá', 'Carrera 11 No. 2N-45', '(608) 436-2466', TRUE, NOW(), NOW()),
('REG-CAU', 'Regional Cauca', 'Calle 4 Norte No. 6N-42', '(602) 824-8010', TRUE, NOW(), NOW()),
('REG-CES', 'Regional Cesar', 'Carrera 9 No. 17-12', '(605) 570-1004', TRUE, NOW(), NOW()),

-- Regionales zona norte
('REG-COR', 'Regional Córdoba', 'Carrera 4 No. 39-02', '(604) 782-0281', TRUE, NOW(), NOW()),
('REG-CUN', 'Regional Cundinamarca', 'Avenida Calle 30 No. 17-00', '(601) 593-6060', TRUE, NOW(), NOW()),
('REG-CHO', 'Regional Chocó', 'Carrera 5 No. 25-07', '(604) 671-3132', TRUE, NOW(), NOW()),

-- Regionales zona oriental
('REG-HUI', 'Regional Huila', 'Carrera 5 No. 21-81', '(608) 871-2200', TRUE, NOW(), NOW()),
('REG-GUA', 'Regional La Guajira', 'Carrera 9 No. 12-58', '(605) 728-0688', TRUE, NOW(), NOW()),
('REG-MAG', 'Regional Magdalena', 'Carrera 5 No. 22-08', '(605) 420-7000', TRUE, NOW(), NOW()),
('REG-MET', 'Regional Meta', 'Carrera 33 No. 25-25', '(608) 662-6066', TRUE, NOW(), NOW()),

-- Regionales zona sur
('REG-NAR', 'Regional Nariño', 'Calle 18 No. 25-20', '(602) 733-1177', TRUE, NOW(), NOW()),
('REG-NSA', 'Regional Norte de Santander', 'Avenida 4 No. 13-62', '(607) 570-0001', TRUE, NOW(), NOW()),
('REG-PUT', 'Regional Putumayo', 'Carrera 20 No. 17A-17', '(608) 429-5888', TRUE, NOW(), NOW()),

-- Regionales zona santanderes
('REG-SAN', 'Regional Santander', 'Calle 51 No. 12-22', '(607) 645-4600', TRUE, NOW(), NOW()),
('REG-SUC', 'Regional Sucre', 'Carrera 21 No. 23-55', '(605) 282-9477', TRUE, NOW(), NOW()),

-- Regionales llanos y amazonia
('REG-TOL', 'Regional Tolima', 'Carrera 5 No. 40-64', '(608) 261-8000', TRUE, NOW(), NOW()),
('REG-VAC', 'Regional Valle del Cauca', 'Calle 10 No. 2-38', '(602) 620-0261', TRUE, NOW(), NOW()),
('REG-ARA', 'Regional Arauca', 'Calle 18 No. 24-92', '(608) 885-2244', TRUE, NOW(), NOW()),
('REG-CAS', 'Regional Casanare', 'Carrera 21 No. 8-52', '(608) 635-7121', TRUE, NOW(), NOW()),

-- Regionales amazonia
('REG-AMA', 'Regional Amazonas', 'Carrera 11 No. 7-45', '(608) 592-7681', TRUE, NOW(), NOW()),
('REG-GUA-2', 'Regional Guainía', 'Calle 8 No. 10-15', '(608) 659-4000', TRUE, NOW(), NOW()),
('REG-GUV', 'Regional Guaviare', 'Carrera 22 No. 14-80', '(608) 584-0088', TRUE, NOW(), NOW()),
('REG-VAU', 'Regional Vaupés', 'Barrio Centro', '(608) 597-0000', TRUE, NOW(), NOW()),
('REG-VIC', 'Regional Vichada', 'Calle 15 No. 20-43', '(608) 671-0000', TRUE, NOW(), NOW()),

-- Regionales especiales
('REG-SAP', 'Regional San Andrés y Providencia', 'Avenida Newball No. 17-43', '(608) 512-3434', TRUE, NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    direccion = VALUES(direccion),
    telefono = VALUES(telefono),
    activo = VALUES(activo),
    updated_at = NOW();

-- Verificar datos insertados
SELECT * FROM regionales ORDER BY nombre;

SELECT 'Seeder ejecutado exitosamente!' as mensaje;
SELECT CONCAT('Total de regionales: ', COUNT(*)) as total FROM regionales;

