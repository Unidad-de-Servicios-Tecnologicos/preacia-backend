-- datos para centros
INSERT INTO centros (codigo, nombre, direccion, estado) VALUES ('C01','Centro 1', 'Direccion 1', TRUE);
INSERT INTO centros (codigo, nombre, direccion, estado) VALUES ('C02','Centro 2', 'Direccion 2', TRUE);
INSERT INTO centros (codigo, nombre, direccion, estado) VALUES ('C03','Centro 3', 'Direccion 3', TRUE);

-- datos para tipo de documentos
INSERT INTO tipo_documentos (nombre, estado) VALUES ('DNI', TRUE);
INSERT INTO tipo_documentos (nombre, estado) VALUES ('Pasaporte', TRUE);
INSERT INTO tipo_documentos (nombre, estado) VALUES ('Carnet de Extranjería', TRUE);

-- datos para roles
INSERT INTO roles (nombre, descripcion, estado) VALUES ('Administrador', 'Administrador del sistema', TRUE);
INSERT INTO roles (nombre, descripcion, estado) VALUES ('Empleado', 'Empleado del sistema', TRUE);
INSERT INTO roles (nombre, descripcion, estado) VALUES ('Usuario', 'Usuario del sistema', TRUE);
INSERT INTO roles (nombre, descripcion, estado) VALUES ('Usuario', 'Usuario del sistema', TRUE);
INSERT INTO roles (nombre, descripcion, estado) VALUES ('Usuario', 'Usuario del sistema', TRUE);

-- datos para permisos
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('gestionar_usuarios', 'Permiso para crear usuarios', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('gestionar_roles', 'Permiso para gestionar roles', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('gestionar_permisos', 'Permiso para gestionar permisos', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('gestionar_centros', 'Permiso para gestionar centros', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('gestionar_tipo_documentos', 'Permiso para gestionar tipos de documentos', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('gestionar_cuenta', 'Permiso para gestionar cuenta', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('ver_dashboard', 'Permiso para ver información global', TRUE);

-- datos para usuarios
INSERT INTO usuarios (rol_id, tipo_documento_id, documento, nombres, apellidos, correo, telefono, direccion, contrasena, estado) VALUES (1, 1, '1000233255', 'esneider', 'moreno', 'esnedier@emai.com', '31144633456', 'cl 34 # 45 -44', '123456', TRUE);
INSERT INTO usuarios (rol_id, tipo_documento_id, documento, nombres, apellidos, correo, telefono, direccion, contrasena, estado) VALUES (2, 1, '1435345345', 'julian', 'londoño', 'julian@gemai.com', '31144633456', 'cl 34 # 45 -44', '123456', TRUE);
INSERT INTO usuarios (rol_id, tipo_documento_id, documento, nombres, apellidos, correo, telefono, direccion, contrasena, estado) VALUES (3, 1, '1345345342', 'gilbran', 'molina', 'gilbran@emai.com', '31144633456', 'cl 34 # 45 -44', '123456', TRUE);

-- datos para rol_permiso
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 1);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 2);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 3);

-- datos para usuario_permiso
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 1);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 2);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 3);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 4);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 5);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 6);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 7);

-- datos para centro_usuario
INSERT INTO centro_usuario (centro_id, usuario_id) VALUES (1, 1);
INSERT INTO centro_usuario (centro_id, usuario_id) VALUES (1, 2);
INSERT INTO centro_usuario (centro_id, usuario_id) VALUES (1, 3);



