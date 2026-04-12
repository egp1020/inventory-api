import { LoginUseCase } from '../login.use-case';
import { IUserRepository } from '../../../domain/ports/user.repository.port';
import { IPasswordHasher } from '../../ports/password-hasher.port';
import { ITokenGenerator } from '../../ports/token-generator.port';
import { User } from '../../../domain/entities/user.entity';
import { InvalidCredentialsError, UserInactiveError } from '../../../domain/errors/auth.errors';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordHasher: jest.Mocked<IPasswordHasher>;
  let tokenGenerator: jest.Mocked<ITokenGenerator>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    tokenGenerator = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      validateAccessToken: jest.fn(),
      validateRefreshToken: jest.fn(),
    };

    useCase = new LoginUseCase(userRepository, passwordHasher, tokenGenerator);
  });

  describe('execute', () => {
    it('should return tokens when credentials are valid', async () => {
      // Arrange
      const email = 'admin@test.com';
      const password = 'password123';
      const user = User.create({
        id: '1',
        email,
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        warehouseId: null,
        createdAt: new Date(),
      });

      userRepository.findByEmail.mockResolvedValue(user);
      passwordHasher.compare.mockResolvedValue(true);
      tokenGenerator.generateAccessToken.mockReturnValue('access-token');
      tokenGenerator.generateRefreshToken.mockReturnValue('refresh-token');

      // Act
      const result = await useCase.execute(email, password);

      // Assert
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(passwordHasher.compare).toHaveBeenCalledWith(password, 'hashed-password');
    });

    it('should throw InvalidCredentialsError when user not found', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute('nonexistent@test.com', 'password123'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw InvalidCredentialsError when password is invalid', async () => {
      // Arrange
      const user = User.create({
        id: '1',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        warehouseId: null,
        createdAt: new Date(),
      });

      userRepository.findByEmail.mockResolvedValue(user);
      passwordHasher.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(
        useCase.execute('admin@test.com', 'wrong-password'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw UserInactiveError when user is deleted', async () => {
      // Arrange
      const user = User.create({
        id: '1',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        warehouseId: null,
        createdAt: new Date(),
        deletedAt: new Date(),
      });

      userRepository.findByEmail.mockResolvedValue(user);

      // Act & Assert
      await expect(
        useCase.execute('admin@test.com', 'password123'),
      ).rejects.toThrow(UserInactiveError);
    });
  });
});
