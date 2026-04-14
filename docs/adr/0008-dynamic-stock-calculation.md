# ADR-0008: Cálculo Dinámico de Stock

## Contexto
Opciones:
1. Guardar stock como campo
2. Calcular desde movimientos

## Decisión
Calcular stock dinámicamente:

stock = entradas - salidas

## Consecuencias

### Positivas
+ Single source of truth
+ Evita desincronización
+ Mayor integridad

### Negativas
- Costo en performance
- Necesidad de índices