import * as dotenv from 'dotenv';
import { join } from 'path';

import getConfigs from '../../../configs/configs';
import { CarsEntity } from '../../../database/entities/cars.entity';
import { CarsListRequestDto } from '../dto/request/cars-list-request.dto';
import {
  CarList,
  CarListPrem,
  CarsResponseDto,
} from '../dto/responce/cars.response.dto';

dotenv.config({ path: './environments/local.env' });

const awsConfig = getConfigs().aws;

export class CarsResponseMapper {
  public static toResponseDto(carEntity: Partial<CarsEntity>): CarList {
    return {
      model: carEntity.model,
      brand: carEntity.brand,
      image: `${awsConfig.aws_url}${carEntity.image}`,
      description: carEntity.description,
      currency: carEntity.currency.map((el) => JSON.parse(el)),
      currency_type: carEntity.currency_type,
    };
  }
  public static toResponseDtoViews(
    carEntity: Partial<CarsEntity>,
  ): CarListPrem {
    return {
      model: carEntity.model,
      brand: carEntity.brand,
      image: `${awsConfig.aws_url}${carEntity.image}`,
      description: carEntity.description,
      currency: carEntity.currency.map((el) => JSON.parse(el)),
      currency_type: carEntity.currency_type,
      views: carEntity.views,
    };
  }
  public static toResponseManyDto(
    carEntity: Partial<CarsEntity[]>,
    total: number,
    query: CarsListRequestDto,
  ): CarsResponseDto<CarList[]> {
    return {
      data: carEntity.map(this.toResponseDto),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
  public static PremResponseManyDto(
    carEntity: Partial<CarsEntity[]>,
    total: number,
    query: CarsListRequestDto,
  ): CarsResponseDto<CarListPrem[]> {
    return {
      data: carEntity.map(this.toResponseDtoViews),
      total: total,
      limit: query.limit,
      offset: query.offset,
    };
  }
}
