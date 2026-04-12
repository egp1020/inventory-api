import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
  BadRequestException,
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
import {
  RegisterMovementUseCase,
  ListMovementsUseCase,
  RegisterMovementCommandDto,
} from '@movements/application';
import {
  RegisterMovementRequestDto,
  MovementResponseDto,
  PaginatedMovementResponseDto,
} from './dtos';

/**
 * MovementsController
 * Maneja peticiones HTTP para movimientos de inventario
 * OPERATOR: registra movimientos en su bodega
 * ADMIN: lista todos los movimientos
 */
@ApiTags('Movements')
@ApiBearerAuth()
@Controller('movements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MovementsController {
  constructor(
    private readonly registerMovementUseCase: RegisterMovementUseCase,
    private readonly listMovementsUseCase: ListMovementsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new stock movement (entry or exit)' })
  @ApiResponse({
    status: 201,
    description: 'Movement registered successfully',
    type: MovementResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Insufficient stock for exit movement',
  })
  async register(
    @Body() request: RegisterMovementRequestDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any,
  ): Promise<MovementResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User not found in request');
    }

    const command = new RegisterMovementCommandDto(
      request.productId,
      request.warehouseId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      userId,
      request.type,
      request.quantity,
      request.notes,
    );

    const result = await this.registerMovementUseCase.execute(command);
    return new MovementResponseDto(result);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'List movements with optional filters',
    description: 'Only ADMIN can list all movements',
  })
  @ApiResponse({
    status: 200,
    description: 'Movements retrieved successfully',
    type: PaginatedMovementResponseDto,
  })
  async list(
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedMovementResponseDto> {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const result = await this.listMovementsUseCase.execute(
      productId,
      warehouseId,
      type,
      start,
      end,
      pageNum,
      limitNum,
    );

    return new PaginatedMovementResponseDto(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      result.data.map((m) => new MovementResponseDto(m)),
      result.page,
      result.limit,
      result.total,
      result.totalPages,
    );
  }
}
