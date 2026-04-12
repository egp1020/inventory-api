import { Test, TestingModule } from '@nestjs/testing';
import {
  GetProductByIdUseCase,
  PRODUCT_REPOSITORY,
} from '../get-product-by-id.use-case';
import { ProductResultDto } from '@products/application/dtos';
import { Product, SKU, ProductNotFoundError } from '@products/domain';
import { IProductRepository } from '@products/domain';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
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
        GetProductByIdUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
  });

  describe('execute', () => {
    it('should retrieve a product by id', async () => {
      const product = Product.create(
        '123',
        SKU.create('TEST001'),
        'Test Product',
        'A test product',
        'units',
        5,
      );

      mockRepository.findById.mockResolvedValue(product);

      const result = await useCase.execute('123');

      expect(result).toBeInstanceOf(ProductResultDto);
      expect(result.sku).toBe('TEST001');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        ProductNotFoundError,
      );
    });
  });
});
