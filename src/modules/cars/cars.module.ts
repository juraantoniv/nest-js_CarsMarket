import { Module } from '@nestjs/common';

import { CarsController } from './cars.controller';
import { CarsRepository } from './cars.repository';
import { CarsService } from './cars.service';

@Module({
  imports: [],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository],
  exports: [CarsRepository],
})
export class CarsModule {}
