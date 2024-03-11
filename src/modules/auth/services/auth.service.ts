import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';

import { EEmailAction } from '../../../common/enums/email.action.enum';
import { TokenType } from '../../../common/enums/token.enum';
import { EmailService } from '../../../common/services/email.service';
import { EFileTypes, S3Service } from '../../../common/services/s3.service';
import { UserEntity } from '../../../database/entities/user.entity';
import { RefreshTokenRepository } from '../../../repository/services/refresh-token.repository';
import { CreateUserDto } from '../../user/dto/request/create-user.dto';
import { UserRepository } from '../../user/user.repository';
import {
  ChangePasswordRequestDto,
  ConfirmPasswordRequestDto,
  RecoveryPasswordRequestDto,
} from '../dto/request/change-password.request.dto';
import { SignInRequestDto } from '../dto/request/sign-in.request.dto';
import { TokenResponseDto } from '../dto/response/token.responce.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthCacheService } from './auth.cache.service';
import { AuthMapperWithTokens } from './auth.mapper';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshRepository: RefreshTokenRepository,
    private readonly s3Serv: S3Service,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly emailService: EmailService,
  ) {}

  public async signUp(
    dto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const findUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (findUser) {
      throw new BadRequestException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password: hashedPassword }),
    );

    const filePath = await this.s3Serv.uploadFile(
      file,
      EFileTypes.User,
      user.id,
    );

    const userAfterUpdateAvatar = this.userRepository.merge(user, {
      ...user,
      avatar: filePath,
    });

    await this.userRepository.save(userAfterUpdateAvatar);
    return userAfterUpdateAvatar;

    // return AuthMapper.toResponseDto(userAfterUpdateAvatar);
  }

  public async signIn(dto: SignInRequestDto): Promise<AuthMapperWithTokens> {
    return await this.entityManager.transaction(async (tr) => {
      const userRepository = tr.getRepository(UserEntity);
      const userEntity = await userRepository.findOne({
        where: { email: dto.email },
        select: { id: true, password: true },
      });
      if (!userEntity) {
        throw new UnauthorizedException();
      }

      const isPasswordsMatch = await bcrypt.compare(
        dto.password,
        userEntity.password,
      );

      if (!isPasswordsMatch) {
        throw new UnauthorizedException();
      }

      const user = await userRepository.findOneBy({ id: userEntity.id });

      const tokens = await this.tokenService.generateAuthTokens({
        userId: user.id,
        deviceId: dto.deviceId,
        email: user.email,
      });

      await this.saveTokens(tokens, user.id, dto.deviceId);
      return AuthMapperWithTokens.toResponseDto(user, tokens);
    });
  }

  public async logout(userData: IUserData): Promise<void> {
    await this.deleteTokens('hfhf', userData);
  }

  public async refreshToken(
    userData: IUserData,
    token: string,
  ): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    await this.deleteTokens(token, userData);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: userData.deviceId,
      email: user.email,
    });

    await this.saveTokens(tokens, user.id, userData.deviceId);
    return tokens;
  }

  private async deleteTokens(token: string, userData: IUserData) {
    await Promise.all([
      this.refreshRepository.delete({
        refreshToken: token,
        deviceId: userData.deviceId,
      }),
      this.authCacheService.removeToken(userData.userId, userData.deviceId),
    ]);
  }

  public async changePassword(
    body: ChangePasswordRequestDto,
    userData: IUserData,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userData.userId,
      },
      select: { id: true, password: true },
    });

    const isPasswordsMatch = await bcrypt.compare(
      body.old_password,
      user.password,
    );

    if (!isPasswordsMatch) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await bcrypt.hash(body.new_password, 10);

    await this.userRepository.save(
      this.userRepository.create({ ...user, password: hashedPassword }),
    );
  }

  public async recoveryPassword(body: RecoveryPasswordRequestDto) {
    const user = await this.userRepository.findOneBy({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = await this.tokenService.generateRecoveryToken({
      email: user.email,
      userId: user.id,
    });

    await this.emailService.send(user.email, EEmailAction.FORGOT_PASSWORD, {
      name: user.name,
      token: token,
    });
  }
  public async confirmPassword(token: string, body: ConfirmPasswordRequestDto) {
    const verify = await this.tokenService.verifyToken(
      token,
      TokenType.RecoveryPassword,
    );
    if (!verify) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOneBy({
      email: verify.email,
    });

    await this.userRepository.save(
      this.userRepository.create({
        ...user,
        password: await bcrypt.hash(body.new_password, 10),
      }),
    );
    return 'Password was recovered';
  }

  private async saveTokens(
    tokens: TokenResponseDto,
    userId: string,
    deviceId: string,
  ) {
    await Promise.all([
      this.refreshRepository.saveToken(userId, deviceId, tokens.refreshToken),
      this.authCacheService.saveToken(userId, deviceId, tokens.accessToken),
    ]);
  }
}
