# Testing

## Visión general

Tenemos 62 tests cobriendo:
- Lógica de dominio (entities, value objects)
- Casos de uso
- Validaciones de negocio
- Manejo de errores
- Controladores e integración

## Ejecutar tests

```bash
npm test                       # Suite completa
npm run test:watch             # Watch mode (recomendado para desarrollo)
npm run test:cov               # Con reporte de cobertura
npm test src/auth              # Tests del módulo auth
npm test -- --testNamePattern="login"  # Tests que matcheen "login"
```

## Estructura de tests

```
src/modulo/
├── domain/
│   └── __tests__/
│       ├── entities.spec.ts
│       └── value-objects.spec.ts
├── application/
│   └── __tests__/
│       └── use-cases.spec.ts
├── infrastructure/
│   └── __tests__/
│       └── adapters.spec.ts
└── interface/
    └── __tests__/
        └── controllers.spec.ts
```

## Escribir un test

### Test de Use Case (más común)

```typescript
describe('CreateMovementUseCase', () => {
  let useCase: CreateMovementUseCase;
  let mockRepository: jest.Mocked<IStockMovementRepository>;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    // Arrange: Setup
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    } as any;
    
    mockProductRepository = {
      findById: jest.fn().mockResolvedValue(
        new Product('prod-1', new SKU('PROD-001'), 'Test', 10, 100)
      ),
    } as any;

    useCase = new CreateMovementUseCase(
      mockRepository,
      mockProductRepository
    );
  });

  it('debería crear un movimiento de entrada', async () => {
    // Act
    const result = await useCase.execute(
      new CreateMovementCommand('warehouse-1', 'prod-1', 50, 'ENTRADA', 'user-1')
    );

    // Assert
    expect(result.id).toBeDefined();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('debería fallar si hay stock insuficiente', async () => {
    // Para SALIDA sin stock
    mockProductRepository.findById.mockResolvedValue(
      new Product('prod-1', new SKU('PROD-001'), 'Test', 0, 100) // 0 stock
    );

    await expect(
      useCase.execute(
        new CreateMovementCommand('warehouse-1', 'prod-1', 50, 'SALIDA', 'user-1')
      )
    ).rejects.toThrow(InsufficientStockError);
  });
});
```

### Test de Entity

```typescript
describe('Product', () => {
  it('debería crear un producto válido', () => {
    const product = new Product(
      'id-1',
      new SKU('PROD-001'),
      'Mi Producto',
      10,
      100
    );

    expect(product.sku.value).toBe('PROD-001');
    expect(product.name).toBe('Mi Producto');
  });

  it('debería fallar con SKU inválido', () => {
    expect(
      () => new SKU('invalid') // < 4 caracteres
    ).toThrow(InvalidSKUError);
  });
});
```

### Test de Controller

```typescript
describe('MovementsController', () => {
  let controller: MovementsController;
  let mockUseCase: jest.Mocked<CreateMovementUseCase>;

  beforeEach(async () => {
    mockUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new MovementsController(mockUseCase);
  });

  it('debería crear un movimiento', async () => {
    const request = {
      warehouseId: 'warehouse-1',
      productId: 'prod-1',
      quantity: 50,
      type: 'ENTRADA',
    };

    const mockResult = new MovementResult('mov-1', 'ENTRADA');
    mockUseCase.execute.mockResolvedValue(mockResult);

    const req = { user: { userId: 'user-1' } };
    const response = await controller.create(request, req);

    expect(response.statusCode).toBe(201);
    expect(response.message).toBe('Movimiento registrado');
  });
});
```

## Mocking

### Mockeando repositorios

```typescript
const mockRepository = {
  save: jest.fn(),
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }),
  findAll: jest.fn().mockResolvedValue([]),
} as jest.Mocked<IMyRepository>;
```

### Mockeando Prisma

```typescript
const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
} as jest.Mocked<PrismaService>;
```

## Assertions comunes

```typescript
// Valores
expect(value).toBe(5);
expect(value).toEqual({ id: '1' });
expect(value).toBeDefined();
expect(value).toBeNull();

// Arrays
expect([1, 2]).toContain(1);
expect([1, 2]).toHaveLength(2);

// Funciones
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledWith('param');
expect(mock).toHaveBeenCalledTimes(1);

// Errores
expect(() => { throw new Error(); }).toThrow();
await expect(promise).rejects.toThrow(CustomError);

// Strings
expect('hello').toMatch(/hello/);
expect('hello').toContain('ell');
```

## Coverage

Generá reporte de cobertura:

```bash
npm run test:cov
```

Ver en `coverage/lcov-report/index.html`

**Objetivo**: >80% en lógica de negocio.

## Tips

1. **Test primero lo importante**: Domain logic, use cases, validaciones
2. **Mockeá las dependencias**: Para aislar lo que testeás
3. **Un assert por test**: O agrupa si están relacionados
4. **Nombres descriptivos**: `it('debería fallar si hay stock insuficiente', ...)`
5. **Arrange-Act-Assert**: Prepará, ejecutá, verificá

## CI/CD

En GitHub Actions (si existe):

```bash
npm test                    # Falla si algún test cae
npm run typecheck          # Falla si hay errores TypeScript
npm run lint               # Falla si hay errores de estilo
```

---

[← Volvé a Documentación](../README.md) | [Deployment →](deployment.md)
