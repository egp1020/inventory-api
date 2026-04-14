# Flujo del Ciclo de Vida de Productos

Cómo se crean y administran los productos en el sistema.

## Conceptos

Un producto es un artículo que se puede guardar en bodegas. Tiene:
- **SKU**: Código único e inmutable (ej: "LAPTOP-DELL-15")
- **Nombre**: Descripción
- **Precio**: Costo unitario
- **Stock min/max**: Límites por bodega
- Inventario independiente en cada bodega

## Creación de producto

**Solo ADMIN** puede crear productos.

```
POST /products

Body:
{
  "sku": "LAPTOP-DELL-15",
  "name": "Laptop Dell 15 pulgadas",
  "price": 899.99,
  "minStock": 5,
  "maxStock": 50
}
```

### Flujo

1. **Controller** valida DTO
   - SKU: requerido, única
   - Nombre: requerido
   - Price: número positivo
   - minStock < maxStock

2. **Use Case (CreateProductUseCase)**
   - Busca si SKU ya existe
   - Si existe → 422
   - Si no, crea Product Entity:
     ```typescript
     {
       id: "uuid",
       sku: "LAPTOP-DELL-15",
       name: "Laptop Dell 15 pulgadas",
       price: 899.99,
       minStock: 5,
       maxStock: 50,
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
    "sku": "LAPTOP-DELL-15",
    "name": "Laptop Dell 15 pulgadas",
    "price": 899.99,
    "minStock": 5,
    "maxStock": 50
  },
  "message": "Producto creado",
  "statusCode": 201
}
```

## Disponibilidad en bodegas

Un producto se puede tener en múltiples bodegas, pero con **diferentes límites** de stock.

### Agregar a bodega

```
POST /warehouses/:warehouseId/products

Body:
{
  "productId": "uuid",
  "minStock": 10,
  "maxStock": 100
}
```

Ahora ese producto está disponible en esa bodega. El stock inicia en **0** (sin movimientos).

### Stock inicial

Cuando agregas un producto a una bodega, el stock es 0.

Para agregar stock inicial:

```
POST /movements

Body:
{
  "warehouseId": "warehouse-123",
  "productId": "product-456",
  "quantity": 100,
  "type": "ENTRADA"
}
```

Registrás una ENTRADA de 100 unidades → Stock = 100.

## Edición de producto

**Restricciones**:
- **SKU**: Inmutable (nunca cambia)
- **Nombre, precio**: Se pueden editar

```
PUT /products/:productId

Body:
{
  "name": "Laptop Dell 15 pulgadas - Gen 2",
  "price": 999.99
}
```

### Validaciones

- Precio debe ser positivo
- Nombre no puede estar vacío

## Límites de stock por bodega

Los límites (minStock, maxStock) **son por bodega**.

Mismo producto, bodegas diferentes:

```
Bodega Centro:
  minStock: 5
  maxStock: 50
  Stock actual: 25

Bodega Sur:
  minStock: 10
  maxStock: 100
  Stock actual: 80
```

Puedes cambiar los límites:

```
PUT /warehouses/:warehouseId/products/:productId

Body:
{
  "minStock": 20,
  "maxStock": 150
}
```

## Stock dinámico

Stock se calcula en tiempo real. No se almacena.

```
Stock = (ENTRADAS) - (SALIDAS)
```

Ejemplo:
```
Bodega Centro, Laptop Dell:
- ENTRADA: 100 unidades
- SALIDA: 30 unidades
- SALIDA: 20 unidades
- Stock calculado: 100 - 30 - 20 = 50
```

## Soft delete (desactivar)

Para "eliminar" un producto, se marca sin borrar datos:

```
DELETE /products/:productId
```

### Qué pasa

1. Actualiza: `product.deletedAt = NOW()`
2. Histórico de movimientos intacto
3. No aparece en listados
4. Queries excluyen automáticamente: `deletedAt IS NULL`

**Nota**: Si el producto tenía stock (movimientos registrados), el historial se preserva.

## Ciclo completo: Un ejemplo

### Paso 1: Admin crea producto
```
POST /products
{
  "sku": "MOUSE-LOGITECH",
  "name": "Mouse Logitech M705",
  "price": 29.99,
  "minStock": 20,
  "maxStock": 200
}
→ Producto creado ✓
```

### Paso 2: Admin agrega a bodegas
```
POST /warehouses/warehouse-centro/products
{ "productId": "product-uuid", "minStock": 20, "maxStock": 200 }
→ Disponible en Bodega Centro ✓

POST /warehouses/warehouse-sur/products
{ "productId": "product-uuid", "minStock": 30, "maxStock": 150 }
→ Disponible en Bodega Sur ✓
```

### Paso 3: Operator registra entrada
```
POST /movements
{
  "warehouseId": "warehouse-centro",
  "productId": "product-uuid",
  "quantity": 100,
  "type": "ENTRADA"
}
→ Stock Bodega Centro: 100 ✓
```

### Paso 4: Admin ve alertas
```
GET /reports/alerts
→ Bodega Sur: stock en 0 (debajo de minStock 30)
→ Alerta: REABASTECÉ ✓
```

### Paso 5: Operator vende
```
POST /movements
{
  "warehouseId": "warehouse-centro",
  "productId": "product-uuid",
  "quantity": 50,
  "type": "SALIDA"
}
→ Stock Bodega Centro: 50 ✓
```

### Paso 6: Admin ve histórico
```
GET /reports/movements?productId=product-uuid
→ Historial: ENTRADA 100, SALIDA 50, stock = 50
→ Auditoría completa ✓
```

## Validaciones

- **SKU único**: No podés tener dos productos con el mismo SKU
- **Precio positivo**: No podés crear con precio negativo
- **minStock < maxStock**: Límites lógicos
- **En bodega**: minStock y maxStock validados al asignar

---

[← Flujos](../)
