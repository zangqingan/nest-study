// 每个数据模型都会有一些共同的东西，比如id，创建时间，更新时间，次数等等。
// 这些都可以作为一个抽象基类，其他 entity extends 继承自这里即可不用二次编写

import { Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
/**
 *  实体抽象基类
 */
export abstract class CommonBasicEntity {
  // 主键id
  @PrimaryGeneratedColumn()
  id: number;

  // 软删除
  @Column({
    default: false,
    select: false,
  })
  isDelete: boolean;

  // 创建时间
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  // 更新时间
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  // 更新次数
  @VersionColumn({
    select: false,
  })
  version: number;
}
