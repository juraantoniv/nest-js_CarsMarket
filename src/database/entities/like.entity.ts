import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { TableNameEnum } from '../../common/enums/table.name.enum';
import { CarsEntity } from './cars.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.LIKES)
export class LikeEntity extends BaseEntity {
  @Column()
  cars_id: string;
  @ManyToOne(() => CarsEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'cars_id' })
  cars?: CarsEntity;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
