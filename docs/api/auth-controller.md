# Auth Controller

**Base Path:** `/auth`

Controlador responsable de la autenticación y generación de tokens JWT.

## Endpoints

### POST /auth/login

Autentica un usuario con email y contraseña. Retorna access token (15 min) y refresh token (7 días).

**Autorización:** No requiere

**Request:**
```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@test.com",
      "role": "ADMIN",
      "warehouseId": null
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "Entrada exitosa",
  "statusCode": 200
}
```

**Response (401):**
```json
{
  "data": null,
  "message": "Email o contraseña inválidos",
  "statusCode": 401
}
```

**Validaciones:**
- Email debe ser válido
- Password es obligatorio
- Email y password son case-sensitive

---

### POST /auth/refresh

Renueva el access token usando el refresh token.

**Autorización:** No requiere

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@test.com",
      "role": "ADMIN",
      "warehouseId": null
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "Token renovado",
  "statusCode": 200
}
```

**Response (401):**
```json
{
  "data": null,
  "message": "Refresh token inválido o expirado",
  "statusCode": 401
}
```

**Validaciones:**
- Refresh token debe ser válido
- Refresh token no debe estar expirado

---

## Use Cases

### LoginUseCase
Ejecuta la lógica de autenticación:
1. Busca usuario por email
2. Valida contraseña (bcrypt.compare)
3. Genera access token (15 min)
4. Genera refresh token (7 días)
5. Retorna usuario y tokens

### RefreshTokenUseCase
Renueva tokens:
1. Valida refresh token
2. Extrae payload
3. Genera nuevo access token
4. Retorna tokens renovados

---

## Seguridad

- Contraseñas se almacenan como hash bcrypt
- Access token dura 15 minutos
- Refresh token dura 7 días
- Tokens se firman con HS256
- JWT_SECRET debe tener mínimo 32 caracteres en producción

---

[← Volvé a API](overview.md)
