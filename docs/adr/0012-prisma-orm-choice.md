# ADR-0012: Uso de Prisma como ORM

## Contexto
Se requiere un ORM para interactuar con PostgreSQL.

Opciones consideradas:
- TypeORM
- Sequelize
- Prisma

## Decisión
Usar Prisma como ORM principal.

## Consecuencias

### Positivas
+ Tipado fuerte (TypeScript)
+ DX excelente
+ Migraciones claras
+ Query builder moderno

### Negativas
- Menor flexibilidad que ORMs tradicionales
- Dependencia de generación de cliente
- Abstracción que puede ocultar SQL complejo