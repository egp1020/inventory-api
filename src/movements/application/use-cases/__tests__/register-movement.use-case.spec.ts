import { RegisterMovementUseCase } from '../register-movement.use-case';
import { RegisterMovementCommandDto } from '@movements/application/dtos';
import { MovementType, InsufficientStockError } from '@movements/domain';
import { IMovementRepository } from '@movements/domain/ports';

describe('RegisterMovementUseCase', () => {
  let useCase: RegisterMovementUseCase;
  let mockRepository: Partial<IMovementRepository>;

  beforeEach(() => {
    // Arrange
    mockRepository = {
      save: jest.fn(),
    };

    // Instanciar directamente sin Testing Module
    useCase = new RegisterMovementUseCase(mockRepository);
  });

  it('should register an ENTRADA movement successfully', async () => {
    // Arrange
    const command = new RegisterMovementCommandDto(
      'prod-123',
      'warehouse-456',
      'user-789',
      MovementType.ENTRADA,
      50,
      'Primera recepción',
    );

    // Act
    const result = await useCase.execute(command);

    // Assert
    expect(result).toBeDefined();
    expect(result.productId).toBe('prod-123');
    expect(result.warehouseId).toBe('warehouse-456');
    expect(result.type).toBe('ENTRADA');
    expect(result.quantity).toBe(50);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should register a SALIDA movement successfully', async () => {
    // Arrange
    const command = new RegisterMovementCommandDto(
      'prod-123',
      'warehouse-456',
      'user-789',
      MovementType.SALIDA,
      30,
      'Venta cliente XYZ',
    );

    // Act
    const result = await useCase.execute(command);

    // Assert
    expect(result).toBeDefined();
    expect(result.type).toBe('SALIDA');
    expect(result.quantity).toBe(30);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should handle movement with optional notes', async () => {
    // Arrange
    const command = new RegisterMovementCommandDto(
      'prod-123',
      'warehouse-456',
      'user-789',
      MovementType.ENTRADA,
      100,
    );

    // Act
    const result = await useCase.execute(command);

    // Assert
    expect(result.notes).toBeNull();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw error if repository.save fails', async () => {
    // Arrange
    mockRepository.save = jest
      .fn()
      .mockRejectedValue(
        new InsufficientStockError('prod-123', 'warehouse-456', 10, 50),
      );

    const command = new RegisterMovementCommandDto(
      'prod-123',
      'warehouse-456',
      'user-789',
      MovementType.SALIDA,
      50,
    );

    // Act & Assert
    await expect(useCase.execute(command)).rejects.toThrow(
      InsufficientStockError,
    );
  });
});
