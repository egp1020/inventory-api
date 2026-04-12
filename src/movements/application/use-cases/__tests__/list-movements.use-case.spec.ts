import { ListMovementsUseCase } from '../list-movements.use-case';
import { IMovementRepository } from '@movements/domain/ports';
import { Movement, MovementType } from '@movements/domain';

describe('ListMovementsUseCase', () => {
  let useCase: ListMovementsUseCase;
  let mockRepository: Partial<IMovementRepository>;

  beforeEach((): void => {
    // Arrange
    const mockMovements = [
      Movement.restore(
        'mov-1',
        'prod-123',
        'warehouse-456',
        'user-789',
        MovementType.ENTRADA,
        100,
        'Primer envío',
        new Date(),
      ),
      Movement.restore(
        'mov-2',
        'prod-123',
        'warehouse-456',
        'user-789',
        MovementType.SALIDA,
        30,
        'Venta',
        new Date(),
      ),
    ];

    mockRepository = {
      listMovements: jest.fn().mockResolvedValue({
        data: mockMovements,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
    };

    useCase = new ListMovementsUseCase(mockRepository as IMovementRepository);
  });

  it('should list all movements with default pagination', async () => {
    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(mockRepository.listMovements).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      10,
    );
  });

  it('should list movements with filters', async () => {
    // Act
    await useCase.execute(
      'prod-123',
      'warehouse-456',
      'ENTRADA',
      undefined,
      undefined,
      1,
      5,
    );

    // Assert
    expect(mockRepository.listMovements).toHaveBeenCalledWith(
      'prod-123',
      'warehouse-456',
      'ENTRADA',
      undefined,
      undefined,
      1,
      5,
    );
  });

  it('should list movements with date range', async () => {
    // Arrange
    const startDate = new Date('2026-01-01');
    const endDate = new Date('2026-12-31');

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
    expect(mockRepository.listMovements).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      startDate,
      endDate,
      1,
      10,
    );
  });

  it('should handle pagination correctly', async () => {
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
    expect(mockRepository.listMovements).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      2,
      20,
    );
  });

  it('should return empty result when no movements found', async () => {
    // Arrange
    mockRepository.listMovements = jest.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });

    useCase = new ListMovementsUseCase(mockRepository as IMovementRepository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
