import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  HttpException,
  HttpStatus,
  UseFilters,
  BadRequestException,
  Version,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GuardGuard } from '../../common/guard/guard.guard';
import { TestInterceptor } from '../../common/interceptor/test.interceptor';
import { CustomValidatePipe } from '../../common/pip/custom-validate.pipe';
import { AllExceptionsFilter } from '../../common/filter/all-exceptions.filter';
import { Roles } from '../../common/decorator/roles.decorator';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @UseGuards(GuardGuard)
  @UseInterceptors(TestInterceptor)
  @UsePipes(CustomValidatePipe)
  @UseFilters(AllExceptionsFilter)
  findAll(@Query('name') name: string) {
    console.log('findAll', name);
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.userService.findAll();
  }

  @Get()
  @Version('2')
  @Roles('admin')
  @UseGuards(GuardGuard)
  @UseInterceptors(TestInterceptor)
  @UsePipes(CustomValidatePipe)
  @UseFilters(AllExceptionsFilter)
  findVersion2All(@Query('name') name: string) {
    console.log('findVersion2All', name);
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.userService.findVersion2All();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    throw new BadRequestException({ code: 1001, message: '用户名已存在' });
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // 单个文件上传
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      file,
    };
  }
}
