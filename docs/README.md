# Documentación - Inventory API

Bienvenido. Acá encontrás todo lo que necesitás para entender, usar y desarrollar el sistema.

## Índice rápido

Elegí tu punto de entrada:

- **Nuevo en el proyecto?** → [Sistema - Visión general](overview/system-overview.md)
- **Quiero empezar ya** → [Setup - Instalación](guides/setup.md)
- **Soy desarrollador** → [Desarrollo - Guía práctica](guides/development.md)
- **Necesito APIs** → [API - Controladores](api/overview.md)
- **Quiero entender el diseño** → [Arquitectura](architecture/architecture.md)
- **Estoy integrado?** → [Flujo Completo - Tutorial](guides/getting-started-workflow.md)
- **Algo falla?** → [Troubleshooting](guides/troubleshooting.md)

## Secciones principales

### Overview (Contexto)
Qué es el sistema, para quién, cómo funciona.

- [Sistema - Visión general](overview/system-overview.md) - Descripción, tecnología, módulos, base de datos
- [Contexto de negocio](overview/business-context.md) - Por qué existe, problemas que resuelve, flujos típicos
- [Glosario](overview/glossary.md) - Términos clave: ENTRADA, SALIDA, bodega, stock, roles, etc.

### Arquitectura (Técnica)
Cómo está construido y por qué.

- [Arquitectura general](architecture/architecture.md) - 4 capas, DDD, Value Objects, Aggregates, decisiones de diseño
- [Capas arquitectónicas](architecture/layers.md) - Detalle de cada capa con ejemplos de código
- [Módulos](architecture/modules.md) - Qué hace cada módulo, responsabilidades, endpoints
- [Esquema de BD](architecture/database-schema.md) - Tablas, relaciones, soft deletes, cálculo de stock

### API (Integración)
Endpoints, autenticación, ejemplos.

- [API - Visión general](api/overview.md) - Base URL, autenticación, códigos HTTP, tabla de controladores
- [Autenticación](api/authentication.md) - JWT, login, refresh token, roles y permisos
- [Errores](api/errors.md) - Códigos de error con soluciones

**Controladores (detalle por endpoint):**
- [Auth Controller](api/auth-controller.md) - Login, refresh token
- [Users Controller](api/users-controller.md) - Gestión de usuarios
- [Warehouses Controller](api/warehouses-controller.md) - Gestión de bodegas
- [Products Controller](api/products-controller.md) - Gestión de productos
- [Movements Controller](api/movements-controller.md) - Registrar entrada/salida
- [Reports Controller](api/reports-controller.md) - Reportes de stock

### Guías Prácticas
Cómo hacer cosas.

- [Setup - Empezar](guides/setup.md) - Instalación local y con Docker
- [Desarrollo](guides/development.md) - Estructura, comandos, cómo agregar features
- [Testing](guides/testing.md) - Cómo correr tests, ejemplos, mocking, coverage
- [Deployment](guides/deployment.md) - Build para producción, variables, base de datos, monitoring
- [Flujo Completo](guides/getting-started-workflow.md) - Tutorial step-by-step: login, crear bodega, registrar stock, ver reportes
- [Troubleshooting](guides/troubleshooting.md) - Errores comunes, soluciones, debugging
- [Contribuir](guides/contributing.md) - Convenciones, cómo contribuir, proceso de PR

### Flujos (Procesos)
Cómo funcionan los procesos clave.

- [Autenticación](flows/auth-flow.md) - Login, JWT, refresh token
- [Movimiento de stock](flows/stock-movement-flow.md) - ENTRADA/SALIDA, cálculo dinámico
- [Ciclo de productos](flows/product-lifecycle-flow.md) - Creación, stock, edición
- [Bodegas](flows/warehouse-flow.md) - Creación, asignación de OPERATOR
- [Reportes](flows/reports-flow.md) - Stock, alertas, historial

### ADRs (Decisiones)
Por qué tomamos cada decisión técnica.

- [ADR Index](adr/ADR-INDEX.md) - Lista de todas las decisiones registradas

Decisiones clave:
- [0001: Hexagonal Architecture](adr/0001-hexagonal-architecture.md)
- [0002: DDD Bounded Contexts](adr/0002-ddd-bounded-contexts.md)
- [0008: Dynamic Stock Calculation](adr/0008-dynamic-stock-calculation.md)
- [0011: CQRS - Reports Module](adr/0011-cqrs-reports-module.md)
- [0014: JWT Authentication](adr/0014-jwt-authentication.md)

Ver todas en [ADR Index](adr/ADR-INDEX.md).

## Navegación rápida

| Necesito... | Ir a... |
|---|---|
| Instalar localmente | [Setup](guides/setup.md) |
| Correr tests | [Testing](guides/testing.md) |
| Agregar una feature | [Desarrollo - Feature Guide](guides/development.md) |
| Usar la API | [Auth Controller](api/auth-controller.md) |
| Tutorial práctico | [Flujo Completo](guides/getting-started-workflow.md) |
| Tengo un error | [Troubleshooting](guides/troubleshooting.md) |
| Contribuir código | [Guía de Contribución](guides/contributing.md) |
| Integrar en Postman | [API - Overview](api/overview.md) |
| Entender el diseño | [Arquitectura](architecture/architecture.md) |
| Ver esquema BD | [Database Schema](architecture/database-schema.md) |
| Deployar | [Deployment](guides/deployment.md) |
| Ver términos clave | [Glosario](overview/glossary.md) |
| Leer decisiones | [ADR Index](adr/ADR-INDEX.md) |

## Estructura de directorios

```
docs/
├── README.md (este archivo - hub central)
│
├── overview/ (contexto)
│   ├── system-overview.md
│   ├── business-context.md
│   └── glossary.md
│
├── architecture/ (técnica)
│   ├── architecture.md
│   ├── layers.md
│   ├── modules.md
│   └── diagrams.md
│
├── api/ (integración)
│   ├── overview.md
│   ├── authentication.md
│   ├── errors.md
│   ├── auth-controller.md
│   ├── users-controller.md
│   ├── warehouses-controller.md
│   ├── products-controller.md
│   ├── movements-controller.md
│   └── reports-controller.md
│
├── guides/ (cómo hacer)
│   ├── setup.md
│   ├── development.md
│   ├── testing.md
│   └── deployment.md
│
├── flows/ (procesos)
│   ├── auth-flow.md
│   ├── stock-movement-flow.md
│   ├── product-lifecycle-flow.md
│   ├── warehouse-flow.md
│   └── reports-flow.md
│
└── adr/ (decisiones)
    ├── ADR-INDEX.md
    ├── 0001-hexagonal-architecture.md
    └── ... (18 archivos)
```

## Convenciones

- **Español conversacional**: Natural, sin artificios
- **Código en TypeScript**: Ejemplos reales del proyecto
- **Links internos**: Navegación fácil entre secciones
- **Modular**: 0 duplicación, cada archivo completo
- **Sin emojis**: Texto limpio y profesional

## Contribuir

Si encontrás algo confuso o desactualizado:

1. Lee el archivo en cuestión
2. Identifica qué falta o está mal
3. Abre un PR con tus cambios
4. Referencia ADRs o commits si es relevante

---

**Última actualización**: Abril 2026
**Estado**: Completa y actualizada

¿Necesitás ayuda? → [Setup](guides/setup.md) o [Glosario](overview/glossary.md)
