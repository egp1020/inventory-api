import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '@products/domain';
import type { IProductRepository } from '@products/domain';

const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

/**
 * DeleteProductUseCase
 * Realiza soft delete (marca como eliminada)
 * Depende de (ports): IProductRepository
 */
@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundError(id);
    }

    product.softDelete();
    await this.productRepository.save(product);
  }
}

export { PRODUCT_REPOSITORY };
