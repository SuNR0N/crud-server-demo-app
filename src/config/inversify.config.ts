import { AsyncContainerModule } from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import { getDbConnection } from '../db';
import {
  Author,
  Book,
  Category,
  Publisher,
} from '../entities';
import {
  getAuthorRepository,
  getBookRepository,
  getCategoryRepository,
  getPublisherRepository,
} from '../repositories';
import {
  AuthorService,
  BookService,
  CategoryService,
  PublisherService,
} from '../services';

export const bindings = new AsyncContainerModule(async (bind) => {
  await getDbConnection();

  // Import controllers
  await require('../controllers/AuthorController');
  await require('../controllers/BookController');
  await require('../controllers/CategoryController');
  await require('../controllers/PublisherController');

  // Set up bindings
  bind<AuthorService>(TYPES.AuthorService).to(AuthorService);
  bind<BookService>(TYPES.BookService).to(BookService);
  bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
  bind<PublisherService>(TYPES.PublisherService).to(PublisherService);
  bind<Repository<Author>>(TYPES.AuthorRepository).toDynamicValue(() => getAuthorRepository())
    .inRequestScope();
  bind<Repository<Book>>(TYPES.BookRepository).toDynamicValue(() => getBookRepository())
    .inRequestScope();
  bind<Repository<Category>>(TYPES.CategoryRepository).toDynamicValue(() => getCategoryRepository())
    .inRequestScope();
  bind<Repository<Publisher>>(TYPES.PublisherRepository).toDynamicValue(() => getPublisherRepository())
    .inRequestScope();
});
