# HISTORIAS DE USUARIO
## Sistema de Gestión Documental para Contratación Interna

### ÉPICA 1: VERIFICACIÓN Y REGISTRO DE USUARIOS

#### US-001: Verificación por Documento de Identidad
**Como** usuario
**Quiero** ingresar mi número de documento de identidad para verificar mi registro  
**Para** poder acceder al sistema si estoy previamente registrado en ACIA  

**Criterios de Aceptación:**
- [ ] DADO que ingreso un número de documento válido CUANDO el sistema consulta ACIA ENTONCES muestra mi estado de registro
- [ ] DADO que ingreso un formato de documento inválido CUANDO hago clic en verificar ENTONCES veo un mensaje de error claro
- [ ] DADO que hay problemas de conexión con ACIA CUANDO intento verificar ENTONCES veo un mensaje informativo y puedo reintentar


---

#### US-002: Validación de Convocatoria Activa
**Como** usuario verificado  
**Quiero** que el sistema valide si la convocatoria está activa  
**Para** saber si puedo cargar documentos en este momento  

**Criterios de Aceptación:**
- [ ] DADO que la convocatoria está activa CUANDO accedo al sistema ENTONCES puedo proceder a cargar documentos
- [ ] DADO que la convocatoria no está activa CUANDO intento acceder ENTONCES veo un mensaje con las fechas válidas
- [ ] DADO que la convocatoria vence en menos de 24 horas CUANDO accedo ENTONCES veo una advertencia sobre el tiempo restante

---

#### US-003: Registro de Usuario No Encontrado
**Como** usuario no registrado en ACIA  
**Quiero** completar un formulario de registro  
**Para** poder registrarme y posteriormente cargar mis documentos  

**Criterios de Aceptación:**
- [ ] DADO que no estoy en ACIA CUANDO verifico mi documento ENTONCES veo un formulario de registro
- [ ] DADO que completo todos los campos obligatorios CUANDO envío el formulario ENTONCES el sistema me registra en ACIA
- [ ] DADO que mi contraseña no cumple las políticas CUANDO intento registrarme ENTONCES veo los requisitos específicos
- [ ] DADO que el registro es exitoso CUANDO termino el proceso ENTONCES puedo acceder al sistema inmediatamente

---

### ÉPICA 2: AUTENTICACIÓN Y GESTIÓN DE SESIONES

#### US-004: Inicio de Sesión
**Como** usuario registrado  
**Quiero** iniciar sesión con mis credenciales  
**Para** acceder a las funcionalidades según mi rol  

**Criterios de Aceptación:**
- [ ] DADO que ingreso credenciales válidas CUANDO hago login ENTONCES accedo al dashboard apropiado para mi rol
- [ ] DADO que ingreso credenciales incorrectas CUANDO intento login ENTONCES veo un mensaje de error específico
- [ ] DADO que fallo el login 3 veces CUANDO intento nuevamente ENTONCES mi cuenta se bloquea por 30 minutos
- [ ] DADO que inicio sesión exitosamente CUANDO navego por el sistema ENTONCES mi sesión permanece activa por 8 horas

---

#### US-005: Recuperación de Contraseña
**Como** usuario que olvidó su contraseña  
**Quiero** recibir un enlace para restablecerla  
**Para** poder acceder nuevamente al sistema  

**Criterios de Aceptación:**
- [ ] DADO que ingreso mi email registrado CUANDO solicito recuperación ENTONCES recibo un enlace por email
- [ ] DADO que hago clic en el enlace válido CUANDO accedo ENTONCES puedo crear una nueva contraseña
- [ ] DADO que el enlace tiene más de 24 horas CUANDO intento usarlo ENTONCES veo que ha expirado
- [ ] DADO que creo una nueva contraseña CUANDO la confirmo ENTONCES puedo iniciar sesión inmediatamente

---

#### US-006: Cambio de Contraseña
**Como** usuario autenticado  
**Quiero** cambiar mi contraseña actual  
**Para** mantener mi cuenta segura  

**Criterios de Aceptación:**
- [ ] DADO que estoy logueado CUANDO accedo a "Cambiar contraseña" ENTONCES veo el formulario correspondiente
- [ ] DADO que ingreso mi contraseña actual correcta CUANDO la verifico ENTONCES puedo proceder al cambio
- [ ] DADO que intento usar una contraseña reciente CUANDO la confirmo ENTONCES veo que no puedo reutilizar las últimas 5
- [ ] DADO que cambio la contraseña exitosamente CUANDO confirmo ENTONCES recibo una notificación de confirmación

---

### ÉPICA 3: GESTIÓN DE ROLES Y PERMISOS

#### US-007: Asignación de Roles por Administrador
**Como** administrador del sistema  
**Quiero** asignar roles a los usuarios  
**Para** controlar el acceso a las funcionalidades del sistema  

**Criterios de Aceptación:**
- [ ] DADO que soy administrador CUANDO accedo a gestión de usuarios ENTONCES veo la lista de usuarios y sus roles actuales
- [ ] DADO que selecciono un usuario CUANDO cambio su rol ENTONCES los cambios se aplican inmediatamente
- [ ] DADO que modifico un rol CUANDO el usuario está en sesión ENTONCES ve sus nuevos permisos sin reloguear
- [ ] DADO que asigno un rol CUANDO confirmo ENTONCES el cambio queda registrado en auditoría

---

#### US-008: Gestión Dinámica de Permisos
**Como** administrador  
**Quiero** modificar los permisos de cada rol  
**Para** adaptar el sistema a las necesidades cambiantes del proceso  

**Criterios de Aceptación:**
- [ ] DADO que accedo a configuración de roles CUANDO modifico permisos ENTONCES veo una matriz de permisos clara
- [ ] DADO que cambio permisos de un rol CUANDO confirmo ENTONCES todos los usuarios con ese rol se actualizan
- [ ] DADO que quito un permiso crítico CUANDO confirmo ENTONCES veo una advertencia de confirmación
- [ ] DADO que modifico permisos CUANDO los usuarios afectados ingresan ENTONCES ven una notificación sobre los cambios


---

### ÉPICA 4: GESTIÓN DE DOCUMENTOS REQUERIDOS

#### US-009: Configuración de Lista de Documentos
**Como** administrador  
**Quiero** definir qué documentos son obligatorios para cada convocatoria  
**Para** personalizar los requisitos según el tipo de contratación  

**Criterios de Aceptación:**
- [ ] DADO que accedo a configuración CUANDO agrego un documento ENTONCES puedo definir nombre, descripción y tipo de usuario
- [ ] DADO que creo un documento CUANDO especifico si es para instructor/administrativo ENTONCES se categoriza correctamente
- [ ] DADO que modifico un documento existente CUANDO guardo ENTONCES los cambios se reflejan en nuevas cargas
- [ ] DADO que elimino un documento CUANDO confirmo ENTONCES ya no aparece en la lista de requeridos

---

#### US-010: Ordenamiento Dinámico de Documentos
**Como** administrador  
**Quiero** cambiar el orden de presentación de los documentos  
**Para** optimizar el flujo de carga según la importancia o facilidad de obtención  

**Criterios de Aceptación:**
- [ ] DADO que accedo a gestión de documentos CUANDO uso drag & drop ENTONCES puedo reordenar la lista
- [ ] DADO que cambio el orden CUANDO guardo ENTONCES los usuarios ven el nuevo orden inmediatamente
- [ ] DADO que reordeno documentos CUANDO hay usuarios cargando ENTONCES mantienen su progreso actual
- [ ] DADO que establezco un orden CUANDO creo nueva convocatoria ENTONCES hereda el orden configurado


---

#### US-011: Activación/Desactivación de Documentos por Convocatoria
**Como** administrador  
**Quiero** activar o desactivar documentos específicos para cada convocatoria  
**Para** adaptar los requisitos según el tipo de proceso de contratación  

**Criterios de Aceptación:**
- [ ] DADO que gestiono una convocatoria CUANDO desactivo un documento ENTONCES no aparece en el formulario de carga
- [ ] DADO que reactivo un documento CUANDO confirmo ENTONCES vuelve a estar disponible para carga
- [ ] DADO que cambio el estado de documentos CUANDO hay usuarios activos ENTONCES ven los cambios en tiempo real
- [ ] DADO que modifico estados CUANDO reviso historial ENTONCES veo todas las activaciones/desactivaciones

---

### ÉPICA 5: CARGA Y VALIDACIÓN DOCUMENTAL

#### US-012: Interfaz de Carga Paso a Paso
**Como** usuario postulante  
**Quiero** cargar mis documentos en un proceso guiado paso a paso  
**Para** completar fácilmente el proceso sin confundirme  

**Criterios de Aceptación:**
- [ ] DADO que inicio la carga CUANDO accedo ENTONCES veo un wizard con mi progreso visual
- [ ] DADO que estoy en un paso CUANDO navego ENTONCES puedo ir adelante/atrás sin perder información
- [ ] DADO que cargo un documento CUANDO avanzo ENTONCES el sistema guarda automáticamente mi progreso
- [ ] DADO que cierro el navegador CUANDO regreso ENTONCES continúo desde donde me quedé

---

#### US-013: Validación de Archivos en Tiempo Real
**Como** usuario cargando documentos  
**Quiero** que el sistema valide inmediatamente cada archivo que subo  
**Para** corregir errores antes de continuar con el siguiente documento  

**Criterios de Aceptación:**
- [ ] DADO que selecciono un archivo inválido CUANDO intento cargarlo ENTONCES veo un mensaje de error específico
- [ ] DADO que subo un archivo muy grande CUANDO excede 10MB ENTONCES veo el límite permitido
- [ ] DADO que subo un formato no permitido CUANDO lo selecciono ENTONCES veo los formatos válidos (PDF, JPG, PNG, DOCX)
- [ ] DADO que el archivo pasa las validaciones CUANDO se carga ENTONCES veo una confirmación visual

---

#### US-014: Control de Completitud de Documentos
**Como** usuario postulante  
**Quiero** ver claramente qué documentos me faltan por cargar  
**Para** asegurarme de completar todos los requisitos antes del envío final  

**Criterios de Aceptación:**
- [ ] DADO que estoy cargando documentos CUANDO reviso mi progreso ENTONCES veo claramente cuáles faltan
- [ ] DADO que intento enviar documentos incompletos CUANDO hago clic en finalizar ENTONCES el sistema me impide continuar
- [ ] DADO que me faltan documentos CUANDO veo la lista ENTONCES están marcados claramente como pendientes
- [ ] DADO que completo todos los documentos CUANDO llego al final ENTONCES puedo enviar definitivamente

---

### ÉPICA 6: PROCESAMIENTO CON INTELIGENCIA ARTIFICIAL

#### US-015: Validación Automática de Correspondencia
**Como** sistema inteligente  
**Quiero** verificar que cada documento cargado corresponda con lo solicitado  
**Para** reducir errores y agilizar el proceso de revisión manual  

**Criterios de Aceptación:**
- [ ] DADO que un usuario carga un documento CUANDO el sistema lo procesa ENTONCES verifica si corresponde al tipo solicitado
- [ ] DADO que el documento no corresponde CUANDO la IA lo detecta ENTONCES marca el documento como "requiere revisión"
- [ ] DADO que la confianza es baja (< 80%) CUANDO la IA procesa ENTONCES escalona para revisión manual
- [ ] DADO que el procesamiento toma tiempo CUANDO supera 30 segundos ENTONCES muestra un timeout apropiado

---

#### US-016: Verificación de Identidad en Documentos
**Como** sistema de verificación  
**Quiero** confirmar que los datos del documento coincidan con el usuario registrado  
**Para** prevenir suplantación de identidad en el proceso  

**Criterios de Aceptación:**
- [ ] DADO que proceso un documento CUANDO extraigo datos de identidad ENTONCES comparo con los datos del usuario
- [ ] DADO que encuentro discrepancias CUANDO los datos no coinciden ENTONCES marco para revisión manual
- [ ] DADO que hay diferencias menores (acentos/espacios) CUANDO comparo nombres ENTONCES aplico tolerancia apropiada
- [ ] DADO que la verificación es exitosa CUANDO coinciden los datos ENTONCES marco el documento como verificado

---

### ÉPICA 7: GESTIÓN DE CONVOCATORIAS

#### US-017: Configuración de Fechas Límite
**Como** administrador  
**Quiero** definir las fechas de inicio y fin para cada convocatoria  
**Para** controlar cuándo los usuarios pueden cargar documentos  

**Criterios de Aceptación:**
- [ ] DADO que configuro una convocatoria CUANDO establezco fechas ENTONCES la fecha fin debe ser posterior al inicio
- [ ] DADO que una convocatoria no ha iniciado CUANDO los usuarios intentan acceder ENTONCES ven cuándo podrán hacerlo
- [ ] DADO que modifico fechas CUANDO la convocatoria no ha iniciado ENTONCES puedo cambiarlas libremente
- [ ] DADO que la convocatoria está activa CUANDO intento modificar fechas ENTONCES veo restricciones apropiadas

---

#### US-018: Estados Automáticos de Convocatoria
**Como** sistema automatizado  
**Quiero** cambiar automáticamente el estado de las convocatorias según las fechas  
**Para** que los usuarios siempre vean información actualizada sin intervención manual  

**Criterios de Aceptación:**
- [ ] DADO que llega la fecha de inicio CUANDO el sistema verifica ENTONCES cambia automáticamente a "Activa"
- [ ] DADO que llega la fecha de fin CUANDO el sistema verifica ENTONCES cambia automáticamente a "Cerrada"
- [ ] DADO que cambia el estado CUANDO los usuarios están conectados ENTONCES ven el cambio inmediatamente
- [ ] DADO que hay cambio de estado CUANDO ocurre ENTONCES se envían notificaciones a usuarios relevantes


---

### ÉPICA 8: REVISIÓN Y APROBACIÓN

#### US-019: Panel de Revisión para Coordinadores
**Como** coordinador  
**Quiero** revisar los documentos cargados por los usuarios  
**Para** aprobar o rechazar cada documento según los criterios establecidos  

**Criterios de Aceptación:**
- [ ] DADO que soy coordinador CUANDO accedo al panel ENTONCES veo documentos pendientes ordenados por fecha
- [ ] DADO que selecciono un documento CUANDO lo abro ENTONCES veo el archivo y los metadatos extraídos
- [ ] DADO que reviso un documento CUANDO decido ENTONCES puedo aprobarlo o rechazarlo con observaciones
- [ ] DADO que filtro documentos CUANDO aplico criterios ENTONCES veo solo los que coinciden (usuario, tipo, fecha)

---

#### US-020: Sistema de Observaciones para Rechazos
**Como** coordinador/apoyo al coordinador  
**Quiero** agregar observaciones detalladas cuando rechazo un documento  
**Para** que el usuario entienda qué debe corregir y pueda subir el documento correcto  

**Criterios de Aceptación:**
- [ ] DADO que rechazo un documento CUANDO agrego observaciones ENTONCES puedo escribir comentarios detallados
- [ ] DADO que necesito ser más específico CUANDO explico el rechazo ENTONCES puedo adjuntar imágenes marcadas
- [ ] DADO que envío observaciones CUANDO el usuario accede ENTONCES ve claramente qué debe corregir
- [ ] DADO que marco un documento rechazado CUANDO el usuario lo ve ENTONCES puede cargar una nueva versión

---

### ÉPICA 9: NOTIFICACIONES Y COMUNICACIÓN

#### US-021: Notificaciones de Estado de Documentos
**Como** usuario postulante  
**Quiero** recibir notificaciones cuando cambie el estado de mis documentos  
**Para** estar informado del progreso de mi postulación  

**Criterios de Aceptación:**
- [ ] DADO que mi documento es aprobado CUANDO cambia el estado ENTONCES recibo notificación por email y en sistema
- [ ] DADO que mi documento es rechazado CUANDO recibo la notificación ENTONCES veo las observaciones específicas
- [ ] DADO que configuro mis preferencias CUANDO las cambio ENTONCES puedo elegir qué notificaciones recibir
- [ ] DADO que tengo documentos pendientes CUANDO paso tiempo sin actividad ENTONCES recibo recordatorios

---

#### US-022: Recordatorios de Vencimiento
**Como** usuario postulante  
**Quiero** recibir recordatorios sobre las fechas límite de la convocatoria  
**Para** no perder la oportunidad por olvido o despiste  

**Criterios de Aceptación:**
- [ ] DADO que faltan 7 días CUANDO el sistema verifica ENTONCES envía primer recordatorio
- [ ] DADO que faltan 3 días CUANDO el sistema verifica ENTONCES envía recordatorio urgente
- [ ] DADO que falta 1 día CUANDO el sistema verifica ENTONCES envía recordatorio final
- [ ] DADO que ya completé todos mis documentos CUANDO llegan fechas ENTONCES no recibo recordatorios innecesarios

---

### ÉPICA 10: GESTIÓN DE PERFIL DE USUARIO

#### US-023: Actualización de Datos Personales
**Como** usuario registrado  
**Quiero** actualizar mi información personal  
**Para** mantener mis datos actualizados en el sistema  

**Criterios de Aceptación:**
- [ ] DADO que accedo a mi perfil CUANDO modifico datos básicos ENTONCES los cambios se guardan inmediatamente
- [ ] DADO que cambio datos críticos (email/documento) CUANDO los actualizo ENTONCES requiero verificación adicional
- [ ] DADO que actualizo información CUANDO confirmo ENTONCES el cambio queda registrado en auditoría
- [ ] DADO que hay errores en la actualización CUANDO los corrijo ENTONCES veo mensajes claros sobre qué falta


---

### ÉPICA 11: REPORTES Y ESTADÍSTICAS

#### US-024: Dashboard de Estadísticas en Tiempo Real
**Como** coordinador/administrador  
**Quiero** ver estadísticas actualizadas del proceso de contratación  
**Para** tomar decisiones informadas y monitorear el progreso  

**Criterios de Aceptación:**
- [ ] DADO que accedo al dashboard CUANDO lo abro ENTONCES veo métricas actualizadas (últimos 5 minutos)
- [ ] DADO que reviso estadísticas CUANDO analizo ENTONCES veo gráficos interactivos de documentos por estado
- [ ] DADO que necesito detalles CUANDO hago clic en un gráfico ENTONCES veo el desglose específico
- [ ] DADO que uso dispositivo móvil CUANDO accedo ENTONCES las estadísticas se adaptan apropiadamente


---

#### US-025: Generación de Reportes Exportables
**Como** administrador  
**Quiero** generar reportes detallados del proceso  
**Para** presentar información a la dirección y cumplir con auditorías  

**Criterios de Aceptación:**
- [ ] DADO que necesito un reporte CUANDO configuro filtros ENTONCES puedo seleccionar fechas, usuarios y estados
- [ ] DADO que genero el reporte CUANDO se procesa ENTONCES recibo el archivo en PDF o Excel según elija
- [ ] DADO que el reporte incluye gráficos CUANDO lo exporto ENTONCES mantiene la calidad visual
- [ ] DADO que solicito reportes grandes CUANDO tarda en generar ENTONCES veo el progreso y puedo esperar hasta 2 minutos
