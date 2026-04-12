import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import {
  InvalidCredentialsError,
  UserInactiveError,
} from '../../domain/errors/auth.errors';
import type { IPasswordHasher } from '../ports/password-hasher.port';
import { PASSWORD_HASHER } from '../ports/password-hasher.port';
import type { ITokenGenerator } from '../ports/token-generator.port';
import { TOKEN_GENERATOR } from '../ports/token-generator.port';
import { AuthResultDto, LoginCommandDto } from '../dtos';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(command: LoginCommandDto): Promise<AuthResultDto> {
    this.logger.debug(`Intento de login: email=${command.email}`);

    try {
      // 1. Buscar usuario por email
      const user = await this.userRepository.findByEmail(command.email);
      if (!user) {
        this.logger.warn(`Login fallido: usuario no encontrado (${command.email})`);
        throw new InvalidCredentialsError();
      }

      // 2. Verificar que el usuario esté activo (no soft deleted)
      if (!user.isActive()) {
        this.logger.warn(
          `Login fallido: usuario inactivo (${command.email})`,
        );
        throw new UserInactiveError();
      }

      // 3. Validar contraseña
      const isPasswordValid = await this.passwordHasher.compare(
        command.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        this.logger.warn(
          `Login fallido: contraseña inválida (${command.email})`,
        );
        throw new InvalidCredentialsError();
      }

      // 4. Generar tokens
      const accessToken = this.tokenGenerator.generateAccessToken({
        sub: user.id,
        email: user.email.getValue(),
        role: user.role,
      });

      const refreshToken = this.tokenGenerator.generateRefreshToken({
        sub: user.id,
      });

      this.logger.log(
        `Login exitoso: usuario=${user.email.getValue()}, rol=${user.role}`,
      );

      return { accessToken, refreshToken };
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError ||
        error instanceof UserInactiveError
      ) {
        throw error;
      }

      this.logger.error(
        `Error en login: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }
}
