# ADR-0004: Uso de Symbol para Dependency Injection

## Contexto
NestJS permite usar strings como tokens de inyección, pero esto puede causar:

- Errores por typos
- Problemas en refactoring

## Decisión
Usar `Symbol()` como tokens de inyección.

## Consecuencias

### Positivas
+ Seguridad en tiempo de desarrollo
+ Evita colisiones de nombres
+ Mejor refactorización

### Negativas
- Menor legibilidad inicial