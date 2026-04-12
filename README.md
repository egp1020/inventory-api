# 📦 Inventory API

**Sistema de gestión de inventario para cadena de bodegas** con NestJS, Prisma, PostgreSQL y Arquitectura Hexagonal.

---

## 🏗️ Arquitectura

La aplicación sigue **Arquitectura Hexagonal (Ports & Adapters)** combinada con **DDD (Domain-Driven Design)** mediante Bounded Contexts por módulo.

### Estructura de Capas

Cada módulo funcional se organiza en **4 capas**:

```
src/
├── shared/                  # Código compartido (filtros, interceptores)
├── auth/
│   ├── domain/             # Entidades, Value Objects, Puertos (sin dependencias de frameworks)
│   ├── application/        # Use Cases, DTOs, Interfaces de puertos
│   ├── infrastructure/     # Adaptadores (JWT, Bcrypt), Estrategias de Passport
│   └── interface/          # Controllers HTTP, DTOs de requests/responses
├── users/                  # Igual estructura
├── warehouses/             # Igual estructura
├── products/               # Igual estructura
├── movements/              # Igual estructura
└── reports/                # Sin domain (solo lectura)
    ├── application/
    ├── infrastructure/
    └── interface/
```

#### Reglas de Dependencias
- **domain/**: No importa nada externo. Solo lógica pura de negocio.
- **application/**: Depende únicamente de `domain/`. Implementa Use Cases.
- **infrastructure/**: Implementa los puertos definidos en `domain/`. Puede usar Prisma, librerías externas.
- **interface/**: Depende solo de `application/`. Expone endpoints HTTP.

**La regla de oro**: Las capas internas **nunca** importan de las externas.

---

## 🔧 Stack Técnico

- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript (strict mode)
- **ORM**: Prisma 5.x
- **BD**: PostgreSQL 15+
- **Autenticación**: JWT + Passport.js
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger (OpenAPI 3.0)
- **Testing**: Jest (60%+ cobertura de use-cases)
- **Contenedores**: Docker + Docker Compose

---

## 🚀 Instalación y Ejecución

### 1. **Clonar el Repositorio**

```bash
git clone <repo-url>
cd inventory-api
```

### 2. **Instalar Dependencias**

```bash
pnpm install
# O si usas npm:
npm install
```

### 3. **Configurar Variables de Entorno**

```bash
cp .env.example .env
```

**Valores por defecto en `.env`** (ya configurados para desarrollo):

```env
DATABASE_URL=postgresql://inventory_user:inventory_pass_2026@localhost:5433/inventory_db
PORT=3000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_REFRESH_SECRET=super_secret_refresh_key_change_this_in_production_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. **Opción A: Con Docker Compose** (Recomendado)

```bash
docker-compose up -d
npm run seed    # Ejecutar seed de datos
```

La app estará en:
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

### 5. **Opción B: En Desarrollo Local**

#### 5.1 Levantar PostgreSQL

```bash
docker run -d \
  --name postgres-inventory \
  -e POSTGRES_USER=inventory_user \
  -e POSTGRES_PASSWORD=inventory_pass_2026 \
  -e POSTGRES_DB=inventory_db \
  -p 5433:5432 \
  postgres:15-alpine
```

#### 5.2 Crear Base de Datos y Aplicar Migraciones

```bash
# Primera vez: crear migración
npx prisma migrate dev --name init

# Desde aquí en adelante: aplicar migraciones existentes
npx prisma migrate deploy
```

#### 5.3 Ejecutar Seed

```bash
npm run seed
```

#### 5.4 Iniciar la Aplicación

```bash
npm run start:dev
```

La app estará en `http://localhost:3000/api`.

---

## 📋 Comandos Principales

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo watch
npm run build              # Compilar TypeScript
npm test                   # Ejecutar tests
npm run test:cov           # Tests con cobertura
npm run seed               # Popular BD con datos iniciales
npm run lint               # ESLint + autofix

# Documentación
npm run build && npm start # Build + Producción

# Base de Datos
npx prisma studio         # Interfaz visual para Prisma
npx prisma migrate dev     # Crear nueva migración
npx prisma migrate deploy  # Aplicar migraciones (producción)
```

---

## 🔐 Autenticación y Autorización

### Flujo de Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  },
  "message": "Login exitoso",
  "statusCode": 200
}
```

### Usar Token en Requests

```bash
curl -H "Authorization: Bearer <accessToken>" http://localhost:3000/api/products
```

### Refresh Token

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Roles y Permisos

| Endpoint | ADMIN | OPERATOR | Público |
|----------|-------|----------|---------|
| `POST /auth/login` | ✓ | ✓ | ✓ |
| `POST /users` | ✓ | ✗ | ✗ |
| `GET /warehouses` | ✓ | ✗ | ✗ |
| `POST /movements` | ✓ | ✓* | ✗ |
| `GET /products` | ✓ | ✓ | ✗ |
| `GET /reports/stock/:id` | ✓ | ✓ | ✗ |
| `GET /reports/alerts` | ✓ | ✗ | ✗ |

*OPERATOR solo en su bodega asignada.

---

## 🌱 Seed de Datos

El script `npm run seed` carga:

- **1 usuario ADMIN**
  - Email: `admin@example.com`
  - Contraseña: `admin123`

- **1 usuario OPERATOR**
  - Email: `operator@example.com`
  - Contraseña: `operator123`
  - Asignado a: Almacén Central

- **2 bodegas activas**
  - Almacén Central (10,000 unidades)
  - Almacén Regional (5,000 unidades)

- **5 productos** con SKU válido
  - LAPTOP001, MONITOR-27, TECLADO001, MOUSE-WIRELESS, CABLE-HDMI-2

- **9 movimientos** de stock
  - 6 entradas iniciales
  - 3 salidas para generar historial

---

## 📚 API Endpoints

### Autenticación

```
POST   /api/auth/login          # Login con email y contraseña
POST   /api/auth/refresh        # Renovar access token
```

### Usuarios (ADMIN)

```
GET    /api/users               # Listar usuarios (paginado)
POST   /api/users               # Crear usuario
PATCH  /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Soft delete
```

### Bodegas (ADMIN)

```
GET    /api/warehouses          # Listar bodegas activas
POST   /api/warehouses          # Crear bodega
GET    /api/warehouses/:id      # Detalle de bodega
PATCH  /api/warehouses/:id      # Actualizar
DELETE /api/warehouses/:id      # Soft delete
```

### Productos

```
GET    /api/products            # Listar (autenticado)
POST   /api/products            # Crear (ADMIN)
GET    /api/products/:id        # Detalle (autenticado)
PATCH  /api/products/:id        # Actualizar (ADMIN)
DELETE /api/products/:id        # Soft delete si no tiene movimientos (ADMIN)
```

### Movimientos

```
POST   /api/movements           # Registrar movimiento (ENTRADA/SALIDA)
GET    /api/movements           # Listar con filtros y paginación (ADMIN)
```

**Query params para GET /api/movements**:
```
?productId=<uuid>
&warehouseId=<uuid>
&type=ENTRADA|SALIDA
&startDate=2026-04-01T00:00:00Z
&endDate=2026-04-30T23:59:59Z
&page=1
&limit=10
```

### Reportes

```
GET    /api/reports/stock/:warehouseId       # Stock actual por bodega
GET    /api/reports/alerts                   # Productos bajo stock mínimo (ADMIN)
GET    /api/reports/movements/:productId     # Histórico de movimientos (ADMIN)
```

**Query params para GET /api/reports/movements/:productId**:
```
?warehouseId=<uuid>
&type=ENTRADA|SALIDA
&startDate=2026-04-01
&endDate=2026-04-30
&page=1
&limit=10
```

---

## 🧪 Testing

### Cobertura

El proyecto incluye **49+ tests unitarios** con cobertura mínima de **60%** en use-cases:

```bash
npm test                  # Ejecutar todos los tests
npm run test:cov         # Ver reporte de cobertura
npm run test:watch       # Watch mode para desarrollo
```

### Test Suites por Módulo

| Módulo | Tests | Archivos |
|--------|-------|----------|
| Auth | 4 | login.spec.ts, refresh-token.spec.ts |
| Users | 3 | create-user.spec.ts |
| Warehouses | 6 | create, get, list |
| Products | 7 | create, get, list |
| Movements | 9 | register, list, validation |
| Reports | 12 | stock, alerts, history |
| **Total** | **49** | 14 test files |

### Patrón de Testing

```typescript
describe('UseCase', () => {
  let useCase: SomeUseCase;
  let mockRepository: Partial<IRepository>;

  beforeEach(() => {
    mockRepository = { method: jest.fn() };
    useCase = new SomeUseCase(mockRepository as IRepository);
  });

  it('should handle happy path', async () => {
    const result = await useCase.execute(input);
    expect(result).toBeDefined();
    expect(mockRepository.method).toHaveBeenCalled();
  });
});
```

---

## 🗄️ Base de Datos

### Esquema Prisma

El `prisma/schema.prisma` define:

- **User**: Usuarios con roles ADMIN/OPERATOR
- **Warehouse**: Bodegas con capacidad máxima
- **Product**: Productos con SKU único
- **StockMovement**: Historial de entradas/salidas

### Soft Deletes

Todos los modelos principales soportan soft delete mediante campo `deletedAt`:

```prisma
model Product {
  id        String    @id @default(uuid())
  sku       String    @unique
  name      String
  deletedAt DateTime? @map("deleted_at")
}
```

Los queries automáticamente filtran registros donde `deletedAt` sea null.

### Índices para Reportes

Se han añadido índices para optimizar queries de reportes:

```prisma
model StockMovement {
  @@index([productId])
  @@index([warehouseId])
  @@index([userId])
  @@index([createdAt])
  @@index([type])
}
```

**Justificación**:
- `productId`: Filtrado frecuente en reportes por producto
- `warehouseId`: Listado de movimientos por bodega
- `userId`: Auditoría de qué usuario registró cada movimiento
- `createdAt`: Ordenamiento cronológico y filtros por rango de fechas
- `type`: Filtrado rápido por ENTRADA/SALIDA

---

## 🎯 Decisiones de Diseño

### 1. **DTOs en application/**

Los DTOs se ubican en `application/dtos/`:

- **CommandDto**: Entrada a use-cases
- **ResultDto**: Salida de use-cases
- **RequestDto**: Mapeo de HTTP request → CommandDto
- **ResponseDto**: Mapeo de ResultDto → HTTP response

**Razón**: Los DTOs definen el contrato de lo que el Caso de Uso necesita.

### 2. **Symbol Tokens para Inyección**

Se usan `Symbol()` en lugar de strings para tokens de inyección:

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

**Razón**: Evita errores por typos y mejora refactoring.

### 3. **Value Objects para Validación**

Entidades de dominio usan Value Objects con lógica de validación:

```typescript
export class SKU {
  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new SKUError('SKU inválido');
    }
  }
  
  private isValid(value: string): boolean {
    return /^[A-Z0-9-]{4,20}$/.test(value);
  }
}
```

**Razón**: La validación vive en el dominio, no en DTOs.

### 4. **Transacciones Prisma**

Todas las operaciones críticas usan `prisma.$transaction`:

```typescript
await this.prisma.$transaction(async (prisma) => {
  await prisma.stockMovement.create({ data });
});
```

**Razón**: Garantiza atomicidad y consistencia de datos.

### 5. **Soft Deletes**

Se marca `deletedAt` en lugar de eliminar:

```typescript
await prisma.product.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

**Razón**: Conserva auditoría e historial.

### 6. **Cálculo Dinámico de Stock**

El stock se calcula desde el historial de movimientos:

```typescript
const entradas = sum(type == 'ENTRADA')
const salidas = sum(type == 'SALIDA')
stock = entradas - salidas
```

**Razón**: Single source of truth; evita desincronizaciones.

---

## 🚨 Manejo de Errores

### Errores de Dominio

Se definen en `domain/errors/`:

```typescript
export class InsufficientStockError extends DomainError {
  constructor(
    readonly productId: string,
    readonly available: number,
    readonly required: number,
  ) {
    super(`Stock insuficiente: ${available}, solicitado ${required}`);
  }
}
```

### AllExceptionsFilter Global

El filtro mapea errores a respuestas HTTP coherentes:

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof InsufficientStockError) {
      response.status(422).json({
        data: null,
        message: exception.message,
        statusCode: 422,
      });
    }
  }
}
```

### Respuestas JSON Estandarizadas

```json
{
  "data": null | object | array,
  "message": "Descripción",
  "statusCode": 200 | 201 | 400 | 401 | 404 | 422 | 500
}
```

---

## 🔄 CI/CD y Despliegue

### Build para Producción

```bash
npm run build
NODE_ENV=production npm start
```

### Docker

```bash
docker build -t inventory-api:latest .
docker run -e DATABASE_URL=... -p 3000:3000 inventory-api:latest
```

### Migraciones

En producción, usar `prisma migrate deploy` (no `db push`):

```bash
npx prisma migrate deploy
```

---

## 📋 Limitaciones y Supuestos

### Supuestos Implementados

1. **UUID v4** para todos los IDs
2. **Fechas en UTC** (ISO 8601)
3. **Soft delete** para bodegas y productos
4. **No se puede eliminar producto con movimientos** → HTTP 422
5. **Stock dinámico** calculado desde movimientos
6. **OPERATOR asignado a 1 sola bodega**
7. **Contraseñas**: bcrypt con 10+ salt rounds

### Limitaciones Conocidas

1. Sin caché: Reportes se calculan en cada llamada
2. Paginación offset-based (no cursor-based)
3. Sin búsqueda full-text en productos
4. Sin webhooks o notificaciones en tiempo real
5. Sin auditoría detallada de cambios de campos

---

## ✅ Checklist de Cumplimiento

- [x] Arquitectura Hexagonal en todos los módulos
- [x] 49+ tests unitarios (>60% cobertura)
- [x] Swagger documentado
- [x] Soft deletes funcionales
- [x] Transacciones Prisma
- [x] Seed ejecutable
- [x] Migraciones Prisma
- [x] Docker + Docker Compose
- [x] .env.example documentado
- [x] Manejo de errores global
- [x] Validación en DTOs
- [x] JWT con access + refresh
- [x] Roles ADMIN/OPERATOR
- [x] Reportes con filtros
- [x] README completo

---

**Última actualización**: 11 de Abril, 2026
