import * as process from 'process';

import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3005,
    host: process.env.APP_HOST || '0.0.0.0',
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT) || 5433,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL,
  },
  email: {
    user: process.env.EMAIL_SERVICE_USER,
    service: process.env.EMAIL_SERVICE_SERVICE,
    pass: process.env.EMAIL_SERVICE_PASS,
    defaults: process.env.EMAIL_SERVICE_DEFAULTS,
    path: process.env.EMAIL_SERVICE_PATH,
  },
  aws: {
    aws_bucket: process.env.AWS_BUCKED,
    aws_region: process.env.AWS_REGION,
    aws_url: process.env.AWS_S3_URL,
    asw_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
  },
  token: {
    auth_access_token_secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    auth_access_token_expiration: parseInt(
      process.env.AUTH_ACCESS_TOKEN_EXPIRATION,
    ),
    auth_refresh_token_secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    auth_refresh_token_expiration: parseInt(
      process.env.AUTH_REFRESH_TOKEN_EXPIRATION,
    ),
  },
});
