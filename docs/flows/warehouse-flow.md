# Flujo de Bodegas

Cómo se crean y administran las bodegas.

## Conceptos

Una bodega es una ubicación física donde se guarda inventario. Cada bodega:
- Tiene un nombre único
- Ubicación geográfica
- Múltiples productos con stock independiente
- Un OPERATOR asignado (responsable)
- Soft delete (nunca se elimina completamente)

## Creación de bodega

**Solo ADMIN** puede crear bodegas.

```
POST /warehouses

Body:
{
  "name": "Bodega Centro",
  "location": "Santiago, Chile"
}

Header: Authorization: Bearer <token>
```

### Flujo

1. **Controller** valida DTO
   - Nombre no vacío
   - Nombre único (no existe otro con ese nombre)
   - Location presente

2. **Use Case (CreateWarehouseUseCase)**
   - Busca si nombre ya existe
   - Si existe → 422
   - Si no, crea Warehouse Entity:
     ```typescript
     {
       id: "uuid",
       name: "Bodega Centro",
       location: "Santiago, Chile",
       createdAt: now,
       deletedAt: null
     }
     ```

3. **Persiste** en BD

4. **Respuesta** 201

```json
{
  "data": {
    "id": "uuid",
    "name": "Bodega Centro",
    "location": "Santiago, Chile",
    "createdAt": "2026-04-14T10:49:46.345Z"
  },
  "message": "Bodega creada",
  "statusCode": 201
}
```

## Asignar OPERATOR

**Admin** asigna un usuario OPERATOR a una bodega.

```
PUT /warehouses/:warehouseId/operator

Body:
{
  "userId": "uuid-del-operator"
}
```

### Flujo

1. Busca bodega: ¿Existe?
2. Busca usuario: ¿Existe? ¿Es OPERATOR?
3. Actualiza: `warehouse.operatorId = userId`
4. Respuesta 200

Ahora ese OPERATOR:
- Ve solo esa bodega
- Registra movimientos solo en esa bodega
- Su JWT contiene `warehouseId`

## Ver bodegas

**ADMIN**: Ve todas
```
GET /warehouses
```

**OPERATOR**: Ve solo la suya (implícita en su bodega asignada)

Respuesta:
```json
{
  "data": [
    {
      "id": "uuid1",
      "name": "Bodega Centro",
      "location": "Santiago",
      "operator": {
        "id": "uuid",
        "email": "operator@test.com",
        "name": "Juan"
      }
    },
    {
      "id": "uuid2",
      "name": "Bodega Sur",
      "location": "Puerto Montt"
    }
  ],
  "statusCode": 200
}
```

## Soft delete (desactivar)

Para "eliminar" una bodega, se marca como eliminada sin borrar datos:

```
DELETE /warehouses/:warehouseId

Header: Authorization: Bearer <admin-token>
```

### Qué pasa

1. Busca bodega
2. Actualiza: `warehouse.deletedAt = NOW()`
3. Histórico queda intacto
4. No aparece en listados futuros

Queries automáticamente filtran `deletedAt IS NULL`.

## Stock de bodega

Ver todo el stock de una bodega:

```
GET /reports/stock/:warehouseId

Header: Authorization: Bearer <token>
```

### Respuesta

```json
{
  "data": {
    "warehouseId": "uuid",
    "warehouse": {
      "id": "uuid",
      "name": "Bodega Centro",
      "location": "Santiago"
    },
    "products": [
      {
        "productId": "uuid",
        "sku": "PROD-001",
        "name": "Laptop Dell",
        "quantity": 45,
        "minStock": 10,
        "maxStock": 100,
        "status": "NORMAL"
      }
    ]
  }
}
```

## Validaciones

- **Nombre único**: No podés tener dos bodegas con el mismo nombre
- **OPERATOR único**: (Opcional) Un OPERATOR puede estar en múltiples bodegas o en una sola según regla
- **Soft delete**: Bodegas eliminadas no aparecen en operaciones normales

---

[← Flujos](../)
