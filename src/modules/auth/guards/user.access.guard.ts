import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenType } from '../../../common/enums/token.enum';
import { UserRepository } from '../../user/user.repository';
import { AuthCacheService } from '../services/auth.cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
    private userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    let userTypeAllowed = this.reflector.get<string[]>(
      'rights',
      context.getHandler(),
    );

    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });

    if (!userTypeAllowed) {
      userTypeAllowed = this.reflector.get<string[]>(
        'rights',
        context.getClass(),
      );
      if (!userTypeAllowed) {
        return true;
      }
    }

    if (!userTypeAllowed.includes(user.role)) {
      throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
