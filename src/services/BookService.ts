import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import {
  BookDTO,
  NewBookDTO,
} from '../dtos';
import { Book } from '../entities/Book';

export interface IBookService {
  createBook(newBook: NewBookDTO): Promise<Book>;
  deleteBook(id: number): Promise<void>;
  getBook(id: number): Promise<Book | undefined>;
  getBooks(): Promise<Book[]>;
  updateBook(id: number, book: Partial<BookDTO>): Promise<Book>;
}

@injectable()
export class BookService implements IBookService {
  constructor(
    @inject(TYPES.BookRepository)
    private readonly bookRepository: Repository<Book>,
  ) { }

  public createBook(book: NewBookDTO): Promise<Book> {
    const newBook = this.bookRepository.create(book);
    return this.bookRepository.save(newBook);
  }

  public deleteBook(id: number): Promise<void> {
    return this.bookRepository.deleteById(id);
  }

  public getBook(id: number): Promise<Book | undefined> {
    return this.bookRepository.findOneById(id);
  }

  public getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  public async updateBook(id: number, book: Partial<BookDTO>): Promise<Book> {
    const existingBook = await this.bookRepository.findOneById(id);
    return this.bookRepository.save(existingBook!);
  }
}
