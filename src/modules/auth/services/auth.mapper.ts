import { UserEntity } from '../../../database/entities/user.entity';
import {
  AuthUserResponseDto,
  AuthUserResponseTokensDto,
} from '../dto/response/auth-user.response.dto';
import { TokenResponseDto } from '../dto/response/token.responce.dto';

export class AuthMapper {
  public static toResponseDto(
    userEntity: Partial<UserEntity>,
  ): AuthUserResponseDto {
    return {
      user: userEntity,
    };
  }
}

export class AuthMapperWithTokens {
  public static toResponseDto(
    userEntity: Partial<UserEntity>,
    tokens: TokenResponseDto,
  ): AuthUserResponseTokensDto {
    return {
      tokens: tokens,
      user: userEntity,
    };
  }
}
