# Arquitectura

Documentación técnica sobre el diseño y estructura del proyecto.

## Indice

- **[Arquitectura General](architecture.md)** - Visión de 30,000 pies: 4 capas, DDD, decisiones principales
- **[Capas Arquitectónicas](layers.md)** - Profundidad en cada capa con ejemplos de código
- **[Módulos](modules.md)** - Qué hace cada módulo, responsabilidades, endpoints
- **[Esquema de Base de Datos](database-schema.md)** - Tablas, relaciones, soft deletes, índices, cálculo dinámico de stock

## Conceptos Clave

### Arquitectura Hexagonal (Ports & Adapters)

El proyecto está construido en hexágonos: el dominio en el centro, con puertos (interfaces) que adaptan hacia adentro o afuera.

**Ventaja:** El dominio nunca ve las tecnologías (BD, HTTP, etc.).

### Domain-Driven Design (DDD)

Cada módulo es un **Bounded Context** con su propio lenguaje:
- **Auth**: credenciales, tokens, roles
- **Movements**: ENTRADA/SALIDA, stock dinámico
- **Reports**: agregaciones, alertas

No comparten tablas de BD, cada uno es independiente.

### 4 Capas

```
Interface (HTTP)
    ↓
Application (Use Cases)
    ↓
Domain (Pura lógica)
    ↓
Infrastructure (BD, adapters)
```

## Cómo Navegar

**Si necesitás...**

- ✅ Entender la arquitectura general → [Arquitectura General](architecture.md)
- ✅ Ver cómo funcionan las capas → [Capas](layers.md)
- ✅ Saber qué hace cada módulo → [Módulos](modules.md)
- ✅ Entender las tablas de BD → [Database Schema](database-schema.md)
- ✅ Leer decisiones de diseño → [ADR Index](../adr/ADR-INDEX.md)

## Stack Técnico

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: NestJS (DI, Guards, Interceptors)
- **ORM**: Prisma (PostgreSQL)
- **Auth**: JWT (HS256)
- **Validación**: class-validator, class-transformer
- **Testing**: Jest, @nestjs/testing

## Principios

1. **Dominio independiente** - La lógica de negocio no depende de frameworks
2. **Inyección de dependencias** - Todo se inyecta, nada hardcodeado
3. **Puertos y Adapters** - Interfaces bien definidas, fácil cambiar BD/auth/etc
4. **Soft deletes** - Los datos nunca se pierden
5. **Stock dinámico** - Se calcula en query, nunca se almacena

---

[← Documentación](../README.md)
