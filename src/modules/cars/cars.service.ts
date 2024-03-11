import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

import { EEmailAction } from '../../common/enums/email.action.enum';
import { ERights, EType } from '../../common/enums/users.rights.enum';
import { EmailService } from '../../common/services/email.service';
import { EFileTypes, S3Service } from '../../common/services/s3.service';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UserRepository } from '../user/user.repository';
import { CarsRepository } from './cars.repository';
import { CarsListRequestDto } from './dto/request/cars-list-request.dto';
import { CreateCarDto } from './dto/request/create-car.dto';
import { UpdateCarDto } from './dto/request/update-car.dto';
import { CarsResponseMapper } from './services/cars.responce.mapper';

@Injectable()
export class CarsService {
  constructor(
    private readonly carsRepository: CarsRepository,
    private readonly userRepository: UserRepository,
    private readonly s3Serv: S3Service,
    private readonly emailService: EmailService,
  ) {}
  async create(
    createCarDto: CreateCarDto,
    file: Express.Multer.File,
    userData: IUserData,
  ) {
    const course = await axios.get(
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    );

    const myObject: any = {};
    myObject.UAH = Number(createCarDto.price);
    const arr = [];
    arr.push(
      myObject,
      {
        USD: Math.ceil(
          Number(createCarDto.price) / Number(course.data[0].sale),
        ),
      },
      {
        EUR: Math.ceil(
          Number(createCarDto.price) / Number(course.data[1].sale),
        ),
      },
    );

    const currentUser = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    if (!createCarDto.brand.includes('[BMW, MERCEDES, OPEL]')) {
      const user = await this.userRepository.find({
        where: {
          role: ERights.Admin,
        },
      });
      user.map(async (user) => {
        await this.emailService.send(user.email, EEmailAction.Card_Brand, {
          name: currentUser.name,
          email: currentUser.email,
          model: createCarDto.brand,
        });
      });
    }
    const filePath = await this.s3Serv.uploadFile(
      file,
      EFileTypes.User,
      userData.userId,
    );

    const user = this.carsRepository.create({
      ...createCarDto,
      currency: arr,
      image: filePath,
      user_id: userData.userId,
    });

    return CarsResponseMapper.toResponseDto(
      await this.carsRepository.save(user),
    );
  }

  public async findAll(query: CarsListRequestDto, userData: IUserData) {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    const userPremium = user.userPremiumRights;
    const [entities, total] = await this.carsRepository.getList(
      query,
      userData,
    );

    return userPremium === EType.Premium
      ? CarsResponseMapper.PremResponseManyDto(entities, total, query)
      : CarsResponseMapper.toResponseManyDto(entities, total, query);
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  public async update(
    id: string,
    updateCarDto: UpdateCarDto,
    userData: IUserData,
  ) {
    const car = await this.carsRepository.findOneBy({ id: id });
    if (car.user_id !== userData.userId) {
      throw new ForbiddenException('You cant edit a car that not your own');
    }

    return await this.carsRepository.save({
      ...car,
      check_of_valid: car.check_of_valid + 1,
      ...updateCarDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
