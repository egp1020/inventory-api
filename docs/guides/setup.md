# Setup Inicial

## Con Docker (recomendado)

La forma más rápida:

```bash
git clone <repo-url>
cd inventory-api
docker-compose up -d
npm run seed
```

Listo. La API estará en `http://localhost:3000/api`

Swagger en `http://localhost:3000/docs`

## En tu máquina (Local)

Si preferís desarrollo sin Docker:

### 1. Dependencias

```bash
git clone <repo-url>
cd inventory-api
pnpm install
cp .env.example .env
```

### 2. PostgreSQL

```bash
docker run -d \
  --name postgres-inventory \
  -e POSTGRES_USER=inventory_user \
  -e POSTGRES_PASSWORD=inventory_pass_2026 \
  -e POSTGRES_DB=inventory_db \
  -p 5433:5432 \
  postgres:15-alpine
```

### 3. Migraciones y seed

```bash
npx prisma migrate deploy
npm run seed
```

### 4. Servidor

```bash
npm run start:dev
```

API en `http://localhost:3000/api`

## Verificar que funciona

Una vez levantado, probá:

```bash
# Entrá
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

Deberías obtener un JSON con `accessToken`.

## Credenciales de prueba

- **Admin**: admin@test.com / password123
- **Operator**: operator@test.com / password123

## Variables de entorno

El `.env.example` ya está listo. Si lo necesitás cambiar:

```env
DATABASE_URL=postgresql://inventory_user:inventory_pass_2026@localhost:5433/inventory_db
PORT=3000
NODE_ENV=development
JWT_SECRET=<cambiar en producción>
JWT_REFRESH_SECRET=<cambiar en producción>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Soluciones rápidas

**Puerto 3000 ocupado**:
```bash
npm run start:dev -- --port 3001
```

**Puerto 5433 de BD ocupado**:
Cambiar en el comando de PostgreSQL y en `.env`.

**Migraciones no se aplican**:
```bash
npx prisma migrate deploy --skip-generate
```

---

[← Volvé a Documentación](../README.md) | [Desarrollo →](development.md)
