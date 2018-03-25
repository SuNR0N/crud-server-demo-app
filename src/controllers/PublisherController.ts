import { Response } from 'express';
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
  PublisherDTO,
  PublisherUpdateDTO,
} from '../dtos';
import { PublisherService } from '../services/PublisherService';

export interface IPublisherController {
  getCategories(): Promise<PublisherDTO[]>;
  getPublisher(id: number, res: Response): Promise<PublisherDTO | undefined>;
  createPublisher(newPublisher: PublisherUpdateDTO): Promise<PublisherDTO>;
  updatePublisher(id: number, publisherUpdate: PublisherUpdateDTO): Promise<PublisherDTO | undefined>;
  deletePublisher(id: number): Promise<void>;
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
    const publisher = await this.publisherService.getPublisher(id);
    if (publisher) {
      return PublisherDTO.toDTO(publisher);
    } else {
      res.status(404);
      res.send('Not Found');
    }
  }

  @httpPost('/')
  public async createPublisher(
    @requestBody() newPublisher: PublisherUpdateDTO,
  ): Promise<PublisherDTO> {
    const createdPublisher = await this.publisherService.createPublisher(newPublisher);
    return PublisherDTO.toDTO(createdPublisher);
  }

  @httpPut('/:id')
  public async updatePublisher(
    @requestParam('id') id: number,
    @requestBody() publisherUpdate: PublisherUpdateDTO,
  ): Promise<PublisherDTO | undefined> {
    const updatedPublisher = await this.publisherService.updatePublisher(id, publisherUpdate);
    return PublisherDTO.toDTO(updatedPublisher);
  }

  @httpDelete('/:id')
  public async deletePublisher(
    @requestParam('id') id: number,
  ): Promise<void> {
    return await this.publisherService.deletePublisher(id);
  }
}
