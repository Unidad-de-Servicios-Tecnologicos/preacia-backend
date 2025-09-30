# REQUERIMIENTOS FUNCIONALES
## Sistema de Gestión Documental para Contratación Interna

### RF-001: VERIFICACIÓN DE USUARIOS

#### RF-001.1 Verificación por Documento de Identidad
- **Descripción**: El sistema debe permitir que los usuarios ingresen su número de documento de identidad para verificar su registro en el sistema externo ACIA.
- **Entradas**: Número de documento de identidad
- **Proceso**: Consulta a API de ACIA para verificar existencia del usuario
- **Salidas**: Estado de verificación (registrado/no registrado)
- **Criterios de Aceptación**:
  - El sistema debe validar el formato del documento antes de realizar la consulta
  - Debe mostrar mensaje de error si el documento no es válido
  - Debe manejar timeouts y errores de conexión con ACIA

#### RF-001.2 Validación de Convocatoria Activa
- **Descripción**: El sistema debe verificar que la convocatoria esté dentro del rango de fechas habilitado para carga de documentos.
- **Entradas**: Fecha actual, rango de fechas de convocatoria
- **Proceso**: Comparación de fechas
- **Salidas**: Estado de convocatoria (activa/inactiva)
- **Criterios de Aceptación**:
  - Debe considerar fecha y hora exacta
  - Debe mostrar mensaje informativo sobre el estado de la convocatoria

#### RF-001.3 Registro de Usuario No Encontrado
- **Descripción**: Si el usuario no está registrado en ACIA, el sistema debe habilitar un formulario de registro.
- **Entradas**: Datos personales, credenciales de acceso
- **Proceso**: Registro en ACIA via API, creación de usuario local
- **Salidas**: Usuario registrado y habilitado
- **Criterios de Aceptación**:
  - Todos los campos obligatorios deben ser completados
  - Las credenciales deben cumplir políticas de seguridad
  - Debe confirmar registro exitoso en ACIA antes de proceder

### RF-002: AUTENTICACIÓN Y AUTORIZACIÓN

#### RF-002.1 Inicio de Sesión
- **Descripción**: El sistema debe autenticar usuarios con diferentes roles mediante credenciales.
- **Entradas**: Usuario/email y contraseña
- **Proceso**: Verificación de credenciales, generación de token JWT
- **Salidas**: Sesión iniciada, redirección según rol
- **Criterios de Aceptación**:
  - Máximo 3 intentos fallidos antes de bloquear temporalmente
  - Token con tiempo de expiración configurable
  - Registro de intentos de acceso

#### RF-002.2 Recuperación de Contraseña
- **Descripción**: Los usuarios deben poder restablecer su contraseña mediante email.
- **Entradas**: Email registrado
- **Proceso**: Envío de enlace temporal de restablecimiento
- **Salidas**: Nueva contraseña establecida
- **Criterios de Aceptación**:
  - Enlace con expiración máxima de 24 horas
  - Nueva contraseña debe cumplir políticas de seguridad

#### RF-002.3 Cambio de Contraseña
- **Descripción**: Los usuarios autenticados deben poder cambiar su contraseña.
- **Entradas**: Contraseña actual, nueva contraseña
- **Proceso**: Validación de contraseña actual, actualización
- **Salidas**: Contraseña actualizada
- **Criterios de Aceptación**:
  - Debe verificar contraseña actual antes del cambio
  - Nueva contraseña no puede ser igual a las últimas 5 utilizadas

### RF-003: GESTIÓN DE ROLES Y PERMISOS

#### RF-003.1 Asignación de Roles
- **Descripción**: Los administradores deben poder asignar roles a usuarios del sistema.
- **Entradas**: Usuario objetivo, rol a asignar
- **Proceso**: Actualización de permisos en base de datos
- **Salidas**: Rol asignado exitosamente
- **Criterios de Aceptación**:
  - Solo administradores pueden asignar roles
  - Cambios deben reflejarse inmediatamente en el sistema

#### RF-003.2 Gestión Dinámica de Permisos
- **Descripción**: El sistema debe permitir modificar permisos de roles.
- **Entradas**: Rol, lista de permisos
- **Proceso**: Actualización de matriz de permisos
- **Salidas**: Permisos actualizados
- **Criterios de Aceptación**:
  - Usuarios afectados deben ser notificados de cambios
  - Sesiones activas deben reflejar nuevos permisos

### RF-004: GESTIÓN DE DOCUMENTOS REQUERIDOS

#### RF-004.1 Configuración de Lista de Documentos
- **Descripción**: Los administradores deben poder definir y modificar la lista de documentos obligatorios.
- **Entradas**: Nombre del documento, descripción, tipo de usuario (instructor/administrativo)
- **Proceso**: Creación/actualización en catálogo de documentos
- **Salidas**: Documento agregado/modificado en lista
- **Criterios de Aceptación**:
  - Debe permitir duplicados para diferentes convocatorias
  - Cambios deben quedar registrados en auditoría

#### RF-004.2 Ordenamiento de Documentos
- **Descripción**: El sistema debe permitir cambiar el orden de presentación de documentos.
- **Entradas**: Lista de documentos con nuevo orden
- **Proceso**: Actualización de secuencia en base de datos
- **Salidas**: Nuevo orden aplicado
- **Criterios de Aceptación**:
  - Cambios deben reflejarse inmediatamente en interfaz de usuario
  - Debe mantener consistencia en todas las sesiones activas

#### RF-004.3 Activación/Desactivación de Documentos
- **Descripción**: Los administradores deben poder activar o desactivar documentos específicos por convocatoria.
- **Entradas**: ID de documento, ID de convocatoria, estado (activo/inactivo)
- **Proceso**: Actualización de estado en relación documento-convocatoria
- **Salidas**: Estado modificado exitosamente
- **Criterios de Aceptación**:
  - Documentos inactivos no deben aparecer en formulario de carga
  - Debe mantener historial de cambios por convocatoria


### RF-005: CARGA Y VALIDACIÓN DOCUMENTAL

#### RF-005.1 Interfaz de Carga Paso a Paso
- **Descripción**: El sistema debe presentar un formulario wizard para la carga de documentos.
- **Entradas**: Archivos de documentos
- **Proceso**: Navegación secuencial por documentos requeridos
- **Salidas**: Documentos cargados exitosamente
- **Criterios de Aceptación**:
  - Debe mostrar progreso de completitud
  - Permitir navegación hacia adelante y atrás
  - Guardar progreso automáticamente

#### RF-005.2 Validación de Archivos
- **Descripción**: El sistema debe validar formato, tamaño y estructura de archivos cargados.
- **Entradas**: Archivo a validar
- **Proceso**: Verificación de extensión, tamaño máximo, integridad
- **Salidas**: Archivo válido/inválido con mensaje explicativo
- **Criterios de Aceptación**:
  - Formatos permitidos: PDF, JPG, PNG, DOCX
  - Tamaño máximo: 10MB por archivo
  - Debe escanear por malware

#### RF-005.3 Control de Completitud
- **Descripción**: El sistema debe verificar que todos los documentos obligatorios hayan sido cargados.
- **Entradas**: Lista de documentos del usuario, lista de documentos requeridos
- **Proceso**: Comparación y identificación de faltantes
- **Salidas**: Estado de completitud, lista de pendientes
- **Criterios de Aceptación**:
  - No permitir envío final si faltan documentos obligatorios
  - Mostrar claramente qué documentos faltan

### RF-006: PROCESAMIENTO CON INTELIGENCIA ARTIFICIAL

#### RF-006.1 Validación de Correspondencia
- **Descripción**: El modelo de IA debe verificar que el documento cargado corresponda con el solicitado.
- **Entradas**: Archivo de documento, tipo de documento esperado
- **Proceso**: Análisis del contenido mediante IA
- **Salidas**: Correspondencia confirmada/rechazada con score de confianza
- **Criterios de Aceptación**:
  - Score de confianza mínimo del 80%
  - Tiempo de procesamiento máximo: 30 segundos

#### RF-006.2 Verificación de Identidad
- **Descripción**: El sistema debe confirmar que los datos del documento coincidan con el usuario.
- **Entradas**: Documento, datos del usuario registrado
- **Proceso**: Extracción y comparación de datos de identidad
- **Salidas**: Identidad verificada/no verificada
- **Criterios de Aceptación**:
  - Debe extraer nombre, documento de identidad y otros datos relevantes
  - Tolerancia de diferencias menores en nombres (acentos, espacios)


### RF-007: GESTIÓN DE CONVOCATORIAS

#### RF-007.1 Configuración de Fechas Límite
- **Descripción**: Los administradores deben poder definir rangos de fechas para cada convocatoria.
- **Entradas**: Fecha de inicio, fecha de fin, ID de convocatoria
- **Proceso**: Validación de fechas y almacenamiento
- **Salidas**: Rango de fechas configurado
- **Criterios de Aceptación**:
  - Fecha de fin debe ser posterior a fecha de inicio
  - Debe permitir modificación antes del inicio de la convocatoria

#### RF-007.2 Estados de Convocatoria
- **Descripción**: El sistema debe manejar diferentes estados de convocatoria (pendiente, activa, cerrada).
- **Entradas**: Estado actual, fechas configuradas
- **Proceso**: Cálculo automático de estado basado en fechas
- **Salidas**: Estado actualizado de convocatoria
- **Criterios de Aceptación**:
  - Cambios automáticos de estado según fechas
  - Notificaciones a usuarios sobre cambios de estado

### RF-008: REVISIÓN Y APROBACIÓN

#### RF-008.1 Panel de Revisión para Coordinadores
- **Descripción**: Los coordinadores deben poder revisar documentos cargados por usuarios.
- **Entradas**: Lista de documentos pendientes de revisión
- **Proceso**: Visualización de documentos y metadatos
- **Salidas**: Documento aprobado/rechazado con observaciones
- **Criterios de Aceptación**:
  - Debe mostrar documentos por orden de llegada
  - Permitir filtros por usuario, tipo de documento, fecha

#### RF-008.2 Sistema de Observaciones
- **Descripción**: Los revisores deben poder agregar observaciones a documentos rechazados.
- **Entradas**: Comentarios del revisor, documento asociado
- **Proceso**: Almacenamiento de observaciones y notificación al usuario
- **Salidas**: Observaciones registradas y notificadas
- **Criterios de Aceptación**:
  - Observaciones deben ser visibles para el usuario
  - Debe permitir adjuntar imágenes explicativas

### RF-009: ALMACENAMIENTO Y TRAZABILIDAD

#### RF-009.1 Repositorio de Archivos
- **Descripción**: El sistema debe almacenar de forma segura todos los archivos validados.
- **Entradas**: Archivos aprobados
- **Proceso**: Almacenamiento con encriptación y backup
- **Salidas**: Archivos seguros y accesibles
- **Criterios de Aceptación**:
  - Archivos deben ser encriptados en reposo
  - Backup automático cada 24 horas

#### RF-009.2 Registro de Auditoría
- **Descripción**: Todas las operaciones del sistema deben quedar registradas para auditoría.
- **Entradas**: Acción realizada, usuario, timestamp
- **Proceso**: Registro inmutable en log de auditoría
- **Salidas**: Evento registrado exitosamente
- **Criterios de Aceptación**:
  - Logs deben ser inmutables después de creación
  - Retención mínima de 5 años

### RF-010: GESTIÓN DE PERFIL DE USUARIO

#### RF-010.1 Actualización de Datos Personales
- **Descripción**: Los usuarios deben poder actualizar su información personal.
- **Entradas**: Nuevos datos personales
- **Proceso**: Validación y actualización en base de datos
- **Salidas**: Perfil actualizado
- **Criterios de Aceptación**:
  - Cambios críticos (documento, email) requieren re-verificación
  - Historial de cambios para auditoría


### RF-011: REPORTES Y ESTADÍSTICAS


#### RF-011.1 Dashboard de Estadísticas
- **Descripción**: El sistema debe mostrar estadísticas en tiempo real del proceso.
- **Entradas**: Datos actuales del sistema
- **Proceso**: Cálculo de métricas y visualización
- **Salidas**: Dashboard actualizado
- **Criterios de Aceptación**:
  - Actualización automática cada 5 minutos
  - Gráficos interactivos y responsive



# REQUERIMIENTOS NO FUNCIONALES
## Sistema de Gestión Documental para Contratación Interna

### RNF-001: RENDIMIENTO Y PERFORMANCE

#### RNF-001.1 Tiempo de Respuesta
- **Descripción**: El sistema debe proporcionar respuestas rápidas para mantener una buena experiencia de usuario.

#### RNF-001.2 Escalabilidad
- **Descripción**: El sistema debe poder crecer según la demanda sin rediseño arquitectural.

### RNF-002: DISPONIBILIDAD Y CONFIABILIDAD

#### RNF-002.1 Disponibilidad del Sistema
- **Descripción**: El sistema debe estar operativo la mayor parte del tiempo.

#### RNF-002.2 Tolerancia a Fallos
- **Descripción**: El sistema debe continuar operando ante fallos parciales.

### RNF-003: SEGURIDAD

#### RNF-003.1 Autenticación y Autorización
- **Descripción**: El sistema debe proteger el acceso mediante mecanismos robustos.

#### RNF-003.2 Protección contra Vulnerabilidades
- **Descripción**: El sistema debe estar protegido contra ataques comunes.


### RNF-004: USABILIDAD

#### RNF-004.1 Experiencia de Usuario
- **Descripción**: La interfaz debe ser intuitiva y fácil de usar.


#### RNF-004.2 Responsive Design
- **Descripción**: La interfaz debe adaptarse a diferentes dispositivos y resoluciones.

### RNF-005: COMPATIBILIDAD

#### RNF-005.1 Navegadores Web
- **Descripción**: El sistema debe funcionar en navegadores web modernos.

#### RNF-005.2 Integraciones Externas
- **Descripción**: Compatibilidad con sistemas externos requeridos.


### RNF-006: MANTENIBILIDAD

#### RNF-006.1 Código Limpio y Documentación
- **Descripción**: El código debe ser mantenible y bien documentado.


#### RNF-006.2 Modularidad y Arquitectura
- **Descripción**: El sistema debe tener una arquitectura modular y extensible.
