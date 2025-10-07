# 📅 PLAN DE TRABAJO - SISTEMA NACIONAL DE GESTIÓN DE LISTAS DE CHEQUEO SENA

**Periodo**: 7 de octubre - 20 de diciembre de 2025 (10.5 semanas / ~52 días hábiles)  
**Equipo**: 3 Desarrolladores Full-Stack  
**Objetivo**: Sistema funcional en producción

---

## 👥 EQUIPO Y ROLES

### **Desarrollador 1 (DEV-1)** - Backend Lead
- **Especialidad**: Node.js, Sequelize, MySQL, APIs REST
- **Responsabilidad principal**: Arquitectura backend, autenticación, APIs core

### **Desarrollador 2 (DEV-2)** - Full-Stack
- **Especialidad**: Node.js + React, Integraciones
- **Responsabilidad principal**: Módulos de documentos, integraciones ACIA, Storage

### **Desarrollador 3 (DEV-3)** - Frontend Lead + Full-Stack
- **Especialidad**: React, TailwindCSS, UX/UI
- **Responsabilidad principal**: Interfaces de usuario, dashboards, reportes

---

## 📊 CRONOGRAMA GENERAL

```
┌─────────────────────────────────────────────────────────────────────┐
│ SPRINT 1: Setup + Estructura Base    │ 7-18 Oct  │ 2 semanas       │
│ SPRINT 2: Autenticación + RBAC       │ 21 Oct-1 Nov │ 2 semanas    │
│ SPRINT 3: Gestión Documentos Core    │ 4-15 Nov  │ 2 semanas       │
│ SPRINT 4: Revisión + Vigencias       │ 18-29 Nov │ 2 semanas       │
│ SPRINT 5: Dashboards + Reportes      │ 2-13 Dic  │ 2 semanas       │
│ SPRINT 6: Testing + Despliegue       │ 16-20 Dic │ 5 días          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 SPRINT 1: SETUP + ESTRUCTURA BASE
**Fechas**: 7 de octubre - 18 de octubre (2 semanas)

### 🎯 Objetivo
Configurar infraestructura base, base de datos, y esqueleto del proyecto

### 📋 Tareas por Desarrollador

#### **DEV-1 (Backend Lead)** - Infraestructura Backend
- [ ] **Día 1-2**: Setup inicial proyecto Node.js + Express
  - Estructura de carpetas (MVC + Services)
  - Configuración de variables de entorno
  - Setup de Sequelize + MySQL
  - Configuración de ESLint + Prettier
  
- [ ] **Día 3-4**: Base de datos
  - Ejecutar `database_v3_sena.sql`
  - Crear modelos Sequelize para todas las tablas
  - **IMPORTANTE**: Configurar `paranoid: false` (NO usar soft deletes)
  - Usar campo `activo` para desactivar registros
  - Setup de migraciones y seeders base
  - Validar relaciones entre modelos
  - Configurar scopes por defecto: `defaultScope: { where: { activo: true } }`

- [ ] **Día 5-7**: Arquitectura y utilidades
  - Middleware de manejo de errores
  - Helpers de respuestas HTTP
  - Configuración de logging (Winston)
  - Setup de validaciones (Joi/express-validator)

- [ ] **Día 8-10**: Documentación API base
  - Setup Swagger/OpenAPI
  - Estructura de rutas v1
  - Middleware de CORS y seguridad (Helmet)
  - Rate limiting

**Entregables**: 
- ✅ Proyecto backend configurado
- ✅ Base de datos creada con modelos
- ✅ Documentación API base

---

#### **DEV-2 (Full-Stack)** - Storage y Servicios Base
- [ ] **Día 1-3**: Servicio de almacenamiento de archivos
  - Configuración de Multer
  - Implementar storage local (filesystem)
  - Preparar interfaz para S3 (AWS SDK)
  - Validaciones de archivos (tipo, tamaño)

- [ ] **Día 4-6**: Servicios auxiliares
  - Servicio de emails (Nodemailer)
  - Templates de emails (bienvenida, notificaciones)
  - Servicio de logs de auditoría
  - Helper de formateo de fechas

- [ ] **Día 7-10**: Seeds de datos iniciales
  - Seed de regionales (33 regionales SENA)
  - Seed de centros por regional (principales)
  - Seed de tipos de documentos (CC, CE, NIT)
  - Seed de roles y permisos iniciales
  - Seed de lista de chequeo base (10-15 documentos)

**Entregables**:
- ✅ Sistema de storage funcionando
- ✅ Base de datos poblada con datos iniciales
- ✅ Servicio de emails configurado

---

#### **DEV-3 (Frontend Lead)** - Setup Frontend
- [ ] **Día 1-3**: Setup proyecto React
  - Create React App o Vite + TypeScript
  - Configuración TailwindCSS
  - Estructura de carpetas (components, pages, services, hooks)
  - Setup de React Router

- [ ] **Día 4-6**: Sistema de diseño base
  - Paleta de colores SENA (verde, naranja, blanco)
  - Componentes UI reutilizables:
    - Button, Input, Select, Checkbox
    - Card, Modal, Alert, Toast
    - Table, Pagination
    - Loader/Spinner

- [ ] **Día 7-10**: Layout y navegación
  - Layout base (Header, Sidebar, Content)
  - Navegación principal
  - Páginas placeholder (Home, Login, etc.)
  - Componente de manejo de errores (404, 500)

**Entregables**:
- ✅ Frontend React funcionando
- ✅ Sistema de diseño implementado
- ✅ Navegación base

---

### 🎯 Reuniones Sprint 1
- **Día 1**: Planning + Setup inicial
- **Día 5**: Sincronización + Code review
- **Día 10**: Demo + Retrospectiva

---

## 🔐 SPRINT 2: AUTENTICACIÓN + RBAC
**Fechas**: 21 de octubre - 1 de noviembre (2 semanas)

### 🎯 Objetivo
Implementar autenticación, autorización y gestión de usuarios administrativos

### 📋 Tareas por Desarrollador

#### **DEV-1 (Backend Lead)** - Autenticación y RBAC
- [ ] **Día 1-3**: Sistema de autenticación
  - Endpoint POST `/api/v1/auth/login`
  - Generación de JWT con payload completo
  - Middleware de autenticación JWT
  - Endpoint POST `/api/v1/auth/logout`
  - Endpoint POST `/api/v1/auth/refresh-token`

- [ ] **Día 4-6**: Gestión de usuarios administrativos
  - CRUD de usuarios administrativos
    - POST `/api/v1/usuarios` (crear)
    - GET `/api/v1/usuarios` (listar con filtros)
    - GET `/api/v1/usuarios/:id`
    - PUT `/api/v1/usuarios/:id`
    - PUT `/api/v1/usuarios/:id/estado` (activar/desactivar, NO eliminar)
  - Asignación de centros a usuarios
  - Cambio de contraseña
  - Reset de contraseña (generar token)

- [ ] **Día 7-10**: RBAC y permisos
  - Middleware de autorización por rol
  - Middleware de verificación de permisos
  - Middleware de scope (regional/centro)
  - Gestión de rol_permiso y usuario_permiso
  - Validaciones de alcance por rol

**Entregables**:
- ✅ API de autenticación completa
- ✅ CRUD de usuarios administrativos
- ✅ Sistema RBAC funcionando

---

#### **DEV-2 (Full-Stack)** - Gestión de Estructura Organizacional
- [ ] **Día 1-4**: APIs de estructura
  - CRUD Regionales
    - GET `/api/v1/regionales`
    - POST `/api/v1/regionales` (solo admin)
    - PUT `/api/v1/regionales/:id`
    - PUT `/api/v1/regionales/:id/estado` (activar/desactivar, NO eliminar)
  
  - CRUD Centros
    - GET `/api/v1/centros` (filtro por regional)
    - POST `/api/v1/centros`
    - PUT `/api/v1/centros/:id`
    - PUT `/api/v1/centros/:id/estado` (activar/desactivar, NO eliminar)
  
  - Validaciones de permisos por rol

- [ ] **Día 5-7**: Gestión de roles y permisos
  - GET `/api/v1/roles`
  - GET `/api/v1/permisos`
  - POST `/api/v1/roles/:id/permisos` (asignar permisos)
  - GET `/api/v1/usuarios/:id/permisos` (permisos efectivos)

- [ ] **Día 8-10**: Servicio de auditoría
  - Middleware de auditoría automática
  - Registro de acciones críticas
  - API de consulta de auditoría (solo admin)

**Entregables**:
- ✅ APIs de regionales y centros
- ✅ APIs de roles y permisos
- ✅ Sistema de auditoría

---

#### **DEV-3 (Frontend)** - Interfaces de autenticación y admin
- [ ] **Día 1-3**: Pantallas de autenticación
  - Página de Login
    - Formulario con validaciones
    - Selección de centro (si tiene múltiples)
    - Manejo de errores (credenciales incorrectas, cuenta bloqueada)
  - Integración con API de login
  - Almacenamiento de token (localStorage/sessionStorage)
  - Interceptor Axios para incluir JWT

- [ ] **Día 4-6**: Dashboard administrativo
  - Layout por rol (sidebar dinámico según permisos)
  - Dashboard Admin Nacional
  - Dashboard Director Regional
  - Dashboard Administrador de Centro
  - Dashboard Revisor

- [ ] **Día 7-10**: Gestión de usuarios (frontend)
  - Listado de usuarios con filtros (incluir filtro por estado: activo/inactivo)
  - Formulario crear/editar usuario
  - Asignación de centros
  - Cambio de rol
  - **Botón toggle Activar/Desactivar** (NO botón "eliminar")
  - Confirmación antes de desactivar
  - Validaciones frontend

**Entregables**:
- ✅ Login funcional
- ✅ Dashboards por rol
- ✅ CRUD de usuarios (frontend)

---

### 🎯 Reuniones Sprint 2
- **Día 1**: Planning + Asignación tareas
- **Día 5**: Sincronización + Integración
- **Día 10**: Demo + Retrospectiva

---

## 📄 SPRINT 3: GESTIÓN DE DOCUMENTOS CORE
**Fechas**: 4 de noviembre - 15 de noviembre (2 semanas)

### 🎯 Objetivo
Implementar carga de documentos por contratistas y gestión de lista de chequeo

### 📋 Tareas por Desarrollador

#### **DEV-1 (Backend Lead)** - Verificación ACIA y Contratistas
- [ ] **Día 1-3**: API Mock de ACIA (para desarrollo)
  - Endpoint mock GET `/api/mock/acia/verificar/:documento`
  - Retornar datos simulados (encontrado/no encontrado)
  - Simular timeout y errores
  - Documentar cómo reemplazar con API real

- [ ] **Día 4-6**: Servicio de contratistas
  - POST `/api/v1/contratistas/verificar`
    - Consultar ACIA
    - Si encontrado: crear/actualizar registro local
    - Si no encontrado: retornar para registro manual
  - POST `/api/v1/contratistas/registrar` (registro manual)
  - GET `/api/v1/contratistas/:documento` (datos del contratista)

- [ ] **Día 7-10**: Sesiones de contratistas (sin login)
  - POST `/api/v1/sesiones-contratistas/crear`
    - Generar session_token temporal
    - Válido 2 horas
  - Middleware de validación de sesión
  - GET `/api/v1/sesiones-contratistas/validar`
  - POST `/api/v1/sesiones-contratistas/cerrar` (cerrar sesión, expirar token)

**Entregables**:
- ✅ API de verificación ACIA
- ✅ Servicio de contratistas
- ✅ Sistema de sesiones temporales

---

#### **DEV-2 (Full-Stack)** - API de Documentos
- [ ] **Día 1-4**: CRUD de documentos
  - POST `/api/v1/documentos` (carga)
    - Recibir archivo + metadatos
    - Validar formato y tamaño
    - Validar vigencia activa o permiso especial
    - Guardar en storage
    - Crear registro en BD
  
  - GET `/api/v1/documentos` (listado con filtros)
    - Por número_documento (contratista)
    - Por vigencia
    - Por centro
    - Por estado
  
  - GET `/api/v1/documentos/:id`
  - PUT `/api/v1/documentos/:id` (reemplazar documento)
  - PUT `/api/v1/documentos/:id/estado` (cambiar estado, NO eliminar físicamente)

- [ ] **Día 5-7**: Gestión de estados
  - PUT `/api/v1/documentos/:id/enviar-revision`
  - Validar que todos los documentos obligatorios estén cargados
  - Cambiar estado a "en_revision"
  - Notificar a revisores por email

- [ ] **Día 8-10**: Descarga de documentos
  - GET `/api/v1/documentos/:id/descargar`
  - Validación de permisos (solo quien cargó o revisor)
  - Streaming de archivo
  - Registro en auditoría

**Entregables**:
- ✅ API completa de documentos
- ✅ Sistema de carga y descarga
- ✅ Validaciones de vigencias

---

#### **DEV-3 (Frontend)** - Interfaces de Contratistas
- [ ] **Día 1-3**: Portal público de contratistas
  - Página de ingreso (sin login)
  - Formulario de verificación de documento
  - Pantalla de carga (si verificado)
  - Formulario de registro manual (si no en ACIA)

- [ ] **Día 4-6**: Interfaz de carga de documentos
  - Lista de chequeo dinámica
  - Componente de drag & drop para archivos
  - Vista previa de archivos cargados
  - Indicador de progreso (X de Y documentos)
  - Validaciones en tiempo real
  - Botón "Enviar a revisión"

- [ ] **Día 7-10**: Vista de progreso del contratista
  - Dashboard del contratista (por sesión)
  - Ver documentos cargados
  - Ver estado de cada documento
  - Ver observaciones de rechazo
  - Recargar documentos rechazados

**Entregables**:
- ✅ Portal público funcional
- ✅ Sistema de carga de documentos
- ✅ Dashboard de contratista

---

### 🎯 Reuniones Sprint 3
- **Día 1**: Planning
- **Día 5**: Sincronización + Testing integración
- **Día 10**: Demo + Retrospectiva

---

## ✅ SPRINT 4: REVISIÓN + VIGENCIAS
**Fechas**: 18 de noviembre - 29 de noviembre (2 semanas)

### 🎯 Objetivo
Implementar revisión de documentos, vigencias y permisos especiales

### 📋 Tareas por Desarrollador

#### **DEV-1 (Backend Lead)** - Revisión de Documentos
- [ ] **Día 1-4**: API de revisión
  - GET `/api/v1/revisiones/pendientes` (cola de revisión)
    - Filtros: centro, vigencia, fecha
    - Ordenamiento por fecha_envio
    - Paginación
  
  - POST `/api/v1/revisiones/aprobar/:documentoId`
    - Cambiar estado a "aprobado"
    - Registrar revisión
    - Notificar a contratista
  
  - POST `/api/v1/revisiones/rechazar/:documentoId`
    - Cambiar estado a "rechazado"
    - Guardar comentarios
    - Registrar revisión
    - Notificar a contratista

- [ ] **Día 5-7**: Historial y estadísticas de revisión
  - GET `/api/v1/revisiones/historial/:documentoId`
  - GET `/api/v1/revisiones/mis-revisiones` (por revisor)
  - GET `/api/v1/revisiones/estadisticas` (tiempos, volumen)

- [ ] **Día 8-10**: Notificaciones
  - Sistema de notificaciones en tiempo real (opcional: WebSockets/SSE)
  - Notificaciones por email
  - Notificaciones en sistema (campana)

**Entregables**:
- ✅ API de revisión completa
- ✅ Sistema de notificaciones
- ✅ Historial de revisiones

---

#### **DEV-2 (Full-Stack)** - Vigencias y Permisos Especiales
- [ ] **Día 1-3**: CRUD de Vigencias
  - POST `/api/v1/vigencias` (solo admin nacional)
  - GET `/api/v1/vigencias` (filtros: estado, año)
  - PUT `/api/v1/vigencias/:id`
  - PUT `/api/v1/vigencias/:id/estado` (cambiar estado)
  - POST `/api/v1/vigencias/:id/lista-chequeo` (asignar items)

- [ ] **Día 4-6**: Lista de chequeo dinámica
  - CRUD `/api/v1/lista-chequeo`
  - Reordenamiento de items
  - Activar/desactivar items
  - Configuración por vigencia

- [ ] **Día 7-10**: Permisos especiales de carga
  - POST `/api/v1/permisos-especiales/individual`
    - Otorgar permiso a contratista específico
    - Validar alcance del admin
  
  - POST `/api/v1/permisos-especiales/masivo`
    - Otorgar permiso a todo el centro
  
  - GET `/api/v1/permisos-especiales` (listar activos)
  - PUT `/api/v1/permisos-especiales/:id/revocar`
  
  - Middleware: validar permiso al cargar documento

**Entregables**:
- ✅ Gestión completa de vigencias
- ✅ Lista de chequeo dinámica
- ✅ Sistema de permisos especiales

---

#### **DEV-3 (Frontend)** - Interfaces de Revisión
- [ ] **Día 1-4**: Panel de revisión
  - Cola de documentos pendientes
  - Filtros y búsqueda
  - Visualizador de documentos (PDF, imágenes)
  - Botones: Aprobar/Rechazar
  - Formulario de observaciones (si rechaza)
  - Historial de versiones del documento

- [ ] **Día 5-7**: Gestión de vigencias (frontend)
  - CRUD de vigencias (admin nacional)
  - Calendario visual de vigencias
  - Asignación de lista de chequeo
  - Cambio de estado de vigencia
  - Vista de vigencias activas

- [ ] **Día 8-10**: Permisos especiales (frontend)
  - Interfaz para otorgar permiso individual
  - Interfaz para permiso masivo
  - Lista de permisos activos
  - Revocar permisos
  - Alertas de permisos próximos a vencer

**Entregables**:
- ✅ Panel de revisión funcional
- ✅ Gestión de vigencias (UI)
- ✅ Gestión de permisos especiales (UI)

---

### 🎯 Reuniones Sprint 4
- **Día 1**: Planning
- **Día 5**: Sincronización
- **Día 10**: Demo + Retrospectiva

---

## 📊 SPRINT 5: DASHBOARDS + REPORTES
**Fechas**: 2 de diciembre - 13 de diciembre (2 semanas)

### 🎯 Objetivo
Implementar dashboards, reportes y funcionalidades finales

### 📋 Tareas por Desarrollador

#### **DEV-1 (Backend Lead)** - APIs de Reportes
- [ ] **Día 1-4**: Endpoints de estadísticas
  - GET `/api/v1/estadisticas/nacional` (admin nacional)
    - Total documentos por estado
    - Documentos por regional
    - Documentos por vigencia
    - Tasa de aprobación/rechazo
  
  - GET `/api/v1/estadisticas/regional/:regionalId`
  - GET `/api/v1/estadisticas/centro/:centroId`
  - GET `/api/v1/estadisticas/revisor/:revisorId`

- [ ] **Día 5-7**: Exportación de reportes
  - GET `/api/v1/reportes/documentos/excel`
  - GET `/api/v1/reportes/contratistas/excel`
  - GET `/api/v1/reportes/revisiones/excel`
  - Filtros: fechas, centro, vigencia, estado
  - Generación de Excel (xlsx)

- [ ] **Día 8-10**: Optimizaciones y cache
  - Cache de estadísticas (Redis opcional)
  - Optimización de queries pesadas
  - Índices adicionales si es necesario
  - Pruebas de carga

**Entregables**:
- ✅ APIs de estadísticas
- ✅ Exportación de reportes
- ✅ Optimizaciones

---

#### **DEV-2 (Full-Stack)** - Funcionalidades Finales
- [ ] **Día 1-3**: Búsqueda global
  - Endpoint de búsqueda unificada
  - Búsqueda por: contratista, documento, vigencia
  - Filtros avanzados
  - Resultados paginados

- [ ] **Día 4-6**: Gestión de perfil
  - GET/PUT `/api/v1/perfil` (usuario autenticado)
  - Cambio de contraseña
  - Actualización de datos personales
  - Foto de perfil (opcional)

- [ ] **Día 7-10**: Configuración del sistema
  - GET/PUT `/api/v1/configuracion` (solo admin)
  - Parámetros: timeout ACIA, tamaño máx archivos, etc.
  - Configuración de emails
  - Logs del sistema

**Entregables**:
- ✅ Búsqueda global
- ✅ Gestión de perfil
- ✅ Configuración del sistema

---

#### **DEV-3 (Frontend)** - Dashboards y Reportes
- [ ] **Día 1-5**: Dashboards con gráficos
  - Dashboard Admin Nacional:
    - KPIs: Total documentos, pendientes, aprobados
    - Gráfico de barras: Documentos por regional
    - Gráfico de línea: Tendencia de carga
    - Tabla: Centros con más actividad
  
  - Dashboard Director Regional:
    - KPIs de su regional
    - Gráficos por centro
  
  - Dashboard Admin Centro:
    - KPIs de su centro
    - Lista de contratistas pendientes
  
  - Dashboard Revisor:
    - Cola de documentos asignados
    - Estadísticas de revisión

- [ ] **Día 6-8**: Reportes y exportación
  - Interfaz de generación de reportes
  - Filtros avanzados
  - Vista previa de reporte
  - Botón de exportar a Excel
  - Historial de reportes generados

- [ ] **Día 9-10**: Búsqueda y configuración
  - Barra de búsqueda global
  - Resultados de búsqueda
  - Página de configuración del sistema
  - Página de perfil de usuario

**Entregables**:
- ✅ Dashboards completos
- ✅ Reportes con exportación
- ✅ Búsqueda y configuración

---

### 🎯 Reuniones Sprint 5
- **Día 1**: Planning
- **Día 5**: Sincronización
- **Día 10**: Demo + Retrospectiva

---

## 🧪 SPRINT 6: TESTING + DESPLIEGUE
**Fechas**: 16 de diciembre - 20 de diciembre (5 días)

### 🎯 Objetivo
Testing integral, corrección de bugs y despliegue a producción

### 📋 Tareas TODO EL EQUIPO

#### **Días 1-2 (16-17 Dic)**: Testing Integral
- [ ] **Testing funcional**:
  - Todos los flujos de usuario
  - Casos de error
  - Validaciones
  - Permisos y autorizaciones

- [ ] **Testing de integración**:
  - APIs con frontend
  - Storage de archivos
  - Emails
  - Base de datos

- [ ] **Testing de rendimiento**:
  - Carga de múltiples archivos
  - Listados con muchos registros
  - Consultas de estadísticas

- [ ] **Corrección de bugs críticos**

#### **Día 3 (18 Dic)**: Preparación para producción
- [ ] **DEV-1**: 
  - Configurar variables de entorno de producción
  - Setup de base de datos en servidor
  - Migrar datos iniciales
  - Configurar backup automático

- [ ] **DEV-2**:
  - Configurar S3 (si aplica)
  - Configurar servicio de emails en producción
  - Setup de logs centralizados
  - Configurar monitoreo (opcional: PM2, New Relic)

- [ ] **DEV-3**:
  - Build de producción del frontend
  - Optimizaciones (lazy loading, minificación)
  - Configurar CDN (opcional)
  - Testing en dispositivos móviles

#### **Día 4 (19 Dic)**: Despliegue
- [ ] **Mañana**: Despliegue a staging
  - Desplegar backend
  - Desplegar frontend
  - Configurar Nginx/Apache
  - SSL/HTTPS
  - Testing en staging

- [ ] **Tarde**: Despliegue a producción
  - Backup de seguridad
  - Despliegue gradual
  - Monitoreo de errores
  - Validación de funcionalidades críticas

#### **Día 5 (20 Dic)**: Cierre y documentación
- [ ] **Todo el equipo**:
  - Documentación final de API (Swagger)
  - Manual de usuario (básico)
  - Manual de administrador
  - Guía de despliegue
  - Entrega formal al cliente

---

## 📦 ENTREGABLES FINALES

### **Código**
- ✅ Backend completo (Node.js + Express + Sequelize)
- ✅ Frontend completo (React + TailwindCSS)
- ✅ Base de datos poblada
- ✅ Repositorio Git organizado

### **Documentación**
- ✅ Documentación API (Swagger)
- ✅ Manual de usuario
- ✅ Manual de administrador
- ✅ Guía de despliegue
- ✅ Requerimientos funcionales completos

### **Sistema Funcional**
- ✅ Aplicación desplegada en producción
- ✅ Todos los módulos funcionando
- ✅ Testing completo
- ✅ Monitoreo configurado

---

## ⚠️ RIESGOS Y MITIGACIONES

### **Riesgo 1: API ACIA no disponible para desarrollo**
- **Impacto**: Alto
- **Probabilidad**: Media
- **Mitigación**: 
  - Implementar API Mock desde Sprint 3
  - Diseñar interfaz clara para reemplazar con API real
  - Documentar formato esperado

### **Riesgo 2: Retrasos en algún sprint**
- **Impacto**: Alto
- **Probabilidad**: Media
- **Mitigación**:
  - Buffer de 5 días en Sprint 6
  - Priorizar funcionalidades críticas
  - Dejar funcionalidades "nice-to-have" para después

### **Riesgo 3: Problemas de rendimiento con muchos documentos**
- **Impacto**: Medio
- **Probabilidad**: Media
- **Mitigación**:
  - Implementar paginación desde el inicio
  - Índices optimizados en BD
  - Cache de consultas frecuentes
  - Testing de carga en Sprint 5

### **Riesgo 4: Complejidad de permisos RBAC**
- **Impacto**: Medio
- **Probabilidad**: Alta
- **Mitigación**:
  - Dedicar 2 semanas completas (Sprint 2)
  - Testing exhaustivo de permisos
  - Documentación clara de roles

### **Riesgo 5: Problemas en despliegue**
- **Impacto**: Alto
- **Probabilidad**: Baja
- **Mitigación**:
  - Desplegar a staging primero
  - Tener plan de rollback
  - Backup antes de despliegue

---

## 📊 MÉTRICAS DE SEGUIMIENTO

### **Semanales**
- ✅ Tareas completadas vs planificadas
- ✅ Bugs abiertos vs cerrados
- ✅ Code coverage (objetivo: >70%)
- ✅ APIs implementadas vs total

### **Por Sprint**
- ✅ Story points completados
- ✅ Velocidad del equipo
- ✅ Demos exitosas
- ✅ Retrospectivas realizadas

### **Finales**
- ✅ Funcionalidades implementadas: 100%
- ✅ Bugs críticos: 0
- ✅ Coverage de tests: >70%
- ✅ Documentación: Completa

---

## 🎯 PRIORIDADES POR FUNCIONALIDAD

### **CRÍTICAS (Imprescindibles para lanzamiento)**
1. ✅ Autenticación y RBAC
2. ✅ Gestión de usuarios administrativos
3. ✅ Verificación de contratistas (con/sin ACIA)
4. ✅ Carga de documentos
5. ✅ Revisión de documentos
6. ✅ Gestión de vigencias
7. ✅ Permisos especiales de carga

### **ALTAS (Importantes pero no bloqueantes)**
8. ✅ Dashboards básicos
9. ✅ Reportes con exportación
10. ✅ Notificaciones por email
11. ✅ Auditoría de acciones
12. ✅ Gestión de lista de chequeo dinámica

### **MEDIAS (Nice to have)**
13. ⚠️ Notificaciones en tiempo real (WebSockets)
14. ⚠️ Búsqueda global avanzada
15. ⚠️ Gráficos avanzados en dashboards
16. ⚠️ Foto de perfil

### **BAJAS (Post-lanzamiento)**
17. 🔵 Integración real con ACIA (reemplazar mock)
18. 🔵 IA para validación de documentos (OCR/NLP)
19. 🔵 Almacenamiento S3 (usar local primero)
20. 🔵 App móvil

---

## 📅 CEREMONIAS ÁGILES

### **Diarias**
- **Stand-up**: 15 min cada día (10:00 AM)
  - ¿Qué hiciste ayer?
  - ¿Qué harás hoy?
  - ¿Tienes bloqueos?

### **Por Sprint**
- **Planning**: Inicio de cada sprint (2h)
- **Review/Demo**: Día 10 de cada sprint (1h)
- **Retrospectiva**: Día 10 de cada sprint (1h)

### **Semanales**
- **Sincronización técnica**: Miércoles (1h)
  - Revisión de arquitectura
  - Integración de módulos
  - Resolución de bloqueos técnicos

---

## ⚠️ REGLAS IMPORTANTES DEL SISTEMA

### **🚫 POLÍTICA DE NO ELIMINACIÓN FÍSICA**

**IMPORTANTE**: En este sistema **NO SE ELIMINAN registros físicamente**.

#### **¿Por qué?**
- ✅ Preserva integridad referencial
- ✅ Mantiene historial completo para auditoría
- ✅ Permite reactivación de registros
- ✅ Cumple con normativas de trazabilidad SENA

#### **Implementación Backend (Sequelize)**

**Configuración del modelo:**
```javascript
// models/Usuario.js
const Usuario = sequelize.define('Usuario', {
  // ... campos
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  paranoid: false, // ❌ NO usar soft deletes
  defaultScope: {
    where: { activo: true } // ✅ Por defecto solo activos
  },
  scopes: {
    inactivos: { where: { activo: false } },
    todos: { where: {} }
  }
});
```

**Uso en controladores:**
```javascript
// ❌ MAL - NO hacer esto
await Usuario.destroy({ where: { id: userId } });

// ✅ BIEN - Cambiar estado
await Usuario.update(
  { activo: false }, 
  { where: { id: userId } }
);

// ✅ Listar solo activos (scope por defecto)
const usuarios = await Usuario.findAll();

// ✅ Listar todos (incluyendo inactivos)
const todos = await Usuario.scope('todos').findAll();
```

**API Endpoints:**
```javascript
// ✅ Endpoint para desactivar/activar
PUT /api/v1/usuarios/:id/estado
Body: { activo: false } // o true para reactivar
```

#### **Implementación Frontend (React)**

**Componente de listado:**
```jsx
// ❌ MAL - NO mostrar botón "Eliminar"
<button onClick={() => deleteUser(user.id)}>
  🗑️ Eliminar
</button>

// ✅ BIEN - Toggle Activar/Desactivar
<button 
  onClick={() => toggleUserStatus(user.id, !user.activo)}
  className={user.activo ? 'btn-warning' : 'btn-success'}
>
  {user.activo ? '🔴 Desactivar' : '✅ Activar'}
</button>

// ✅ Mostrar badge de estado
<span className={`badge ${user.activo ? 'badge-success' : 'badge-secondary'}`}>
  {user.activo ? 'Activo' : 'Inactivo'}
</span>
```

**Función de toggle:**
```javascript
const toggleUserStatus = async (userId, newStatus) => {
  if (!newStatus) {
    const confirm = window.confirm('¿Desactivar este usuario?');
    if (!confirm) return;
  }
  
  await axios.put(`/api/v1/usuarios/${userId}/estado`, {
    activo: newStatus
  });
  
  // Refrescar lista
  fetchUsers();
};
```

**Filtro por estado:**
```jsx
<select onChange={(e) => setFiltroEstado(e.target.value)}>
  <option value="activos">Solo Activos</option>
  <option value="inactivos">Solo Inactivos</option>
  <option value="todos">Todos</option>
</select>
```

#### **Tablas afectadas**
Todas las tablas principales tienen campo `activo`:
- regionales
- centros  
- usuarios
- contratistas
- roles
- permisos
- lista_chequeo
- vigencias

#### **Excepciones** (sí se pueden eliminar físicamente)
- `sesiones_instructores` (temporales, se limpian automáticamente)
- `revisiones` (histórico, se mantiene con CASCADE)
- Tablas pivote (usuario_centro, rol_permiso, etc.)

---

## 🛠️ HERRAMIENTAS Y STACK

### **Backend**
- Node.js 18+
- Express.js
- Sequelize ORM
- MySQL 8+
- JWT (jsonwebtoken)
- Bcrypt
- Multer (archivos)
- Nodemailer
- Winston (logs)
- Joi (validaciones)

### **Frontend**
- React 18+
- TypeScript (opcional pero recomendado)
- TailwindCSS
- React Router
- Axios
- React Query (opcional)
- Recharts (gráficos)
- React Table

### **Testing**
- Jest (unit tests)
- Supertest (API tests)
- React Testing Library
- Cypress (E2E, opcional)

### **DevOps**
- Git + GitHub/GitLab
- Docker (opcional)
- PM2 (process manager)
- Nginx (reverse proxy)

### **Gestión**
- Jira / Trello (tareas)
- Slack / Discord (comunicación)
- Confluence / Notion (documentación)

---

## ✅ CHECKLIST FINAL DE ENTREGA

### **Funcionalidades**
- [ ] Autenticación JWT funcionando
- [ ] 4 roles implementados correctamente
- [ ] Verificación ACIA (mock) funcionando
- [ ] Carga de documentos por contratistas
- [ ] Revisión de documentos
- [ ] Gestión de vigencias
- [ ] Permisos especiales de carga
- [ ] Dashboards por rol
- [ ] Reportes con exportación Excel
- [ ] Notificaciones por email
- [ ] Auditoría de acciones críticas

### **Calidad**
- [ ] Sin bugs críticos
- [ ] Testing >70% coverage
- [ ] Validaciones en todos los formularios
- [ ] Manejo de errores consistente
- [ ] Performance aceptable (<2s carga de páginas)

### **Seguridad**
- [ ] Passwords hasheados (bcrypt)
- [ ] JWT con expiración
- [ ] HTTPS en producción
- [ ] CORS configurado
- [ ] Rate limiting
- [ ] SQL injection prevention (Sequelize)
- [ ] XSS prevention

### **Arquitectura y Buenas Prácticas**
- [ ] ✅ **NO hay DELETE físico** - Solo cambio de estado `activo`
- [ ] Modelos Sequelize con `paranoid: false`
- [ ] Default scopes configurados para filtrar por `activo: true`
- [ ] Endpoints `/estado` implementados correctamente
- [ ] Frontend con botones "Activar/Desactivar" (NO "Eliminar")
- [ ] Filtros por estado en todas las listas (activos/inactivos/todos)

### **Documentación**
- [ ] README.md completo
- [ ] API documentada (Swagger)
- [ ] Manual de usuario
- [ ] Manual de administrador
- [ ] Guía de despliegue

### **Despliegue**
- [ ] Base de datos en producción
- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] SSL/HTTPS configurado
- [ ] Backup automático configurado
- [ ] Logs centralizados

---

## 📞 CONTACTO Y COMUNICACIÓN

### **Canales**
- **Slack/Discord**: Comunicación diaria
- **Video calls**: Stand-ups, planning, reviews
- **Email**: Comunicación formal con cliente

### **Horarios de trabajo**
- **Lunes a Viernes**: 8:00 AM - 6:00 PM
- **Stand-up**: 10:00 AM diario
- **Disponibilidad**: Flexible para resolver bloqueos

### **Escalación**
- **Bloqueo técnico**: Reportar en stand-up
- **Bloqueo de cliente**: Escalar a líder de proyecto
- **Cambio de alcance**: Reunión con todo el equipo

---

## 🎉 CONCLUSIÓN

Este plan de trabajo está diseñado para entregar un **sistema funcional y robusto** en **10.5 semanas** con un equipo de **3 desarrolladores**.

**Claves del éxito**:
1. ✅ Comunicación diaria efectiva
2. ✅ Priorización de funcionalidades críticas
3. ✅ Testing desde el inicio
4. ✅ Entregas incrementales por sprint
5. ✅ Documentación continua
6. ✅ Retrospectivas para mejora continua

**¡Manos a la obra! 🚀**

---

**Última actualización**: 7 de octubre de 2025  
**Versión**: 1.0

