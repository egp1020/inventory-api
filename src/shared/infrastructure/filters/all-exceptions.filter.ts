import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  DomainError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableError,
} from '@shared/domain/errors/domain.errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolve(exception);

    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      data: null,
      message,
      statusCode,
    });
  }

  private resolve(exception: unknown): { statusCode: number; message: string } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'object' && 'message' in res
          ? Array.isArray((res as any).message)
            ? (res as any).message.join('; ')
            : String((res as any).message)
          : String(res);
      return { statusCode: exception.getStatus(), message };
    }

    if (exception instanceof DomainError) {
      const map: Record<string, number> = {
        UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
        FORBIDDEN: HttpStatus.FORBIDDEN,
        NOT_FOUND: HttpStatus.NOT_FOUND,
        CONFLICT: HttpStatus.CONFLICT,
        UNPROCESSABLE: HttpStatus.UNPROCESSABLE_ENTITY,
      };
      return {
        statusCode: map[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    };
  }
}
