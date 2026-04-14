# Deployment

## Production Build

```bash
npm run build          # Compila TypeScript
npm start              # Ejecuta dist/src/main.js
```

O en Docker:

```bash
docker build -t inventory-api:latest .
docker run -e DATABASE_URL=... -p 3000:3000 inventory-api:latest
```

## Configuración en Producción

Variables críticas a cambiar:

```env
NODE_ENV=production
JWT_SECRET=<CAMBIAR: mínimo 32 caracteres>
JWT_REFRESH_SECRET=<CAMBIAR: mínimo 32 caracteres>
DATABASE_URL=postgresql://user:password@host:5432/inventory_db
PORT=3000
```

**CRÍTICO**: Nunca uses los secrets de desarrollo en producción.

## Base de datos

Antes de levantá el servidor:

```bash
npx prisma migrate deploy    # Aplica todas las migraciones
```

No uses `prisma db push` en producción.

## Health Check

Agregá a tu loadbalancer:

```
GET /api/health
```

Responde `200 OK` si el servidor está vivo.

## Logs

NestJS loguea a stdout. Tu infraestructura (Docker, Kubernetes, ECS) se encarga de recolectarlos.

Los logs incluyen:

- Requests HTTP (método, path, status, tiempo)
- Errores (stack trace completo)
- Eventos de startup/shutdown

## Escalabilidad

El sistema está diseñado para:

- **Múltiples instancias**: No hay estado en memoria
- **Load balancing**: Cualquier servidor puede procesar cualquier request
- **Base de datos compartida**: Todos usan la misma PostgreSQL

## Docker Compose (para staging)

```bash
docker-compose up -d              # Levanta todo
docker-compose down               # Apaga todo
docker-compose logs -f app        # Ver logs del app
```

El `docker-compose.yml` incluye:
- Servidor NestJS
- PostgreSQL
- Seed automático

## Monitoring

Consideraciones para monitoreo:

- **Logs**: Enviá a (Datadog, CloudWatch, etc)
- **Métricas**: HTTP requests, latencia, errores
- **Health checks**: ¿Servidor activo? ¿BD conectada?
- **Database**: Tamaño de tablas, queries lentas

## Security

- JWT tokens son stateless (no necesitas sesiones en BD)
- Contraseñas se hashean con bcrypt
- Roles se validan en cada request
- No hay credenciales en código

## Performance

- Stock se calcula dinámicamente (pero cacheable si necesitás)
- Indexes en `StockMovement` para queries rápidas
- Soft deletes para preservar datos
- Transacciones para consistencia

## Backup

PostgreSQL es tu único "estado" persistente.

Estrategia de backup:

```bash
# Backup
pg_dump -h localhost -U user inventory_db > backup.sql

# Restore
psql -h localhost -U user inventory_db < backup.sql
```

O usá snapshots de tu cloud provider.

## Rollback

Si algo rompe:

1. Deployá versión anterior del código
2. Si la BD cambió, usá `npx prisma migrate resolve --rolled-back <migración>`
3. Restaurá datos desde backup si es necesario

## Actualizar versiones

Cuando actualices NestJS, Prisma, etc:

```bash
npm update
npm audit fix
npm test
npm run build
```

Luego deployá como normalmente.

## Checklist pre-deployment

- [ ] `npm test` está en verde
- [ ] `npm run build` compila sin errores
- [ ] Configuraste las env vars correctas
- [ ] Corriste `prisma migrate deploy` en la BD
- [ ] Tenés un backup de la BD
- [ ] El health check responde
- [ ] Los logs se ven en el lugar correcto

---

[← Volvé a Documentación](../README.md)
