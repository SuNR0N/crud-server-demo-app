import { AsyncContainerModule } from 'inversify';
import { Repository } from 'typeorm';

import { Types } from '../constants/types';
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
  bind<AuthorService>(Types.AuthorService).to(AuthorService);
  bind<BookService>(Types.BookService).to(BookService);
  bind<CategoryService>(Types.CategoryService).to(CategoryService);
  bind<PublisherService>(Types.PublisherService).to(PublisherService);
  bind<Repository<Author>>(Types.AuthorRepository).toDynamicValue(() => getAuthorRepository())
    .inRequestScope();
  bind<Repository<Book>>(Types.BookRepository).toDynamicValue(() => getBookRepository())
    .inRequestScope();
  bind<Repository<Category>>(Types.CategoryRepository).toDynamicValue(() => getCategoryRepository())
    .inRequestScope();
  bind<Repository<Publisher>>(Types.PublisherRepository).toDynamicValue(() => getPublisherRepository())
    .inRequestScope();
});
