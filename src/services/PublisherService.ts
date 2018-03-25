import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import { PublisherUpdateDTO } from '../dtos/PublisherUpdateDTO';
import { Publisher } from '../entities/Publisher';

export interface IPublisherService {
  createPublisher(publisher: PublisherUpdateDTO): Promise<Publisher>;
  deletePublisher(id: number): Promise<void>;
  getPublisher(id: number): Promise<Publisher | undefined>;
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
    const newPublisher = this.publisherRepository.create(publisher);
    return this.publisherRepository.save(newPublisher);
  }

  public deletePublisher(id: number): Promise<void> {
    return this.publisherRepository.deleteById(id);
  }

  public getPublisher(id: number): Promise<Publisher | undefined> {
    return this.publisherRepository.findOneById(id);
  }

  public getPublishers(): Promise<Publisher[]> {
    return this.publisherRepository.find();
  }

  public async updatePublisher(id: number, publisher: PublisherUpdateDTO): Promise<Publisher> {
    const existingPublisher = await this.publisherRepository.findOneById(id);
    return this.publisherRepository.save(existingPublisher!);
  }
}
