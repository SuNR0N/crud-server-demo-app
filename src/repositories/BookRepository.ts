import {
  getConnection,
  Repository,
} from 'typeorm';

import { Book } from '../entities/Book';

export function getBookRepository(): Repository<Book> {
  const conn = getConnection();
  const bookRepository = conn.getRepository(Book);
  return bookRepository;
}
