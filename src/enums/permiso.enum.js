/**
 * Enumerador para los permisos del sistema.
 * Basado en la matriz de permisos por rol definida en functional_requirements.md
 */
export const PermisoEnum = {
    // ============================================================
    // GESTIÓN DE DOCUMENTOS
    // ============================================================
    CARGAR_DOCUMENTOS_PROPIOS: 'cargar_documentos_propios',
    VER_DOCUMENTOS_PROPIOS: 'ver_documentos_propios',
    VER_DOCUMENTOS_CENTRO: 'ver_documentos_centro',
    VER_DOCUMENTOS_REGIONAL: 'ver_documentos_regional',
    VER_DOCUMENTOS_TODOS: 'ver_documentos_todos',
    REVISAR_DOCUMENTOS_CENTRO: 'revisar_documentos_centro',
    REVISAR_DOCUMENTOS_REGIONAL: 'revisar_documentos_regional',
    REVISAR_DOCUMENTOS_TODOS: 'revisar_documentos_todos',

    // ============================================================
    // GESTIÓN DE USUARIOS
    // ============================================================
    VER_USUARIOS_CENTRO: 'ver_usuarios_centro',
    VER_USUARIOS_REGIONAL: 'ver_usuarios_regional',
    VER_USUARIOS_TODOS: 'ver_usuarios_todos',
    CREAR_USUARIOS_CENTRO: 'crear_usuarios_centro',
    CREAR_USUARIOS_REGIONAL: 'crear_usuarios_regional',
    CREAR_USUARIOS_TODOS: 'crear_usuarios_todos',
    CREAR_ADMIN_CENTRO: 'crear_admin_centro',
    CREAR_DIRECTOR_REGIONAL: 'crear_director_regional',
    EDITAR_USUARIOS_CENTRO: 'editar_usuarios_centro',
    EDITAR_USUARIOS_REGIONAL: 'editar_usuarios_regional',
    EDITAR_USUARIOS_TODOS: 'editar_usuarios_todos',
    CAMBIAR_ROLES_LIMITADO: 'cambiar_roles_limitado',
    CAMBIAR_ROLES_TODOS: 'cambiar_roles_todos',
    DESACTIVAR_USUARIOS_CENTRO: 'desactivar_usuarios_centro',
    DESACTIVAR_USUARIOS_REGIONAL: 'desactivar_usuarios_regional',
    DESACTIVAR_USUARIOS_TODOS: 'desactivar_usuarios_todos',

    // ============================================================
    // GESTIÓN DE ESTRUCTURA ORGANIZACIONAL
    // ============================================================
    VER_REGIONALES_PROPIA: 'ver_regionales_propia',
    VER_REGIONALES_TODAS: 'ver_regionales_todas',
    CREAR_REGIONALES: 'crear_regionales',
    EDITAR_REGIONALES: 'editar_regionales',
    VER_CENTROS_PROPIOS: 'ver_centros_propios',
    VER_CENTROS_REGIONAL: 'ver_centros_regional',
    VER_CENTROS_TODOS: 'ver_centros_todos',
    CREAR_CENTROS_REGIONAL: 'crear_centros_regional',
    CREAR_CENTROS_TODOS: 'crear_centros_todos',
    EDITAR_CENTROS_REGIONAL: 'editar_centros_regional',
    EDITAR_CENTROS_TODOS: 'editar_centros_todos',

    // ============================================================
    // GESTIÓN DE LISTA DE CHEQUEO
    // ============================================================
    VER_LISTA_CHEQUEO: 'ver_lista_chequeo',
    CREAR_ITEMS_LISTA_CHEQUEO: 'crear_items_lista_chequeo',
    EDITAR_ITEMS_LISTA_CHEQUEO: 'editar_items_lista_chequeo',
    REORDENAR_LISTA_CHEQUEO: 'reordenar_lista_chequeo',
    ACTIVAR_DESACTIVAR_ITEMS: 'activar_desactivar_items',

    // ============================================================
    // GESTIÓN DE VIGENCIAS
    // ============================================================
    VER_VIGENCIAS: 'ver_vigencias',
    CREAR_VIGENCIAS: 'crear_vigencias',
    EDITAR_VIGENCIAS: 'editar_vigencias',
    ACTIVAR_VIGENCIAS: 'activar_vigencias',
    OTORGAR_PERMISOS_CARGA: 'otorgar_permisos_carga',

    // ============================================================
    // REPORTES Y ESTADÍSTICAS
    // ============================================================
    VER_DASHBOARD_PERSONAL: 'ver_dashboard_personal',
    VER_DASHBOARD_CENTRO: 'ver_dashboard_centro',
    VER_DASHBOARD_REGIONAL: 'ver_dashboard_regional',
    VER_DASHBOARD_NACIONAL: 'ver_dashboard_nacional',
    EXPORTAR_REPORTES_PROPIOS: 'exportar_reportes_propios',
    EXPORTAR_REPORTES_CENTRO: 'exportar_reportes_centro',
    EXPORTAR_REPORTES_REGIONAL: 'exportar_reportes_regional',
    EXPORTAR_REPORTES_TODOS: 'exportar_reportes_todos',

    // ============================================================
    // CONFIGURACIÓN DEL SISTEMA
    // ============================================================
    CAMBIAR_CONFIGURACION_GLOBAL: 'cambiar_configuracion_global',
    VER_AUDITORIA_CENTRO: 'ver_auditoria_centro',
    VER_AUDITORIA_REGIONAL: 'ver_auditoria_regional',
    VER_AUDITORIA_COMPLETA: 'ver_auditoria_completa',

    // ============================================================
    // GESTIÓN DE ROLES Y PERMISOS
    // ============================================================
    GESTIONAR_ROLES: 'gestionar_roles',
    GESTIONAR_PERMISOS: 'gestionar_permisos',
    
    // ============================================================
    // GESTIÓN DE TIPO DE DOCUMENTOS
    // ============================================================
    GESTIONAR_TIPO_DOCUMENTOS: 'gestionar_tipo_documentos',

    // ============================================================
    // GESTIÓN DE CUENTA PERSONAL
    // ============================================================
    GESTIONAR_CUENTA_PROPIA: 'gestionar_cuenta_propia',
};