import { resolve } from 'path';

export interface IConfiguration {
  API_DOCS_PATH: string;
  DATABASE_DB: string;
  DATABASE_HOST: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  ENVIRONMENT: string;
  PORT: number;
  ROOT_PATH: string;
  SWAGGER_SPEC_PATH: string;
}

export const Configuration: IConfiguration = {
  API_DOCS_PATH: '/api-docs',
  DATABASE_DB: process.env.DATABASE_DB || 'testdb',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'pw',
  DATABASE_PORT: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432,
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  ROOT_PATH: '/api/v1',
  SWAGGER_SPEC_PATH: resolve(__dirname, '../../swagger/swagger.yaml'),
};
