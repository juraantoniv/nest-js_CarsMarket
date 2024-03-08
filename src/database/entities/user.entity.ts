import { IsEnum } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { ERights, EType } from '../../common/enums/users.rights.enum';
import { Car_DealershipEntity } from './car_dealership.entity';
import { CarsEntity } from './cars.entity';
import { LikeEntity } from './like.entity';
import { RefreshTokenEntity } from './refresh.token.entity';

@Entity('usersData')
export class UserEntity extends BaseEntity {
  @Column('text', { nullable: true })
  name?: string;

  @Column('text')
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('int', { nullable: true })
  age: number;

  @Column('text', { nullable: true })
  city: string;

  @Column({
    type: 'enum',
    enum: ERights,
    default: ERights.Costumer,
  })
  @IsEnum(ERights)
  role: ERights;

  @Column({
    type: 'enum',
    enum: EType,
    default: EType.Default,
  })
  @IsEnum(ERights)
  userPremiumRights: EType;

  @Column('text', { nullable: true, default: null })
  avatar: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => CarsEntity, (entity) => entity.user)
  cars?: CarsEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToOne(() => Car_DealershipEntity, (entity) => entity.user)
  dealer?: Car_DealershipEntity;
}
