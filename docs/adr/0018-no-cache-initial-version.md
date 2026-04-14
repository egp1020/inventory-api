# ADR-0018: No uso de caché en primera versión

## Contexto
El sistema genera reportes en tiempo real.

Opciones:
- Cachear resultados
- Calcular en cada request

## Decisión
No usar caché inicialmente.

## Consecuencias

### Positivas
+ Simplicidad
+ Datos siempre consistentes
+ Menor complejidad operativa

### Negativas
- Mayor carga en base de datos
- Posibles problemas de performance

## Notas futuras
Evaluar Redis si:
- Aumenta el tráfico
- Reportes se vuelven lentos