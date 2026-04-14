# Flujo de Movimiento de Stock

Cómo funciona cuando registrás una entrada (ENTRADA) o salida (SALIDA).

## Flujo general

```
User (Operator/Admin)
  │
  ├─→ POST /movements
  │
  └─→ Payload: warehouseId, productId, quantity, type
      │
      ├─ Controller valida DTO
      │
      ├─ Use Case (CreateStockMovementUseCase)
      │  ├─ Busca Warehouse
      │  ├─ Busca Product
      │  ├─ Si type = SALIDA:
      │  │  ├─ Calcula stock actual
      │  │  ├─ Valida: quantity ≤ stock
      │  │  └─ Si no → Error 422
      │  └─ Si type = ENTRADA:
      │     └─ Sin validación (siempre cabe)
      │
      ├─ Crea StockMovement Entity
      │
      ├─ Persiste en BD (transacción)
      │
      └─ Retorna respuesta 201
         (No actualiza stock, se calcula dinámica)
```

## Caso 1: ENTRADA (Ingreso de stock)

**Contexto**: Llega mercadería del proveedor.

1. Operator registra:
   ```
   POST /movements
   {
     "warehouseId": "warehouse-123",
     "productId": "product-456",
     "quantity": 100,
     "type": "ENTRADA"
   }
   ```

2. Controller valida:
   - `quantity` es número positivo ✓
   - `type` es válido ✓
   - `warehouseId` y `productId` son UUIDs válidos ✓

3. Use Case:
   - Busca Warehouse: ¿Existe warehouse-123? Sí
   - Busca Product: ¿Existe product-456? Sí
   - ENTRADA: Sin validación extra
   - Crea `StockMovement`:
     ```typescript
     {
       id: "uuid",
       warehouseId: "warehouse-123",
       productId: "product-456",
       quantity: 100,
       type: "ENTRADA",
       userId: "user-logged-in",
       createdAt: now
     }
     ```

4. Persiste en Prisma:
   ```sql
   INSERT INTO stock_movements 
   (id, warehouseId, productId, quantity, type, userId, createdAt)
   VALUES (...)
   ```

5. Stock se actualiza automáticamente:
   - Anterior: 50
   - Nuevo: 50 + 100 = 150
   - (En tiempo de lectura, no de escritura)

6. Respuesta al cliente:
   ```json
   {
     "data": { /* el movimiento creado */ },
     "message": "Movimiento registrado",
     "statusCode": 201
   }
   ```

## Caso 2: SALIDA (Descuento de stock)

**Contexto**: Se vende o se transfiere producto.

1. Operator registra:
   ```
   POST /movements
   {
     "warehouseId": "warehouse-123",
     "productId": "product-456",
     "quantity": 30,
     "type": "SALIDA"
   }
   ```

2. Controller valida:
   - Todos los campos válidos ✓

3. Use Case:
   - Busca Warehouse: ¿Existe? Sí
   - Busca Product: ¿Existe? Sí
   - **SALIDA**: Valida stock
     - Calcula stock actual: 150 movimientos
     - ¿150 ≥ 30? Sí ✓
     - Procedé

4. Crea StockMovement:
   ```typescript
   {
     id: "uuid-salida",
     warehouseId: "warehouse-123",
     productId: "product-456",
     quantity: 30,
     type: "SALIDA",
     userId: "user-logged-in",
     createdAt: now
   }
   ```

5. Persiste:
   ```sql
   INSERT INTO stock_movements ... VALUES (...)
   ```

6. Stock se recalcula al leer:
   - Stock: (Total ENTRADA) - (Total SALIDA)
   - = 150 - 30 = 120

7. Respuesta 201 (éxito)

## Caso 3: SALIDA sin stock (Error)

**Contexto**: Intentás vender algo que no tenés.

1. Operator registra:
   ```
   POST /movements
   {
     "warehouseId": "warehouse-123",
     "productId": "product-456",
     "quantity": 200,  // Pero solo hay 120
     "type": "SALIDA"
   }
   ```

2. Use Case valida stock:
   - Stock actual: 120
   - ¿120 ≥ 200? NO ✗

3. Lanza `InsufficientStockException`

4. Filter (ExceptionFilter) captura:
   - Tipo: BusinessRuleException
   - HTTP Code: 422

5. Respuesta al cliente:
   ```json
   {
     "data": null,
     "message": "Insufficient stock: need 200, have 120",
     "statusCode": 422
   }
   ```

6. Movimiento **NO** se crea. Transacción se revierte.

## Cálculo dinámico de stock

Cada vez que consultás stock (en reportes):

```typescript
async getStockByProductAndWarehouse(
  warehouseId: string,
  productId: string,
): Promise<number> {
  const entradas = await this.prisma.stockMovement.aggregate({
    where: {
      warehouseId,
      productId,
      type: 'ENTRADA',
      deletedAt: null,
    },
    _sum: { quantity: true },
  });

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

**Ventaja**: Si hay error en datos, el stock refleja la verdad.

## Transacciones

Cuando creás un movimiento, todo se ejecuta en una transacción:

```typescript
await this.prisma.$transaction(async (tx) => {
  // 1. Valida
  const warehouse = await tx.warehouse.findUnique({ ... });
  const product = await tx.product.findUnique({ ... });
  
  // 2. Si SALIDA, valida stock
  if (type === 'SALIDA') {
    const stock = await calculateStock(tx, ...);
    if (stock < quantity) throw new Error();
  }
  
  // 3. Crea movimiento
  await tx.stockMovement.create({ ... });
});
```

Si algo falla (excepción), **TODA** la transacción se revierte.

## Performance

Para que sea rápido:

- **Índices**: `StockMovement` indexado en (warehouseId, productId, type)
- **Soft delete**: Siempre filtramos `deletedAt IS NULL`
- **Paginación**: GET /movements tiene límite de 100 registros

---

[← Flujos](../) | [Auth Flow →](auth-flow.md)
