import { PRODUCT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Product, SKU } from '@products/domain';
import type { IProductRepository } from '@products/domain';
import {
  CreateProductCommandDto,
  ProductResultDto,
} from '@products/application/dtos';

/**
 * CreateProductUseCase
 * Depende de (ports): IProductRepository
 */
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateProductCommandDto): Promise<ProductResultDto> {
    const sku = SKU.create(command.sku);
    const product = Product.create(
      randomUUID(),
      sku,
      command.name,
      command.description || null,
      command.unit,
      command.minStockAlert ?? 0,
    );

    await this.productRepository.save(product);

    return this.mapToResultDto(product);
  }

  private mapToResultDto(product: Product): ProductResultDto {
    return new ProductResultDto(
      product.getId(),
      product.getSKUValue(),
      product.getName(),
      product.getDescription(),
      product.getUnit(),
      product.getMinStockAlert(),
      product.getCreatedAt(),
      product.getDeletedAt(),
    );
  }
}

export { PRODUCT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
