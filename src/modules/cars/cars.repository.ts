import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarsEntity } from '../../database/entities/cars.entity';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class CarsRepository extends Repository<CarsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }
}
