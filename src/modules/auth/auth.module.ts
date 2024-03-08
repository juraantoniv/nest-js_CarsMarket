import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { S3Service } from '../../common/services/s3.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { RedisModule } from '../redis/redis.module';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt.access.guard';
import { AuthCacheService } from './services/auth.cache.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Module({
  controllers: [AuthController],
  imports: [JwtModule, RedisModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    AuthService,
    AuthCacheService,
    TokenService,
    S3Service,
  ],
  exports: [AuthCacheService],
})
export class AuthModule {}
