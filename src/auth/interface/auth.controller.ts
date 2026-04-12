import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginRequestDto } from './dtos/login-request.dto';
import { RefreshTokenRequestDto } from './dtos/refresh-token-request.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { LoginCommandDto, RefreshTokenCommandDto } from '../application/dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuario',
    description: 'Retorna access token (15 min) y refresh token (7 días)',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Email o contraseña inválidos',
  })
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    const command: LoginCommandDto = {
      email: dto.email,
      password: dto.password,
    };
    return this.loginUseCase.execute(command);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar tokens',
    description: 'Utiliza el refresh token para obtener nuevos tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refresh(@Body() dto: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    const command: RefreshTokenCommandDto = {
      refreshToken: dto.refreshToken,
    };
    return this.refreshTokenUseCase.execute(command);
  }
}
