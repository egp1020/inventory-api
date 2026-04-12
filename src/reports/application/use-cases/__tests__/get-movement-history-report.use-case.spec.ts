import { GetMovementHistoryReportUseCase } from '../get-movement-history-report.use-case';
import {
  MovementHistoryItemDto,
  MovementHistoryReportResultDto,
} from '@reports/application/dtos';
import { IReportRepository } from '@reports/application/ports';

describe('GetMovementHistoryReportUseCase', () => {
  let useCase: GetMovementHistoryReportUseCase;
  let mockRepository: Partial<IReportRepository>;

  beforeEach((): void => {
    // Arrange
    const mockMovements = [
      new MovementHistoryItemDto(
        'mov-1',
        'PROD001',
        'Laptop',
        'Almacén Central',
        'ENTRADA',
        100,
        'admin@example.com',
        'Compra proveedor A',
        new Date('2026-04-10'),
      ),
      new MovementHistoryItemDto(
        'mov-2',
        'PROD001',
        'Laptop',
        'Almacén Central',
        'SALIDA',
        30,
        'operator@example.com',
        'Venta cliente B',
        new Date('2026-04-11'),
      ),
    ];

    mockRepository = {
      getMovementHistoryReport: jest
        .fn()
        .mockResolvedValue(
          new MovementHistoryReportResultDto(mockMovements, 2, 1, 10, 1),
        ),
    };

    useCase = new GetMovementHistoryReportUseCase(
      mockRepository as IReportRepository,
    );
  });

  it('should get movement history report with default pagination', async () => {
    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('should filter by product id', async () => {
    // Act
    await useCase.execute('prod-123');

    // Assert
    expect(mockRepository.getMovementHistoryReport).toHaveBeenCalledWith(
      'prod-123',
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      10,
    );
  });

  it('should filter by warehouse id', async () => {
    // Act
    await useCase.execute(undefined, 'warehouse-456');

    // Assert
    expect(mockRepository.getMovementHistoryReport).toHaveBeenCalledWith(
      undefined,
      'warehouse-456',
      undefined,
      undefined,
      undefined,
      1,
      10,
    );
  });

  it('should filter by movement type', async () => {
    // Act
    await useCase.execute(undefined, undefined, 'ENTRADA');

    // Assert
    expect(mockRepository.getMovementHistoryReport).toHaveBeenCalledWith(
      undefined,
      undefined,
      'ENTRADA',
      undefined,
      undefined,
      1,
      10,
    );
  });

  it('should filter by date range', async () => {
    // Arrange
    const startDate = new Date('2026-04-01');
    const endDate = new Date('2026-04-30');

    // Act
    await useCase.execute(
      undefined,
      undefined,
      undefined,
      startDate,
      endDate,
      1,
      10,
    );

    // Assert
    expect(mockRepository.getMovementHistoryReport).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      startDate,
      endDate,
      1,
      10,
    );
  });

  it('should handle pagination', async () => {
    // Act
    await useCase.execute(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      2,
      20,
    );

    // Assert
    expect(mockRepository.getMovementHistoryReport).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      2,
      20,
    );
  });

  it('should handle multiple filters combined', async () => {
    // Arrange
    const startDate = new Date('2026-04-01');
    const endDate = new Date('2026-04-30');

    // Act
    await useCase.execute(
      'prod-123',
      'warehouse-456',
      'SALIDA',
      startDate,
      endDate,
      1,
      15,
    );

    // Assert
    expect(mockRepository.getMovementHistoryReport).toHaveBeenCalledWith(
      'prod-123',
      'warehouse-456',
      'SALIDA',
      startDate,
      endDate,
      1,
      15,
    );
  });

  it('should return empty results when no movements match', async () => {
    // Arrange
    mockRepository.getMovementHistoryReport = jest
      .fn()
      .mockResolvedValue(new MovementHistoryReportResultDto([], 0, 1, 10, 0));

    useCase = new GetMovementHistoryReportUseCase(
      mockRepository as IReportRepository,
    );

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
