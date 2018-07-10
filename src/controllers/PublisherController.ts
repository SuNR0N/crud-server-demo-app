import {
  Request,
  Response,
} from 'express';
import { CREATED } from 'http-status-codes';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  queryParam,
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import Joi from 'joi';

import { isAuthenticated } from '../config/passport';
import {
  Schemas,
  Types,
} from '../constants';
import {
  IPublisherUpdateDTO,
  PublisherDTO,
  PublisherUpdateDTO,
} from '../dtos';
import { ValidationError } from '../errors/ValidationError';
import { PublisherService } from '../services/PublisherService';
import { errorHandler } from '../util/errorHandler';

export interface IPublisherController {
  getPublishers(query: string, req: Request, res: Response): Promise<PublisherDTO[] | undefined>;
  getPublisher(id: number, req: Request, res: Response): Promise<PublisherDTO | undefined>;
  createPublisher(newPublisher: IPublisherUpdateDTO, req: Request, res: Response): Promise<void>;
  // tslint:disable-next-line:max-line-length
  updatePublisher(id: number, publisherUpdate: IPublisherUpdateDTO, req: Request, res: Response): Promise<PublisherDTO | undefined>;
  deletePublisher(id: number, res: Response): Promise<void>;
}

@controller('/publishers')
export class PublisherController implements IPublisherController {
  constructor(
    @inject(Types.PublisherService)
    private readonly publisherService: PublisherService,
  ) { }

  @httpGet('/')
  public async getPublishers(
    @queryParam('q') query: string,
    @request() req: Request,
    @response() res: Response,
  ): Promise<PublisherDTO[] | undefined> {
    const validationResult = Joi.validate(req.query, Schemas.GetPublishersQuery);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const publishers = await this.publisherService.getPublishers(query);
      return publishers.map((publisher) => PublisherDTO.toDTO(publisher, req));
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpGet('/:id')
  public async getPublisher(
    @requestParam('id') id: number,
    @request() req: Request,
    @response() res: Response,
  ): Promise<PublisherDTO | undefined> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const publisher = await this.publisherService.getPublisher(id);
      return PublisherDTO.toDTO(publisher, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/', isAuthenticated)
  public async createPublisher(
    @requestBody() newPublisher: PublisherUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(newPublisher, Schemas.Publisher);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      const createdPublisher = await this.publisherService.createPublisher(new PublisherUpdateDTO(newPublisher));
      res.location(`${req.originalUrl}/${createdPublisher.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPut('/:id', isAuthenticated)
  public async updatePublisher(
    @requestParam('id') id: number,
    @requestBody() publisherUpdate: IPublisherUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<PublisherDTO | undefined> {
    const validationResultId = Joi.validate(id, Schemas.Id);
    const validationResultPublisherUpdate = Joi.validate(publisherUpdate, Schemas.Publisher);
    try {
      if (validationResultId.error) {
        throw new ValidationError(validationResultId.error.message);
      } else if (validationResultPublisherUpdate.error) {
        throw new ValidationError(validationResultPublisherUpdate.error.message);
      }
      const updatedPublisher = await this.publisherService.updatePublisher(id, new PublisherUpdateDTO(publisherUpdate));
      return PublisherDTO.toDTO(updatedPublisher, req);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id', isAuthenticated)
  public async deletePublisher(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const validationResult = Joi.validate(id, Schemas.Id);
    try {
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.message);
      }
      return await this.publisherService.deletePublisher(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
