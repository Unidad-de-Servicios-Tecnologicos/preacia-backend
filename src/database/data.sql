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

INSERT INTO usuarios (regional_id, tipo_documento_id, documento, nombres, apellidos, correo, telefono, direccion, contrasena, estado, ultimo_acceso, intentos_fallidos, bloqueado_hasta, ultimo_cambio_password, password_debe_cambiar, reset_token, reset_token_expires, created_by, created_at, updated_at) VALUES
-- Usuario 1: Admin Nacional
(NULL, 1, '1234567890', 'Admin', 'Nacional', 'admin@sena.edu.co', '3001234567', 'Calle 57 No. 8-69, Bogotá', @password, TRUE, NULL, 0, NULL, NOW(), FALSE, NULL, NULL, NULL, NOW(), NOW()),

-- Usuario 2: Director Regional Antioquia
(1, 1, '9876543210', 'María', 'Rodríguez', 'maria.rodriguez@sena.edu.co', '3009876543', 'Calle 52 No. 48-09, Medellín', @password, TRUE, NULL, 0, NULL, NOW(), FALSE, NULL, NULL, 1, NOW(), NOW()),

-- Usuario 3: Administrador de Centro Bogotá
(NULL, 1, '1122334455', 'Carlos', 'Gómez', 'carlos.gomez@sena.edu.co', '3011223344', 'Calle 57 No. 8-69, Bogotá', @password, TRUE, NULL, 0, NULL, NOW(), FALSE, NULL, NULL, 1, NOW(), NOW()),

-- Usuario 4: Revisor Medellín
(NULL, 1, '2233445566', 'Ana', 'Martínez', 'ana.martinez@sena.edu.co', '3022334455', 'Calle 52 No. 48-09, Medellín', @password, TRUE, NULL, 0, NULL, NOW(), FALSE, NULL, NULL, 1, NOW(), NOW()),

-- Usuario 5: Revisor + Admin Centro Barranquilla (múltiples roles)
(NULL, 1, '3344556677', 'Pedro', 'López', 'pedro.lopez@sena.edu.co', '3033445566', 'Calle 44 No. 43-70, Barranquilla', @password, TRUE, NULL, 0, NULL, NOW(), FALSE, NULL, NULL, 1, NOW(), NOW())
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
-- 10. VIGENCIAS DE PRUEBA
-- =============================================================================

INSERT INTO vigencias (nombre, anio, descripcion, fecha_inicio, fecha_fin, estado_vigencia, estado, created_at, updated_at) VALUES
('Vigencia 2025-1', 2025, 'Primera vigencia del año 2025', '2025-01-15', '2025-06-30', 'activa', TRUE, NOW(), NOW()),
('Vigencia 2025-2', 2025, 'Segunda vigencia del año 2025', '2025-07-01', '2025-12-31', 'pendiente', TRUE, NOW(), NOW()),
('Vigencia 2024-2', 2024, 'Segunda vigencia del año 2024', '2024-07-01', '2024-12-31', 'cerrada', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE estado_vigencia = VALUES(estado_vigencia), updated_at = NOW();

-- =============================================================================
-- 11. LISTA DE CHEQUEO (Documentos requeridos)
-- =============================================================================

INSERT INTO lista_chequeo (nombre_item, descripcion, orden, obligatorio, estado, requiere_fecha_documento, requiere_fecha_vencimiento, created_by, created_at, updated_at) VALUES
-- Documentos de identidad
('Copia de Cédula de Ciudadanía', 'Copia legible de la cédula de ciudadanía por ambas caras', 1, TRUE, TRUE, FALSE, FALSE, 1, NOW(), NOW()),
('Certificado de Antecedentes Judiciales', 'Certificado de antecedentes judiciales expedido por la Policía Nacional', 2, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Certificado de Antecedentes Disciplinarios', 'Certificado de antecedentes disciplinarios expedido por la Procuraduría', 3, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Certificado de Antecedentes Fiscales', 'Certificado de antecedentes fiscales expedido por la Contraloría', 4, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),

-- Documentos académicos
('Diploma de Bachiller', 'Copia del diploma de bachiller autenticada', 5, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Acta de Grado Universitario', 'Acta de grado profesional autenticada', 6, FALSE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Tarjeta Profesional', 'Tarjeta profesional vigente (si aplica)', 7, FALSE, TRUE, TRUE, TRUE, 1, NOW(), NOW()),

-- Documentos laborales
('Certificados Laborales', 'Certificados laborales que acrediten experiencia mínima requerida', 8, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Hoja de Vida', 'Hoja de vida en formato de función pública', 9, TRUE, TRUE, FALSE, FALSE, 1, NOW(), NOW()),

-- Documentos financieros
('RUT', 'Registro Único Tributario actualizado', 10, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Certificación Bancaria', 'Certificación bancaria no mayor a 30 días', 11, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),

-- Documentos de seguridad social
('Certificado de Afiliación EPS', 'Certificado de afiliación a EPS vigente', 12, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Certificado de Afiliación ARL', 'Certificado de afiliación a ARL vigente', 13, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),
('Certificado de Afiliación Pensión', 'Certificado de afiliación a fondo de pensión vigente', 14, TRUE, TRUE, TRUE, FALSE, 1, NOW(), NOW()),

-- Documentos adicionales
('Libreta Militar', 'Libreta militar (para hombres menores de 50 años)', 15, FALSE, TRUE, FALSE, FALSE, 1, NOW(), NOW()),
('Certificado de Cursos SENA', 'Certificados de cursos realizados en el SENA', 16, FALSE, TRUE, TRUE, FALSE, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), orden = VALUES(orden), updated_at = NOW();

-- =============================================================================
-- 12. VIGENCIA_LISTA_CHEQUEO (Configurar lista para vigencia activa)
-- =============================================================================

-- Asignar todos los items de lista de chequeo a la vigencia activa 2025-1
INSERT INTO vigencia_lista_chequeo (vigencia_id, lista_chequeo_id, estado, created_at)
SELECT v.id, lc.id, TRUE, NOW()
FROM vigencias v
CROSS JOIN lista_chequeo lc
WHERE v.nombre = 'Vigencia 2025-1'
ON DUPLICATE KEY UPDATE estado = TRUE;

-- =============================================================================
-- 13. CONTRATISTAS DE PRUEBA (Instructores/Administrativos SIN autenticación)
-- =============================================================================

INSERT INTO contratistas (tipo_documento_id, numero_documento, nombre_completo, correo, telefono, centro_id, tipo_contrato, encontrado_en_acia, acia_id, fecha_verificacion_acia, estado, created_at, updated_at) VALUES
-- Instructores del Centro de Bogotá
(1, '52123456', 'Laura Stefany Ramírez Castro', 'laura.ramirez@example.com', '3151234567', 6, 'Instructor', FALSE, NULL, NULL, TRUE, NOW(), NOW()),
(1, '52234567', 'David Felipe Morales Gómez', 'david.morales@example.com', '3152345678', 6, 'Instructor', FALSE, NULL, NULL, TRUE, NOW(), NOW()),
(1, '52345678', 'Jennifer Alexandra Torres Vega', 'jennifer.torres@example.com', '3153456789', 6, 'Instructor', FALSE, NULL, NULL, TRUE, NOW(), NOW()),

-- Instructores del Centro de Medellín
(1, '43123456', 'Miguel Ángel Sánchez Rojas', 'miguel.sanchez@example.com', '3161234567', 1, 'Instructor', TRUE, 'ACIA-001', NOW(), TRUE, NOW(), NOW()),
(1, '43234567', 'Daniela Carolina Herrera López', 'daniela.herrera@example.com', '3162345678', 1, 'Instructor', TRUE, 'ACIA-002', NOW(), TRUE, NOW(), NOW()),

-- Administrativos
(1, '80123456', 'Roberto Carlos Jiménez Pérez', 'roberto.jimenez@example.com', '3171234567', 6, 'Administrativo', FALSE, NULL, NULL, TRUE, NOW(), NOW()),
(1, '39123456', 'Claudia Patricia Vargas Ruiz', 'claudia.vargas@example.com', '3181234567', 1, 'Administrativo', FALSE, NULL, NULL, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre_completo = VALUES(nombre_completo), correo = VALUES(correo), estado = VALUES(estado), updated_at = NOW();

-- =============================================================================
-- 14. DOCUMENTOS DE PRUEBA
-- =============================================================================

-- Documentos para Laura Ramírez (52123456) - Centro Bogotá
INSERT INTO documentos (numero_documento, centro_id, vigencia_id, lista_chequeo_id, ruta_archivo, nombre_archivo_original, mime_type, tamanio_bytes, fecha_documento, fecha_vencimiento, estado, observaciones, version, documento_anterior_id, fecha_carga, fecha_envio_revision, fecha_revision, created_at, updated_at) VALUES
-- Documentos aprobados
('52123456', 6, 1, 1, '/uploads/2025/01/52123456_cedula.pdf', 'cedula.pdf', 'application/pdf', 245678, NULL, NULL, 'aprobado', NULL, 1, NULL, '2025-01-20 10:00:00', '2025-01-20 10:01:00', '2025-01-20 15:30:00', NOW(), NOW()),
('52123456', 6, 1, 2, '/uploads/2025/01/52123456_antecedentes_judiciales.pdf', 'antecedentes_judiciales.pdf', 'application/pdf', 156789, '2025-01-15', NULL, 'aprobado', NULL, 1, NULL, '2025-01-20 10:05:00', '2025-01-20 10:06:00', '2025-01-20 15:35:00', NOW(), NOW()),
('52123456', 6, 1, 10, '/uploads/2025/01/52123456_rut.pdf', 'rut.pdf', 'application/pdf', 123456, '2025-01-10', NULL, 'aprobado', NULL, 1, NULL, '2025-01-20 10:10:00', '2025-01-20 10:11:00', '2025-01-20 15:40:00', NOW(), NOW()),

-- Documentos pendientes
('52123456', 6, 1, 5, '/uploads/2025/01/52123456_diploma.pdf', 'diploma_bachiller.pdf', 'application/pdf', 234567, '2018-11-20', NULL, 'pendiente', NULL, 1, NULL, '2025-01-21 09:00:00', NULL, NULL, NOW(), NOW()),
('52123456', 6, 1, 11, '/uploads/2025/01/52123456_cert_bancaria.pdf', 'certificacion_bancaria.pdf', 'application/pdf', 134567, '2025-01-18', NULL, 'pendiente', NULL, 1, NULL, '2025-01-21 09:05:00', NULL, NULL, NOW(), NOW()),

-- Documentos para Miguel Sánchez (43123456) - Centro Medellín - Todos aprobados
('43123456', 1, 1, 1, '/uploads/2025/01/43123456_cedula.pdf', 'cedula.pdf', 'application/pdf', 245678, NULL, NULL, 'aprobado', NULL, 1, NULL, '2025-01-18 08:00:00', '2025-01-18 08:01:00', '2025-01-18 14:00:00', NOW(), NOW()),
('43123456', 1, 1, 2, '/uploads/2025/01/43123456_antec_jud.pdf', 'antecedentes_judiciales.pdf', 'application/pdf', 156789, '2025-01-10', NULL, 'aprobado', NULL, 1, NULL, '2025-01-18 08:05:00', '2025-01-18 08:06:00', '2025-01-18 14:05:00', NOW(), NOW()),
('43123456', 1, 1, 3, '/uploads/2025/01/43123456_antec_disc.pdf', 'antecedentes_disciplinarios.pdf', 'application/pdf', 167890, '2025-01-10', NULL, 'aprobado', NULL, 1, NULL, '2025-01-18 08:10:00', '2025-01-18 08:11:00', '2025-01-18 14:10:00', NOW(), NOW()),
('43123456', 1, 1, 10, '/uploads/2025/01/43123456_rut.pdf', 'rut.pdf', 'application/pdf', 123456, '2025-01-05', NULL, 'aprobado', NULL, 1, NULL, '2025-01-18 08:15:00', '2025-01-18 08:16:00', '2025-01-18 14:15:00', NOW(), NOW()),

-- Documento rechazado para David Morales (52234567)
('52234567', 6, 1, 1, '/uploads/2025/01/52234567_cedula.pdf', 'cedula_borrosa.pdf', 'application/pdf', 145678, NULL, NULL, 'rechazado', 'La imagen de la cédula está borrosa y no se puede leer el número. Por favor cargar una imagen más clara.', 1, NULL, '2025-01-22 11:00:00', '2025-01-22 11:01:00', '2025-01-22 16:00:00', NOW(), NOW())
ON DUPLICATE KEY UPDATE estado = VALUES(estado), observaciones = VALUES(observaciones), updated_at = NOW();

-- =============================================================================
-- 15. REVISIONES
-- =============================================================================

-- Revisiones de Ana Martínez (Revisor - usuario_id: 4) para documentos de Medellín
INSERT INTO revisiones (documento_id, revisor_id, centro_id, fecha_revision, estado_revision, comentario, tiempo_revision_minutos, created_at) VALUES
-- Revisiones aprobadas
((SELECT id FROM documentos WHERE numero_documento = '43123456' AND lista_chequeo_id = 1 LIMIT 1), 4, 1, '2025-01-18 14:00:00', 'aprobado', 'Documento correcto y legible', 5, NOW()),
((SELECT id FROM documentos WHERE numero_documento = '43123456' AND lista_chequeo_id = 2 LIMIT 1), 4, 1, '2025-01-18 14:05:00', 'aprobado', 'Certificado vigente', 7, NOW()),
((SELECT id FROM documentos WHERE numero_documento = '43123456' AND lista_chequeo_id = 3 LIMIT 1), 4, 1, '2025-01-18 14:10:00', 'aprobado', 'Certificado vigente', 6, NOW()),
((SELECT id FROM documentos WHERE numero_documento = '43123456' AND lista_chequeo_id = 10 LIMIT 1), 4, 1, '2025-01-18 14:15:00', 'aprobado', 'RUT actualizado', 4, NOW())
ON DUPLICATE KEY UPDATE comentario = VALUES(comentario);

-- Revisiones de Carlos Gómez (Admin Centro - usuario_id: 3) para documentos de Bogotá
INSERT INTO revisiones (documento_id, revisor_id, centro_id, fecha_revision, estado_revision, comentario, tiempo_revision_minutos, created_at) VALUES
-- Revisiones aprobadas
((SELECT id FROM documentos WHERE numero_documento = '52123456' AND lista_chequeo_id = 1 LIMIT 1), 3, 6, '2025-01-20 15:30:00', 'aprobado', 'Cédula correcta', 8, NOW()),
((SELECT id FROM documentos WHERE numero_documento = '52123456' AND lista_chequeo_id = 2 LIMIT 1), 3, 6, '2025-01-20 15:35:00', 'aprobado', 'Certificado vigente', 6, NOW()),
((SELECT id FROM documentos WHERE numero_documento = '52123456' AND lista_chequeo_id = 10 LIMIT 1), 3, 6, '2025-01-20 15:40:00', 'aprobado', 'RUT actualizado correctamente', 5, NOW()),

-- Revisión rechazada
((SELECT id FROM documentos WHERE numero_documento = '52234567' AND lista_chequeo_id = 1 LIMIT 1), 3, 6, '2025-01-22 16:00:00', 'rechazado', 'Imagen borrosa, debe cargar un documento más claro', 10, NOW())
ON DUPLICATE KEY UPDATE comentario = VALUES(comentario);

-- =============================================================================
-- 16. PERMISOS ESPECIALES DE CARGA
-- =============================================================================

-- Permiso especial para Laura Ramírez (52123456) que se retrasó
INSERT INTO permisos_especiales_carga (numero_documento, vigencia_id, centro_id, es_permiso_masivo, fecha_inicio, fecha_fin, justificacion, otorgado_por_id, revocado, fecha_revocacion, revocado_por_id, motivo_revocacion, created_at, updated_at) VALUES
('52123456', 1, 6, FALSE, '2025-02-01', '2025-02-10', 'Permiso especial por incapacidad médica. El instructor estuvo hospitalizado durante las fechas regulares de carga.', 3, FALSE, NULL, NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE justificacion = VALUES(justificacion), updated_at = NOW();

-- Permiso masivo para todo el Centro de Barranquilla por problemas técnicos
INSERT INTO permisos_especiales_carga (numero_documento, vigencia_id, centro_id, es_permiso_masivo, fecha_inicio, fecha_fin, justificacion, otorgado_por_id, revocado, fecha_revocacion, revocado_por_id, motivo_revocacion, created_at, updated_at) VALUES
(NULL, 1, 7, TRUE, '2025-02-05', '2025-02-15', 'Permiso masivo por falla en el sistema de la regional durante 3 días consecutivos', 1, FALSE, NULL, NULL, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE justificacion = VALUES(justificacion), updated_at = NOW();

-- =============================================================================
-- 17. AUDITORÍA DE PRUEBA
-- =============================================================================

INSERT INTO auditoria (usuario_id, numero_documento, accion, entidad_afectada, entidad_id, datos_anteriores, datos_nuevos, ip_address, user_agent, centro_id, created_at) VALUES
-- Acciones de usuarios administrativos
(1, NULL, 'CREATE', 'vigencias', 1, NULL, JSON_OBJECT('nombre', 'Vigencia 2025-1', 'estado_vigencia', 'activa'), '192.168.1.100', 'Mozilla/5.0', NULL, '2025-01-10 09:00:00'),
(3, NULL, 'REVISION_APROBADA', 'documentos', 1, NULL, JSON_OBJECT('estado', 'aprobado', 'documento_id', 1), '192.168.1.105', 'Mozilla/5.0', 6, '2025-01-20 15:30:00'),
(3, NULL, 'REVISION_RECHAZADA', 'documentos', 9, NULL, JSON_OBJECT('estado', 'rechazado', 'documento_id', 9, 'motivo', 'Imagen borrosa'), '192.168.1.105', 'Mozilla/5.0', 6, '2025-01-22 16:00:00'),

-- Acciones de instructores (sin usuario_id)
(NULL, '52123456', 'CARGA_DOCUMENTO', 'documentos', 1, NULL, JSON_OBJECT('lista_chequeo_id', 1, 'nombre_archivo', 'cedula.pdf'), '190.147.23.45', 'Mozilla/5.0', 6, '2025-01-20 10:00:00'),
(NULL, '43123456', 'CARGA_DOCUMENTO', 'documentos', 5, NULL, JSON_OBJECT('lista_chequeo_id', 1, 'nombre_archivo', 'cedula.pdf'), '181.56.23.67', 'Mozilla/5.0', 1, '2025-01-18 08:00:00')
ON DUPLICATE KEY UPDATE created_at = VALUES(created_at);

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
UNION ALL SELECT 'Usuarios Administrativos', COUNT(*) FROM usuarios
UNION ALL SELECT 'Asignaciones Usuario-Rol', COUNT(*) FROM usuario_rol WHERE estado = TRUE
UNION ALL SELECT 'Asignaciones Usuario-Centro', COUNT(*) FROM usuario_centro WHERE estado = TRUE
UNION ALL SELECT 'Vigencias', COUNT(*) FROM vigencias
UNION ALL SELECT 'Items Lista de Chequeo', COUNT(*) FROM lista_chequeo
UNION ALL SELECT 'Contratistas', COUNT(*) FROM contratistas
UNION ALL SELECT 'Documentos Cargados', COUNT(*) FROM documentos
UNION ALL SELECT 'Revisiones', COUNT(*) FROM revisiones
UNION ALL SELECT 'Permisos Especiales', COUNT(*) FROM permisos_especiales_carga
UNION ALL SELECT 'Registros de Auditoría', COUNT(*) FROM auditoria;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'USUARIOS ADMINISTRATIVOS DE PRUEBA' as '';
SELECT 'Contraseña para todos: Admin123!' as '';
SELECT '========================================' as '';

SELECT 
    u.correo as usuario,
    u.documento,
    CONCAT(u.nombres, ' ', COALESCE(u.apellidos, '')) as nombre_completo,
    GROUP_CONCAT(DISTINCT r.nombre ORDER BY r.nombre SEPARATOR ', ') as roles,
    COUNT(DISTINCT uc.centro_id) as centros_asignados,
    reg.nombre as regional
FROM usuarios u
LEFT JOIN usuario_rol ur ON u.id = ur.usuario_id AND ur.estado = TRUE
LEFT JOIN roles r ON ur.rol_id = r.id
LEFT JOIN usuario_centro uc ON u.id = uc.usuario_id AND uc.estado = TRUE
LEFT JOIN regionales reg ON u.regional_id = reg.id
GROUP BY u.id, u.correo, u.documento, u.nombres, u.apellidos, reg.nombre
ORDER BY u.id;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'ESTADO DE DOCUMENTOS POR INSTRUCTOR' as '';
SELECT '========================================' as '';

SELECT 
    c.numero_documento,
    c.nombre_completo,
    cen.nombre as centro,
    COUNT(DISTINCT d.id) as total_documentos,
    SUM(CASE WHEN d.estado = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
    SUM(CASE WHEN d.estado = 'rechazado' THEN 1 ELSE 0 END) as rechazados,
    SUM(CASE WHEN d.estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
    ROUND((SUM(CASE WHEN d.estado = 'aprobado' THEN 1 ELSE 0 END) / COUNT(DISTINCT d.id)) * 100, 2) as porcentaje_completado
FROM contratistas c
LEFT JOIN documentos d ON c.numero_documento = d.numero_documento
LEFT JOIN centros cen ON c.centro_id = cen.id
GROUP BY c.numero_documento, c.nombre_completo, cen.nombre
ORDER BY porcentaje_completado DESC;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'ESTADÍSTICAS POR CENTRO' as '';
SELECT '========================================' as '';

SELECT 
    cen.nombre as centro,
    reg.nombre as regional,
    COUNT(DISTINCT c.id) as total_contratistas,
    COUNT(DISTINCT d.id) as total_documentos_cargados,
    SUM(CASE WHEN d.estado = 'aprobado' THEN 1 ELSE 0 END) as documentos_aprobados,
    SUM(CASE WHEN d.estado = 'pendiente' THEN 1 ELSE 0 END) as documentos_pendientes
FROM centros cen
LEFT JOIN regionales reg ON cen.regional_id = reg.id
LEFT JOIN contratistas c ON cen.id = c.centro_id AND c.estado = TRUE
LEFT JOIN documentos d ON c.numero_documento = d.numero_documento
WHERE cen.id IN (1, 6, 7) -- Centros con datos de prueba
GROUP BY cen.id, cen.nombre, reg.nombre
ORDER BY total_documentos_cargados DESC;

SELECT '' as '';
SELECT '✓ Datos insertados exitosamente!' as '';
SELECT '✓ Sistema listo para pruebas' as '';

