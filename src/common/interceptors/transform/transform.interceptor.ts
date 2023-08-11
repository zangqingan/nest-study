/**
 * 数据返回拦截器-对请求成功(状态码为 2xx)的数据在返回给前台前进行一个统一的格式化处理
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          msg: '请求成功',
        };
      }),
    );
  }
}
