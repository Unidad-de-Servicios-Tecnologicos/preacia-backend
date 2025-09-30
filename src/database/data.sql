--datos para centros
INSERT INTO centros (nombre, direccion, estado) VALUES ('Centro 1', 'Direccion 1', TRUE);
INSERT INTO centros (nombre, direccion, estado) VALUES ('Centro 2', 'Direccion 2', TRUE);
INSERT INTO centros (nombre, direccion, estado) VALUES ('Centro 3', 'Direccion 3', TRUE);


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
INSERT INTO usuarios (nombre, email, password, estado) VALUES ('Administrador', 'admin@gmail.com', '123456', TRUE);
INSERT INTO usuarios (nombre, email, password, estado) VALUES ('Empleado', 'empleado@gmail.com', '123456', TRUE);
INSERT INTO usuarios (nombre, email, password, estado) VALUES ('Usuario', 'usuario@gmail.com', '123456', TRUE);

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



