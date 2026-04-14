# ADR-0006: Uso de Transacciones con Prisma

## Contexto
Operaciones como movimientos de stock requieren atomicidad.

Riesgos:
- Inconsistencia de datos
- Condiciones de carrera

## Decisión
Usar `prisma.$transaction` en operaciones críticas.

## Consecuencias

### Positivas
+ Consistencia garantizada
+ Atomicidad
+ Seguridad en concurrencia

### Negativas
- Overhead en operaciones simples
- Mayor complejidad en debugging