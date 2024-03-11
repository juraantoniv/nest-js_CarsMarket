import { CarsEntity } from '../../../../database/entities/cars.entity';
import { ViewsEntity } from '../../../../database/entities/views.entity';

export class CarList {
  model: string;
  brand: string;
  image: string;
  description: string;
  currency: Array<any>;
  currency_type: string;
}

export class CarsResponseDto<T> {
  data: Partial<T>;
  total: number;
  limit: number;
  offset: number;
}

export class CarListPrem extends CarList {
  views: ViewsEntity[];
}
