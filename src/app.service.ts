import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  create(): string {
    return 'createUser';
  }
  getUser(): string {
    return 'getUser';
  }
  update(): string {
    return 'update';
  }
}
