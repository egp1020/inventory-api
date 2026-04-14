# ADR-0001: Uso de Arquitectura Hexagonal

## Contexto
El sistema requiere alta mantenibilidad, testabilidad y desacoplamiento entre lógica de negocio y frameworks.

Se busca evitar:
- Acoplamiento a ORM o framework
- Dificultad para testing
- Código difícil de evolucionar

## Decisión
Adoptar Arquitectura Hexagonal (Ports & Adapters) con 4 capas:

- Domain
- Application
- Infrastructure
- Interface

Aplicando regla de dependencias hacia dentro.

## Consecuencias

### Positivas
+ Desacoplamiento total del dominio
+ Alta testabilidad
+ Flexibilidad para cambiar infraestructura
+ Código más mantenible

### Negativas
- Mayor complejidad inicial
- Más archivos y estructura
- Curva de aprendizaje para el equipo