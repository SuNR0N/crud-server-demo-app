export interface IConfiguration {
  DATABASE_DB: string;
  DATABASE_HOST: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  PORT: number;
  ROOT_PATH: string;
  ENVIRONMENT: string;
}

export const Configuration: IConfiguration = {
  DATABASE_DB: 'testdb',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'pw',
  DATABASE_PORT: 5432,
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  ROOT_PATH: '/api/v1',
};
