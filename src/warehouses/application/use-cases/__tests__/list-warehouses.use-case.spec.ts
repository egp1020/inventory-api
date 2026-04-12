import { Test, TestingModule } from '@nestjs/testing';
import { ListWarehousesUseCase, WAREHOUSE_REPOSITORY } from '../list-warehouses.use-case';
import { PaginatedWarehouseResultDto } from '@warehouses/application/dtos';
import { Warehouse, Capacity } from '@warehouses/domain';
import { IWarehouseRepository } from '@warehouses/domain';

describe('ListWarehousesUseCase', () => {
  let useCase: ListWarehousesUseCase;
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
        ListWarehousesUseCase,
        { provide: WAREHOUSE_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<ListWarehousesUseCase>(ListWarehousesUseCase);
  });

  describe('execute', () => {
    it('should list warehouses with pagination', async () => {
      const warehouse1 = Warehouse.create(
        '1',
        'Warehouse 1',
        'Location 1',
        Capacity.create(5000),
      );
      const warehouse2 = Warehouse.create(
        '2',
        'Warehouse 2',
        'Location 2',
        Capacity.create(3000),
      );

      mockRepository.findAllPaginated.mockResolvedValue({
        data: [warehouse1, warehouse2],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await useCase.execute(1, 10);

      expect(result).toBeInstanceOf(PaginatedWarehouseResultDto);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });
  });
});
