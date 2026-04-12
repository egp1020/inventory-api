import { Test, TestingModule } from '@nestjs/testing';
import { CreateWarehouseUseCase, WAREHOUSE_REPOSITORY } from '../create-warehouse.use-case';
import {
  CreateWarehouseCommandDto,
  WarehouseResultDto,
} from '@warehouses/application/dtos';
import { Warehouse, Capacity } from '@warehouses/domain';
import { IWarehouseRepository } from '@warehouses/domain';

describe('CreateWarehouseUseCase', () => {
  let useCase: CreateWarehouseUseCase;
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
        CreateWarehouseUseCase,
        { provide: WAREHOUSE_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<CreateWarehouseUseCase>(CreateWarehouseUseCase);
  });

  describe('execute', () => {
    it('should create a warehouse successfully', async () => {
      const command = new CreateWarehouseCommandDto(
        'Main Warehouse',
        'Madrid',
        5000,
      );

      const result = await useCase.execute(command);

      expect(result).toBeInstanceOf(WarehouseResultDto);
      expect(result.name).toBe('Main Warehouse');
      expect(result.location).toBe('Madrid');
      expect(result.capacity).toBe(5000);
      expect(result.isActive).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create warehouse with valid capacity', async () => {
      const command = new CreateWarehouseCommandDto(
        'Secondary Warehouse',
        'Barcelona',
        10000,
      );

      const result = await useCase.execute(command);

      expect(result.capacity).toBe(10000);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should fail with invalid capacity', async () => {
      const command = new CreateWarehouseCommandDto(
        'Invalid Warehouse',
        'Valencia',
        0,
      );

      await expect(useCase.execute(command)).rejects.toThrow();
    });
  });
});
