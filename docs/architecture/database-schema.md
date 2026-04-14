# Esquema de Base de Datos

## Visión General

La base de datos está modelada siguiendo principios de Domain-Driven Design. Utiliza PostgreSQL y es gestionada mediante Prisma ORM.

**Características clave:**
- Soft deletes: todos los registros tienen `deletedAt` para eliminar lógicamente sin perder datos
- Índices estratégicos en columnas frecuentemente consultadas
- Relaciones one-to-many y many-to-one para integridad referencial
- Enums para tipos fijos (Role, MovementType)

---

## Modelos

### Users (Usuarios)

Tabla que almacena los usuarios del sistema.

```
┌────────────────────┐
│ users              │
├────────────────────┤
│ id (UUID, PK)      │ Identificador único
│ email (String)     │ Email único del usuario
│ password_hash      │ Contraseña hasheada (bcrypt)
│ role               │ ADMIN | OPERATOR
│ warehouse_id (FK)  │ Bodega asignada (null si ADMIN)
│ refresh_token_hash │ Hash del último refresh token
│ created_at         │ Fecha de creación
│ deleted_at         │ Soft delete (null = activo)
└────────────────────┘
```

**Características:**
- **email**: Índice UNIQUE para evitar duplicados
- **role**: ADMIN (acceso total) o OPERATOR (acceso a una bodega)
- **warehouse_id**: Null si es ADMIN, UUID si es OPERATOR
- **refresh_token_hash**: Almacena el hash del refresh token activo para validar rotación

**Relaciones:**
- FK a `warehouses.id` (opcional, solo OPERATOR)
- 1:N a `stock_movements` (crea movimientos)

---

### Warehouses (Bodegas)

Tabla que almacena las bodegas/depósitos donde se guardan productos.

```
┌────────────────────┐
│ warehouses         │
├────────────────────┤
│ id (UUID, PK)      │ Identificador único
│ name (String)      │ Nombre de la bodega
│ location (String)  │ Localización/dirección
│ capacity (Int)     │ Capacidad máxima
│ is_active (Bool)   │ Bodega operativa (true/false)
│ created_at         │ Fecha de creación
│ deleted_at         │ Soft delete (null = activo)
└────────────────────┘
```

**Características:**
- **capacity**: Informativo, no se valida contra stock
- **is_active**: Puedes desactivar sin eliminar

**Relaciones:**
- 1:N a `users` (usuarios asignados)
- 1:N a `stock_movements` (movimientos en esta bodega)

---

### Products (Productos)

Tabla que almacena los artículos disponibles para inventariar.

```
┌────────────────────┐
│ products           │
├────────────────────┤
│ id (UUID, PK)      │ Identificador único
│ sku (String)       │ Código único del producto
│ name (String)      │ Nombre descriptivo
│ description (Str)  │ Descripción (nullable)
│ unit (String)      │ Unidad de medida (ej: "pieza", "kg")
│ min_stock_alert    │ Umbral para alertas (default: 0)
│ created_at         │ Fecha de creación
│ deleted_at         │ Soft delete (null = activo)
└────────────────────┘
```

**Características:**
- **sku**: Índice UNIQUE, identifica producto globalmente
- **min_stock_alert**: Si stock < esto, aparece en reportes de alertas
- **unit**: Texto libre (ej: "unidad", "kg", "litro", "metro")

**Relaciones:**
- 1:N a `stock_movements` (todos los movimientos de este producto)

---

### StockMovement (Movimientos de Stock)

Tabla de hechos que registra cada entrada o salida de productos.

```
┌────────────────────┐
│ stock_movements    │
├────────────────────┤
│ id (UUID, PK)      │ Identificador único
│ product_id (FK)    │ Producto movido
│ warehouse_id (FK)  │ Bodega donde ocurre
│ user_id (FK)       │ Usuario que registró
│ type               │ ENTRADA | SALIDA
│ quantity (Int)     │ Cantidad movida
│ notes (String)     │ Notas/motivo (nullable)
│ created_at         │ Timestamp del movimiento
└────────────────────┘
```

**Características:**
- **type**: ENTRADA (compra/recepción) o SALIDA (venta/uso)
- **quantity**: Siempre positivo, el tipo determina si suma o resta
- **created_at**: No se puede cambiar, es inmutable
- No hay campo de "stock" — se calcula dinámicamente

**Relaciones:**
- FK a `products.id`
- FK a `warehouses.id`
- FK a `users.id`

**Índices:**
```
- (warehouse_id, product_id) — buscar stock actual rápido
- (product_id, warehouse_id, created_at) — reportes de movimientos
- (created_at) — filtrar por fecha
```

---

## Enums

### Role

```typescript
enum Role {
  ADMIN      // Administrador: acceso total
  OPERATOR   // Operador: acceso a una bodega
}
```

**Semantica:**
- **ADMIN**: Sin warehouse_id, ve todo, crea usuarios, genera alertas
- **OPERATOR**: Con warehouse_id, ve solo su bodega

### MovementType

```typescript
enum MovementType {
  ENTRADA   // Entrada: compra, recepción, devolución (suma)
  SALIDA    // Salida: venta, uso, descarte (resta)
}
```

---

## Diagrama Relacional

```
┌─────────────────┐
│    users        │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ passwordHash    │
│ role            │
│ warehouseId(FK) │◄──┐
│ refreshToken    │   │ 1
│ createdAt       │   │
│ deletedAt       │   │
└─────────────────┘   │
        │             │
        │ 1:N    ┌─────────────────┐
        │        │  warehouses     │
        │        ├─────────────────┤
        └───────►│ id (PK)         │
                 │ name            │
                 │ location        │
                 │ capacity        │
                 │ isActive        │
                 │ createdAt       │
                 │ deletedAt       │
                 └─────────────────┘
                        │
                        │ 1:N
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌──────────────────┐        ┌────────────────────┐
│  products        │        │  stock_movements   │
├──────────────────┤        ├────────────────────┤
│ id (PK)          │◄───────│ productId (FK)     │
│ sku (UNIQUE)     │        │ warehouseId (FK)   │
│ name             │        │ userId (FK)        │
│ description      │        │ type (ENTRADA|SAL.)│
│ unit             │        │ quantity           │
│ minStockAlert    │        │ notes              │
│ createdAt        │        │ createdAt          │
│ deletedAt        │        └────────────────────┘
└──────────────────┘
```

---

## Cálculo de Stock

El stock **nunca se almacena**, se calcula en tiempo de query:

```sql
-- Stock actual de un producto en una bodega
SELECT 
  COALESCE(SUM(CASE WHEN type = 'ENTRADA' THEN quantity ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN type = 'SALIDA' THEN quantity ELSE 0 END), 0) AS stock
FROM stock_movements
WHERE product_id = $1 AND warehouse_id = $2 AND deleted_at IS NULL
```

**Ventajas:**
- Siempre consistente (no hay riesgo de desincronización)
- No requiere transacciones complejas
- Fácil auditar (cada movimiento está registrado)

**Desventaja:**
- Consultas pueden ser lentas sin índices (ver índices arriba)

---

## Soft Deletes

Todos los modelos tienen `deletedAt: DateTime?`. Cuando "eliminas" un registro:

```typescript
// UPDATE users SET deleted_at = NOW() WHERE id = 'xxx'
await user.update({ deletedAt: new Date() })
```

**Comportamiento:**
- Las queries automáticamente filtran `WHERE deleted_at IS NULL`
- Los datos nunca se pierden (auditoría completa)
- Las FK todavía funcionan (integridad referencial)

---

## Índices

```
stock_movements:
  - (warehouse_id, product_id)           → búsqueda de stock actual
  - (product_id, warehouse_id, created_at) → reportes por fecha
  - (created_at)                          → filtrar movimientos recientes
```

Estos índices optimizan:
1. Reportes de stock (bodega + producto)
2. Historial de movimientos (tabla de hechos, muchas filas)
3. Alertas (buscar stock bajo)

---

## Ejemplo: Flujo de un Movimiento

1. **User registra ENTRADA** en Warehouse A de Product X (qty: 50)
   ```
   INSERT INTO stock_movements 
   (id, product_id, warehouse_id, user_id, type, quantity, created_at)
   VALUES ('...', 'X', 'A', '...', 'ENTRADA', 50, NOW())
   ```

2. **Sistema consulta stock**
   ```
   SUM(ENTRADA) - SUM(SALIDA) WHERE product_id='X' AND warehouse_id='A'
   = 50 - 0 = 50 unidades
   ```

3. **User registra SALIDA** (qty: 30)
   ```
   INSERT INTO stock_movements 
   (..., type: 'SALIDA', quantity: 30, ...)
   ```

4. **Stock actual**
   ```
   = 50 - 30 = 20 unidades
   ```

---

## Migraciones

Están en `prisma/migrations/`. Cada migration:
- Crea tablas/índices en la primer ejecución
- Se aplica automáticamente al iniciar (`npm run start`)
- Es reversible (aunque no recomendado en producción)

---

## Consultas Típicas

### Stock actual por producto/bodega
```sql
SELECT 
  SUM(CASE WHEN type='ENTRADA' THEN quantity ELSE 0 END) - 
  SUM(CASE WHEN type='SALIDA' THEN quantity ELSE 0 END) AS stock
FROM stock_movements
WHERE product_id = $1 AND warehouse_id = $2 AND deleted_at IS NULL
```

### Productos con stock bajo
```sql
SELECT p.*, 
  (SUM(CASE WHEN sm.type='ENTRADA' THEN sm.quantity ELSE 0 END) -
   SUM(CASE WHEN sm.type='SALIDA' THEN sm.quantity ELSE 0 END)) AS current_stock
FROM products p
LEFT JOIN stock_movements sm ON p.id = sm.product_id
WHERE p.deleted_at IS NULL AND p.min_stock_alert > current_stock
GROUP BY p.id
```

### Historial de movimientos
```sql
SELECT sm.*, p.name as product_name, u.email as user_email
FROM stock_movements sm
JOIN products p ON sm.product_id = p.id
JOIN users u ON sm.user_id = u.id
WHERE sm.warehouse_id = $1 AND sm.created_at >= $2
ORDER BY sm.created_at DESC
```

---

## Consideraciones de Performance

1. **Sin denormalización**: El stock se calcula, no se almacena
2. **Índices en StockMovement**: críticos por la cantidad de filas
3. **Soft deletes**: todas las queries incluyen `deleted_at IS NULL`
4. **Sin transacciones distribuidas**: todos los datos en una BD

**Si crece mucho:**
- Considerar particiones en stock_movements por fecha
- Cachear reportes de stock (invalidar cada movimiento)
- Usar vistas materializadas para alertas
