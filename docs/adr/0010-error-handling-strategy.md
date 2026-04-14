# ADR-0010: Estrategia de Manejo de Errores

## Contexto
Errores pueden originarse en:
- Dominio
- Aplicación
- Infraestructura

Se requiere consistencia en respuestas HTTP.

## Decisión
- Definir errores de dominio
- Mapearlos con AllExceptionsFilter
- Respuesta estándar:

{
data,
message,
statusCode
}

## Consecuencias

### Positivas
+ Consistencia en API
+ Mejor DX
+ Separación de responsabilidades

### Negativas
- Necesidad de mantener mappings