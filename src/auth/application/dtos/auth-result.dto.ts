/**
 * DTO de salida para los casos de uso LoginUseCase y RefreshTokenUseCase
 * Representa el resultado que la application retorna
 */
export class AuthResultDto {
  accessToken!: string;
  refreshToken!: string;
}
