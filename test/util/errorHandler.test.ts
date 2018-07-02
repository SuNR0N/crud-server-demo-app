import { Response } from 'express';

import { Book } from '../../src/entities/Book';
import {
  EntityNotFoundError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from '../../src/errors';
import {
  dbErrorHandler,
  errorHandler,
} from '../../src/util/errorHandler';
import { logger } from '../../src/util/logger';

describe('errorHandler', () => {
  describe('errorHandler', () => {
    let responseMock: Response;
    let sendSpy: jest.Mock;
    let statusSpy: jest.Mock;

    beforeEach(() => {
      sendSpy = jest.fn();
      statusSpy = jest.fn();
      responseMock = {
        send: sendSpy,
        status: statusSpy,
      } as any as Response;
    });

    it('should handle EntityNotFoundError', () => {
      const error = new EntityNotFoundError(Book, 1);
      errorHandler(error, responseMock);

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(sendSpy).toHaveBeenCalledWith('Book with ID = 1 does not exist');
    });

    it('should handle ForeignKeyConstraintError', () => {
      const error = new ForeignKeyConstraintError('constraint', '1', 'foo');
      errorHandler(error, responseMock);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(sendSpy)
        .toHaveBeenCalledWith('A foreign key constraint violation occurred. Foo with ID = 1 does not exist');
    });

    it('should handle UniqueConstraintError', () => {
      const error = new UniqueConstraintError('constraint', 'foo', '1');
      errorHandler(error, responseMock);

      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(sendSpy)
        .toHaveBeenCalledWith('A unique constraint violation occurred. Key (foo) with value (1) already exists');
    });

    it('should handle ValidationError', () => {
      const error = new ValidationError('Foo');
      errorHandler(error, responseMock);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(sendSpy).toHaveBeenCalledWith('Foo');
    });

    it('should handle an unknown error', () => {
      const errorSpy = jest.spyOn(logger, 'error');
      const error = new Error('an error');
      errorHandler(error, responseMock);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(sendSpy).toHaveBeenCalledWith('Server Error');
      expect(errorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('dbErrorHandler', () => {
    // tslint:disable-next-line:max-line-length
    it('should throw a ForeignKeyConstraintError given it has a constraint property and the message matches the regular expression', () => {
      const error = {
        constraint: 'fk_123',
        message: 'insert or update on table "foo" violates foreign key constraint "fk_1234"',
      };
      expect(() => {
        dbErrorHandler(error);
      }).toThrow(ForeignKeyConstraintError);
    });

    it('should throw a ForeignKeyConstraintError with details if the error has more details', () => {
      const error = {
        constraint: 'fk_123',
        detail: 'Key (foo)=(1) is not present in table "foo".',
        message: 'insert or update on table "foo" violates foreign key constraint "fk_1234"',
      };
      expect(() => {
        dbErrorHandler(error);
      }).toThrowError('A foreign key constraint violation occurred. Foo with ID = 1 does not exist');
    });

    // tslint:disable-next-line:max-line-length
    it('should throw a UniqueConstraintError given it has a constraint property and the message matches the regular expression', () => {
      const error = {
        constraint: 'fk_123',
        message: 'duplicate key value violates unique constraint "fk_123"',
      };
      expect(() => {
        dbErrorHandler(error);
      }).toThrow(UniqueConstraintError);
    });

    it('should throw a UniqueConstraintError with details if the error has more details', () => {
      const error = {
        constraint: 'fk_123',
        detail: 'Key (foo)=(1234) already exists.',
        message: 'duplicate key value violates unique constraint "fk_123"',
      };
      expect(() => {
        dbErrorHandler(error);
      }).toThrow('A unique constraint violation occurred. Key (foo) with value (1234) already exists');
    });

    it('should not throw an error given the message does not match the regular expressions', () => {
      const error = {
        message: 'null value in column "id" violates not-null constraint',
      };

      expect(() => {
        dbErrorHandler(error);
      }).not.toThrow();
    });
  });
});
