import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFoundError, ProductHasMovementsError } from '@products/domain';
import type { IProductRepository } from '@products/domain';
import { PRODUCT_REPOSITORY } from '@products/application';


/**
 * DeleteProductUseCase
 * Realiza soft delete (marca como eliminada)
 * Valida que el producto no tenga movimientos asociados
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

    // Verificar si el producto tiene movimientos
    const hasMovements = await this.productRepository.hasMovements(id);
    if (hasMovements) {
      throw new ProductHasMovementsError(id);
    }

    product.softDelete();
    await this.productRepository.save(product);
  }
}

export { PRODUCT_REPOSITORY };
