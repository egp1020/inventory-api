# Products Controller

**Base Path:** `/products`

**Autorización requerida:** Sí (todos los endpoints)

Controlador para administración de productos. Solo ADMIN puede crear, actualizar o eliminar.

## Endpoints

### GET /products

Lista todos los productos con paginación.

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
      "sku": "PROD-001",
      "name": "Laptop Dell 15",
      "unit": "pc",
      "description": "Laptop Dell 15 pulgadas",
      "minStockAlert": 5,
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

### GET /products/:id

Obtiene un producto por ID.

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID del producto

**Response (200):**
```json
{
  "id": "uuid",
  "sku": "PROD-001",
  "name": "Laptop Dell 15",
  "unit": "pc",
  "description": "Laptop Dell 15 pulgadas",
  "minStockAlert": 5,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (404):**
```json
{
  "data": null,
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

---

### POST /products

Crea un nuevo producto.

**Autorización:** ADMIN

**Request:**
```json
{
  "sku": "MOUSE-LOGIT-001",
  "name": "Mouse Logitech",
  "unit": "pc",
  "description": "Mouse inalámbrico",
  "minStockAlert": 10
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "sku": "MOUSE-LOGIT-001",
  "name": "Mouse Logitech",
  "unit": "pc",
  "description": "Mouse inalámbrico",
  "minStockAlert": 10,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Validaciones:**
- SKU es obligatorio y único
- Name es obligatorio
- Unit es obligatorio
- MinStockAlert es obligatorio y debe ser >= 0

---

### PATCH /products/:id

Actualiza un producto.

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID del producto

**Request:**
```json
{
  "name": "Mouse Logitech M705",
  "description": "Mouse inalámbrico mejorado",
  "unit": "pc",
  "minStockAlert": 15
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "sku": "MOUSE-LOGIT-001",
  "name": "Mouse Logitech M705",
  "unit": "pc",
  "description": "Mouse inalámbrico mejorado",
  "minStockAlert": 15,
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (404):**
```json
{
  "data": null,
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

**Nota:** SKU no puede modificarse (es inmutable).

---

### DELETE /products/:id

Desactiva un producto (soft delete).

**Autorización:** ADMIN

**Parameters:**
- `id` (requerido): UUID del producto

**Response (204):**
```
(Sin contenido)
```

**Response (404):**
```json
{
  "data": null,
  "message": "Producto no encontrado",
  "statusCode": 404
}
```

**Nota:** El producto se marca como inactivo pero el historial de movimientos se preserva.

---

## Use Cases

### CreateProductUseCase
Crea un producto:
1. Valida que SKU sea único
2. Crea producto en BD
3. Retorna producto creado

### ListProductsUseCase
Lista productos:
1. Obtiene productos activos
2. Aplica paginación
3. Retorna total de páginas

### GetProductByIdUseCase
Obtiene un producto:
1. Busca por ID
2. Si no existe, excepción 404
3. Retorna producto

### UpdateProductUseCase
Actualiza un producto:
1. Valida cambios (excepto SKU)
2. Actualiza BD
3. Retorna producto actualizado

### DeleteProductUseCase
Desactiva un producto:
1. Marca como deletedAt = NOW()
2. Datos se preservan

---

## Stock

El stock de un producto **no se almacena**.

Se calcula dinámicamente por bodega:
```
Stock = (Total ENTRADAS) - (Total SALIDAS) para esa bodega y producto
```

Un producto puede tener:
- Stock diferente en cada bodega
- Alertas configuradas por bodega
- Historial de movimientos en cada ubicación

---

[← Volvé a API](overview.md)
