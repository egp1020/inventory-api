/**
 * DTO de entrada para el caso de uso RefreshTokenUseCase
 * Representa el comando de refresh que la application recibe
 */
export class RefreshTokenCommandDto {
  refreshToken!: string;
}
