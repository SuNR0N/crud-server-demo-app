import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { TYPES } from '../constants/types';
import {
  BookUpdateDTO,
  NewBookDTO,
} from '../dtos';
import { Book } from '../entities/Book';
import { EntityNotFoundError } from '../errors/EntityNotFoundError';
import { dbErrorHandler } from '../util/errorHandler';

export interface IBookService {
  createBook(newBook: NewBookDTO): Promise<Book>;
  deleteBook(id: number): Promise<void>;
  getBook(id: number): Promise<Book>;
  getBooks(): Promise<Book[]>;
  updateBook(id: number, book: BookUpdateDTO): Promise<Book>;
}

@injectable()
export class BookService implements IBookService {
  constructor(
    @inject(TYPES.BookRepository)
    private readonly bookRepository: Repository<Book>,
  ) { }

  public async createBook(book: NewBookDTO): Promise<Book> {
    const newBook = this.bookRepository.create(book.toEntity());
    try {
      return await this.bookRepository.save(newBook);
    } catch (error) {
      dbErrorHandler(error);
      throw error;
    }
  }

  public async deleteBook(id: number): Promise<void> {
    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new EntityNotFoundError(Book, id);
    }
    this.bookRepository.delete(id);
  }

  public async getBook(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new EntityNotFoundError(Book, id);
    }
    return book;
  }

  public getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  public async updateBook(id: number, book: BookUpdateDTO): Promise<Book> {
    const existingBook = await this.bookRepository.findOne(id);
    if (!existingBook) {
      throw new EntityNotFoundError(Book, id);
    }
    const updatedBook: Book = {
      ...existingBook,
      ...book.toEntity(),
    };
    try {
      // TODO: investigate why does it not return the updated relations
      await this.bookRepository.save(updatedBook);
      return await this.bookRepository.findOne(id) as Book;
    } catch (error) {
      dbErrorHandler(error);
      throw error;
    }
  }
}
