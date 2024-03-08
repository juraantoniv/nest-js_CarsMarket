import { IsEnum } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { ERights } from '../../common/enums/users.rights.enum';
import { EActive } from '../../common/enums/valiid.enum';
import { LikeEntity } from './like.entity';
import { UserEntity } from './user.entity';

@Entity('Cars')
export class CarsEntity extends BaseEntity {
  @Column('text')
  model: string;

  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @Column('text')
  type_of_currency: string;

  @Column('text')
  currency: Array<string>;

  @Column({
    type: 'enum',
    enum: EActive,
    default: EActive.Nonactive,
  })
  @IsEnum(EActive)
  active: EActive;

  @Column('text')
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];
}
