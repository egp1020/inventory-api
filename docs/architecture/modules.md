# Los módulos

Cada módulo es un área del negocio. Todos siguen la misma estructura que ves en [`ARQUITECTURA.md`](ARQUITECTURA.md).

## Auth

Maneja login y tokens.

- **Login**: Te da un access token (15 min) y un refresh token (7 días)
- **Refresh**: Renovás el access token sin volver a entrar
- Usamos JWT + Passport
- Contraseñas con bcrypt

**Endpoints**:
- `POST /auth/login` → Entra con email y contraseña
- `POST /auth/refresh` → Renovás el token

---

## Users

Gestión de usuarios.

- Crear usuarios
- Asignar roles (ADMIN / OPERATOR)
- Un OPERATOR se asigna a una sola bodega
- Los ADMIN ven todas las bodegas

---

## Warehouses

Las bodegas.

- Crear bodegas
- Asignarles capacidad máxima (informativo, no se valida)
- Soft delete (no se borran, se marcan como deleted)
- Los OPERATOR solo ven su bodega asignada

---

## Products

El catálogo de productos.

- **SKU**: Identificador único (4-20 caracteres alfanuméricos)
- **Stock mínimo/máximo**: Te marca alertas
- **Stock dinámico**: Se calcula desde los movimientos
- No podés borrar un producto que tiene movimientos (se tira 422)

---

## Movements

El núcleo: entradas y salidas.

- **ENTRADA**: Entra mercadería
- **SALIDA**: Sale mercadería
- **Regla crítica**: No podés sacar más de lo que hay (422)
- Los OPERATOR solo pueden registrar en su bodega
- Queda todo registrado (auditoría completa)

---

## Reports

Reportes y alertas. Solo lectura.

- **Stock por bodega**: Qué hay en cada lugar ahora
- **Alertas**: Productos debajo del mínimo (solo ADMIN)
- **Historial**: Todos los movimientos con filtros

---

## Dependencias entre módulos

```
Auth ← (nadie necesita a Auth)
  ↓
Users ← (Los demás crean usuarios)
  ↓
Warehouses ← Movements, Reports
Products   ← Movements, Reports
  ↓
Movements → Reports
```

---

## Infraestructura compartida

En `src/shared/` hay cosas que usan todos:

- **JwtAuthGuard**: Valida el token
- **RolesGuard**: Valida que tengas el rol necesario
- **AllExceptionsFilter**: Mapea errores a respuestas HTTP
- **TransformResponseInterceptor**: Envuelve todas las respuestas
- **PrismaService**: Conexión a la BD

Ver más en [`architecture.md`](architecture.md).

---

Mirá [`../api/overview.md`](../api/overview.md) para los endpoints exactos y qué se envía/recibe.
