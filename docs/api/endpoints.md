# Endpoints

## POST /movements

Registrá una entrada (ENTRADA) o salida (SALIDA) de productos.

**Autorización**: OPERATOR o ADMIN

**Body**:
```json
{
  "warehouseId": "uuid",
  "productId": "uuid",
  "quantity": 50,
  "type": "ENTRADA"
}
```

- `type`: "ENTRADA" o "SALIDA"
- Para SALIDA: Validamos stock suficiente
- OPERATOR: Solo en su bodega asignada

**Respuesta** (201):
```json
{
  "data": {
    "id": "uuid",
    "warehouseId": "uuid",
    "productId": "uuid",
    "quantity": 50,
    "type": "ENTRADA",
    "userId": "uuid",
    "createdAt": "2026-04-14T10:49:46.345Z"
  },
  "message": "Movimiento registrado",
  "statusCode": 201
}
```

**Errores comunes**:
- `422`: Stock insuficiente (SALIDA)
- `404`: Producto o bodega no existe
- `403`: OPERATOR intentó en otra bodega

---

## GET /movements

Listá movimientos con filtros y paginación.

**Parámetros**:
- `warehouseId`: Filtrá por bodega
- `productId`: Filtrá por producto
- `type`: "ENTRADA" o "SALIDA"
- `dateFrom`: ISO 8601 (ej: `2026-04-14T10:49:46.345Z`)
- `dateTo`: ISO 8601
- `limit`: Cuántos (default 20, máximo 100)
- `offset`: Desde dónde (default 0)

**Ejemplo**:
```
GET /movements?warehouseId=<id>&type=ENTRADA&limit=50&offset=0
```

**Respuesta** (200):
```json
{
  "data": {
    "movements": [
      {
        "id": "uuid",
        "warehouseId": "uuid",
        "productId": "uuid",
        "quantity": 50,
        "type": "ENTRADA",
        "userId": "uuid",
        "createdAt": "2026-04-14T10:49:46.345Z"
      }
    ],
    "total": 150,
    "limit": 20,
    "offset": 0
  },
  "message": "Movimientos obtenidos",
  "statusCode": 200
}
```

---

## GET /reports/stock/:warehouseId

Qué hay en la bodega ahora. Stock en tiempo real.

**Autorización**: OPERATOR (su bodega) o ADMIN (cualquiera)

**Parámetro**:
- `warehouseId`: UUID de la bodega

**Respuesta** (200):
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
        "name": "Producto X",
        "quantity": 100,
        "minStock": 20,
        "maxStock": 500,
        "status": "NORMAL"
      }
    ]
  },
  "message": "Stock obtenido",
  "statusCode": 200
}
```

**Status**:
- **CRÍTICO**: 0 a minStock
- **BAJO**: minStock a 50% del rango
- **NORMAL**: 50% a maxStock
- **EXCESO**: Arriba de maxStock

---

## GET /reports/alerts

Productos con stock bajo en todo el sistema. **Solo ADMIN**.

**Autorización**: ADMIN

**Respuesta** (200):
```json
{
  "data": {
    "alerts": [
      {
        "productId": "uuid",
        "sku": "PROD-001",
        "name": "Producto X",
        "currentStock": 10,
        "minStock": 20,
        "warehouseId": "uuid",
        "warehouseName": "Bodega Centro"
      }
    ]
  },
  "message": "Alertas obtenidas",
  "statusCode": 200
}
```

**Nota**: Solo ADMIN porque es información sensible del negocio.

---

## GET /reports/movements

Historial de movimientos con filtros.

**Parámetros**:
- `warehouseId`, `productId`, `type`: Filtrá
- `dateFrom`, `dateTo`: Rango de fechas
- `limit`, `offset`: Paginación

**Respuesta** (200):
```json
{
  "data": {
    "movements": [
      {
        "id": "uuid",
        "warehouseId": "uuid",
        "warehouseName": "Bodega Centro",
        "productId": "uuid",
        "sku": "PROD-001",
        "productName": "Producto X",
        "quantity": 50,
        "type": "ENTRADA",
        "userId": "uuid",
        "userName": "Juan",
        "createdAt": "2026-04-14T10:49:46.345Z"
      }
    ],
    "total": 500,
    "limit": 50,
    "offset": 0
  },
  "message": "Historial obtenido",
  "statusCode": 200
}
```

---

## Importá a Postman

Importá `docs/api/inventory-api.postman_collection.json` en Postman:

1. Abrí Postman
2. Click en Import
3. Seleccioná el archivo
4. Tenés todos los endpoints listos con ejemplos

---

[← API](overview.md) | [Errores →](errors.md)
