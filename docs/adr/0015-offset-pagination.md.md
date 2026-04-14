# ADR-0015: Uso de paginación offset-based

## Contexto
Se requiere paginar resultados en endpoints:

- Movements
- Reports

Opciones:
- Offset-based
- Cursor-based

## Decisión
Usar paginación offset-based inicialmente.

## Consecuencias

### Positivas
+ Simple de implementar
+ Fácil de entender

### Negativas
- Problemas de performance en grandes volúmenes
- Inconsistencias con datos en cambio

## Notas futuras
Migrar a cursor-based si el volumen crece significativamente.