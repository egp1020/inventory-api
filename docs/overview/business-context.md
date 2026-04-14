# Contexto de Negocio

## Qué es el sistema

Un API de gestión de inventario diseñado para empresas con **múltiples bodegas** que necesitan:

- Registrar entradas y salidas de productos en tiempo real
- Conocer el stock actual en cada ubicación
- Recibir alertas cuando algo falta
- Ver historial completo de movimientos (auditoría)

Es un backend robusto, escalable, pensado para integrarse con sistemas de frontend (web, mobile, ERP).

## Para quién es

### Empresas objetivo

- **Distribuidoras**: Múltiples bodegas, muchos productos, flujos de entrada/salida constantes
- **Retail con múltiples sucursales**: Cada sucursal es una bodega
- **Fabricantes**: Control de materias primas y productos terminados en distintas ubicaciones
- **Logística**: Centros de distribución con inventario dinámico

### Usuarios del sistema

1. **Admins**: Gerentes que ven todo. Crean otros usuarios, generan reportes, toman decisiones.
2. **Operators**: Encargados de bodega. Registran movimientos, ven su inventario.

## Problemas que resuelve

### Sin este sistema

- Planillas Excel compartidas (conflictos, errores, sin auditoría)
- Desconoces el stock real (no sabes qué hay hasta contar)
- Reabastecimientos reactivos (se acaba todo, urgencia de comprar)
- Historial perdido (quién cambió qué, cuándo)
- Seguridad débil (cualquiera puede editar, sin control de roles)

### Con este sistema

- Inventario actualizado en segundos
- Stock siempre sincronizado (ENTRADA - SALIDA)
- Alertas automáticas cuando falta algo
- Historial completo y auditable
- Control de acceso por rol
- API robusta para integraciones

## Flujo de negocio típico

### Escenario 1: Entrada de mercadería

1. Llega camión con 100 unidades de Producto X
2. Operator registra: `POST /movements` (ENTRADA, 100 unidades)
3. Sistema calcula nuevo stock: 50 + 100 = 150
4. Historia quedá registrada (cuándo, quién, cantidad)
5. Admin ve en reportes: Stock actualizado

### Escenario 2: Venta (Salida)

1. Cliente compra 30 unidades de Producto X
2. Operator registra: `POST /movements` (SALIDA, 30 unidades)
3. Sistema valida: ¿Hay 30 unidades? Sí. ✓
4. Stock actualiza: 150 - 30 = 120
5. Si stock cae bajo mínimo (20), alerta dispara
6. Admin ve: Bodega Centro está baja en Producto X

### Escenario 3: Transferencia entre bodegas

1. Bodega Centro tiene exceso (200 unidades)
2. Bodega Sur necesita más (stock bajo)
3. Operator Centro registra SALIDA: -50 unidades
4. Operator Sur registra ENTRADA: +50 unidades
5. Movimientos quedan independientes pero vinculados por timestamp/producto

## Conceptos clave de negocio

### Stock dinámico

El stock **nunca** se guarda en base de datos.

Se **calcula** cada vez que se necesita:

```
Stock Actual = Sum(ENTRADA) - Sum(SALIDA) en tiempo real
```

**Ventaja**: Es la fuente de verdad. Si hay inconsistencias en movimientos, el stock las refleja.

### Limites de stock

Cada producto en cada bodega tiene:

- **Mínimo**: Si cae aquí, alarma. Necesitás comprar.
- **Máximo**: Espacio disponible. No podés guardar más.

Ejemplo:
- Producto: Laptop
- Bodega Centro: Min 5 unidades, Max 50
- Stock actual: 8 unidades → ALERTA BAJA
- Si intentás agregar 50 más (tendrías 58) → ERROR, excede máximo

### Tipos de usuarios

**Admin**: Gerente central

- Ve todas las bodegas
- Crea nuevos Operators
- Genera reportes de alertas (información sensible)
- Toma decisiones estratégicas

**Operator**: Encargado de bodega

- Ve solo su bodega asignada
- Registra movimientos de entrada/salida
- No ve alertas ni datos de otras bodegas
- No crea usuarios

## Decisiones de diseño

### Por qué múltiples bodegas

Necesitamos flexibilidad: Mismos productos, ubicaciones distintas, inventarios independientes.

Solución: Product + Warehouse en relación N:M. Mismo SKU en varias bodegas con stock diferente.

### Por qué soft delete

Los registros históricos importan. Nunca borres.

Solución: `deletedAt` campo. Queries excluyen automáticamente.

Ventajas:
- Auditoría completa
- Reversible si fue error
- Cumple regulaciones

### Por qué JWT stateless

Escalabilidad horizontal. Múltiples instancias sin compartir sesiones.

Solución: Tokens que se validan solos. No necesitas BD de sesiones.

### Por qué alertas solo para Admin

Stock bajo es información sensible. Un Operator no debe ver el estado de otras bodegas.

Solución: Endpoint `/reports/alerts` solo ADMIN.

## Requisitos de negocio (funcionales)

1. ✓ Registrar entrada y salida de productos
2. ✓ Consultar stock en tiempo real
3. ✓ Recibir alertas de stock bajo
4. ✓ Ver historial de movimientos
5. ✓ Control de acceso por rol y bodega
6. ✓ Auditoría completa (quién, qué, cuándo)

## Requisitos no-funcionales

- **Confiabilidad**: Nunca pierdas datos
- **Rendimiento**: Stock debe calcularse rápido (índices en BD)
- **Seguridad**: Roles, encriptación de contraseñas
- **Escalabilidad**: Múltiples instancias, sin estado
- **Mantenibilidad**: Código limpio, capas bien definidas

## Métricas de éxito

Cuando la API esté en producción, medir:

- **Disponibilidad**: ¿El sistema está arriba? (apuntar a 99.9%)
- **Latencia**: ¿Cuánto tarda registrar movimiento? (< 200ms)
- **Exactitud**: ¿El stock calculado es correcto?
- **Uso**: ¿Cuántos movimientos por día?
- **Alertas**: ¿Cuántos productos con stock bajo?

---

[← Documentación](../README.md)
