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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// 自定义AuthGuard
import { LocalAuthGuard } from '../../common/guards/local.auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
//  测试拦截器
import { TestInterceptor } from 'src/common/interceptors/test/test.interceptor';
// 是否登录
import { LoginAuthGuard } from '../../common/guards/loginAuth.guard';
import { User } from './entities/user.entity';

@ApiTags('用户') // swagger文档标题
@Controller('user') // 路由前缀
// @UseInterceptors(TestInterceptor) // 控制器作用域拦截器
@UseInterceptors(ClassSerializerInterceptor) //过滤掉如 @Exclude()装饰器装饰的属性
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '获取所有用户' })
  @Get()
  @UseGuards(LoginAuthGuard) // 自定义登录验证守卫
  @UseInterceptors(TestInterceptor) // 方法作用域拦截器
  findAll() {
    console.log('findAll');
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
  @UseGuards(LocalAuthGuard) // 增加登录导航校验
  @Post('login')
  login(@Req() req) {
    return this.userService.login(req);
  }

  @ApiOperation({ summary: '是否已登录测试' })
  @UseGuards(AuthGuard('local'))
  @Post('test')
  test() {
    return 1;
  }
}
