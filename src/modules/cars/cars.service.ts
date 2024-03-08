import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';

import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  create(createCarDto: CreateCarDto, file: Express.Multer.File) {
    return 'This action adds a new car';
  }

  findAll(query: any, userData: IUserData) {
    return `This action returns all cars`;
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
