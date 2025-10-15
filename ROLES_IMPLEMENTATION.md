# Implementación del Sistema de Roles

## Descripción
Se ha implementado un sistema de roles dinámico en la aplicación que permite mostrar información específica según el tipo de usuario que inicie sesión.

## Funcionalidades Implementadas

### 1. LoginScreen.js
- **Constantes de roles**: Se definieron los roles disponibles (admin, dependencia, ciudadano)
- **Excepción especial**: El usuario `admin@example.com` con contraseña `admin123` se asigna automáticamente al rol de "dependencia"
- **Determinación de rol**: Función que asigna roles basándose en las credenciales
- **Almacenamiento**: Los datos del usuario se guardan en localStorage incluyendo el rol

### 2. Header.js
- **Carga de datos**: Se obtienen los datos del usuario desde localStorage al cargar el componente
- **Texto dinámico**: Función que determina qué texto mostrar según el rol del usuario
- **Condición de visualización**: Solo se muestra "Administrador: Sistema" para roles "admin" o "dependencia"

## Comportamiento por Rol

### Rol "admin" o "dependencia"
- Se muestra: `<span className="admin-text">Administrador: Sistema</span>`

### Otros roles
- No se muestra ningún texto (se puede personalizar según necesidades)

## Casos de Uso

1. **Usuario admin@example.com / admin123**: Se asigna rol "dependencia" y se muestra el texto de administrador
2. **Usuarios de la base de datos**: Se asignan roles según la lógica definida (por defecto "ciudadano")
3. **Roles futuros**: El sistema está preparado para manejar roles adicionales desde la base de datos

## Estructura de Datos del Usuario
```javascript
{
  email: "usuario@example.com",
  nombre: "Nombre del Usuario",
  rol: "admin" | "dependencia" | "ciudadano",
  // ... otros campos de la base de datos
}
```

## Próximos Pasos
- Integrar con la base de datos para obtener roles reales
- Expandir la lógica de roles para otros componentes
- Implementar permisos específicos por rol
