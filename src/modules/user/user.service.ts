import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // jwt服务
    private jwtService: JwtService,
  ) {}

  /**
   *
   * @param createUserDto 用户信息
   * @returns 新注册用户信息
   */
  async create(createUserDto: CreateUserDto) {
    const { username } = createUserDto;
    // 判断是否已存在用户
    const isExist = await this.userRepository.findOne({
      where: { username },
    });
    console.log('isExist', isExist);
    if (isExist) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      // 写入数据库
      const newUser = await this.userRepository.create(createUserDto);
      // 返回
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const result = await this.userRepository.find();
    return `This action returns all user${result}`;
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

  // 生成token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }
  async login(user: Partial<User>) {
    console.log('user', user);
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return { token };
  }

  getUser(user: Partial<User>) {
    console.log('user', user);
    return `This action returns all user`;
  }
}
