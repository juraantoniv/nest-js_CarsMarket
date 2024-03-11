import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

import { CarsRepository } from '../../modules/cars/cars.repository';
import { UserRepository } from '../../modules/user/user.repository';
import { EEmailAction } from '../enums/email.action.enum';
import { EActive } from '../enums/valiid.enum';
import { checkWordsService } from '../services/check.worlds.service';
import { EmailService } from '../services/email.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private userRepository: UserRepository,
    private carsRepository: CarsRepository,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async updateCurrency() {
    try {
      const course = await axios.get(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      );
      const goods = await this.carsRepository.find();
      goods.map(async (el) => {
        const obj = JSON.parse(el.currency[0]);

        const prices = [
          { UAH: obj.UAH },
          {
            EUR: Math.ceil(obj.UAH / course.data[0].sale),
          },
          {
            USD: Math.ceil(obj.UAH / course.data[1].sale),
          },
        ];

        await this.carsRepository.save({
          ...el,
          currency: prices,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  public async checkWorlds() {
    const cars = await this.carsRepository.find();

    cars.map(async (car) => {
      const user = await this.userRepository.findOneBy({ id: car.user_id });

      if (car.active === EActive.Nonactive) {
        const valid = checkWordsService.check(car.description);
        if (!valid && car.check_of_valid <= 3) {
          await this.emailService.send(
            user.email,
            EEmailAction.Change_Advertising,
            {
              name: user.name,
              model: car.model,
            },
          );
        } else {
          await this.carsRepository.save({ ...car, active: EActive.Active });
        }
      }
    });
  }
}
