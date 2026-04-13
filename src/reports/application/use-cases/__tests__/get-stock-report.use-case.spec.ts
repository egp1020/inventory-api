import { GetStockReportUseCase } from '../get-stock-report.use-case';
import {
  StockReportItemDto,
  StockReportResultDto,
} from '@reports/application/dtos';
import { IReportRepository } from '@reports/application/ports';

describe('GetStockReportUseCase', () => {
  let useCase: GetStockReportUseCase;
  let mockRepository: Partial<IReportRepository>;

  beforeEach(async () => {
    // Arrange
    const mockItems = [
      new StockReportItemDto('prod-1', 'PROD001', 'Laptop', 150, 50),
      new StockReportItemDto('prod-2', 'PROD002', 'Monitor', 20, 30),
      new StockReportItemDto('prod-3', 'PROD003', 'Keyboard', 200, 100),
    ];

    mockRepository = {
      getStockReport: jest
        .fn()
        .mockResolvedValue(
          new StockReportResultDto('warehouse-1', 'Almacén Central', mockItems),
        ),
    };

    useCase = new GetStockReportUseCase(mockRepository);
  });

  it('should get stock report for a warehouse', async () => {
    // Act
    const result = await useCase.execute('warehouse-1');

    // Assert
    expect(result).toBeDefined();
    expect(result.warehouseId).toBe('warehouse-1');
    expect(result.warehouseName).toBe('Almacén Central');
    expect(result.items).toHaveLength(3);
    expect(result.totalProducts).toBe(3);
    expect(mockRepository.getStockReport).toHaveBeenCalledWith('warehouse-1');
  });

  it('should identify low stock items correctly', async () => {
    // Act
    const result = await useCase.execute('warehouse-1');

    // Assert
    const lowStockItems = result.items.filter((i) => i.isLowStock);
    expect(lowStockItems).toHaveLength(1);
    expect(lowStockItems[0].productName).toBe('Monitor');
    expect(result.lowStockCount).toBe(1);
  });

  it('should handle warehouse with no products', async () => {
    // Arrange
    mockRepository.getStockReport = jest
      .fn()
      .mockResolvedValue(
        new StockReportResultDto('warehouse-empty', 'Almacén Vacío', []),
      );

    useCase = new GetStockReportUseCase(mockRepository);

    // Act
    const result = await useCase.execute('warehouse-empty');

    // Assert
    expect(result.totalProducts).toBe(0);
    expect(result.lowStockCount).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('should throw error if warehouse not found', async () => {
    // Arrange
    mockRepository.getStockReport = jest
      .fn()
      .mockRejectedValue(new Error('Warehouse not found'));

    useCase = new GetStockReportUseCase(mockRepository);

    // Act & Assert
    await expect(useCase.execute('invalid-warehouse')).rejects.toThrow(
      'Warehouse not found',
    );
  });
});
