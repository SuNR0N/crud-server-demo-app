import { Response } from 'express';
import {
  BAD_REQUEST,
  getStatusText,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';

import {
  EntityNotFoundError,
  ValidationError,
} from '../errors';
import { logger } from './logger';

export function errorHandler(error: any, response: Response): void {
  if (error instanceof EntityNotFoundError) {
    response.status(NOT_FOUND);
    response.send(error.message);
  } else if (error instanceof ValidationError) {
    response.status(BAD_REQUEST);
    response.send(error.message);
  } else {
    logger.error(error);
    response.status(INTERNAL_SERVER_ERROR);
    response.send(getStatusText(INTERNAL_SERVER_ERROR));
  }
}
