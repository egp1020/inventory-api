import { Test, TestingModule } from '@nestjs/testing';
import {
  ListProductsUseCase,
  PRODUCT_REPOSITORY,
} from '../list-products.use-case';
import { PaginatedProductResultDto } from '@products/application/dtos';
import { Product, SKU } from '@products/domain';
import { IProductRepository } from '@products/domain';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySKU: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProductsUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<ListProductsUseCase>(ListProductsUseCase);
  });

  describe('execute', () => {
    it('should list products with pagination', async () => {
      const product1 = Product.create(
        '1',
        SKU.create('PROD001'),
        'Product 1',
        'Desc 1',
        'units',
        5,
      );
      const product2 = Product.create(
        '2',
        SKU.create('PROD002'),
        'Product 2',
        'Desc 2',
        'items',
        10,
      );

      mockRepository.findAllPaginated.mockResolvedValue({
        data: [product1, product2],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await useCase.execute(1, 10);

      expect(result).toBeInstanceOf(PaginatedProductResultDto);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
