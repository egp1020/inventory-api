/**
 * IPasswordHasher - Port para funciones criptográficas de contraseñas
 *
 * Abstracción del dominio para operaciones de hashing. La capa Application/Domain
 * no conoce qué algoritmo se usa (bcrypt, argon2, etc).
 *
 * Implementado en: src/auth/infrastructure/adapters/password-hasher.adapter.ts
 * Usa: bcrypt con salt rounds >= 10
 */
export interface IPasswordHasher {
  /**
   * Genera un hash criptográfico de una contraseña en texto plano.
   *
   * Requisitos de seguridad:
   * - Salt rounds >= 10 (iteraciones)
   * - Usado en: LoginUseCase, CreateUserUseCase
   * - NUNCA almacenar ni transmitir plainPassword después del hash
   *
   * @param plainPassword - Contraseña en texto plano
   * @returns Promise<string> - Hash bcrypt (incluye salt embebido)
   */
  hash(plainPassword: string): Promise<string>;

  /**
   * Verifica si una contraseña en texto plano coincide con su hash.
   *
   * Usado en autenticación. Es constantemente-temporal para evitar
   * timing attacks (bcrypt ya lo maneja).
   *
   * @param plainPassword - Contraseña en texto plano a verificar
   * @param hash - Hash bcrypt generado previamente
   * @returns Promise<boolean> - true si coinciden, false si no
   */
  compare(plainPassword: string, hash: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
