# Glosario

Términos y conceptos clave en el sistema.

## Bodega (Warehouse)

Ubicación física donde se guardan productos. Cada bodega tiene:

- Nombre único
- Ubicación (ciudad, dirección)
- Inventario independiente (cada producto puede tener stock diferente)
- Un OPERATOR asignado (responsable)

Ejemplo: "Bodega Centro Santiago" vs "Bodega Concepción"

## Producto (Product)

Artículo que se administra en el inventario. Tiene:

- **SKU**: Código único (ej: "PROD-001", "LAPTOP-DELL-15")
- **Nombre**: Descripción (ej: "Laptop Dell 15 pulgadas")
- **Precio**: Costo unitario
- **Stock mínimo**: Cantidad para disparar alerta
- **Stock máximo**: Capacidad de la bodega para ese producto

## Stock

Cantidad disponible de un producto en una bodega **ahora mismo**.

No se almacena en BD. Se calcula dinámicamente:

```
Stock = (Total ENTRADAS) - (Total SALIDAS)
```

Esto garantiza que siempre es la fuente de verdad. Si algo falló en movimientos, el stock es incorrecto pero refleja la realidad de los datos.

## ENTRADA

Un movimiento que agrega stock. Causas:

- Compra a proveedor
- Devolución de cliente
- Transferencia entre bodegas
- Ajuste por error anterior

Aumenta el stock automáticamente.

## SALIDA

Un movimiento que resta stock. Causas:

- Venta a cliente
- Transferencia a otra bodega
- Descarte/rotura
- Dañado/devuelto

Necesita **validación**: No podés sacar más de lo que tenés. Si hay insuficiente stock, el movimiento es rechazado (error 422).

## Movimiento (Movement, StockMovement)

Registro de entrada o salida. Tiene:

- Tipo (ENTRADA o SALIDA)
- Cantidad
- Producto asociado
- Bodega asociada
- Usuario que registró
- Timestamp exacto
- **Nunca se elimina**: Soft delete solo marca como eliminado

## Rol

Define qué puede hacer cada usuario:

### ADMIN

- Crea usuarios
- Ve todas las bodegas
- Ve reportes de alertas (información sensible)
- Registra movimientos en cualquier bodega
- Acceso total al sistema

### OPERATOR

- No crea usuarios
- Ve solo su bodega asignada
- No accede a reportes de alertas
- Registra movimientos solo en su bodega
- Acceso limitado por bodega

## JWT (Token)

Credencial que probás quién sos sin mantener sesión en servidor.

Contiene:
- Tu ID
- Tu email
- Tu rol
- Cuándo expira

Dura **15 minutos** (access token). Después necesitás renovarlo (refresh token válido 7 días).

## Soft Delete

Cuando algo se elimina, no se borra realmente. Se marca con `deletedAt`:

```
DELETE → Actualiza deletedAt = NOW()
```

**Ventajas**:
- Preserva historial
- Reversible
- Auditoría completa

Queries automáticamente excluyen `deletedAt IS NOT NULL`.

## Transacción

Conjunto de cambios que se ejecutan juntos o no se ejecutan.

Ejemplo: Registrar movimiento + Actualizar stock debe ser atómico. Si uno falla, todo falla.

El sistema usa transacciones para asegurar consistencia.

## Agregado

En DDD: Entidad raíz que agrupa cambios relacionados.

En el sistema:
- **Warehouse**: Agregado raíz (contiene productos)
- **Product**: Entity pero pertenece a Warehouse
- **StockMovement**: Agregado que valida su propia lógica

## Value Object

Objeto inmutable sin identidad propia.

Ejemplos en el sistema:
- Email
- Quantity
- MovementType ("ENTRADA" o "SALIDA")

Se validan en construcción. Si algo es inválido, error inmediato.

## DTOs (Data Transfer Objects)

Objetos que transportan datos entre capas.

```
Controller recibe DTO → Application convierte a Domain → Persiste
```

Separa lo que recibís (HTTP) de tu lógica (dominio).

## Repositorio

Interfaz que simula colecciones. Abstrae de la BD.

Ejemplo: `WarehouseRepository.findById(id)` sin saber si es PostgreSQL, MongoDB, etc.

## Use Case (Application Service)

Orquesta la lógica de un caso de uso.

Ejemplo: `CreateStockMovementUseCase`:
1. Valida datos
2. Busca warehouse y product
3. Verifica stock si SALIDA
4. Crea movimiento
5. Persiste
6. Retorna resultado

## Guard

Validador que bloquea acceso.

Ejemplo: `JwtAuthGuard` verifica token en cada request.

## Filtro (Filter/Exception Filter)

Intercepta excepciones y mapea a respuestas HTTP.

Ejemplo: `BusinessRuleExceptionFilter` captura cuando hay stock insuficiente y retorna 422.

---

[← Documentación](../README.md)
