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

-- datos para permisos
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('Crear Usuario', 'Permiso para crear usuarios', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('Editar Usuario', 'Permiso para editar usuarios', TRUE);
INSERT INTO permisos (nombre, descripcion, estado) VALUES ('Eliminar Usuario', 'Permiso para eliminar usuarios', TRUE);

-- datos para usuarios
INSERT INTO usuarios (nombre, tipo_documento_id, numero_documento, correo, contrasena, estado) VALUES ('Administrador', '1', '1000233255', 'admin@gmail.com', '123456', TRUE);
INSERT INTO usuarios (nombre, tipo_documento_id, numero_documento, correo, contrasena, estado) VALUES ('Empleado', '2', '43655255', 'empleado@gmail.com', '123456', TRUE);
INSERT INTO usuarios (nombre, tipo_documento_id, numero_documento, correo, contrasena, estado) VALUES ('Usuario', '3','1023333444', 'usuario@gmail.com', '123456', TRUE);

-- datos para rol_permiso
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 1);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 2);
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES (1, 3);

-- datos para usuario_permiso
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 1);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 2);
INSERT INTO usuario_permiso (usuario_id, permiso_id) VALUES (1, 3);

-- datos para centro_usuario
INSERT INTO centro_usuario (centro_id, usuario_id) VALUES (1, 1);
INSERT INTO centro_usuario (centro_id, usuario_id) VALUES (1, 2);
INSERT INTO centro_usuario (centro_id, usuario_id) VALUES (1, 3);



