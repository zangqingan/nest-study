// 全局日志中间件
import { Request, Response, NextFunction } from 'express';
export function globalLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`globalLogger-Request...${req.method} ${req.url}`);
  next();
  console.log('after');
}
