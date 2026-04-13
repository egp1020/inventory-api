import { PRODUCT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '@products/domain';
import {
  PaginatedProductResultDto,
  ProductResultDto,
} from '@products/application/dtos';

/**
 * ListProductsUseCase
 * Depende de (ports): IProductRepository
 */
@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<PaginatedProductResultDto> {
    const result = await this.productRepository.findAllPaginated(page, limit);

    const data = result.data.map((product) => this.mapToResultDto(product));

    return new PaginatedProductResultDto(
      data,
      result.page,
      result.limit,
      result.total,
    );
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

export { PRODUCT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
