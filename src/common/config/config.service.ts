import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import configuration from './configuration';

@Injectable()
export class CustomConfigService {
  constructor(
    @Inject(configuration.KEY)
    private readonly configs: ConfigType<typeof configuration>,
  ) {}

  get app_port(): string {
    return this.configs.app_port;
  }

  get app_host(): string {
    return this.configs.app_host;
  }

  get db_host(): string {
    return this.configs.db_host;
  }

  get db_port(): number {
    return this.configs.db_port;
  }

  get db_username(): string {
    return this.configs.db_username;
  }

  get db_password(): string {
    return this.configs.db_password;
  }

  get db_database(): string {
    return this.configs.db_database;
  }
  get email_service_service(): string {
    return this.configs.email_service_service;
  }
  get email_service_user(): string {
    return this.configs.email_service_user;
  }
  get email_service_pass(): string {
    return this.configs.email_service_pass;
  }
  get email_service_defaults(): string {
    return this.configs.email_service_defaults;
  }
  get email_service_path(): string {
    return this.configs.email_service_path;
  }
  get aws_secret_key(): string {
    return this.configs.aws_secret_key;
  }
  get aws_key(): string {
    return this.configs.aws_key;
  }
  get aws_bucket(): string {
    return this.configs.aws_bucket;
  }
  get aws_region(): string {
    return this.configs.aws_region;
  }
  get aws_url(): string {
    return this.configs.aws_url;
  }
  get redis_url(): string {
    return this.configs.redis_url;
  }
  get auth_access_token_secret(): string {
    return this.configs.auth_access_token_secret;
  }
  get auth_access_token_expiration(): string {
    return this.configs.auth_access_token_expiration;
  }
  get auth_refresh_token_secret(): string {
    return this.configs.auth_refresh_token_secret;
  }
  get auth_refresh_token_expiration(): string {
    return this.configs.auth_refresh_token_expiration;
  }
}
