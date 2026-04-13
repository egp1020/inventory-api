import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const res = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        data,
        message: 'OK',
        statusCode: res.statusCode,
      })),
    );
  }
}
