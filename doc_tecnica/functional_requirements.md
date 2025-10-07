# REQUERIMIENTOS FUNCIONALES
## Sistema Nacional de Gestión de Listas de Chequeo Precontractuales para el SENA

---

## 🔑 CARACTERÍSTICAS PRINCIPALES

### Flujo sin Autenticación para Instructores/Administrativos
**Instructores y administrativos NO necesitan cuenta de usuario con login**:
- ✅ Ingresan solo su número de documento
- ✅ Sistema verifica en ACIA si están registrados
- ✅ **Si están en ACIA** → pueden cargar documentos directamente (datos recuperados de ACIA)
- ✅ **Si NO están en ACIA** → se registran en el sistema local con datos básicos (nombre, correo, documento)
- ✅ Una vez verificados o registrados → pueden cargar documentos
- 🔒 **Restricción por fechas**: Solo pueden cargar en vigencias activas (dentro de fechas configuradas)
- 🔓 **Excepción**: Administrador de centro puede autorizar carga fuera de fechas (casos especiales: nuevos ingresos, etc.)
- ✅ Sistema identifica usuario por documento en cada sesión de carga

### Gestión por Vigencias/Convocatorias
El sistema maneja contratos por periodos con control de fechas:
- 📅 **Vigencias con fechas de inicio y fin** (controlan cuándo se puede cargar)
- 📋 Cada vigencia tiene su configuración de documentos requeridos
- 🔒 **Por defecto**: Solo se pueden cargar documentos dentro de las fechas de la vigencia
- 🔓 **Excepciones con permiso**: Administrador de centro puede autorizar carga fuera de fechas
- 👥 Instructores/administrativos cargan para la vigencia activa o autorizada
- 🔄 Usuarios pueden tener acceso a múltiples vigencias (con permiso)
- 📊 Histórico de documentos por vigencia
- ⚠️ **Control de acceso**: Cargar fuera de fechas requiere autorización del administrador del centro

### Integración con Sistema ACIA (Solo Consulta)
El sistema consulta **ACIA** para validar usuarios:
- ✅ Verificar si instructor/administrativo existe en ACIA
- ✅ Recuperar datos básicos (nombre, correo)
- ✅ Solo usuarios en ACIA pueden cargar documentos
- ✅ Sin registro ni sincronización bidireccional
- ✅ Manejo de disponibilidad intermitente de ACIA

### Captura y Validación de Fechas
El sistema captura y valida fechas de documentos:
- 📅 Usuario ingresa fechas al cargar documentos (expedición, vencimiento)
- 🤖 IA extrae fechas automáticamente del documento
- ✓ Sistema compara fechas usuario vs IA (tolerancia ±2 días)
- ⚠️ Alertas automáticas para revisores si hay discrepancias
- 📊 Revisores ven fechas lado a lado para verificación manual

---

## 👥 USUARIOS Y ROLES DEL SISTEMA

### Usuarios sin Autenticación (NO requieren login)

**Instructores y Administrativos** (Usuarios Externos):
- ❌ NO tienen cuenta en el sistema
- ❌ NO inician sesión
- ✅ Solo ingresan número de documento para verificar en ACIA
- ✅ Cargan documentos para vigencias/convocatorias activas
- ✅ Identificados por número de documento en cada sesión
- ✅ Pueden cargar documentos para múltiples vigencias

---

### Roles del Sistema (SÍ requieren login y autenticación)

El sistema contempla **4 roles administrativos** con autenticación:

1. **Revisor**
   - Alcance: Centro(s) asignado(s)
   - Función: Revisar, aprobar o rechazar documentos de instructores/administrativos
   - Autenticación: Email/usuario y contraseña

2. **Administrador de Centro**
   - Alcance: Un centro de formación específico
   - Función: Administrar revisores de su centro y revisar documentos
   - Autenticación: Email/usuario y contraseña

3. **Director Regional**
   - Alcance: Una regional completa (todos sus centros)
   - Función: Gestionar centros, administradores de centro y supervisar documentación regional
   - Autenticación: Email/usuario y contraseña

4. **Administrador Nacional**
   - Alcance: Todo el sistema (todas las regionales y centros)
   - Función: Gestión completa del sistema, vigencias, lista de chequeo nacional, configuración global
   - Autenticación: Email/usuario y contraseña

**Arquitectura**: Single-Database con separación lógica por `regional_id` y `centro_id`

---

### RF-001: GESTIÓN DE VIGENCIAS Y CONVOCATORIAS

#### RF-001.1 Creación y Gestión de Vigencias
- **Descripción**: El sistema debe permitir la creación y gestión de vigencias/periodos contractuales para carga de documentos.
- **Entradas**: Nombre de vigencia, año, fecha inicio, fecha fin, descripción
- **Proceso**: Creación, actualización, activación/desactivación de vigencias
- **Salidas**: Vigencia creada/actualizada exitosamente
- **Criterios de Aceptación**:
  - Solo administradores nacionales pueden crear vigencias
  - Nombre y año deben ser únicos (ej: "Vigencia 2025-1", "Vigencia 2025-2")
  - Fecha fin debe ser posterior a fecha inicio
  - Solo una vigencia puede estar activa a la vez
  - Vigencia activa es la que permite carga de documentos
  - Al activar una vigencia, las demás se desactivan automáticamente
  - Debe mantener historial de vigencias anteriores
  - No se pueden eliminar vigencias con documentos asociados

#### RF-001.2 Asignación de Lista de Chequeo a Vigencia
- **Descripción**: Cada vigencia debe tener su propia configuración de documentos requeridos.
- **Entradas**: vigencia_id, lista de ítems de chequeo activos
- **Proceso**: Asociación de ítems de lista de chequeo a la vigencia
- **Salidas**: Configuración de vigencia completada
- **Criterios de Aceptación**:
  - Vigencia puede tener configuración personalizada de documentos
  - Por defecto, hereda la lista de chequeo nacional activa
  - Administrador puede activar/desactivar ítems específicos para la vigencia
  - Cambios en lista de chequeo nacional no afectan vigencias cerradas
  - Vigencias activas reflejan cambios en lista de chequeo nacional

#### RF-001.3 Estados y Control de Fechas de Vigencia
- **Descripción**: El sistema debe manejar diferentes estados de vigencias y controlar el acceso para carga de documentos según fechas.
- **Estados posibles**:
  - **Pendiente**: Vigencia creada pero aún no iniciada (no permite carga)
  - **Activa**: Vigencia en curso, permite carga de documentos
  - **Cerrada**: Vigencia finalizada, no permite carga de nuevos documentos
- **Criterios de Aceptación**:
  - Transición automática de estados según fechas configuradas
  - Notificaciones a administradores sobre cambios de estado
  - **Por defecto**: Solo vigencia activa (dentro de fechas) permite carga de documentos
  - Vigencias cerradas mantienen sus documentos para consulta
  - Puede haber múltiples vigencias activas simultáneamente (diferentes periodos del año)

#### RF-001.4 Autorización de Carga Fuera de Fechas
- **Descripción**: Administradores de centro pueden autorizar carga de documentos fuera de las fechas de vigencia.
- **Entradas**: numero_documento del instructor/administrativo, vigencia_id, fecha_inicio_permiso, fecha_fin_permiso (opcional)
- **Proceso**: Creación de excepción temporal para permitir carga fuera de fechas
- **Salidas**: Permiso especial otorgado
- **Criterios de Aceptación**:
  - Solo administradores de centro y directores regionales pueden otorgar este permiso
  - Permiso puede ser:
    - **Por instructor específico**: Para casos individuales (nuevo ingreso, reproceso, etc.)
    - **Por centro completo**: Habilitar carga para todos los instructores del centro (extensión de plazo)
  - Permiso temporal con fecha de vencimiento (configurable)
  - Si no se especifica fecha fin, permiso válido por 30 días
  - Sistema registra quién otorgó el permiso y cuándo
  - Instructor ve mensaje: "Tiene autorización especial para cargar documentos hasta [fecha]"
  - Permisos pueden ser revocados por el administrador
  - Debe quedar registrado en auditoría

---

### RF-002: GESTIÓN DE ESTRUCTURA ORGANIZACIONAL

#### RF-002.1 Gestión de Regionales
- **Descripción**: El sistema debe permitir la administración de las regionales del SENA a nivel nacional.
- **Entradas**: Nombre de regional, código de regional
- **Proceso**: Creación, actualización, consulta y desactivación de regionales
- **Salidas**: Regional creada/actualizada/consultada
- **Criterios de Aceptación**:
  - Solo administradores nacionales pueden gestionar regionales
  - Código de regional debe ser único
  - No se pueden eliminar regionales con centros asociados
  - Debe mantener historial de cambios para auditoría

#### RF-002.2 Gestión de Centros de Formación
- **Descripción**: El sistema debe permitir la administración de centros de formación asociados a cada regional.
- **Entradas**: Nombre de centro, código de centro, regional_id
- **Proceso**: Creación, actualización, consulta y desactivación de centros
- **Salidas**: Centro de formación creado/actualizado/consultado
- **Criterios de Aceptación**:
  - Cada centro debe estar vinculado a una regional
  - Código de centro debe ser único dentro de una regional
  - No se pueden eliminar centros con usuarios o documentos asociados
  - Debe mantener trazabilidad de cambios

#### RF-002.3 Separación Lógica Multi-tenant
- **Descripción**: El sistema debe mantener separación lógica de datos por regional y centro usando una única base de datos (Single-DB).
- **Entradas**: regional_id, centro_id en cada operación
- **Proceso**: Filtrado automático de datos según contexto del usuario
- **Salidas**: Datos segregados por regional/centro
- **Criterios de Aceptación**:
  - Todos los registros de documentos, revisiones y listas deben incluir regional_id y centro_id
  - Los usuarios solo deben ver datos de sus centros asignados
  - Las consultas deben filtrar automáticamente por contexto organizacional
  - Debe prevenir acceso cross-tenant no autorizado

---

### RF-003: VERIFICACIÓN DE INSTRUCTORES/ADMINISTRATIVOS Y CARGA DE DOCUMENTOS

#### RF-003.1 Verificación en ACIA o Registro Local
- **Descripción**: Los instructores/administrativos ingresan su documento. Si están en ACIA, se recuperan sus datos. Si NO están en ACIA, se registran en el sistema local.

**a) Ingreso de Documento por Instructor/Administrativo**:
- **Entradas**: Tipo de documento, número de documento
- **Proceso**: 
  - Usuario (instructor/administrativo) ingresa número de documento en portal público
  - Sistema valida formato del documento
  - Sistema consulta API de ACIA para verificar existencia
  - Timeout: 10 segundos
  - 1 reintento si falla
- **Salidas**: Usuario encontrado en ACIA, no encontrado, o ACIA no disponible
- **Criterios de Aceptación**:
  - Tipos de documento permitidos: CC (Cédula de Ciudadanía), CE (Cédula de Extranjería), NIT
  - Validar formato antes de consultar ACIA
  - Verificar si ya existe en sistema local antes de consultar ACIA

**b) Escenario 1: Usuario Encontrado en ACIA**:
- **Proceso**: 
  - Sistema recupera datos básicos de ACIA (nombre, correo, centro)
  - Sistema verifica si ya existe registro local con ese documento
  - Si no existe localmente: crea registro automático con datos de ACIA
  - Si ya existe localmente: actualiza datos con información de ACIA
  - Marca registro como `encontrado_en_acia = true`
  - Permite acceso inmediato a carga de documentos
- **Criterios de Aceptación**:
  - Registro local creado automáticamente sin contraseña
  - Datos sincronizados desde ACIA
  - Usuario puede cargar documentos inmediatamente

**c) Escenario 2: Usuario NO Encontrado en ACIA**:
- **Proceso**: 
  - Sistema muestra formulario de registro básico
  - Usuario ingresa: nombre completo, correo electrónico, centro de formación
  - Sistema valida datos y crea registro local
  - Marca registro como `encontrado_en_acia = false`
  - Permite acceso inmediato a carga de documentos
- **Criterios de Aceptación**:
  - Formulario con validaciones de datos
  - Correo debe ser válido
  - Centro de formación es obligatorio (selección de lista)
  - No se requiere contraseña
  - Usuario puede cargar documentos inmediatamente después de registrarse

**d) Escenario 3: ACIA No Disponible**:
- **Proceso**:
  - Sistema verifica si usuario ya existe en sistema local
  - Si existe localmente: permite acceso con datos existentes
  - Si no existe: muestra formulario de registro local (igual que escenario 2)
  - Marca para verificar en ACIA cuando esté disponible
- **Criterios de Aceptación**:
  - Sistema no bloquea por falla de ACIA
  - Usuario puede continuar con registro local
  - Sistema intenta sincronizar con ACIA en próxima sesión

**e) Acceso a Carga de Documentos (Sin Autenticación/Login)**:
- **Entradas**: Datos del usuario (de ACIA o registro local)
- **Proceso**: 
  - Sistema crea sesión temporal identificada por número de documento
  - Sistema verifica vigencias disponibles y permisos especiales
  - No hay login con usuario/contraseña
  - Usuario accede directamente a interfaz de carga
  - Sesión válida por 2 horas de inactividad
- **Salidas**: Acceso a formulario de carga de documentos con vigencias permitidas
- **Criterios de Aceptación**:
  - No se requiere contraseña ni autenticación
  - Sesión identificada solo por documento
  - Usuario puede cerrar y volver a ingresar con su documento
  - Sistema mantiene progreso de documentos cargados
  - **Control de fechas**: 
    - Muestra solo vigencias activas (dentro de fechas) por defecto
    - Si tiene permiso especial, muestra también vigencias autorizadas
    - Muestra mensaje claro sobre vigencias disponibles y fechas límite
    - Si no hay vigencias activas ni permisos: mensaje "No hay vigencias activas. Contacte con su centro"

#### RF-003.2 Tabla de Instructores/Administrativos (Sin Contraseña)
- **Descripción**: El sistema mantiene un registro de instructores/administrativos que han accedido al sistema, sin datos de autenticación.
- **Campos principales**:
  - `tipo_documento`, `numero_documento` (único)
  - `nombre_completo`, `correo`
  - `centro_id` (FK)
  - `encontrado_en_acia` (boolean)
  - `fecha_verificacion_acia` (timestamp)
  - `created_at`, `updated_at`
- **Criterios de Aceptación**:
  - NO tiene campo `password` (no hay autenticación)
  - Número de documento debe ser único
  - Registro se crea automáticamente al verificar/registrar
  - Se actualiza con cada acceso si hay datos nuevos de ACIA
  - Sirve para asociar documentos y mantener histórico

#### RF-003.3 Identificación de Usuario en Documentos y Control de Vigencias
- **Descripción**: Los documentos se asocian al número de documento del instructor/administrativo y a una vigencia específica.
- **Entradas**: número_documento, vigencia_id
- **Proceso**: 
  - Sistema verifica que vigencia esté activa O que exista permiso especial
  - Documentos se asocian a: numero_documento + centro_id + vigencia_id
  - Sistema mantiene registro de quién cargó por documento
  - Al reingresar con documento, recupera todos sus documentos
- **Salidas**: Documentos asociados correctamente
- **Criterios de Aceptación**:
  - Documentos vinculados a número de documento (no a usuario_id con password)
  - Documentos vinculados a centro de formación
  - Documentos vinculados a vigencia específica (obligatorio)
  - **Validación de fechas**:
    - Sistema valida que vigencia esté activa (dentro de fechas)
    - Si vigencia no activa, verifica si existe permiso especial
    - Si no hay vigencia activa ni permiso: no permite carga
  - Sistema permite ver histórico completo por documento
  - Un instructor puede cargar para múltiples vigencias (si están activas o tiene permisos)
  - Registra fecha y hora de cada carga

---

### RF-004: AUTENTICACIÓN Y AUTORIZACIÓN (Solo Roles Administrativos)

#### RF-004.1 Registro de Usuarios Administrativos
- **Descripción**: Solo el administrador nacional puede crear usuarios administrativos (revisores, admins de centro, directores regionales).
- **Entradas**: Nombre completo, correo, contraseña temporal, rol, centro(s)/regional asignado
- **Proceso**: Creación de cuenta administrativa con rol específico
- **Salidas**: Usuario administrativo creado
- **Criterios de Aceptación**:
  - Solo administrador nacional puede crear usuarios administrativos
  - Correo electrónico debe ser único
  - Contraseña temporal debe ser cambiada en primer login
  - Tipos de usuarios: revisor, administrador_centro, director_regional, admin
  - Usuario recibe email con credenciales temporales
  - NO se crean cuentas para instructores/administrativos (ellos solo consultan)

#### RF-004.2 Inicio de Sesión (Solo Usuarios Administrativos)
- **Descripción**: El sistema debe autenticar usuarios administrativos mediante credenciales.
- **Entradas**: Correo y contraseña, centro_id seleccionado (si aplica)
- **Proceso**: Verificación de credenciales, generación de token JWT
- **Salidas**: Sesión iniciada, redirección según rol
- **Criterios de Aceptación**:
  - Máximo 3 intentos fallidos antes de bloquear temporalmente (15 minutos)
  - Token JWT debe incluir: user_id, rol, centro_id, regional_id
  - Token con tiempo de expiración de 8 horas
  - Usuario solo puede seleccionar centros a los que está asignado
  - Registro de todos los intentos de acceso (exitosos y fallidos)
  - Admin Nacional no necesita seleccionar centro (acceso global)
  - Director Regional puede seleccionar centro o vista regional
  - Revisor y Admin Centro seleccionan centro si tienen múltiples

#### RF-004.3 Gestión de Roles Administrativos
- **Descripción**: El sistema debe manejar cuatro roles administrativos con permisos diferenciados y alcance específico.
- **Roles del Sistema**:
  
  1. **Revisor**:
     - Alcance: Centro(s) asignado(s)
     - Permisos: Revisar y aprobar/rechazar documentos de instructores/administrativos de sus centros
     - Puede ver documentos y estadísticas de sus centros
     - No puede modificar configuraciones ni gestionar usuarios administrativos
  
  2. **Administrador de Centro**:
     - Alcance: Centro específico asignado
     - Permisos: Todas las funciones de Revisor +
     - Gestionar revisores del centro (crear, editar, desactivar)
     - Ver reportes completos del centro
     - Ver la lista de chequeo (no puede modificarla)
     - No puede gestionar otros centros ni la regional
  
  3. **Director Regional**:
     - Alcance: Regional completa (todos los centros de su regional)
     - Permisos: Todas las funciones de Administrador de Centro +
     - Gestionar múltiples centros de su regional
     - Crear y gestionar Administradores de Centro y Revisores
     - Ver estadísticas consolidadas de toda la regional
     - Gestionar usuarios administrativos de todos los centros de su regional
     - No puede modificar la lista de chequeo nacional
     - No puede acceder a otras regionales
  
  4. **Administrador Nacional**:
     - Alcance: Todo el sistema (todas las regionales y centros)
     - Permisos: Acceso completo sin restricciones
     - Gestionar regionales, centros y vigencias
     - Crear y editar lista de chequeo nacional
     - Gestionar usuarios de cualquier rol y centro
     - Ver estadísticas nacionales
     - Configurar parámetros del sistema

- **Entradas**: Asignación de rol por usuario con permisos suficientes
- **Proceso**: Validación de permisos del usuario que asigna, actualización de rol en base de datos, invalidación de tokens existentes
- **Salidas**: Rol actualizado, usuario notificado
- **Criterios de Aceptación**:
  - Administrador Nacional puede asignar cualquier rol
  - Director Regional puede asignar roles: revisor, administrador_centro (solo en su regional)
  - Administrador de Centro puede asignar rol: revisor (solo en su centro)
  - Revisor no puede asignar roles
  - Cambio de rol debe reflejarse inmediatamente (invalidar sesiones activas)
  - Debe mantener auditoría detallada de cambios de rol
  - **Nota**: No existe rol "usuario" para login. Instructores/administrativos solo verifican en ACIA

#### RF-004.4 Asignación Multi-Centro para Roles Administrativos
- **Descripción**: El sistema debe permitir que un usuario esté asociado a múltiples centros de formación.
- **Entradas**: usuario_id, lista de centro_ids
- **Proceso**: Creación/actualización de relaciones en tabla pivote UsuarioCentro
- **Salidas**: Centros asignados exitosamente
- **Criterios de Aceptación**:
  - Un usuario puede pertenecer a centros de diferentes regionales
  - Al iniciar sesión, debe seleccionar un centro activo para la sesión
  - Revisores y usuarios solo operan en el contexto del centro seleccionado
  - Administradores nacionales tienen acceso a todos los centros

#### RF-002.5 Recuperación de Contraseña
- **Descripción**: Los usuarios deben poder restablecer su contraseña mediante email.
- **Entradas**: Email registrado
- **Proceso**: Generación de token temporal, envío de enlace por email
- **Salidas**: Nueva contraseña establecida
- **Criterios de Aceptación**:
  - Enlace con expiración máxima de 1 hora
  - Token de recuperación de un solo uso
  - Nueva contraseña debe cumplir políticas de seguridad

#### RF-002.6 Cambio de Contraseña
- **Descripción**: Los usuarios autenticados deben poder cambiar su contraseña.
- **Entradas**: Contraseña actual, nueva contraseña
- **Proceso**: Validación de contraseña actual, actualización, notificación por email
- **Salidas**: Contraseña actualizada
- **Criterios de Aceptación**:
  - Debe verificar contraseña actual antes del cambio
  - Nueva contraseña no puede ser igual a las últimas 3 utilizadas
  - Debe enviar notificación de cambio por email

### RF-003: GESTIÓN DE LISTAS DE CHEQUEO

#### RF-003.1 Creación de Ítems de Lista de Chequeo
- **Descripción**: Los administradores nacionales deben poder crear ítems en la lista de chequeo precontractual.
- **Entradas**: Nombre del ítem, descripción detallada, campo obligatorio (sí/no)
- **Proceso**: Creación de registro en tabla ListaChequeo, asignación de orden automático
- **Salidas**: Ítem creado exitosamente
- **Criterios de Aceptación**:
  - Solo administradores nacionales pueden crear ítems
  - Nombre del ítem debe ser único y descriptivo
  - Descripción debe explicar claramente qué documento se requiere
  - Campo obligatorio determina si el usuario puede omitir este documento
  - Ítem se crea activo por defecto
  - Cambios se reflejan inmediatamente en todos los formularios activos

#### RF-003.2 Edición de Ítems de Lista de Chequeo
- **Descripción**: Los administradores nacionales deben poder editar ítems existentes.
- **Entradas**: ID de ítem, campos a modificar (nombre, descripción, obligatorio, activo)
- **Proceso**: Actualización de registro en base de datos
- **Salidas**: Ítem actualizado exitosamente
- **Criterios de Aceptación**:
  - Solo administradores nacionales pueden editar ítems
  - No se puede cambiar obligatorio a "sí" si ya hay usuarios con formularios iniciados sin ese documento
  - Cambios se reflejan automáticamente en todos los formularios
  - Debe mantener auditoría de cambios (qué se cambió, quién, cuándo)

#### RF-003.3 Reordenamiento de Lista de Chequeo
- **Descripción**: Los administradores nacionales deben poder cambiar el orden de presentación de los ítems.
- **Entradas**: Lista de ítems con nuevo orden (array de IDs)
- **Proceso**: Actualización del campo "orden" para cada ítem
- **Salidas**: Nuevo orden aplicado
- **Criterios de Aceptación**:
  - Interfaz debe permitir drag-and-drop o botones de subir/bajar
  - Cambios deben reflejarse inmediatamente en formularios de usuarios
  - Debe mantener consistencia en todas las sesiones activas
  - El orden debe ser numérico y secuencial

#### RF-003.4 Activación/Desactivación de Ítems
- **Descripción**: Los administradores nacionales deben poder activar o desactivar ítems de la lista sin eliminarlos.
- **Entradas**: ID de ítem, nuevo estado (activo/inactivo)
- **Proceso**: Actualización del campo "activo" en base de datos
- **Salidas**: Estado actualizado exitosamente
- **Criterios de Aceptación**:
  - Ítems inactivos no aparecen en formularios de carga de usuarios
  - Ítems inactivos mantienen sus datos históricos
  - Documentos ya cargados para ítems inactivos permanecen visibles
  - Debe registrar quién y cuándo desactivó el ítem

#### RF-003.5 Eliminación de Ítems
- **Descripción**: Los administradores nacionales deben poder eliminar ítems que no han sido utilizados.
- **Entradas**: ID de ítem a eliminar
- **Proceso**: Validación de uso, eliminación o soft-delete según caso
- **Salidas**: Ítem eliminado o error si está en uso
- **Criterios de Aceptación**:
  - No se puede eliminar un ítem si existen documentos asociados
  - Debe solicitar confirmación antes de eliminar
  - Preferible usar soft-delete (marcar como eliminado) en lugar de borrado físico
  - Debe registrar la eliminación en auditoría

#### RF-003.6 Visualización Dinámica para Usuarios
- **Descripción**: Los usuarios deben ver la lista de chequeo actualizada en tiempo real según configuración actual.
- **Entradas**: centro_id del usuario
- **Proceso**: Consulta de ítems activos ordenados
- **Salidas**: Lista de chequeo dinámica
- **Criterios de Aceptación**:
  - Solo mostrar ítems activos
  - Respetar el orden configurado
  - Indicar claramente cuáles son obligatorios
  - Mostrar descripción detallada de cada ítem
  - Actualizar automáticamente si hay cambios (websockets o polling)


### RF-004: CARGA DE DOCUMENTOS POR USUARIOS

#### RF-004.1 Visualización de Lista de Chequeo Personal
- **Descripción**: Los usuarios deben ver la lista de documentos que deben cargar según la lista de chequeo configurada.
- **Entradas**: usuario_id, centro_id
- **Proceso**: Consulta de ítems activos de lista de chequeo, verificación de documentos ya cargados
- **Salidas**: Lista personalizada con estado de cada documento (pendiente/cargado/aprobado/rechazado)
- **Criterios de Aceptación**:
  - Mostrar todos los ítems activos de la lista de chequeo
  - Indicar claramente cuáles son obligatorios
  - Mostrar estado actual de cada documento
  - Mostrar descripción completa de cada ítem
  - Indicar porcentaje de completitud

#### RF-004.2 Carga Individual de Documentos con Captura de Fechas
- **Descripción**: Los usuarios deben poder cargar archivos para cada ítem de la lista de chequeo y proporcionar fechas relevantes del documento.
- **Entradas**: 
  - usuario_id, centro_id, lista_chequeo_id, archivo
  - fecha_documento (opcional): Fecha que aparece en el documento (expedición, emisión)
  - fecha_vencimiento (opcional): Fecha de vencimiento del documento si aplica
- **Proceso**: 
  - Validación de formato y tamaño
  - Captura de fechas proporcionadas por el usuario
  - Almacenamiento en sistema de archivos
  - Creación de registro en tabla Documento con fechas
  - Envío a servicio IA para extracción y validación de fechas
- **Salidas**: Documento cargado exitosamente con estado "pendiente" y fechas registradas
- **Criterios de Aceptación**:
  - Formatos permitidos: PDF, JPG, PNG, DOCX
  - Tamaño máximo: 10MB por archivo
  - Archivo debe almacenarse con nombre único para evitar colisiones
  - Estado inicial: "pendiente"
  - Debe asociarse correctamente a usuario, centro y lista_chequeo_id
  - Debe registrar fecha y hora de carga del sistema (created_at)
  - Debe permitir ingresar fecha_documento (fecha del documento físico)
  - Debe permitir ingresar fecha_vencimiento si el documento tiene vigencia
  - Si el servicio IA está activo, validar que las fechas ingresadas coincidan con las extraídas
  - Si hay discrepancia en fechas (IA vs usuario), marcar con alerta para revisión
  - Formulario debe indicar claramente qué fecha se solicita para cada tipo de documento

#### RF-004.3 Reemplazo de Documentos Rechazados
- **Descripción**: Los usuarios deben poder recargar documentos que fueron rechazados por revisores.
- **Entradas**: documento_id, nuevo archivo
- **Proceso**: Verificación de que el documento actual esté en estado "rechazado", reemplazo de archivo, cambio de estado a "pendiente"
- **Salidas**: Documento reemplazado exitosamente
- **Criterios de Aceptación**:
  - Solo se pueden reemplazar documentos en estado "rechazado"
  - El archivo anterior debe conservarse para auditoría
  - Observaciones del revisor deben permanecer visibles
  - Estado vuelve a "pendiente" para nueva revisión
  - Debe notificar al revisor de la recarga

#### RF-004.4 Validación de Formato de Archivos
- **Descripción**: El sistema debe validar el formato y tamaño de los archivos antes de aceptarlos.
- **Entradas**: Archivo cargado
- **Proceso**: Verificación de extensión, verificación MIME type real, validación de tamaño
- **Salidas**: Archivo válido/inválido con mensaje explicativo
- **Criterios de Aceptación**:
  - Validar extensión del archivo
  - Validar MIME type real (no solo extensión)
  - Rechazar archivos ejecutables o potencialmente peligrosos
  - Tamaño máximo: 10MB
  - Mostrar mensaje de error específico si falla validación

#### RF-004.5 Control de Completitud
- **Descripción**: El sistema debe verificar que todos los documentos obligatorios hayan sido cargados.
- **Entradas**: usuario_id, centro_id
- **Proceso**: Comparación entre ítems obligatorios y documentos cargados
- **Salidas**: Estado de completitud, lista de pendientes obligatorios
- **Criterios de Aceptación**:
  - Calcular porcentaje de completitud (documentos cargados / total de ítems)
  - Identificar ítems obligatorios faltantes
  - Mostrar claramente qué documentos faltan
  - Habilitar envío a revisión solo si todos los obligatorios están cargados

#### RF-004.6 Envío de Documentación para Revisión
- **Descripción**: Los usuarios deben poder enviar su documentación completa para revisión oficial.
- **Entradas**: usuario_id, centro_id
- **Proceso**: Validación de completitud, marcado de documentos como "en revisión", notificación a revisores
- **Salidas**: Documentación enviada exitosamente
- **Criterios de Aceptación**:
  - Solo permitir envío si todos los documentos obligatorios están cargados
  - Cambiar estado de documentos de "pendiente" a "en revisión"
  - Notificar a revisores del centro correspondiente
  - Usuario no debe poder modificar documentos una vez enviados (hasta que haya revisión)
  - Registrar fecha y hora de envío

### RF-005: VALIDACIÓN CON INTELIGENCIA ARTIFICIAL

#### RF-005.1 Integración con Servicio OCR/NLP
- **Descripción**: El sistema debe tener un placeholder/integración con servicio de OCR y NLP para validación automática de documentos.
- **Entradas**: Archivo de documento, metadatos (tipo de documento esperado, datos del usuario)
- **Proceso**: Envío de documento a servicio externo de IA, recepción de resultados, almacenamiento en metadata_json
- **Salidas**: Resultados de validación automática
- **Criterios de Aceptación**:
  - Integración debe ser configurable (activar/desactivar)
  - Debe soportar procesamiento asíncrono
  - Resultados se almacenan en campo metadata_json de tabla Documento
  - Tiempo de procesamiento máximo: 60 segundos
  - Debe manejar errores del servicio externo sin bloquear el flujo

#### RF-005.2 Extracción de Datos y Fechas de Documentos
- **Descripción**: El servicio de IA debe extraer datos relevantes de los documentos cargados, incluyendo fechas importantes.
- **Entradas**: 
  - Archivo de documento (PDF, JPG, PNG, DOCX)
  - Fecha(s) ingresada(s) por el usuario (para comparación)
- **Proceso**: 
  - OCR para extracción de texto
  - NLP para identificación de campos clave
  - Detección y extracción de fechas en el documento
  - Comparación entre fechas extraídas y fechas ingresadas por usuario
- **Salidas**: 
  - Datos extraídos en formato JSON (nombre, número de documento, fechas, etc.)
  - Fechas extraídas con nivel de confianza
  - Indicador de concordancia entre fechas usuario vs IA
- **Criterios de Aceptación**:
  - **Datos básicos**: extraer nombre completo, tipo y número de documento
  - **Fechas**: identificar y extraer fechas relevantes del documento:
    - Fecha de expedición/emisión
    - Fecha de vencimiento (si aplica)
    - Otras fechas relevantes según tipo de documento
  - **Formato de fechas**: reconocer múltiples formatos (DD/MM/YYYY, DD-MM-YYYY, etc.)
  - **Validación de fechas**: 
    - Si usuario ingresó fecha_documento, comparar con fecha_documento_extraida
    - Si usuario ingresó fecha_vencimiento, comparar con fecha_vencimiento_extraida
    - Tolerancia de +/- 2 días para considerar fechas como concordantes
    - Si hay discrepancia > 2 días, marcar `alerta_fechas_discrepantes = true`
  - Resultados deben incluir nivel de confianza por cada campo (0-100%)
  - Debe manejar documentos escaneados con baja calidad
  - Almacenar resultados completos en metadata_json del documento
  - Si no puede extraer fecha con confianza > 60%, no establecer alerta
  - Notificar a revisor si hay alertas de fechas discrepantes

#### RF-005.3 Validación de Correspondencia de Contenido
- **Descripción**: El sistema debe verificar que el documento cargado corresponda con el tipo de documento solicitado en la lista de chequeo.
- **Entradas**: Documento procesado, tipo de documento esperado (de lista de chequeo)
- **Proceso**: Análisis de contenido extraído vs. expectativas del tipo de documento
- **Salidas**: Score de correspondencia (0-100%), lista de inconsistencias detectadas
- **Criterios de Aceptación**:
  - Score mínimo aceptable: 70%
  - Si score < 70%, marcar documento con alerta para revisión manual prioritaria
  - Identificar qué campos esperados no se encontraron
  - Almacenar score en metadata_json

#### RF-005.4 Verificación de Identidad del Usuario
- **Descripción**: El sistema debe confirmar que los datos extraídos del documento coincidan con los datos del usuario registrado.
- **Entradas**: Datos extraídos del documento, datos del usuario en sistema
- **Proceso**: Comparación de nombre y número de documento con tolerancia a variaciones
- **Salidas**: Identidad verificada/no verificada, porcentaje de coincidencia
- **Criterios de Aceptación**:
  - Comparar nombre completo con tolerancia a acentos, espacios y orden
  - Comparar número de documento (debe coincidir exactamente)
  - Si no coincide, marcar documento con alerta crítica
  - Almacenar resultado en metadata_json
  - Notificar a revisor si hay discrepancia

#### RF-005.5 Almacenamiento de Metadatos de Validación
- **Descripción**: El sistema debe almacenar todos los resultados de validación IA en formato JSON estructurado, incluyendo fechas extraídas y validadas.
- **Entradas**: Resultados de procesamiento IA
- **Proceso**: Estructuración y almacenamiento en campo metadata_json
- **Salidas**: Metadatos almacenados exitosamente
- **Criterios de Aceptación**:
  - Estructura JSON consistente para todos los documentos
  - Incluir: datos extraídos, fechas extraídas, scores de confianza, alertas, timestamp de procesamiento
  - Formato debe ser fácilmente parseable para reportes
  - Ejemplo de estructura:
    ```json
    {
      "processed_at": "2025-10-07T10:30:00Z",
      "extracted_data": {
        "nombre": "Juan Pérez García",
        "tipo_documento": "CC",
        "numero_documento": "1234567890",
        "fechas": {
          "fecha_expedicion": "2020-03-15",
          "fecha_vencimiento": "2030-03-15"
        }
      },
      "confidence_scores": {
        "nombre": 95,
        "documento": 98,
        "fecha_expedicion": 92,
        "fecha_vencimiento": 88
      },
      "date_validation": {
        "fecha_documento_usuario": "2020-03-15",
        "fecha_documento_extraida": "2020-03-15",
        "fecha_vencimiento_usuario": "2030-03-15",
        "fecha_vencimiento_extraida": "2030-03-15",
        "fechas_concordantes": true,
        "diferencia_dias_documento": 0,
        "diferencia_dias_vencimiento": 0
      },
      "correspondence_score": 85,
      "identity_verified": true,
      "alerts": []
    }
    ```
  - Si hay discrepancia en fechas (diferencia > 2 días):
    ```json
    {
      "date_validation": {
        "fecha_documento_usuario": "2020-03-15",
        "fecha_documento_extraida": "2020-04-20",
        "fechas_concordantes": false,
        "diferencia_dias_documento": 36
      },
      "alerts": [
        {
          "type": "date_mismatch",
          "severity": "warning",
          "message": "Fecha ingresada por usuario (15/03/2020) no coincide con fecha extraída del documento (20/04/2020)",
          "requires_review": true
        }
      ]
    }
    ```


### RF-006: REVISIÓN Y APROBACIÓN DE DOCUMENTOS

#### RF-006.1 Panel de Revisión para Revisores
- **Descripción**: Los revisores deben poder visualizar y gestionar documentos pendientes de revisión de su(s) centro(s).
- **Entradas**: revisor_id, centro_id activo
- **Proceso**: Consulta de documentos en estado "en revisión" del centro, ordenados por fecha de envío
- **Salidas**: Lista de documentos pendientes con información del usuario y documento
- **Criterios de Aceptación**:
  - Revisor solo ve documentos de sus centros asignados
  - Mostrar documentos ordenados por fecha de envío (FIFO)
  - Incluir información del usuario: nombre, número de documento, fecha de envío
  - Incluir nombre del ítem de lista de chequeo
  - Permitir visualización/descarga del archivo
  - Mostrar metadatos de validación IA si están disponibles

#### RF-006.2 Filtros y Búsqueda en Panel de Revisión
- **Descripción**: Los revisores deben poder filtrar y buscar documentos para facilitar la revisión.
- **Entradas**: Criterios de filtro (centro, regional, estado, usuario, tipo de documento, rango de fechas)
- **Proceso**: Aplicación de filtros a consulta de documentos
- **Salidas**: Lista filtrada de documentos
- **Criterios de Aceptación**:
  - Filtrar por centro de formación (si tiene acceso a múltiples)
  - Filtrar por regional (solo para admin nacional)
  - Filtrar por estado del documento (en revisión, aprobado, rechazado)
  - Buscar por nombre o número de documento del usuario
  - Filtrar por ítem de lista de chequeo
  - Filtrar por rango de fechas
  - Combinar múltiples filtros simultáneamente

#### RF-006.3 Visualización de Documento y Metadatos
- **Descripción**: Los revisores deben poder visualizar el documento completo y sus metadatos antes de tomar una decisión.
- **Entradas**: documento_id
- **Proceso**: Recuperación de archivo y metadatos asociados
- **Salidas**: Documento visualizado con toda su información
- **Criterios de Aceptación**:
  - Visualizar archivo en línea (PDF, imágenes) o permitir descarga (DOCX)
  - Mostrar información del usuario propietario
  - Mostrar metadatos de validación IA si existen
  - Mostrar alertas automáticas (correspondencia baja, identidad no verificada)
  - Mostrar historial de revisiones previas si es recarga
  - Mostrar observaciones anteriores si las hay

#### RF-006.4 Aprobación de Documentos
- **Descripción**: Los revisores deben poder aprobar documentos que cumplan con los requisitos.
- **Entradas**: documento_id, revisor_id, comentario opcional
- **Proceso**: Cambio de estado a "aprobado", creación de registro en tabla Revision, notificación al usuario
- **Salidas**: Documento aprobado exitosamente
- **Criterios de Aceptación**:
  - Cambiar estado del documento a "aprobado"
  - Crear registro en tabla Revision con fecha, revisor y estado
  - Comentario es opcional para aprobaciones
  - Notificar al usuario por email de la aprobación
  - Documento aprobado no puede ser modificado por el usuario
  - Registrar timestamp de revisión

#### RF-006.5 Rechazo de Documentos con Observaciones
- **Descripción**: Los revisores deben poder rechazar documentos y dejar observaciones detalladas.
- **Entradas**: documento_id, revisor_id, comentario obligatorio
- **Proceso**: Cambio de estado a "rechazado", creación de registro en tabla Revision con observaciones, notificación al usuario
- **Salidas**: Documento rechazado con observaciones registradas
- **Criterios de Aceptación**:
  - Cambiar estado del documento a "rechazado"
  - Comentario es obligatorio para rechazos
  - Comentario debe ser claro y específico sobre qué corregir
  - Crear registro en tabla Revision
  - Notificar al usuario por email con las observaciones
  - Usuario debe poder ver las observaciones en su panel
  - Habilitar opción para que usuario recargue el documento

#### RF-006.6 Historial de Revisiones
- **Descripción**: El sistema debe mantener un historial completo de todas las revisiones de cada documento.
- **Entradas**: documento_id
- **Proceso**: Consulta de todos los registros de Revision asociados al documento
- **Salidas**: Historial cronológico de revisiones
- **Criterios de Aceptación**:
  - Mostrar todas las revisiones ordenadas cronológicamente
  - Incluir: fecha, revisor, decisión (aprobado/rechazado), comentarios
  - Visible para revisores y para el usuario propietario
  - Inmutable (no se pueden editar revisiones pasadas)
  - Permitir identificar cuántas veces se ha rechazado un documento

#### RF-006.7 Estadísticas para Revisores
- **Descripción**: Los revisores deben poder ver estadísticas de su trabajo de revisión.
- **Entradas**: revisor_id, rango de fechas opcional
- **Proceso**: Cálculo de métricas de revisión
- **Salidas**: Dashboard con estadísticas
- **Criterios de Aceptación**:
  - Total de documentos revisados
  - Documentos aprobados vs rechazados
  - Promedio de tiempo de revisión
  - Documentos pendientes de revisión
  - Gráficos de evolución temporal

### RF-007: ADMINISTRACIÓN DEL SISTEMA

#### RF-007.1 Gestión de Usuarios según Rol Administrativo
- **Descripción**: Los usuarios con roles administrativos deben poder gestionar usuarios según su nivel de alcance.

**a) Administrador Nacional**:
- **Entradas**: Datos de usuario, centros asignados, rol, regional
- **Proceso**: Creación, edición, desactivación de usuarios de cualquier rol y centro
- **Salidas**: Usuario gestionado exitosamente
- **Criterios de Aceptación**:
  - Acceso completo a todos los usuarios del sistema
  - Crear usuarios de cualquier rol (incluyendo directores regionales)
  - Asignar/reasignar centros y regionales
  - Cambiar roles sin restricciones
  - Desactivar cualquier usuario (no eliminar físicamente)
  - Resetear contraseñas de cualquier usuario
  - Ver historial completo de actividad de cualquier usuario

**b) Director Regional**:
- **Entradas**: Datos de usuario, centros asignados (de su regional), rol
- **Proceso**: Creación, edición, desactivación de usuarios de su regional
- **Salidas**: Usuario gestionado exitosamente
- **Criterios de Aceptación**:
  - Solo puede gestionar usuarios de centros de su regional
  - Crear usuarios con roles: usuario, revisor, administrador_centro
  - No puede crear otros directores regionales ni administradores nacionales
  - Asignar usuarios solo a centros de su regional
  - Cambiar roles dentro de los permitidos
  - Desactivar usuarios de su regional
  - Resetear contraseñas de usuarios de su regional
  - Ver historial de usuarios de su regional

**c) Administrador de Centro**:
- **Entradas**: Datos de usuario, rol (usuario o revisor)
- **Proceso**: Creación, edición de usuarios de su centro
- **Salidas**: Usuario gestionado exitosamente
- **Criterios de Aceptación**:
  - Solo puede gestionar usuarios de su centro
  - Crear usuarios con roles: usuario, revisor
  - No puede crear administradores ni directores
  - Los usuarios creados se asignan automáticamente a su centro
  - Puede cambiar roles solo entre usuario y revisor
  - Puede desactivar usuarios de su centro
  - Resetear contraseñas de usuarios de su centro

#### RF-007.2 Gestión Multi-Centro según Alcance de Rol
- **Descripción**: Los administradores deben poder gestionar la relación de usuarios con múltiples centros según su nivel de alcance.

**a) Administrador Nacional**:
- **Entradas**: usuario_id, lista de centro_ids de cualquier regional
- **Proceso**: Actualización de tabla pivote UsuarioCentro sin restricciones
- **Salidas**: Centros actualizados para el usuario
- **Criterios de Aceptación**:
  - Puede asignar centros de cualquier regional
  - Puede asignar múltiples centros de diferentes regionales
  - Usuario debe mantener al menos un centro asignado

**b) Director Regional**:
- **Entradas**: usuario_id, lista de centro_ids de su regional
- **Proceso**: Actualización de tabla pivote UsuarioCentro con restricción de regional
- **Salidas**: Centros actualizados para el usuario
- **Criterios de Aceptación**:
  - Solo puede asignar centros de su regional
  - Puede asignar múltiples centros dentro de su regional
  - Sistema debe validar que los centros pertenezcan a su regional
  - Usuario debe mantener al menos un centro asignado

**c) Administrador de Centro**:
- **Entradas**: usuario_id
- **Proceso**: Asignación automática a su centro
- **Salidas**: Usuario asignado a su centro
- **Criterios de Aceptación**:
  - Solo puede asignar usuarios a su propio centro
  - No puede asignar usuarios a otros centros
  - Asignación es automática al crear usuario

**Criterios Generales**:
- Validar que los centros existan antes de asignar
- Registrar todos los cambios para auditoría
- Si se remueve el centro activo del usuario, forzar selección en próximo login

#### RF-007.3 Alcance de Visibilidad por Rol
- **Descripción**: Los usuarios deben tener visibilidad de datos según su rol y alcance organizacional.

**a) Administrador Nacional**:
- **Alcance**: Todo el sistema sin restricciones
- **Visibilidad**:
  - Todas las regionales y centros
  - Todos los usuarios, documentos y revisiones
  - Estadísticas agregadas nacionales
  - Capacidad de filtrar por regional o centro específico
  - No requiere contexto de centro al iniciar sesión

**b) Director Regional**:
- **Alcance**: Su regional completa
- **Visibilidad**:
  - Su regional y todos sus centros
  - Usuarios, documentos y revisiones de centros de su regional
  - Estadísticas consolidadas de su regional
  - Puede filtrar por centro dentro de su regional
  - No puede ver datos de otras regionales
  - Al iniciar sesión, selecciona centro o vista regional

**c) Administrador de Centro**:
- **Alcance**: Su centro específico
- **Visibilidad**:
  - Solo su centro
  - Usuarios, documentos y revisiones de su centro
  - Estadísticas de su centro
  - Puede comparar con promedios regionales/nacionales (solo números)
  - No puede ver datos de otros centros
  - Al iniciar sesión, contexto automático de su centro

**d) Revisor y Usuario**:
- **Alcance**: Centro(s) asignado(s) o datos propios
- **Visibilidad**:
  - Revisor: datos de sus centros asignados
  - Usuario: solo sus propios datos
  - Deben seleccionar centro al iniciar sesión (si tienen múltiples)

#### RF-007.4 Gestión de Permisos Especiales de Carga
- **Descripción**: Administradores de centro y directores regionales pueden otorgar permisos para cargar documentos fuera de fechas de vigencia.

**a) Otorgar Permiso Individual**:
- **Entradas**: numero_documento del instructor, vigencia_id, fecha_fin_permiso
- **Proceso**: Creación de permiso especial para instructor específico
- **Salidas**: Permiso otorgado
- **Criterios de Aceptación**:
  - Admin de Centro: solo para su centro
  - Director Regional: para cualquier centro de su regional
  - Debe especificar fecha fin del permiso (máximo 90 días)
  - Puede agregar comentario/justificación (ej: "Nuevo ingreso")
  - Instructor recibe notificación por email
  - Permiso aparece en el dashboard del instructor

**b) Otorgar Permiso Masivo (Por Centro)**:
- **Entradas**: centro_id, vigencia_id, fecha_fin_permiso
- **Proceso**: Creación de permiso para todos los instructores del centro
- **Salidas**: Permiso masivo otorgado
- **Criterios de Aceptación**:
  - Solo Admin de Centro y Director Regional
  - Aplica a todos los instructores/administrativos del centro
  - Útil para extensiones de plazo generales
  - Debe especificar justificación
  - Sistema registra quién autorizó y cuándo
  - Todos los instructores afectados ven el permiso

**c) Visualizar Permisos Activos**:
- **Entradas**: centro_id (opcional), vigencia_id (opcional)
- **Proceso**: Lista de permisos especiales vigentes
- **Salidas**: Lista de permisos con detalles
- **Criterios de Aceptación**:
  - Mostrar: instructor, vigencia, fecha inicio, fecha fin, otorgado por, justificación
  - Filtros: por vigencia, por estado (activo/vencido)
  - Indicar permisos próximos a vencer (últimos 7 días)

**d) Revocar Permiso**:
- **Entradas**: permiso_id
- **Proceso**: Desactivación del permiso especial
- **Salidas**: Permiso revocado
- **Criterios de Aceptación**:
  - Solo quien otorgó el permiso o superior jerárquico puede revocar
  - Instructor ya no puede cargar documentos para esa vigencia
  - Instructor recibe notificación de revocación
  - Documentos ya cargados no se afectan
  - Queda registrado en auditoría

#### RF-007.5 Gestión de Centros por Director Regional
- **Descripción**: Los directores regionales deben poder gestionar los centros de formación de su regional.
- **Entradas**: Datos del centro (nombre, código), regional_id (fijo a su regional)
- **Proceso**: Creación, edición, activación/desactivación de centros de su regional
- **Salidas**: Centro gestionado exitosamente
- **Criterios de Aceptación**:
  - Solo puede gestionar centros de su regional
  - Puede crear nuevos centros en su regional
  - Puede editar información de centros existentes
  - Puede activar/desactivar centros (no eliminar)
  - Código de centro debe ser único dentro de la regional
  - No puede cambiar la regional de un centro
  - Debe registrar cambios en auditoría
  - No puede eliminar centros con usuarios o documentos asociados

#### RF-007.5 Gestión de Configuración del Sistema (Solo Admin Nacional)
- **Descripción**: Los administradores nacionales deben poder configurar parámetros globales del sistema.
- **Entradas**: Parámetros de configuración
- **Proceso**: Actualización de configuración global
- **Salidas**: Configuración actualizada
- **Criterios de Aceptación**:
  - Solo administradores nacionales tienen acceso
  - **Parámetros de archivos**:
    - Tamaño máximo de archivo permitido
    - Formatos de archivo permitidos
  - **Parámetros de autenticación**:
    - Tiempo de expiración de tokens JWT
    - Número de intentos de login permitidos
  - **Parámetros de integraciones**:
    - Activación/desactivación de validación IA
    - Activación/desactivación de consulta ACIA (solo lectura)
    - URL y credenciales de ACIA API (solo para consulta)
    - Timeout para llamadas a ACIA (default: 10 segundos)
    - Configuración de servicio de almacenamiento (local/S3)
  - **Parámetros de notificaciones**:
    - Configuración de email (SMTP, SendGrid)
    - Plantillas de emails
  - **Parámetros de validación de fechas**:
    - Tolerancia de días para validación de fechas (default: 2)
    - Requerir o no fechas en documentos
  - Registrar todos los cambios de configuración en auditoría
  - Cambios deben aplicarse sin necesidad de reiniciar el sistema

### RF-008: ALMACENAMIENTO Y TRAZABILIDAD

#### RF-008.1 Almacenamiento Configurable de Archivos
- **Descripción**: El sistema debe soportar almacenamiento local o en S3 de forma configurable.
- **Entradas**: Archivo a almacenar, configuración de almacenamiento
- **Proceso**: Guardado en filesystem local o upload a S3 según configuración
- **Salidas**: Archivo almacenado, ruta/URL generada
- **Criterios de Aceptación**:
  - Soportar almacenamiento local en directorio configurado
  - Soportar almacenamiento en AWS S3 o compatible (MinIO)
  - Configuración mediante variables de entorno
  - Generar nombres únicos para archivos (UUID + extensión)
  - Organizar archivos por estructura lógica: /centro_id/usuario_id/fecha/
  - Mantener archivos anteriores cuando se reemplaza un documento
  - Retornar ruta relativa (local) o URL (S3)

#### RF-008.2 Gestión de Versiones de Documentos
- **Descripción**: El sistema debe mantener historial de versiones cuando un documento es reemplazado.
- **Entradas**: Nuevo archivo para documento existente
- **Proceso**: Archivado de versión anterior, almacenamiento de nueva versión
- **Salidas**: Nueva versión almacenada, versión anterior preservada
- **Criterios de Aceptación**:
  - Mantener todas las versiones de un documento
  - Cada versión debe tener timestamp
  - Poder consultar versiones anteriores
  - Revisores deben poder ver versión actual y anteriores
  - No eliminar versiones anteriores (incluso las rechazadas)

#### RF-008.3 Registro de Auditoría Completo
- **Descripción**: Todas las operaciones críticas del sistema deben quedar registradas para auditoría.
- **Entradas**: Acción realizada, usuario, timestamp, detalles adicionales
- **Proceso**: Registro inmutable en tabla de auditoría
- **Salidas**: Evento registrado exitosamente
- **Criterios de Aceptación**:
  - Registrar: login/logout, cambios de contraseña, cambios de rol
  - Registrar: creación/edición de regionales y centros
  - Registrar: creación/edición/activación de ítems de lista de chequeo
  - Registrar: carga/recarga/aprobación/rechazo de documentos
  - Registrar: cambios en asignaciones de usuarios a centros
  - Logs inmutables (no se pueden editar ni eliminar)
  - Incluir: usuario_id, acción, timestamp, IP, datos anteriores y nuevos
  - Retención mínima de 5 años
  - Logs accesibles solo para administradores

#### RF-008.4 Backup y Recuperación
- **Descripción**: El sistema debe tener mecanismos de backup automatizados.
- **Entradas**: Configuración de backup
- **Proceso**: Backup periódico de base de datos y archivos
- **Salidas**: Backups almacenados de forma segura
- **Criterios de Aceptación**:
  - Backup automático de base de datos cada 24 horas
  - Backup de archivos según política de almacenamiento
  - Retención de backups por al menos 30 días
  - Capacidad de restaurar desde backup
  - Backups almacenados en ubicación separada del servidor principal

### RF-009: GESTIÓN DE PERFIL DE USUARIO

#### RF-009.1 Visualización de Perfil
- **Descripción**: Los usuarios deben poder ver su información de perfil completa.
- **Entradas**: usuario_id autenticado
- **Proceso**: Consulta de datos del usuario y centros asociados
- **Salidas**: Información completa del perfil
- **Criterios de Aceptación**:
  - Mostrar: nombre completo, tipo y número de documento, correo
  - Mostrar rol actual
  - Mostrar centros asignados con sus regionales
  - Mostrar fecha de registro
  - Mostrar último cambio de contraseña

#### RF-009.2 Actualización de Datos Personales
- **Descripción**: Los usuarios deben poder actualizar información personal básica.
- **Entradas**: Nuevos datos personales
- **Proceso**: Validación y actualización en base de datos
- **Salidas**: Perfil actualizado
- **Criterios de Aceptación**:
  - Permitir actualizar: nombre completo, correo electrónico
  - No permitir cambiar: tipo de documento, número de documento (requiere admin)
  - Validar unicidad de nuevo correo electrónico
  - Registrar cambios en auditoría
  - Enviar email de confirmación si se cambió el correo

### RF-010: REPORTES Y ESTADÍSTICAS

#### RF-010.1 Dashboard Nacional (Administrador Nacional)
- **Descripción**: Los administradores nacionales deben tener un dashboard con estadísticas generales del sistema.
- **Entradas**: Ninguna (acceso global)
- **Proceso**: Agregación de datos de todo el sistema
- **Salidas**: Dashboard con métricas nacionales
- **Criterios de Aceptación**:
  - Total de usuarios registrados (por rol y por regional)
  - Total de documentos cargados, en revisión, aprobados, rechazados
  - Tasa de aprobación general y por regional
  - Documentos procesados en últimas 24h, 7 días, 30 días
  - Estadísticas detalladas por regional y por centro
  - Gráficos de evolución temporal nacional
  - Top 10 centros con más actividad
  - Top 10 regionales con mejor tasa de aprobación
  - Promedio de tiempo de revisión nacional, por regional, por centro
  - Comparativa entre regionales
  - Alertas de centros con retrasos en revisión

#### RF-010.2 Dashboard Regional (Director Regional)
- **Descripción**: Los directores regionales deben tener un dashboard con estadísticas de su regional.
- **Entradas**: regional_id del director
- **Proceso**: Agregación de datos de todos los centros de su regional
- **Salidas**: Dashboard con métricas regionales
- **Criterios de Aceptación**:
  - Total de usuarios de la regional (por rol y por centro)
  - Total de documentos de la regional (por estado)
  - Tasa de aprobación de la regional vs promedio nacional
  - Documentos procesados por período (24h, 7d, 30d)
  - Estadísticas detalladas por cada centro de la regional
  - Gráficos de evolución temporal de la regional
  - Ranking de centros dentro de la regional (por actividad y eficiencia)
  - Promedio de tiempo de revisión de la regional vs nacional
  - Centros con documentos pendientes
  - Alertas de centros de su regional con retrasos
  - Comparativa con otras regionales (solo promedios agregados)

#### RF-010.3 Dashboard de Centro (Administrador de Centro)
- **Descripción**: Los administradores de centro deben tener un dashboard con estadísticas de su centro.
- **Entradas**: centro_id del administrador
- **Proceso**: Agregación de datos del centro
- **Salidas**: Dashboard con métricas del centro
- **Criterios de Aceptación**:
  - Total de usuarios del centro (por rol)
  - Total de documentos del centro (por estado)
  - Tasa de aprobación del centro vs promedio regional y nacional
  - Documentos procesados por período (24h, 7d, 30d)
  - Documentos pendientes de revisión
  - Documentos revisados (aprobados/rechazados) por período
  - Usuarios activos vs inactivos
  - Promedio de tiempo de revisión del centro vs regional vs nacional
  - Gráficos de evolución temporal del centro
  - Tendencia de carga de documentos
  - Performance de revisores del centro
  - Alertas de documentos con retrasos en revisión

#### RF-010.4 Dashboard de Revisor
- **Descripción**: Los revisores deben tener un dashboard de su actividad y centro(s) asignado(s).
- **Entradas**: centro_id(s) del revisor
- **Proceso**: Agregación de datos de sus centros y su actividad personal
- **Salidas**: Dashboard con métricas del revisor
- **Criterios de Aceptación**:
  - Documentos pendientes de revisión en sus centros
  - Sus documentos revisados (aprobados/rechazados) por período
  - Su promedio de tiempo de revisión vs promedio del centro
  - Usuarios activos en sus centros
  - Gráficos de su actividad de revisión
  - Estadísticas comparativas de sus centros (si tiene múltiples)
  - Documentos prioritarios (con más tiempo en cola)

#### RF-010.5 Reportes Exportables según Rol
- **Descripción**: El sistema debe permitir exportar reportes en diferentes formatos según el alcance del rol del usuario.

**a) Administrador Nacional**:
- Reportes disponibles:
  - Reporte de usuarios por centro/regional (todos)
  - Reporte de documentos por estado y período (nacional)
  - Reporte de actividad de revisores (todos)
  - Reporte de auditoría completa del sistema
  - Reporte comparativo entre regionales
  - Reporte de performance por centro y regional

**b) Director Regional**:
- Reportes disponibles:
  - Reporte de usuarios de su regional
  - Reporte de documentos de su regional por estado y período
  - Reporte de actividad de revisores de su regional
  - Reporte de auditoría de su regional
  - Reporte comparativo entre centros de su regional
  - Reporte de performance de su regional

**c) Administrador de Centro**:
- Reportes disponibles:
  - Reporte de usuarios de su centro
  - Reporte de documentos de su centro por estado y período
  - Reporte de actividad de revisores de su centro
  - Reporte de performance de su centro

**d) Revisor**:
- Reportes disponibles:
  - Reporte de su propia actividad de revisión
  - Reporte de documentos revisados por él

**Criterios Generales**:
- **Entradas**: Tipo de reporte, filtros según alcance, formato deseado
- **Proceso**: Generación de reporte según parámetros y validación de permisos
- **Salidas**: Archivo descargable (PDF, Excel, CSV)
- **Criterios de Aceptación**:
  - Formatos: PDF, Excel (.xlsx), CSV
  - Incluir filtros por fechas, centro (si aplica), regional (si aplica), estado
  - Generación asíncrona para reportes grandes (>1000 registros)
  - Notificar cuando el reporte esté listo para descarga
  - Validar alcance del usuario antes de generar reporte
  - Incluir fecha de generación y usuario que lo generó
  - Marca de agua con información del centro/regional

#### RF-010.6 Estadísticas en Tiempo Real
- **Descripción**: Las estadísticas deben actualizarse en tiempo real o near real-time.
- **Entradas**: Eventos del sistema
- **Proceso**: Actualización de métricas al ocurrir eventos relevantes
- **Salidas**: Dashboards actualizados automáticamente
- **Criterios de Aceptación**:
  - Actualizar contadores al aprobar/rechazar documentos
  - Actualizar al cargar nuevos documentos
  - Refrescar dashboards cada 30-60 segundos
  - Usar websockets o polling para actualización automática
  - No requerir recarga manual de página



# REQUERIMIENTOS NO FUNCIONALES
## Sistema Nacional de Gestión de Listas de Chequeo Precontractuales para el SENA

### RNF-001: RENDIMIENTO Y PERFORMANCE

#### RNF-001.1 Tiempo de Respuesta
- **Descripción**: El sistema debe proporcionar respuestas rápidas para mantener una buena experiencia de usuario.
- **Criterios de Aceptación**:
  - Endpoints API REST: < 200ms para consultas simples
  - Endpoints API REST: < 500ms para consultas con joins complejos
  - Carga de archivos: feedback inmediato, procesamiento asíncrono
  - Validación IA: hasta 60 segundos (procesamiento asíncrono)
  - Dashboard: carga inicial < 2 segundos

#### RNF-001.2 Escalabilidad
- **Descripción**: El sistema debe poder crecer según la demanda sin rediseño arquitectural.
- **Criterios de Aceptación**:
  - Soportar mínimo 100 centros de formación simultáneamente
  - Soportar mínimo 10,000 usuarios concurrentes
  - Soportar carga de 1,000 documentos por hora en picos
  - Base de datos debe escalar verticalmente hasta cierto límite
  - Código preparado para escalado horizontal (stateless)
  - Uso de índices en columnas regional_id, centro_id para optimizar consultas multi-tenant

#### RNF-001.3 Optimización de Consultas Multi-Tenant
- **Descripción**: Las consultas deben estar optimizadas para arquitectura Single-DB con separación lógica.
- **Criterios de Aceptación**:
  - Todos los queries deben incluir filtros por regional_id y/o centro_id
  - Índices compuestos en tablas principales (centro_id + created_at, usuario_id + centro_id)
  - Uso de scopes en Sequelize para filtrado automático
  - Evitar N+1 queries mediante eager loading

### RNF-002: DISPONIBILIDAD Y CONFIABILIDAD

#### RNF-002.1 Disponibilidad del Sistema
- **Descripción**: El sistema debe estar operativo la mayor parte del tiempo.
- **Criterios de Aceptación**:
  - Disponibilidad objetivo: 99.5% (SLA)
  - Máximo 3.65 horas de downtime mensual planificado
  - Ventanas de mantenimiento programadas en horarios de baja actividad
  - Monitoreo 24/7 con alertas automáticas

#### RNF-002.2 Tolerancia a Fallos
- **Descripción**: El sistema debe continuar operando ante fallos parciales.
- **Criterios de Aceptación**:
  - Si el servicio de IA falla, el sistema debe permitir carga de documentos sin validación automática
  - Si el servicio de email falla, las notificaciones deben quedar en cola para reintento
  - Transacciones de base de datos con rollback automático en caso de error
  - Logs detallados de errores para debugging
  - Manejo gracioso de errores con mensajes informativos al usuario

#### RNF-002.3 Manejo de Concurrencia
- **Descripción**: El sistema debe manejar correctamente operaciones concurrentes.
- **Criterios de Aceptación**:
  - Uso de transacciones para operaciones críticas
  - Optimistic locking para prevenir conflictos de actualización
  - Control de versiones en documentos para evitar sobrescrituras
  - Manejo de race conditions en aprobación/rechazo simultáneo

### RNF-003: SEGURIDAD

#### RNF-003.1 Autenticación y Autorización
- **Descripción**: El sistema debe proteger el acceso mediante mecanismos robustos.
- **Criterios de Aceptación**:
  - Contraseñas encriptadas con bcrypt (mínimo 10 rounds)
  - JWT con firma HMAC SHA-256 o RSA
  - Tokens con expiración configurable (default 8 horas)
  - Refresh tokens para renovación de sesión
  - Middleware de autorización en todas las rutas protegidas
  - Validación de rol y centro en cada operación
  - Prevención de acceso cross-tenant mediante validación estricta

#### RNF-003.2 Protección contra Vulnerabilidades
- **Descripción**: El sistema debe estar protegido contra ataques comunes.
- **Criterios de Aceptación**:
  - Protección contra SQL Injection (uso de ORM Sequelize con queries parametrizadas)
  - Protección contra XSS (sanitización de inputs, CSP headers)
  - Protección contra CSRF (tokens CSRF en formularios)
  - Rate limiting en endpoints de autenticación (5 intentos por minuto)
  - Validación estricta de tipos MIME en archivos cargados
  - Headers de seguridad (HSTS, X-Content-Type-Options, X-Frame-Options)
  - Sanitización de nombres de archivo antes de almacenar

#### RNF-003.3 Privacidad de Datos
- **Descripción**: Los datos personales deben estar protegidos según normativas.
- **Criterios de Aceptación**:
  - Separación lógica estricta: usuarios solo ven datos de sus centros
  - Archivos almacenados fuera del webroot o con acceso controlado
  - URLs de archivos con tokens de acceso temporal
  - Encriptación de datos sensibles en reposo (opcional para MVP)
  - Logs de auditoría para acceso a datos personales
  - Cumplimiento de Ley de Protección de Datos Personales de Colombia

### RNF-004: USABILIDAD

#### RNF-004.1 Experiencia de Usuario
- **Descripción**: La interfaz debe ser intuitiva y fácil de usar.
- **Criterios de Aceptación**:
  - Formularios con validación en tiempo real
  - Mensajes de error claros y accionables
  - Indicadores de progreso para operaciones largas
  - Confirmaciones para acciones destructivas
  - Ayuda contextual en formularios complejos
  - Accesibilidad básica (WCAG 2.1 nivel A)

#### RNF-004.2 Responsive Design
- **Descripción**: La interfaz debe adaptarse a diferentes dispositivos y resoluciones.
- **Criterios de Aceptación**:
  - Funcional en dispositivos móviles (smartphones, tablets)
  - Funcional en desktop (1920x1080 y superiores)
  - Uso de diseño responsive con TailwindCSS (frontend futuro)
  - Navegación adaptable según tamaño de pantalla
  - Formularios y tablas legibles en dispositivos móviles

#### RNF-004.3 Internacionalización
- **Descripción**: El sistema debe estar preparado para múltiples idiomas (futuro).
- **Criterios de Aceptación**:
  - Interfaz inicial en español colombiano
  - Estructura de código preparada para i18n
  - Separación de textos estáticos del código
  - Formato de fechas y números según locale

### RNF-005: COMPATIBILIDAD

#### RNF-005.1 Navegadores Web
- **Descripción**: El sistema debe funcionar en navegadores web modernos.
- **Criterios de Aceptación**:
  - Chrome/Edge (últimas 2 versiones)
  - Firefox (últimas 2 versiones)
  - Safari (últimas 2 versiones en macOS/iOS)
  - Advertencia para navegadores no soportados (IE11)

#### RNF-005.2 Integraciones Externas
- **Descripción**: Compatibilidad con sistemas externos requeridos.
- **Criterios de Aceptación**:
  - **Integración con ACIA (Sistema Externo del SENA - Solo Lectura)**:
    - Consulta/verificación de usuarios por número de documento
    - Recuperación de datos básicos de usuarios existentes (nombre, correo)
    - Timeout: 10 segundos para consultas
    - Retry logic: 1 reintento con backoff de 2 segundos
    - Si ACIA no responde, continuar sin bloquear el flujo
    - No hay escritura en ACIA (sin registro ni sincronización bidireccional)
  - **Integración con servicio OCR/NLP**:
    - Extracción de texto y datos de documentos
    - Validación de correspondencia de documentos
    - Extracción de fechas de documentos
  - **Integración con servicio de email**: SMTP, SendGrid, o similar
  - **Integración con AWS S3** o compatible (MinIO)
  - Integraciones configurables mediante variables de entorno
  - Timeouts configurables para servicios externos
  - Circuit breaker para prevenir cascading failures
  - Health checks para monitorear disponibilidad de ACIA

#### RNF-005.3 Formato de Datos
- **Descripción**: El sistema debe manejar formatos de datos estándar.
- **Criterios de Aceptación**:
  - API REST con formato JSON
  - Opcionalmente JSON:API para estructura consistente
  - Archivos: PDF, DOCX, JPG, PNG
  - Exportaciones: PDF, Excel (.xlsx), CSV
  - Timestamps en formato ISO 8601 (UTC)

### RNF-006: MANTENIBILIDAD

#### RNF-006.1 Código Limpio y Documentación
- **Descripción**: El código debe ser mantenible y bien documentado.
- **Criterios de Aceptación**:
  - Uso de ESLint para mantener estándares de código
  - Comentarios en funciones complejas
  - README con instrucciones de instalación y configuración
  - Documentación de API con Swagger/OpenAPI
  - Variables de entorno documentadas en .env.example
  - Nombres descriptivos para variables, funciones y archivos

#### RNF-006.2 Modularidad y Arquitectura
- **Descripción**: El sistema debe tener una arquitectura modular y extensible.
- **Criterios de Aceptación**:
  - Arquitectura en capas: Controllers → Services → Repositories → Models
  - Separación de responsabilidades (SoC)
  - Middleware reutilizables para validación y autorización
  - Configuración centralizada
  - Fácil adición de nuevos endpoints sin afectar existentes
  - Código preparado para testing (dependency injection)

#### RNF-006.3 Control de Versiones
- **Descripción**: El código debe estar bajo control de versiones con buenas prácticas.
- **Criterios de Aceptación**:
  - Uso de Git con commits descriptivos
  - Branching strategy (main/develop/feature branches)
  - Pull requests para cambios significativos
  - .gitignore apropiado (node_modules, .env, uploads)
  - Tags para versiones de release

#### RNF-006.4 Testing
- **Descripción**: El sistema debe tener cobertura de testing adecuada.
- **Criterios de Aceptación**:
  - Tests unitarios para servicios críticos (mínimo 60% cobertura)
  - Tests de integración para endpoints principales
  - Tests de validación de schemas
  - Uso de frameworks de testing (Jest, Mocha)
  - Mock de servicios externos en tests

---

# ANEXO: ENTIDADES PRINCIPALES Y RELACIONES

## Entidades del Sistema

### 1. Regional
**Descripción**: Representa las regionales del SENA a nivel nacional.

**Campos principales**:
- `id` (PK): Identificador único
- `nombre`: Nombre de la regional
- `codigo`: Código único de la regional
- `activo`: Estado (activo/inactivo)
- `created_at`, `updated_at`: Timestamps

**Relaciones**:
- Una Regional tiene muchos CentrosFormacion (1:N)

---

### 2. CentroFormacion
**Descripción**: Representa los centros de formación asociados a cada regional.

**Campos principales**:
- `id` (PK): Identificador único
- `nombre`: Nombre del centro de formación
- `codigo`: Código único del centro
- `regional_id` (FK): Referencia a Regional
- `activo`: Estado (activo/inactivo)
- `created_at`, `updated_at`: Timestamps

**Relaciones**:
- Un CentroFormacion pertenece a una Regional (N:1)
- Un CentroFormacion tiene muchos Usuarios a través de UsuarioCentro (N:M)
- Un CentroFormacion tiene muchos Documentos (1:N)

---

### 3. Usuario
**Descripción**: Representa los usuarios del sistema (instructores/contratistas, revisores, administradores).

**Campos principales**:
- `id` (PK): Identificador único
- `nombre_completo`: Nombre completo del usuario
- `tipo_documento`: Tipo de documento (CC, CE, NIT)
- `numero_documento`: Número de documento (único)
- `correo`: Correo electrónico (único)
- `password`: Contraseña encriptada (bcrypt)
- `rol`: Rol del usuario (ENUM: 'usuario', 'revisor', 'administrador_centro', 'director_regional', 'admin')
- `regional_id` (FK, nullable): Referencia a Regional (obligatorio para director_regional)
- `activo`: Estado (activo/inactivo)
- `encontrado_en_acia`: Indica si el usuario fue encontrado en ACIA durante el registro (boolean, default: false)
- `fecha_verificacion_acia`: Timestamp de consulta a ACIA durante el registro (nullable)
- `ultimo_cambio_password`: Timestamp del último cambio de contraseña
- `intentos_fallidos`: Contador de intentos de login fallidos
- `bloqueado_hasta`: Timestamp de bloqueo temporal
- `created_at`, `updated_at`: Timestamps
- `created_by` (FK, nullable): Usuario que creó este usuario

**Roles del Sistema**:
1. **usuario**: Instructor o contratista que carga documentos
2. **revisor**: Revisa y aprueba/rechaza documentos de su(s) centro(s)
3. **administrador_centro**: Administra un centro específico
4. **director_regional**: Administra todos los centros de una regional
5. **admin**: Administrador nacional con acceso completo

**Relaciones**:
- Un Usuario puede pertenecer a muchos CentrosFormacion a través de UsuarioCentro (N:M)
- Un Usuario (director_regional) puede pertenecer a una Regional (N:1, opcional)
- Un Usuario tiene muchos Documentos como propietario (1:N)
- Un Usuario (como revisor) tiene muchas Revisiones (1:N)
- Un Usuario puede ser creador de otros Usuarios (1:N, self-reference)

**Índices importantes**:
- Único: `numero_documento`, `correo`
- Compuesto: `rol` + `activo`
- Índice: `regional_id` (para directores regionales)

**Reglas de Negocio**:
- Si rol = 'director_regional', `regional_id` debe estar presente
- Si rol = 'administrador_centro', debe tener exactamente un centro asignado
- Si rol = 'admin', no requiere `regional_id` ni centros específicos
- Usuarios, revisores pueden tener múltiples centros asignados

---

### 4. UsuarioCentro (Tabla Pivote)
**Descripción**: Relación muchos-a-muchos entre Usuarios y CentrosFormacion.

**Campos principales**:
- `id` (PK): Identificador único
- `usuario_id` (FK): Referencia a Usuario
- `centro_id` (FK): Referencia a CentroFormacion
- `created_at`: Timestamp de asignación

**Relaciones**:
- Conecta Usuario con CentroFormacion (N:M)

**Índices importantes**:
- Único compuesto: `usuario_id` + `centro_id`
- Índice: `centro_id` para consultas inversas

---

### 5. ListaChequeo
**Descripción**: Catálogo de documentos que se requieren en el proceso precontractual.

**Campos principales**:
- `id` (PK): Identificador único
- `nombre_item`: Nombre del documento/ítem
- `descripcion`: Descripción detallada del documento requerido
- `orden`: Orden de presentación (número secuencial)
- `obligatorio`: Si es obligatorio o no (boolean)
- `activo`: Estado (activo/inactivo)
- `created_at`, `updated_at`: Timestamps
- `created_by` (FK, opcional): Usuario administrador que lo creó

**Relaciones**:
- Una ListaChequeo tiene muchos Documentos (1:N)

**Índices importantes**:
- Índice: `activo` + `orden` para consultas optimizadas

---

### 6. Documento
**Descripción**: Representa los documentos cargados por los usuarios.

**Campos principales**:
- `id` (PK): Identificador único
- `usuario_id` (FK): Referencia a Usuario propietario
- `centro_id` (FK): Referencia a CentroFormacion
- `lista_chequeo_id` (FK): Referencia a ListaChequeo
- `ruta_archivo`: Ruta o URL del archivo almacenado
- `nombre_archivo_original`: Nombre original del archivo
- `mime_type`: Tipo MIME del archivo
- `tamanio_bytes`: Tamaño del archivo en bytes
- `estado`: Estado del documento (pendiente, en_revision, aprobado, rechazado)
- `observaciones`: Observaciones del revisor (opcional)
- `metadata_json`: Metadatos de validación IA (JSON)
- `version`: Número de versión del documento
- `documento_anterior_id` (FK, opcional): Referencia a versión anterior
- **`fecha_documento`**: Fecha del documento físico (fecha de expedición/emisión ingresada por usuario) (nullable)
- **`fecha_vencimiento`**: Fecha de vencimiento del documento si aplica (nullable)
- **`fecha_documento_extraida`**: Fecha extraída por IA del documento (nullable, para comparación)
- **`fecha_vencimiento_extraida`**: Fecha de vencimiento extraída por IA (nullable, para comparación)
- **`alerta_fechas_discrepantes`**: Indica si hay discrepancia entre fechas ingresadas y extraídas (boolean, default: false)
- `fecha_carga`: Timestamp de carga del archivo (equivalente a created_at)
- `fecha_envio`: Timestamp de envío a revisión
- `fecha_revision`: Timestamp de última revisión
- `created_at`, `updated_at`: Timestamps

**Relaciones**:
- Un Documento pertenece a un Usuario (N:1)
- Un Documento pertenece a un CentroFormacion (N:1)
- Un Documento pertenece a un ítem de ListaChequeo (N:1)
- Un Documento tiene muchas Revisiones (1:N)
- Un Documento puede tener un documento anterior (self-reference)

**Índices importantes**:
- Compuesto: `centro_id` + `estado` + `created_at`
- Compuesto: `usuario_id` + `centro_id` + `lista_chequeo_id`
- Índice: `estado` para filtros

---

### 7. Revision
**Descripción**: Representa las revisiones realizadas por revisores sobre documentos.

**Campos principales**:
- `id` (PK): Identificador único
- `documento_id` (FK): Referencia a Documento
- `revisor_id` (FK): Referencia a Usuario (rol revisor)
- `centro_id` (FK): Referencia a CentroFormacion (para separación lógica)
- `fecha_revision`: Timestamp de la revisión
- `estado_revision`: Estado de la revisión (aprobado, rechazado)
- `comentario`: Comentarios del revisor
- `tiempo_revision_minutos`: Tiempo que tomó la revisión
- `created_at`: Timestamp

**Relaciones**:
- Una Revision pertenece a un Documento (N:1)
- Una Revision pertenece a un Revisor/Usuario (N:1)
- Una Revision pertenece a un CentroFormacion (N:1)

**Índices importantes**:
- Índice: `documento_id` para historial
- Índice: `revisor_id` + `fecha_revision` para estadísticas
- Índice: `centro_id` para separación lógica

---

### 8. Auditoria (Opcional pero Recomendada)
**Descripción**: Registro inmutable de todas las operaciones críticas del sistema.

**Campos principales**:
- `id` (PK): Identificador único
- `usuario_id` (FK): Usuario que realizó la acción
- `accion`: Tipo de acción (login, crear_usuario, aprobar_documento, etc.)
- `entidad_afectada`: Tabla afectada
- `entidad_id`: ID del registro afectado
- `datos_anteriores`: JSON con datos antes del cambio
- `datos_nuevos`: JSON con datos después del cambio
- `ip_address`: Dirección IP del usuario
- `user_agent`: User agent del navegador
- `created_at`: Timestamp (inmutable)

**Relaciones**:
- Una Auditoria puede referenciar a un Usuario (N:1, opcional)

**Índices importantes**:
- Índice: `usuario_id` + `created_at`
- Índice: `entidad_afectada` + `entidad_id`
- Índice: `created_at` para consultas temporales

---

## Diagrama de Relaciones

```
Regional (1) ──────< (N) CentroFormacion
   │                       │
   │                       │
   │                       ├──────< (N) UsuarioCentro >────── (N) Usuario
   │                       │                                     │
   │                       │                                     │
   │                       └──────< (N) Documento               │
   │                                  │                          │
   │                                  ├──< (N) Revision ─────────┘
   │                                  │
   │                                  └──< (1) ListaChequeo
   │
   └──< (N) Usuario (director_regional)

Usuario (revisor/admin) ──────< (N) Revision ────> (1) Documento
Usuario (admin) ──────< (N) ListaChequeo (created_by)
Usuario (admin/director/admin_centro) ──────< (N) Usuario (created_by)
```

## Matriz de Permisos por Rol

| Funcionalidad | Usuario | Revisor | Admin Centro | Director Regional | Admin Nacional |
|--------------|---------|---------|--------------|-------------------|----------------|
| **Gestión de Documentos** |
| Cargar documentos propios | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver documentos propios | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver documentos de otros (centro) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Ver documentos de otros (regional) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ver documentos de todos | ❌ | ❌ | ❌ | ❌ | ✅ |
| Revisar/Aprobar documentos | ❌ | ✅ Centro(s) | ✅ Su centro | ✅ Su regional | ✅ Todos |
| **Gestión de Usuarios** |
| Ver usuarios de su centro | ❌ | ✅ | ✅ | ✅ | ✅ |
| Ver usuarios de su regional | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ❌ | ❌ | ✅ |
| Crear usuarios (básicos) | ❌ | ❌ | ✅ Su centro | ✅ Su regional | ✅ Todos |
| Crear admin centro | ❌ | ❌ | ❌ | ✅ Su regional | ✅ Todos |
| Crear director regional | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cambiar roles | ❌ | ❌ | ✅ Limitado | ✅ Limitado | ✅ Sin límites |
| Desactivar usuarios | ❌ | ❌ | ✅ Su centro | ✅ Su regional | ✅ Todos |
| **Gestión de Estructura** |
| Ver regionales | ❌ | ❌ | ❌ | ✅ La suya | ✅ Todas |
| Crear/editar regionales | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ver centros | ❌ | ✅ Los suyos | ✅ El suyo | ✅ Su regional | ✅ Todos |
| Crear/editar centros | ❌ | ❌ | ❌ | ✅ Su regional | ✅ Todos |
| **Lista de Chequeo** |
| Ver lista de chequeo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crear/editar ítems | ❌ | ❌ | ❌ | ❌ | ✅ |
| Reordenar ítems | ❌ | ❌ | ❌ | ❌ | ✅ |
| Activar/desactivar ítems | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Reportes y Estadísticas** |
| Dashboard personal | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard de centro | ❌ | ✅ Sus centros | ✅ Su centro | ✅ Su regional | ✅ Todos |
| Dashboard regional | ❌ | ❌ | ❌ | ✅ Su regional | ✅ Todas |
| Dashboard nacional | ❌ | ❌ | ❌ | ❌ | ✅ |
| Exportar reportes | ✅ Propio | ✅ Sus centros | ✅ Su centro | ✅ Su regional | ✅ Todos |
| **Configuración del Sistema** |
| Cambiar configuración global | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ver auditoría | ❌ | ❌ | ✅ Su centro | ✅ Su regional | ✅ Completa |

**Leyenda**:
- ✅ = Permiso completo
- ❌ = Sin permiso
- ✅ [Alcance] = Permiso limitado al alcance especificado

---

## Consideraciones de Arquitectura Multi-Tenant

### Separación Lógica (Single-DB)
Todas las tablas que contienen datos operacionales deben incluir `centro_id` y/o `regional_id` para mantener la separación lógica:

**Tablas con `centro_id`**:
- `Documento`
- `Revision`
- `UsuarioCentro`

**Tablas con `regional_id`**:
- `CentroFormacion`

**Tablas globales (sin tenant)**:
- `Regional`
- `ListaChequeo` (es global para toda la organización)
- `Usuario` (el usuario está asociado a centros mediante UsuarioCentro)
- `Auditoria` (contiene registros de todos los tenants)

### Scopes de Sequelize
Se deben implementar scopes automáticos en los modelos para filtrar por `centro_id`:

```javascript
// Ejemplo conceptual
Document.addScope('defaultScope', {
  where: {
    centro_id: getCurrentCentroId() // Función que obtiene centro del contexto
  }
}, { override: true });
```

### Índices para Performance Multi-Tenant
Todos los queries que filtren por `centro_id` deben usar índices compuestos:
- `(centro_id, estado, created_at)` en Documento
- `(centro_id, usuario_id)` en Documento
- `(usuario_id, centro_id)` en UsuarioCentro

---

## Stack Tecnológico

**Backend**:
- Node.js + Express
- Sequelize (ORM)
- MySQL (Base de datos)
- JWT (Autenticación)
- bcrypt (Encriptación de contraseñas)
- Multer o similar (Carga de archivos)

**Almacenamiento**:
- Filesystem local o AWS S3/MinIO (configurable)

**Integraciones**:
- **ACIA API**: Consulta/verificación de usuarios en sistema externo SENA (solo lectura)
- **Servicio OCR/NLP**: Extracción de datos y fechas de documentos (placeholder)
- **SMTP o servicio de email**: SendGrid, Nodemailer, etc.

**Frontend (futuro)**:
- React + TailwindCSS

**Documentación**:
- Swagger/OpenAPI para documentación de API

---

## Flujos Principales del Sistema por Rol

### 1. Flujo de Usuario (Instructor/Contratista)

**Registro con Consulta Opcional a ACIA**:
1. Usuario accede al formulario de registro
2. Usuario ingresa tipo y número de documento
3. Sistema consulta ACIA para verificar si el usuario existe (opcional, no bloquea si falla)
4. **Escenario A - Usuario encontrado en ACIA**:
   - Sistema recupera datos básicos de ACIA (nombre, correo)
   - Formulario se pre-llena con datos de ACIA
   - Usuario confirma/edita datos y establece contraseña
   - Sistema crea cuenta local
   - Marca usuario como `encontrado_en_acia = true`
   - **Usuario puede cargar documentos inmediatamente**
5. **Escenario B - Usuario NO encontrado en ACIA o ACIA no disponible**:
   - Sistema muestra formulario completo vacío
   - Usuario completa todos los campos manualmente
   - Sistema crea cuenta local
   - Marca usuario como `encontrado_en_acia = false`
   - **Usuario puede cargar documentos inmediatamente**
6. Administrador (centro/regional/nacional) asigna rol y centro(s) al nuevo usuario
7. Usuario recibe notificación de cuenta creada
8. **Nota importante**: ACIA es solo para consulta. No se registra nada en ACIA, solo se consulta.

**Inicio de Sesión**:
1. Usuario inicia sesión con correo/documento y contraseña
2. Usuario selecciona centro activo (si tiene múltiples)
3. Sistema genera JWT con contexto (usuario, rol, centro, regional)

**Carga de Documentos con Fechas**:
1. Usuario accede a su dashboard personal
2. Sistema muestra lista de chequeo dinámica con ítems activos
3. Usuario visualiza estado de cada documento (pendiente/cargado/aprobado/rechazado)
4. Usuario selecciona un ítem para cargar
5. **Formulario de carga**:
   - Usuario selecciona archivo (PDF, JPG, PNG, DOCX)
   - Sistema solicita fecha del documento (opcional según configuración):
     - Fecha de expedición/emisión del documento
     - Fecha de vencimiento (si aplica)
   - Usuario puede ver descripción de qué fecha se solicita
   - Usuario ingresa fechas correspondientes
6. Sistema valida formato, tamaño y fechas (formato válido, no futuras, etc.)
7. Sistema almacena archivo con fechas ingresadas
8. Sistema envía a servicio IA para validación automática:
   - Extracción de datos del documento
   - **Extracción de fechas del documento**
   - **Comparación de fechas ingresadas vs extraídas**
   - Si hay discrepancia > 2 días: marca alerta
9. Usuario visualiza resultado de validación IA (si está activa)
10. Usuario visualiza progreso de completitud
11. Usuario completa todos los documentos obligatorios
12. Usuario envía documentación completa a revisión
13. Sistema notifica a revisores del centro
14. Usuario recibe notificaciones de aprobaciones/rechazos
15. Si documento rechazado:
    - Usuario visualiza observaciones del revisor
    - Usuario recarga documento con fechas actualizadas si es necesario
    - Versión anterior se mantiene para auditoría

### 2. Flujo de Revisor

**Revisión de Documentos con Validación de Fechas**:
1. Revisor inicia sesión y selecciona centro activo (si tiene múltiples)
2. Revisor accede a panel de revisión de su centro
3. Sistema muestra documentos en estado "en revisión" (FIFO)
4. Sistema destaca documentos con alertas (ej: fechas discrepantes)
5. Revisor aplica filtros (usuario, tipo de documento, fecha, con/sin alertas)
6. Revisor selecciona documento para revisar
7. **Sistema muestra información completa**:
   - Archivo del documento (visualización/descarga)
   - **Fechas ingresadas por el usuario**:
     - Fecha del documento: 15/03/2020
     - Fecha de vencimiento: 15/03/2030
   - **Fechas extraídas por IA** (si está activa):
     - Fecha extraída: 15/03/2020 ✓
     - Fecha vencimiento extraída: 15/03/2030 ✓
     - Nivel de confianza: 92%
   - **Alertas de fechas**:
     - ⚠️ "Fecha discrepante: Usuario ingresó 15/03/2020, IA detectó 20/04/2020"
   - Metadatos adicionales de IA
   - Historial de versiones anteriores
   - Observaciones de revisiones previas (si es recarga)
8. Revisor verifica visualmente las fechas en el documento
9. Revisor decide: aprobar o rechazar
   - **Aprobar**: 
     - Comentario opcional
     - Confirmar que fechas son correctas
     - Documento pasa a "aprobado"
   - **Rechazar**: 
     - Comentario obligatorio (ej: "La fecha de expedición es incorrecta, debe ser 20/04/2020")
     - Indicar si es problema de fecha u otro
     - Documento pasa a "rechazado"
10. Sistema registra revisión en tabla Revision
11. Sistema notifica al usuario de la decisión con detalles
12. Revisor visualiza estadísticas de su actividad

### 3. Flujo de Administrador de Centro

**Gestión de Centro**:
1. Admin de Centro inicia sesión (contexto automático a su centro)
2. Accede a dashboard con estadísticas de su centro
3. Visualiza usuarios, documentos y revisiones de su centro

**Gestión de Usuarios del Centro**:
1. Crea nuevos usuarios (rol: usuario o revisor)
2. Usuarios creados se asignan automáticamente a su centro
3. Edita información de usuarios existentes de su centro
4. Cambia roles entre usuario y revisor
5. Desactiva usuarios de su centro
6. Resetea contraseñas de usuarios de su centro

**Revisión de Documentos**:
- Tiene mismos permisos que revisor para su centro
- Puede revisar y aprobar/rechazar documentos

**Reportes**:
1. Visualiza reportes del centro
2. Compara con promedios regionales/nacionales
3. Exporta reportes de su centro

### 4. Flujo de Director Regional

**Vista Regional**:
1. Director Regional inicia sesión
2. Puede seleccionar vista regional o centro específico
3. Accede a dashboard con estadísticas de toda su regional

**Gestión de Centros**:
1. Visualiza todos los centros de su regional
2. Crea nuevos centros en su regional
3. Edita información de centros existentes
4. Activa/desactiva centros de su regional

**Gestión de Usuarios de la Regional**:
1. Visualiza usuarios de todos los centros de su regional
2. Crea usuarios con roles: usuario, revisor, administrador_centro
3. Asigna usuarios a centros de su regional (pueden ser múltiples)
4. Crea administradores de centro para gestionar centros específicos
5. Cambia roles dentro de los permitidos
6. Desactiva usuarios de su regional
7. Resetea contraseñas de usuarios de su regional

**Supervisión de Documentos**:
1. Visualiza documentos de todos los centros de su regional
2. Puede revisar y aprobar/rechazar documentos si es necesario
3. Identifica cuellos de botella en revisión
4. Puede delegar revisiones o reasignar cargas

**Reportes Regionales**:
1. Visualiza dashboard consolidado de la regional
2. Compara performance entre centros de su regional
3. Identifica centros con mejor/peor desempeño
4. Exporta reportes regionales
5. Compara su regional con promedios nacionales

### 5. Flujo de Administrador Nacional

**Gestión Nacional**:
1. Admin Nacional inicia sesión (acceso global sin restricciones)
2. Accede a dashboard nacional con todas las estadísticas

**Gestión de Estructura Organizacional**:
1. Crea y edita regionales
2. Crea y edita centros de cualquier regional
3. Visualiza estructura completa del SENA

**Gestión de Lista de Chequeo Nacional**:
1. Accede a administración de lista de chequeo
2. Crea nuevos ítems de documentos requeridos
3. Edita ítems existentes (nombre, descripción, obligatorio)
4. Reordena ítems (drag-and-drop)
5. Activa/desactiva ítems según necesidad
6. Cambios se reflejan inmediatamente en todos los formularios

**Gestión de Usuarios Global**:
1. Visualiza todos los usuarios del sistema
2. Crea usuarios de cualquier rol (incluyendo directores regionales)
3. Asigna directores regionales a regionales
4. Asigna usuarios a centros de cualquier regional
5. Cambia roles sin restricciones
6. Desactiva cualquier usuario
7. Resetea contraseñas de cualquier usuario

**Configuración del Sistema**:
1. Configura parámetros globales (tamaño de archivos, formatos, etc.)
2. Configura servicios externos (IA, email, almacenamiento)
3. Configura tiempos de expiración de tokens
4. Activa/desactiva validación IA

**Supervisión y Auditoría**:
1. Visualiza estadísticas nacionales consolidadas
2. Compara performance entre regionales
3. Identifica tendencias y patrones
4. Accede a logs de auditoría completos
5. Exporta reportes nacionales
6. Toma decisiones estratégicas basadas en datos

### 6. Jerarquía de Roles y Alcances

```
Admin Nacional (Alcance: TODO EL SISTEMA)
    │
    ├── Gestiona → Todas las Regionales
    │
    └── Crea → Directores Regionales
              │
              └── Director Regional (Alcance: UNA REGIONAL)
                      │
                      ├── Gestiona → Todos los Centros de su Regional
                      │
                      └── Crea → Administradores de Centro
                                │
                                └── Administrador de Centro (Alcance: UN CENTRO)
                                        │
                                        ├── Gestiona → Su Centro
                                        │
                                        └── Crea → Usuarios y Revisores
                                                  │
                                                  ├── Usuario (Instructor/Contratista)
                                                  │   └── Carga documentos
                                                  │
                                                  └── Revisor
                                                      └── Revisa documentos
```

---

*Documento actualizado: Octubre 7, 2025*
*Sistema Nacional de Gestión de Listas de Chequeo Precontractuales - SENA*
