import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GuardGuard } from './common/guard/guard.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(GuardGuard)
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
