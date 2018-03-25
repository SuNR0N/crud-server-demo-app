import { AsyncContainerModule } from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import { getDbConnection } from '../db';
import { Book } from '../entities/Book';
import { getBookRepository } from '../repositories';
import { BookService } from '../services/BookService';

export const bindings = new AsyncContainerModule(async (bind) => {
  await getDbConnection();

  // Import controllers
  await require('../controllers/BookController');

  // Set up bindings
  bind<BookService>(TYPES.BookService).to(BookService);
  bind<Repository<Book>>(TYPES.BookRepository).toDynamicValue(() => getBookRepository())
    .inRequestScope();
});
