# ADR-0017: Arquitectura modular monolítica

## Contexto
El sistema podría evolucionar a microservicios, pero inicialmente:

- Equipo pequeño/mediano
- Dominio acoplado
- Necesidad de rapidez

## Decisión
Implementar un monolito modular:

- Módulos desacoplados (bounded contexts)
- Dentro de una sola aplicación

## Consecuencias

### Positivas
+ Simplicidad operativa
+ Menor complejidad de despliegue
+ Comunicación directa entre módulos

### Negativas
- Escalabilidad limitada comparado con microservicios
- Riesgo de acoplamiento si no se respeta arquitectura