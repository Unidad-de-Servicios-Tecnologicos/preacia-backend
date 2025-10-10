import Usuario from './usuario.model.js';
import Rol from './rol.model.js';
import Permiso from './permiso.model.js';
import UsuarioPermiso from './usuarioPermiso.model.js';
import RolPermiso from './rolPermiso.model.js';
import TipoDocumento from './tipoDocumento.model.js';
import Centro from './centro.model.js';
import CentroUsuario from './centroUsuario.model.js';



// Asociaciones
Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
  as: 'rol',
});

Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios',
});

// Asociación con TipoDocumento
Usuario.belongsTo(TipoDocumento, {
  foreignKey: 'tipo_documento_id',
  as: 'tipo_documento',
});

TipoDocumento.hasMany(Usuario, {
  foreignKey: 'tipo_documento_id',
  as: 'usuarios',
});

Usuario.belongsToMany(Permiso, {
  through: UsuarioPermiso,
  foreignKey: 'usuario_id',
  otherKey: 'permiso_id',
  as: 'permisos',
});

// Relaciones N:M
Permiso.belongsToMany(Rol, {
  through: RolPermiso,
  foreignKey: 'permiso_id',
  otherKey: 'rol_id',
  as: 'roles',
});

Rol.belongsToMany(Permiso, {
  through: RolPermiso,
  foreignKey: 'rol_id',
  otherKey: 'permiso_id',
  as: 'permisos',
});

Permiso.belongsToMany(Usuario, {
  through: UsuarioPermiso,
  foreignKey: 'permiso_id',
  otherKey: 'usuario_id',
  as: 'usuarios',
});

// Asociaciones entre Centros y Usuarios (N:M) mediante CentroUsuario
Usuario.belongsToMany(Centro, {
  through: CentroUsuario,
  foreignKey: 'usuario_id',
  otherKey: 'centro_id',
  as: 'centros',
});

Centro.belongsToMany(Usuario, {
  through: CentroUsuario,
  foreignKey: 'centro_id',
  otherKey: 'usuario_id',
  as: 'usuarios',
});


// Exportar todos los modelos
export {
  Usuario,
  Rol,
  Permiso,
  UsuarioPermiso,
  RolPermiso,
  TipoDocumento,
  Centro, 
  CentroUsuario
};