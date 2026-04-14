# ADR-0007: Implementación de Soft Deletes

## Contexto
Eliminar datos físicamente impide auditoría.

## Decisión
Implementar soft delete usando campo `deletedAt`.

## Consecuencias

### Positivas
+ Preserva historial
+ Permite auditoría
+ Recuperación de datos

### Negativas
- Queries más complejos
- Necesidad de filtros globales