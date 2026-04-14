# Flujo de Autenticación

Cómo funciona login y manejo de tokens.

## Diagrama

```
Usuario
  │
  ├─→ POST /auth/login
  │   Body: { email, password }
  │
  ├─ Controller → Use Case
  │  ├─ Busca usuario por email
  │  ├─ Compara contraseña (bcrypt)
  │  └─ Si no coincide → 401
  │
  ├─ Genera tokens
  │  ├─ Access Token (15 minutos)
  │  └─ Refresh Token (7 días)
  │
  └─→ Respuesta 200 + Tokens

Usuario autenticado
  │
  ├─→ Cualquier request
  │   Header: Authorization: Bearer <accessToken>
  │
  ├─ JwtAuthGuard valida token
  │  ├─ Verifica firma (secret)
  │  ├─ Verifica expiración
  │  └─ Extrae payload (sub, email, role)
  │
  ├─ Si válido: Request procede
  │ Si expirado: 401
  │ Si inválido: 401

Token expirado
  │
  ├─→ POST /auth/refresh
  │   Body: { refreshToken }
  │
  ├─ Verifica refresh token
  │  ├─ Válido? Generar nuevo access token
  │  └─ Expirado? 401
  │
  └─→ Respuesta con nuevo access token
```

## Paso 1: Login

```
POST /auth/login

Body:
{
  "email": "operator@test.com",
  "password": "password123"
}
```

### Qué pasa

1. **Controller** recibe y valida DTO
   - Email válido (formato)
   - Password presente
   - Si no → 400

2. **Use Case (LoginUseCase)**
   - Busca usuario por email en BD
   - Si no existe → 401
   - Compara password con hash (bcrypt.compare)
     - `password123` → hash en BD → coincide? Sí ✓
   - Si no coincide → 401

3. **Genera tokens**
   ```typescript
   const payload = {
     sub: user.id,
     email: user.email,
     role: user.role,
     iat: now,
     exp: now + 15*60*1000 // 15 minutos
   };
   
   const accessToken = jwt.sign(payload, JWT_SECRET);
   const refreshToken = jwt.sign(payload, REFRESH_SECRET);
   ```

4. **Respuesta**
   ```json
   {
     "data": {
       "user": {
         "id": "uuid",
         "email": "operator@test.com",
         "role": "OPERATOR",
         "warehouseId": "warehouse-123"
       },
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc..."
     },
     "message": "Entrada exitosa",
     "statusCode": 200
   }
   ```

## Paso 2: Usar el token

Cada request a endpoints protegidos:

```
GET /movements
Header: Authorization: Bearer eyJhbGc...
```

### Qué pasa

1. **JwtAuthGuard** intercepta request
   - Lee header `Authorization`
   - Extrae token: "Bearer {token}"
   - Si no existe → 401

2. **Valida JWT**
   ```typescript
   const payload = jwt.verify(token, JWT_SECRET);
   // Verifica:
   // - Firma válida (no modificado)
   // - No expirado (exp > now)
   // - Estructura correcta
   ```

3. **Si válido**
   - Extrae usuario: `payload.sub`, `payload.role`
   - Agrega a `request.user`
   - Request procede

4. **Si inválido o expirado**
   ```json
   {
     "data": null,
     "message": "Unauthorized",
     "statusCode": 401
   }
   ```

## Paso 3: Renovar token

Cuando access token expira (después de 15 minutos):

```
POST /auth/refresh

Body:
{
  "refreshToken": "eyJhbGc..."
}
```

### Qué pasa

1. **Use Case (RefreshTokenUseCase)**
   - Valida refresh token
     - Firma válida? 
     - No expirado?
   - Si no → 401

2. **Genera nuevo access token**
   ```typescript
   const payload = jwt.verify(
     refreshToken,
     REFRESH_SECRET
   );
   
   const newAccessToken = jwt.sign(
     {
       ...payload,
       iat: now,
       exp: now + 15*60*1000
     },
     JWT_SECRET
   );
   ```

3. **Respuesta**
   ```json
   {
     "data": {
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc..." // Opcionalmente renovado
     },
     "message": "Token renovado",
     "statusCode": 200
   }
   ```

4. **Cliente actualiza** access token y sigue usando la API

## Estructura del token (JWT)

Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Payload:
```json
{
  "sub": "uuid-del-usuario",
  "email": "operator@test.com",
  "role": "OPERATOR",
  "iat": 1713085786,
  "exp": 1713086686
}
```

Signature:
```
HMACSHA256(
  base64(header) + "." + base64(payload),
  "jwt-secret-key"
)
```

## Flujo completo en timeline

```
T0:00  → POST /auth/login
        ← access token (exp: T0:15) + refresh token (exp: T7:00)

T0:05  → GET /movements (header: access token)
        ← 200 Movimientos (token válido)

T0:15  → GET /movements (header: access token)
        ← 401 (token expirado)

T0:15  → POST /auth/refresh (body: refresh token)
        ← nuevo access token (exp: T0:30)

T0:20  → GET /movements (header: nuevo access token)
        ← 200 Movimientos (token válido)

T7:05  → POST /auth/refresh (body: refresh token antiguo)
        ← 401 (refresh token expirado, volvé a login)

T7:05  → POST /auth/login
        ← nuevos tokens
```

## Security

- **Secrets**: `JWT_SECRET` y `REFRESH_SECRET` deben ser >= 32 caracteres
- **HTTPS**: En producción, siempre HTTPS para proteger tokens
- **HttpOnly**: Idealmente tokens guardados en cookies HttpOnly
- **No loguees tokens**: Nunca escribas tokens completos en logs
- **Refresh token más débil**: Más larga duración para conveniencia

---

[← Flujos](../) | [Stock Movement →](stock-movement-flow.md)
