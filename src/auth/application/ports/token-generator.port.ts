/**
 * ITokenGenerator - Port de generación y validación de JWT Tokens
 *
 * Abstracción para operaciones con JWT. No especifica algoritmo, librerías ni detalles
 * de implementación. Solo define el contrato de generación y validación de tokens.
 *
 * Estrategia de tokens:
 * - Access Token: 15 minutos (usado en headers Authorization: Bearer <token>)
 * - Refresh Token: 7 días (usado solo en endpoint /auth/refresh)
 * - Ambos son JWT firmados con secrets en variables de entorno
 *
 * Implementado en: src/auth/infrastructure/adapters/token-generator.adapter.ts
 * Usa: @nestjs/jwt (wrappea jsonwebtoken)
 */
export interface ITokenGenerator {
  /**
   * Genera un Access Token JWT de corta vida (15 min).
   *
   * Payload embebido:
   * - sub: User ID (subject - standard JWT claim)
   * - email: Email del usuario (para lookups rápidos)
   * - role: ADMIN | OPERATOR (para autorización en guards)
   *
   * Firmado con JWT_ACCESS_SECRET y expiración JWT_ACCESS_EXPIRES_IN
   *
   * @param payload - Claims a incluir en el token
   * @returns string - Token JWT firmado (incluye header.payload.signature)
   */
  generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): string;

  /**
   * Genera un Refresh Token JWT de larga vida (7 días).
   *
   * Payload mínimo (por seguridad):
   * - sub: User ID (suficiente para obtener datos completos en DB)
   *
   * Firmado con JWT_REFRESH_SECRET y expiración JWT_REFRESH_EXPIRES_IN
   *
   * @param payload - Claims a incluir en el token
   * @returns string - Token JWT firmado
   */
  generateRefreshToken(payload: { sub: string }): string;

  /**
   * Valida y decodifica un refresh token JWT.
   *
   * Verificaciones:
   * - Firma correcta
   * - No está expirado
   * - Contiene claim 'sub'
   *
   * @param token - Token JWT sin el prefijo "Bearer "
   * @returns { sub: string } | null - Payload decodificado si válido, null si inválido/expirado
   */
  validateRefreshToken(token: string): { sub: string } | null;

  /**
   * Valida y decodifica un access token JWT.
   *
   * Verificaciones:
   * - Firma correcta
   * - No está expirado
   * - Contiene claims requeridos (sub, email, role)
   *
   * Usado en: JwtAuthGuard (valida header Authorization)
   *
   * @param token - Token JWT sin el prefijo "Bearer "
   * @returns Payload decodificado si válido, null si inválido/expirado
   */
  validateAccessToken(token: string): {
    sub: string;
    email: string;
    role: string;
  } | null;
}

export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');
