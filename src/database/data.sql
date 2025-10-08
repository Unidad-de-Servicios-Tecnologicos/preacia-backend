-- =============================================================================
-- DATOS INICIALES - Sistema Nacional de Gestión de Listas de Chequeo SENA
-- Fecha: Octubre 2025
-- Descripción: Archivo único con todas las inserciones de datos
-- =============================================================================

USE preacia_sena;

-- =============================================================================
-- 1. TIPOS DE DOCUMENTOS
-- =============================================================================

INSERT INTO tipo_documentos (codigo, nombre, estado, created_at, updated_at) VALUES
('CC', 'Cédula de Ciudadanía', TRUE, NOW(), NOW()),
('CE', 'Cédula de Extranjería', TRUE, NOW(), NOW()),
('TI', 'Tarjeta de Identidad', TRUE, NOW(), NOW()),
('PASAPORTE', 'Pasaporte', TRUE, NOW(), NOW()),
('NIT', 'Número de Identificación Tributaria', TRUE, NOW(), NOW()),
('RC', 'Registro Civil', TRUE, NOW(), NOW()),
('PPT', 'Permiso por Protección Temporal', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 2. REGIONALES (33 regionales del SENA)
-- =============================================================================

INSERT INTO regionales (codigo, nombre, direccion, telefono, estado, created_at, updated_at) VALUES
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
('REG-GAI', 'Regional Guainía', 'Calle 8 No. 10-15', '(608) 659-4000', TRUE, NOW(), NOW()),
('REG-GUV', 'Regional Guaviare', 'Carrera 22 No. 14-80', '(608) 584-0088', TRUE, NOW(), NOW()),
('REG-VAU', 'Regional Vaupés', 'Barrio Centro', '(608) 597-0000', TRUE, NOW(), NOW()),
('REG-VIC', 'Regional Vichada', 'Calle 15 No. 20-43', '(608) 671-0000', TRUE, NOW(), NOW()),

-- Regionales especiales
('REG-SAP', 'Regional San Andrés y Providencia', 'Avenida Newball No. 17-43', '(608) 512-3434', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), direccion = VALUES(direccion), telefono = VALUES(telefono), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 3. CENTROS DE FORMACIÓN
-- =============================================================================

INSERT INTO centros (regional_id, codigo, nombre, direccion, telefono, estado, created_at, updated_at) VALUES
-- REGIONAL ANTIOQUIA (ID: 1)
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
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), direccion = VALUES(direccion), telefono = VALUES(telefono), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 4. ROLES (4 roles administrativos)
-- =============================================================================

INSERT INTO roles (nombre, descripcion, estado, created_at, updated_at) VALUES
('revisor', 'Revisor de documentos. Alcance: Centro(s) asignado(s). Puede revisar, aprobar o rechazar documentos de instructores/administrativos de sus centros.', TRUE, NOW(), NOW()),
('administrador_centro', 'Administrador de Centro. Alcance: Un centro específico. Puede administrar revisores de su centro, revisar documentos y otorgar permisos especiales de carga.', TRUE, NOW(), NOW()),
('director_regional', 'Director Regional. Alcance: Una regional completa (todos sus centros). Gestiona centros, administradores de centro y supervisa documentación regional.', TRUE, NOW(), NOW()),
('admin', 'Administrador Nacional. Alcance: Todo el sistema. Gestión completa del sistema, vigencias, lista de chequeo nacional, configuración global.', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 5. PERMISOS (Basados en matriz de functional_requirements.md)
-- =============================================================================

INSERT INTO permisos (nombre, descripcion, estado, created_at, updated_at) VALUES
-- GESTIÓN DE DOCUMENTOS
('cargar_documentos_propios', 'Permite cargar documentos propios del usuario', TRUE, NOW(), NOW()),
('ver_documentos_propios', 'Permite ver documentos propios del usuario', TRUE, NOW(), NOW()),
('ver_documentos_centro', 'Permite ver documentos de otros usuarios del centro', TRUE, NOW(), NOW()),
('ver_documentos_regional', 'Permite ver documentos de todos los centros de la regional', TRUE, NOW(), NOW()),
('ver_documentos_todos', 'Permite ver documentos de todo el sistema', TRUE, NOW(), NOW()),
('revisar_documentos_centro', 'Permite revisar y aprobar/rechazar documentos del centro', TRUE, NOW(), NOW()),
('revisar_documentos_regional', 'Permite revisar documentos de toda la regional', TRUE, NOW(), NOW()),
('revisar_documentos_todos', 'Permite revisar documentos de todo el sistema', TRUE, NOW(), NOW()),

-- GESTIÓN DE USUARIOS
('ver_usuarios_centro', 'Permite ver usuarios del centro', TRUE, NOW(), NOW()),
('ver_usuarios_regional', 'Permite ver usuarios de la regional', TRUE, NOW(), NOW()),
('ver_usuarios_todos', 'Permite ver todos los usuarios del sistema', TRUE, NOW(), NOW()),
('crear_usuarios_centro', 'Permite crear usuarios básicos y revisores del centro', TRUE, NOW(), NOW()),
('crear_usuarios_regional', 'Permite crear usuarios en la regional', TRUE, NOW(), NOW()),
('crear_usuarios_todos', 'Permite crear usuarios en todo el sistema', TRUE, NOW(), NOW()),
('crear_admin_centro', 'Permite crear administradores de centro', TRUE, NOW(), NOW()),
('crear_director_regional', 'Permite crear directores regionales', TRUE, NOW(), NOW()),
('editar_usuarios_centro', 'Permite editar usuarios del centro', TRUE, NOW(), NOW()),
('editar_usuarios_regional', 'Permite editar usuarios de la regional', TRUE, NOW(), NOW()),
('editar_usuarios_todos', 'Permite editar cualquier usuario del sistema', TRUE, NOW(), NOW()),
('cambiar_roles_limitado', 'Permite cambiar roles de forma limitada según alcance', TRUE, NOW(), NOW()),
('cambiar_roles_todos', 'Permite cambiar cualquier rol sin restricciones', TRUE, NOW(), NOW()),
('desactivar_usuarios_centro', 'Permite desactivar usuarios del centro', TRUE, NOW(), NOW()),
('desactivar_usuarios_regional', 'Permite desactivar usuarios de la regional', TRUE, NOW(), NOW()),
('desactivar_usuarios_todos', 'Permite desactivar cualquier usuario', TRUE, NOW(), NOW()),

-- GESTIÓN DE ESTRUCTURA ORGANIZACIONAL
('ver_regionales_propia', 'Permite ver información de su propia regional', TRUE, NOW(), NOW()),
('ver_regionales_todas', 'Permite ver todas las regionales', TRUE, NOW(), NOW()),
('crear_regionales', 'Permite crear nuevas regionales', TRUE, NOW(), NOW()),
('editar_regionales', 'Permite editar regionales existentes', TRUE, NOW(), NOW()),
('ver_centros_propios', 'Permite ver sus centros asignados', TRUE, NOW(), NOW()),
('ver_centros_regional', 'Permite ver todos los centros de su regional', TRUE, NOW(), NOW()),
('ver_centros_todos', 'Permite ver todos los centros del sistema', TRUE, NOW(), NOW()),
('crear_centros_regional', 'Permite crear centros en su regional', TRUE, NOW(), NOW()),
('crear_centros_todos', 'Permite crear centros en cualquier regional', TRUE, NOW(), NOW()),
('editar_centros_regional', 'Permite editar centros de su regional', TRUE, NOW(), NOW()),
('editar_centros_todos', 'Permite editar cualquier centro', TRUE, NOW(), NOW()),

-- GESTIÓN DE LISTA DE CHEQUEO
('ver_lista_chequeo', 'Permite ver la lista de chequeo', TRUE, NOW(), NOW()),
('crear_items_lista_chequeo', 'Permite crear ítems en la lista de chequeo', TRUE, NOW(), NOW()),
('editar_items_lista_chequeo', 'Permite editar ítems de la lista de chequeo', TRUE, NOW(), NOW()),
('reordenar_lista_chequeo', 'Permite reordenar ítems de la lista de chequeo', TRUE, NOW(), NOW()),
('activar_desactivar_items', 'Permite activar/desactivar ítems de la lista de chequeo', TRUE, NOW(), NOW()),

-- GESTIÓN DE VIGENCIAS
('ver_vigencias', 'Permite ver vigencias del sistema', TRUE, NOW(), NOW()),
('crear_vigencias', 'Permite crear nuevas vigencias', TRUE, NOW(), NOW()),
('editar_vigencias', 'Permite editar vigencias existentes', TRUE, NOW(), NOW()),
('activar_vigencias', 'Permite activar/desactivar vigencias', TRUE, NOW(), NOW()),
('otorgar_permisos_carga', 'Permite otorgar permisos especiales de carga fuera de fechas', TRUE, NOW(), NOW()),

-- REPORTES Y ESTADÍSTICAS
('ver_dashboard_personal', 'Permite ver dashboard personal', TRUE, NOW(), NOW()),
('ver_dashboard_centro', 'Permite ver dashboard del centro', TRUE, NOW(), NOW()),
('ver_dashboard_regional', 'Permite ver dashboard de la regional', TRUE, NOW(), NOW()),
('ver_dashboard_nacional', 'Permite ver dashboard nacional', TRUE, NOW(), NOW()),
('exportar_reportes_propios', 'Permite exportar reportes propios', TRUE, NOW(), NOW()),
('exportar_reportes_centro', 'Permite exportar reportes del centro', TRUE, NOW(), NOW()),
('exportar_reportes_regional', 'Permite exportar reportes de la regional', TRUE, NOW(), NOW()),
('exportar_reportes_todos', 'Permite exportar reportes de todo el sistema', TRUE, NOW(), NOW()),

-- CONFIGURACIÓN Y AUDITORÍA
('cambiar_configuracion_global', 'Permite cambiar configuración global del sistema', TRUE, NOW(), NOW()),
('ver_auditoria_centro', 'Permite ver auditoría del centro', TRUE, NOW(), NOW()),
('ver_auditoria_regional', 'Permite ver auditoría de la regional', TRUE, NOW(), NOW()),
('ver_auditoria_completa', 'Permite ver auditoría completa del sistema', TRUE, NOW(), NOW()),

-- GESTIÓN DE ROLES Y PERMISOS
('gestionar_roles', 'Permite gestionar roles del sistema', TRUE, NOW(), NOW()),
('gestionar_permisos', 'Permite gestionar permisos del sistema', TRUE, NOW(), NOW()),

-- GESTIÓN DE TIPO DE DOCUMENTOS
('gestionar_tipo_documentos', 'Permite gestionar tipos de documentos', TRUE, NOW(), NOW()),

-- GESTIÓN DE CUENTA PERSONAL
('gestionar_cuenta_propia', 'Permite gestionar información de cuenta propia', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 6. ROL_PERMISO (Asignación de permisos a roles según matriz)
-- =============================================================================

-- ROL 1: REVISOR
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permisos p
WHERE r.nombre = 'revisor' AND p.nombre IN (
    'cargar_documentos_propios', 'ver_documentos_propios', 'ver_documentos_centro', 'revisar_documentos_centro',
    'ver_usuarios_centro', 'ver_centros_propios', 'ver_lista_chequeo', 'ver_vigencias',
    'ver_dashboard_personal', 'ver_dashboard_centro', 'exportar_reportes_propios', 'exportar_reportes_centro',
    'gestionar_cuenta_propia'
)
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- ROL 2: ADMINISTRADOR DE CENTRO
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permisos p
WHERE r.nombre = 'administrador_centro' AND p.nombre IN (
    'cargar_documentos_propios', 'ver_documentos_propios', 'ver_documentos_centro', 'revisar_documentos_centro',
    'ver_usuarios_centro', 'crear_usuarios_centro', 'editar_usuarios_centro', 'cambiar_roles_limitado', 'desactivar_usuarios_centro',
    'ver_centros_propios', 'ver_lista_chequeo', 'ver_vigencias', 'otorgar_permisos_carga',
    'ver_dashboard_personal', 'ver_dashboard_centro', 'exportar_reportes_propios', 'exportar_reportes_centro',
    'ver_auditoria_centro', 'gestionar_cuenta_propia'
)
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- ROL 3: DIRECTOR REGIONAL
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permisos p
WHERE r.nombre = 'director_regional' AND p.nombre IN (
    'cargar_documentos_propios', 'ver_documentos_propios', 'ver_documentos_centro', 'ver_documentos_regional',
    'revisar_documentos_centro', 'revisar_documentos_regional',
    'ver_usuarios_centro', 'ver_usuarios_regional', 'crear_usuarios_centro', 'crear_usuarios_regional',
    'crear_admin_centro', 'editar_usuarios_centro', 'editar_usuarios_regional', 'cambiar_roles_limitado',
    'desactivar_usuarios_centro', 'desactivar_usuarios_regional',
    'ver_regionales_propia', 'ver_centros_propios', 'ver_centros_regional', 'crear_centros_regional', 'editar_centros_regional',
    'ver_lista_chequeo', 'ver_vigencias', 'otorgar_permisos_carga',
    'ver_dashboard_personal', 'ver_dashboard_centro', 'ver_dashboard_regional',
    'exportar_reportes_propios', 'exportar_reportes_centro', 'exportar_reportes_regional',
    'ver_auditoria_centro', 'ver_auditoria_regional', 'gestionar_cuenta_propia'
)
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- ROL 4: ADMINISTRADOR NACIONAL (todos los permisos)
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permisos p
WHERE r.nombre = 'admin'
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- =============================================================================
-- 7. USUARIOS DE PRUEBA
-- Contraseña para todos: "Admin123!" (hash bcrypt con 10 rounds)
-- =============================================================================

SET @password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

INSERT INTO usuarios (regional_id, tipo_documento_id, documento, nombres, apellidos, correo, telefono, direccion, contrasena, estado, acia_id, verificado_acia, password_debe_cambiar, created_at, updated_at) VALUES
-- Usuario 1: Admin Nacional
(NULL, 1, '1234567890', 'Admin', 'Nacional', 'admin@sena.edu.co', '3001234567', 'Calle 57 No. 8-69, Bogotá', @password, TRUE, 'ACIA-ADMIN-001', TRUE, FALSE, NOW(), NOW()),

-- Usuario 2: Director Regional Antioquia
(1, 1, '9876543210', 'María', 'Rodríguez', 'maria.rodriguez@sena.edu.co', '3009876543', 'Calle 52 No. 48-09, Medellín', @password, TRUE, 'ACIA-DIR-001', TRUE, FALSE, NOW(), NOW()),

-- Usuario 3: Administrador de Centro Bogotá
(NULL, 1, '1122334455', 'Carlos', 'Gómez', 'carlos.gomez@sena.edu.co', '3011223344', 'Calle 57 No. 8-69, Bogotá', @password, TRUE, 'ACIA-ADM-001', TRUE, FALSE, NOW(), NOW()),

-- Usuario 4: Revisor Medellín
(NULL, 1, '2233445566', 'Ana', 'Martínez', 'ana.martinez@sena.edu.co', '3022334455', 'Calle 52 No. 48-09, Medellín', @password, TRUE, NULL, FALSE, FALSE, NOW(), NOW()),

-- Usuario 5: Revisor + Admin Centro Barranquilla (múltiples roles)
(NULL, 1, '3344556677', 'Pedro', 'López', 'pedro.lopez@sena.edu.co', '3033445566', 'Calle 44 No. 43-70, Barranquilla', @password, TRUE, 'ACIA-REV-002', TRUE, FALSE, NOW(), NOW())
ON DUPLICATE KEY UPDATE nombres = VALUES(nombres), apellidos = VALUES(apellidos), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 8. USUARIO_ROL (Asignación de roles a usuarios)
-- =============================================================================

-- Usuario 1: Admin Nacional
INSERT INTO usuario_rol (usuario_id, rol_id, estado, created_at, updated_at)
SELECT u.id, r.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN roles r
WHERE u.correo = 'admin@sena.edu.co' AND r.nombre = 'admin'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 2: Director Regional
INSERT INTO usuario_rol (usuario_id, rol_id, estado, created_at, updated_at)
SELECT u.id, r.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN roles r
WHERE u.correo = 'maria.rodriguez@sena.edu.co' AND r.nombre = 'director_regional'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 3: Administrador de Centro
INSERT INTO usuario_rol (usuario_id, rol_id, estado, created_at, updated_at)
SELECT u.id, r.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN roles r
WHERE u.correo = 'carlos.gomez@sena.edu.co' AND r.nombre = 'administrador_centro'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 4: Revisor
INSERT INTO usuario_rol (usuario_id, rol_id, estado, created_at, updated_at)
SELECT u.id, r.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN roles r
WHERE u.correo = 'ana.martinez@sena.edu.co' AND r.nombre = 'revisor'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 5: Múltiples roles (Revisor + Administrador Centro)
INSERT INTO usuario_rol (usuario_id, rol_id, estado, created_at, updated_at)
SELECT u.id, r.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN roles r
WHERE u.correo = 'pedro.lopez@sena.edu.co' AND r.nombre IN ('revisor', 'administrador_centro')
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- =============================================================================
-- 9. USUARIO_CENTRO (Asignación de centros a usuarios)
-- =============================================================================

-- Usuario 2: Director Regional Antioquia - Todos los centros de Antioquia
INSERT INTO usuario_centro (usuario_id, centro_id, estado, created_at, updated_at)
SELECT u.id, c.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN centros c INNER JOIN regionales r ON c.regional_id = r.id
WHERE u.correo = 'maria.rodriguez@sena.edu.co' AND r.codigo = 'REG-ANT'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 3: Admin Centro Bogotá - Solo CTR-BOG-001
INSERT INTO usuario_centro (usuario_id, centro_id, estado, created_at, updated_at)
SELECT u.id, c.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN centros c
WHERE u.correo = 'carlos.gomez@sena.edu.co' AND c.codigo = 'CTR-BOG-001'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 4: Revisor Ana - Centro Medellín
INSERT INTO usuario_centro (usuario_id, centro_id, estado, created_at, updated_at)
SELECT u.id, c.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN centros c
WHERE u.correo = 'ana.martinez@sena.edu.co' AND c.codigo = 'CTR-ANT-001'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- Usuario 5: Pedro - Todos los centros de Atlántico
INSERT INTO usuario_centro (usuario_id, centro_id, estado, created_at, updated_at)
SELECT u.id, c.id, TRUE, NOW(), NOW()
FROM usuarios u CROSS JOIN centros c INNER JOIN regionales r ON c.regional_id = r.id
WHERE u.correo = 'pedro.lopez@sena.edu.co' AND r.codigo = 'REG-ATL'
ON DUPLICATE KEY UPDATE estado = TRUE, updated_at = NOW();

-- =============================================================================
-- RESUMEN DE DATOS INSERTADOS
-- =============================================================================

SELECT '========================================' as '';
SELECT 'RESUMEN DE DATOS INSERTADOS' as '';
SELECT '========================================' as '';

SELECT 'Tipo de Documentos' as tabla, COUNT(*) as total FROM tipo_documentos
UNION ALL SELECT 'Regionales', COUNT(*) FROM regionales
UNION ALL SELECT 'Centros', COUNT(*) FROM centros
UNION ALL SELECT 'Roles', COUNT(*) FROM roles
UNION ALL SELECT 'Permisos', COUNT(*) FROM permisos
UNION ALL SELECT 'Asignaciones Rol-Permiso', COUNT(*) FROM rol_permiso
UNION ALL SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL SELECT 'Asignaciones Usuario-Rol', COUNT(*) FROM usuario_rol WHERE estado = TRUE
UNION ALL SELECT 'Asignaciones Usuario-Centro', COUNT(*) FROM usuario_centro WHERE estado = TRUE;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'USUARIOS DE PRUEBA' as '';
SELECT 'Contraseña para todos: Admin123!' as '';
SELECT '========================================' as '';

SELECT 
    u.correo as usuario,
    u.documento,
    GROUP_CONCAT(r.nombre ORDER BY r.nombre SEPARATOR ', ') as roles,
    COUNT(DISTINCT uc.centro_id) as centros_asignados
FROM usuarios u
LEFT JOIN usuario_rol ur ON u.id = ur.usuario_id AND ur.estado = TRUE
LEFT JOIN roles r ON ur.rol_id = r.id
LEFT JOIN usuario_centro uc ON u.id = uc.usuario_id AND uc.estado = TRUE
GROUP BY u.id, u.correo, u.documento
ORDER BY u.id;

SELECT '' as '';
SELECT '✓ Datos insertados exitosamente!' as '';

