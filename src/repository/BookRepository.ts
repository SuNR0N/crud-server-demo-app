import { injectable } from 'inversify';

import { IBook } from '../interfaces/Book';
import { ICrudRepository } from './CrudRepository';

@injectable()
export class BookRepository implements ICrudRepository<IBook, string> {
  private bookRepository: IBook[] = [
    {
      isbn: '123',
      title: 'Title 123',
    },
    {
      isbn: '456',
      title: 'Title 456',
    },
    {
      isbn: '789',
      title: 'Title 789',
    },
  ];

  public count(): number {
    return this.bookRepository.length;
  }

  public delete(key: string): void {
    const index = this.bookRepository.findIndex((book) => book.isbn === key);
    if (index > -1) {
      this.bookRepository.splice(index, 1);
    }
  }

  public exists(key: string): boolean {
    return !!this.bookRepository.find((book) => book.isbn === key);
  }

  public findAll(): IBook[] {
    return [
      ...this.bookRepository,
    ];
  }

  public findOne(key: string): IBook {
    const existingBook = this.bookRepository.find((book) => book.isbn === key);
    if (!existingBook) {
      throw new Error(`Book does not exist with ISBN ${key}`);
    }
    return {
      ...existingBook,
    };
  }

  public save(entity: IBook): IBook {
    const index = this.bookRepository.findIndex((book) => book.isbn === entity.isbn);
    if (index === -1) {
      this.bookRepository.push(entity);
    } else {
      this.bookRepository.splice(index, 1, entity);
    }
    return entity;
  }
}
