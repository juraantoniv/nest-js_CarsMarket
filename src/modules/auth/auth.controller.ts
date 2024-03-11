import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import {
  ChangePasswordRequestDto,
  ConfirmPasswordRequestDto,
  RecoveryPasswordRequestDto,
} from './dto/request/change-password.request.dto';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { AuthUserResponseDto } from './dto/response/auth-user.response.dto';
import { TokenResponseDto } from './dto/response/token.responce.dto';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthMapperWithTokens } from './services/auth.mapper';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration' })
  @Post('sign-up')
  @UseInterceptors(FileInterceptor('file'))
  public async signUp(
    @Body() dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signUp(dto, file);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('sign-in')
  public async signIn(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthMapperWithTokens> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair' })
  @Post('refresh')
  public async updateRefreshToken(
    @CurrentUser() userData: IUserData,
    @Body('refresh_token') refresh_token: string,
  ): Promise<TokenResponseDto> {
    return await this.authService.refreshToken(userData, refresh_token);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'change password' })
  @Post('change_password')
  public async changePassword(
    @CurrentUser() userData: IUserData,
    @Body() body: ChangePasswordRequestDto,
  ): Promise<void> {
    return await this.authService.changePassword(body, userData);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'recovery password' })
  @Post('recovery_password')
  public async recoveryPassword(
    @Body() body: RecoveryPasswordRequestDto,
  ): Promise<void> {
    return await this.authService.recoveryPassword(body);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'recovery password' })
  @Post('confirm_password/:token')
  public async confirmPassword(
    @Param('token') token: string,
    @Body() body: ConfirmPasswordRequestDto,
  ): Promise<string> {
    return await this.authService.confirmPassword(token, body);
  }
}
