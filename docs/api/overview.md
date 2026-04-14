# API - Visión General

Base URL: `http://localhost:3000/api`

## Autenticación

Todos los endpoints (excepto login) requieren JWT:

```
Authorization: Bearer <accessToken>
```

El access token dura 15 minutos. Usá `/auth/refresh` para renovarlo.

## Formato de respuestas

Todas las respuestas siguen este formato:

```json
{
  "data": null | object | array,
  "message": "Descripción de qué pasó",
  "statusCode": 200
}
```

## Códigos HTTP

- `200`: Éxito (GET, PUT)
- `201`: Creado (POST)
- `400`: Mal formato (validación)
- `401`: Sin token o expirado
- `403`: Sin permisos (falta rol)
- `404`: No existe (recurso no encontrado)
- `422`: Rompe regla de negocio
- `500`: Error del servidor

## Controladores y Endpoints

### Auth
Autenticación y tokens JWT.

- **POST** `/auth/login` - Entrá con email y contraseña
- **POST** `/auth/refresh` - Renová el token

Ver más: [`Auth Controller`](auth-controller.md)

### Users
Administración de usuarios (solo ADMIN).

- **GET** `/users` - Listá usuarios
- **GET** `/users/:id` - Obtené un usuario
- **POST** `/users` - Creá usuario
- **PATCH** `/users/:id` - Actualicá usuario
- **DELETE** `/users/:id` - Desactivá usuario

Ver más: [`Users Controller`](users-controller.md)

### Warehouses
Administración de bodegas (solo ADMIN).

- **GET** `/warehouses` - Listá bodegas
- **GET** `/warehouses/:id` - Obtené una bodega
- **POST** `/warehouses` - Creá bodega
- **PATCH** `/warehouses/:id` - Actualicá bodega
- **DELETE** `/warehouses/:id` - Desactivá bodega

Ver más: [`Warehouses Controller`](warehouses-controller.md)

### Products
Administración de productos (solo ADMIN).

- **GET** `/products` - Listá productos
- **GET** `/products/:id` - Obtené un producto
- **POST** `/products` - Creá producto
- **PATCH** `/products/:id` - Actualicá producto
- **DELETE** `/products/:id` - Desactivá producto

Ver más: [`Products Controller`](products-controller.md)

### Movements
Registro de movimientos de inventario.

- **POST** `/movements` - Registrá entrada o salida
- **GET** `/movements` - Listá movimientos (solo ADMIN)

Ver más: [`Movements Controller`](movements-controller.md)

### Reports
Reportes de inventario (read-only).

- **GET** `/reports/stock/:warehouseId` - Stock de bodega
- **GET** `/reports/alerts` - Alertas de stock bajo (solo ADMIN)
- **GET** `/reports/movements` - Historial de movimientos (solo ADMIN)

Ver más: [`Reports Controller`](reports-controller.md)

## Credenciales de prueba

- **Admin**: admin@test.com / password123
- **Operator**: operator@test.com / password123

## Postman

Importá `inventory-api.postman_collection.json` para tener todos los endpoints listos.

---

[← Volvé a Documentación](../README.md) | [Autenticación →](authentication.md)
