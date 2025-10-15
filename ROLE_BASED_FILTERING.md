# Implementación de Filtrado Basado en Roles - IncidenciasScreen

## Descripción
Se ha implementado un sistema de filtrado dinámico en el componente `IncidenciasScreen` que adapta la visualización de incidencias según el rol del usuario autenticado.

## Funcionalidades Implementadas

### 1. Carga de Datos del Usuario
- **Estado del usuario**: Se agregó `currentUser` para almacenar los datos del usuario actual
- **Carga automática**: Se obtienen los datos del usuario desde localStorage al cargar el componente
- **Manejo de errores**: Se incluye manejo de errores al parsear los datos del usuario

### 2. Filtrado Basado en Roles
- **Función `applyRoleBasedFilter`**: Aplica filtros específicos según el rol del usuario
- **Rol dependencia**: Solo muestra incidencias de tipo "bache"
- **Otros roles**: Muestran todas las incidencias disponibles

### 3. Interfaz Adaptativa
- **Filtros dinámicos**: El selector de tipos se adapta según el rol del usuario
- **Indicador visual**: Se muestra un badge informativo para usuarios con rol dependencia
- **Filtros combinados**: Se mantiene la funcionalidad de búsqueda y filtros adicionales

## Comportamiento por Rol

### Rol "dependencia"
- **Filtrado automático**: Solo se muestran incidencias de tipo "bache"
- **Selector limitado**: El filtro de tipos solo muestra la opción "Bache"
- **Indicador visual**: Se muestra "Vista de Dependencia: Solo incidencias de tipo Bache"
- **Búsqueda**: Funciona normalmente dentro de las incidencias filtradas

### Otros roles (admin, etc.)
- **Sin restricciones**: Se muestran todas las incidencias disponibles
- **Selector completo**: El filtro de tipos muestra todas las opciones
- **Sin indicador**: No se muestra ningún badge especial

## Estructura de Filtrado

```javascript
// Orden de aplicación de filtros:
1. applyRoleBasedFilter() - Filtra por rol del usuario
2. Filtros de búsqueda - Por ubicación o ID
3. Filtros de tipo - Según selección del usuario
4. Filtros de estado - Según selección del usuario
```

## Casos de Uso

### Usuario con rol "dependencia"
1. **Inicio de sesión**: Se carga el rol desde localStorage
2. **Carga de incidencias**: Se obtienen todas las incidencias de la API
3. **Filtrado automático**: Se aplica filtro para mostrar solo "bache"
4. **Interfaz adaptada**: Se muestra indicador y filtros limitados
5. **Búsqueda**: Funciona dentro del conjunto filtrado

### Usuario con rol "admin"
1. **Inicio de sesión**: Se carga el rol desde localStorage
2. **Carga de incidencias**: Se obtienen todas las incidencias de la API
3. **Sin filtrado**: Se muestran todas las incidencias
4. **Interfaz completa**: Se muestran todos los filtros disponibles
5. **Búsqueda**: Funciona en todo el conjunto de datos

## Consideraciones Técnicas

### Rendimiento
- El filtrado se aplica en el cliente después de cargar los datos
- Se mantiene la funcionalidad de búsqueda y filtros adicionales
- No se realizan llamadas adicionales a la API

### Escalabilidad
- Fácil agregar nuevos roles y sus respectivos filtros
- La lógica está centralizada en `applyRoleBasedFilter`
- Se puede extender para incluir filtros por dependencia específica

### Mantenibilidad
- Código modular y bien documentado
- Separación clara entre lógica de filtrado y presentación
- Fácil modificación de reglas de negocio

## Próximos Pasos
- Integrar con la base de datos para obtener roles reales
- Implementar filtrado por dependencia específica (ID de dependencia)
- Agregar más tipos de filtros según necesidades del negocio
- Implementar permisos de edición basados en roles
