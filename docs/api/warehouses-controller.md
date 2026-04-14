# Warehouses Controller

**Base Path:** `/warehouses`

**Autorización requerida:** Sí (todos los endpoints)

Controlador para administración de bodegas. Solo ADMIN puede crear, actualizar o eliminar.

## Endpoints

### GET /warehouses

Lista todas las bodegas con paginación.

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
      "name": "Bodega Centro",
      "location": "Santiago",
      "capacity": 1000,
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

---

### GET /warehouses/:id

Obtiene una bodega por ID.

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID de la bodega

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Bodega Centro",
  "location": "Santiago",
  "capacity": 1000,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (404):**
```json
{
  "data": null,
  "message": "Bodega no encontrada",
  "statusCode": 404
}
```

---

### POST /warehouses

Crea una nueva bodega.

**Autorización:** ADMIN

**Request:**
```json
{
  "name": "Bodega Sur",
  "location": "Concepción",
  "capacity": 500
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Bodega Sur",
  "location": "Concepción",
  "capacity": 500,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Validaciones:**
- Name es obligatorio
- Location es obligatorio
- Capacity es obligatorio y debe ser positivo

---

### PATCH /warehouses/:id

Actualiza una bodega.

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID de la bodega

**Request:**
```json
{
  "name": "Bodega Sur Actualizada",
  "location": "Puerto Montt",
  "capacity": 700
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Bodega Sur Actualizada",
  "location": "Puerto Montt",
  "capacity": 700,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (404):**
```json
{
  "data": null,
  "message": "Bodega no encontrada",
  "statusCode": 404
}
```

---

### DELETE /warehouses/:id

Desactiva una bodega (soft delete).

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID de la bodega

**Response (204):**
```
(Sin contenido)
```

**Response (404):**
```json
{
  "data": null,
  "message": "Bodega no encontrada",
  "statusCode": 404
}
```

**Nota:** La bodega se marca como inactiva pero los datos se preservan.

---

## Use Cases

### CreateWarehouseUseCase
Crea una bodega:
1. Valida datos de entrada
2. Crea bodega en BD
3. Retorna bodega creada

### ListWarehousesUseCase
Lista bodegas:
1. Obtiene bodegas activas
2. Aplica paginación
3. Retorna total de páginas

### GetWarehouseByIdUseCase
Obtiene una bodega:
1. Busca por ID
2. Si no existe, excepción 404
3. Retorna bodega

### UpdateWarehouseUseCase
Actualiza una bodega:
1. Valida datos
2. Actualiza BD
3. Retorna bodega actualizada

### DeleteWarehouseUseCase
Desactiva una bodega:
1. Marca como deletedAt = NOW()
2. Datos se preservan

---

## Relaciones

Una bodega puede tener:
- Múltiples productos (con stock independiente)
- Un OPERATOR asignado (opcional)
- Múltiples movimientos de stock

---

[← Volvé a API](overview.md)
