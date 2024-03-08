import { ConfigService, registerAs } from '@nestjs/config';

const configService = new ConfigService();
const token = 'allConfigs';

export default registerAs(token, () => ({
  app_port: configService.get<string>('APP_PORT'),
  app_host: configService.get<string>('APP_HOST'),

  db_host: configService.get<string>('POSTGRES_HOST'),
  db_port: configService.get<number>('POSTGRES_PORT'),
  db_username: configService.get<string>('POSTGRES_USERNAME'),
  db_password: configService.get<string>('POSTGRES_PASSWORD'),
  db_database: configService.get<string>('POSTGRES_DB'),

  email_service_service: configService.get<string>('EMAIL_SERVICE_SERVICE'),
  email_service_user: configService.get<string>('EMAIL_SERVICE_USER'),
  email_service_pass: configService.get<string>('EMAIL_SERVICE_PASS'),
  email_service_defaults: configService.get<string>('EMAIL_SERVICE_DEFAULTS'),
  email_service_path: configService.get<string>(
    'src/common/email-templates/views',
  ),

  redis_url: configService.get<string>('REDIS_URL'),

  aws_secret_key: configService.get<string>('AWS_SECRET_KEY'),
  aws_key: configService.get<string>('AWS_ACCESS_KEY'),
  aws_bucket: configService.get<string>('AWS_BUCKED'),
  aws_region: configService.get<string>('AWS_REGION'),
  aws_url: configService.get<string>('AWS_S3_URL'),

  auth_access_token_secret: configService.get<string>(
    'AUTH_ACCESS_TOKEN_SECRET',
  ),
  auth_access_token_expiration: configService.get<string>(
    'AUTH_ACCESS_TOKEN_EXPIRATION',
  ),
  auth_refresh_token_secret: configService.get<string>(
    'AUTH_REFRESH_TOKEN_SECRET',
  ),
  auth_refresh_token_expiration: configService.get<string>(
    'AUTH_REFRESH_TOKEN_EXPIRATION',
  ),
}));
