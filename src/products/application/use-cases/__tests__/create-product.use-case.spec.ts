import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateProductUseCase,
  PRODUCT_REPOSITORY,
} from '../create-product.use-case';
import {
  CreateProductCommandDto,
  ProductResultDto,
} from '@products/application/dtos';
import { Product } from '@products/domain';
import { IProductRepository } from '@products/domain';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
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
        CreateProductUseCase,
        { provide: PRODUCT_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
  });

  describe('execute', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const command = new CreateProductCommandDto(
        'PROD001',
        'Laptop',
        'units',
        'High-end laptop',
        10,
      );

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result).toBeInstanceOf(ProductResultDto);
      expect(result.sku).toBe('PROD001');
      expect(result.name).toBe('Laptop');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create product with valid SKU format', async () => {
      // Arrange
      const command = new CreateProductCommandDto(
        'SKU-A1B2C3',
        'Mouse',
        'units',
      );

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.sku).toBe('SKU-A1B2C3');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should fail with invalid SKU', async () => {
      // Arrange
      const command = new CreateProductCommandDto(
        'ABC',
        'Invalid SKU',
        'units',
      );

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow();
    });
  });
});
