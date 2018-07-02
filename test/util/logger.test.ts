import {
  format,
  transports,
} from 'winston';

import {
  logger,
  requestLogger,
} from '../../src/util/logger';

describe('logger', () => {
  describe('logger', () => {
    it('should have a JSON format', () => {
      expect(logger.format).toEqual(format.json());
    });

    it('should have a level set to info', () => {
      expect(logger.level).toBe('info');
    });

    it('should have an error log', () => {
      const errorLogger = logger.transports[0];

      expect(errorLogger.level).toBe('error');
      expect(errorLogger).toEqual(expect.objectContaining({
        filename: 'error.log',
      }));
    });

    it('should have a combined log', () => {
      const combinedLogger = logger.transports[1];

      expect(combinedLogger.level).toBeUndefined();
      expect(combinedLogger).toEqual(expect.objectContaining({
        filename: 'combined.log',
      }));
    });

    it('should contain the Console transport in non production', () => {
      const consoleLogger = logger.transports[2];

      expect(consoleLogger).toBeInstanceOf(transports.Console);
    });

    describe('given the NODE_ENV is set to production', () => {
      const environmentVariables = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...environmentVariables };
        process.env.NODE_ENV = 'production';
      });

      afterEach(() => {
        process.env = environmentVariables;
      });

      it('should not contain the Console transport', async () => {
        const { logger: prodLogger } = await import('../../src/util/logger');
        const fileTransportPredicate = (transport: any) => transport instanceof transports.File;

        expect(prodLogger.transports.every(fileTransportPredicate)).toBe(true);
      });
    });
  });

  describe('requestLogger', () => {
    it('should have a single Console transport', () => {
      const consoleTransport = requestLogger.transports[0];

      expect(requestLogger.transports).toHaveLength(1);
      expect((consoleTransport as any).name).toBe('console');
    });
  });
});
