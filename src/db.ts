import {
  Connection,
  createConnection,
} from 'typeorm';

import { Configuration } from './config';
import {
  Author,
  Book,
  Category,
  Publisher,
} from './entities';

export async function getDbConnection(): Promise<Connection> {

  const entities = [
    Author,
    Book,
    Category,
    Publisher,
  ];

  const conn = await createConnection({
    database: Configuration.DATABASE_DB,
    entities,
    host: Configuration.DATABASE_HOST,
    password: Configuration.DATABASE_PASSWORD,
    port: Configuration.DATABASE_PORT,
    ssl: Configuration.DATABASE_SSL,
    synchronize: false,
    type: 'postgres',
    username: Configuration.DATABASE_USER,
  });

  return conn;
}
