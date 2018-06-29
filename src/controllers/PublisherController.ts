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
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import Joi from 'joi';

import { TYPES } from '../constants/types';
import {
  IPublisherUpdateDTO,
  PublisherDTO,
  PublisherUpdateDTO,
} from '../dtos';
import { ValidationError } from '../errors/ValidationError';
import { PublisherService } from '../services/PublisherService';
import { errorHandler } from '../util/errorHandler';

export interface IPublisherController {
  getCategories(): Promise<PublisherDTO[]>;
  getPublisher(id: number, res: Response): Promise<PublisherDTO | undefined>;
  createPublisher(newPublisher: IPublisherUpdateDTO, req: Request, res: Response): Promise<void>;
  updatePublisher(id: number, publisherUpdate: IPublisherUpdateDTO, res: Response): Promise<PublisherDTO | undefined>;
  deletePublisher(id: number, res: Response): Promise<void>;
}

@controller('/publishers')
export class PublisherController implements IPublisherController {
  constructor(
    @inject(TYPES.PublisherService)
    private readonly publisherService: PublisherService,
  ) { }

  @httpGet('/')
  public async getCategories(): Promise<PublisherDTO[]> {
    const publishers = await this.publisherService.getPublishers();
    return publishers.map(PublisherDTO.toDTO);
  }

  @httpGet('/:id')
  public async getPublisher(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<PublisherDTO | undefined> {
    const idSchema = Joi.number().label('id');
    const result = Joi.validate(id, idSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      const publisher = await this.publisherService.getPublisher(id);
      return PublisherDTO.toDTO(publisher);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPost('/')
  public async createPublisher(
    @requestBody() newPublisher: PublisherUpdateDTO,
    @request() req: Request,
    @response() res: Response,
  ): Promise<void> {
    const newPublisherSchema = {
      name: Joi.string().required(),
    };
    const result = Joi.validate(newPublisher, newPublisherSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      const createdPublisher = await this.publisherService.createPublisher(new PublisherUpdateDTO(newPublisher));
      res.location(`${req.originalUrl}/${createdPublisher.id}`);
      res.sendStatus(CREATED);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpPut('/:id')
  public async updatePublisher(
    @requestParam('id') id: number,
    @requestBody() publisherUpdate: IPublisherUpdateDTO,
    @response() res: Response,
  ): Promise<PublisherDTO | undefined> {
    const idSchema = Joi.number().label('id');
    const publisherUpdateSchema = {
      name: Joi.string().required(),
    };
    const resultId = Joi.validate(id, idSchema);
    const resultPublisherUpdate = Joi.validate(publisherUpdate, publisherUpdateSchema);
    try {
      if (resultId.error) {
        throw new ValidationError(resultId.error.message);
      } else if (resultPublisherUpdate.error) {
        throw new ValidationError(resultPublisherUpdate.error.message);
      }
      const updatedPublisher = await this.publisherService.updatePublisher(id, new PublisherUpdateDTO(publisherUpdate));
      return PublisherDTO.toDTO(updatedPublisher);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  @httpDelete('/:id')
  public async deletePublisher(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    const idSchema = Joi.number().label('id');
    const result = Joi.validate(id, idSchema);
    try {
      if (result.error) {
        throw new ValidationError(result.error.message);
      }
      return await this.publisherService.deletePublisher(id);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
