import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

export enum CustomErrorCode {
  USER_NOTEXIST = 10002, // 用户不存在
  USER_EXIST = 10003, //用户已存在
}

@Catch()
export class TestExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
