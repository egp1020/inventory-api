import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@database/prisma/prisma.module';

// Domain + Application
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { TOKEN_GENERATOR } from './application/ports/token-generator.port';
import { USER_REPOSITORY } from './domain/ports/user.repository.port';

// Infrastructure
import { BcryptPasswordHasher } from './infrastructure/adapters/password-hasher.adapter';
import { JwtTokenGenerator } from './infrastructure/adapters/token-generator.adapter';
import { UserRepositoryAdapter } from './infrastructure/adapters/user.repository.adapter';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { JwtRefreshGuard } from './infrastructure/guards/jwt-refresh.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';

// Interface
import { AuthController } from './interface/auth.controller';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    LoginUseCase,
    RefreshTokenUseCase,

    // Ports → Adapters (Dependency Injection)
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtTokenGenerator,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryAdapter,
    },

    // Strategies
    JwtStrategy,
    JwtRefreshStrategy,

    // Guards
    JwtAuthGuard,
    JwtRefreshGuard,
    RolesGuard,
  ],
  exports: [PASSWORD_HASHER, JwtAuthGuard, JwtRefreshGuard, RolesGuard],
})
export class AuthModule {}
