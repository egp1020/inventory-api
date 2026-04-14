# ADR-0005: Validación en Value Objects

## Contexto
La validación puede ubicarse en:
- DTOs
- Base de datos
- Dominio

Se busca mantener reglas de negocio consistentes.

## Decisión
Mover validaciones críticas al dominio usando Value Objects.

Ejemplo: SKU

## Consecuencias

### Positivas
+ Reglas de negocio centralizadas
+ Mayor consistencia
+ Dominio rico

### Negativas
- Más clases y complejidad
- Duplicación parcial con validaciones HTTP