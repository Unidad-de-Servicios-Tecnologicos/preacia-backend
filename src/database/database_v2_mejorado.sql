-- ============================================================================
-- PREACIA - SISTEMA NACIONAL DE GESTIÓN DOCUMENTAL PRECONTRACTUAL
-- Base de datos mejorada con todas las correcciones para escalabilidad
-- Versión: 2.0
-- ============================================================================

CREATE DATABASE IF NOT EXISTS preacia
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE preacia;

-- ============================================================================
-- 1. TABLAS MAESTRAS - CATÁLOGOS
-- ============================================================================

-- Tabla: centros (Centros de formación a nivel nacional)
CREATE TABLE IF NOT EXISTS centros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE COMMENT 'Código único del centro',
    nombre VARCHAR(300) NOT NULL,
    regional VARCHAR(100) COMMENT 'Regional a la que pertenece',
    ciudad VARCHAR(100),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100),
    director_nombre VARCHAR(200),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_regional (regional),
    INDEX idx_estado (estado)
) ENGINE=InnoDB COMMENT='Centros de formación del SENA a nivel nacional';

-- Tabla: categorias_documento (Categorías de documentos)
CREATE TABLE IF NOT EXISTS categorias_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    orden INT DEFAULT 1,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orden (orden)
) ENGINE=InnoDB COMMENT='Categorías para clasificar tipos de documentos';

-- Tabla: tipo_documentos (Tipos de documentos requeridos)
CREATE TABLE IF NOT EXISTS tipo_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_documento_id INT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(50) UNIQUE COMMENT 'Código único del tipo de documento',
    ejemplo_url VARCHAR(500) COMMENT 'URL de ejemplo del documento',
    instrucciones TEXT COMMENT 'Instrucciones para el usuario',
    es_obligatorio_default BOOLEAN DEFAULT TRUE,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_documento_id) REFERENCES categorias_documento(id) ON DELETE SET NULL,
    INDEX idx_categoria (categoria_documento_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB COMMENT='Tipos de documentos que pueden ser requeridos';

-- Tabla: roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    nivel_jerarquico INT DEFAULT 0 COMMENT 'Para ordenar roles por jerarquía',
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB COMMENT='Roles del sistema';

-- Tabla: permisos
CREATE TABLE IF NOT EXISTS permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    modulo VARCHAR(50) COMMENT 'Módulo al que pertenece el permiso',
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_modulo (modulo)
) ENGINE=InnoDB COMMENT='Permisos granulares del sistema';

-- ============================================================================
-- 2. GESTIÓN DE USUARIOS
-- ============================================================================

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE COMMENT 'UUID para identificación pública',
    rol_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20), 
    direccion VARCHAR(200),
    contrasena VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    intentos_login_fallidos INT DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL,
    -- Integración con ACIA (sistema externo)
    acia_id VARCHAR(50) NULL COMMENT 'ID en sistema ACIA',
    verificado_acia BOOLEAN NOT NULL DEFAULT FALSE,
    -- Recuperación de contraseña
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documentos(id),
    INDEX idx_documento (documento),
    INDEX idx_correo (correo),
    INDEX idx_rol (rol_id),
    INDEX idx_estado (estado),
    INDEX idx_acia (acia_id)
) ENGINE=InnoDB COMMENT='Usuarios del sistema (instructores, coordinadores, admins)';

-- Trigger para generar UUID automáticamente
DELIMITER $$
CREATE TRIGGER before_insert_usuarios
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.uuid IS NULL OR NEW.uuid = '' THEN
        SET NEW.uuid = UUID();
    END IF;
END$$
DELIMITER ;

-- Tabla: centro_usuario (Relación muchos a muchos)
CREATE TABLE IF NOT EXISTS centro_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    centro_id INT NOT NULL,
    usuario_id INT NOT NULL,
    rol_en_centro VARCHAR(50) COMMENT 'Rol específico en este centro: coordinador, instructor, apoyo',
    es_principal BOOLEAN DEFAULT FALSE COMMENT 'Centro principal del usuario',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_desasignacion TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE CASCADE,   
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_centro_usuario_activo (centro_id, usuario_id, activo),
    INDEX idx_centro (centro_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_activo (activo)
) ENGINE=InnoDB COMMENT='Relación usuarios-centros (un usuario puede pertenecer a múltiples centros)';

-- Tabla: rol_permiso
CREATE TABLE IF NOT EXISTS rol_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Permisos asignados a cada rol';

-- Tabla: usuario_permiso (Permisos especiales por usuario)
CREATE TABLE IF NOT EXISTS usuario_permiso (
    usuario_id INT NOT NULL,
    permiso_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, permiso_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Permisos adicionales específicos por usuario';

-- ============================================================================
-- 3. GESTIÓN DE CONVOCATORIAS
-- ============================================================================

-- Tabla: convocatorias
CREATE TABLE IF NOT EXISTS convocatorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    codigo VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código único de la convocatoria',
    nombre VARCHAR(300) NOT NULL,
    descripcion TEXT,
    tipo_contratacion ENUM('instructor', 'administrativo', 'mixto') NOT NULL,
    alcance ENUM('nacional', 'regional', 'centro') DEFAULT 'nacional',
    centro_id INT NULL COMMENT 'NULL para convocatorias nacionales, ID para específicas de centro',
    fecha_publicacion DATETIME,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    fecha_cierre_definitivo DATETIME COMMENT 'Fecha de cierre para revisiones',
    estado ENUM('borrador', 'publicada', 'activa', 'cerrada', 'cancelada') DEFAULT 'borrador',
    numero_vacantes INT,
    documento_bases_url VARCHAR(500) COMMENT 'URL del documento con las bases',
    created_by INT NOT NULL COMMENT 'Usuario que creó la convocatoria',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_centro (centro_id),
    INDEX idx_tipo (tipo_contratacion)
) ENGINE=InnoDB COMMENT='Convocatorias de contratación';

-- Trigger para UUID en convocatorias
DELIMITER $$
CREATE TRIGGER before_insert_convocatorias
BEFORE INSERT ON convocatorias
FOR EACH ROW
BEGIN
    IF NEW.uuid IS NULL OR NEW.uuid = '' THEN
        SET NEW.uuid = UUID();
    END IF;
    -- Actualizar estado según fechas
    IF NEW.fecha_inicio <= NOW() AND NEW.fecha_fin >= NOW() AND NEW.estado = 'publicada' THEN
        SET NEW.estado = 'activa';
    END IF;
END$$
DELIMITER ;

-- Tabla: documentos_requeridos (Configuración de documentos por convocatoria)
CREATE TABLE IF NOT EXISTS documentos_requeridos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    convocatoria_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    orden INT NOT NULL DEFAULT 1 COMMENT 'Orden de presentación en el wizard',
    es_obligatorio BOOLEAN DEFAULT TRUE,
    aplica_instructor BOOLEAN DEFAULT TRUE,
    aplica_administrativo BOOLEAN DEFAULT TRUE,
    descripcion_especifica TEXT COMMENT 'Descripción específica para esta convocatoria',
    tamanio_maximo_mb INT DEFAULT 10,
    formatos_permitidos VARCHAR(100) DEFAULT 'pdf,jpg,png,docx',
    requiere_validacion_ia BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE COMMENT 'Permite activar/desactivar documentos',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documentos(id),
    UNIQUE KEY unique_doc_convocatoria (convocatoria_id, tipo_documento_id),
    INDEX idx_convocatoria (convocatoria_id),
    INDEX idx_tipo_documento (tipo_documento_id),
    INDEX idx_orden (orden),
    INDEX idx_activo (activo)
) ENGINE=InnoDB COMMENT='Documentos requeridos configurados por cada convocatoria';

-- ============================================================================
-- 4. GESTIÓN DE DOCUMENTOS CARGADOS
-- ============================================================================

-- Tabla: documentos (Documentos cargados por los usuarios)
CREATE TABLE IF NOT EXISTS documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE COMMENT 'UUID público del documento',
    usuario_id INT NOT NULL,
    convocatoria_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    centro_id INT NOT NULL COMMENT 'Centro del usuario al cargar el documento',
    documento_requerido_id INT NOT NULL COMMENT 'Referencia a la configuración específica',
    -- Información del archivo
    nombre_original VARCHAR(255) NOT NULL,
    nombre_almacenado VARCHAR(255) NOT NULL UNIQUE,
    ruta_archivo VARCHAR(500) NOT NULL COMMENT 'Ruta relativa o URL de S3',
    extension VARCHAR(10) NOT NULL,
    tamanio_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    hash_sha256 VARCHAR(64) UNIQUE COMMENT 'Hash del archivo para integridad y detección de duplicados',
    -- Versionado
    version INT DEFAULT 1,
    reemplaza_a INT NULL COMMENT 'ID del documento anterior que reemplaza',
    -- Validación y estado
    estado_validacion ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado', 'observado', 'reemplazado') DEFAULT 'pendiente',
    requiere_nueva_version BOOLEAN DEFAULT FALSE,
    -- Validación con IA (RF-006)
    validado_ia BOOLEAN DEFAULT FALSE,
    score_ia DECIMAL(5,2) NULL COMMENT 'Score de confianza de IA (0-100)',
    metadata_ia JSON NULL COMMENT 'Datos extraídos por IA: nombres, identificaciones, etc',
    fecha_validacion_ia DATETIME NULL,
    -- Validación manual
    fecha_validacion_manual DATETIME NULL,
    validado_por INT NULL COMMENT 'Usuario que validó/rechazó',
    -- Auditoría
    ip_carga VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documentos(id),
    FOREIGN KEY (centro_id) REFERENCES centros(id),
    FOREIGN KEY (documento_requerido_id) REFERENCES documentos_requeridos(id),
    FOREIGN KEY (validado_por) REFERENCES usuarios(id),
    FOREIGN KEY (reemplaza_a) REFERENCES documentos(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_convocatoria (convocatoria_id),
    INDEX idx_centro (centro_id),
    INDEX idx_estado (estado_validacion),
    INDEX idx_hash (hash_sha256),
    INDEX idx_tipo_documento (tipo_documento_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB COMMENT='Documentos cargados por usuarios para convocatorias';

-- Trigger para UUID en documentos
DELIMITER $$
CREATE TRIGGER before_insert_documentos
BEFORE INSERT ON documentos
FOR EACH ROW
BEGIN
    IF NEW.uuid IS NULL OR NEW.uuid = '' THEN
        SET NEW.uuid = UUID();
    END IF;
END$$
DELIMITER ;

-- Trigger para marcar documento anterior como reemplazado
DELIMITER $$
CREATE TRIGGER after_insert_documentos_reemplazo
AFTER INSERT ON documentos
FOR EACH ROW
BEGIN
    IF NEW.reemplaza_a IS NOT NULL THEN
        UPDATE documentos 
        SET estado_validacion = 'reemplazado',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.reemplaza_a;
    END IF;
END$$
DELIMITER ;

-- ============================================================================
-- 5. REVISIÓN Y OBSERVACIONES
-- ============================================================================

-- Tabla: revisiones_documento
CREATE TABLE IF NOT EXISTS revisiones_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    documento_id INT NOT NULL,
    revisor_id INT NOT NULL,
    estado_anterior ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado', 'observado', 'reemplazado'),
    estado_nuevo ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado', 'observado', 'reemplazado'),
    tiempo_revision_segundos INT COMMENT 'Tiempo que tardó la revisión',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE,
    FOREIGN KEY (revisor_id) REFERENCES usuarios(id),
    INDEX idx_documento (documento_id),
    INDEX idx_revisor (revisor_id),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB COMMENT='Historial de revisiones de documentos';

-- Tabla: observaciones_revision
CREATE TABLE IF NOT EXISTS observaciones_revision (
    id INT AUTO_INCREMENT PRIMARY KEY,
    revision_id INT NOT NULL,
    documento_id INT NOT NULL,
    revisor_id INT NOT NULL,
    tipo_observacion ENUM('rechazo', 'solicitud_correccion', 'aprobacion_condicional', 'comentario_interno') NOT NULL,
    observacion TEXT NOT NULL,
    campo_especifico VARCHAR(100) COMMENT 'Campo específico del documento con problema',
    severidad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
    adjuntos JSON NULL COMMENT 'Array de URLs de imágenes explicativas',
    leido_por_usuario BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (revision_id) REFERENCES revisiones_documento(id) ON DELETE CASCADE,
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE,
    FOREIGN KEY (revisor_id) REFERENCES usuarios(id),
    INDEX idx_documento (documento_id),
    INDEX idx_revision (revision_id),
    INDEX idx_leido (leido_por_usuario),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB COMMENT='Observaciones detalladas de revisiones';

-- ============================================================================
-- 6. CONTRATOS
-- ============================================================================

-- Tabla: tipo_contratos
CREATE TABLE IF NOT EXISTS tipo_contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    descripcion TEXT,
    duracion_meses_default INT,
    requiere_documentos_adicionales BOOLEAN DEFAULT FALSE,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Tipos de contratos disponibles';

-- Tabla: contratos (TABLA FALTANTE CRÍTICA)
CREATE TABLE IF NOT EXISTS contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    codigo_contrato VARCHAR(100) UNIQUE NOT NULL COMMENT 'Número de contrato oficial',
    usuario_id INT NOT NULL,
    convocatoria_id INT NOT NULL,
    centro_id INT NOT NULL,
    tipo_contrato_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    valor DECIMAL(15,2) COMMENT 'Valor del contrato',
    objeto_contractual TEXT,
    estado ENUM('borrador', 'generado', 'firmado', 'activo', 'suspendido', 'finalizado', 'cancelado') DEFAULT 'borrador',
    archivo_contrato_url VARCHAR(500) COMMENT 'URL del contrato firmado',
    observaciones TEXT,
    created_by INT NOT NULL,
    aprobado_por INT NULL,
    fecha_aprobacion DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id),
    FOREIGN KEY (centro_id) REFERENCES centros(id),
    FOREIGN KEY (tipo_contrato_id) REFERENCES tipo_contratos(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    FOREIGN KEY (aprobado_por) REFERENCES usuarios(id),
    INDEX idx_codigo (codigo_contrato),
    INDEX idx_usuario (usuario_id),
    INDEX idx_convocatoria (convocatoria_id),
    INDEX idx_centro (centro_id),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB COMMENT='Contratos generados para usuarios';

-- Trigger para UUID en contratos
DELIMITER $$
CREATE TRIGGER before_insert_contratos
BEFORE INSERT ON contratos
FOR EACH ROW
BEGIN
    IF NEW.uuid IS NULL OR NEW.uuid = '' THEN
        SET NEW.uuid = UUID();
    END IF;
END$$
DELIMITER ;

-- Tabla: documentos_contratos (Relación contratos-documentos)
CREATE TABLE IF NOT EXISTS documentos_contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT NOT NULL,
    documento_id INT NOT NULL,
    tipo_relacion ENUM('requisito_previo', 'anexo', 'soporte', 'modificacion') DEFAULT 'requisito_previo',
    obligatorio BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
    FOREIGN KEY (documento_id) REFERENCES documentos(id),
    UNIQUE KEY unique_contrato_documento (contrato_id, documento_id),
    INDEX idx_contrato (contrato_id),
    INDEX idx_documento (documento_id)
) ENGINE=InnoDB COMMENT='Documentos asociados a contratos';

-- ============================================================================
-- 7. PROGRESO Y COMPLETITUD
-- ============================================================================

-- Tabla: usuario_convocatoria_progreso
CREATE TABLE IF NOT EXISTS usuario_convocatoria_progreso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    convocatoria_id INT NOT NULL,
    centro_id INT NOT NULL,
    documentos_requeridos INT NOT NULL DEFAULT 0,
    documentos_cargados INT DEFAULT 0,
    documentos_pendientes_revision INT DEFAULT 0,
    documentos_aprobados INT DEFAULT 0,
    documentos_rechazados INT DEFAULT 0,
    documentos_observados INT DEFAULT 0,
    porcentaje_completitud DECIMAL(5,2) DEFAULT 0.00,
    completado BOOLEAN DEFAULT FALSE,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id) ON DELETE CASCADE,
    FOREIGN KEY (centro_id) REFERENCES centros(id),
    UNIQUE KEY unique_usuario_convocatoria (usuario_id, convocatoria_id),
    INDEX idx_convocatoria (convocatoria_id),
    INDEX idx_centro (centro_id),
    INDEX idx_completitud (porcentaje_completitud),
    INDEX idx_completado (completado)
) ENGINE=InnoDB COMMENT='Seguimiento del progreso de usuarios en convocatorias';

-- Procedimiento para actualizar progreso
DELIMITER $$
CREATE PROCEDURE actualizar_progreso_usuario(
    IN p_usuario_id INT,
    IN p_convocatoria_id INT
)
BEGIN
    DECLARE v_total_requeridos INT;
    DECLARE v_total_cargados INT;
    DECLARE v_pendientes INT;
    DECLARE v_aprobados INT;
    DECLARE v_rechazados INT;
    DECLARE v_observados INT;
    DECLARE v_porcentaje DECIMAL(5,2);
    DECLARE v_completado BOOLEAN;
    DECLARE v_centro_id INT;
    
    -- Obtener centro del usuario
    SELECT centro_id INTO v_centro_id 
    FROM centro_usuario 
    WHERE usuario_id = p_usuario_id AND activo = TRUE 
    LIMIT 1;
    
    -- Contar documentos requeridos obligatorios
    SELECT COUNT(*) INTO v_total_requeridos
    FROM documentos_requeridos
    WHERE convocatoria_id = p_convocatoria_id 
      AND es_obligatorio = TRUE 
      AND activo = TRUE;
    
    -- Contar documentos del usuario
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado_validacion IN ('pendiente', 'en_revision') THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado_validacion = 'aprobado' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN estado_validacion = 'rechazado' THEN 1 ELSE 0 END) as rechazados,
        SUM(CASE WHEN estado_validacion = 'observado' THEN 1 ELSE 0 END) as observados
    INTO v_total_cargados, v_pendientes, v_aprobados, v_rechazados, v_observados
    FROM documentos d
    INNER JOIN documentos_requeridos dr ON d.documento_requerido_id = dr.id
    WHERE d.usuario_id = p_usuario_id 
      AND d.convocatoria_id = p_convocatoria_id
      AND d.estado_validacion != 'reemplazado'
      AND dr.es_obligatorio = TRUE;
    
    -- Calcular porcentaje (basado en aprobados)
    IF v_total_requeridos > 0 THEN
        SET v_porcentaje = (v_aprobados / v_total_requeridos) * 100;
    ELSE
        SET v_porcentaje = 0;
    END IF;
    
    -- Verificar si está completado
    SET v_completado = (v_aprobados >= v_total_requeridos AND v_total_requeridos > 0);
    
    -- Insertar o actualizar
    INSERT INTO usuario_convocatoria_progreso (
        usuario_id, convocatoria_id, centro_id,
        documentos_requeridos, documentos_cargados,
        documentos_pendientes_revision, documentos_aprobados,
        documentos_rechazados, documentos_observados,
        porcentaje_completitud, completado,
        fecha_completado
    ) VALUES (
        p_usuario_id, p_convocatoria_id, v_centro_id,
        v_total_requeridos, v_total_cargados,
        v_pendientes, v_aprobados, v_rechazados, v_observados,
        v_porcentaje, v_completado,
        IF(v_completado, NOW(), NULL)
    )
    ON DUPLICATE KEY UPDATE
        documentos_requeridos = v_total_requeridos,
        documentos_cargados = v_total_cargados,
        documentos_pendientes_revision = v_pendientes,
        documentos_aprobados = v_aprobados,
        documentos_rechazados = v_rechazados,
        documentos_observados = v_observados,
        porcentaje_completitud = v_porcentaje,
        completado = v_completado,
        fecha_completado = IF(v_completado AND completado = FALSE, NOW(), fecha_completado);
END$$
DELIMITER ;

-- ============================================================================
-- 8. NOTIFICACIONES
-- ============================================================================

-- Tabla: notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('documento_aprobado', 'documento_rechazado', 'documento_observado', 
              'recordatorio', 'convocatoria_nueva', 'convocatoria_cierre', 
              'contrato_generado', 'sistema') NOT NULL,
    prioridad ENUM('baja', 'normal', 'alta', 'urgente') DEFAULT 'normal',
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    url_accion VARCHAR(500) COMMENT 'URL a donde dirigir al usuario al hacer clic',
    datos_adicionales JSON COMMENT 'Datos contextuales para la notificación',
    -- Estado de lectura
    leida BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP NULL,
    -- Envío de email
    enviada_email BOOLEAN DEFAULT FALSE,
    fecha_envio_email TIMESTAMP NULL,
    email_error TEXT COMMENT 'Error al enviar email si aplica',
    -- Envío de SMS (futuro)
    enviada_sms BOOLEAN DEFAULT FALSE,
    fecha_envio_sms TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL COMMENT 'Fecha de expiración de la notificación',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_tipo (tipo),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha (created_at),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB COMMENT='Sistema de notificaciones multicanal';

-- Tabla: configuracion_notificaciones_usuario
CREATE TABLE IF NOT EXISTS configuracion_notificaciones_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    notif_email_documentos BOOLEAN DEFAULT TRUE,
    notif_email_convocatorias BOOLEAN DEFAULT TRUE,
    notif_email_recordatorios BOOLEAN DEFAULT TRUE,
    notif_email_sistema BOOLEAN DEFAULT TRUE,
    notif_sms_urgentes BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Preferencias de notificaciones por usuario';

-- ============================================================================
-- 9. AUDITORÍA Y TRAZABILIDAD (RF-009.2)
-- ============================================================================

-- Tabla: auditoria
CREATE TABLE IF NOT EXISTS auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL COMMENT 'NULL para acciones del sistema',
    accion VARCHAR(100) NOT NULL COMMENT 'CREAR, ACTUALIZAR, ELIMINAR, LOGIN, etc',
    entidad VARCHAR(100) NOT NULL COMMENT 'Tabla afectada',
    entidad_id INT COMMENT 'ID del registro afectado',
    descripcion TEXT COMMENT 'Descripción de la acción',
    datos_anteriores JSON COMMENT 'Estado anterior del registro',
    datos_nuevos JSON COMMENT 'Estado nuevo del registro',
    -- Contexto de la acción
    ip_address VARCHAR(45),
    user_agent TEXT,
    url_solicitada VARCHAR(500),
    metodo_http VARCHAR(10),
    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_entidad (entidad, entidad_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (created_at),
    INDEX idx_ip (ip_address)
) ENGINE=InnoDB COMMENT='Registro de auditoría completo del sistema (retención 5 años)'
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ============================================================================
-- 10. CONFIGURACIÓN Y PARÁMETROS DEL SISTEMA
-- ============================================================================

-- Tabla: configuracion_centro
CREATE TABLE IF NOT EXISTS configuracion_centro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    centro_id INT NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    color_primario VARCHAR(7) DEFAULT '#00A9E0',
    color_secundario VARCHAR(7) DEFAULT '#39A900',
    coordinador_principal_id INT,
    email_notificaciones VARCHAR(100),
    firma_digital_coordinador_url VARCHAR(500),
    configuracion_adicional JSON COMMENT 'Configuraciones específicas del centro',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (centro_id) REFERENCES centros(id) ON DELETE CASCADE,
    FOREIGN KEY (coordinador_principal_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Configuración personalizada por centro';

-- Tabla: parametros_sistema
CREATE TABLE IF NOT EXISTS parametros_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    tipo_dato ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    descripcion TEXT,
    categoria VARCHAR(50) COMMENT 'Categoría del parámetro',
    editable BOOLEAN DEFAULT TRUE,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id),
    INDEX idx_clave (clave),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB COMMENT='Parámetros globales del sistema';

-- ============================================================================
-- 11. ESTADÍSTICAS Y REPORTES (TABLAS DE RESUMEN)
-- ============================================================================

-- Tabla: estadisticas_convocatoria
CREATE TABLE IF NOT EXISTS estadisticas_convocatoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    convocatoria_id INT NOT NULL UNIQUE,
    total_postulantes INT DEFAULT 0,
    total_documentos_cargados INT DEFAULT 0,
    total_documentos_aprobados INT DEFAULT 0,
    total_documentos_rechazados INT DEFAULT 0,
    total_documentos_pendientes INT DEFAULT 0,
    porcentaje_completitud_promedio DECIMAL(5,2) DEFAULT 0,
    postulantes_completos INT DEFAULT 0,
    contratos_generados INT DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Estadísticas agregadas por convocatoria (actualización periódica)';

-- ============================================================================
-- 12. RECUPERACIÓN DE CONTRASEÑA
-- ============================================================================

-- Tabla: recuperacion_password (Ya contemplada en usuarios, pero se mantiene separada)
CREATE TABLE IF NOT EXISTS recuperacion_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_expires TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    fecha_uso TIMESTAMP NULL,
    ip_solicitud VARCHAR(45),
    ip_uso VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usuario (usuario_id),
    INDEX idx_expires (token_expires)
) ENGINE=InnoDB COMMENT='Tokens de recuperación de contraseña';

-- ============================================================================
-- FIN DEL ESQUEMA
-- ============================================================================

-- Crear índices adicionales para optimización
CREATE INDEX idx_documentos_usuario_convocatoria ON documentos(usuario_id, convocatoria_id);
CREATE INDEX idx_documentos_estado_fecha ON documentos(estado_validacion, created_at);
CREATE INDEX idx_notificaciones_usuario_tipo ON notificaciones(usuario_id, tipo, leida);

-- ============================================================================
-- VISTAS ÚTILES PARA CONSULTAS FRECUENTES
-- ============================================================================

-- Vista: documentos_pendientes_revision
CREATE OR REPLACE VIEW v_documentos_pendientes_revision AS
SELECT 
    d.id,
    d.uuid,
    d.usuario_id,
    CONCAT(u.nombres, ' ', u.apellidos) as nombre_usuario,
    u.documento as documento_usuario,
    u.correo as correo_usuario,
    d.convocatoria_id,
    c.codigo as codigo_convocatoria,
    c.nombre as nombre_convocatoria,
    d.centro_id,
    ce.nombre as nombre_centro,
    d.tipo_documento_id,
    td.nombre as tipo_documento,
    d.nombre_original,
    d.estado_validacion,
    d.score_ia,
    d.created_at as fecha_carga,
    TIMESTAMPDIFF(HOUR, d.created_at, NOW()) as horas_esperando
FROM documentos d
INNER JOIN usuarios u ON d.usuario_id = u.id
INNER JOIN convocatorias c ON d.convocatoria_id = c.id
INNER JOIN centros ce ON d.centro_id = ce.id
INNER JOIN tipo_documentos td ON d.tipo_documento_id = td.id
WHERE d.estado_validacion IN ('pendiente', 'en_revision')
ORDER BY d.created_at ASC;

-- Vista: progreso_convocatorias
CREATE OR REPLACE VIEW v_progreso_convocatorias AS
SELECT 
    c.id as convocatoria_id,
    c.codigo,
    c.nombre,
    c.estado,
    c.fecha_inicio,
    c.fecha_fin,
    COUNT(DISTINCT p.usuario_id) as total_postulantes,
    SUM(p.completado) as postulantes_completos,
    AVG(p.porcentaje_completitud) as porcentaje_promedio,
    SUM(p.documentos_aprobados) as total_docs_aprobados,
    SUM(p.documentos_rechazados) as total_docs_rechazados,
    SUM(p.documentos_pendientes_revision) as total_docs_pendientes
FROM convocatorias c
LEFT JOIN usuario_convocatoria_progreso p ON c.id = p.convocatoria_id
GROUP BY c.id;

-- ============================================================================
-- COMENTARIOS FINALES
-- ============================================================================

/*
NOTAS IMPORTANTES:

1. ESCALABILIDAD:
   - Índices optimizados para consultas frecuentes
   - Particionamiento en tabla de auditoría por año
   - UUIDs para identificación pública (evita exposición de IDs secuenciales)
   - JSON para datos flexibles (metadata_ia, configuraciones)

2. SEGURIDAD:
   - Hash SHA256 para integridad de archivos
   - Auditoría completa de acciones
   - Tokens con expiración
   - Campos para IP y user agent

3. MANTENIBILIDAD:
   - Nomenclatura consistente
   - Comentarios descriptivos
   - Triggers para automatización
   - Procedimientos almacenados para lógica compleja
   - Vistas para consultas frecuentes

4. MULTITENANCY:
   - Soporte para múltiples centros
   - Configuración por centro
   - Usuario puede pertenecer a múltiples centros

5. INTEGRACIONES:
   - Campo acia_id para integración con sistema externo
   - JSON para almacenar respuestas de APIs externas
   - Preparado para validación con IA

6. PRÓXIMOS PASOS:
   - Implementar cola de jobs para procesamiento de IA
   - Configurar S3 para almacenamiento de archivos
   - Implementar sistema de cache (Redis)
   - Configurar backups automáticos
   - Implementar soft deletes si es necesario
*/
