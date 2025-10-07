# ✅ CHECKLIST DE IMPLEMENTACIÓN - SISTEMA PREACIA

## 🎯 Guía rápida para implementar todas las mejoras

---

## 📋 FASE 1: MIGRACIÓN DE BASE DE DATOS (Prioridad CRÍTICA)

### Paso 1: Backup de base de datos actual
```bash
# Crear backup completo
mysqldump -u root -p preacia > backup_preacia_$(date +%Y%m%d).sql

# Crear backup de estructura solamente
mysqldump -u root -p --no-data preacia > backup_estructura_$(date +%Y%m%d).sql
```

- [ ] Backup creado y verificado
- [ ] Backup almacenado en ubicación segura
- [ ] Backup probado en entorno de desarrollo

### Paso 2: Crear nueva base de datos (Testing)
```bash
# Crear BD de testing
mysql -u root -p -e "CREATE DATABASE preacia_test;"

# Ejecutar nueva estructura
mysql -u root -p preacia_test < src/database/database_v2_mejorado.sql

# Cargar datos de prueba
mysql -u root -p preacia_test < src/database/data_v2_mejorado.sql
```

- [ ] BD de testing creada
- [ ] Estructura nueva cargada sin errores
- [ ] Datos de prueba cargados correctamente
- [ ] Verificar todas las FK funcionan

### Paso 3: Actualizar modelos de Sequelize

- [ ] Crear modelo `Convocatoria`
- [ ] Crear modelo `DocumentoRequerido`
- [ ] Crear modelo `Documento` (mejorado)
- [ ] Crear modelo `RevisionDocumento`
- [ ] Crear modelo `ObservacionRevision`
- [ ] Crear modelo `Contrato`
- [ ] Crear modelo `DocumentoContrato`
- [ ] Crear modelo `Notificacion`
- [ ] Crear modelo `ConfiguracionNotificacionUsuario`
- [ ] Crear modelo `UsuarioConvocatoriaProgreso`
- [ ] Crear modelo `Auditoria`
- [ ] Crear modelo `ConfiguracionCentro`
- [ ] Crear modelo `ParametroSistema`
- [ ] Crear modelo `TipoContrato`
- [ ] Crear modelo `CategoriaDocumento`
- [ ] Actualizar relaciones en `models/index.js`

### Paso 4: Migración de datos existentes

```javascript
// Script de migración: src/database/scripts/migrate_to_v2.js
import { sequelize } from '../config/db.config.js';

async function migrateData() {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. Migrar usuarios (agregar UUIDs)
    await sequelize.query(`
      UPDATE usuarios SET uuid = UUID() WHERE uuid IS NULL
    `, { transaction });
    
    // 2. Migrar centros
    // ... más migraciones
    
    await transaction.commit();
    console.log('✅ Migración completada');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error en migración:', error);
  }
}
```

- [ ] Script de migración creado
- [ ] Probado en ambiente de testing
- [ ] Datos migrados correctamente
- [ ] Verificar integridad referencial

---

## 📦 FASE 2: CONFIGURACIÓN DE INFRAESTRUCTURA

### Paso 1: Configurar AWS S3

1. **Crear bucket en AWS S3:**
```bash
# Desde AWS CLI
aws s3 mb s3://preacia-documentos-prod --region us-east-1

# Configurar CORS
aws s3api put-bucket-cors --bucket preacia-documentos-prod --cors-configuration file://cors-config.json
```

2. **Configurar permisos IAM:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::preacia-documentos-prod",
        "arn:aws:s3:::preacia-documentos-prod/*"
      ]
    }
  ]
}
```

- [ ] Bucket S3 creado
- [ ] Usuario IAM creado con permisos correctos
- [ ] Access keys generadas
- [ ] CORS configurado
- [ ] Versionado habilitado en bucket
- [ ] Lifecycle rules configuradas (borrado automático opcional)

3. **Agregar variables de entorno:**
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=preacia-documentos-prod
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net

STORAGE_TYPE=s3
MAX_FILE_SIZE_MB=10
```

- [ ] Variables agregadas al `.env`
- [ ] Variables configuradas en servidor de producción
- [ ] Conexión a S3 probada

### Paso 2: Configurar Redis

**Opción A: Local (Desarrollo)**
```bash
# Instalar Redis
sudo apt-get install redis-server

# Iniciar Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Probar conexión
redis-cli ping
```

**Opción B: AWS ElastiCache (Producción)**
- Crear cluster de ElastiCache
- Obtener endpoint
- Configurar security groups

```env
# Redis Configuration
REDIS_HOST=localhost  # o endpoint de ElastiCache
REDIS_PORT=6379
REDIS_PASSWORD=
```

- [ ] Redis instalado/configurado
- [ ] Conexión probada
- [ ] Variables de entorno configuradas

### Paso 3: Instalar dependencias adicionales

```bash
npm install --save \
  @aws-sdk/client-s3 \
  @aws-sdk/s3-request-presigner \
  bullmq \
  ioredis \
  file-type \
  sharp \
  express-rate-limit \
  rate-limit-redis \
  winston \
  winston-daily-rotate-file \
  prom-client \
  helmet \
  compression \
  uuid

npm install --save-dev \
  jest \
  supertest \
  @types/jest \
  eslint \
  eslint-config-airbnb-base \
  eslint-plugin-import
```

- [ ] Dependencias instaladas
- [ ] `package.json` actualizado
- [ ] Commit de cambios

---

## 🏗️ FASE 3: REESTRUCTURACIÓN DEL CÓDIGO

### Paso 1: Crear nueva estructura de carpetas

```bash
mkdir -p src/modules/{auth,usuarios,convocatorias,documentos,centros,contratos,notificaciones,auditoria,reportes}
mkdir -p src/shared/{config,middlewares,utils,events,enums}
mkdir -p src/infrastructure/{database,cache,queue,monitoring}
mkdir -p logs
```

- [ ] Estructura de carpetas creada
- [ ] README.md actualizado con nueva estructura

### Paso 2: Migrar código a módulos

**Por cada módulo:**

- [ ] **Módulo Auth**
  - [ ] Mover controladores a `modules/auth/controllers/`
  - [ ] Mover servicios a `modules/auth/services/`
  - [ ] Mover repositorios a `modules/auth/repositories/`
  - [ ] Mover modelos a `modules/auth/models/`
  - [ ] Mover validators a `modules/auth/validators/`
  - [ ] Crear `modules/auth/index.js` con exports

- [ ] **Módulo Usuarios**
- [ ] **Módulo Convocatorias**
- [ ] **Módulo Documentos**
- [ ] **Módulo Centros**
- [ ] **Módulo Contratos**
- [ ] **Módulo Notificaciones**
- [ ] **Módulo Auditoría**
- [ ] **Módulo Reportes**

### Paso 3: Implementar código compartido

- [ ] Crear `shared/config/database.config.js`
- [ ] Crear `shared/config/storage.config.js`
- [ ] Crear `shared/config/redis.config.js`
- [ ] Crear `shared/config/logger.config.js`
- [ ] Crear `shared/events/eventEmitter.js`
- [ ] Crear `shared/events/events.constants.js`
- [ ] Mover middlewares a `shared/middlewares/`
- [ ] Mover utils a `shared/utils/`
- [ ] Mover enums a `shared/enums/`

### Paso 4: Implementar sistema de eventos

```javascript
// shared/events/eventEmitter.js
import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}
export const eventBus = new AppEventEmitter();

export const EVENTS = {
  DOCUMENTO_CARGADO: 'documento.cargado',
  DOCUMENTO_APROBADO: 'documento.aprobado',
  DOCUMENTO_RECHAZADO: 'documento.rechazado',
  // ... más eventos
};
```

- [ ] Event emitter implementado
- [ ] Constantes de eventos definidas
- [ ] Listeners creados en cada módulo
- [ ] Eventos emitidos en servicios

---

## 🔒 FASE 4: SEGURIDAD

### Checklist de Seguridad

- [ ] **Rate Limiting implementado**
  - [ ] General limiter (100 req/15min)
  - [ ] Login limiter (5 intentos/15min)
  - [ ] Upload limiter (50 archivos/hora)

- [ ] **Validación de archivos**
  - [ ] Validación de tamaño (max 10MB)
  - [ ] Validación de MIME type real
  - [ ] Verificación de extensión vs contenido
  - [ ] Hash SHA256 para detección de duplicados
  - [ ] Escaneo de virus (ClamAV) - opcional

- [ ] **Headers de seguridad (Helmet)**
```javascript
import helmet from 'helmet';
app.use(helmet());
```

- [ ] **CORS configurado correctamente**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

- [ ] **Sanitización de inputs**
- [ ] **Encriptación de datos sensibles**
- [ ] **JWT con expiración configurada**
- [ ] **Secrets en variables de entorno**
- [ ] **Bloqueo de cuenta tras intentos fallidos**

---

## 📊 FASE 5: MONITOREO Y LOGGING

### Paso 1: Configurar Winston Logger

```javascript
// shared/config/logger.config.js
import winston from 'winston';
import 'winston-daily-rotate-file';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '90d'
    })
  ]
});
```

- [ ] Logger configurado
- [ ] Directorio `logs/` creado
- [ ] `.gitignore` actualizado (ignorar logs)
- [ ] Logs implementados en toda la aplicación

### Paso 2: Configurar Prometheus

- [ ] Métricas de Prometheus implementadas
- [ ] Endpoint `/metrics` creado
- [ ] Métricas personalizadas creadas:
  - [ ] `http_request_duration_seconds`
  - [ ] `documentos_subidos_total`
  - [ ] `documentos_aprobados_total`
  - [ ] `convocatorias_activas`

### Paso 3: Configurar Grafana (Opcional pero recomendado)

- [ ] Grafana instalado
- [ ] Datasource de Prometheus configurado
- [ ] Dashboards creados:
  - [ ] Performance de API
  - [ ] Estadísticas de documentos
  - [ ] Usuarios activos
  - [ ] Errores y excepciones

---

## 🧪 FASE 6: TESTING

### Paso 1: Configurar Jest

```json
// package.json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ]
  }
}
```

- [ ] Jest configurado
- [ ] Scripts de test agregados

### Paso 2: Escribir tests

- [ ] **Tests unitarios (mínimo 80% cobertura)**
  - [ ] Services
  - [ ] Repositories
  - [ ] Utils
  - [ ] Middlewares

- [ ] **Tests de integración**
  - [ ] Endpoints de API
  - [ ] Flujos completos (registro → login → carga documento)

- [ ] **Tests E2E (opcional)**

### Paso 3: CI/CD

- [ ] Crear `.github/workflows/ci.yml`
- [ ] Configurar tests automáticos en PR
- [ ] Configurar deploy automático a staging
- [ ] Configurar deploy manual a producción

---

## 🚀 FASE 7: PERFORMANCE Y OPTIMIZACIÓN

### Paso 1: Implementar Caché con Redis

- [ ] Caché de convocatorias activas (TTL: 5min)
- [ ] Caché de lista de centros (TTL: 1hora)
- [ ] Caché de tipos de documentos (TTL: 1hora)
- [ ] Caché de roles y permisos (TTL: 30min)
- [ ] Caché de configuración del sistema (TTL: 10min)

### Paso 2: Optimizar queries de BD

- [ ] Verificar uso de índices
- [ ] Implementar eager loading donde sea necesario
- [ ] Agregar paginación a todas las listas
- [ ] Usar `attributes` para seleccionar solo campos necesarios
- [ ] Implementar soft deletes si es necesario

### Paso 3: Implementar compresión

```javascript
import compression from 'compression';
app.use(compression());
```

- [ ] Compresión GZIP habilitada

### Paso 4: CDN para archivos estáticos

- [ ] CloudFront configurado
- [ ] URLs de documentos usando CDN
- [ ] Cache headers configurados

---

## 📱 FASE 8: FUNCIONALIDADES AVANZADAS

### Paso 1: Sistema de Colas (BullMQ)

- [ ] BullMQ configurado
- [ ] Queue de procesamiento de documentos
- [ ] Queue de envío de emails
- [ ] Queue de notificaciones
- [ ] Workers implementados
- [ ] Dashboard de Bull (opcional)

### Paso 2: Procesamiento con IA (Futuro)

- [ ] Integración con servicio OCR (AWS Textract / Google Vision)
- [ ] Extracción automática de datos de documentos
- [ ] Validación automática de identidad
- [ ] Score de confianza implementado

### Paso 3: Notificaciones avanzadas

- [ ] Templates de email con HTML
- [ ] Envío de emails transaccionales
- [ ] Notificaciones push (opcional)
- [ ] SMS para notificaciones urgentes (opcional)
- [ ] Sistema de preferencias de notificaciones

---

## 📄 FASE 9: DOCUMENTACIÓN

### Checklist de Documentación

- [ ] **README.md actualizado**
  - [ ] Descripción del proyecto
  - [ ] Requisitos
  - [ ] Instalación
  - [ ] Configuración
  - [ ] Uso

- [ ] **Documentación de API (Swagger)**
  - [ ] Actualizar todos los endpoints
  - [ ] Ejemplos de request/response
  - [ ] Códigos de error documentados

- [ ] **Diagramas**
  - [ ] Diagrama de arquitectura
  - [ ] Diagrama de base de datos (ERD)
  - [ ] Diagrama de flujo de documentos

- [ ] **Guías para desarrolladores**
  - [ ] Cómo agregar un nuevo módulo
  - [ ] Cómo agregar un nuevo endpoint
  - [ ] Convenciones de código
  - [ ] Guía de testing

- [ ] **Manual de despliegue**
  - [ ] Configuración de servidores
  - [ ] Variables de entorno
  - [ ] Proceso de deploy
  - [ ] Rollback en caso de error

---

## 🎯 FASE 10: DEPLOY A PRODUCCIÓN

### Pre-deploy Checklist

- [ ] Todos los tests pasan (verde ✅)
- [ ] Cobertura de tests > 80%
- [ ] No hay errores de linter
- [ ] Variables de entorno configuradas
- [ ] Backup de BD de producción realizado
- [ ] Plan de rollback definido
- [ ] Monitoring configurado

### Deploy Checklist

1. **Preparación:**
   - [ ] Notificar al equipo sobre el deploy
   - [ ] Verificar que no hay convocatorias activas críticas
   - [ ] Crear tag en Git (`v2.0.0`)

2. **Migración de BD:**
   - [ ] Backup de BD de producción
   - [ ] Ejecutar migraciones en modo dry-run
   - [ ] Ejecutar migraciones reales
   - [ ] Verificar integridad de datos

3. **Deploy de aplicación:**
   - [ ] Pull del código en servidor
   - [ ] `npm ci` (instalar dependencias)
   - [ ] Rebuild si es necesario
   - [ ] Reiniciar servicios
   - [ ] Verificar health check

4. **Verificación post-deploy:**
   - [ ] Verificar login funciona
   - [ ] Verificar carga de documentos funciona
   - [ ] Verificar notificaciones funcionan
   - [ ] Revisar logs por errores
   - [ ] Monitorear métricas por 1 hora

5. **Rollback (si algo falla):**
   - [ ] Revertir código a versión anterior
   - [ ] Restaurar backup de BD
   - [ ] Reiniciar servicios
   - [ ] Notificar al equipo

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs a monitorear:

- [ ] **Performance**
  - Tiempo de respuesta API < 200ms (p95)
  - Tiempo de carga de documentos < 5s
  - Uptime > 99.9%

- [ ] **Calidad**
  - Tasa de error < 0.1%
  - Cobertura de tests > 80%
  - 0 vulnerabilidades críticas

- [ ] **Usuarios**
  - > 1000 usuarios concurrentes soportados
  - Satisfacción de usuarios > 4.5/5
  - Tasa de completitud de documentos > 90%

---

## 🎓 RECURSOS Y REFERENCIAS

### Documentación Oficial:
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-examples.html)
- [BullMQ](https://docs.bullmq.io/)
- [Winston](https://github.com/winstonjs/winston)

### Tutoriales Recomendados:
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design Guide](https://restfulapi.net/)
- [JWT Authentication](https://jwt.io/introduction)

---

## ✅ CHECKLIST FINAL

Antes de considerar el proyecto completo:

- [ ] ✅ Base de datos migrada y optimizada
- [ ] ✅ Almacenamiento en S3 funcionando
- [ ] ✅ Caché con Redis implementado
- [ ] ✅ Sistema de eventos funcionando
- [ ] ✅ Colas de jobs procesando correctamente
- [ ] ✅ Seguridad implementada (rate limiting, validaciones)
- [ ] ✅ Logging y monitoreo configurado
- [ ] ✅ Tests escritos y pasando
- [ ] ✅ CI/CD configurado
- [ ] ✅ Documentación completa
- [ ] ✅ Deploy a producción exitoso
- [ ] ✅ Equipo capacitado

---

## 🚀 ¡LISTO PARA PRODUCCIÓN!

Cuando todos los checkboxes estén marcados, el sistema estará:
- ✅ Escalable para nivel nacional
- ✅ Mantenible y bien documentado
- ✅ Seguro y confiable
- ✅ Monitoreable y observable
- ✅ Listo para crecer

**¡Éxito con la implementación! 🎉**
