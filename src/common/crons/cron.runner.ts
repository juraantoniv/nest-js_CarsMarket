import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CarsRepository } from '../../modules/cars/cars.repository';
import { UserRepository } from '../../modules/user/user.repository';
import { EActive } from '../enums/valiid.enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private userRepository: UserRepository,
    private carsRepository: CarsRepository,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  public handleCron() {
    this.logger.debug('Called when the current second is 30');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async checkWorlds() {
    const cars = await this.carsRepository.find();

    cars.forEach((car) => {
      if (car.active === EActive.Nonactive) {
      }
    });
  }
}
