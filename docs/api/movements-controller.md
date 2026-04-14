# Movements Controller

**Base Path:** `/movements`

**Autorización requerida:** Sí (todos los endpoints)

Controlador para registrar movimientos de inventario (entradas y salidas de stock).

## Endpoints

### POST /movements

Registra un nuevo movimiento de stock (ENTRADA o SALIDA).

**Autorización:** ADMIN, OPERATOR

**Request:**
```json
{
  "productId": "uuid",
  "warehouseId": "uuid",
  "type": "ENTRADA",
  "quantity": 50,
  "notes": "Compra al proveedor X"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "warehouseId": "uuid",
  "type": "ENTRADA",
  "quantity": 50,
  "notes": "Compra al proveedor X",
  "userId": "uuid",
  "createdAt": "2026-04-14T10:00:00Z"
}
```

**Response (422) - Stock insuficiente para SALIDA:**
```json
{
  "data": null,
  "message": "Insufficient stock: need 100, have 50",
  "statusCode": 422
}
```

**Response (404) - Bodega o producto no existe:**
```json
{
  "data": null,
  "message": "Warehouse not found",
  "statusCode": 404
}
```

**Validaciones:**
- productId es obligatorio (UUID válido)
- warehouseId es obligatorio (UUID válido)
- type es obligatorio: "ENTRADA" o "SALIDA"
- quantity es obligatorio y debe ser positivo
- Para SALIDA: debe haber stock suficiente
- OPERATOR solo puede registrar en su bodega asignada

---

### GET /movements

Lista movimientos con filtros opcionales.

**Autorización:** ADMIN

**Query Parameters:**
- `productId` (opcional): UUID del producto
- `warehouseId` (opcional): UUID de la bodega
- `type` (opcional): "ENTRADA" o "SALIDA"
- `startDate` (opcional): ISO 8601 date (ej: 2026-04-01T00:00:00Z)
- `endDate` (opcional): ISO 8601 date
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Cantidad de registros (default: 10)

**Example:**
```
GET /movements?warehouseId=uuid&type=ENTRADA&startDate=2026-04-01T00:00:00Z&limit=50
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "warehouseId": "uuid",
      "type": "ENTRADA",
      "quantity": 50,
      "notes": "Compra al proveedor X",
      "userId": "uuid",
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 150,
  "totalPages": 3
}
```

---

## Use Cases

### RegisterMovementUseCase
Registra un movimiento:
1. Valida datos de entrada
2. Busca bodega y producto
3. Si SALIDA:
   - Calcula stock actual: (ENTRADAS) - (SALIDAS)
   - Valida stock >= quantity
   - Si no hay stock, excepción 422
4. Crea movimiento en BD (transacción)
5. Retorna movimiento creado

**Nota:** El stock se calcula dinámicamente. No se almacena.

### ListMovementsUseCase
Lista movimientos:
1. Aplica filtros (product, warehouse, type, rango fechas)
2. Ordena por createdAt DESC
3. Pagina resultados
4. Retorna total y página actual

---

## Tipos de movimiento

### ENTRADA
Agrega stock:
- Compra a proveedor
- Devolución de cliente
- Transferencia entre bodegas (SALIDA en origen, ENTRADA en destino)
- Ajuste por error

**Características:**
- No requiere validación de stock
- Siempre se permite

### SALIDA
Resta stock:
- Venta a cliente
- Transferencia a otra bodega
- Descarte/rotura
- Dañado/devuelto

**Características:**
- Requiere validación de stock
- No permitida si stock insuficiente (error 422)

---

## Cálculo de stock

Stock **no se almacena**. Se calcula cuando se necesita:

```
Stock(producto, bodega) = 
  SUM(quantity donde type='ENTRADA') - SUM(quantity donde type='SALIDA')
```

**Ventaja:** Es la fuente de verdad. Si hay inconsistencias en datos, el stock las refleja.

---

## Permisos

### ADMIN
- Puede registrar movimientos en cualquier bodega
- Puede listar todos los movimientos
- Ve historial completo

### OPERATOR
- Solo puede registrar en su bodega asignada
- No puede listar movimientos (endpoint solo ADMIN)
- Usa API para confirmar stock después de registrar

---

## Transacciones

Registrar movimiento es atómico:
- Si validación falla: no se crea nada
- Si creación falla: transacción se revierte
- Si algo sale mal: estado BD permanece consistente

---

[← Volvé a API](overview.md)
