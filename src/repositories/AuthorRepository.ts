import {
  getConnection,
  Repository,
} from 'typeorm';

import { Author } from '../entities/Author';

export function getAuthorRepository(): Repository<Author> {
  const conn = getConnection();
  const authorRepository = conn.getRepository(Author);
  return authorRepository;
}
