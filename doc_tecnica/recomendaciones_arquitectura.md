# 🏗️ RECOMENDACIONES DE ARQUITECTURA - SISTEMA PREACIA
## Sistema Nacional de Gestión Documental Precontractual

---

## 📊 RESUMEN EJECUTIVO

Este documento presenta las recomendaciones técnicas para hacer el sistema **PREACIA** escalable y mantenible, considerando que es un **sistema nacional multicentro** para gestión de documentos precontractuales del SENA.

### Cambios Implementados en la Base de Datos

✅ **Estructura mejorada con 25+ tablas** optimizadas para escalabilidad  
✅ **UUIDs públicos** para seguridad (evita exposición de IDs secuenciales)  
✅ **Versionado de documentos** (reemplazos y control de versiones)  
✅ **Auditoría completa** con particionamiento por año  
✅ **Sistema de progreso** para tracking de completitud  
✅ **Multitenancy** por centro de formación  
✅ **Índices optimizados** para consultas frecuentes  
✅ **Triggers y procedimientos** para automatización  

---

## 🎯 ÁREAS CRÍTICAS DE MEJORA

### 1. ARQUITECTURA DE ALMACENAMIENTO DE ARCHIVOS

#### ❌ Problema Actual
- No hay estrategia definida de almacenamiento
- Riesgo de saturar disco del servidor
- Sin CDN para distribución de archivos
- Sin backup automático de documentos

#### ✅ Solución Recomendada: **Amazon S3 + CloudFront**

**Arquitectura propuesta:**

```
┌─────────────┐     Upload      ┌──────────────┐     Store      ┌─────────────┐
│   Cliente   │  ────────────>  │  API Backend │ ─────────────> │   AWS S3    │
│  (Browser)  │                 │   (Express)  │                │  (Storage)  │
└─────────────┘                 └──────────────┘                └─────────────┘
       │                               │                               │
       │                               │                               │
       │  Download (Signed URL)        │                               │
       │<──────────────────────────────┴───────────────────────────────┘
       │                                                                
       ▼                                                                
┌─────────────┐                                                        
│ CloudFront  │  (CDN para distribución rápida)                        
│    (CDN)    │                                                        
└─────────────┘                                                        
```

**Implementación Backend:**

```javascript
// src/shared/config/storage.config.js
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export const STORAGE_CONFIG = {
  bucket: process.env.AWS_S3_BUCKET || 'preacia-documentos-prod',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.docx'],
};

// src/modules/documentos/services/fileStorage.service.js
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

export class FileStorageService {
  
  /**
   * Genera ruta estructurada para el archivo
   * Estructura: centro/{centroId}/convocatoria/{convId}/año/mes/{uuid}.ext
   */
  generateFilePath(metadata) {
    const { centroId, convocatoriaId, uuid, extension } = metadata;
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    
    return `centro/${centroId}/convocatoria/${convocatoriaId}/${año}/${mes}/${uuid}${extension}`;
  }

  /**
   * Calcula hash SHA256 del archivo
   */
  calculateFileHash(fileBuffer) {
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  /**
   * Sube archivo a S3
   */
  async uploadFile(fileBuffer, metadata) {
    const filePath = this.generateFilePath(metadata);
    const fileHash = this.calculateFileHash(fileBuffer);

    const command = new PutObjectCommand({
      Bucket: STORAGE_CONFIG.bucket,
      Key: filePath,
      Body: fileBuffer,
      ContentType: metadata.mimeType,
      Metadata: {
        'original-name': metadata.nombreOriginal,
        'uploaded-by': String(metadata.usuarioId),
        'file-hash': fileHash,
      },
      ServerSideEncryption: 'AES256', // Encriptación en reposo
    });

    await s3Client.send(command);

    return {
      filePath,
      fileHash,
      url: `https://${STORAGE_CONFIG.bucket}.s3.amazonaws.com/${filePath}`
    };
  }

  /**
   * Genera URL firmada temporal para descarga segura
   * Expira en 1 hora
   */
  async getSignedDownloadUrl(filePath, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: STORAGE_CONFIG.bucket,
      Key: filePath,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Verifica si archivo es duplicado usando hash
   */
  async checkDuplicateFile(fileHash) {
    // Consultar en BD si existe un documento con ese hash
    const documento = await Documento.findOne({
      where: { hash_sha256: fileHash }
    });
    
    return documento;
  }
}
```

**Variables de Entorno necesarias:**

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=preacia-documentos-prod
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net

# Storage
STORAGE_TYPE=s3
MAX_FILE_SIZE_MB=10
```

**Ventajas:**
- ✅ Escalabilidad infinita
- ✅ Backup automático en S3
- ✅ CDN global con CloudFront
- ✅ Encriptación en reposo (AES-256)
- ✅ URLs firmadas temporales (seguridad)
- ✅ Bajo costo ($0.023 por GB/mes)

---

### 2. ARQUITECTURA MODULAR (PREPARACIÓN PARA MICROSERVICIOS)

#### Estructura de Módulos Propuesta:

```
src/
├── modules/
│   ├── auth/                         # Autenticación y autorización
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── index.js                  # Export del módulo
│   │
│   ├── usuarios/                     # Gestión de usuarios
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── index.js
│   │
│   ├── convocatorias/                # Gestión de convocatorias
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── index.js
│   │
│   ├── documentos/                   # Gestión de documentos
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── documento.service.js
│   │   │   ├── fileStorage.service.js
│   │   │   ├── validacion.service.js
│   │   │   └── virusScan.service.js
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── validators/
│   │   ├── jobs/                     # Jobs asíncronos
│   │   │   ├── procesarDocumentoIA.job.js
│   │   │   └── generarMiniaturas.job.js
│   │   └── index.js
│   │
│   ├── centros/                      # Gestión de centros
│   ├── contratos/                    # Gestión de contratos
│   ├── notificaciones/               # Sistema de notificaciones
│   │   ├── services/
│   │   │   ├── notificacion.service.js
│   │   │   ├── email.service.js
│   │   │   └── sms.service.js
│   │   ├── templates/                # Templates de emails
│   │   ├── listeners/                # Event listeners
│   │   └── index.js
│   │
│   ├── auditoria/                    # Sistema de auditoría
│   │   ├── services/
│   │   ├── middleware/
│   │   │   └── auditMiddleware.js
│   │   └── index.js
│   │
│   ├── reportes/                     # Generación de reportes
│   │   ├── services/
│   │   │   ├── dashboard.service.js
│   │   │   └── export.service.js
│   │   └── index.js
│   │
│   └── validacion-ia/                # Validación con IA (futuro)
│       ├── services/
│       │   ├── ocr.service.js
│       │   └── validacion.service.js
│       └── index.js
│
├── shared/                           # Código compartido entre módulos
│   ├── config/
│   │   ├── database.config.js
│   │   ├── storage.config.js
│   │   ├── redis.config.js
│   │   └── logger.config.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── validator.middleware.js
│   │
│   ├── utils/
│   │   ├── response.util.js
│   │   ├── pagination.util.js
│   │   └── encryption.util.js
│   │
│   ├── events/                       # Event bus
│   │   ├── eventEmitter.js
│   │   └── events.constants.js
│   │
│   ├── enums/
│   │   ├── estado.enum.js
│   │   ├── rol.enum.js
│   │   └── permiso.enum.js
│   │
│   └── interfaces/                   # Interfaces/Types (futuro TypeScript)
│
├── infrastructure/                   # Infraestructura
│   ├── database/
│   │   └── sequelize.js
│   ├── cache/
│   │   └── redis.js
│   ├── queue/
│   │   └── bullmq.js
│   └── monitoring/
│       └── prometheus.js
│
├── app.js                            # Configuración de Express
├── server.js                         # Entry point
└── routes.js                         # Registro de rutas
```

**Ventajas de esta estructura:**
- ✅ Cada módulo es independiente (bajo acoplamiento)
- ✅ Facilita trabajo en equipo (equipos por módulo)
- ✅ Preparado para microservicios (migración gradual)
- ✅ Reutilización de código en `/shared`
- ✅ Fácil testing unitario por módulo

---

### 3. SISTEMA DE EVENTOS (EVENT-DRIVEN ARCHITECTURE)

Para desacoplar módulos y mejorar escalabilidad:

```javascript
// src/shared/events/eventEmitter.js
import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}
export const eventBus = new AppEventEmitter();

// Definir eventos del sistema
export const EVENTS = {
  // Documentos
  DOCUMENTO_CARGADO: 'documento.cargado',
  DOCUMENTO_APROBADO: 'documento.aprobado',
  DOCUMENTO_RECHAZADO: 'documento.rechazado',
  DOCUMENTO_OBSERVADO: 'documento.observado',
  
  // Convocatorias
  CONVOCATORIA_CREADA: 'convocatoria.creada',
  CONVOCATORIA_PUBLICADA: 'convocatoria.publicada',
  CONVOCATORIA_CERRADA: 'convocatoria.cerrada',
  
  // Usuarios
  USUARIO_REGISTRADO: 'usuario.registrado',
  USUARIO_LOGIN: 'usuario.login',
  
  // Contratos
  CONTRATO_GENERADO: 'contrato.generado',
  CONTRATO_FIRMADO: 'contrato.firmado',
};
```

**Ejemplo de uso:**

```javascript
// src/modules/documentos/services/documento.service.js
import { eventBus, EVENTS } from '../../../shared/events/eventEmitter.js';

export const aprobarDocumentoService = async (documentoId, revisorId) => {
  const documento = await aprobarDocumento(documentoId, revisorId);
  
  // Emitir evento
  eventBus.emit(EVENTS.DOCUMENTO_APROBADO, {
    documentoId: documento.id,
    usuarioId: documento.usuario_id,
    convocatoriaId: documento.convocatoria_id,
    centroId: documento.centro_id,
    tipoDocumento: documento.tipo_documento_id,
    timestamp: new Date()
  });
  
  return documento;
};

// src/modules/notificaciones/listeners/documentoListener.js
import { eventBus, EVENTS } from '../../../shared/events/eventEmitter.js';
import { crearNotificacionService } from '../services/notificacion.service.js';
import { enviarEmailService } from '../services/email.service.js';

// Escuchar evento de documento aprobado
eventBus.on(EVENTS.DOCUMENTO_APROBADO, async (data) => {
  try {
    // 1. Crear notificación en BD
    await crearNotificacionService({
      usuario_id: data.usuarioId,
      tipo: 'documento_aprobado',
      titulo: 'Documento Aprobado',
      mensaje: `Tu documento ha sido aprobado exitosamente`,
      datos_adicionales: data
    });
    
    // 2. Enviar email
    await enviarEmailService({
      usuarioId: data.usuarioId,
      template: 'documento-aprobado',
      data: data
    });
    
    // 3. Actualizar progreso
    await actualizarProgresoUsuario(data.usuarioId, data.convocatoriaId);
    
    console.log(`Notificación enviada para documento ${data.documentoId}`);
  } catch (error) {
    console.error('Error al procesar evento DOCUMENTO_APROBADO:', error);
  }
});

// src/modules/auditoria/listeners/auditoriaListener.js
// Escuchar TODOS los eventos para auditoría
Object.values(EVENTS).forEach(evento => {
  eventBus.on(evento, async (data) => {
    await registrarAuditoria({
      accion: evento,
      entidad: data.entidad || 'sistema',
      entidad_id: data.id,
      datos_nuevos: data,
      usuario_id: data.usuarioId || null
    });
  });
});
```

**Ventajas:**
- ✅ Desacoplamiento total entre módulos
- ✅ Fácil agregar nuevas funcionalidades
- ✅ Auditoria automática de todos los eventos
- ✅ Preparado para Message Queue (RabbitMQ/Redis)

---

### 4. SISTEMA DE COLAS Y JOBS ASÍNCRONOS

Para tareas pesadas (procesamiento IA, envío masivo de emails):

**Implementación con BullMQ + Redis:**

```javascript
// src/infrastructure/queue/bullmq.js
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

// Crear colas
export const documentQueue = new Queue('document-processing', { connection });
export const emailQueue = new Queue('email-sending', { connection });
export const notificationQueue = new Queue('notifications', { connection });

// src/modules/documentos/jobs/procesarDocumentoIA.job.js
import { Worker } from 'bullmq';
import { connection } from '../../../infrastructure/queue/bullmq.js';
import { validarDocumentoConIA } from '../services/validacionIA.service.js';

export const documentWorker = new Worker(
  'document-processing',
  async (job) => {
    const { documentoId, rutaArchivo } = job.data;
    
    console.log(`Procesando documento ${documentoId}...`);
    
    try {
      // 1. Descargar archivo de S3
      const archivoBuffer = await descargarArchivo(rutaArchivo);
      
      // 2. Escanear virus
      const esSeguro = await escanearVirus(archivoBuffer);
      if (!esSeguro) {
        throw new Error('Archivo contiene malware');
      }
      
      // 3. Validar con IA (OCR + extracción de datos)
      const resultadoIA = await validarDocumentoConIA(archivoBuffer, documentoId);
      
      // 4. Actualizar documento en BD
      await actualizarDocumento(documentoId, {
        validado_ia: true,
        score_ia: resultadoIA.score,
        metadata_ia: resultadoIA.metadata,
        fecha_validacion_ia: new Date()
      });
      
      // 5. Si score es alto, auto-aprobar
      if (resultadoIA.score >= 90) {
        await aprobarDocumentoAutomaticamente(documentoId);
      }
      
      return { success: true, score: resultadoIA.score };
      
    } catch (error) {
      console.error(`Error procesando documento ${documentoId}:`, error);
      throw error; // BullMQ reintentará automáticamente
    }
  },
  {
    connection,
    concurrency: 5, // Procesar 5 documentos en paralelo
    limiter: {
      max: 10,
      duration: 1000 // Máximo 10 jobs por segundo
    }
  }
);

// src/modules/documentos/services/documento.service.js
import { documentQueue } from '../../../infrastructure/queue/bullmq.js';

export const cargarDocumentoService = async (archivo, metadata) => {
  // 1. Guardar archivo en S3
  const { filePath, fileHash } = await fileStorageService.uploadFile(archivo, metadata);
  
  // 2. Crear registro en BD
  const documento = await crearDocumento({
    ...metadata,
    ruta_archivo: filePath,
    hash_sha256: fileHash,
    estado_validacion: 'pendiente'
  });
  
  // 3. Encolar para procesamiento asíncrono
  await documentQueue.add('validate-document', {
    documentoId: documento.id,
    rutaArchivo: filePath
  }, {
    attempts: 3, // Reintentar hasta 3 veces si falla
    backoff: {
      type: 'exponential',
      delay: 2000 // 2s, 4s, 8s
    }
  });
  
  return documento;
};
```

**Variables de Entorno:**

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Queue Settings
QUEUE_CONCURRENCY=5
QUEUE_MAX_JOBS_PER_SECOND=10
```

**Ventajas:**
- ✅ No bloquea la respuesta HTTP
- ✅ Reintentos automáticos si falla
- ✅ Escalable (puedes tener múltiples workers)
- ✅ Monitoreo con Bull Dashboard

---

### 5. CACHÉ CON REDIS

Para reducir carga en la base de datos:

```javascript
// src/infrastructure/cache/redis.js
import Redis from 'ioredis';

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Utilidades de caché
export class CacheService {
  
  /**
   * Obtener del caché con auto-refresh
   */
  static async getOrSet(key, fetchFunction, ttl = 3600) {
    // Intentar obtener del caché
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Si no existe, ejecutar función y guardar
    const data = await fetchFunction();
    await redisClient.setex(key, ttl, JSON.stringify(data));
    
    return data;
  }
  
  /**
   * Invalidar caché por patrón
   */
  static async invalidatePattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
}

// Ejemplo de uso
// src/modules/convocatorias/services/convocatoria.service.js
import { CacheService } from '../../../infrastructure/cache/redis.js';

export const getConvocatoriaActivaService = async () => {
  return await CacheService.getOrSet(
    'convocatorias:activas',
    async () => {
      return await Convocatoria.findAll({
        where: { estado: 'activa' }
      });
    },
    300 // 5 minutos de TTL
  );
};

// Invalidar caché al crear/actualizar
export const crearConvocatoriaService = async (data) => {
  const convocatoria = await Convocatoria.create(data);
  
  // Invalidar caché
  await CacheService.invalidatePattern('convocatorias:*');
  
  return convocatoria;
};
```

**Qué cachear:**
- ✅ Convocatorias activas
- ✅ Lista de tipos de documentos
- ✅ Lista de centros
- ✅ Configuración del sistema
- ✅ Permisos por rol
- ✅ Estadísticas de dashboard

---

### 6. SEGURIDAD ADICIONAL

#### A. Rate Limiting

```javascript
// src/shared/middlewares/rateLimiter.middleware.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../../infrastructure/cache/redis.js';

// Rate limiter general
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:general:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde'
});

// Rate limiter estricto para login
export const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Solo 5 intentos de login
  skipSuccessfulRequests: true,
  message: 'Demasiados intentos de login, cuenta bloqueada por 15 minutos'
});

// Rate limiter para carga de archivos
export const uploadLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:upload:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 archivos por hora
  message: 'Límite de carga de archivos alcanzado, intenta en 1 hora'
});
```

#### B. Validación de Archivos Completa

```javascript
// src/modules/documentos/services/fileValidation.service.js
import fileType from 'file-type';
import crypto from 'crypto';

export class FileValidationService {
  
  /**
   * Validación completa de archivo
   */
  static async validateFile(fileBuffer, originalName) {
    // 1. Validar tamaño
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileBuffer.length > maxSize) {
      throw new Error('Archivo excede el tamaño máximo permitido (10MB)');
    }
    
    // 2. Validar tipo MIME real (no confiar en extensión)
    const fileTypeInfo = await fileType.fromBuffer(fileBuffer);
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (!fileTypeInfo || !allowedMimes.includes(fileTypeInfo.mime)) {
      throw new Error('Tipo de archivo no permitido. Solo PDF, JPG, PNG');
    }
    
    // 3. Validar extensión coincide con MIME
    const extension = path.extname(originalName).toLowerCase();
    const mimeToExt = {
      'application/pdf': '.pdf',
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': '.png'
    };
    
    const allowedExts = Array.isArray(mimeToExt[fileTypeInfo.mime]) 
      ? mimeToExt[fileTypeInfo.mime] 
      : [mimeToExt[fileTypeInfo.mime]];
      
    if (!allowedExts.includes(extension)) {
      throw new Error('Extensión del archivo no coincide con su contenido');
    }
    
    // 4. Calcular hash
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // 5. Buscar duplicados
    const duplicado = await Documento.findOne({
      where: { hash_sha256: hash }
    });
    
    if (duplicado) {
      throw new Error('Este archivo ya ha sido cargado anteriormente');
    }
    
    return {
      isValid: true,
      mimeType: fileTypeInfo.mime,
      extension: fileTypeInfo.ext,
      hash
    };
  }
  
  /**
   * Escanear virus con ClamAV (opcional pero recomendado)
   */
  static async scanVirus(fileBuffer) {
    // Integración con ClamAV
    // Por implementar según infraestructura
    return true;
  }
}
```

#### C. Encriptación de Datos Sensibles

```javascript
// src/shared/utils/encryption.util.js
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const IV_LENGTH = 16;

export class EncryptionService {
  
  /**
   * Encriptar datos sensibles
   */
  static encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      authTag: authTag.toString('hex')
    };
  }
  
  /**
   * Desencriptar datos
   */
  static decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(encrypted.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Uso: encriptar número de documento en BD
const docEncriptado = EncryptionService.encrypt(usuario.documento);
```

---

### 7. MONITOREO Y OBSERVABILIDAD

```javascript
// src/infrastructure/monitoring/prometheus.js
import promClient from 'prom-client';

// Crear registro de métricas
const register = new promClient.Registry();

// Métricas por defecto
promClient.collectDefaultMetrics({ register });

// Métricas personalizadas
export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de peticiones HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

export const documentosSubidos = new promClient.Counter({
  name: 'documentos_subidos_total',
  help: 'Total de documentos subidos',
  labelNames: ['centro_id', 'tipo_documento'],
  registers: [register]
});

export const documentosAprobados = new promClient.Counter({
  name: 'documentos_aprobados_total',
  help: 'Total de documentos aprobados',
  labelNames: ['centro_id'],
  registers: [register]
});

export const convocatoriasActivas = new promClient.Gauge({
  name: 'convocatorias_activas',
  help: 'Número de convocatorias activas actualmente',
  registers: [register]
});

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Middleware para registrar métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});
```

**Stack de monitoreo recomendado:**
- **Prometheus** - Recolección de métricas
- **Grafana** - Visualización de dashboards
- **Loki** - Agregación de logs
- **Sentry** - Tracking de errores

---

### 8. LOGGING ESTRUCTURADO

```javascript
// src/shared/config/logger.config.js
import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, printf, colorize } = winston.format;

// Formato personalizado
const customFormat = printf(({ timestamp, level, message, ...meta }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...meta
  });
});

// Transportes
const transports = [
  // Consola (desarrollo)
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp(),
      printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    )
  }),
  
  // Archivo rotativo (producción)
  new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: combine(timestamp(), json())
  }),
  
  // Archivo de errores
  new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '90d',
    format: combine(timestamp(), json())
  })
];

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  defaultMeta: { service: 'preacia-backend' },
  transports
});

// Uso en la aplicación
import { logger } from './shared/config/logger.config.js';

logger.info('Usuario inició sesión', {
  usuarioId: usuario.id,
  ip: req.ip,
  userAgent: req.get('user-agent')
});

logger.error('Error al procesar documento', {
  error: error.message,
  stack: error.stack,
  documentoId: documento.id
});
```

---

### 9. TESTING

#### A. Testing Unitario con Jest

```javascript
// src/modules/documentos/services/__tests__/documento.service.test.js
import { cargarDocumentoService } from '../documento.service.js';
import { FileStorageService } from '../fileStorage.service.js';
import { Documento } from '../../models/documento.model.js';

jest.mock('../fileStorage.service.js');
jest.mock('../../models/documento.model.js');

describe('DocumentoService', () => {
  describe('cargarDocumentoService', () => {
    it('debe cargar un documento correctamente', async () => {
      // Arrange
      const archivo = Buffer.from('archivo de prueba');
      const metadata = {
        usuarioId: 1,
        convocatoriaId: 1,
        tipoDocumentoId: 1,
        centroId: 1
      };
      
      FileStorageService.uploadFile.mockResolvedValue({
        filePath: 'test/path/file.pdf',
        fileHash: 'abc123'
      });
      
      Documento.create.mockResolvedValue({
        id: 1,
        ruta_archivo: 'test/path/file.pdf'
      });
      
      // Act
      const resultado = await cargarDocumentoService(archivo, metadata);
      
      // Assert
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(FileStorageService.uploadFile).toHaveBeenCalledWith(archivo, metadata);
      expect(Documento.create).toHaveBeenCalled();
    });
    
    it('debe rechazar archivos duplicados', async () => {
      // Arrange
      const archivo = Buffer.from('archivo duplicado');
      
      FileStorageService.uploadFile.mockRejectedValue(
        new Error('Archivo duplicado')
      );
      
      // Act & Assert
      await expect(
        cargarDocumentoService(archivo, {})
      ).rejects.toThrow('Archivo duplicado');
    });
  });
});
```

#### B. Testing de Integración

```javascript
// src/modules/documentos/__tests__/documento.integration.test.js
import request from 'supertest';
import app from '../../../app.js';
import { sequelize } from '../../../config/database.config.js';

describe('API de Documentos - Integración', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Crear datos de prueba
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
  
  describe('POST /api/v1/documentos', () => {
    it('debe cargar un documento con autenticación válida', async () => {
      const token = 'token_valido_jwt';
      
      const response = await request(app)
        .post('/api/v1/documentos')
        .set('Authorization', `Bearer ${token}`)
        .attach('archivo', Buffer.from('archivo de prueba'), 'test.pdf')
        .field('tipoDocumentoId', '1')
        .field('convocatoriaId', '1');
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });
    
    it('debe rechazar sin autenticación', async () => {
      const response = await request(app)
        .post('/api/v1/documentos')
        .attach('archivo', Buffer.from('test'), 'test.pdf');
      
      expect(response.status).toBe(401);
    });
  });
});
```

---

### 10. CI/CD

#### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: preacia_test
        ports:
          - 3306:3306
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
        env:
          DB_HOST: localhost
          DB_PORT: 3306
          DB_NAME: preacia_test
          DB_USER: root
          DB_PASSWORD: test
          REDIS_HOST: localhost
          REDIS_PORT: 6379
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t preacia-backend:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push preacia-backend:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        run: |
          # Deploy usando SSH o servicios cloud
          echo "Deploying version ${{ github.sha }}"
```

---

## 📦 DEPENDENCIAS ADICIONALES RECOMENDADAS

```json
{
  "dependencies": {
    // Actuales
    "express": "^4.21.2",
    "sequelize": "^6.37.7",
    "mysql2": "^3.12.0",
    
    // Almacenamiento
    "@aws-sdk/client-s3": "^3.500.0",
    "@aws-sdk/s3-request-presigner": "^3.500.0",
    "file-type": "^18.7.0",
    "sharp": "^0.33.2", // Procesamiento de imágenes
    
    // Colas y Cache
    "bullmq": "^5.1.0",
    "ioredis": "^5.3.2",
    
    // Rate Limiting
    "express-rate-limit": "^7.1.5",
    "rate-limit-redis": "^4.2.0",
    
    // Logging y Monitoreo
    "winston": "^3.11.0",
    "winston-daily-rotate-file": "^4.7.1",
    "prom-client": "^15.1.0",
    "@sentry/node": "^7.99.0",
    
    // Seguridad
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "express-mongo-sanitize": "^2.2.0",
    
    // Utilidades
    "compression": "^1.7.4",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.4",
    "@types/jest": "^29.5.11",
    "eslint": "^8.56.0",
    "prettier": "^3.6.0"
  }
}
```

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### Fase 1 (Mes 1): Fundamentos
- ✅ Migrar a estructura modular
- ✅ Implementar almacenamiento S3
- ✅ Configurar Redis y caché básico
- ✅ Implementar logging estructurado
- ✅ Setup CI/CD básico

### Fase 2 (Mes 2): Escalabilidad
- ✅ Implementar sistema de eventos
- ✅ Configurar BullMQ para jobs asíncronos
- ✅ Implementar rate limiting
- ✅ Mejorar validaciones de archivos
- ✅ Configurar monitoreo (Prometheus + Grafana)

### Fase 3 (Mes 3): Optimización
- ✅ Implementar validación con IA
- ✅ Optimizar queries de BD
- ✅ Implementar CDN (CloudFront)
- ✅ Testing completo (unitario + integración)
- ✅ Documentación completa

### Fase 4 (Mes 4): Producción
- ✅ Auditoría de seguridad
- ✅ Load testing
- ✅ Disaster recovery plan
- ✅ Training del equipo
- ✅ Deploy a producción

---

## 📊 MÉTRICAS DE ÉXITO

| Métrica | Objetivo |
|---------|----------|
| Tiempo de respuesta API | < 200ms (p95) |
| Uptime | > 99.9% |
| Tiempo de carga de documentos | < 5s |
| Capacidad de usuarios concurrentes | > 1000 |
| Tasa de error | < 0.1% |
| Cobertura de tests | > 80% |

---

## 💰 ESTIMACIÓN DE COSTOS (AWS)

### Producción (estimado mensual):
- **EC2** (t3.medium x2): $60/mes
- **RDS MySQL** (db.t3.medium): $85/mes
- **ElastiCache Redis**: $50/mes
- **S3** (500GB almacenamiento): $12/mes
- **CloudFront** (1TB transferencia): $85/mes
- **Backup** (S3 Glacier): $4/mes
- **ALB** (Load Balancer): $25/mes

**Total estimado: ~$320/mes**

---

## 🎓 CONCLUSIONES

El sistema PREACIA tiene excelente base arquitectónica. Las mejoras propuestas lo preparan para:

1. ✅ **Escalabilidad horizontal**: Múltiples instancias con load balancing
2. ✅ **Mantenibilidad**: Código modular y desacoplado
3. ✅ **Seguridad**: Validaciones robustas y encriptación
4. ✅ **Performance**: Caché, CDN, procesamiento asíncrono
5. ✅ **Observabilidad**: Logs, métricas, alertas
6. ✅ **Alta disponibilidad**: Redundancia y disaster recovery

**¿Listo para implementar? 🚀**
