import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { ERights } from '../../common/enums/users.rights.enum';
import { CarsEntity } from '../../database/entities/cars.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { RightsDecorator } from '../auth/decorators/user-rights.decorator';
import { PremiumAccessGuard } from '../auth/guards/premium.access.guard';
import { UserAccessGuard } from '../auth/guards/user.access.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarsService } from './cars.service';
import { CarsListRequestDto } from './dto/request/cars-list-request.dto';
import { CreateCarDto } from './dto/request/create-car.dto';
import { UpdateCarDto } from './dto/request/update-car.dto';
import { CarList } from './dto/responce/cars.response.dto';

@Controller('cars')
@ApiTags('Cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @RightsDecorator(ERights.Costumer, ERights.Manager)
  @UseGuards(UserAccessGuard, PremiumAccessGuard)
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userData: IUserData,
  ): Promise<CarList> {
    return await this.carsService.create(createCarDto, file, userData);
  }

  @Get()
  public async findAll(
    @Query() query: CarsListRequestDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.carsService.findAll(query, userData);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.carsService.update(id, updateCarDto, userData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
