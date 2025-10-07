# 📦 ORDEN DE DESARROLLO POR MÓDULOS
## Sistema Nacional de Gestión de Listas de Chequeo SENA

**Fecha**: Octubre 2025  
**Objetivo**: Secuencia lógica de desarrollo basada en dependencias técnicas

---

## 🎯 PRINCIPIO FUNDAMENTAL

**Desarrollar de adentro hacia afuera**:
1. Base de datos primero
2. Módulos sin dependencias
3. Módulos que dependen de otros
4. Integraciones y funcionalidades avanzadas

---

## 📊 FASE 1: FUNDAMENTOS (Semana 1-2)

### **MÓDULO 1: Base de Datos**
**Prioridad**: CRÍTICA  
**Dependencias**: Ninguna  
**Tiempo estimado**: 2-3 días

**Tareas**:
1. Ejecutar script `database_v3_sena.sql`
2. Crear base de datos `preacia_sena`
3. Verificar todas las tablas creadas
4. Verificar foreign keys y restricciones
5. Validar índices

**Resultado esperado**:
- ✅ Base de datos funcionando
- ✅ Todas las 16 tablas creadas
- ✅ Relaciones intactas

---

### **MÓDULO 2: Configuración del Proyecto Backend**
**Prioridad**: CRÍTICA  
**Dependencias**: Ninguna  
**Tiempo estimado**: 2 días

**Tareas**:
1. Inicializar proyecto Node.js
2. Instalar dependencias (Express, Sequelize, MySQL2, JWT, Bcrypt, etc.)
3. Configurar estructura de carpetas MVC
4. Configurar variables de entorno (.env)
5. Configurar conexión a base de datos
6. Setup de ESLint y Prettier

**Resultado esperado**:
- ✅ Servidor Express corriendo
- ✅ Conexión a BD exitosa
- ✅ Estructura de proyecto clara

---

### **MÓDULO 3: Modelos Sequelize (Sin Relaciones Complejas)**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 1, 2  
**Tiempo estimado**: 3-4 días

**Orden de creación de modelos**:

**3.1. Modelos Básicos (sin FK complejas)**:
1. `TipoDocumento` (tabla: tipo_documentos)
2. `Regional` (tabla: regionales)

**3.2. Modelos que dependen de básicos**:
3. `Centro` (depende de: Regional)
4. `Rol` (tabla: roles)
5. `Permiso` (tabla: permisos)

**3.3. Modelos de usuarios**:
6. `Usuario` (depende de: Rol, TipoDocumento, Regional, Centro)
7. `Contratista` (depende de: TipoDocumento, Centro)

**3.4. Modelos de gestión**:
8. `Vigencia` (tabla: vigencias)
9. `ListaChequeo` (tabla: lista_chequeo)
10. `VigenciaListaChequeo` (depende de: Vigencia, ListaChequeo)

**3.5. Modelos de operación**:
11. `Documento` (depende de: Centro, Vigencia, ListaChequeo)
12. `Revision` (depende de: Documento, Usuario, Centro)

**3.6. Modelos auxiliares**:
13. `PermisoEspecialCarga` (depende de: Vigencia, Centro, Usuario)
14. `Auditoria` (depende de: Usuario, Centro)
15. `SesionInstructor` (tabla: sesiones_instructores)

**3.7. Tablas pivote**:
16. `RolPermiso` (depende de: Rol, Permiso)
17. `UsuarioPermiso` (depende de: Usuario, Permiso)
18. `UsuarioCentro` (depende de: Usuario, Centro)

**Configuraciones importantes**:
- ✅ `paranoid: false` en todos
- ✅ `defaultScope: { where: { activo: true } }` donde aplique
- ✅ Scopes adicionales (inactivos, todos)

**Resultado esperado**:
- ✅ Todos los modelos creados
- ✅ Relaciones configuradas
- ✅ Validaciones básicas

---

### **MÓDULO 4: Seeders de Datos Iniciales**
**Prioridad**: ALTA  
**Dependencias**: Módulo 3  
**Tiempo estimado**: 2 días

**Orden de carga de datos**:

**4.1. Datos maestros**:
1. Tipos de documento (CC, CE, NIT)
2. Roles (admin, director_regional, administrador_centro, revisor)
3. Permisos base del sistema

**4.2. Estructura organizacional**:
4. Regionales (33 regionales SENA)
5. Centros por regional (principales)

**4.3. Usuario administrador inicial**:
6. Admin Nacional (usuario root del sistema)
7. Asignar todos los permisos al admin

**4.4. Lista de chequeo base**:
8. Items de documentos precontractuales estándar (10-15 items)

**Resultado esperado**:
- ✅ Base de datos poblada con datos iniciales
- ✅ Admin Nacional funcional
- ✅ Estructura SENA cargada

---

## 🔐 FASE 2: AUTENTICACIÓN Y SEGURIDAD (Semana 3-4)

### **MÓDULO 5: Sistema de Autenticación JWT**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 3  
**Tiempo estimado**: 3 días

**Componentes**:
1. Servicio de autenticación (login, logout, refresh token)
2. Middleware de verificación JWT
3. Helpers de generación de tokens
4. Manejo de intentos fallidos y bloqueo temporal

**Endpoints**:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/reset-password`

**Resultado esperado**:
- ✅ Login funcional con JWT
- ✅ Tokens con payload completo (user_id, rol, centro_id, regional_id)
- ✅ Protección de rutas

---

### **MÓDULO 6: Sistema RBAC (Control de Acceso)**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 5  
**Tiempo estimado**: 3 días

**Componentes**:
1. Middleware de autorización por rol
2. Middleware de verificación de permisos
3. Middleware de scope (regional/centro)
4. Helper para verificar permisos efectivos (rol + usuario)

**Funcionalidades**:
- Verificar si usuario tiene permiso específico
- Verificar si usuario tiene acceso a centro/regional
- Verificar alcance según rol (nacional, regional, centro)

**Resultado esperado**:
- ✅ Protección de rutas por rol
- ✅ Protección por permisos específicos
- ✅ Validación de scope regional/centro

---

### **MÓDULO 7: Gestión de Usuarios Administrativos**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 5, 6  
**Tiempo estimado**: 3 días

**Endpoints**:
- `POST /api/v1/usuarios` - Crear usuario
- `GET /api/v1/usuarios` - Listar con filtros
- `GET /api/v1/usuarios/:id` - Ver detalle
- `PUT /api/v1/usuarios/:id` - Actualizar
- `PUT /api/v1/usuarios/:id/estado` - Activar/desactivar
- `PUT /api/v1/usuarios/:id/password` - Cambiar contraseña
- `POST /api/v1/usuarios/:id/centros` - Asignar centros
- `DELETE /api/v1/usuarios/:id/centros/:centroId` - Quitar centro

**Validaciones importantes**:
- Solo admin nacional puede crear directores regionales
- Director regional solo crea en su regional
- Admin centro solo crea en su centro
- Validar alcance según rol

**Resultado esperado**:
- ✅ CRUD completo de usuarios administrativos
- ✅ Validaciones de permisos
- ✅ Gestión multi-centro

---

## 🏢 FASE 3: ESTRUCTURA ORGANIZACIONAL (Semana 3-4)

### **MÓDULO 8: Gestión de Regionales**
**Prioridad**: ALTA  
**Dependencias**: Módulo 6  
**Tiempo estimado**: 1 día

**Endpoints**:
- `GET /api/v1/regionales` - Listar (todos los roles)
- `POST /api/v1/regionales` - Crear (solo admin nacional)
- `PUT /api/v1/regionales/:id` - Actualizar (solo admin nacional)
- `PUT /api/v1/regionales/:id/estado` - Activar/desactivar (solo admin nacional)

**Resultado esperado**:
- ✅ Gestión completa de regionales
- ✅ Solo admin nacional puede modificar

---

### **MÓDULO 9: Gestión de Centros**
**Prioridad**: ALTA  
**Dependencias**: Módulo 8  
**Tiempo estimado**: 2 días

**Endpoints**:
- `GET /api/v1/centros` - Listar con filtros
- `GET /api/v1/centros/:id` - Ver detalle
- `POST /api/v1/centros` - Crear
- `PUT /api/v1/centros/:id` - Actualizar
- `PUT /api/v1/centros/:id/estado` - Activar/desactivar

**Validaciones por rol**:
- Admin Nacional: CRUD en todos los centros
- Director Regional: CRUD solo en centros de su regional
- Otros roles: Solo lectura

**Resultado esperado**:
- ✅ Gestión completa de centros
- ✅ Validación de alcance regional

---

### **MÓDULO 10: Gestión de Roles y Permisos**
**Prioridad**: MEDIA  
**Dependencias**: Módulo 6  
**Tiempo estimado**: 2 días

**Endpoints**:
- `GET /api/v1/roles` - Listar roles
- `GET /api/v1/permisos` - Listar permisos
- `POST /api/v1/roles/:id/permisos` - Asignar permisos a rol
- `DELETE /api/v1/roles/:id/permisos/:permisoId` - Quitar permiso
- `POST /api/v1/usuarios/:id/permisos` - Asignar permiso especial
- `GET /api/v1/usuarios/:id/permisos` - Ver permisos efectivos

**Resultado esperado**:
- ✅ Gestión flexible de permisos
- ✅ Permisos por rol y por usuario

---

## 📅 FASE 4: VIGENCIAS Y CONFIGURACIÓN (Semana 5)

### **MÓDULO 11: Gestión de Vigencias**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 6  
**Tiempo estimado**: 3 días

**Endpoints**:
- `POST /api/v1/vigencias` - Crear vigencia (solo admin nacional)
- `GET /api/v1/vigencias` - Listar con filtros
- `GET /api/v1/vigencias/:id` - Ver detalle
- `PUT /api/v1/vigencias/:id` - Actualizar
- `PUT /api/v1/vigencias/:id/estado` - Cambiar estado (pendiente/activa/cerrada)
- `GET /api/v1/vigencias/activas` - Solo vigencias activas

**Funcionalidades**:
- Validar que fecha_fin > fecha_inicio
- Transición automática de estados según fechas
- Notificaciones de cambio de estado

**Resultado esperado**:
- ✅ Gestión completa de vigencias
- ✅ Control de estados
- ✅ Validaciones de fechas

---

### **MÓDULO 12: Lista de Chequeo Dinámica**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 11  
**Tiempo estimado**: 3 días

**Endpoints**:
- `POST /api/v1/lista-chequeo` - Crear item (solo admin nacional)
- `GET /api/v1/lista-chequeo` - Listar items
- `GET /api/v1/lista-chequeo/:id` - Ver detalle
- `PUT /api/v1/lista-chequeo/:id` - Actualizar item
- `PUT /api/v1/lista-chequeo/:id/estado` - Activar/desactivar
- `PUT /api/v1/lista-chequeo/reordenar` - Cambiar orden de items

**Asignación a vigencias**:
- `POST /api/v1/vigencias/:id/items` - Asignar items a vigencia
- `GET /api/v1/vigencias/:id/items` - Ver items de vigencia
- `PUT /api/v1/vigencias/:id/items/:itemId/estado` - Activar/desactivar item en vigencia

**Resultado esperado**:
- ✅ Catálogo nacional de documentos
- ✅ Configuración por vigencia
- ✅ Reordenamiento de items

---

### **MÓDULO 13: Permisos Especiales de Carga**
**Prioridad**: ALTA  
**Dependencias**: Módulo 11  
**Tiempo estimado**: 2 días

**Endpoints**:
- `POST /api/v1/permisos-especiales/individual` - Permiso para un contratista
- `POST /api/v1/permisos-especiales/masivo` - Permiso para todo el centro
- `GET /api/v1/permisos-especiales` - Listar permisos activos
- `GET /api/v1/permisos-especiales/:id` - Ver detalle
- `PUT /api/v1/permisos-especiales/:id/revocar` - Revocar permiso

**Validaciones**:
- Admin Centro: solo permisos en su centro
- Director Regional: permisos en centros de su regional
- Admin Nacional: permisos en cualquier centro

**Resultado esperado**:
- ✅ Sistema de excepciones para cargar fuera de fechas
- ✅ Permisos individuales y masivos
- ✅ Sistema de revocación

---

## 👥 FASE 5: CONTRATISTAS Y VERIFICACIÓN (Semana 6)

### **MÓDULO 14: API Mock de ACIA (Para Desarrollo)**
**Prioridad**: ALTA  
**Dependencias**: Ninguna  
**Tiempo estimado**: 1 día

**Endpoints Mock**:
- `GET /api/mock/acia/verificar/:documento` - Simular consulta ACIA

**Funcionalidades**:
- Retornar datos simulados (encontrado/no encontrado)
- Simular timeouts aleatorios
- Simular errores (500, timeout)
- Base de datos local de documentos de prueba

**Resultado esperado**:
- ✅ Mock funcional para desarrollo
- ✅ Documentado cómo reemplazar con API real

---

### **MÓDULO 15: Verificación y Registro de Contratistas**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 14  
**Tiempo estimado**: 3 días

**Endpoints**:
- `POST /api/v1/contratistas/verificar` - Verificar en ACIA
- `POST /api/v1/contratistas/registrar` - Registro manual (si no en ACIA)
- `GET /api/v1/contratistas/:documento` - Ver datos de contratista
- `PUT /api/v1/contratistas/:documento` - Actualizar datos

**Flujo**:
1. Usuario ingresa documento
2. Sistema consulta ACIA
3. Si encontrado: crear/actualizar registro local automáticamente
4. Si NO encontrado: mostrar formulario de registro
5. Crear registro local marcado como no encontrado en ACIA

**Resultado esperado**:
- ✅ Verificación en ACIA funcional
- ✅ Registro local de contratistas
- ✅ Manejo de errores de ACIA

---

### **MÓDULO 16: Sesiones Temporales de Contratistas**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 15  
**Tiempo estimado**: 2 días

**Endpoints**:
- `POST /api/v1/sesiones-contratistas/crear` - Crear sesión temporal
- `GET /api/v1/sesiones-contratistas/validar` - Validar sesión
- `POST /api/v1/sesiones-contratistas/cerrar` - Cerrar sesión manualmente

**Funcionalidades**:
- Generar token único de sesión
- Sesión válida por 2 horas
- Auto-expiración de sesiones
- Limpiar sesiones expiradas (cron job)

**Middleware**:
- Validar sesión en rutas de carga de documentos
- Validar que sesión no esté expirada

**Resultado esperado**:
- ✅ Sistema de sesiones sin login
- ✅ Tokens temporales funcionando
- ✅ Limpieza automática

---

## 📄 FASE 6: GESTIÓN DE DOCUMENTOS (Semana 7-8)

### **MÓDULO 17: Sistema de Almacenamiento de Archivos**
**Prioridad**: CRÍTICA  
**Dependencias**: Ninguna (independiente)  
**Tiempo estimado**: 3 días

**Configuraciones**:
1. Storage local (filesystem)
2. Preparar interfaz para S3 (futuro)

**Funcionalidades**:
- Subir archivo al storage
- Descargar archivo del storage
- Eliminar archivo del storage
- Validar tipo de archivo (PDF, DOCX, JPG, PNG)
- Validar tamaño máximo
- Generar nombre único de archivo
- Organizar archivos por: centro/vigencia/documento

**Resultado esperado**:
- ✅ Storage local funcionando
- ✅ Validaciones de archivos
- ✅ Interfaz para futuro S3

---

### **MÓDULO 18: Carga de Documentos por Contratistas**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 12, 13, 16, 17  
**Tiempo estimado**: 4 días

**Endpoints**:
- `POST /api/v1/documentos` - Cargar documento
- `GET /api/v1/documentos/mis-documentos` - Ver mis documentos (por sesión)
- `GET /api/v1/documentos/:id` - Ver detalle de documento
- `PUT /api/v1/documentos/:id` - Reemplazar documento (nueva versión)
- `GET /api/v1/documentos/:id/descargar` - Descargar archivo

**Validaciones críticas**:
1. Verificar que vigencia esté activa O exista permiso especial
2. Validar que item de lista de chequeo esté activo
3. No permitir duplicados (mismo numero_documento + vigencia + item)
4. Validar formato y tamaño de archivo
5. Asociar a numero_documento (no a usuario_id)

**Funcionalidades**:
- Subir archivo al storage
- Crear registro en BD con metadata
- Si ya existe documento: crear nueva versión
- Mantener histórico de versiones

**Resultado esperado**:
- ✅ Carga de documentos funcional
- ✅ Validaciones de vigencia y permisos
- ✅ Control de versiones

---

### **MÓDULO 19: Envío a Revisión**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 18  
**Tiempo estimado**: 2 días

**Endpoints**:
- `PUT /api/v1/documentos/enviar-revision` - Enviar todos a revisión
- `GET /api/v1/documentos/progreso` - Ver progreso de carga

**Validaciones**:
- Verificar que todos los documentos obligatorios estén cargados
- No permitir envío si faltan documentos obligatorios
- Cambiar estado de todos a "en_revision"
- Registrar fecha de envío

**Notificaciones**:
- Email a revisores del centro
- Notificación en sistema

**Resultado esperado**:
- ✅ Envío masivo a revisión
- ✅ Validación de documentos completos
- ✅ Notificaciones

---

## ✅ FASE 7: REVISIÓN Y APROBACIÓN (Semana 8-9)

### **MÓDULO 20: Panel de Revisión**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 18  
**Tiempo estimado**: 4 días

**Endpoints**:
- `GET /api/v1/revisiones/pendientes` - Cola de documentos pendientes
- `GET /api/v1/revisiones/mis-asignados` - Documentos asignados a mí
- `POST /api/v1/revisiones/aprobar/:documentoId` - Aprobar documento
- `POST /api/v1/revisiones/rechazar/:documentoId` - Rechazar con observaciones
- `GET /api/v1/revisiones/historial/:documentoId` - Historial de revisiones

**Filtros importantes**:
- Por centro (según rol del revisor)
- Por vigencia
- Por estado
- Por fecha de envío
- Por contratista

**Funcionalidades**:
- Visualizar documento (descargar o iframe)
- Aprobar documento
- Rechazar documento con comentarios obligatorios
- Registrar tiempo de revisión
- Notificar a contratista

**Validaciones por rol**:
- Revisor: solo documentos de sus centros asignados
- Admin Centro: documentos de su centro
- Director Regional: documentos de centros de su regional
- Admin Nacional: todos los documentos

**Resultado esperado**:
- ✅ Cola de revisión funcional
- ✅ Aprobar/rechazar documentos
- ✅ Historial de revisiones
- ✅ Notificaciones

---

### **MÓDULO 21: Re-carga de Documentos Rechazados**
**Prioridad**: ALTA  
**Dependencias**: Módulo 20  
**Tiempo estimado**: 2 días

**Funcionalidades**:
- Contratista ve observaciones de rechazo
- Puede recargar documento rechazado
- Se crea nueva versión
- Estado vuelve a "pendiente" o "en_revision"
- Se mantiene historial de todas las versiones

**Resultado esperado**:
- ✅ Ciclo de rechazo-recarga funcional
- ✅ Versiones múltiples
- ✅ Historial completo

---

## 📊 FASE 8: REPORTES Y DASHBOARDS (Semana 10-11)

### **MÓDULO 22: Estadísticas y Métricas**
**Prioridad**: ALTA  
**Dependencias**: Módulo 18, 20  
**Tiempo estimado**: 3 días

**Endpoints por rol**:

**Admin Nacional**:
- `GET /api/v1/estadisticas/nacional` - Dashboard nacional
  - Total documentos por estado
  - Documentos por regional
  - Documentos por vigencia
  - Tasa de aprobación/rechazo
  - Tiempo promedio de revisión

**Director Regional**:
- `GET /api/v1/estadisticas/regional/:regionalId` - Dashboard regional
  - Documentos por centro
  - Tasa de aprobación por centro
  - Contratistas activos por centro

**Admin Centro / Revisor**:
- `GET /api/v1/estadisticas/centro/:centroId` - Dashboard de centro
  - Total documentos en revisión
  - Documentos pendientes
  - Documentos aprobados/rechazados
  - Contratistas con documentación completa

**Resultado esperado**:
- ✅ APIs de estadísticas por rol
- ✅ Métricas en tiempo real

---

### **MÓDULO 23: Exportación de Reportes**
**Prioridad**: MEDIA  
**Dependencias**: Módulo 22  
**Tiempo estimado**: 3 días

**Endpoints**:
- `GET /api/v1/reportes/documentos/excel` - Exportar documentos
- `GET /api/v1/reportes/contratistas/excel` - Exportar contratistas
- `GET /api/v1/reportes/revisiones/excel` - Exportar revisiones

**Filtros**:
- Rango de fechas
- Centro
- Vigencia
- Estado
- Regional (según rol)

**Formatos**:
- Excel (.xlsx)
- PDF (opcional)

**Resultado esperado**:
- ✅ Exportación a Excel funcional
- ✅ Filtros avanzados
- ✅ Validación de permisos

---

## 🔔 FASE 9: NOTIFICACIONES Y AUDITORÍA (Semana 11)

### **MÓDULO 24: Sistema de Notificaciones por Email**
**Prioridad**: MEDIA  
**Dependencias**: Varios módulos  
**Tiempo estimado**: 3 días

**Configuración**:
- Servicio de emails (Nodemailer)
- Templates de emails HTML

**Tipos de notificaciones**:
1. Bienvenida a usuario administrativo creado
2. Documentos enviados a revisión (a revisores)
3. Documento aprobado (a contratista)
4. Documento rechazado con observaciones (a contratista)
5. Permiso especial otorgado (a contratista)
6. Vigencia próxima a cerrar (a contratistas y admins)
7. Reset de contraseña

**Resultado esperado**:
- ✅ Emails funcionando
- ✅ Templates profesionales
- ✅ Queue de emails (opcional)

---

### **MÓDULO 25: Sistema de Auditoría**
**Prioridad**: MEDIA  
**Dependencias**: Todos los módulos anteriores  
**Tiempo estimado**: 2 días

**Funcionalidades**:
- Middleware de auditoría automática
- Registrar acciones críticas:
  - Login/logout
  - Crear/modificar usuarios
  - Aprobar/rechazar documentos
  - Cambiar estados
  - Otorgar permisos especiales

**Endpoints**:
- `GET /api/v1/auditoria` - Ver logs (solo admin)
- `GET /api/v1/auditoria/usuario/:id` - Logs de usuario específico
- `GET /api/v1/auditoria/entidad/:tipo/:id` - Logs de entidad específica

**Resultado esperado**:
- ✅ Auditoría automática funcionando
- ✅ Consulta de logs
- ✅ Trazabilidad completa

---

## 🎨 FASE 10: FRONTEND (Semana 5-11 en paralelo)

### **MÓDULO 26: Configuración Frontend**
**Prioridad**: CRÍTICA  
**Dependencias**: Ninguna  
**Tiempo estimado**: 2 días  
**Paralelizable con**: Fase 2

**Tareas**:
1. Setup proyecto React (Create React App o Vite)
2. Configurar TailwindCSS
3. Estructura de carpetas
4. Configurar React Router
5. Configurar Axios (interceptors)

---

### **MÓDULO 27: Sistema de Diseño**
**Prioridad**: ALTA  
**Dependencias**: Módulo 26  
**Tiempo estimado**: 3 días  
**Paralelizable con**: Fase 2

**Componentes básicos**:
- Button, Input, Select, Checkbox, Radio
- Card, Modal, Alert, Toast
- Table, Pagination
- Loader, Spinner
- Badge, Tag
- FileUpload (drag & drop)

**Paleta de colores SENA**:
- Verde principal
- Naranja secundario
- Grises, blancos

---

### **MÓDULO 28: Layouts y Navegación**
**Prioridad**: ALTA  
**Dependencias**: Módulo 27  
**Tiempo estimado**: 2 días  
**Paralelizable con**: Fase 2

**Layouts**:
- Layout público (sin autenticación)
- Layout administrativo (con sidebar)
- Sidebar dinámico según rol

---

### **MÓDULO 29: Autenticación Frontend**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 5 (Backend), 28  
**Tiempo estimado**: 3 días

**Pantallas**:
- Login
- Selección de centro (si tiene múltiples)
- Gestión de sesión (localStorage/sessionStorage)
- Interceptor Axios para incluir JWT
- Manejo de token expirado (refresh)

---

### **MÓDULO 30: Dashboards Administrativos**
**Prioridad**: ALTA  
**Dependencias**: Módulo 22 (Backend), 29  
**Tiempo estimado**: 5 días

**Dashboards por rol**:
1. Dashboard Admin Nacional
2. Dashboard Director Regional
3. Dashboard Admin Centro
4. Dashboard Revisor

**Elementos**:
- KPIs principales
- Gráficos (barras, línea, pie)
- Tablas de resumen
- Accesos rápidos

---

### **MÓDULO 31: Gestión de Usuarios (Frontend)**
**Prioridad**: ALTA  
**Dependencias**: Módulo 7 (Backend), 29  
**Tiempo estimado**: 4 días

**Pantallas**:
- Listado de usuarios con filtros
- Formulario crear/editar usuario
- Asignación de centros
- Cambio de estado (activar/desactivar)
- Cambio de rol

---

### **MÓDULO 32: Portal Público de Contratistas**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 15, 16, 18 (Backend)  
**Tiempo estimado**: 5 días

**Pantallas**:
1. Ingreso de documento (verificación)
2. Formulario de registro (si no en ACIA)
3. Dashboard de contratista (sin login)
4. Lista de chequeo con progreso
5. Interfaz de carga de documentos (drag & drop)
6. Vista de documentos cargados
7. Vista de observaciones de rechazo
8. Re-carga de documentos

---

### **MÓDULO 33: Panel de Revisión (Frontend)**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 20 (Backend), 29  
**Tiempo estimado**: 5 días

**Pantallas**:
- Cola de documentos pendientes
- Filtros avanzados
- Visualizador de documentos
- Formulario de aprobación
- Formulario de rechazo con observaciones
- Historial de revisiones

---

### **MÓDULO 34: Gestión de Vigencias (Frontend)**
**Prioridad**: ALTA  
**Dependencias**: Módulo 11, 12 (Backend), 29  
**Tiempo estimado**: 4 días

**Pantallas**:
- Listado de vigencias
- Formulario crear/editar vigencia
- Calendario de vigencias
- Asignación de lista de chequeo
- Gestión de permisos especiales

---

### **MÓDULO 35: Reportes (Frontend)**
**Prioridad**: MEDIA  
**Dependencias**: Módulo 22, 23 (Backend), 29  
**Tiempo estimado**: 3 días

**Pantallas**:
- Generador de reportes con filtros
- Vista previa de datos
- Botón de exportar
- Gráficos interactivos

---

## 🧪 FASE 11: TESTING Y DESPLIEGUE (Semana 12)

### **MÓDULO 36: Testing Integral**
**Prioridad**: CRÍTICA  
**Dependencias**: Todos los módulos anteriores  
**Tiempo estimado**: 3 días

**Tipos de testing**:
1. Testing funcional (todos los flujos)
2. Testing de integración
3. Testing de permisos (RBAC)
4. Testing de rendimiento
5. Testing de seguridad básico

---

### **MÓDULO 37: Documentación Final**
**Prioridad**: ALTA  
**Dependencias**: Todos los módulos  
**Tiempo estimado**: 2 días

**Documentos**:
1. Swagger/OpenAPI actualizado
2. Manual de usuario
3. Manual de administrador
4. Guía de despliegue

---

### **MÓDULO 38: Despliegue a Producción**
**Prioridad**: CRÍTICA  
**Dependencias**: Módulo 36, 37  
**Tiempo estimado**: 2 días

**Pasos**:
1. Configurar servidor
2. Configurar base de datos
3. Desplegar backend
4. Desplegar frontend
5. Configurar SSL/HTTPS
6. Configurar backups
7. Testing en producción

---

## 📋 RESUMEN DE DEPENDENCIAS CRÍTICAS

### **Módulos Base (Desarrollar PRIMERO)**:
1. ✅ Base de Datos (1)
2. ✅ Configuración Backend (2)
3. ✅ Modelos Sequelize (3)
4. ✅ Seeders (4)

### **Módulos de Seguridad (Desarrollar SEGUNDO)**:
5. ✅ Autenticación JWT (5)
6. ✅ Sistema RBAC (6)
7. ✅ Gestión Usuarios (7)

### **Módulos de Estructura (Desarrollar TERCERO)**:
8. ✅ Regionales (8)
9. ✅ Centros (9)
10. ✅ Vigencias (11)
11. ✅ Lista Chequeo (12)

### **Módulos de Operación (Desarrollar CUARTO)**:
12. ✅ Verificación Contratistas (15)
13. ✅ Sesiones (16)
14. ✅ Storage (17)
15. ✅ Carga Documentos (18)
16. ✅ Revisión (20)

### **Módulos de Soporte (Desarrollar QUINTO)**:
17. ✅ Estadísticas (22)
18. ✅ Reportes (23)
19. ✅ Notificaciones (24)
20. ✅ Auditoría (25)

---

## ⚠️ REGLAS DE ORO

1. **NUNCA saltar dependencias**: Si Módulo B depende de Módulo A, hacer A primero
2. **Probar cada módulo antes de continuar**: No acumular módulos sin probar
3. **Seeders después de modelos**: Siempre poblar BD después de crear modelos
4. **Backend antes que Frontend**: APIs antes que interfaces
5. **Autenticación antes de cualquier CRUD**: Seguridad es prioritaria
6. **Storage antes de documentos**: No se puede cargar sin sistema de archivos
7. **Validaciones en cada módulo**: No dejar validaciones para después

---

## 🎯 CHECKLIST DE INICIO DE CADA MÓDULO

Antes de empezar un módulo, verificar:
- [ ] ✅ Todas las dependencias están completadas
- [ ] ✅ Modelos necesarios están creados
- [ ] ✅ Seeds de datos necesarios están cargados
- [ ] ✅ APIs de dependencias están probadas
- [ ] ✅ Documentación de APIs previas está lista

---

**Última actualización**: 7 de octubre de 2025  
**Versión**: 1.0

