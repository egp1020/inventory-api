# Visión del Sistema

## Qué es

Inventory API es un sistema REST para gestionar inventario en cadenas de bodegas. Te permite:

- **Registrar movimientos**: Entradas (ENTRADA) y salidas (SALIDA) de productos
- **Consultar stock**: Qué hay en cada bodega, en tiempo real
- **Generar reportes**: Alertas de stock bajo, historial de movimientos
- **Controlar acceso**: Usuarios con roles (ADMIN / OPERATOR)

## Para quién

- **Empresas con múltiples bodegas**: Para controlar inventario distribuido
- **Operadores**: Registran movimientos en su bodega asignada
- **Administradores**: Ven todo, generan reportes

## Cómo funciona (en 30 segundos)

1. Te logueás y obtenes un token
2. Registrás un movimiento (entrada/salida) de productos
3. El sistema valida que haya stock suficiente
4. Consultás reportes para saber qué hay en cada bodega

## Stack técnico

- **Backend**: Node.js 20, NestJS 10, TypeScript
- **Base de datos**: PostgreSQL 15
- **ORM**: Prisma 5
- **Autenticación**: JWT
- **Contenedores**: Docker

## Módulos principales

- **Auth**: Login y manejo de tokens
- **Movements**: Registrar entradas/salidas
- **Reports**: Reportes y alertas
- **Warehouses**: Gestión de bodegas
- **Products**: Catálogo de productos
- **Users**: Gestión de usuarios

Ver más en [`Arquitectura`](../architecture/overview.md).

## Base de datos

4 modelos principales:

- **User**: Usuarios con roles y bodegas asignadas
- **Warehouse**: Bodegas con capacidad máxima
- **Product**: Productos con SKU único
- **StockMovement**: Historial de todos los movimientos

## Supuestos clave

- UUID v4 para todos los IDs
- Stock se calcula dinámicamente (ENTRADA - SALIDA)
- Un OPERATOR está asignado a una sola bodega
- Los datos borrados se marcan, no se eliminan físicamente

Ver glosario en [`Glosario`](glossary.md).

---

[← Volvé a Documentación](../README.md)
