# Guía de Solución de Problemas

## Inicio y Configuración

### Error: "Cannot find module '/app/dist/main'"

**Síntomas:**
```
Error: Cannot find module '/app/dist/main'
at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
```

**Causas posibles:**
1. Build fallido (TypeScript no compiló)
2. Carpeta `dist/` no existe o está vacía
3. Falta ejecutar `npm run build`

**Soluciones:**

```bash
# Limpia y rebuilds
rm -rf dist/
npm run build

# Si usas Docker, rebuild la imagen
docker-compose down
docker-compose up --build

# Verifica que dist/ contenga main.js
ls -la dist/
```

---

### Error: "Prisma schema loaded... No pending migrations to apply"

**Síntomas:**
Ves este log pero el servicio no inicia:
```
Prisma schema loaded from prisma/schema.prisma
No pending migrations to apply.
Error: Cannot find module '/app/dist/main'
```

**Causa:**
Migración aplicada pero build faltó.

**Solución:**
```bash
# Ejecuta build después de migraciones
npm run build
npm start
```

---

### Error: "Connection refused" a la BD

**Síntomas:**
```
ECONNREFUSED 127.0.0.1:5432
cannot assign requested address
```

**Causas:**
1. PostgreSQL no está corriendo
2. `.env` apunta a host incorrecto
3. Contenedor de BD no está sano

**Soluciones:**

```bash
# Verifica que postgres está corriendo (Docker)
docker ps | grep inventory_db

# Si no, inicia los contenedores
docker-compose up -d

# Verifica salud del contenedor
docker-compose ps

# Si está unhealthy, revisa logs
docker-compose logs inventory_db

# Si está en tu máquina local, verifica:
psql -h localhost -U postgres -d inventory_db
```

**En `.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db"
# o en Docker:
DATABASE_URL="postgresql://postgres:postgres@db:5432/inventory_db"
```

---

### Error: "Warehouse XXX not found"

**Síntomas:**
```
Error: Warehouse 80a0dcfb-21cb-43d9-8a73-2568cd1b165f not found
at ReportRepositoryAdapter.getStockReport
```

**Causas:**
1. El UUID de bodega no existe
2. La bodega fue eliminada (soft delete)
3. Typo en el UUID

**Soluciones:**

```bash
# Listar todas las bodegas
curl -X GET http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verifica que el UUID en tu request coincida
# Copiar exactamente de la lista anterior

# Si no hay bodegas, crea una
curl -X POST http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bodega A", "location":"Lima", "capacity":1000}'
```

---

## Autenticación

### Error: "Unauthorized" (401)

**Síntomas:**
```json
{
  "data": null,
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Causas:**
1. Token faltá en header
2. Token expiró
3. Token está malformado

**Soluciones:**

```bash
# Verifica que includes el header Authorization
curl -X GET http://localhost:3000/api/movements \
  -H "Authorization: Bearer YOUR_TOKEN"
  # ↑ "Bearer " es obligatorio

# Si el token expiró (15 min), obtén uno nuevo
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# Si perdiste el refresh token, login de nuevo
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com", "password":"password123"}'
```

---

### Error: "Forbidden" (403)

**Síntomas:**
```json
{
  "data": null,
  "message": "Forbidden - insufficient permissions",
  "statusCode": 403
}
```

**Causas:**
1. Tu rol (OPERATOR) no puede acceder a este endpoint
2. Como OPERATOR, intentás acceder a bodega que no es la tuya
3. Requiere ADMIN pero sos OPERATOR

**Soluciones:**

```bash
# Verifica tu rol en el token
# Decodifica el JWT en https://jwt.io
# Mira el campo "role"

# Si sos OPERATOR, solo puedes:
# - POST /movements (registrar en tu bodega)
# - GET /reports/movements (historial)
# - GET /reports/stock/:warehouseId (tu bodega)

# Si necesitás ADMIN, pedile a un administrador que cree tu cuenta con ese rol
```

**Endpoints por rol:**

| Endpoint | ADMIN | OPERATOR |
|----------|-------|----------|
| POST /auth/login | ✓ | ✓ |
| POST /auth/refresh | ✓ | ✓ |
| GET /users | ✓ | ✗ |
| POST /users | ✓ | ✗ |
| PATCH /users/:id | ✓ | ✗ |
| DELETE /users/:id | ✓ | ✗ |
| GET /warehouses | ✓ | ✗ |
| POST /warehouses | ✓ | ✗ |
| PATCH /warehouses/:id | ✓ | ✗ |
| DELETE /warehouses/:id | ✓ | ✗ |
| GET /products | ✓ | ✓ |
| POST /products | ✓ | ✗ |
| PATCH /products/:id | ✓ | ✗ |
| DELETE /products/:id | ✓ | ✗ |
| POST /movements | ✓ | ✓* |
| GET /movements | ✓ | ✗ |
| GET /reports/stock/:id | ✓ | ✓* |
| GET /reports/alerts | ✓ | ✗ |
| GET /reports/movements | ✓ | ✓ |

*OPERATOR solo ve su bodega asignada

---

### Error: "Invalid email or password" (400)

**Síntomas:**
```json
{
  "data": null,
  "message": "Invalid email or password",
  "statusCode": 400
}
```

**Causas:**
1. Email no existe
2. Contraseña incorrecta
3. Usuario eliminado (soft delete)

**Soluciones:**

```bash
# Verifica que el email sea correcto (case-sensitive en algunos DB)
# Por defecto, admin@test.com con password123

# Si lo olvidaste, ask a un admin (no hay reset password endpoint)

# Para desarrollo, reinicia la BD con seed
docker-compose down -v
docker-compose up
# Esto crea usuarios de demo nuevamente
```

---

## Movimientos de Stock

### Error: "Insufficient stock" (422)

**Síntomas:**
```json
{
  "data": null,
  "message": "Insufficient stock for SALIDA",
  "statusCode": 422
}
```

**Causas:**
1. Intentás una SALIDA (outbound) pero no hay suficiente stock
2. Stock = SUM(ENTRADA) - SUM(SALIDA)
3. El cálculo es en tiempo real

**Soluciones:**

```bash
# 1. Verifica stock actual
curl -X GET http://localhost:3000/api/reports/stock/WAREHOUSE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Busca el producto en el resultado, ve su cantidad

# 3. Si quieres hacer SALIDA de 100 pero hay 50, primero:
#    - Registra ENTRADA (compra/recepción)
#    - O reduce la cantidad en SALIDA

# Registra una ENTRADA primero
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "UUID",
    "warehouseId": "UUID",
    "type": "ENTRADA",
    "quantity": 100,
    "notes": "Compra a proveedor"
  }'

# Luego la SALIDA
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "UUID",
    "warehouseId": "UUID",
    "type": "SALIDA",
    "quantity": 50,
    "notes": "Venta cliente"
  }'
```

---

### Error: "Warehouse XXX not assigned to user"

**Síntomas:**
```json
{
  "data": null,
  "message": "Warehouse not assigned to user",
  "statusCode": 403
}
```

**Causas:**
1. Sos OPERATOR pero intentás registrar movimiento en otra bodega
2. Tu cuenta no tiene warehouse_id o es diferente

**Soluciones:**

```bash
# Verifica tu warehouse_id en el token (decodifica en jwt.io)

# Solo podés registrar en esa bodega
# Si necesitás otra, un ADMIN debe asignarte

# Para desarrolladores: usa una cuenta ADMIN
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@test.com","password":"password123"}'
```

---

## Reportes

### Error: "Forbidden" al acceder a reportes (403)

**Síntomas:**
```json
{
  "statusCode": 403,
  "message": "Forbidden - insufficient permissions"
}
```

**Causas:**
- GET /reports/alerts requiere ADMIN
- GET /reports/movements requiere ADMIN (aunque OPERATOR puede GET /reports/stock)

**Soluciones:**

```bash
# Si sos OPERATOR, solo podés:
# 1. GET /reports/stock/YOUR_WAREHOUSE_ID (tu bodega)
# 2. GET /reports/movements (historial, pero solo ADMIN en esta versión)

# Si necesitás alertas, pedile a un ADMIN que corra:
curl -X GET http://localhost:3000/api/reports/alerts \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Stock muestra 0 pero registré movimientos

**Síntomas:**
```
Stock report shows 0 for product X
```

**Causas:**
1. Los movimientos están en otra bodega
2. El producto_id es diferente
3. Los movimientos no fueron confirmados

**Soluciones:**

```bash
# Verifica en qué bodega registraste
curl -X GET http://localhost:3000/api/reports/movements \
  -H "Authorization: Bearer YOUR_TOKEN"

# Busca los movimientos de tu producto
# Nota el warehouse_id exacto

# Luego consulta ese warehouse_id en stock report
curl -X GET http://localhost:3000/api/reports/stock/WAREHOUSE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Base de Datos

### Error: "Unique constraint violation" (409)

**Síntomas:**
```json
{
  "message": "Unique constraint failed: users.email",
  "statusCode": 409
}
```

**Causas:**
- Email ya existe (en un usuario no eliminado)
- SKU de producto ya existe
- Violaste una restricción UNIQUE

**Soluciones:**

```bash
# Para usuarios: usa otro email
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "email": "nuevo@email.com",
    "password": "password123",
    "role": "OPERATOR",
    "warehouseId": "..."
  }'

# Para productos: usa otro SKU
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "sku": "SKU-UNICO-123",
    "name": "Nombre",
    "unit": "pieza"
  }'
```

---

### Error en migraciones

**Síntomas:**
```
Migration failed: Cannot run prisma migrate in production
```

**Causas:**
- NODE_ENV=production pero necesitas migrar
- Prisma en modo estricto

**Soluciones:**

```bash
# En desarrollo, fuerza migración
NODE_ENV=development npx prisma migrate dev --name "fix"

# En producción, usa deploy (no dev)
npx prisma migrate deploy

# Reset de BD (¡CUIDADO, elimina datos!)
npx prisma migrate reset
```

---

## Performance y Logs

### Aplicación lenta

**Síntomas:**
- Reportes tardan >5s
- Movimientos lentos

**Causas:**
- Mucho stock_movements en BD
- Índices no creados
- Queries ineficientes

**Soluciones:**

```bash
# Verifica índices en la BD
psql -h localhost -d inventory_db -U postgres
SELECT * FROM pg_indexes WHERE tablename = 'stock_movements';

# Si faltan índices, ejecuta migrations
npx prisma migrate dev

# Analiza queries con EXPLAIN
EXPLAIN ANALYZE
SELECT * FROM stock_movements
WHERE warehouse_id = 'xxx' AND product_id = 'yyy';
```

---

### Ver logs de errores

**Docker:**
```bash
# Logs de la aplicación
docker-compose logs inventory_app

# Logs de la BD
docker-compose logs inventory_db

# Logs en vivo (follow)
docker-compose logs -f inventory_app

# Últimas 100 líneas
docker-compose logs --tail=100 inventory_app
```

**Localmente:**
```bash
# Los logs se imprimen en consola cuando ejecutas
npm start

# Para capturar a archivo
npm start > app.log 2>&1
tail -f app.log
```

---

## Preguntas Frecuentes

### ¿Cómo reseteo todo?

```bash
# Deja la BD limpia, sin usuarios
docker-compose down -v
docker-compose up

# Esto elimina volúmenes y recrea todo con seed
```

### ¿Cómo cambio la contraseña de un usuario?

No hay endpoint de cambio de contraseña. Opciones:
1. Usar `/auth/login` con la contraseña actual (no cambia)
2. Eliminar y recrear el usuario
3. Modificar BD directamente (development solo)

```bash
# Development: actualiza BD
psql -h localhost -d inventory_db -U postgres
-- Necesitas hashear la contraseña (bcrypt)
UPDATE users SET password_hash = '...' WHERE email = '...';
```

### ¿Qué pasa si elimino un usuario?

Es un soft delete. El usuario:
- Desaparece de queries normales
- No puede loguearse
- Los datos quedan en BD (auditoría)
- Puedes "recuperar" actualizando deleted_at = NULL

### ¿Cómo escalo si crece el volumen?

1. **Stock movements crece mucho:**
   - Particionar por fecha
   - Cachear reportes
   - Vistas materializadas

2. **Muchos usuarios:**
   - Agregar índices en users.email
   - Considerar cache de autenticación

3. **Múltiples bodegas:**
   - Ya está preparado (warehouse_id indexado)
   - Considera replicación por región

---

## Contáctame si...

- ❌ Error no aparece en esta lista
- ❌ Solución no funciona
- ❌ Hay patrón que se repite
- ✅ Descubriste un bug nuevo

Abre un issue en el repositorio con:
- Comando exacto que ejecutaste
- Mensaje de error completo
- Output de `docker-compose ps`
- Archivo `.env` (sin secrets)
