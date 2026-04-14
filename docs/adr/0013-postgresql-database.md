# ADR-0013: Uso de PostgreSQL como base de datos

## Contexto
Se requiere:
- Integridad relacional
- Consistencia
- Buen soporte para queries complejas

## Decisión
Usar PostgreSQL como base de datos principal.

## Consecuencias

### Positivas
+ Soporte ACID
+ Excelente para relaciones
+ Buen rendimiento en queries complejas

### Negativas
- Mayor complejidad operativa que NoSQL
- Escalado horizontal más complejo