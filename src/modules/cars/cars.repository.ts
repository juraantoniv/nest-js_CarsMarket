import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarsEntity } from '../../database/entities/cars.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarsListRequestDto } from './dto/request/cars-list-request.dto';

@Injectable()
export class CarsRepository extends Repository<CarsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarsEntity, dataSource.manager);
  }

  public async getList(
    query: CarsListRequestDto,
    userData: IUserData,
  ): Promise<[CarsEntity[], number]> {
    const qb = this.createQueryBuilder('cars');
    qb.leftJoinAndSelect('cars.likes', 'like');
    qb.leftJoinAndSelect('cars.user', 'user');
    qb.leftJoinAndSelect('cars.views', 'views');
    qb.setParameter('myId', userData.userId);

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(cars.model), LOWER(cars.description), LOWER(cars.brand)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search.toLowerCase()}%`);
    }

    qb.setParameter('myId', userData.userId);
    qb.addOrderBy('cars.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }
}
