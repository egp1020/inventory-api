# API - Documentación Completa

Referencia de todos los endpoints, autenticación, formatos de respuesta, y códigos de error.

## Indice

- **[API Overview](overview.md)** - Base URL, autenticación, formatos, códigos HTTP
- **[Autenticación](authentication.md)** - JWT, login, refresh token, roles y matriz de permisos
- **[Errores](errors.md)** - Códigos de error, causas, soluciones

## Controladores (Endpoints Detallados)

### 🔐 Auth Controller
Autenticación y manejo de tokens.

- **[Auth Controller](auth-controller.md)** - POST /auth/login, POST /auth/refresh

### 👥 Users Controller
Gestión de usuarios (ADMIN only).

- **[Users Controller](users-controller.md)** - GET /users, POST /users, PATCH /users/:id, DELETE /users/:id

### 📦 Warehouses Controller
Gestión de bodegas/depósitos (ADMIN only).

- **[Warehouses Controller](warehouses-controller.md)** - GET /warehouses, POST /warehouses, PATCH /warehouses/:id, DELETE /warehouses/:id

### 📝 Products Controller
Gestión de productos.

- **[Products Controller](products-controller.md)** - GET /products, POST /products, PATCH /products/:id, DELETE /products/:id

### 📊 Movements Controller
Registrar entrada/salida de stock.

- **[Movements Controller](movements-controller.md)** - POST /movements (registrar), GET /movements (ADMIN)

### 📈 Reports Controller
Reportes y análisis.

- **[Reports Controller](reports-controller.md)** - GET /reports/stock/:id, GET /reports/alerts, GET /reports/movements

## Cómo Navegar

**Si quieres...**

- ✅ Saber los endpoints disponibles → [Overview](overview.md)
- ✅ Entender autenticación → [Autenticación](authentication.md)
- ✅ Ver matriz de permisos → [Autenticación - Matriz](authentication.md#matriz-de-permisos-por-endpoint)
- ✅ Usar un endpoint específico → [Busca por controlador arriba](#controladores-endpoints-detallados)
- ✅ Entender un error → [Errores](errors.md)

## Características

- ✅ **JWT Stateless** - No necesita sesiones
- ✅ **2 Roles** - ADMIN (acceso total) y OPERATOR (acceso a bodega)
- ✅ **Soft Deletes** - Los datos nunca se pierden
- ✅ **Validación** - class-validator en cada DTO
- ✅ **Documentación Swagger** - Todos los endpoints en `/api/docs`

## Test con Curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Obtener token y guardarlo
export TOKEN="eyJ..."

# Usar en request
curl -X GET http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer $TOKEN"
```

## Test con Postman

1. Importá la colección: [Inventory API Postman](../../Inventory%20API.postman_collection.json)
2. Ve a la carpeta `Auth`
3. Ejecutá `Login` → se guarda automáticamente el token
4. Luego ejecutá otros endpoints

## Respuesta Estándar

Todas las respuestas siguen este formato:

```json
{
  "data": null | {} | [],
  "message": "Descripción amigable",
  "statusCode": 200
}
```

Ejemplo exitoso:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@test.com",
    "role": "ADMIN"
  },
  "message": "Entrada exitosa",
  "statusCode": 200
}
```

Ejemplo con error:
```json
{
  "data": null,
  "message": "Warehouse not found",
  "statusCode": 404
}
```

## Tabla de Controladores

| Controlador | Endpoints | Requiere | Casos de uso |
|---|---|---|---|
| Auth | 2 | Público | Login, renovar token |
| Users | 5 | ADMIN | Crear usuarios, listar, actualizar |
| Warehouses | 5 | ADMIN | Crear bodegas, asignar a OPERATOR |
| Products | 5 | ADMIN (POST/PATCH/DELETE) | Catálogo de artículos |
| Movements | 2 | OPERATOR/ADMIN | Registrar entrada/salida |
| Reports | 3 | ADMIN/OPERATOR | Ver stock, alertas, historial |

---

[← Documentación](../README.md)
