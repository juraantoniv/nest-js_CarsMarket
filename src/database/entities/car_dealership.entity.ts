import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { UserEntity } from './user.entity';
import { WorkerEntity } from './worker.entity';

@Entity('dealership')
export class Car_DealershipEntity extends BaseEntity {
  @Column('text', { nullable: false })
  name?: string;

  @Column('text', { nullable: true })
  city?: string;

  @Column('text', { nullable: true })
  street: string;

  @Column('int', { select: false })
  post_code: number;

  @Column('text', { nullable: true })
  region: string;

  @Column()
  seller_id: string;
  @OneToOne(() => UserEntity, (entity) => entity.dealer)
  @JoinColumn({ name: 'seller_id' })
  user?: UserEntity;

  @OneToMany(() => WorkerEntity, (entity) => entity.dealer)
  workers?: WorkerEntity[];
}
