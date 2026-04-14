# Architecture Decision Records (ADR)

Este directorio contiene todas las decisiones arquitectónicas del sistema.

## ¿Qué es un ADR?

Un ADR documenta una decisión importante de arquitectura, incluyendo:
- Contexto
- Decisión tomada
- Consecuencias

---

## Índice de ADRs

### Arquitectura

- [ADR-0001: Arquitectura Hexagonal](0001-hexagonal-architecture.md)
- [ADR-0002: DDD y Bounded Contexts](0002-ddd-bounded-contexts.md)
- [ADR-0017: Monolito Modular](0017-modular-monolith.md)
- [ADR-0011: CQRS en Reports](0011-cqrs-reports-module.md)

---

### Diseño y Patrones

- [ADR-0003: DTOs en Application Layer](0003-dtos-in-application-layer.md)
- [ADR-0004: Symbol Tokens para DI](0004-symbol-tokens-di.md)
- [ADR-0005: Value Objects para validación](0005-value-objects-validation.md)
- [ADR-0010: Estrategia de Manejo de Errores](0010-error-handling-strategy.md)

---

### Datos

- [ADR-0006: Transacciones con Prisma](0006-prisma-transactions.md)
- [ADR-0007: Soft Deletes](0007-soft-deletes.md)
- [ADR-0008: Cálculo dinámico de stock](0008-dynamic-stock-calculation.md)
- [ADR-0013: PostgreSQL como base de datos](0013-postgresql-database.md)
- [ADR-0015: Paginación offset](./0015-offset-pagination.md)
- [ADR-0018: Sin caché inicial](0018-no-cache-initial-version.md)

---

### Seguridad

- [ADR-0009: Autorización basada en roles](0009-role-based-authorization.md)
- [ADR-0014: Autenticación con JWT](0014-jwt-authentication.md)

---

### Infraestructura

- [ADR-0012: Uso de Prisma ORM](0012-prisma-orm-choice.md)
- [ADR-0016: Uso de Docker](0016-docker-usage.md)

---

### Convenciones

- Los ADRs son **inmutables** (no se editan, se reemplazan por nuevos)
- Cada ADR tiene un **ID incremental**
- Se escriben en formato Markdown
- Se crean cuando hay decisiones importantes

---

## Cómo agregar un nuevo ADR

1. Crear archivo: `00XX-nombre-decision.md`
2. Seguir la plantilla estándar
3. Agregarlo a este índice