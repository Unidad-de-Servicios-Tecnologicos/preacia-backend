-- =============================================================================
-- SEEDER: Datos iniciales para tabla centros
-- Fecha: Octubre 2025
-- Descripción: Inserta centros de formación de ejemplo para cada regional
-- =============================================================================

USE preacia_sena;

-- Limpiar tabla (solo en desarrollo, comentar en producción)
-- TRUNCATE TABLE centros;

-- Insertar centros de ejemplo para diferentes regionales

-- REGIONAL ANTIOQUIA (ID: 1)
INSERT INTO centros (regional_id, codigo, nombre, direccion, telefono, activo, created_at, updated_at) VALUES
(1, 'CTR-ANT-001', 'Centro de Gestión de Mercados, Logística y Tecnologías de la Información', 'Calle 52 No. 48-09', '(604) 360-0000', TRUE, NOW(), NOW()),
(1, 'CTR-ANT-002', 'Centro de Tecnología de la Manufactura Avanzada', 'Calle 77B No. 80-62', '(604) 448-4242', TRUE, NOW(), NOW()),
(1, 'CTR-ANT-003', 'Centro de Diseño y Manufactura del Cuero', 'Carrera 50 No. 50-11', '(604) 511-1222', TRUE, NOW(), NOW()),
(1, 'CTR-ANT-004', 'Centro Textil y de Gestión Industrial', 'Calle 52 No. 48-09', '(604) 360-0090', TRUE, NOW(), NOW()),
(1, 'CTR-ANT-005', 'Centro de Servicios y Gestión Empresarial', 'Calle 44A No. 45-12', '(604) 360-0100', TRUE, NOW(), NOW()),

-- REGIONAL ATLÁNTICO (ID: 2)
(2, 'CTR-ATL-001', 'Centro Nacional Colombo Alemán', 'Calle 44 No. 43-70', '(605) 360-1000', TRUE, NOW(), NOW()),
(2, 'CTR-ATL-002', 'Centro Industrial y de Aviación', 'Carrera 38 No. 43-15', '(605) 360-1050', TRUE, NOW(), NOW()),
(2, 'CTR-ATL-003', 'Centro para la Industria de la Comunicación Gráfica', 'Calle 45 No. 42-60', '(605) 360-1100', TRUE, NOW(), NOW()),

-- REGIONAL DISTRITO CAPITAL (ID: 3)
(3, 'CTR-BOG-001', 'Centro de Electricidad, Electrónica y Telecomunicaciones', 'Calle 57 No. 8-69', '(601) 546-1500', TRUE, NOW(), NOW()),
(3, 'CTR-BOG-002', 'Centro de Servicios Financieros', 'Calle 30 No. 6-30', '(601) 546-1600', TRUE, NOW(), NOW()),
(3, 'CTR-BOG-003', 'Centro de Gestión Administrativa', 'Calle 52 No. 13-62', '(601) 546-1700', TRUE, NOW(), NOW()),
(3, 'CTR-BOG-004', 'Centro de Gestión de Mercados, Logística y TIC', 'Calle 57 No. 8-69', '(601) 546-1800', TRUE, NOW(), NOW()),
(3, 'CTR-BOG-005', 'Centro Metalmecánico', 'Calle 20 Sur No. 30-81', '(601) 546-1900', TRUE, NOW(), NOW()),

-- REGIONAL BOLÍVAR (ID: 4)
(4, 'CTR-BOL-001', 'Centro Industrial y del Desarrollo Empresarial', 'Calle 30 No. 30-80', '(605) 653-8800', TRUE, NOW(), NOW()),
(4, 'CTR-BOL-002', 'Centro Nacional de la Construcción', 'Transversal 54 No. 39-06', '(605) 653-8850', TRUE, NOW(), NOW()),

-- REGIONAL BOYACÁ (ID: 5)
(5, 'CTR-BOY-001', 'Centro de Gestión Administrativa y Fortalecimiento Empresarial', 'Calle 20 No. 9-90', '(608) 740-7000', TRUE, NOW(), NOW()),
(5, 'CTR-BOY-002', 'Centro Agropecuario y de Biotecnología El Porvenir', 'Vía Tunja - Motavita Km 3', '(608) 740-7050', TRUE, NOW(), NOW()),
(5, 'CTR-BOY-003', 'Centro de Industria y Servicios del Meta', 'Carrera 28 No. 45-12', '(608) 740-7100', TRUE, NOW(), NOW()),

-- REGIONAL CALDAS (ID: 6)
(6, 'CTR-CAL-001', 'Centro de Automatización Industrial', 'Calle 62 No. 26-20', '(606) 880-0800', TRUE, NOW(), NOW()),
(6, 'CTR-CAL-002', 'Centro para la Formación Cafetera', 'Kilómetro 2 Vía Chinchiná', '(606) 880-0850', TRUE, NOW(), NOW()),

-- REGIONAL QUINDÍO (ID: 7)
(7, 'CTR-QUI-001', 'Centro Agroindustrial', 'Carrera 15 No. 12N-49', '(606) 741-1535', TRUE, NOW(), NOW()),
(7, 'CTR-QUI-002', 'Centro de Comercio y Turismo', 'Carrera 14 No. 15N-20', '(606) 741-1600', TRUE, NOW(), NOW()),

-- REGIONAL RISARALDA (ID: 8)
(8, 'CTR-RIS-001', 'Centro de Atención al Sector Agropecuario', 'Avenida de las Américas', '(606) 340-5000', TRUE, NOW(), NOW()),
(8, 'CTR-RIS-002', 'Centro de Diseño e Innovación Tecnológica Industrial', 'Calle 14 No. 7-132', '(606) 340-5050', TRUE, NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    direccion = VALUES(direccion),
    telefono = VALUES(telefono),
    activo = VALUES(activo),
    updated_at = NOW();

-- Verificar datos insertados
SELECT c.id, c.codigo, c.nombre, r.nombre as regional
FROM centros c
INNER JOIN regionales r ON c.regional_id = r.id
ORDER BY r.nombre, c.codigo;

SELECT 'Seeder ejecutado exitosamente!' as mensaje;
SELECT CONCAT('Total de centros: ', COUNT(*)) as total FROM centros;
SELECT r.nombre as regional, COUNT(c.id) as total_centros
FROM regionales r
LEFT JOIN centros c ON r.id = c.regional_id
GROUP BY r.id, r.nombre
HAVING COUNT(c.id) > 0
ORDER BY r.nombre;

