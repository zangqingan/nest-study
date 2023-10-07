import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
@Entity('user-1')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string; // 用户名

  @Column({ length: 100 })
  nickname: string; //昵称

  @Exclude()
  @Column()
  password: string; // 密码

  @Column()
  avatar: string; //头像

  @Column()
  email: string;

  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string; // 用户角色

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  /**
   * 数据库插入之前加密密码
   */
  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
