import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateUserDto } from '../../../user/dto/request/create-user.dto';

export class ChangePasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly new_password: string;

  @IsNotEmpty()
  @IsString()
  readonly old_password: string;
}

export class RecoveryPasswordRequestDto extends PickType(CreateUserDto, [
  'email',
]) {}

export class ConfirmPasswordRequestDto extends PickType(
  ChangePasswordRequestDto,
  ['new_password'],
) {}
