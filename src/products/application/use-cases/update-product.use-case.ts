import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '@products/domain';
import type { IProductRepository } from '@products/domain';
import {
  UpdateProductCommandDto,
  ProductResultDto,
  PRODUCT_REPOSITORY,
} from '@products/application';


/**
 * UpdateProductUseCase
 * Depende de (ports): IProductRepository
 */
@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    command: UpdateProductCommandDto,
  ): Promise<ProductResultDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    if (command.name) {
      product.setName(command.name);
    }

    if (command.description !== undefined) {
      product.setDescription(command.description);
    }

    if (command.unit) {
      product.setUnit(command.unit);
    }

    if (command.minStockAlert !== undefined) {
      product.setMinStockAlert(command.minStockAlert);
    }

    await this.productRepository.save(product);

    return this.mapToResultDto(product);
  }

  private mapToResultDto(product: any): ProductResultDto {
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

export { PRODUCT_REPOSITORY };
