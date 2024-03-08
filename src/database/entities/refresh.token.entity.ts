import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { TableNameEnum } from '../../common/enums/table.name.enum';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.REFRESH_TOKEN)
export class RefreshTokenEntity extends BaseEntity {
  @Column('text')
  refreshToken: string;

  @Column('text', { nullable: true })
  deviceId: string;

  @Column('text')
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
