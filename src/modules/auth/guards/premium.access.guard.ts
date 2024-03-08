import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenType } from '../../../common/enums/token.enum';
import { EType } from '../../../common/enums/users.rights.enum';
import { UserRepository } from '../../user/user.repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class PremiumAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });

    if (user.userPremiumRights === EType.Premium) {
      return true;
    }

    const cars = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { cars: true },
    });

    if (cars.cars.length <= 1 && user.userPremiumRights === EType.Default) {
      throw new HttpException(
        'Access denied , you have to buy premium account to post other car.',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
