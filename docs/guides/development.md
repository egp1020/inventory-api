# Desarrollo

## Estructura del proyecto

```
src/
├── shared/               Infraestructura global
│   ├── filters/          Manejo de errores
│   ├── guards/           Autenticación y autorización
│   ├── interceptors/      Transformación de respuestas
│   └── services/          Prisma, JWT, etc
├── auth/                 Módulo de autenticación
├── users/                Módulo de usuarios
├── warehouses/           Módulo de bodegas
├── products/             Módulo de productos
├── movements/            Módulo de movimientos
└── reports/              Módulo de reportes
```

Cada módulo sigue la misma estructura. Ver [`Arquitectura`](../architecture/overview.md).

## Comandos útiles

### Desarrollo

```bash
npm run start:dev              # Watch mode (recomendado)
npm run start:debug            # Con debugger (puerto 9229)
npm run lint                   # ESLint
npm run lint --fix             # ESLint + fix automático
```

### Testing

```bash
npm test                       # Suite completa (62 tests)
npm run test:watch             # Watch mode
npm run test:cov               # Reporte de cobertura
npm test src/auth/...          # Test un archivo
```

### Base de datos

```bash
npx prisma studio             # Explorador visual
npx prisma migrate dev         # Crear y aplicar nueva migración
npm run seed                   # Cargar datos de prueba
```

### Build

```bash
npm run build                  # Compilar TypeScript
npm start                      # Ejecutar compilado (producción)
npm run typecheck              # Solo verificar tipos
```

## Cómo agregar una feature

### 1. Define la lógica en Domain

En `src/modulo/domain/`:

```typescript
// entities/
export class MyEntity {
  constructor(readonly id: string, readonly name: string) {}
}

// value-objects/
export class MyValueObject {
  constructor(readonly value: string) {
    if (!this.isValid(value)) throw new InvalidError();
  }
}

// errors/
export class MyError extends DomainError {
  constructor() { super('Mensaje'); }
}

// ports/
export interface IMyRepository {
  save(entity: MyEntity): Promise<void>;
}
```

### 2. Crea el use case en Application

En `src/modulo/application/`:

```typescript
// use-cases/
@Injectable()
export class MyUseCase {
  constructor(
    @Inject(MY_REPOSITORY) 
    private readonly repo: IMyRepository,
  ) {}

  async execute(command: MyCommand): Promise<MyResult> {
    // Lógica aquí
  }
}

// dtos/
export class MyCommand {
  constructor(readonly field: string) {}
}

export class MyResult {
  constructor(readonly id: string) {}
}
```

### 3. Implementa en Infrastructure

En `src/modulo/infrastructure/`:

```typescript
// adapters/
@Injectable()
export class MyRepositoryAdapter implements IMyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: MyEntity): Promise<void> {
    await this.prisma.myTable.upsert({...});
  }
}
```

### 4. Expone en Interface (HTTP)

En `src/modulo/interface/`:

```typescript
// controllers/
@Controller('myendpoint')
export class MyController {
  constructor(private readonly myUseCase: MyUseCase) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() request: MyRequest): Promise<ApiResponse> {
    const result = await this.myUseCase.execute(
      new MyCommand(request.field)
    );
    return new ApiResponse(result, 'Creado', 201);
  }
}

// dtos/
export class MyRequest {
  @IsString() field: string;
}

export class MyResponse {
  id: string;
}
```

### 5. Registra en el module

```typescript
@Module({
  imports: [PrismaModule],
  providers: [
    MyUseCase,
    { provide: MY_REPOSITORY, useClass: MyRepositoryAdapter },
  ],
  controllers: [MyController],
})
export class MyModule {}
```

### 6. Testea

En `src/modulo/__tests__/`:

```typescript
describe('MyUseCase', () => {
  let useCase: MyUseCase;
  let mockRepo: jest.Mocked<IMyRepository>;

  beforeEach(() => {
    mockRepo = { save: jest.fn() };
    useCase = new MyUseCase(mockRepo);
  });

  it('debería crear', async () => {
    const result = await useCase.execute(new MyCommand('test'));
    expect(result.id).toBeDefined();
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

## Reglas importantes

- **Domain**: Nunca importa de Application, Infrastructure o Interface
- **Application**: Solo importa de Domain
- **Infrastructure**: Importa de Domain y Application
- **Interface**: Solo importa de Application

Ver [`Arquitectura`](../architecture/layers.md).

## Patrones usados

- **Value Objects**: Para validar datos en el dominio
- **DTOs**: En Application para los contratos
- **Repositories**: En Infrastructure para acceso a datos
- **Use Cases**: En Application para orquestar
- **Guards**: Para autenticación y autorización
- **Filters**: Para manejo de errores
- **Interceptors**: Para transformar respuestas

## Debugging

### Con VS Code

En `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "NestJS",
      "program": "${workspaceFolder}/node_modules/@nestjs/cli/bin/nest.js",
      "args": ["start", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

Luego `F5`.

### Con console

```typescript
console.log('Debug:', JSON.stringify(objeto, null, 2));
```

## IDE Setup (VS Code)

Extensiones recomendadas:

- ESLint
- Prettier
- Jest Runner
- Prisma
- Thunder Client (o Postman)

---

[← Volvé a Documentación](../README.md) | [Testing →](testing.md)
