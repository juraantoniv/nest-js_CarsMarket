import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { TableNameEnum } from '../../common/enums/table.name.enum';
import { CarsEntity } from './cars.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.VIEWS)
export class ViewsEntity extends BaseEntity {
  @Column()
  car_id: string;
  @ManyToOne(() => CarsEntity, (entity) => entity.views)
  @JoinColumn({ name: 'car_id' })
  car?: CarsEntity;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.views)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
