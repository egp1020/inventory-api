# ADR-0011: Uso de CQRS para el módulo de Reports

## Contexto
El sistema requiere consultas complejas de lectura (reportes) que no afectan el estado:

- Stock actual por bodega
- Alertas de bajo inventario
- Historial de movimientos

Estas consultas:
- Son intensivas en lectura
- No modifican datos
- Tienen lógica distinta a comandos

## Decisión
Aplicar CQRS de forma parcial:

- Commands → módulos normales (Products, Movements)
- Queries → módulo Reports (solo lectura)

Sin separación física de base de datos.

## Consecuencias

### Positivas
+ Separación clara entre lectura y escritura
+ Optimización independiente de queries
+ Código más claro para reporting

### Negativas
- Duplicación de lógica de consulta
- No es CQRS completo (sin event sourcing)