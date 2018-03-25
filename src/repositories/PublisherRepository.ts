import {
  getConnection,
  Repository,
} from 'typeorm';

import { Publisher } from '../entities/Publisher';

export function getPublisherRepository(): Repository<Publisher> {
  const conn = getConnection();
  const publisherRepository = conn.getRepository(Publisher);
  return publisherRepository;
}
