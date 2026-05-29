import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('AppLoggerMiddleware--use');
    next();
    console.log('AppLoggerMiddleware--use--end');
  }
}
