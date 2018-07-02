import { Response } from 'express';
import {
  BAD_REQUEST,
  CONFLICT,
  getStatusText,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';

import {
  EntityNotFoundError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from '../errors';
import { logger } from './logger';

export function errorHandler(error: any, response: Response): void {
  switch (error.constructor) {
    case EntityNotFoundError:
      response.status(NOT_FOUND);
      response.send(error.message);
      break;
    case ForeignKeyConstraintError:
      response.status(BAD_REQUEST);
      response.send(error.message);
      break;
    case UniqueConstraintError:
      response.status(CONFLICT);
      response.send(error.message);
      break;
    case ValidationError:
      response.status(BAD_REQUEST);
      response.send(error.message);
      break;
    default:
      logger.error(error);
      response.status(INTERNAL_SERVER_ERROR);
      response.send(getStatusText(INTERNAL_SERVER_ERROR));
      break;
  }
}

export function dbErrorHandler(error: any): void {
  const foreignKeyConstraintRegExp = /violates foreign key constraint/;
  const uniqueConstraintRegExp = /violates unique constraint/;
  if (error.constraint) {
    if (foreignKeyConstraintRegExp.test(error.message)) {
      const detailRegExp = /^Key \(\w*\)=\((\d{1,})\) is not present in table "(\w*)".$/;
      const detailRegExpExec = detailRegExp.exec(error.detail);
      if (detailRegExpExec) {
        throw new ForeignKeyConstraintError(error.constraint, detailRegExpExec[1], detailRegExpExec[2]);
      } else {
        throw new ForeignKeyConstraintError(error.constraint);
      }
    } else if (uniqueConstraintRegExp.test(error.message)) {
      const detailRegExp = /^Key \((\w*)\)=\((\w*)\) already exists.$/;
      const detailRegExpExec = detailRegExp.exec(error.detail);
      if (detailRegExpExec) {
        throw new UniqueConstraintError(error.constraint, detailRegExpExec[1], detailRegExpExec[2]);
      } else {
        throw new UniqueConstraintError(error.constraint);
      }
    }
  }
}
