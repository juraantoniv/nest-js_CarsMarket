import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenConfig } from '../../../common/configs/config.type';
import { TokenType } from '../../../common/enums/token.enum';
import { Config } from '../../../configs/config.type';
import { TokenResponseDto } from '../dto/response/token.responce.dto';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class TokenService {
  private jwtConfig: TokenConfig;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get<TokenConfig>('token');
  }

  public async generateAuthTokens(
    payload: JwtPayload,
  ): Promise<TokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload, TokenType.ACCESS),
      this.generateToken(payload, TokenType.REFRESH),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  public async generateRecoveryToken(payload: JwtPayload): Promise<string> {
    return await this.generateToken(payload, TokenType.RecoveryPassword);
  }

  public async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<JwtPayload> {
    try {
      const secret = this.getSecret(type);

      return await this.jwtService.verifyAsync(token, { secret });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async generateToken(
    payload: JwtPayload,
    type: TokenType,
  ): Promise<string> {
    const secret = this.getSecret(type);
    const expiresIn = this.getExpiresIn(type);
    return await this.jwtService.signAsync(payload, { expiresIn, secret });
  }

  private getSecret(type: TokenType): string {
    switch (type) {
      case TokenType.ACCESS:
        return this.jwtConfig.auth_access_token_secret;
      case TokenType.REFRESH:
        return this.jwtConfig.auth_refresh_token_secret;
      case TokenType.RecoveryPassword:
        return this.jwtConfig.recovery_password_secret;
    }
  }

  private getExpiresIn(type: TokenType): number {
    switch (type) {
      case TokenType.ACCESS:
        return this.jwtConfig.auth_access_token_expiration;
      case TokenType.REFRESH:
        return this.jwtConfig.auth_refresh_token_expiration;
      case TokenType.RecoveryPassword:
        return this.jwtConfig.recovery_password_expiration;
    }
  }
}
