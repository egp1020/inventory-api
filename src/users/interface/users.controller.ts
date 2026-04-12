import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@shared/infrastructure/decorators/roles.decorator';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  UserResponseDto,
  PaginatedUsersResponseDto,
} from './dtos/user-response.dto';
import {
  CreateUserCommandDto,
  UpdateUserCommandDto,
  UserResultDto,
  PaginatedUserResultDto,
} from '../application/dtos';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Solo ADMIN. Retorna lista paginada de usuarios activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios obtenidos',
    type: PaginatedUsersResponseDto,
  })
  async listUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedUsersResponseDto> {
    const appResult: PaginatedUserResultDto =
      await this.listUsersUseCase.execute(page, limit);
    return {
      data: appResult.data.map((u) => this.toResponse(u)),
      total: appResult.total,
      page: appResult.page,
      limit: appResult.limit,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Solo ADMIN',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const appResult: UserResultDto = await this.getUserByIdUseCase.execute(id);
    return this.toResponse(appResult);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear usuario',
    description:
      'Solo ADMIN. Crea un nuevo usuario y asigna bodega si es OPERATOR',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya existe',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const command: CreateUserCommandDto = {
      email: dto.email,
      password: dto.password,
      role: dto.role,
      warehouseId: dto.warehouseId || null,
    };
    const appResult: UserResultDto =
      await this.createUserUseCase.execute(command);
    return this.toResponse(appResult);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Solo ADMIN. Permite cambiar email, rol y bodega',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const command: UpdateUserCommandDto = {
      email: dto.email,
      role: dto.role,
      warehouseId: dto.warehouseId,
    };
    const appResult: UserResultDto = await this.updateUserUseCase.execute(
      id,
      command,
    );
    return this.toResponse(appResult);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Solo ADMIN. Soft delete (marca como inactivo)',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuario eliminado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }

  private toResponse(result: UserResultDto): UserResponseDto {
    return {
      id: result.id,
      email: result.email,
      role: result.role,
      warehouseId: result.warehouseId,
      createdAt: result.createdAt,
    };
  }
}
