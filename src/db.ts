import {
  Connection,
  ConnectionOptions,
  createConnection,
} from 'typeorm';

import { Configuration } from './config';
import {
  Author,
  Book,
  Category,
  Publisher,
  User,
} from './entities';

export async function getDbConnection(): Promise<Connection> {

  const entities = [
    Author,
    Book,
    Category,
    Publisher,
    User,
  ];

  const baseConnectionOptions: ConnectionOptions = {
    entities,
    ssl: Configuration.DATABASE_SSL,
    synchronize: false,
    type: 'postgres',
  };

  const connectionOptions: ConnectionOptions = Configuration.DATABASE_URL ?
    {
      ...baseConnectionOptions,
      url: Configuration.DATABASE_URL,
    } :
    {
      ...baseConnectionOptions,
      database: Configuration.DATABASE_DB,
      host: Configuration.DATABASE_HOST,
      password: Configuration.DATABASE_PASSWORD,
      port: Configuration.DATABASE_PORT,
      username: Configuration.DATABASE_USER,
    };

  const conn = await createConnection(connectionOptions);

  return conn;
}
