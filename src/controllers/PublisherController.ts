import { Response } from 'express';
import {
  getStatusText,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';

import { TYPES } from '../constants/types';
import {
  IPublisherUpdateDTO,
  PublisherDTO,
  PublisherUpdateDTO,
} from '../dtos';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { PublisherService } from '../services/PublisherService';

export interface IPublisherController {
  getCategories(): Promise<PublisherDTO[]>;
  getPublisher(id: number, res: Response): Promise<PublisherDTO | undefined>;
  createPublisher(newPublisher: IPublisherUpdateDTO): Promise<PublisherDTO>;
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
    try {
      const publisher = await this.publisherService.getPublisher(id);
      return PublisherDTO.toDTO(publisher);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(NOT_FOUND);
        res.send(error.message);
      } else {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(getStatusText(INTERNAL_SERVER_ERROR));
      }
    }
  }

  @httpPost('/')
  public async createPublisher(
    @requestBody() newPublisher: PublisherUpdateDTO,
  ): Promise<PublisherDTO> {
    const createdPublisher = await this.publisherService.createPublisher(new PublisherUpdateDTO(newPublisher));
    return PublisherDTO.toDTO(createdPublisher);
  }

  @httpPut('/:id')
  public async updatePublisher(
    @requestParam('id') id: number,
    @requestBody() publisherUpdate: IPublisherUpdateDTO,
    @response() res: Response,
  ): Promise<PublisherDTO | undefined> {
    try {
      const updatedPublisher = await this.publisherService.updatePublisher(id, new PublisherUpdateDTO(publisherUpdate));
      return PublisherDTO.toDTO(updatedPublisher);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(NOT_FOUND);
        res.send(error.message);
      } else {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(getStatusText(INTERNAL_SERVER_ERROR));
      }
    }
  }

  @httpDelete('/:id')
  public async deletePublisher(
    @requestParam('id') id: number,
    @response() res: Response,
  ): Promise<void> {
    try {
      return await this.publisherService.deletePublisher(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        res.status(NOT_FOUND);
        res.send(error.message);
      } else {
        res.status(INTERNAL_SERVER_ERROR);
        res.send(getStatusText(INTERNAL_SERVER_ERROR));
      }
    }
  }
}
