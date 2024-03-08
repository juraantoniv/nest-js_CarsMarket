export type Config = {
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  email: EmailConfig;
  aws: AWSConfig;
  token: TokenConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};
export type EmailConfig = {
  service: string;
  user: string;
  pass: string;
  defaults: string;
  path: string;
};

export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  password: string;
  url: string;
};

export type AWSConfig = {
  asw_key: string;
  aws_secret_key: string;
  aws_bucket: string;
  aws_region: string;
  aws_url: string;
};

export type TokenConfig = {
  auth_access_token_secret: string;
  auth_access_token_expiration: number;
  auth_refresh_token_secret: string;
  auth_refresh_token_expiration: number;
};
