# Guía de Contribución

Bienvenido. Acá encontrás las convenciones, estándares y proceso para contribuir al proyecto.

---

## Antes de Empezar

1. **Fork** el repositorio
2. **Clone** tu fork localmente
3. **Crea una rama** desde `develop`:
   ```bash
   git checkout -b feature/tu-feature develop
   ```
4. **Haz cambios**, testa, y pushea
5. **Abre un PR** hacia `develop` (no `main`)

---

## Estructura de Ramas

```
main
  ↑ (merges de release/)
develop
  ↑ (merges de feature/)
feature/X (tu trabajo)
```

**Convención de nombres:**
- `feature/auth-2fa` - Nueva feature
- `fix/login-crash` - Bug fix
- `docs/update-readme` - Documentación
- `refactor/user-service` - Refactor sin feature

---

## Estilo de Código

### TypeScript

```typescript
// ✓ Bueno
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// ✗ Malo
interface UserRepository {
  find_by_id(id: string): Promise<User | null>; // snake_case
  save(user: any): Promise<any>; // any
}
```

**Reglas:**
- `camelCase` para variables, funciones, métodos
- `PascalCase` para clases, interfaces, enums
- `SCREAMING_SNAKE_CASE` para constantes
- Tipos explícitos (no `any`)
- Interfaces para contratos

### Ejemplo: Use Case

```typescript
export class RegisterMovementUseCase {
  constructor(
    @Inject('MOVEMENT_REPOSITORY')
    private movementRepository: IMovementRepository,
  ) {}

  async execute(input: RegisterMovementInput): Promise<MovementOutput> {
    // Validación
    if (input.quantity <= 0) {
      throw new InvalidQuantityError('Quantity must be positive');
    }

    // Lógica de dominio
    const movement = StockMovement.create({
      productId: input.productId,
      warehouseId: input.warehouseId,
      type: input.type,
      quantity: input.quantity,
    });

    // Persistencia
    await this.movementRepository.save(movement);

    return this.toOutput(movement);
  }

  private toOutput(movement: StockMovement): MovementOutput {
    return {
      id: movement.id,
      type: movement.type,
      quantity: movement.quantity,
    };
  }
}
```

---

## Estructura de Carpetas

```
src/
├── modules/
│   └── X/                      # Módulo X
│       ├── application/        # Use cases
│       │   ├── dtos/          # Input/Output
│       │   ├── use-cases/     # Lógica
│       │   └── symbols.ts     # DI tokens
│       ├── domain/            # Entities, Value Objects
│       │   ├── entities/
│       │   └── errors/
│       ├── infrastructure/    # Adapters, DB
│       │   └── adapters/
│       └── interface/         # Controllers, HTTP
│           └── X.controller.ts
├── shared/
│   ├── filters/
│   ├── guards/
│   └── error-handling/
└── main.ts
```

**Norma:** 1 módulo = 1 feature (auth, users, movements, etc.)

---

## Commits

### Mensaje de Commit

Usamos Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipos:**
- `feat`: Nueva feature
- `fix`: Bug fix
- `docs`: Cambios en documentación
- `style`: Formateo (no lógica)
- `refactor`: Reorganización sin cambiar comportamiento
- `perf`: Mejora de performance
- `test`: Agregar/actualizar tests
- `chore`: Cambios de build, deps, etc.

**Ejemplos válidos:**

```
feat(movements): implementar validación de stock insuficiente

fix(auth): corregir expiración de refresh token

docs: actualizar diagrama de arquitectura

refactor(reports): extraer cálculo de stock a función

test(users): agregar casos para crear usuario con rol OPERATOR
```

**Normas:**
- Mensaje en inglés o español (sé consistente)
- Imperativo: "add" no "added"
- Primera línea < 50 caracteres
- Cuerpo: explicá POR QUÉ, no QUÉ

---

## Testing

### Antes de pushear

```bash
# Linting
npm run lint

# Tests unitarios
npm run test

# Build
npm run build
```

Todos deben pasar. Si falla algo:

```bash
# Fix linting
npm run lint -- --fix

# Run specific test
npm run test -- src/auth/login.spec.ts

# Debug test
npm run test -- --debug
```

### Escribir Tests

```typescript
// ✓ Describe lo que testeas
describe('RegisterMovementUseCase', () => {
  // ✓ Arrange, Act, Assert
  it('should register ENTRADA movement successfully', async () => {
    // Arrange
    const input = {
      productId: 'product-1',
      warehouseId: 'warehouse-1',
      type: MovementType.ENTRADA,
      quantity: 10,
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.quantity).toBe(10);
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ type: MovementType.ENTRADA }),
    );
  });

  it('should throw error if quantity is negative', async () => {
    // Arrange
    const input = { quantity: -5 };

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow(
      InvalidQuantityError,
    );
  });
});
```

**Normas:**
- 1 feature = >1 test
- Nombra: `should [comportamiento] [condición]`
- Mock dependencias (nunca BD real en tests)
- Cubre casos de error

---

## Pull Request

### Título del PR

```
[FEATURE] Implementar validación de stock insuficiente
[FIX] Corregir expiración de token
[DOCS] Actualizar guía de autenticación
```

### Descripción del PR

```markdown
## Descripción

Qué cambios hacés y por qué.

## Tipo de cambio

- [ ] Nueva feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentación

## Cómo testear

Pasos para verificar que funciona:

1. Logueate con `admin@test.com`
2. Registra una ENTRADA
3. Verifica stock en reportes

## Checklist

- [ ] Código sigue estándares del proyecto
- [ ] Tests agregados/actualizados
- [ ] Linting pasa (`npm run lint`)
- [ ] Build pasa (`npm run build`)
- [ ] Documentación actualizada (si necesario)
- [ ] No hay breaking changes (o está documentado)
```

### Proceso de Review

1. Al menos 1 aprobación
2. CI pass (tests, lint, build)
3. Sin conflictos con `develop`

Luego: **Squash & Merge** a `develop`

---

## Agregar Feature Completa

Checklist para una feature de punta a punta:

- [ ] **Domain Layer**
  - [ ] Entity: `src/modules/X/domain/entities/`
  - [ ] Value Objects: `src/modules/X/domain/value-objects/`
  - [ ] Errors: `src/modules/X/domain/errors/`

- [ ] **Application Layer**
  - [ ] Use Case: `src/modules/X/application/use-cases/`
  - [ ] DTOs: `src/modules/X/application/dtos/`
  - [ ] DI Symbols: `src/modules/X/application/symbols.ts`

- [ ] **Infrastructure Layer**
  - [ ] Repository Adapter: `src/modules/X/infrastructure/adapters/`
  - [ ] Prisma schema update (si necesario)

- [ ] **Interface Layer**
  - [ ] Controller: `src/modules/X/interface/`
  - [ ] Guards (auth, roles)
  - [ ] Swagger decorators (@ApiOperation, etc.)

- [ ] **Testing**
  - [ ] Domain tests
  - [ ] Use case tests
  - [ ] Integration tests (si complejo)

- [ ] **Documentation**
  - [ ] Endpoint docs en `docs/api/`
  - [ ] Actualizar arquitectura si necesario
  - [ ] Actualizar README si es feature mayor

---

## Reportar Issues

Si encontrás un bug:

1. **Verifica** que no esté ya reportado
2. **Reproduce** pasos exactos
3. **Abre issue** con:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado
   - Output de logs/errores
   - Ambiente (Node version, OS, etc.)

---

## DDD (Domain-Driven Design)

El proyecto usa DDD. Respetá estas capas:

### Domain

Aquí va la lógica de negocio pura, sin frameworks.

```typescript
// ✓ Correcto
export class StockMovement {
  constructor(
    readonly id: string,
    readonly type: MovementType,
    readonly quantity: number,
  ) {
    if (quantity <= 0) {
      throw new InvalidQuantityError();
    }
  }
}

// ✗ Incorrecto (acoplado a DB)
export class StockMovement {
  @Column()
  quantity: number;
}
```

### Application

Orquesta domain con infrastructure. Aquí van los use cases.

```typescript
// ✓ Correcto
export class RegisterMovementUseCase {
  constructor(
    private movementRepository: IMovementRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) throw new ProductNotFoundError();

    const movement = StockMovement.create(input);
    await this.movementRepository.save(movement);

    return this.toOutput(movement);
  }
}
```

### Infrastructure

Implementa interfaces (puertos). Aquí va Prisma, BD, etc.

```typescript
// ✓ Correcto
export class MovementRepositoryAdapter implements IMovementRepository {
  constructor(private prisma: PrismaClient) {}

  async save(movement: StockMovement): Promise<void> {
    await this.prisma.stockMovement.create({
      data: {
        id: movement.id,
        type: movement.type,
        quantity: movement.quantity,
      },
    });
  }
}
```

### Interface

HTTP layer. Aquí van controllers.

```typescript
// ✓ Correcto
@Controller('movements')
export class MovementsController {
  constructor(
    private registerMovementUseCase: RegisterMovementUseCase,
  ) {}

  @Post()
  async register(@Body() dto: RegisterMovementDto) {
    const result = await this.registerMovementUseCase.execute(dto);
    return { data: result };
  }
}
```

---

## Agregar Dependencia

Si necesitás agregar una librería:

```bash
# Siempre pide aprobación primero

# Luego agrega
npm install nueva-libreria

# Actualiza lock
npm install

# Commit
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): agregar nueva-libreria"
```

**Criterios:**
- ¿Es necesaria? (no agregarla si ya existe en el proyecto)
- ¿Está mantenida? (chequea GitHub stars, última versión)
- ¿Qué tamaño tiene? (no bundle innecesario)
- ¿Licencia compatible?

---

## Performance

Si trabajás en reportes o queries:

```typescript
// ✓ Optimizado (con índices)
const stock = await this.prisma.stockMovement.groupBy({
  by: ['warehouseId', 'productId'],
  where: { warehouseId: id },
  _sum: { quantity: true },
});

// ✗ Lento (N+1)
const movements = await this.prisma.stockMovement.findMany();
movements.forEach(m => m.product = db.getProduct(m.productId));
```

Índices están definidos en `prisma/schema.prisma`. Si agregas query nueva:
1. Verifica que use índices existentes
2. Si no, propone índice nuevo en PR

---

## Preguntas Frecuentes

**¿Puedo commitear directamente a main?**
No. Solo merges desde release branches a main.

**¿Cómo actualizo mi fork?**
```bash
git remote add upstream https://github.com/egp1020/inventory-api
git fetch upstream
git rebase upstream/develop
git push origin develop --force-with-lease
```

**¿Qué pasa si mi PR tiene conflictos?**
Rebase contra develop, resolve conflictos, y pushea.

**¿Testing es obligatorio?**
Sí. Features sin tests no se mergean.

**¿Puedo usar `console.log` en producción?**
No. Usa `Logger` de NestJS:
```typescript
constructor(private logger: Logger) {}
this.logger.log('Message');
```

---

## Contacto

- Issues: GitHub issues
- Discusión: GitHub discussions
- Preguntas: Abre issue etiquetado `question`

Gracias por contribuir. 🙌

---

[← Guías](.)
