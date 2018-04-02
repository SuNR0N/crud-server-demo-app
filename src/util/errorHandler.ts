import { Response } from 'express';
import {
  getStatusText,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';

import { EntityNotFoundError } from '../errors';
import { logger } from './logger';

export function errorHandler(error: any, response: Response): void {
  if (error instanceof EntityNotFoundError) {
    response.status(NOT_FOUND);
    response.send(error.message);
  } else {
    logger.error(error);
    response.status(INTERNAL_SERVER_ERROR);
    response.send(getStatusText(INTERNAL_SERVER_ERROR));
  }
}
