import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entities';
import { Car_DealershipEntity } from './car_dealership.entity';

@Entity('worker')
export class WorkerEntity extends BaseEntity {
  @Column('text', { nullable: true })
  name?: string;

  @Column('text')
  surname: string;

  @Column('text')
  position: string;

  @Column('int', { nullable: true })
  age: number;

  @Column()
  dealership_id: string;
  @ManyToOne(() => Car_DealershipEntity, (entity) => entity.workers)
  @JoinColumn({ name: 'dealership_id' })
  dealer?: Car_DealershipEntity;
}
