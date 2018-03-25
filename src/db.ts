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

/*
Please set the env var:
export DATABASE_USER=postgres \
export DATABASE_PASSWORD=secret \
export DATABASE_HOST=localhost \
export DATABASE_PORT=5432 \
export DATABASE_DB=demo
*/

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
    synchronize: true,
    type: 'postgres',
    username: Configuration.DATABASE_USER,
  });

  return conn;
}
