import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
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
  CreateWarehouseUseCase,
  GetWarehouseByIdUseCase,
  UpdateWarehouseUseCase,
  ListWarehousesUseCase,
  DeleteWarehouseUseCase,
  CreateWarehouseCommandDto,
  UpdateWarehouseCommandDto,
} from '@warehouses/application';
import {
  CreateWarehouseRequestDto,
  UpdateWarehouseRequestDto,
  WarehouseResponseDto,
  PaginatedWarehouseResponseDto,
} from './dtos';

/**
 * WarehouseController
 * Maneja las peticiones HTTP relacionadas con bodegas
 * Solo ADMIN puede crear, actualizar o eliminar bodegas
 */
@ApiTags('Warehouses')
@ApiBearerAuth()
@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseController {
  constructor(
    private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    private readonly getWarehouseByIdUseCase: GetWarehouseByIdUseCase,
    private readonly updateWarehouseUseCase: UpdateWarehouseUseCase,
    private readonly listWarehousesUseCase: ListWarehousesUseCase,
    private readonly deleteWarehouseUseCase: DeleteWarehouseUseCase,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  async create(
    @Body() request: CreateWarehouseRequestDto,
  ): Promise<WarehouseResponseDto> {
    const command = new CreateWarehouseCommandDto(
      request.name,
      request.location,
      request.capacity,
    );
    const result = await this.createWarehouseUseCase.execute(command);
    return new WarehouseResponseDto(result);
  }

  @Get()
  @ApiOperation({ summary: 'List all warehouses with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Warehouses retrieved successfully',
    type: PaginatedWarehouseResponseDto,
  })
  async list(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedWarehouseResponseDto> {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const result = await this.listWarehousesUseCase.execute(pageNum, limitNum);
    return new PaginatedWarehouseResponseDto(
      result.data.map((w) => new WarehouseResponseDto(w)),
      result.page,
      result.limit,
      result.total,
      result.totalPages,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse retrieved successfully',
    type: WarehouseResponseDto,
  })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WarehouseResponseDto> {
    const result = await this.getWarehouseByIdUseCase.execute(id);
    return new WarehouseResponseDto(result);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
    type: WarehouseResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateWarehouseRequestDto,
  ): Promise<WarehouseResponseDto> {
    const command = new UpdateWarehouseCommandDto(
      request.name,
      request.location,
      request.capacity,
    );
    const result = await this.updateWarehouseUseCase.execute(id, command);
    return new WarehouseResponseDto(result);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Soft delete warehouse' })
  @ApiResponse({
    status: 204,
    description: 'Warehouse deleted successfully',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteWarehouseUseCase.execute(id);
  }
}
