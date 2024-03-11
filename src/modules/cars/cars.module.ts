import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EmailService } from '../../common/services/email.service';
import { S3Service } from '../../common/services/s3.service';
import { AuthModule } from '../auth/auth.module';
import { AuthCacheService } from '../auth/services/auth.cache.service';
import { TokenService } from '../auth/services/token.service';
import { CarsController } from './cars.controller';
import { CarsRepository } from './cars.repository';
import { CarsService } from './cars.service';

@Module({
  imports: [AuthModule],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository, S3Service, EmailService],
  exports: [CarsRepository, EmailService],
})
export class CarsModule {}
