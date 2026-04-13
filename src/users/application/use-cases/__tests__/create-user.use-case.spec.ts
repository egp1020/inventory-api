import { CreateUserUseCase } from '../create-user.use-case';
import type { IUserRepository } from '../../../domain/ports/user.repository.port';
import type { IWarehouseValidator } from '../../../domain/ports/user.repository.port';
import type { IPasswordHasher } from '../../../../auth/application/ports/password-hasher.port';
import {
  UserAlreadyExistsError,
  WarehouseNotFoundError,
} from '../../../domain/errors/user.errors';
import { CreateUserCommandDto } from '../../dtos';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let warehouseValidator: jest.Mocked<IWarehouseValidator>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      existsByEmailExcludingId: jest.fn(),
    };

    warehouseValidator = {
      existsAndIsActive: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    useCase = new CreateUserUseCase(
      userRepository,
      passwordHasher,
      warehouseValidator,
    );
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue('hashed-password');

      const mockUser = {
        id: 'user-id',
        email: { getValue: () => 'new@example.com' },
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        warehouseId: null,
        createdAt: new Date(),
        deletedAt: null,
        isAdmin: () => true,
        isOperator: () => false,
        isActive: () => true,
        hasWarehouse: () => false,
        validateWarehouseAssignment: jest.fn(),
        with: jest.fn(),
      } as any;

      userRepository.create.mockResolvedValue(mockUser);

      const command: CreateUserCommandDto = {
        email: 'new@example.com',
        password: 'password123',
        role: 'ADMIN',
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe('new@example.com');
      expect(result.role).toBe('ADMIN');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'new@example.com',
      );
    });

    it('should throw UserAlreadyExistsError if email exists', async () => {
      // Arrange
      const existingUser = {
        id: 'user-id',
        email: { getValue: () => 'existing@example.com' },
        isActive: () => true,
      } as any;

      userRepository.findByEmail.mockResolvedValue(existingUser);

      const command: CreateUserCommandDto = {
        email: 'existing@example.com',
        password: 'password123',
        role: 'ADMIN',
      };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(
        UserAlreadyExistsError,
      );
    });

    it('should throw WarehouseNotFoundError if warehouse not found for OPERATOR', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      warehouseValidator.existsAndIsActive.mockResolvedValue(false);

      const command: CreateUserCommandDto = {
        email: 'operator@example.com',
        password: 'password123',
        role: 'OPERATOR',
        warehouseId: 'invalid-warehouse-id',
      };

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow(
        WarehouseNotFoundError,
      );
    });
  });
});
