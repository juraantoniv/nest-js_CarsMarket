import { IsEnum } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { ERights } from '../../common/enums/users.rights.enum';
import { EActive } from '../../common/enums/valiid.enum';
import { LikeEntity } from './like.entity';
import { UserEntity } from './user.entity';
import { ViewsEntity } from './views.entity';

@Entity('Cars')
export class CarsEntity extends BaseEntity {
  @Column('text')
  model: string;

  @Column('text')
  description: string;

  @Column('text')
  brand: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('text')
  currency_type: string;

  @Column('text', { array: true })
  currency: Array<any>;

  @Column({
    type: 'enum',
    enum: EActive,
    default: EActive.Nonactive,
  })
  @IsEnum(EActive)
  active: EActive;

  @Column('int', { default: 1 })
  check_of_valid: number;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToMany(() => ViewsEntity, (entity) => entity.car)
  views?: ViewsEntity[];
}
