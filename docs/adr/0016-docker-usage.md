# ADR-0016: Uso de Docker y Docker Compose

## Contexto
Se requiere consistencia entre entornos:

- Desarrollo
- Testing
- Producción

## Decisión
Usar Docker y Docker Compose para:

- Base de datos
- Aplicación

## Consecuencias

### Positivas
+ Entornos reproducibles
+ Onboarding rápido
+ Menos problemas de configuración

### Negativas
- Overhead en desarrollo
- Curva de aprendizaje para algunos devs