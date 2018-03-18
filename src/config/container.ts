import { Container } from 'inversify';

import { TYPES } from '../constant/types';
import { BookRepository } from '../repository/BookRepository';
import { BookService } from '../service/BookService';

// Import controllers
import '../controller/BookController';

export const container = new Container();

// Set up bindings
container.bind<BookService>(TYPES.BookService).to(BookService);
container.bind<BookRepository>(TYPES.BookRepository).to(BookRepository);
