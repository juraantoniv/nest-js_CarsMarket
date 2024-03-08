import { Global, Module } from '@nestjs/common';

import { CarsModule } from '../modules/cars/cars.module';
import { UserModule } from '../modules/user/user.module';
import { UserRepository } from '../modules/user/user.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';

const repositories = [RefreshTokenRepository, UserRepository];

@Global()
@Module({
  imports: [UserModule, CarsModule],
  controllers: [],
  providers: [...repositories],
  exports: [...repositories, UserModule, CarsModule],
})
export class RepositoryModule {}
