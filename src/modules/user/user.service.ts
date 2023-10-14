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
    // 注入jwt服务
    private jwtService: JwtService,
  ) {}

  /**
   *
   * @param createUserDto 用户信息体
   * @returns 新注册用户信息
   */
  async create(createUserDto: CreateUserDto) {
    const { username } = createUserDto;
    // 判断是否已存在用户
    const isExist = await this.userRepository.findOne({
      where: { username },
    });
    if (isExist) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      // 创建对象
      const newUser = await this.userRepository.create(createUserDto);
      // 返回新增的用户对象
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *
   * @returns all users
   */
  async findAll() {
    const result = await this.userRepository.find();
    return result;
  }

  /**
   *
   * @param id 用户id
   * @returns 指定id对应用户对象
   */
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  /**
   *
   */
  async findOneByName(username) {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   *
   * @param id 要更新的用户id
   * @param updateUserDto dto
   * @returns
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, updateUserDto);
    return result;
  }

  /**
   *
   * @param id 要删除数据id
   * @returns
   */
  async remove(id: number) {
    console.log('id', id);
    const result = await this.userRepository.delete(id);
    return result;
  }

  /**
   *
   * @param user 登录用户信息
   * @returns 返回token对象
   */
  async login(user: Partial<User>) {
    console.log('user', user);
    // 根据账号查找数据库看是否存在用户
    const isExist = await this.userRepository.findOne({
      where: { username: user.username },
    });
    console.log('isExist', isExist);
    if (!isExist) {
      throw new HttpException('用户名不存在', HttpStatus.BAD_REQUEST);
    }
    if (isExist.password !== user.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    // 登录成功返回token
    return token;
  }

  // 生成token函数
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }
}
