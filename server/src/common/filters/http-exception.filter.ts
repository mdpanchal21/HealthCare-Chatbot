import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw =
      exception instanceof HttpException ? exception.getResponse() : null;
    const details =
      typeof raw === 'object' && raw !== null
        ? (raw as Record<string, unknown>)
        : {};
    if (status >= 500)
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    response
      .status(status)
      .json({
        success: false,
        error: {
          code: String(
            details.code ??
              (status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'),
          ),
          message: String(
            details.message ??
              (status >= 500 ? 'Internal server error' : 'Request failed'),
          ),
        },
      });
  }
}
