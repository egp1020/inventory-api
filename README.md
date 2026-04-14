# Inventory API

**Sistema de gestión de inventario** para cadena de bodegas con NestJS, Prisma, PostgreSQL y Arquitectura Hexagonal.

Gestiona bodegas, productos, y movimientos de stock (ENTRADA/SALIDA) con reportes en tiempo real, roles (ADMIN/OPERATOR), y soft deletes.

---

## Quick Start

### Con Docker (Recomendado)

```bash
docker-compose up -d
npm run seed
```

API estará en: `http://localhost:3000/api`  
Swagger: `http://localhost:3000/docs`

### Local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar BD (PostgreSQL en otro terminal)
docker run -d --name postgres-inventory \
  -e POSTGRES_USER=inventory_user \
  -e POSTGRES_PASSWORD=inventory_pass_2026 \
  -e POSTGRES_DB=inventory_db \
  -p 5433:5432 postgres:15-alpine

# 3. Crear BD y seed
npx prisma migrate deploy
npm run seed

# 4. Ejecutar
npm run start:dev
```

---

## Documentación Completa

**Todo está en [`docs/README.md`](./docs/README.md)** — tu punto de entrada para:

- **Nuevo aquí?** → [Sistema Overview](./docs/overview/system-overview.md)
- **Quiero probar** → [Flujo Completo (tutorial)](./docs/guides/getting-started-workflow.md)
- **Soy desarrollador** → [Guía de Desarrollo](./docs/guides/development.md)
- **Algo no funciona** → [Troubleshooting](./docs/guides/troubleshooting.md)
- **Voy a producción** → [Deployment](./docs/guides/deployment.md)
- **Quiero aportar** → [Contribuir](./docs/guides/contributing.md)
- **Arquitectura** → [Hexagonal + DDD](./docs/architecture/architecture.md)
- **API** → [6 Controladores documentados](./docs/api/overview.md)

---

## Comandos Principales

```bash
# Desarrollo
npm run start:dev          # Watch mode
npm run start:debug        # Con debugging (puerto 9229)
npm run lint               # ESLint + fix

# Testing
npm test                   # Jest
npm run test:watch         # TDD mode
npm run test:cov           # Cobertura

# Base de Datos
npx prisma studio         # GUI para BD
npx prisma migrate dev    # Nueva migración
npm run seed              # Datos de demo

# Build
npm run build              # TypeScript → JavaScript
npm start                  # Ejecutar (compilado)
```

---

## 🏗Arquitectura

**4 capas** (Hexagonal + DDD):

```
Interface (HTTP Controllers)
    ↓
Application (Use Cases)
    ↓
Domain (Pure Business Logic)
    ↓
Infrastructure (BD, Auth, etc)
```

Cada módulo es independiente: `auth/`, `users/`, `warehouses/`, `products/`, `movements/`, `reports/`.

**Ver más**: [`docs/architecture/architecture.md`](./docs/architecture/architecture.md)

---

## Autenticación & Roles

**JWT Stateless**: Login → Access Token (15 min) + Refresh Token (7 días)

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Todo: ver todas bodegas, crear usuarios, generar alertas |
| **OPERATOR** | Su bodega: registrar movimientos, ver stock, historial |

**Matriz completa**: [`docs/api/authentication.md`](./docs/api/authentication.md)

---

## Stack Técnico

- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS 10
- **Lenguaje**: TypeScript (strict mode)
- **ORM**: Prisma 5 + PostgreSQL 15
- **Auth**: JWT + Passport.js
- **Testing**: Jest (60%+ cobertura)
- **Docker**: Docker Compose

---

## Características Clave

✓ **Soft Deletes** — datos nunca se pierden (auditoría completa)  
✓ **Stock Dinámico** — calculado en query, nunca almacenado  
✓ **Transacciones ACID** — consistencia garantizada  
✓ **Reportes en Tiempo Real** — stock, alertas, historial  
✓ **Validación Exhaustiva** — class-validator + Value Objects  
✓ **Error Handling Coherente** — respuestas JSON estándar  
✓ **Swagger/OpenAPI** — docs automática en `/docs`  

---

## Estructura del Proyecto

```
src/
├── shared/                 # Filtros globales, guards, interceptores
├── modules/
│   ├── auth/              # Autenticación (login, refresh token)
│   ├── users/             # CRUD usuarios
│   ├── warehouses/        # CRUD bodegas
│   ├── products/          # CRUD productos
│   ├── movements/         # Registrar ENTRADA/SALIDA
│   └── reports/           # Stock, alertas, historial (CQRS)
└── main.ts

prisma/
├── schema.prisma          # Modelos de BD
└── migrations/            # Historial de cambios

docs/                       # Documentación completa
└── README.md              # ← Empezá por acá
```

---

## Testing

```bash
# Unitarios (use cases, domain)
npm test src/modules/movements/application/use-cases

# Cobertura
npm run test:cov

# Con watch
npm run test:watch
```

**Convención**: 1 spec file por use-case/entity.

---

## Decisiones de Diseño Principales

1. **DTOs en application/** — definen contrato de use-case
2. **Symbols para DI** — evita typos en tokens de inyección
3. **Value Objects** — validación en dominio, no en DTOs
4. **Transacciones Prisma** — garantiza atomicidad
5. **Stock dinámico** — single source of truth desde movimientos
6. **Soft deletes** — conserva auditoría e historial

**Ver todos**: [`docs/adr/ADR-INDEX.md`](./docs/adr/ADR-INDEX.md)

---

## Supuestos Implementados

- UUID v4 para todos los IDs
- Fechas ISO 8601 en UTC
- OPERATOR asignado a 1 sola bodega
- No se puede eliminar producto con movimientos (422)
- GET /reports/alerts: solo ADMIN (información sensible)
- Contraseñas: bcrypt con 10+ salt rounds

---

## Limitaciones Conocidas

- Sin caché (reportes calculados en cada request)
- Paginación offset-based (no cursor)
- Sin búsqueda full-text en productos
- Sin webhooks/notificaciones en tiempo real
- Sin auditoría detallada de cambios de campos

---

## Contribuir

1. Fork del repositorio
2. Rama desde `develop`: `git checkout -b feature/tu-feature develop`
3. Commits con Conventional Commits: `feat(x): ...`, `fix(x): ...`
4. PR a `develop` (no `main`)

**Guía completa**: [`docs/guides/contributing.md`](./docs/guides/contributing.md)

---

## Documentación

- **`docs/README.md`** — Hub central (empezá por acá)
- **`docs/overview/`** — Qué es, contexto de negocio
- **`docs/architecture/`** — Cómo está construido
- **`docs/api/`** — 6 controladores + autenticación
- **`docs/guides/`** — Setup, desarrollo, testing, troubleshooting
- **`docs/flows/`** — Procesos (auth, movimientos, reportes)
- **`docs/adr/`** — Decisiones arquitectónicas

---

## Licencia

MIT © 2026 Estefanía Garcés Pérez

Ver [LICENSE](./LICENSE) para más detalles.

---

**Última actualización**: Abril 14, 2026
