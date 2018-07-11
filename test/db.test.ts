import { Configuration } from '../src/config';

describe('db', () => {
  describe('getDbConnection', () => {
    const environmentVariables = process.env;
    let createConnectionOriginal;
    let createConnectionMock: jest.Mock;
    let typeorm;

    beforeEach(async () => {
      jest.resetModules();
      process.env = { ...environmentVariables };
      createConnectionMock = jest.fn();
      typeorm = await import('typeorm');
      createConnectionOriginal = typeorm.createConnection;
      typeorm.createConnection = createConnectionMock;
    });

    afterEach(() => {
      process.env = environmentVariables;
      typeorm.createConnection = createConnectionOriginal;
    });

    it('should call createConnection with the database url if its defined', async () => {
      process.env.DATABASE_URL = 'postgresql://postgres:root@localhost/mydatabase';
      const { getDbConnection } = await import('../src/db');
      await getDbConnection();

      expect(createConnectionMock).toHaveBeenCalledWith(expect.objectContaining({
        ssl: false,
        synchronize: false,
        type: 'postgres',
        url: 'postgresql://postgres:root@localhost/mydatabase',
      }));
    });

    it('should call createConnection with database properites if no url is defined', async () => {
      delete process.env.DATABASE_URL;
      const { getDbConnection } = await import('../src/db');
      await getDbConnection();

      expect(createConnectionMock).toHaveBeenCalledWith(expect.objectContaining({
        host: 'localhost',
        password: 'pw',
        port: Configuration.DATABASE_PORT,
        ssl: false,
        synchronize: false,
        type: 'postgres',
        username: 'postgres',
      }));
    });
  });
});
