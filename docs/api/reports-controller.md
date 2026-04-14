# Reports Controller

**Base Path:** `/reports`

**Autorización requerida:** Sí (todos los endpoints)

Controlador para generación de reportes de inventario. Endpoints read-only.

## Endpoints

### GET /reports/stock/:warehouseId

Obtiene el stock actual de una bodega.

**Autorización:** ADMIN (cualquier bodega), OPERATOR (su bodega)

**Parameters:**
- `warehouseId` (requerido): UUID de la bodega

**Response (200):**
```json
{
  "warehouseId": "uuid",
  "warehouse": {
    "id": "uuid",
    "name": "Bodega Centro",
    "location": "Santiago",
    "capacity": 1000
  },
  "products": [
    {
      "productId": "uuid",
      "sku": "PROD-001",
      "name": "Laptop Dell 15",
      "quantity": 45,
      "minStockAlert": 10,
      "status": "NORMAL"
    }
  ]
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

**Stock Status:**
- **CRÍTICO:** 0 a minStockAlert
- **BAJO:** minStockAlert a 50% de capacidad
- **NORMAL:** 50% a capacidad
- **EXCESO:** Mayor que capacidad

---

### GET /reports/alerts

Obtiene alertas de stock bajo en todo el sistema.

**Autorización:** ADMIN (solo ADMIN puede ver información sensible)

**Response (200):**
```json
{
  "alerts": [
    {
      "productId": "uuid",
      "sku": "PROD-001",
      "name": "Laptop Dell 15",
      "currentStock": 8,
      "minStockAlert": 10,
      "warehouseId": "uuid",
      "warehouseName": "Bodega Centro",
      "severity": "CRÍTICO"
    }
  ]
}
```

**Severity:**
- **CRÍTICO:** Stock = 0
- **BAJO:** Stock < minStockAlert
- **ADVERTENCIA:** Stock < 50% capacity

---

### GET /reports/movements

Obtiene historial de movimientos con filtros.

**Autorización:** ADMIN

**Query Parameters:**
- `productId` (opcional): UUID del producto
- `warehouseId` (opcional): UUID de la bodega
- `type` (opcional): "ENTRADA" o "SALIDA"
- `startDate` (opcional): ISO 8601 date
- `endDate` (opcional): ISO 8601 date
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de registros (default: 10)

**Example:**
```
GET /reports/movements?warehouseId=uuid&type=ENTRADA&startDate=2026-04-01T00:00:00Z
```

**Response (200):**
```json
{
  "movements": [
    {
      "id": "uuid",
      "warehouseId": "uuid",
      "warehouseName": "Bodega Centro",
      "productId": "uuid",
      "sku": "PROD-001",
      "productName": "Laptop Dell 15",
      "quantity": 50,
      "type": "ENTRADA",
      "userId": "uuid",
      "userName": "Juan",
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 500,
  "totalPages": 50
}
```

---

## Use Cases

### GetStockReportUseCase
Genera reporte de stock:
1. Busca bodega
2. Si no existe, excepción 404
3. Obtiene todos los productos de la bodega
4. Para cada producto:
   - Calcula stock dinámico (ENTRADA - SALIDA)
   - Determina status basado en minStockAlert
5. Retorna reporte

### GetAlertsReportUseCase
Genera reporte de alertas:
1. Itera todas las bodegas (ADMIN only)
2. Para cada bodega-producto:
   - Calcula stock
   - Si stock < minStockAlert, agrega a alertas
3. Ordena por severidad (CRÍTICO > BAJO > ADVERTENCIA)
4. Retorna alertas

### GetMovementHistoryReportUseCase
Genera reporte de historial:
1. Aplica filtros
2. Obtiene movimientos con joins a producto/bodega/usuario
3. Ordena por createdAt DESC
4. Pagina resultados
5. Retorna total de registros

---

## Cálculo de stock

**Stock se calcula dinámicamente**, nunca se almacena:

```sql
SELECT 
  COALESCE(SUM(CASE WHEN type='ENTRADA' THEN quantity ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN type='SALIDA' THEN quantity ELSE 0 END), 0)
FROM stock_movements
WHERE product_id = ? AND warehouse_id = ? AND deleted_at IS NULL
```

**Ventaja:** Siempre refleja la verdad de los datos.

---

## Permisos

### ADMIN
- Ve alertas de todo el sistema
- Ve reportes de todas las bodegas
- Ve historial completo de movimientos

### OPERATOR
- Solo ve stock de su bodega asignada
- No ve alertas
- No ve historial

---

## Performance

- **Índices:** StockMovement(warehouseId, productId, type)
- **Paginación:** Máximo 100 registros por request
- **Soft deletes:** Excluye automáticamente deletedAt IS NOT NULL
- **Caching:** (opcional) Cachear reportes si son lentos

---

## Casos de uso

### Admin: Decidir qué comprar
```
GET /reports/alerts
→ Ve qué productos tienen stock bajo
→ Toma decisión de reabastecimiento
```

### Operator: Confirmar stock
```
GET /reports/stock/:warehouseId
→ Ve su bodega
→ Confirma inventario disponible
```

### Admin: Auditoría de movimientos
```
GET /reports/movements?startDate=2026-04-01&endDate=2026-04-30
→ Historial de mes
→ Verifica inconsistencias
```

---

[← Volvé a API](overview.md)
