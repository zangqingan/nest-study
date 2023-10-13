import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
//  测试拦截器
import { TestInterceptor } from 'src/common/interceptors/test/test.interceptor';
// 是否登录
import { LoginAuthGuard } from '../../common/guards/loginAuth.guard';

@ApiTags('用户') // swagger文档标题
@Controller('user') // 路由前缀
// @UseInterceptors(TestInterceptor) // 控制器作用域拦截器
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  @UseGuards(LoginAuthGuard)
  @UseInterceptors(TestInterceptor) // 方法作用域拦截器
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '根据id获取指定用户' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: '根据id更新用户' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '根据id删除指定用户' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @ApiOperation({ summary: '用户登陆' })
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  login(@Body() user: LoginDto) {
    return this.userService.login(user);
  }

  @ApiOperation({ summary: '是否已登录测试' })
  @UseGuards(AuthGuard('local'))
  @Post('test')
  test() {
    return 1;
  }
}
