import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { InvalidRefreshTokenError, UserInactiveError } from '../../domain/errors/auth.errors';
import type { ITokenGenerator } from '../ports/token-generator.port';
import { TOKEN_GENERATOR } from '../ports/token-generator.port';
import { AuthResultDto, RefreshTokenCommandDto } from '../dtos';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(command: RefreshTokenCommandDto): Promise<AuthResultDto> {
    // 1. Validar refresh token y extraer payload
    const payload = this.tokenGenerator.validateRefreshToken(command.refreshToken);
    if (!payload) {
      throw new InvalidRefreshTokenError();
    }

    // 2. Buscar usuario por ID extraído del token
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    // 3. Verificar que el usuario esté activo
    if (!user.isActive()) {
      throw new UserInactiveError();
    }

    // 4. Generar nuevos tokens
    const newAccessToken = this.tokenGenerator.generateAccessToken({
      sub: user.id,
      email: user.email.getValue(),
      role: user.role,
    });

    const newRefreshToken = this.tokenGenerator.generateRefreshToken({
      sub: user.id,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
