# Arquitectura

## Cómo está organizado el código

El código está armado en capas, cada una con su responsabilidad. Cada módulo (Auth, Movements, etc) sigue la misma estructura.

```
src/
├── domain/              El núcleo: lógica pura del negocio
├── application/         Orquesta los casos de uso
├── infrastructure/      Detalles técnicos (BD, APIs externas)
└── interface/           Controladores HTTP
```

### Domain: El corazón

Acá está toda la lógica del negocio pura. **No conoce nada de frameworks ni base de datos**. Solo define qué reglas de negocio tiene que cumplir el sistema.

Ejemplos:
- **Entidades**: `Product`, `StockMovement`
- **Value Objects**: `SKU`, `MovementType`
- **Puertos** (interfaces): `IProductRepository`
- **Errores de negocio**: `InsufficientStockError`, `InvalidSKUError`

```typescript
// domain/value-objects/SKU.ts
export class SKU {
  readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidSKUError('SKU tiene que ser 4-20 caracteres');
    }
    this.value = value;
  }

  private isValid(value: string): boolean {
    return /^[A-Z0-9-]{4,20}$/.test(value);
  }
}
```

### Application: El orquestador

Acá están los **casos de uso**: "crear producto", "registrar movimiento", "generar reporte". Usa la lógica del domain y se comunica con la infrastructure a través de interfaces.

```typescript
@Injectable()
export class CreateMovementUseCase {
  constructor(
    @Inject(STOCK_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IStockMovementRepository,
  ) {}

  async execute(command: CreateMovementCommand): Promise<MovementResult> {
    // Valida reglas de negocio
    // Usa el repositorio para guardar
    // Retorna el resultado
  }
}
```

### Infrastructure: Lo técnico

Acá está la implementación de los "puertos" que define domain. Es donde usamos Prisma, JWT, etc.

```typescript
@Injectable()
export class ProductRepositoryAdapter implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({ where: { id } });
    if (!record) return null;
    return new Product(record.id, new SKU(record.sku), record.name);
  }
}
```

### Interface: La puerta de entrada

Los controladores HTTP. Reciben requests, validan, llaman al use case y devuelven respuestas.

```typescript
@Controller('movements')
export class MovementsController {
  constructor(private readonly createMovement: CreateMovementUseCase) {}

  @Post()
  @Roles('OPERATOR', 'ADMIN')
  async create(@Body() request: CreateMovementRequest): Promise<ApiResponse> {
    const result = await this.createMovement.execute(
      new CreateMovementCommand(request.warehouseId, request.productId, ...)
    );
    return new ApiResponse(result, 'Movimiento registrado', 201);
  }
}
```

---

## Las reglas de dependencia

Es simple: las capas internas **nunca importan** de las externas.

```
Domain (núcleo) ← Application ← Infrastructure ← Interface
         ↑              ↑
    Nadie importa    Solo conoce domain
    de acá
```

Si infrastructure necesita algo de domain, crea una **interfaz (puerto)** en domain e infrastructure la implementa.

---

## Domain-Driven Design

Cada módulo representa un **bounded context** (área del negocio):

- **Auth**: Login, tokens, credenciales
- **Products**: Catálogo, SKUs, stock mínimo/máximo
- **Movements**: Entradas, salidas, historial
- **Reports**: Reportes, alertas

---

## Value Objects

Son objetos **inmutables** que validan su propia lógica:

```typescript
export class SKU {
  constructor(value: string) {
    if (!this.isValid(value)) throw new InvalidSKUError();
    this.value = value;
  }
}
```

La validación vive en el dominio, no en DTOs.

---

## Agregados

Grupos de entidades que se comportan como uno. Ejemplo: un `Product` es un agregado que contiene el SKU.

---

## Decisiones de diseño

### DTOs en application

Los DTOs definen el "contrato" de qué necesita un caso de uso. Por eso están en `application/`, no en domain ni interface.

### Stock dinámico

El stock se calcula desde el historial:

```
stock = ENTRADA.sum() - SALIDA.sum()
```

Ventaja: una sola fuente de verdad. Nunca se desincroniza.

### Soft deletes

Cuando borras algo, solo marcamos `deletedAt`. Nunca eliminamos datos físicamente.

```typescript
await prisma.product.update({
  where: { id },
  data: { deletedAt: new Date() }
});
```

Razón: conservar historial y auditoría.

### Transacciones

Toda operación crítica usa transacciones:

```typescript
await prisma.$transaction(async (prisma) => {
  await prisma.stockMovement.create({ data });
  // Garantiza atomicidad
});
```

### Roles y permisos

Los roles se definen en el JWT y se validan con `@Roles()`:

```typescript
@Post()
@Roles('ADMIN', 'OPERATOR')
async create(...) { }
```

---

## Manejo de errores

Los errores de negocio se definen en domain y se mapean a HTTP en el filtro global.

```typescript
if (exception instanceof InsufficientStockError) {
  return response.status(422).json({
    data: null,
    message: exception.message,
    statusCode: 422
  });
}
```

---

## Testing

Los tests están donde vive la lógica:

- **Domain tests**: Validación de entidades y value objects
- **Application tests**: Casos de uso con mocks
- **Infrastructure tests**: Repositorios reales
- **Interface tests**: Controladores (integración)

---

## Inyección de dependencias con Symbol

Usamos `Symbol` en lugar de strings para evitar typos:

```typescript
const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}
}
```

---

## Performance

Los indexes están en `StockMovement` para las queries más frecuentes:
- `productId`: Filtrado en reportes
- `warehouseId`: Movimientos por bodega
- `createdAt`: Ordenamiento y rangos de fecha
- `type`: Rápido separar ENTRADA/SALIDA

---

Andá a los módulos en [`docs/architecture/modules.md`](modules.md) para entender qué hace cada uno.
