import { Exclude } from 'class-transformer';

import { TokenResponseDto } from './token.responce.dto';

// import { TokenResponseDto } from './token.response.dto';

@Exclude()
export class AuthUserResponseDto {
  // tokens: TokenResponseDto;
  user: any;
}

export class AuthUserResponseTokensDto {
  tokens: TokenResponseDto;
  user: any;
}
