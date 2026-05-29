import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('getHello--handler');
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    console.log('test--handler');
    return 'test';
  }

  @Get('profile')
  profile(): string {
    console.log('profile--handler');
    return 'profile';
  }
}
