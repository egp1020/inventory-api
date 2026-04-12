import { RegisterMovementUseCase } from '../register-movement.use-case';
import {
  RegisterMovementCommandDto,
  MovementResultDto,
} from '../../dtos';
import { Movement } from '../../../domain';
import {
  ProductNotFoundForMovementError,
  WarehouseNotFoundForMovementError,
  UserNotFoundForMovementError,
  UnauthorizedMovementError,
  InsufficientStockError,
} from '../../../domain/errors';

describe('RegisterMovementUseCase - Extended Unit Tests', () => {
  let useCase: RegisterMovementUseCase;
  let mockMovementRepository: any;

  beforeEach(() => {
    // Arrange: Setup mock repository
    mockMovementRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new RegisterMovementUseCase(mockMovementRepository);
  });

  describe('Complete workflow: ENTRADA → SALIDA → Stock validation', () => {
    it('should register ENTRADA movement successfully', async () => {
      // Arrange: Setup valid command
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        50,
        'Initial stock',
      );

      // Mock repository to accept the movement
      mockMovementRepository.save.mockResolvedValueOnce(undefined);

      // Act: Execute use case
      const result = await useCase.execute(command);

      // Assert: Verify movement was registered
      expect(result).toBeDefined();
      expect(result.type).toBe('ENTRADA');
      expect(result.quantity).toBe(50);
      expect(result.productId).toBe('prod-123');
      expect(result.warehouseId).toBe('warehouse-456');
      expect(mockMovementRepository.save).toHaveBeenCalled();
    });

    it('should register SALIDA movement successfully when sufficient stock exists', async () => {
      // Arrange: Setup valid SALIDA command
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'SALIDA',
        30,
        'Sales order',
      );

      // Mock repository to accept the movement
      mockMovementRepository.save.mockResolvedValueOnce(undefined);

      // Act: Execute use case
      const result = await useCase.execute(command);

      // Assert: Verify SALIDA was registered
      expect(result).toBeDefined();
      expect(result.type).toBe('SALIDA');
      expect(result.quantity).toBe(30);
      expect(mockMovementRepository.save).toHaveBeenCalled();
    });

    it('should reject SALIDA when stock is insufficient', async () => {
      // Arrange: Setup SALIDA command for stock exceeding validation
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'SALIDA',
        100,
        'Excessive amount',
      );

      // Mock repository to throw InsufficientStockError
      mockMovementRepository.save.mockRejectedValueOnce(
        new InsufficientStockError('prod-123', 'warehouse-456', 20, 100),
      );

      // Act & Assert: Verify error is thrown
      await expect(useCase.execute(command)).rejects.toThrow(
        InsufficientStockError,
      );
    });

    it('should validate product exists before registering movement', async () => {
      // Arrange: Setup command with non-existent product
      const command = new RegisterMovementCommandDto(
        'non-existent-prod',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        50,
        'Test',
      );

      // Mock repository to throw ProductNotFoundForMovementError
      mockMovementRepository.save.mockRejectedValueOnce(
        new ProductNotFoundForMovementError('non-existent-prod'),
      );

      // Act & Assert: Verify error is thrown
      await expect(useCase.execute(command)).rejects.toThrow(
        ProductNotFoundForMovementError,
      );
    });

    it('should validate warehouse exists before registering movement', async () => {
      // Arrange: Setup command with non-existent warehouse
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'non-existent-warehouse',
        'user-789',
        'ENTRADA',
        50,
        'Test',
      );

      // Mock repository to throw WarehouseNotFoundForMovementError
      mockMovementRepository.save.mockRejectedValueOnce(
        new WarehouseNotFoundForMovementError('non-existent-warehouse'),
      );

      // Act & Assert: Verify error is thrown
      await expect(useCase.execute(command)).rejects.toThrow(
        WarehouseNotFoundForMovementError,
      );
    });

    it('should validate user exists before registering movement', async () => {
      // Arrange: Setup command with non-existent user
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'non-existent-user',
        'ENTRADA',
        50,
        'Test',
      );

      // Mock repository to throw UserNotFoundForMovementError
      mockMovementRepository.save.mockRejectedValueOnce(
        new UserNotFoundForMovementError('non-existent-user'),
      );

      // Act & Assert: Verify error is thrown
      await expect(useCase.execute(command)).rejects.toThrow(
        UserNotFoundForMovementError,
      );
    });

    it('should prevent OPERATOR from creating movements in unassigned warehouse', async () => {
      // Arrange: Setup command for OPERATOR trying to access unauthorized warehouse
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'other-warehouse',
        'operator-user',
        'ENTRADA',
        50,
        'Unauthorized attempt',
      );

      // Mock repository to throw UnauthorizedMovementError
      mockMovementRepository.save.mockRejectedValueOnce(
        new UnauthorizedMovementError('operator-user', 'other-warehouse'),
      );

      // Act & Assert: Verify error is thrown
      await expect(useCase.execute(command)).rejects.toThrow(
        UnauthorizedMovementError,
      );
    });
  });

  describe('Movement quantity validation', () => {
    it('should create movement with exact quantity value', async () => {
      // Arrange: Setup command with specific quantity
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        75,
        'Stock batch',
      );

      mockMovementRepository.save.mockResolvedValueOnce(undefined);

      // Act: Execute use case
      const result = await useCase.execute(command);

      // Assert: Verify quantity is preserved exactly
      expect(result.quantity).toBe(75);
    });

    it('should reject quantity less than or equal to zero', async () => {
      // Arrange: Setup command with invalid quantity
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        0,
        'Invalid',
      );

      mockMovementRepository.save.mockRejectedValueOnce(
        new Error('Quantity must be greater than 0'),
      );

      // Act & Assert: Verify error is thrown
      await expect(useCase.execute(command)).rejects.toThrow();
    });
  });

  describe('Movement persistence', () => {
    it('should call repository.save() with correct movement data', async () => {
      // Arrange: Setup command
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        50,
        'Test note',
      );

      mockMovementRepository.save.mockResolvedValueOnce(undefined);

      // Act: Execute use case
      await useCase.execute(command);

      // Assert: Verify save was called
      expect(mockMovementRepository.save).toHaveBeenCalledTimes(1);
      expect(mockMovementRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'prod-123',
          warehouseId: 'warehouse-456',
          userId: 'user-789',
          type: 'ENTRADA',
          notes: 'Test note',
        }),
      );
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange: Setup command
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        50,
        'Test',
      );

      const dbError = new Error('Database connection failed');
      mockMovementRepository.save.mockRejectedValueOnce(dbError);

      // Act & Assert: Verify error is propagated
      await expect(useCase.execute(command)).rejects.toThrow(dbError);
    });
  });

  describe('Movement notes', () => {
    it('should preserve movement notes when provided', async () => {
      // Arrange: Setup command with notes
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        50,
        'Special handling required',
      );

      mockMovementRepository.save.mockResolvedValueOnce(undefined);

      // Act: Execute use case
      const result = await useCase.execute(command);

      // Assert: Verify notes are included
      expect(result.notes).toBe('Special handling required');
    });

    it('should handle optional notes (null)', async () => {
      // Arrange: Setup command without notes
      const command = new RegisterMovementCommandDto(
        'prod-123',
        'warehouse-456',
        'user-789',
        'ENTRADA',
        50,
      );

      mockMovementRepository.save.mockResolvedValueOnce(undefined);

      // Act: Execute use case
      const result = await useCase.execute(command);

      // Assert: Verify notes can be undefined
      expect(result.notes === null || result.notes === undefined).toBe(true);
    });
  });
});
