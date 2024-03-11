import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

import { TokenConfig } from '../../../common/configs/config.type';
import { Config } from '../../../configs/config.type';
import { RedisService } from '../../redis/redis.service';
import { AUTH_CACHE } from '../costants/costants';

@Injectable()
export class AuthCacheService {
  private readonly jwtConfig: TokenConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<TokenConfig>('token');
  }

  public async saveToken(
    userId: string,
    deviceId: string,
    accessToken: string,
  ): Promise<void> {
    const key = `${AUTH_CACHE.ACCESS_TOKEN}:${userId}:${deviceId}`;

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, accessToken);
    await this.redisService.expire(
      key,
      this.jwtConfig.auth_access_token_expiration,
    );
  }

  public async removeToken(userId: string, deviceId: string): Promise<void> {
    await this.redisService.deleteByKey(
      `${AUTH_CACHE.ACCESS_TOKEN}:${userId}:${deviceId}`,
    );
  }

  public async isAccessTokenExist(
    userId: string,
    deviceId: string,
    accessToken: string,
  ): Promise<boolean> {
    const userAccessTokens = await this.redisService.sMembers(
      `${AUTH_CACHE.ACCESS_TOKEN}:${userId}:${deviceId}`,
    );
    return userAccessTokens.some((token: string) => token === accessToken);
  }
}
