import { RefreshTokenUseCase } from '../refresh-token.use-case';
import { IUserRepository } from '../../../domain/ports/user.repository.port';
import { ITokenGenerator } from '../../ports/token-generator.port';
import { User } from '../../../domain/entities/user.entity';
import { InvalidRefreshTokenError, UserInactiveError } from '../../../domain/errors/auth.errors';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let tokenGenerator: jest.Mocked<ITokenGenerator>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    tokenGenerator = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      validateAccessToken: jest.fn(),
      validateRefreshToken: jest.fn(),
    };

    useCase = new RefreshTokenUseCase(userRepository, tokenGenerator);
  });

  describe('execute', () => {
    it('should return new tokens when refresh token is valid', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const userId = 'user-id';
      const user = User.create({
        id: userId,
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        warehouseId: null,
        createdAt: new Date(),
      });

      tokenGenerator.validateRefreshToken.mockReturnValue({ sub: userId });
      userRepository.findById.mockResolvedValue(user);
      tokenGenerator.generateAccessToken.mockReturnValue('new-access-token');
      tokenGenerator.generateRefreshToken.mockReturnValue('new-refresh-token');

      // Act
      const result = await useCase.execute(refreshToken);

      // Assert
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(tokenGenerator.validateRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw InvalidRefreshTokenError when token is invalid', async () => {
      // Arrange
      tokenGenerator.validateRefreshToken.mockReturnValue(null);

      // Act & Assert
      await expect(
        useCase.execute('invalid-token'),
      ).rejects.toThrow(InvalidRefreshTokenError);
    });

    it('should throw InvalidRefreshTokenError when user not found', async () => {
      // Arrange
      tokenGenerator.validateRefreshToken.mockReturnValue({ sub: 'user-id' });
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute('valid-token'),
      ).rejects.toThrow(InvalidRefreshTokenError);
    });

    it('should throw UserInactiveError when user is deleted', async () => {
      // Arrange
      const user = User.create({
        id: 'user-id',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        warehouseId: null,
        createdAt: new Date(),
        deletedAt: new Date(),
      });

      tokenGenerator.validateRefreshToken.mockReturnValue({ sub: 'user-id' });
      userRepository.findById.mockResolvedValue(user);

      // Act & Assert
      await expect(
        useCase.execute('valid-token'),
      ).rejects.toThrow(UserInactiveError);
    });
  });
});
