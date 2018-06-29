import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import { PublisherUpdateDTO } from '../dtos/PublisherUpdateDTO';
import { Publisher } from '../entities/Publisher';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';

export interface IPublisherService {
  createPublisher(publisher: PublisherUpdateDTO): Promise<Publisher>;
  deletePublisher(id: number): Promise<void>;
  getPublisher(id: number): Promise<Publisher>;
  getPublishers(): Promise<Publisher[]>;
  updatePublisher(id: number, publisher: PublisherUpdateDTO): Promise<Publisher>;
}

@injectable()
export class PublisherService implements IPublisherService {
  constructor(
    @inject(TYPES.PublisherRepository)
    private readonly publisherRepository: Repository<Publisher>,
  ) { }

  public createPublisher(publisher: PublisherUpdateDTO): Promise<Publisher> {
    const newPublisher = this.publisherRepository.create(publisher.toEntity());
    return this.publisherRepository.save(newPublisher);
  }

  public async deletePublisher(id: number): Promise<void> {
    const publisher = await this.publisherRepository.findOne(id);
    if (!publisher) {
      throw new EntityNotFoundError(Publisher, id);
    }
    this.publisherRepository.delete(id);
  }

  public async getPublisher(id: number): Promise<Publisher> {
    const publisher = await this.publisherRepository.findOne(id);
    if (!publisher) {
      throw new EntityNotFoundError(Publisher, id);
    }
    return publisher;
  }

  public getPublishers(): Promise<Publisher[]> {
    return this.publisherRepository.find();
  }

  public async updatePublisher(id: number, publisher: PublisherUpdateDTO): Promise<Publisher> {
    const existingPublisher = await this.publisherRepository.findOne(id);
    if (!existingPublisher) {
      throw new EntityNotFoundError(Publisher, id);
    }
    const updatedPublisher: Publisher = {
      ...existingPublisher,
      ...publisher.toEntity(),
    };
    return this.publisherRepository.save(updatedPublisher);
  }
}
