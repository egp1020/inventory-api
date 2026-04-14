# ADR-0009: Role-Based Authorization

## Contexto
El sistema tiene roles:
- ADMIN
- OPERATOR

Se requiere control de acceso.

## Decisión
Implementar autorización con:
- JWT
- Guards
- Decorador @Roles()

## Consecuencias

### Positivas
+ Seguridad clara y declarativa
+ Fácil extensión

### Negativas
- Lógica distribuida en controllers