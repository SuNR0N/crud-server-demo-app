import { Response } from 'express';
import {
  BAD_REQUEST,
  getStatusText,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';

import {
  ConstraintViolationError,
  EntityNotFoundError,
  ValidationError,
} from '../errors';
import { logger } from './logger';

export function errorHandler(error: any, response: Response): void {
  switch (error.constructor) {
    case EntityNotFoundError:
      response.status(NOT_FOUND);
      response.send(error.message);
      break;
    case ValidationError:
      response.status(BAD_REQUEST);
      response.send(error.message);
      break;
    case ConstraintViolationError:
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
  const constraintViolationRegExp = /violates foreign key constraint/;
  if (constraintViolationRegExp.test(error.message) && error.constraint) {
    const detailRegExp = /^Key \(\w*\)=\((\d{1,})\) is not present in table "(\w*)".$/;
    const detailRegExpExec = detailRegExp.exec(error.detail);
    if (detailRegExpExec) {
      throw new ConstraintViolationError(error.constraint, detailRegExpExec[1], detailRegExpExec[2]);
    } else {
      throw new ConstraintViolationError(error.constraint);
    }
  }
}
