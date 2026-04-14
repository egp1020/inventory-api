# ADR-0003: Ubicación de DTOs en Application Layer

## Contexto
Los DTOs definen contratos de entrada/salida para casos de uso.

Opciones:
- Interface layer
- Application layer

## Decisión
Ubicar DTOs en `application/dtos/`.

Tipos:
- CommandDto
- ResultDto
- RequestDto
- ResponseDto

## Consecuencias

### Positivas
+ Contratos claros del caso de uso
+ Independencia de HTTP
+ Reutilización en distintos adapters

### Negativas
- Necesidad de mapping adicional en controllers