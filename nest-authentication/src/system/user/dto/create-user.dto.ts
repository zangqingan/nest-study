import { IsString, IsInt, IsNotEmpty } from 'class-validator';
export class CreateUserDto {}

export class LoginUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class RegisterUserDto {
  deptId: number; // 105
  loginName: string;
  username: string;
  userType: string; // （00系统用户 01注册用户）
  email: string;
  phonenumber: string;
  sex: string; // （0男 1女 2未知）
  avatar?: string;
  password: string;
  salt: string;
  status: string; // （0正常 1停用）
  remark?: string;
}
