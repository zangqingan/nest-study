// 全局日志中间件
import { Request, Response, NextFunction } from 'express';
export function globalLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`globalLogger-Request...before-${req.method} ${req.url}`);
  next();
  console.log(`globalLogger-Response...after-${req.method} ${req.url}`);
}
