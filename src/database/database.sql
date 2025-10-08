-- =============================================================================
-- SISTEMA NACIONAL DE GESTIÓN DE LISTAS DE CHEQUEO PRECONTRACTUALES - SENA
-- Base de Datos Mejorada v3
-- Fecha: Octubre 2025
-- =============================================================================

CREATE DATABASE IF NOT EXISTS preacia_sena;
USE preacia_sena;

-- =============================================================================
-- 1. ESTRUCTURA ORGANIZACIONAL
-- =============================================================================

-- Tabla: regionales
-- Descripción: Regionales del SENA a nivel nacional
CREATE TABLE IF NOT EXISTS regionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE COMMENT 'Código único de la regional',
    nombre VARCHAR(200) NOT NULL COMMENT 'Nombre de la regional',
    direccion VARCHAR(300),
    telefono VARCHAR(20),
    estado BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Regionales del SENA';

-- Tabla: centros
-- Descripción: Centros de formación por regional
CREATE TABLE IF NOT EXISTS centros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regional_id INT NOT NULL COMMENT 'Regional a la que pertenece',
    codigo VARCHAR(20) NOT NULL COMMENT 'Código del centro',
    nombre VARCHAR(300) NOT NULL COMMENT 'Nombre del centro de formación',
    direccion VARCHAR(300),
    telefono VARCHAR(20),
    estado BOOLEAN DEFAULT TRUE COMMENT 'Estado activo/inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (regional_id) REFERENCES regionales(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_codigo_regional (regional_id, codigo),
    INDEX idx_regional (regional_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Centros de formación';

-- =============================================================================
-- 2. GESTIÓN DE VIGENCIAS Y CONVOCATORIAS
-- =============================================================================

-- Tabla: vigencias
-- Descripción: Periodos/vigencias para carga de documentos
CREATE TABLE IF NOT EXISTS vigencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL COMMENT 'Ej: Vigencia 2025-1',
    anio INT NOT NULL COMMENT 'Año de la vigencia',
    descripcion TEXT COMMENT 'Descripción de la vigencia',
    fecha_inicio DATE NOT NULL COMMENT 'Fecha inicio de carga',
    fecha_fin DATE NOT NULL COMMENT 'Fecha fin de carga',
    estado_vigencia ENUM('pendiente', 'activa', 'cerrada') DEFAULT 'pendiente' COMMENT 'Estado de la vigencia',
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_nombre_anio (nombre, anio),
    INDEX idx_estado_vigencia (estado_vigencia),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_estado (estado),
    CHECK (fecha_fin > fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vigencias/periodos contractuales';

-- =============================================================================
-- 3. USUARIOS Y ROLES (SOLO ADMINISTRATIVOS)
-- =============================================================================

-- Tabla: tipo_documentos
CREATE TABLE IF NOT EXISTS tipo_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE COMMENT 'CC, CE, NIT',
    nombre VARCHAR(100) NOT NULL UNIQUE COMMENT 'Cédula de Ciudadanía, etc',
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tipos de documento';

-- Tabla: roles
-- Descripción: Roles administrativos (revisor, admin_centro, director_regional, admin)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE COMMENT 'revisor, administrador_centro, director_regional, admin',
    descripcion VARCHAR(500),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Roles administrativos';

-- Tabla: permisos
CREATE TABLE IF NOT EXISTS permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permisos del sistema';

-- Tabla: usuarios (SOLO ADMINISTRATIVOS)
-- Descripción: Usuarios con autenticación (NO incluye instructores/administrativos)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regional_id INT NULL COMMENT 'Regional asignada (obligatorio para director_regional)',
    tipo_documento_id INT NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE COMMENT 'Número de documento',
    nombres VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150),
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20), 
    direccion VARCHAR(200),
    contrasena VARCHAR(255) NOT NULL COMMENT 'Password encriptado con bcrypt',
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL,
    ultimo_cambio_password TIMESTAMP NULL,
    password_debe_cambiar BOOLEAN DEFAULT FALSE COMMENT 'Cambio obligatorio en primer login',
    acia_id VARCHAR(50) NULL COMMENT 'ID en sistema externo ACIA',
    verificado_acia BOOLEAN DEFAULT FALSE COMMENT 'Si fue verificado en sistema ACIA',
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    created_by INT NULL COMMENT 'Usuario que creó este usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (regional_id) REFERENCES regionales(id) ON DELETE RESTRICT,
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documentos(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_regional (regional_id),
    INDEX idx_estado (estado),
    INDEX idx_correo (correo),
    INDEX idx_documento (documento),
    INDEX idx_acia (acia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Usuarios administrativos con autenticación';

-- Tabla: rol_permiso
CREATE TABLE IF NOT EXISTS rol_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permisos por rol';

-- Tabla: usuario_rol
-- Descripción: Relación muchos a muchos entre usuarios y roles
CREATE TABLE IF NOT EXISTS usuario_rol (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE COMMENT 'Estado de la asignación del rol',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_rol (rol_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Roles asignados a usuarios';

-- Tabla: usuario_permiso
CREATE TABLE IF NOT EXISTS usuario_permiso (
    usuario_id INT NOT NULL,
    permiso_id INT NOT NULL,
    PRIMARY KEY (usuario_id, permiso_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permisos especiales por usuario';

-- Tabla: usuario_centro
-- Descripción: Relación many-to-many entre usuarios administrativos y centros
CREATE TABLE IF NOT EXISTS usuario_centro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    centro_id INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE COMMENT 'Estado de la asignación',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_usuario_centro (usuario_id, centro_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_centro (centro_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Centros asignados a usuarios administrativos';

-- =============================================================================
-- 4. INSTRUCTORES/ADMINISTRATIVOS (SIN AUTENTICACIÓN)
-- =============================================================================

-- Tabla: contratistas
-- Descripción: Registro de instructores/administrativos que cargan documentos (SIN password)
CREATE TABLE IF NOT EXISTS contratistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento_id INT NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE COMMENT 'Identificador principal',
    nombre_completo VARCHAR(300) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    centro_id INT NOT NULL COMMENT 'Centro de formación',
    tipo_contrato VARCHAR(50) COMMENT 'Instructor, Administrativo, etc',
    encontrado_en_acia BOOLEAN DEFAULT FALSE COMMENT 'Si fue encontrado en sistema ACIA',
    acia_id VARCHAR(50) COMMENT 'ID en sistema ACIA',
    fecha_verificacion_acia TIMESTAMP NULL COMMENT 'Última consulta a ACIA',
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documentos(id) ON DELETE RESTRICT,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE RESTRICT,
    INDEX idx_documento (numero_documento),
    INDEX idx_centro (centro_id),
    INDEX idx_acia (encontrado_en_acia),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Instructores/administrativos sin autenticación';

-- =============================================================================
-- 5. LISTA DE CHEQUEO
-- =============================================================================

-- Tabla: lista_chequeo
-- Descripción: Catálogo nacional de documentos requeridos
CREATE TABLE IF NOT EXISTS lista_chequeo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_item VARCHAR(200) NOT NULL COMMENT 'Nombre del documento',
    descripcion TEXT NOT NULL COMMENT 'Descripción detallada',
    orden INT NOT NULL COMMENT 'Orden de presentación',
    obligatorio BOOLEAN DEFAULT TRUE COMMENT 'Si es obligatorio',
    estado BOOLEAN DEFAULT TRUE COMMENT 'Si está activo',
    requiere_fecha_documento BOOLEAN DEFAULT FALSE COMMENT 'Si requiere fecha de expedición',
    requiere_fecha_vencimiento BOOLEAN DEFAULT FALSE COMMENT 'Si requiere fecha de vencimiento',
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_estado_orden (estado, orden),
    INDEX idx_obligatorio (obligatorio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lista de chequeo nacional';

-- Tabla: vigencia_lista_chequeo
-- Descripción: Configuración de lista de chequeo por vigencia
CREATE TABLE IF NOT EXISTS vigencia_lista_chequeo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vigencia_id INT NOT NULL,
    lista_chequeo_id INT NOT NULL,
    estado BOOLEAN DEFAULT TRUE COMMENT 'Item activo para esta vigencia',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vigencia_id) REFERENCES vigencias(id) ON DELETE CASCADE,
    FOREIGN KEY (lista_chequeo_id) REFERENCES lista_chequeo(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vigencia_item (vigencia_id, lista_chequeo_id),
    INDEX idx_vigencia (vigencia_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Items de lista de chequeo por vigencia';

-- =============================================================================
-- 6. DOCUMENTOS
-- =============================================================================

-- Tabla: documentos
-- Descripción: Documentos cargados por instructores/administrativos
CREATE TABLE IF NOT EXISTS documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(20) NOT NULL COMMENT 'Documento del instructor (NO usuario_id)',
    centro_id INT NOT NULL COMMENT 'Centro de formación',
    vigencia_id INT NOT NULL COMMENT 'Vigencia a la que pertenece',
    lista_chequeo_id INT NOT NULL COMMENT 'Item de lista de chequeo',
    ruta_archivo VARCHAR(500) NOT NULL COMMENT 'Ruta o URL del archivo',
    nombre_archivo_original VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    tamanio_bytes BIGINT NOT NULL,
    
    -- Fechas del documento
    fecha_documento DATE NULL COMMENT 'Fecha ingresada por usuario (expedición)',
    fecha_vencimiento DATE NULL COMMENT 'Fecha vencimiento ingresada',
    
    -- Estados y observaciones
    estado ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    observaciones TEXT COMMENT 'Observaciones del revisor',
    
    -- Control de versiones
    version INT DEFAULT 1,
    documento_anterior_id INT NULL COMMENT 'Versión anterior',
    
    -- Timestamps
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de carga inicial',
    fecha_envio_revision TIMESTAMP NULL COMMENT 'Fecha de envío a revisión',
    fecha_revision TIMESTAMP NULL COMMENT 'Fecha de última revisión',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE RESTRICT,
    FOREIGN KEY (vigencia_id) REFERENCES vigencias(id) ON DELETE RESTRICT,
    FOREIGN KEY (lista_chequeo_id) REFERENCES lista_chequeo(id) ON DELETE RESTRICT,
    FOREIGN KEY (documento_anterior_id) REFERENCES documentos(id) ON DELETE SET NULL,
    
    -- Índices para multi-tenant y búsquedas
    INDEX idx_numero_doc_vigencia (numero_documento, vigencia_id),
    INDEX idx_centro_estado (centro_id, estado, created_at),
    INDEX idx_vigencia (vigencia_id),
    INDEX idx_estado (estado),
    INDEX idx_numero_documento (numero_documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Documentos cargados';

-- =============================================================================
-- 7. REVISIONES
-- =============================================================================

-- Tabla: revisiones
-- Descripción: Historial de revisiones de documentos
CREATE TABLE IF NOT EXISTS revisiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    documento_id INT NOT NULL,
    revisor_id INT NOT NULL COMMENT 'Usuario administrativo que revisó',
    centro_id INT NOT NULL COMMENT 'Centro (para separación lógica)',
    fecha_revision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_revision ENUM('aprobado', 'rechazado') NOT NULL,
    comentario TEXT COMMENT 'Comentarios del revisor',
    tiempo_revision_minutos INT COMMENT 'Tiempo que tomó la revisión',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE,
    FOREIGN KEY (revisor_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE RESTRICT,
    INDEX idx_documento (documento_id),
    INDEX idx_revisor_fecha (revisor_id, fecha_revision),
    INDEX idx_centro (centro_id),
    INDEX idx_estado (estado_revision)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historial de revisiones';

-- =============================================================================
-- 8. PERMISOS ESPECIALES DE CARGA
-- =============================================================================

-- Tabla: permisos_especiales_carga
-- Descripción: Permisos para cargar fuera de fechas de vigencia
CREATE TABLE IF NOT EXISTS permisos_especiales_carga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(20) NULL COMMENT 'Instructor específico (NULL si es masivo)',
    vigencia_id INT NOT NULL,
    centro_id INT NOT NULL,
    es_permiso_masivo BOOLEAN DEFAULT FALSE COMMENT 'Si aplica a todo el centro',
    fecha_inicio DATE NOT NULL COMMENT 'Inicio del permiso',
    fecha_fin DATE NOT NULL COMMENT 'Fin del permiso',
    justificacion TEXT NOT NULL COMMENT 'Razón del permiso',
    otorgado_por_id INT NOT NULL COMMENT 'Admin que otorgó el permiso',
    revocado BOOLEAN DEFAULT FALSE,
    fecha_revocacion TIMESTAMP NULL,
    revocado_por_id INT NULL,
    motivo_revocacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vigencia_id) REFERENCES vigencias(id) ON DELETE CASCADE,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE CASCADE,
    FOREIGN KEY (otorgado_por_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (revocado_por_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_numero_doc_vigencia (numero_documento, vigencia_id),
    INDEX idx_centro_vigencia (centro_id, vigencia_id),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_revocado (revocado),
    INDEX idx_masivo (es_permiso_masivo),
    CHECK (fecha_fin >= fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Permisos especiales para carga fuera de fechas';

-- =============================================================================
-- 9. AUDITORÍA
-- =============================================================================

-- Tabla: auditoria
-- Descripción: Registro inmutable de todas las operaciones críticas
CREATE TABLE IF NOT EXISTS auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL COMMENT 'Usuario que realizó la acción (NULL si es instructor)',
    numero_documento VARCHAR(20) NULL COMMENT 'Si fue un instructor/administrativo',
    accion VARCHAR(100) NOT NULL COMMENT 'Tipo de acción realizada',
    entidad_afectada VARCHAR(100) NOT NULL COMMENT 'Tabla afectada',
    entidad_id INT NULL COMMENT 'ID del registro afectado',
    datos_anteriores JSON COMMENT 'Estado anterior (para updates)',
    datos_nuevos JSON COMMENT 'Estado nuevo',
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    centro_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE SET NULL,
    INDEX idx_usuario_fecha (usuario_id, created_at),
    INDEX idx_numero_doc (numero_documento),
    INDEX idx_entidad (entidad_afectada, entidad_id),
    INDEX idx_created (created_at),
    INDEX idx_accion (accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Auditoría del sistema';

-- =============================================================================
-- 10. SESIONES TEMPORALES (OPCIONAL)
-- =============================================================================

-- Tabla: sesiones_instructores
-- Descripción: Sesiones temporales de instructores (sin autenticación)
CREATE TABLE IF NOT EXISTS sesiones_instructores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(20) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    vigencia_id INT NULL COMMENT 'Vigencia en la que está trabajando',
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 2 HOUR) COMMENT 'Expiración de la sesión (2 horas por defecto)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (session_token),
    INDEX idx_documento (numero_documento),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sesiones temporales de instructores';

-- =============================================================================
-- COMENTARIOS Y NOTAS
-- =============================================================================

/*
DIFERENCIAS CLAVE CON VERSIÓN ANTERIOR:

1. SEPARACIÓN DE USUARIOS:
   - Tabla 'usuarios': Solo roles administrativos (con password)
   - Tabla 'contratistas': Sin password, identificados por documento

2. GESTIÓN DE VIGENCIAS:
   - Nueva tabla 'vigencias' para periodos contractuales
   - Control de fechas de carga por vigencia
   - Sistema de permisos especiales para excepciones

3. DOCUMENTOS:
   - Campo 'numero_documento' en lugar de 'usuario_id'
   - Campo 'vigencia_id' obligatorio
   - Campos de fechas del documento (usuario + IA)
   - Alertas de discrepancia de fechas

4. PERMISOS ESPECIALES:
   - Nueva tabla 'permisos_especiales_carga'
   - Permisos individuales o masivos
   - Sistema de revocación

5. ESTRUCTURA ORGANIZACIONAL:
   - Nueva tabla 'regionales'
   - Tabla 'centros' con 'regional_id'
   - Tabla 'usuarios' con 'regional_id' (para directores regionales)

6. MULTI-TENANT:
   - Separación lógica por 'regional_id' y 'centro_id'
   - Índices optimizados para queries multi-tenant

7. AUDITORÍA:
   - Registro de acciones de usuarios administrativos
   - Registro de acciones de instructores (por documento)

8. POLÍTICA DE ELIMINACIÓN:
   - NO SE ELIMINAN REGISTROS FÍSICAMENTE (NO hay soft deletes con deleted_at)
   - Se usa campo 'estado' (boolean) para desactivar/activar registros
   - Beneficios:
     * Mantiene integridad referencial
     * Preserva historial completo
     * Permite auditoría total
     * Permite reactivación simple
   - Aplicable a: regionales, centros, usuarios, contratistas, roles, permisos, lista_chequeo
   - Excepciones con CASCADE: solo tablas pivote y relaciones temporales (sesiones, revisiones)
*/

