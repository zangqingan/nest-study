import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpStatus: number;
    let code: number;
    let message: string;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理我们自定义的业务异常或标准异常
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as any;
        code = res.code ?? httpStatus;
        message = res.message ?? exception.message;
        // 如果 message 是数组（如 ValidationPipe 的错误），转为字符串
        if (Array.isArray(message)) {
          message = message.join('; ');
        }
      } else {
        code = httpStatus;
        message = exceptionResponse as string;
      }
    } else {
      // 非 HTTP 异常（如程序 bug），记录详细日志，返回通用 500
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      code = httpStatus;
      message = '服务器内部错误';
      this.logger.error(
        `未知异常: ${request.method} ${request.url}`,
        (exception as Error).stack,
      );
    }

    // 统一日志（可加入 traceId）
    this.logger.warn(
      `[${httpStatus}] ${request.method} ${request.url} - ${message}`,
    );

    response.status(httpStatus).json({
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
