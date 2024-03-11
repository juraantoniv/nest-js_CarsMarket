import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { log } from 'console';

import { EEmailAction } from '../../common/enums/email.action.enum';
import { EmailService } from '../../common/services/email.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    log('file', file);
    log('file', createUserDto);
    return await this.userService.create(createUserDto, file);
  }

  @Get()
  public async findAll() {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
