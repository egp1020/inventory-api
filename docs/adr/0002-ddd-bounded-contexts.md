# ADR-0002: Uso de Domain-Driven Design (DDD)

## Contexto
El dominio de inventario tiene múltiples subdominios:
- Productos
- Movimientos
- Bodegas
- Reportes

Se necesita separar responsabilidades y lenguaje.

## Decisión
Organizar el sistema en módulos como Bounded Contexts:

- Auth
- Users
- Warehouses
- Products
- Movements
- Reports

Cada uno con su propio modelo y lógica.

## Consecuencias

### Positivas
+ Mejor organización del dominio
+ Lenguaje ubicuo claro
+ Menor acoplamiento entre módulos

### Negativas
- Mayor esfuerzo de diseño inicial
- Puede haber duplicación controlada de conceptos