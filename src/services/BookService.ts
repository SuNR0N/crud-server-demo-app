import {
  inject,
  injectable,
} from 'inversify';
import { Repository } from 'typeorm';

import { Types } from '../constants/types';
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
  getBooks(offset: number, pageSize: number, query: string): Promise<[Book[], number]>;
  updateBook(id: number, book: BookUpdateDTO): Promise<Book>;
}

@injectable()
export class BookService implements IBookService {
  constructor(
    @inject(Types.BookRepository)
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
    await this.bookRepository.delete(id);
  }

  public async getBook(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne(id);
    if (!book) {
      throw new EntityNotFoundError(Book, id);
    }
    return book;
  }

  public async getBooks(offset: number, pageSize: number, query: string = ''): Promise<[Book[], number]> {
    const paramLike = { query: `%${query.toLowerCase()}%` };
    return await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .leftJoinAndSelect('book.publishers', 'publisher')
      .where('LOWER(book.title) LIKE :query', paramLike)
      .orWhere('LOWER(book.isbn10) LIKE :query', paramLike)
      .orWhere('LOWER(book.isbn13) LIKE :query', paramLike)
      .orWhere('LOWER(author.first_name) LIKE :query', paramLike)
      .orWhere('LOWER(author.middle_name) LIKE :query', paramLike)
      .orWhere('LOWER(author.last_name) LIKE :query', paramLike)
      .orWhere('LOWER(category.name) LIKE :query', paramLike)
      .orWhere('LOWER(publisher.name) LIKE :query', paramLike)
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();
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
