# Flujo de Reportes

Cómo se generan y consultan reportes de inventario.

## Tipos de reportes

### 1. Stock por bodega

```
GET /reports/stock/:warehouseId
```

Muestra inventario actual de una bodega.

**Autorización**:
- ADMIN: ve cualquier bodega
- OPERATOR: ve solo su bodega asignada

**Respuesta**:
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

**Stock Status**:
- **CRÍTICO**: 0 a minStock
- **BAJO**: minStock a 50% rango
- **NORMAL**: 50% a maxStock
- **EXCESO**: > maxStock

### 2. Alertas de stock bajo

```
GET /reports/alerts
```

Todos los productos con stock bajo en el sistema.

**Autorización**: **Solo ADMIN** (información sensible)

**Respuesta**:
```json
{
  "data": {
    "alerts": [
      {
        "productId": "uuid",
        "sku": "PROD-001",
        "name": "Laptop Dell",
        "currentStock": 8,
        "minStock": 10,
        "warehouseId": "uuid",
        "warehouseName": "Bodega Centro"
      }
    ]
  }
}
```

### 3. Historial de movimientos

```
GET /reports/movements

Query params:
  ?warehouseId=uuid
  &productId=uuid
  &type=ENTRADA
  &dateFrom=2026-04-01T00:00:00Z
  &dateTo=2026-04-30T23:59:59Z
  &limit=50
  &offset=0
```

Historial filtrable de todas las entradas y salidas.

**Respuesta**:
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
        "productName": "Laptop Dell",
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
  }
}
```

## Cálculo de stock en reportes

No se almacena. Se **calcula dinámicamente**:

```typescript
async getStockForReport(warehouseId: string, productId: string) {
  // Suma todas las ENTRADAS
  const entradas = await this.prisma.stockMovement.aggregate({
    where: {
      warehouseId,
      productId,
      type: 'ENTRADA',
      deletedAt: null,
    },
    _sum: { quantity: true },
  });

  // Suma todas las SALIDAS
  const salidas = await this.prisma.stockMovement.aggregate({
    where: {
      warehouseId,
      productId,
      type: 'SALIDA',
      deletedAt: null,
    },
    _sum: { quantity: true },
  });

  const entrada_total = entradas._sum.quantity || 0;
  const salida_total = salidas._sum.quantity || 0;

  return entrada_total - salida_total;
}
```

**Ventaja**: Siempre es la fuente de verdad.

## Filtros en historial

### Por bodega
```
GET /reports/movements?warehouseId=<id>
```
Solo movimientos de esa bodega.

### Por producto
```
GET /reports/movements?productId=<id>
```
Solo movimientos de ese producto.

### Por tipo
```
GET /reports/movements?type=ENTRADA
```
Solo ENTRADAS o SALIDAS.

### Por rango de fechas
```
GET /reports/movements?dateFrom=2026-04-01T00:00:00Z&dateTo=2026-04-30T23:59:59Z
```
Movimientos en ese período (ISO 8601).

### Combinados
```
GET /reports/movements?warehouseId=<id>&type=SALIDA&dateFrom=2026-04-01T00:00:00Z&limit=100
```

## Paginación

Todos los reportes con muchos registros soportan paginación:

```
limit: 50   # Cuántos registros
offset: 0   # Desde dónde (0 = primero)
```

Ejemplo:
```
GET /reports/movements?limit=50&offset=0     # Primeros 50
GET /reports/movements?limit=50&offset=50    # Registros 50-99
GET /reports/movements?limit=50&offset=100   # Registros 100-149
```

## Casos de uso

### Admin: Ver alertas de stock bajo
```
GET /reports/alerts
```
Decide qué comprar.

### Admin: Ver historial de movimientos entre fechas
```
GET /reports/movements?dateFrom=2026-04-01T00:00:00Z&dateTo=2026-04-30T23:59:59Z
```
Auditoría de operaciones.

### Operator: Ver stock de su bodega
```
GET /reports/stock/:warehouseId
```
Sabe qué tiene para preparar ventas.

### Operator: Ver movimientos de un producto
```
GET /reports/movements?productId=<id>
```
Historial de ese artículo.

## Performance

- **Índices**: `StockMovement` indexado en (warehouseId, productId, type, createdAt)
- **Cálculo en memoria**: Agregaciones de SQL (SUM)
- **Paginación obligatoria**: Máximo 100 registros por request
- **Soft delete**: Automáticamente filtra `deletedAt IS NULL`

---

[← Flujos](../)
