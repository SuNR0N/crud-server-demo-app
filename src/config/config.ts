import { resolve } from 'path';

export interface IConfiguration {
  API_DOCS_PATH: string;
  DATABASE_DB: string;
  DATABASE_HOST: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: number;
  DATABASE_SSL: boolean;
  DATABASE_URL?: string;
  DATABASE_USER: string;
  ENVIRONMENT: string;
  OAUTH_CALLBACK_URL: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  PORT: number;
  ROOT_PATH: string;
  SESSION_SECRET: string;
  SWAGGER_SPEC_PATH: string;
}

export const Configuration: IConfiguration = {
  API_DOCS_PATH: '/api-docs',
  DATABASE_DB: process.env.DATABASE_DB || 'testdb',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'pw',
  DATABASE_PORT: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432,
  DATABASE_SSL: process.env.DATABASE_SSL === 'true',
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  OAUTH_CALLBACK_URL: 'http://localhost:3000/api/v1/auth/github/callback',
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID!,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET!,
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  ROOT_PATH: '/api/v1',
  SESSION_SECRET: process.env.SESSION_SECRET || '535510n_53cr37',
  SWAGGER_SPEC_PATH: resolve(__dirname, '../../swagger/swagger.yaml'),
};
