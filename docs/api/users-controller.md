# Users Controller

**Base Path:** `/users`

**Autorización requerida:** Sí (todos los endpoints)
**Roles permitidos:** Solo ADMIN

Controlador para administración de usuarios. Permite crear, leer, actualizar y eliminar usuarios.

## Endpoints

### GET /users

Lista todos los usuarios activos con paginación.

**Autorización:** ADMIN

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de registros (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "operator@test.com",
      "role": "OPERATOR",
      "warehouseId": "warehouse-uuid",
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### GET /users/:id

Obtiene un usuario específico por ID.

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID del usuario

**Response (200):**
```json
{
  "id": "uuid",
  "email": "operator@test.com",
  "role": "OPERATOR",
  "warehouseId": "warehouse-uuid",
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (404):**
```json
{
  "data": null,
  "message": "Usuario no encontrado",
  "statusCode": 404
}
```

---

### POST /users

Crea un nuevo usuario.

**Autorización:** ADMIN

**Request:**
```json
{
  "email": "newuser@test.com",
  "password": "securePassword123",
  "role": "OPERATOR",
  "warehouseId": "warehouse-uuid"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "newuser@test.com",
  "role": "OPERATOR",
  "warehouseId": "warehouse-uuid",
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (409):**
```json
{
  "data": null,
  "message": "Email ya existe",
  "statusCode": 409
}
```

**Validaciones:**
- Email debe ser único
- Email debe ser válido
- Password es obligatorio
- Role debe ser ADMIN o OPERATOR
- Si role es OPERATOR, warehouseId es obligatorio

---

### PATCH /users/:id

Actualiza un usuario existente.

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID del usuario

**Request:**
```json
{
  "email": "updated@test.com",
  "role": "ADMIN",
  "warehouseId": null
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "updated@test.com",
  "role": "ADMIN",
  "warehouseId": null,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (404):**
```json
{
  "data": null,
  "message": "Usuario no encontrado",
  "statusCode": 404
}
```

**Validaciones:**
- Email debe ser único (si se cambia)
- Email debe ser válido
- Role debe ser ADMIN o OPERATOR
- Si role es OPERATOR, warehouseId es obligatorio

---

### DELETE /users/:id

Desactiva un usuario (soft delete).

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID del usuario

**Response (204):**
```
(Sin contenido)
```

**Response (404):**
```json
{
  "data": null,
  "message": "Usuario no encontrado",
  "statusCode": 404
}
```

**Nota:** El usuario se marca como inactivo pero los datos se preservan en la base de datos.

---

## Use Cases

### CreateUserUseCase
Crea un nuevo usuario:
1. Valida que el email sea único
2. Hashea la contraseña con bcrypt
3. Crea el registro en base de datos
4. Si es OPERATOR, asigna bodega

### ListUsersUseCase
Lista usuarios con paginación:
1. Obtiene usuarios activos (deletedAt IS NULL)
2. Pagina resultados
3. Retorna total y página actual

### GetUserByIdUseCase
Obtiene un usuario por ID:
1. Busca usuario
2. Si no existe, lanza excepción 404
3. Retorna usuario

### UpdateUserUseCase
Actualiza un usuario:
1. Valida cambios
2. Si email cambia, valida que sea único
3. Actualiza registro
4. Retorna usuario actualizado

### DeleteUserUseCase
Desactiva un usuario:
1. Busca usuario
2. Marca como deletedAt = NOW()
3. Queries futuras lo excluirán

---

## Roles y permisos

### ADMIN
- Crea usuarios
- Ve todos los usuarios
- Puede cambiar rol de usuarios
- Acceso total

### OPERATOR
- No puede usar este controlador
- Solo ven información en endpoints específicos

---

[← Volvé a API](overview.md)
