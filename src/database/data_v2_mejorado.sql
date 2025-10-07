-- ============================================================================
-- PREACIA - DATOS INICIALES MEJORADOS
-- Versión: 2.0
-- ============================================================================

USE preacia;

-- ============================================================================
-- 1. CENTROS DE FORMACIÓN
-- ============================================================================

INSERT INTO centros (codigo, nombre, regional, ciudad, direccion, telefono, email, director_nombre, estado) VALUES
('CDA', 'Centro de Diseño y Manufactura', 'Bogotá', 'Bogotá', 'Calle 52 No. 13-65', '601-5461500', 'diseno@sena.edu.co', 'Carlos Andrés Rodríguez', TRUE),
('CGAO', 'Centro de Gestión Administrativa y Operativa', 'Bogotá', 'Bogotá', 'Carrera 13 No. 32-76', '601-5461600', 'gestion@sena.edu.co', 'María Fernanda López', TRUE),
('CEET', 'Centro de Electricidad, Electrónica y Telecomunicaciones', 'Bogotá', 'Bogotá', 'Av. Caracas No. 45-20', '601-5461700', 'electronica@sena.edu.co', 'Jorge Luis Martínez', TRUE),
('CMMA', 'Centro de Manufactura en Metalmecánica', 'Antioquia', 'Medellín', 'Calle 49 No. 48-60', '604-5134500', 'metalmecanica.antioquia@sena.edu.co', 'Ana María Gómez', TRUE),
('CCTI', 'Centro de Comercio y Turismo', 'Valle', 'Cali', 'Calle 15 No. 6-23', '602-6203400', 'comercio.valle@sena.edu.co', 'Roberto Sánchez', TRUE),
('CLEM', 'Centro Latinoamericano de Especies Menores', 'Santander', 'San Gil', 'Vereda El Zarzal', '607-7245600', 'especies.santander@sena.edu.co', 'Diana Patricia Ruiz', TRUE),
('CNSA', 'Centro Nacional del Sector Agropecuario', 'Cundinamarca', 'Mosquera', 'Km 7 Vía Bogotá-Mosquera', '601-4225800', 'agropecuario@sena.edu.co', 'Luis Eduardo Torres', TRUE);

-- ============================================================================
-- 2. CATEGORÍAS DE DOCUMENTOS
-- ============================================================================

INSERT INTO categorias_documento (nombre, descripcion, orden, estado) VALUES
('Identificación Personal', 'Documentos de identidad y datos personales', 1, TRUE),
('Información Financiera', 'Documentos bancarios y tributarios', 2, TRUE),
('Formación Académica', 'Certificados y títulos de estudio', 3, TRUE),
('Experiencia Laboral', 'Certificaciones de experiencia y hojas de vida', 4, TRUE),
('Certificaciones Especiales', 'Certificados específicos según el cargo', 5, TRUE),
('Documentos Legales', 'Documentos legales y judiciales', 6, TRUE),
('Documentos de Salud', 'Exámenes médicos y afiliaciones', 7, TRUE);

-- ============================================================================
-- 3. TIPOS DE DOCUMENTOS
-- ============================================================================

INSERT INTO tipo_documentos (categoria_documento_id, nombre, descripcion, codigo, instrucciones, es_obligatorio_default, estado) VALUES
-- Identificación Personal
(1, 'Cédula de Ciudadanía', 'Documento de identidad nacional', 'CC', 'Subir ambas caras de la cédula en formato PDF o imagen legible', TRUE, TRUE),
(1, 'Cédula de Extranjería', 'Documento de identidad para extranjeros', 'CE', 'Subir ambas caras del documento vigente', TRUE, TRUE),
(1, 'Pasaporte', 'Documento de viaje internacional', 'PP', 'Subir página principal con datos personales', FALSE, TRUE),

-- Información Financiera
(2, 'RUT', 'Registro Único Tributario', 'RUT', 'Documento actualizado de la DIAN, no mayor a 3 meses', TRUE, TRUE),
(2, 'Certificación Bancaria', 'Certificado de cuenta bancaria activa', 'CERT_BANC', 'Certificación no mayor a 30 días', TRUE, TRUE),

-- Formación Académica
(3, 'Diploma de Bachiller', 'Título de bachillerato', 'BACH', 'Copia del diploma o acta de grado', TRUE, TRUE),
(3, 'Título Profesional', 'Título universitario o técnico', 'TIT_PROF', 'Diploma profesional debidamente legalizado', FALSE, TRUE),
(3, 'Certificado de Estudios', 'Certificado de cursos o diplomados', 'CERT_ESTUD', 'Certificados de formación complementaria', FALSE, TRUE),

-- Experiencia Laboral
(4, 'Hoja de Vida', 'Currículum vitae formato estándar', 'HV', 'Formato de hoja de vida de la función pública', TRUE, TRUE),
(4, 'Certificado Laboral', 'Certificación de experiencia laboral', 'CERT_LAB', 'Certificaciones laborales que demuestren experiencia', FALSE, TRUE),

-- Certificaciones Especiales
(5, 'Certificado de Instructor SENA', 'Certificación como instructor del SENA', 'CERT_INST', 'Para instructores que ya hayan trabajado con el SENA', FALSE, TRUE),
(5, 'Tarjeta Profesional', 'Tarjeta profesional vigente', 'TAR_PROF', 'Requerida según profesión regulada', FALSE, TRUE),

-- Documentos Legales
(6, 'Certificado de Antecedentes Judiciales', 'Certificado de la Policía Nacional', 'ANT_JUD', 'No mayor a 3 meses', TRUE, TRUE),
(6, 'Certificado de Antecedentes Disciplinarios', 'Certificado de la Procuraduría', 'ANT_DISC', 'No mayor a 3 meses', TRUE, TRUE),
(6, 'Libreta Militar', 'Libreta militar para hombres', 'LIB_MIL', 'Aplica para hombres menores de 50 años', FALSE, TRUE),

-- Documentos de Salud
(7, 'Certificado de EPS', 'Certificado de afiliación a EPS', 'CERT_EPS', 'Certificación vigente de afiliación', TRUE, TRUE),
(7, 'Examen Médico Ocupacional', 'Examen médico de ingreso', 'EXAM_MED', 'Examen médico no mayor a 1 mes', FALSE, TRUE);

-- ============================================================================
-- 4. ROLES DEL SISTEMA
-- ============================================================================

INSERT INTO roles (nombre, descripcion, nivel_jerarquico, estado) VALUES
('Super Administrador', 'Administrador con acceso total al sistema', 1, TRUE),
('Administrador Regional', 'Administrador de una regional específica', 2, TRUE),
('Coordinador de Centro', 'Coordinador responsable de un centro de formación', 3, TRUE),
('Apoyo al Coordinador', 'Asistente del coordinador para revisión de documentos', 4, TRUE),
('Instructor', 'Instructor contratado o en proceso de contratación', 5, TRUE),
('Administrativo', 'Personal administrativo contratado', 5, TRUE),
('Usuario Básico', 'Usuario con permisos limitados', 6, TRUE);

-- ============================================================================
-- 5. PERMISOS DEL SISTEMA
-- ============================================================================

INSERT INTO permisos (nombre, descripcion, modulo, estado) VALUES
-- Módulo: Usuarios
('gestionar_usuarios', 'Crear, editar y eliminar usuarios del sistema', 'usuarios', TRUE),
('ver_usuarios', 'Ver listado de usuarios', 'usuarios', TRUE),
('asignar_roles', 'Asignar y cambiar roles de usuarios', 'usuarios', TRUE),

-- Módulo: Centros
('gestionar_centros', 'Gestionar información de centros', 'centros', TRUE),
('ver_centros', 'Ver información de centros', 'centros', TRUE),
('configurar_centro', 'Configurar parámetros de un centro', 'centros', TRUE),

-- Módulo: Convocatorias
('crear_convocatorias', 'Crear nuevas convocatorias', 'convocatorias', TRUE),
('editar_convocatorias', 'Modificar convocatorias existentes', 'convocatorias', TRUE),
('ver_convocatorias', 'Ver convocatorias', 'convocatorias', TRUE),
('publicar_convocatorias', 'Publicar convocatorias', 'convocatorias', TRUE),
('cerrar_convocatorias', 'Cerrar convocatorias', 'convocatorias', TRUE),

-- Módulo: Documentos
('cargar_documentos', 'Cargar documentos propios', 'documentos', TRUE),
('revisar_documentos', 'Revisar y validar documentos de otros usuarios', 'documentos', TRUE),
('aprobar_documentos', 'Aprobar documentos revisados', 'documentos', TRUE),
('rechazar_documentos', 'Rechazar documentos con observaciones', 'documentos', TRUE),
('ver_documentos_centro', 'Ver documentos de su centro', 'documentos', TRUE),
('ver_todos_documentos', 'Ver documentos de todos los centros', 'documentos', TRUE),
('configurar_documentos_requeridos', 'Configurar qué documentos son requeridos', 'documentos', TRUE),

-- Módulo: Contratos
('generar_contratos', 'Generar contratos para usuarios aprobados', 'contratos', TRUE),
('ver_contratos', 'Ver contratos generados', 'contratos', TRUE),
('firmar_contratos', 'Firmar contratos digitalmente', 'contratos', TRUE),

-- Módulo: Reportes
('ver_dashboard', 'Ver dashboard con estadísticas', 'reportes', TRUE),
('generar_reportes', 'Generar reportes del sistema', 'reportes', TRUE),
('exportar_datos', 'Exportar datos a Excel/PDF', 'reportes', TRUE),

-- Módulo: Roles y Permisos
('gestionar_roles', 'Crear y modificar roles', 'roles_permisos', TRUE),
('gestionar_permisos', 'Asignar permisos a roles', 'roles_permisos', TRUE),

-- Módulo: Configuración
('configurar_sistema', 'Configurar parámetros del sistema', 'configuracion', TRUE),
('ver_auditoria', 'Ver logs de auditoría', 'configuracion', TRUE),

-- Módulo: Notificaciones
('enviar_notificaciones', 'Enviar notificaciones masivas', 'notificaciones', TRUE),
('gestionar_notificaciones', 'Gestionar configuración de notificaciones', 'notificaciones', TRUE);

-- ============================================================================
-- 6. ASIGNACIÓN DE PERMISOS A ROLES
-- ============================================================================

-- Super Administrador: TODOS los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 1, id FROM permisos WHERE estado = TRUE;

-- Administrador Regional: Permisos amplios excepto gestión de sistema
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 2, id FROM permisos 
WHERE nombre IN (
    'gestionar_usuarios', 'ver_usuarios', 'asignar_roles',
    'ver_centros', 'configurar_centro',
    'crear_convocatorias', 'editar_convocatorias', 'ver_convocatorias', 'publicar_convocatorias', 'cerrar_convocatorias',
    'revisar_documentos', 'aprobar_documentos', 'rechazar_documentos', 'ver_todos_documentos', 'configurar_documentos_requeridos',
    'generar_contratos', 'ver_contratos', 'firmar_contratos',
    'ver_dashboard', 'generar_reportes', 'exportar_datos',
    'enviar_notificaciones', 'gestionar_notificaciones'
);

-- Coordinador de Centro
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 3, id FROM permisos 
WHERE nombre IN (
    'ver_usuarios',
    'ver_centros', 'configurar_centro',
    'ver_convocatorias',
    'revisar_documentos', 'aprobar_documentos', 'rechazar_documentos', 'ver_documentos_centro',
    'generar_contratos', 'ver_contratos',
    'ver_dashboard', 'generar_reportes', 'exportar_datos'
);

-- Apoyo al Coordinador
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 4, id FROM permisos 
WHERE nombre IN (
    'ver_usuarios',
    'ver_convocatorias',
    'revisar_documentos', 'ver_documentos_centro',
    'ver_contratos',
    'ver_dashboard'
);

-- Instructor
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 5, id FROM permisos 
WHERE nombre IN (
    'ver_convocatorias',
    'cargar_documentos',
    'ver_dashboard'
);

-- Administrativo
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 6, id FROM permisos 
WHERE nombre IN (
    'ver_convocatorias',
    'cargar_documentos',
    'ver_dashboard'
);

-- ============================================================================
-- 7. USUARIOS DE PRUEBA
-- ============================================================================

-- Contraseña para todos: Sena2024!
-- Hash bcrypt de "Sena2024!": $2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i

INSERT INTO usuarios (uuid, rol_id, tipo_documento_id, documento, nombres, apellidos, correo, telefono, direccion, contrasena, estado, verificado_acia) VALUES
(UUID(), 1, 1, '1234567890', 'Admin', 'Sistema', 'admin@preacia.sena.edu.co', '3001234567', 'Calle 100 #10-20', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE),
(UUID(), 2, 1, '9876543210', 'María Camila', 'Rodríguez González', 'maria.rodriguez@sena.edu.co', '3101234567', 'Carrera 50 #30-10', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE),
(UUID(), 3, 1, '1122334455', 'Carlos Andrés', 'Pérez Martínez', 'carlos.perez@sena.edu.co', '3201234567', 'Av. 80 #45-30', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE),
(UUID(), 4, 1, '5566778899', 'Laura Patricia', 'Gómez Sánchez', 'laura.gomez@sena.edu.co', '3301234567', 'Calle 70 #20-15', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE),
(UUID(), 5, 1, '7788990011', 'Juan David', 'Hernández López', 'juan.hernandez@gmail.com', '3401234567', 'Carrera 15 #80-50', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE),
(UUID(), 5, 1, '4455667788', 'Andrea Carolina', 'Moreno Torres', 'andrea.moreno@gmail.com', '3501234567', 'Calle 25 #40-60', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE),
(UUID(), 6, 1, '2233445566', 'Luis Fernando', 'Ramírez Castro', 'luis.ramirez@gmail.com', '3601234567', 'Av. 68 #100-20', '$2b$10$X7kJqVJ7ht5wJKGZGvXEYOPxVJ6yMqBE4RHFzYQOG3EeMKE4lMX8i', TRUE, TRUE);

-- ============================================================================
-- 8. ASIGNACIÓN DE USUARIOS A CENTROS
-- ============================================================================

INSERT INTO centro_usuario (centro_id, usuario_id, rol_en_centro, es_principal, activo) VALUES
-- Admin en todos los centros
(1, 1, 'super_admin', TRUE, TRUE),
(2, 1, 'super_admin', FALSE, TRUE),
(3, 1, 'super_admin', FALSE, TRUE),

-- Admin regional en Bogotá
(1, 2, 'admin_regional', TRUE, TRUE),
(2, 2, 'admin_regional', FALSE, TRUE),
(3, 2, 'admin_regional', FALSE, TRUE),

-- Coordinador Centro 1
(1, 3, 'coordinador', TRUE, TRUE),

-- Apoyo al coordinador Centro 1
(1, 4, 'apoyo_coordinador', TRUE, TRUE),

-- Instructores
(1, 5, 'instructor', TRUE, TRUE),
(2, 6, 'instructor', TRUE, TRUE),

-- Administrativo
(3, 7, 'administrativo', TRUE, TRUE);

-- ============================================================================
-- 9. TIPOS DE CONTRATOS
-- ============================================================================

INSERT INTO tipo_contratos (nombre, codigo, descripcion, duracion_meses_default, requiere_documentos_adicionales, estado) VALUES
('Contrato de Prestación de Servicios', 'CPS', 'Contrato por prestación de servicios profesionales', 6, TRUE, TRUE),
('Orden de Prestación de Servicios', 'OPS', 'Orden de prestación de servicios', 3, TRUE, TRUE),
('Contrato de Trabajo a Término Fijo', 'CTF', 'Contrato laboral a término fijo', 12, TRUE, TRUE),
('Contrato de Trabajo a Término Indefinido', 'CTI', 'Contrato laboral indefinido', NULL, TRUE, TRUE);

-- ============================================================================
-- 10. CONVOCATORIA DE EJEMPLO
-- ============================================================================

INSERT INTO convocatorias (uuid, codigo, nombre, descripcion, tipo_contratacion, alcance, centro_id, 
    fecha_publicacion, fecha_inicio, fecha_fin, fecha_cierre_definitivo, estado, numero_vacantes, created_by) 
VALUES
(UUID(), 'CONV-2024-001', 'Convocatoria Nacional Instructores Técnicos 2024-I', 
 'Convocatoria para la contratación de instructores técnicos en áreas de tecnología, manufactura y diseño', 
 'instructor', 'nacional', NULL,
 '2024-01-15 08:00:00', '2024-02-01 00:00:00', '2024-03-15 23:59:59', '2024-03-20 23:59:59',
 'activa', 150, 1),

(UUID(), 'CONV-2024-002', 'Convocatoria Personal Administrativo Centro Diseño', 
 'Convocatoria para personal administrativo del Centro de Diseño y Manufactura', 
 'administrativo', 'centro', 1,
 '2024-01-20 08:00:00', '2024-02-05 00:00:00', '2024-02-28 23:59:59', '2024-03-05 23:59:59',
 'activa', 10, 1);

-- ============================================================================
-- 11. DOCUMENTOS REQUERIDOS PARA CONVOCATORIAS
-- ============================================================================

-- Convocatoria 1: Instructores (documentos obligatorios)
INSERT INTO documentos_requeridos (convocatoria_id, tipo_documento_id, orden, es_obligatorio, 
    aplica_instructor, aplica_administrativo, tamanio_maximo_mb, formatos_permitidos, requiere_validacion_ia, activo) 
VALUES
-- Documentos básicos
(1, 1, 1, TRUE, TRUE, FALSE, 5, 'pdf,jpg,png', TRUE, TRUE),  -- Cédula
(1, 4, 2, TRUE, TRUE, FALSE, 2, 'pdf', TRUE, TRUE),  -- RUT
(1, 5, 3, TRUE, TRUE, FALSE, 2, 'pdf', TRUE, TRUE),  -- Certificación Bancaria
(1, 9, 4, TRUE, TRUE, FALSE, 10, 'pdf,docx', TRUE, TRUE),  -- Hoja de Vida

-- Formación académica
(1, 6, 5, TRUE, TRUE, FALSE, 5, 'pdf', TRUE, TRUE),  -- Diploma Bachiller
(1, 7, 6, FALSE, TRUE, FALSE, 5, 'pdf', TRUE, TRUE),  -- Título Profesional

-- Certificaciones y antecedentes
(1, 10, 7, FALSE, TRUE, FALSE, 5, 'pdf', FALSE, TRUE),  -- Certificado Laboral
(1, 13, 8, TRUE, TRUE, FALSE, 2, 'pdf', TRUE, TRUE),  -- Antecedentes Judiciales
(1, 14, 9, TRUE, TRUE, FALSE, 2, 'pdf', TRUE, TRUE),  -- Antecedentes Disciplinarios

-- Salud
(1, 16, 10, TRUE, TRUE, FALSE, 2, 'pdf', TRUE, TRUE);  -- Certificado EPS

-- Convocatoria 2: Administrativos
INSERT INTO documentos_requeridos (convocatoria_id, tipo_documento_id, orden, es_obligatorio, 
    aplica_instructor, aplica_administrativo, tamanio_maximo_mb, formatos_permitidos, requiere_validacion_ia, activo) 
VALUES
(2, 1, 1, TRUE, FALSE, TRUE, 5, 'pdf,jpg,png', TRUE, TRUE),  -- Cédula
(2, 4, 2, TRUE, FALSE, TRUE, 2, 'pdf', TRUE, TRUE),  -- RUT
(2, 5, 3, TRUE, FALSE, TRUE, 2, 'pdf', TRUE, TRUE),  -- Certificación Bancaria
(2, 9, 4, TRUE, FALSE, TRUE, 10, 'pdf,docx', TRUE, TRUE),  -- Hoja de Vida
(2, 7, 5, TRUE, FALSE, TRUE, 5, 'pdf', TRUE, TRUE),  -- Título Profesional
(2, 13, 6, TRUE, FALSE, TRUE, 2, 'pdf', TRUE, TRUE),  -- Antecedentes Judiciales
(2, 14, 7, TRUE, FALSE, TRUE, 2, 'pdf', TRUE, TRUE),  -- Antecedentes Disciplinarios
(2, 16, 8, TRUE, FALSE, TRUE, 2, 'pdf', TRUE, TRUE);  -- Certificado EPS

-- ============================================================================
-- 12. CONFIGURACIÓN DE CENTROS
-- ============================================================================

INSERT INTO configuracion_centro (centro_id, coordinador_principal_id, email_notificaciones, activo) VALUES
(1, 3, 'coordinador.diseno@sena.edu.co', TRUE),
(2, 3, 'coordinador.gestion@sena.edu.co', TRUE),
(3, 3, 'coordinador.electronica@sena.edu.co', TRUE);

-- ============================================================================
-- 13. PARÁMETROS DEL SISTEMA
-- ============================================================================

INSERT INTO parametros_sistema (clave, valor, tipo_dato, descripcion, categoria, editable) VALUES
('max_tamanio_archivo_mb', '10', 'integer', 'Tamaño máximo de archivo en MB', 'documentos', TRUE),
('formatos_permitidos_default', 'pdf,jpg,png,docx', 'string', 'Formatos de archivo permitidos por defecto', 'documentos', TRUE),
('dias_expiracion_token_password', '1', 'integer', 'Días de expiración del token de recuperación de contraseña', 'seguridad', TRUE),
('intentos_login_max', '3', 'integer', 'Intentos máximos de login antes de bloqueo', 'seguridad', TRUE),
('minutos_bloqueo_cuenta', '30', 'integer', 'Minutos de bloqueo tras intentos fallidos', 'seguridad', TRUE),
('horas_sesion_activa', '8', 'integer', 'Horas de duración de sesión activa', 'seguridad', TRUE),
('score_ia_minimo', '80', 'integer', 'Score mínimo de IA para aprobación automática', 'ia', TRUE),
('habilitar_validacion_ia', 'true', 'boolean', 'Habilitar o deshabilitar validación con IA', 'ia', TRUE),
('email_remitente_notificaciones', 'notificaciones@preacia.sena.edu.co', 'string', 'Email remitente para notificaciones', 'notificaciones', TRUE),
('dias_recordatorio_convocatoria', '7,3,1', 'string', 'Días antes del cierre para enviar recordatorios', 'notificaciones', TRUE),
('storage_type', 's3', 'string', 'Tipo de almacenamiento: local, s3, azure', 'almacenamiento', TRUE),
('aws_s3_bucket', 'preacia-documentos-prod', 'string', 'Bucket de S3 para almacenamiento', 'almacenamiento', TRUE),
('retention_auditoria_anios', '5', 'integer', 'Años de retención de logs de auditoría', 'auditoria', FALSE);

-- ============================================================================
-- 14. CONFIGURACIÓN DE NOTIFICACIONES PARA USUARIOS
-- ============================================================================

INSERT INTO configuracion_notificaciones_usuario (usuario_id, notif_email_documentos, notif_email_convocatorias, notif_email_recordatorios, notif_email_sistema) 
SELECT id, TRUE, TRUE, TRUE, TRUE FROM usuarios;

-- ============================================================================
-- 15. INICIALIZAR ESTADÍSTICAS DE CONVOCATORIAS
-- ============================================================================

INSERT INTO estadisticas_convocatoria (convocatoria_id, total_postulantes, total_documentos_cargados, 
    total_documentos_aprobados, total_documentos_rechazados, total_documentos_pendientes, 
    porcentaje_completitud_promedio, postulantes_completos, contratos_generados)
SELECT id, 0, 0, 0, 0, 0, 0.00, 0, 0 FROM convocatorias;

-- ============================================================================
-- FIN DE DATOS INICIALES
-- ============================================================================

/*
NOTAS SOBRE LOS DATOS DE PRUEBA:

1. USUARIOS:
   - Todos tienen la contraseña: Sena2024!
   - Email: admin@preacia.sena.edu.co / Contraseña: Sena2024!
   
2. CONVOCATORIAS:
   - CONV-2024-001: Convocatoria nacional activa para instructores
   - CONV-2024-002: Convocatoria específica de centro para administrativos
   
3. CENTROS:
   - 7 centros de ejemplo de diferentes regionales
   
4. PERMISOS:
   - Estructura RBAC completa con permisos granulares por módulo
   
5. PRÓXIMOS PASOS PARA PRUEBAS:
   - Cargar documentos de ejemplo para usuarios 5, 6, 7
   - Simular revisiones de documentos
   - Generar notificaciones
   - Crear contratos de ejemplo
*/
