# Capas de Arquitectura

La arquitectura está dividida en 4 capas con responsabilidades claras.

## Arquitectura en capas

```
┌─────────────────────────────────────────┐
│     Interface (HTTP Controllers)        │
│  Recibe y valida requests HTTP          │
└────────────┬────────────────────────────┘
             │ DTOs
┌────────────▼────────────────────────────┐
│   Application (Use Cases, Services)     │
│  Orquesta la lógica del negocio         │
└────────────┬────────────────────────────┘
             │ Entities
┌────────────▼────────────────────────────┐
│  Domain (Pure Logic, Value Objects)     │
│  Nunca depende de frameworks            │
└────────────┬────────────────────────────┘
             │ Abstracciones
┌────────────▼────────────────────────────┐
│  Infrastructure (DB, Auth, Adapters)    │
│  Implementa interfaces del Domain       │
└─────────────────────────────────────────┘
```

## Capa Domain

La capa más pura. Solo lógica de negocio, cero dependencias de frameworks.

### Responsabilidades

- Definir Entidades (Warehouse, Product, StockMovement)
- Crear Value Objects (Email, Quantity, MovementType)
- Implementar Aggregates (raíces que coordinan cambios)
- Lanzar excepciones de negocio

### Qué contiene

```
src/
  <module>/
    domain/
      entities/
        product.entity.ts          # Lógica de Product
      value-objects/
        email.value-object.ts      # Validación + Encapsulación
      aggregates/
        warehouse.aggregate.ts     # Raíz de agregado
      exceptions/
        business-rule.exception.ts # Errores de dominio
```

### Ejemplo: Email Value Object

```typescript
export class Email {
  private value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidEmailException();
    }
    this.value = email;
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

**Ventaja**: La validación sucede en construcción. Si existe un Email, es válido.

## Capa Application

Orquesta la lógica de negocio. Conecta Domain con Infrastructure.

### Responsabilidades

- Implementar Use Cases (qué puede hacer el usuario)
- Crear DTOs (lo que viaja por la red)
- Coordinar Repositories y Services
- Transformar entre Domain y Transfer Objects

### Qué contiene

```
src/
  <module>/
    application/
      dto/
        create-product.dto.ts      # Qué recibís del cliente
      use-cases/
        create-product.use-case.ts # Orquesta Product + Warehouse
      mappers/
        product.mapper.ts          # Entity ↔ DTO
```

### Ejemplo: Create Product Use Case

```typescript
export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private warehouseRepository: WarehouseRepository,
  ) {}

  async execute(
    warehouseId: string,
    input: CreateProductInput,
  ): Promise<ProductOutput> {
    // 1. Valida entrada
    if (input.minStock > input.maxStock) {
      throw new InvalidStockLimitsException();
    }

    // 2. Busca dependencias
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse) throw new WarehouseNotFoundException();

    // 3. Crea entidad (lógica de dominio)
    const product = Product.create({
      sku: input.sku,
      name: input.name,
      minStock: input.minStock,
      maxStock: input.maxStock,
    });

    // 4. Persiste
    const saved = await this.productRepository.save(product);

    // 5. Retorna DTO
    return ProductMapper.toOutput(saved);
  }
}
```

## Capa Infrastructure

Implementa detalles técnicos. Repositorios, BD, autenticación.

### Responsabilidades

- Conectar a PostgreSQL via Prisma
- Implementar Repositories (interfaces del Domain)
- Crear Adapters para servicios externos
- Manejar transacciones

### Qué contiene

```
src/
  <module>/
    infrastructure/
      repositories/
        product.repository.ts          # Adapter de BD
      adapters/
        external-api.adapter.ts        # Llama servicios
      migrations/
        001_create_products.sql        # Cambios BD
```

### Ejemplo: Product Repository

```typescript
@Injectable()
export class ProductRepositoryAdapter implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async save(product: Product): Promise<Product> {
    const raw = await this.prisma.product.create({
      data: {
        id: product.id,
        sku: product.sku.getValue(),
        name: product.name,
        minStock: product.minStock,
        maxStock: product.maxStock,
      },
    });

    return ProductMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
    });

    return raw ? ProductMapper.toDomain(raw) : null;
  }
}
```

## Capa Interface

Expone HTTP endpoints. Recibe requests, retorna respuestas.

### Responsabilidades

- Controllers (manejar GET/POST/PUT)
- Guards (validar JWT, permisos)
- Filters (mapear excepciones a HTTP)
- Decorators (autorización)

### Qué contiene

```
src/
  <module>/
    interface/
      controllers/
        product.controller.ts      # Endpoints
      guards/
        auth.guard.ts              # Valida token
      decorators/
        auth.decorator.ts          # @Auth() en métodos
```

### Ejemplo: Product Controller

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post('/:warehouseId')
  @Auth('ADMIN')
  async create(
    @Param('warehouseId') warehouseId: string,
    @Body() createDto: CreateProductDto,
  ) {
    const output = await this.createProductUseCase.execute(
      warehouseId,
      createDto,
    );

    return {
      data: output,
      message: 'Product created',
      statusCode: 201,
    };
  }
}
```

## Reglas de dependencias

**CRÍTICO**: Solo fluyen hacia adentro.

```
Interface → Application → Domain ← Infrastructure
```

- Interface **depende de** Application
- Application **depende de** Domain
- Domain **NO depende** de nada (puro)
- Infrastructure **implementa** interfaces de Domain

**NUNCA hagas**:
- Domain importando Application
- Domain importando Infrastructure
- Application importando Interface

## Flujo de un request

```
1. Request llega: POST /products { sku, name, ... }
   ↓
2. Controller (Interface) recibe, valida DTO
   ↓
3. Llama Use Case (Application)
   ↓
4. Use Case valida reglas de negocio, busca dependencias
   ↓
5. Crea/modifica Entities (Domain)
   ↓
6. Repository (Infrastructure) persiste en BD
   ↓
7. Mapper convierte Entity → DTO
   ↓
8. Response retorna al cliente
```

---

[← Arquitectura](overview.md)
