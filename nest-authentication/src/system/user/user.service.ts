import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUser } from './entities/user.entity';
import {
  CreateUserDto,
  LoginUserDto,
  RegisterUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private readonly userRepository: Repository<SysUser>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { loginName: loginUserDto.username },
    });
    if (!user) {
      throw new HttpException('用户名不存在', HttpStatus.UNAUTHORIZED);
    }
    if (user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
    }
    const payload = { userId: user.userId, userName: user.userName };
    return this.generateJwt(payload);
  }
  async generateJwt(payload: any) {
    const newPayload = { userId: payload.userId, userName: payload.userName };
    const access_token = await this.jwtService.sign({
      ...newPayload,
      expiresIn: '60s',
    });
    const refresh_token = await this.jwtService.sign({
      ...newPayload,
      expiresIn: '1h',
    });
    return { access_token, refresh_token };
  }

  async register(registerUserDto: RegisterUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { loginName: registerUserDto.loginName },
    });
    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.userRepository.save(registerUserDto);
      return { message: '注册成功' };
    } catch (error) {
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userRepository.findOne({
        where: { userId: data.userId },
      });
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
      }

      const access_token = this.jwtService.sign(
        {
          userId: user.userId,
          userName: user.userName,
        },
        {
          expiresIn: '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.userId,
        },
        {
          expiresIn: '1h',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  findOneByName(name: string) {
    return this.userRepository.findOne({ where: { loginName: name } });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
