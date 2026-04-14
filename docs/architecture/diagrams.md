# Diagrams

## 1. Layered Architecture
```markdown
[ Interface ]
      ↓
[ Application ]
      ↓
[ Domain ]

[ Infrastructure ] → implementa Domain
```
---

## 2. Request Flow
```markdown
Client
  ↓
Controller (Interface)
  ↓
Use Case (Application)
  ↓
Repository Interface (Domain)
  ↓
Repository Adapter (Infrastructure)
  ↓
Database (PostgreSQL)
```
---

## 3. Module Dependencies
```markdown
Auth
  ↓
Users
  ↓
Warehouses     Products
      ↓          ↓
       Movements
           ↓
         Reports
```
---

## 4. Stock Movement Flow
```markdown
POST /movements
  ↓
Validar request
  ↓
Verificar producto
  ↓
Validar stock (si SALIDA)
  ↓
Crear movimiento (transaction)
  ↓
Respuesta
```
---

## 5. Authentication Flow
```markdown
Login
  ↓
Validar credenciales
  ↓
Generar JWT
  ↓
Cliente envía token
  ↓
Guard valida token
  ↓
Acceso permitido
```
---

## 6. Stock Calculation
```Stock = SUM(ENTRADA) - SUM(SALIDA)```