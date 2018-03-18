import {
  inject,
  injectable,
} from 'inversify';

import { TYPES } from '../constant/types';
import { IBook } from '../interfaces/Book';
import { BookRepository } from '../repository/BookRepository';

export interface IBookService {
  createBook(book: IBook): IBook;
  deleteBook(id: string): void;
  getBook(id: string): IBook;
  getBooks(): IBook[];
  updateBook(id: string, book: Partial<IBook>): IBook;
}

@injectable()
export class BookService implements IBookService {
  constructor(
    @inject(TYPES.BookRepository)
    private readonly bookRepository: BookRepository,
  ) { }

  public createBook(book: IBook): IBook {
    return this.bookRepository.save(book);
  }

  public deleteBook(id: string): void {
    return this.bookRepository.delete(id);
  }

  public getBook(id: string): IBook {
    return this.bookRepository.findOne(id);
  }

  public getBooks(): IBook[] {
    return this.bookRepository.findAll();
  }

  public updateBook(id: string, book: Partial<IBook>): IBook {
    const existingBook = this.bookRepository.findOne(id);
    const updatedBook: IBook = {
      ...existingBook,
      ...book,
      isbn: id,
    };
    return this.bookRepository.save(updatedBook);
  }
}
