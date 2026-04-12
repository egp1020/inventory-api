import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '@products/domain';
import type { IProductRepository } from '@products/domain';
import { ProductResultDto, PRODUCT_REPOSITORY } from '@products/application';


/**
 * GetProductByIdUseCase
 * Depende de (ports): IProductRepository
 */
@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<ProductResultDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

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
