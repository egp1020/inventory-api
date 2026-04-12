/**
 * Port de generador de tokens JWT.
 * La aplicación no conoce detalles de cómo se generan los tokens.
 */
export interface ITokenGenerator {
  /**
   * Genera un Access Token de corta vida.
   */
  generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): string;

  /**
   * Genera un Refresh Token de larga vida.
   */
  generateRefreshToken(payload: { sub: string }): string;

  /**
   * Valida y decodifica un refresh token.
   * Retorna null si es inválido o está expirado.
   */
  validateRefreshToken(token: string): { sub: string } | null;

  /**
   * Valida y decodifica un access token.
   * Retorna null si es inválido o está expirado.
   */
  validateAccessToken(token: string): {
    sub: string;
    email: string;
    role: string;
  } | null;
}

export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');
