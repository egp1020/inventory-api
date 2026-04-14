# ADR-0014: Autenticación con JWT

## Contexto
El sistema requiere autenticación stateless para APIs.

Opciones:
- Sessions
- JWT

## Decisión
Usar JWT con access y refresh tokens.

## Consecuencias

### Positivas
+ Stateless
+ Escalable
+ Compatible con microservicios

### Negativas
- Revocación compleja
- Riesgo si se filtra token