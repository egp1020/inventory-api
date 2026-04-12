import { Module } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { ProductRepositoryAdapter } from '@products/infrastructure/adapters';
import {
  CreateProductUseCase,
  GetProductByIdUseCase,
  UpdateProductUseCase,
  ListProductsUseCase,
  DeleteProductUseCase,
  PRODUCT_REPOSITORY,
} from '@products/application';
import { ProductController } from './products.controller';

@Module({
  controllers: [ProductController],
  providers: [
    PrismaService,
    ProductRepositoryAdapter,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryAdapter,
    },
    CreateProductUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    ListProductsUseCase,
    DeleteProductUseCase,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
