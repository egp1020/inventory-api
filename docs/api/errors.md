# Errores

## Formato estándar

Todos los errores responden así:

```json
{
  "data": null,
  "message": "Descripción del error",
  "statusCode": 400
}
```

## 400 Bad Request

Formato inválido o datos que no son válidos.

**Ejemplos**:
- Email inválido
- Quantity no es número
- UUID malformado
- Campo obligatorio faltá

**Respuesta**:
```json
{
  "data": {
    "errors": [
      "Email must be a valid email",
      "Quantity must be a positive number"
    ]
  },
  "message": "Validation failed",
  "statusCode": 400
}
```

## 401 Unauthorized

No tenés autenticación o expiró.

**Causas**:
- No mandaste Authorization header
- Token expiró
- Token inválido

**Respuesta**:
```json
{
  "data": null,
  "message": "Unauthorized",
  "statusCode": 401
}
```

**Solución**: Obtené un nuevo token:
```bash
POST /auth/refresh
```

## 403 Forbidden

Tenés token válido pero no el rol necesario.

**Causas**:
- OPERATOR intentó acceder a recurso solo ADMIN
- OPERATOR intentó en otra bodega

**Respuesta**:
```json
{
  "data": null,
  "message": "Forbidden - insufficient permissions",
  "statusCode": 403
}
```

**Solución**: Usá una cuenta con el rol necesario.

## 404 Not Found

Recurso no existe.

**Causas**:
- Bodega no existe
- Producto no existe
- Movimiento no existe

**Respuesta**:
```json
{
  "data": null,
  "message": "Warehouse not found",
  "statusCode": 404
}
```

## 422 Unprocessable Entity

Datos válidos pero violan una regla de negocio.

**Causas**:
- Stock insuficiente (SALIDA)
- Producto duplicado en misma bodega
- Intentás crear usuario con email que ya existe

**Respuesta**:
```json
{
  "data": null,
  "message": "Insufficient stock",
  "statusCode": 422
}
```

**Solución**: Revisá la lógica de negocio y reintentá con datos correctos.

## 500 Internal Server Error

Algo rompió en el servidor. No es culpa tuya.

**Respuesta**:
```json
{
  "data": null,
  "message": "Error interno del servidor",
  "statusCode": 500
}
```

**Qué hacés**:
1. Revisá los logs del servidor
2. Confirmá los datos del request
3. Si persiste, contactá al equipo

---

## Tabla de referencia

| Código | Significado | Reintentás? |
|--------|-------------|------------|
| 400 | Formato inválido | Sí, después de arreglar datos |
| 401 | Sin autenticación | Sí, renovando token |
| 403 | Sin permisos | No, necesitás rol diferente |
| 404 | No existe | No, recurso no existe |
| 422 | Regla de negocio | Sí, después de arreglar lógica |
| 500 | Error del server | Posiblemente, después de esperar |

---

[← API](overview.md)
