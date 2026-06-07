import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JsonReaderService } from '../../shared/json-reader.service';

@Injectable()
export class UserService {
  constructor(private readonly jsonReaderService: JsonReaderService) {}

  // 用户注册
  async register(createUserDto: CreateUserDto) {
    const user: User[] = await this.jsonReaderService.readJsonFile();
    console.log('当前用户数据:', user);
    // 检查用户名是否存在
    const existingUser = user.find(
      (u) => u.username === createUserDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('该用户名已被使用');
    }
    // 注册新用户
    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;
    user.push(newUser);
    await this.jsonReaderService.writeJsonFile(user);
    return newUser;
  }

  // 用户登录
  async login(createUserDto: CreateUserDto) {
    const user: User[] = await this.jsonReaderService.readJsonFile();
    const existingUser = user.find(
      (u) => u.username === createUserDto.username,
    );
    if (!existingUser) {
      throw new BadRequestException('用户名不存在');
    }
    if (createUserDto.password !== existingUser.password) {
      throw new BadRequestException('密码错误');
    }
    return { message: '登录成功' };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
