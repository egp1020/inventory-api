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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@shared/infrastructure/decorators/roles.decorator';
import {
  CreateProductUseCase,
  GetProductByIdUseCase,
  UpdateProductUseCase,
  ListProductsUseCase,
  DeleteProductUseCase,
  CreateProductCommandDto,
  UpdateProductCommandDto,
} from '@products/application';
import {
  CreateProductRequestDto,
  UpdateProductRequestDto,
  ProductResponseDto,
  PaginatedProductResponseDto,
} from './dtos';

/**
 * ProductController
 * Maneja las peticiones HTTP relacionadas con productos
 * Solo ADMIN puede crear, actualizar o eliminar productos
 */
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  async create(
    @Body() request: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const command = new CreateProductCommandDto(
      request.sku,
      request.name,
      request.unit,
      request.description,
      request.minStockAlert,
    );
    const result = await this.createProductUseCase.execute(command);
    return new ProductResponseDto(result);
  }

  @Get()
  @ApiOperation({ summary: 'List all products with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: PaginatedProductResponseDto,
  })
  async list(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedProductResponseDto> {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const result = await this.listProductsUseCase.execute(pageNum, limitNum);
    return new PaginatedProductResponseDto(
      result.data.map((p) => new ProductResponseDto(p)),
      result.page,
      result.limit,
      result.total,
      result.totalPages,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    const result = await this.getProductByIdUseCase.execute(id);
    return new ProductResponseDto(result);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const command = new UpdateProductCommandDto(
      request.name,
      request.description,
      request.unit,
      request.minStockAlert,
    );
    const result = await this.updateProductUseCase.execute(id, command);
    return new ProductResponseDto(result);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Soft delete product' })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
