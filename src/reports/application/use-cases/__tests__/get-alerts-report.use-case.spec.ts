import { GetAlertsReportUseCase } from '../get-alerts-report.use-case';
import { AlertItemDto, AlertsReportResultDto } from '@reports/application/dtos';
import { IReportRepository } from '@reports/application/ports';

describe('GetAlertsReportUseCase', () => {
  let useCase: GetAlertsReportUseCase;
  let mockRepository: Partial<IReportRepository>;

  beforeEach(async () => {
    // Arrange
    const mockAlerts = [
      new AlertItemDto(
        'prod-1',
        'PROD001',
        'Laptop',
        'warehouse-1',
        'Almacén Central',
        5,
        50,
      ),
      new AlertItemDto(
        'prod-2',
        'PROD002',
        'Monitor',
        'warehouse-1',
        'Almacén Central',
        2,
        30,
      ),
      new AlertItemDto(
        'prod-3',
        'PROD003',
        'Keyboard',
        'warehouse-2',
        'Almacén Norte',
        8,
        100,
      ),
    ];

    mockRepository = {
      getAlertsReport: jest
        .fn()
        .mockResolvedValue(new AlertsReportResultDto(mockAlerts)),
    };

    useCase = new GetAlertsReportUseCase(mockRepository);
  });

  it('should get alerts report', async () => {
    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.totalAlerts).toBe(3);
    expect(result.alerts).toHaveLength(3);
    expect(mockRepository.getAlertsReport).toHaveBeenCalled();
  });

  it('should calculate stock deficit correctly', async () => {
    // Act
    const result = await useCase.execute();

    // Assert
    const firstAlert = result.alerts[0];
    expect(firstAlert.stockDeficit).toBe(
      firstAlert.minStockAlert - firstAlert.currentStock,
    );
  });

  it('should identify critical stock (< 10% of minimum)', async () => {
    // Act
    const result = await useCase.execute();

    // Assert
    // Monitor has stock 2 of minimum 30 (6.7% < 10%)
    expect(result.criticalCount).toBeGreaterThan(0);
  });

  it('should sort alerts by stock deficit descending', async () => {
    // Act
    const result = await useCase.execute();

    // Assert
    for (let i = 0; i < result.alerts.length - 1; i++) {
      expect(result.alerts[i].stockDeficit).toBeGreaterThanOrEqual(
        result.alerts[i + 1].stockDeficit,
      );
    }
  });

  it('should handle no alerts scenario', async () => {
    // Arrange
    mockRepository.getAlertsReport = jest
      .fn()
      .mockResolvedValue(new AlertsReportResultDto([]));

    useCase = new GetAlertsReportUseCase(mockRepository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.totalAlerts).toBe(0);
    expect(result.alerts).toHaveLength(0);
    expect(result.criticalCount).toBe(0);
  });
});
