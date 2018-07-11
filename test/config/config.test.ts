describe('Configuration', () => {
  const environmentVariables = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...environmentVariables };
  });

  afterEach(() => {
    process.env = environmentVariables;
  });

  describe('API_DOCS_PATH', () => {
    it('should be set to "/api-docs"', async () => {
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.API_DOCS_PATH).toBe('/api-docs');
    });
  });

  describe('DATABASE_DB', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.DATABASE_DB = 'test';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_DB).toBe('test');
    });

    it('should default to "testdb" if the environment variable does not exist', async () => {
      delete process.env.DATABASE_DB;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_DB).toBe('testdb');
    });
  });

  describe('DATABASE_HOST', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.DATABASE_HOST = '192.168.0.1';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_HOST).toBe('192.168.0.1');
    });

    it('should default to "localhost" if the environment variable does not exist', async () => {
      delete process.env.DATABASE_HOST;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_HOST).toBe('localhost');
    });
  });

  describe('DATABASE_PASSWORD', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.DATABASE_PASSWORD = 'p455w0rd';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_PASSWORD).toBe('p455w0rd');
    });

    it('should default to "pw" if the environment variable does not exist', async () => {
      delete process.env.DATABASE_PASSWORD;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_PASSWORD).toBe('pw');
    });
  });

  describe('DATABASE_PORT', () => {
    it('should be set to the parsed environment variable with the same name if defined', async () => {
      process.env.DATABASE_PORT = '1234';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_PORT).toBe(1234);
    });

    it('should default to 5432 if the environment variable does not exist', async () => {
      delete process.env.DATABASE_PORT;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_PORT).toBe(5432);
    });
  });

  describe('DATABASE_SSL', () => {
    it('should be set to the parsed environment variable with the same name if defined', async () => {
      process.env.DATABASE_SSL = 'true';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_SSL).toBe(true);
    });

    it('should default to false if the environment variable does not exist', async () => {
      delete process.env.DATABASE_SSL;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_SSL).toBe(false);
    });
  });

  describe('DATABASE_URL', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.DATABASE_URL = 'postgresql://localhost/testdb?user=user&password=pw';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_URL).toBe('postgresql://localhost/testdb?user=user&password=pw');
    });

    it('should default to undefined if the environment variable does not exist', async () => {
      delete process.env.DATABASE_URL;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_URL).toBeUndefined();
    });
  });

  describe('DATABASE_USER', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.DATABASE_USER = 'user';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_USER).toBe('user');
    });

    it('should default to "postgres" if the environment variable does not exist', async () => {
      delete process.env.DATABASE_USER;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.DATABASE_USER).toBe('postgres');
    });
  });

  describe('ENVIRONMENT', () => {
    it('should be set to the NODE_ENV environment variable if defined', async () => {
      process.env.NODE_ENV = 'production';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.ENVIRONMENT).toBe('production');
    });

    it('should default to "development" if the environment variable does not exist', async () => {
      delete process.env.NODE_ENV;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.ENVIRONMENT).toBe('development');
    });
  });

  describe('GITHUB_CALLBACK_URL', () => {
    it('should be set to the configured callback', async () => {
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.GITHUB_CALLBACK_URL).toBe('http://localhost:3000/api/v1/auth/github/callback');
    });
  });

  describe('GITHUB_CLIENT_ID', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.GITHUB_CLIENT_ID = 'cl13n7_1d';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.GITHUB_CLIENT_ID).toBe('cl13n7_1d');
    });

    it('should default to undefined if the environment variable does not exist', async () => {
      delete process.env.GITHUB_CLIENT_ID;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.GITHUB_CLIENT_ID).toBeUndefined();
    });
  });

  describe('GITHUB_CLIENT_SECRET', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.GITHUB_CLIENT_SECRET = 'cl13n7_53cr37';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.GITHUB_CLIENT_SECRET).toBe('cl13n7_53cr37');
    });

    it('should default to undefined if the environment variable does not exist', async () => {
      delete process.env.GITHUB_CLIENT_SECRET;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.GITHUB_CLIENT_SECRET).toBeUndefined();
    });
  });

  describe('PORT', () => {
    it('should be set to the parsed environment variable with the same name if defined', async () => {
      process.env.PORT = '1234';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.PORT).toBe(1234);
    });

    it('should default to 3000 if the environment variable does not exist', async () => {
      delete process.env.PORT;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.PORT).toBe(3000);
    });
  });

  describe('ROOT_PATH', () => {
    it('should be set to "/api/v1"', async () => {
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.ROOT_PATH).toBe('/api/v1');
    });
  });

  describe('SESSION_SECRET', () => {
    it('should be set to the environment variable with the same name if defined', async () => {
      process.env.SESSION_SECRET = 'shhh';
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.SESSION_SECRET).toBe('shhh');
    });

    it('should default to "535510n_53cr37" if the environment variable does not exist', async () => {
      delete process.env.SESSION_SECRET;
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.SESSION_SECRET).toBe('535510n_53cr37');
    });
  });

  describe('SWAGGER_SPEC_PATH', () => {
    it('should ends with "/swagger/swagger.yaml"', async () => {
      const { Configuration } = await import('../../src/config/config');

      expect(Configuration.SWAGGER_SPEC_PATH.endsWith('/swagger/swagger.yaml')).toBe(true);
    });
  });
});
