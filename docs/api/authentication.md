# Autenticación

## Cómo funciona

El sistema usa JWT (JSON Web Tokens) para autenticación stateless.

1. Entrás con email y contraseña
2. Obtenes dos tokens:
   - **Access Token**: Durá 15 minutos, lo usás en cada request
   - **Refresh Token**: Durá 7 días, lo usás para obtener un nuevo access token
3. En cada request, mandás el access token en el header
4. Cuando expira, usás el refresh token para obtener uno nuevo

## Login

```
POST /auth/login
```

**Body**:
```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Respuesta** (200):
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@test.com",
      "role": "ADMIN",
      "warehouseId": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Entrada exitosa",
  "statusCode": 200
}
```

## Refresh Token

Cuando el access token expira (o antes):

```
POST /auth/refresh
```

**Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta** (200):
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token renovado",
  "statusCode": 200
}
```

## Usando el Access Token

En todos los requests (excepto login):

```bash
curl -X GET http://localhost:3000/api/movements \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Estructura del JWT

El token contiene (en el payload):

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@test.com",
  "role": "ADMIN",
  "iat": 1713085786,
  "exp": 1713086686
}
```

- **sub**: User ID
- **email**: Email del usuario
- **role**: Rol (ADMIN / OPERATOR)
- **iat**: Cuándo se creó
- **exp**: Cuándo expira

## Roles y Permisos

### ADMIN

- Acceso total
- Ve todas las bodegas
- Genera reportes de alertas
- Crea usuarios
- Registra movimientos en cualquier bodega
- Accede a todos los endpoints

### OPERATOR

- Acceso limitado
- Ve solo su bodega asignada
- No ve alertas (información sensible)
- Solo registra movimientos en su bodega
- No puede crear usuarios
- Acceso restringido a endpoints específicos

## Matriz de Permisos por Endpoint

| Endpoint | Método | ADMIN | OPERATOR | Notas |
|----------|--------|-------|----------|-------|
| **Auth** | | | | |
| /auth/login | POST | ✓ | ✓ | Público |
| /auth/refresh | POST | ✓ | ✓ | Público |
| **Users** | | | | |
| /users | GET | ✓ | ✗ | Solo ADMIN |
| /users/:id | GET | ✓ | ✗ | Solo ADMIN |
| /users | POST | ✓ | ✗ | Crear usuario |
| /users/:id | PATCH | ✓ | ✗ | Actualizar |
| /users/:id | DELETE | ✓ | ✗ | Soft delete |
| **Warehouses** | | | | |
| /warehouses | GET | ✓ | ✗ | Ver todas |
| /warehouses/:id | GET | ✓ | ✗ | Ver detalle |
| /warehouses | POST | ✓ | ✗ | Crear |
| /warehouses/:id | PATCH | ✓ | ✗ | Actualizar |
| /warehouses/:id | DELETE | ✓ | ✗ | Soft delete |
| **Products** | | | | |
| /products | GET | ✓ | ✓ | Ver todos |
| /products/:id | GET | ✓ | ✓ | Ver detalle |
| /products | POST | ✓ | ✗ | Crear |
| /products/:id | PATCH | ✓ | ✗ | Actualizar |
| /products/:id | DELETE | ✓ | ✗ | Soft delete |
| **Movements** | | | | |
| /movements | GET | ✓ | ✗ | Historial (ADMIN solo) |
| /movements | POST | ✓ | ✓* | Registrar entrada/salida |
| **Reports** | | | | |
| /reports/stock/:id | GET | ✓ | ✓* | Stock por bodega |
| /reports/alerts | GET | ✓ | ✗ | Solo ADMIN |
| /reports/movements | GET | ✓ | ✓ | Historial de movimientos |

*OPERATOR solo accede a su bodega asignada. Si intenta otra bodega, recibe 403 Forbidden.

## Errores de autenticación

### 401 Unauthorized

Token faltá o expiró:

```json
{
  "data": null,
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Solución**: Obtené un nuevo token con `/auth/refresh`.

### 403 Forbidden

Tenés token válido pero no el rol necesario:

```json
{
  "data": null,
  "message": "Forbidden - insufficient permissions",
  "statusCode": 403
}
```

**Solución**: Usá una cuenta con el rol correcto (ADMIN vs OPERATOR).

## Buenas prácticas

1. **Guardá el token en memoria** (no en localStorage en web si es posible)
2. **Renová antes que expire**: No esperes a que expire
3. **Mandá en Authorization header**: No en body ni query params
4. **HTTPS en producción**: Los tokens viajan en texto
5. **No expongas los tokens**: No los loguees, no los mandes a otras APIs

---

[← API](overview.md) | [Endpoints →](endpoints.md)
