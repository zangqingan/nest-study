import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CliLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('CliLoggerMiddleware--use');
    next();
    console.log('CliLoggerMiddleware--use--end');
  }
}
