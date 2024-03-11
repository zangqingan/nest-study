// src/modules/tag/entity

import { IsNotEmpty } from 'class-validator';
import { CommonBasicEntity } from 'src/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

@Entity('tags')
export class Tags extends CommonBasicEntity {
  @Column()
  @IsNotEmpty()
  name: string;
}
