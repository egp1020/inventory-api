import { Test, TestingModule } from '@nestjs/testing';
import {
  GetWarehouseByIdUseCase,
  WAREHOUSE_REPOSITORY,
} from '../get-warehouse-by-id.use-case';
import { WarehouseResultDto } from '@warehouses/application/dtos';
import {
  Warehouse,
  Capacity,
  WarehouseNotFoundError,
} from '@warehouses/domain';
import { IWarehouseRepository } from '@warehouses/domain';

describe('GetWarehouseByIdUseCase', () => {
  let useCase: GetWarehouseByIdUseCase;
  let mockRepository: jest.Mocked<IWarehouseRepository>;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWarehouseByIdUseCase,
        { provide: WAREHOUSE_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<GetWarehouseByIdUseCase>(GetWarehouseByIdUseCase);
  });

  describe('execute', () => {
    it('should retrieve a warehouse by id', async () => {
      const warehouse = Warehouse.create(
        '123',
        'Test Warehouse',
        'Test Location',
        Capacity.create(5000),
      );

      mockRepository.findById.mockResolvedValue(warehouse);

      const result = await useCase.execute('123');

      expect(result).toBeInstanceOf(WarehouseResultDto);
      expect(result.name).toBe('Test Warehouse');
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error when warehouse not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent')).rejects.toThrow(
        WarehouseNotFoundError,
      );
    });
  });
});
