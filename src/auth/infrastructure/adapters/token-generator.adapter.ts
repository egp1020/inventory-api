import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator } from '../../application/ports/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    return (this.jwtService.sign as any)(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    } as any);
  }

  generateRefreshToken(payload: { sub: string }): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    return (this.jwtService.sign as any)(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    } as any);
  }

  validateRefreshToken(token: string): { sub: string } | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const result = (this.jwtService.verify as any)(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return { sub: result.sub };
    } catch {
      return null;
    }
  }

  validateAccessToken(token: string): {
    sub: string;
    email: string;
    role: string;
  } | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const result = (this.jwtService.verify as any)(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return { sub: result.sub, email: result.email, role: result.role };
    } catch {
      return null;
    }
  }
}
