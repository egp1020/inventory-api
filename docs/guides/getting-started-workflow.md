# Flujo Completo: De Cero a Reportes

Guía step-by-step para entender el flujo completo del sistema.

## Escenario: Gestor de Bodega

Sos el responsable de la Bodega A. Necesitás:
1. Autenticarte en el sistema
2. Crear un producto
3. Registrar entrada de stock
4. Registrar salida de stock
5. Ver reporte de stock
6. Ver alertas de stock bajo

---

## 1. Setup Inicial

```bash
# Inicia los servicios
docker-compose up

# En otra terminal, espera a que esté listo
docker-compose ps
# inventory_app debe estar "running"
# inventory_db debe estar "healthy"
```

**Espera 1-2 min** hasta que veas:
```
inventory_app  | [Nest] X - 04/14/2026, HH:MM:SS AM   LOG [NestFactory] Application successfully started
```

---

## 2. Login (Obtener Tokens)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@test.com",
      "role": "ADMIN",
      "warehouseId": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Entrada exitosa",
  "statusCode": 200
}
```

**Guarda estos valores:**
```bash
export ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export ADMIN_ID="550e8400-e29b-41d4-a716-446655440000"
```

---

## 3. Crear una Bodega

```bash
curl -X POST http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bodega Central",
    "location": "Lima, Perú",
    "capacity": 5000,
    "isActive": true
  }'
```

**Respuesta:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Bodega Central",
    "location": "Lima, Perú",
    "capacity": 5000,
    "isActive": true,
    "createdAt": "2026-04-14T11:00:00Z"
  },
  "message": "Bodega creada correctamente",
  "statusCode": 201
}
```

**Guarda:**
```bash
export WAREHOUSE_ID="f47ac10b-58cc-4372-a567-0e02b2c3d479"
```

---

## 4. Crear un Producto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "LAPTOP-001",
    "name": "Laptop Dell XPS 13",
    "description": "Laptop para desarrollo",
    "unit": "unidad",
    "minStockAlert": 5
  }'
```

**Respuesta:**
```json
{
  "data": {
    "id": "a9a84a57-b2a8-4e8d-9e6c-3f3c3c3c3c3c",
    "sku": "LAPTOP-001",
    "name": "Laptop Dell XPS 13",
    "description": "Laptop para desarrollo",
    "unit": "unidad",
    "minStockAlert": 5,
    "createdAt": "2026-04-14T11:05:00Z"
  },
  "message": "Producto creado correctamente",
  "statusCode": 201
}
```

**Guarda:**
```bash
export PRODUCT_ID="a9a84a57-b2a8-4e8d-9e6c-3f3c3c3c3c3c"
```

---

## 5. Registrar ENTRADA (Compra)

Recibiste 10 laptops de un proveedor.

```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "warehouseId": "'$WAREHOUSE_ID'",
    "type": "ENTRADA",
    "quantity": 10,
    "notes": "Compra a Dell - Factura #123456"
  }'
```

**Respuesta:**
```json
{
  "data": {
    "id": "b1b84b58-c3b9-4f9e-af7d-4g4d4d4d4d4d",
    "productId": "a9a84a57-b2a8-4e8d-9e6c-3f3c3c3c3c3c",
    "warehouseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "ENTRADA",
    "quantity": 10,
    "notes": "Compra a Dell - Factura #123456",
    "createdAt": "2026-04-14T11:10:00Z"
  },
  "message": "Movimiento registrado correctamente",
  "statusCode": 201
}
```

**Stock actual = 10 unidades** ✓

---

## 6. Registrar SALIDA (Venta)

Vendiste 3 laptops a un cliente.

```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "warehouseId": "'$WAREHOUSE_ID'",
    "type": "SALIDA",
    "quantity": 3,
    "notes": "Venta a cliente - Pedido #789"
  }'
```

**Respuesta:**
```json
{
  "data": {
    "id": "c2c95c69-d4ca-5g0f-bg8e-5h5e5e5e5e5e",
    "type": "SALIDA",
    "quantity": 3,
    "createdAt": "2026-04-14T11:15:00Z"
  },
  "message": "Movimiento registrado correctamente",
  "statusCode": 201
}
```

**Stock actual = 10 - 3 = 7 unidades** ✓

---

## 7. Consultar Stock (Reporte)

```bash
curl -X GET http://localhost:3000/api/reports/stock/$WAREHOUSE_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Respuesta:**
```json
{
  "data": {
    "warehouseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "warehouseName": "Bodega Central",
    "items": [
      {
        "productId": "a9a84a57-b2a8-4e8d-9e6c-3f3c3c3c3c3c",
        "productName": "Laptop Dell XPS 13",
        "sku": "LAPTOP-001",
        "unit": "unidad",
        "quantity": 7,
        "minStockAlert": 5,
        "status": "OK"
      }
    ]
  },
  "message": "Reporte generado correctamente",
  "statusCode": 200
}
```

**Interpretación:**
- Bodega Central tiene 7 laptops
- El mínimo de alerta es 5
- Status es OK (no está bajo)

---

## 8. Bajar Stock para Generar Alerta

Vende 4 más (quedan 3, menor al mínimo de 5).

```bash
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "warehouseId": "'$WAREHOUSE_ID'",
    "type": "SALIDA",
    "quantity": 4,
    "notes": "Venta a otro cliente"
  }'
```

**Stock ahora = 3** (menos que 5, genera alerta)

---

## 9. Ver Alertas (ADMIN)

```bash
curl -X GET http://localhost:3000/api/reports/alerts \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Respuesta:**
```json
{
  "data": {
    "alerts": [
      {
        "warehouseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "warehouseName": "Bodega Central",
        "productId": "a9a84a57-b2a8-4e8d-9e6c-3f3c3c3c3c3c",
        "productName": "Laptop Dell XPS 13",
        "sku": "LAPTOP-001",
        "currentStock": 3,
        "minStockAlert": 5,
        "deficit": 2,
        "severity": "WARNING"
      }
    ]
  },
  "message": "Reporte generado correctamente",
  "statusCode": 200
}
```

**El sistema dice:**
- Hay deficit de 2 unidades
- Debe reponer para llegar a 5

---

## 10. Ver Historial de Movimientos

```bash
curl -X GET http://localhost:3000/api/reports/movements \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Respuesta:**
```json
{
  "data": {
    "movements": [
      {
        "id": "c2c95c69-d4ca-5g0f-bg8e-5h5e5e5e5e5e",
        "productName": "Laptop Dell XPS 13",
        "sku": "LAPTOP-001",
        "warehouseName": "Bodega Central",
        "type": "SALIDA",
        "quantity": 4,
        "userName": "admin@test.com",
        "notes": "Venta a otro cliente",
        "createdAt": "2026-04-14T11:20:00Z"
      },
      {
        "id": "b1b84b58-c3b9-4f9e-af7d-4g4d4d4d4d4d",
        "productName": "Laptop Dell XPS 13",
        "type": "ENTRADA",
        "quantity": 10,
        "userName": "admin@test.com",
        "notes": "Compra a Dell - Factura #123456",
        "createdAt": "2026-04-14T11:10:00Z"
      }
    ]
  },
  "message": "Reporte generado correctamente",
  "statusCode": 200
}
```

**Puedes ver cronológicamente:**
- Cada movimiento
- Quién lo registró
- Motivo
- Fecha exacta

---

## 11. Scenario: Usuario OPERATOR

Ahora creá un usuario OPERATOR asignado a la Bodega Central.

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bodeguero@test.com",
    "password": "password123",
    "role": "OPERATOR",
    "warehouseId": "'$WAREHOUSE_ID'"
  }'
```

Ahora **bodeguero@test.com** puede:
- ✓ Registrar entrada/salida (solo su bodega)
- ✓ Ver stock de su bodega
- ✓ Ver historial de movimientos
- ✗ Crear productos
- ✗ Crear bodegas
- ✗ Ver alertas
- ✗ Ver otros usuarios

Logueate como bodeguero:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bodeguero@test.com",
    "password": "password123"
  }'

export OPERATOR_TOKEN="eyJh..."
```

Registra un movimiento como OPERATOR:

```bash
# OPERATOR solo puede en su bodega (la que está asignado)
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer $OPERATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "warehouseId": "'$WAREHOUSE_ID'",
    "type": "ENTRADA",
    "quantity": 5,
    "notes": "Reposición de stock"
  }'
```

---

## 12. Refresh Token (Cuando Expira)

El access token expira cada 15 minutos. Obten uno nuevo:

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }'
```

**Respuesta:**
```json
{
  "data": {
    "accessToken": "eyJ... NUEVO ...",
    "refreshToken": "eyJ... NUEVO ..."
  },
  "message": "Token renovado",
  "statusCode": 200
}
```

Actualiza tus variables:

```bash
export ACCESS_TOKEN="eyJ... NUEVO ..."
export REFRESH_TOKEN="eyJ... NUEVO ..."
```

---

## Resumen del Flujo

```
[ADMIN Login]
     ↓
[Crear Bodega]
     ↓
[Crear Producto]
     ↓
[Registrar ENTRADA] → Stock = 10
     ↓
[Registrar SALIDA] → Stock = 7
     ↓
[Ver Stock Report] → Muestra 7 unidades
     ↓
[Registrar más SALIDA] → Stock = 3 (bajo)
     ↓
[Ver Alertas] → Muestra deficit
     ↓
[Ver Historial] → Timeline completa
     ↓
[Crear OPERATOR] → Acceso limitado
     ↓
[Login OPERATOR] → Solo su bodega
```

---

## Casos de Uso Comunes

### Reposición Automática

```bash
# Ves alerta de bajo stock
# Registras una ENTRADA grande
curl -X POST http://localhost:3000/api/movements \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "productId": "...",
    "warehouseId": "...",
    "type": "ENTRADA",
    "quantity": 20,
    "notes": "Reposición automática - Stock estaba bajo"
  }'

# Verifica alertas nuevamente
curl -X GET http://localhost:3000/api/reports/alerts \
  -H "Authorization: Bearer $ACCESS_TOKEN"
# La alerta desapareció
```

### Auditoría Completa

```bash
# Ver exactamente qué pasó con un producto
curl -X GET http://localhost:3000/api/reports/movements \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Filtra por producto_id en el resultado
# Ves: fecha, cantidad, tipo, quién lo hizo, notas
```

### Multi-Bodega

```bash
# Sos ADMIN, ves stock en todas partes
curl -X GET http://localhost:3000/api/reports/stock/WAREHOUSE_1 ...
curl -X GET http://localhost:3000/api/reports/stock/WAREHOUSE_2 ...
curl -X GET http://localhost:3000/api/reports/stock/WAREHOUSE_3 ...

# Sos OPERATOR, solo ves la tuya
curl -X GET http://localhost:3000/api/reports/stock/MI_BODEGA ...
# Otra bodega falla 403 Forbidden
```

---

## Tips

1. **Guarda los UUIDs** en variables para reutilizar
2. **Usa Postman** para no tener que escribir curl todo el tiempo
3. **Verifica permisos** si un endpoint retorna 403
4. **Chequea stock** antes de registrar SALIDA
5. **Usa notas** para auditoría (qué pasó, por qué)
6. **Refresh token** cuando el access expire
7. **Soft deletes** significa que el historial nunca se pierde

---

[← Guías](../guides/) | [API →](../api/overview.md)
