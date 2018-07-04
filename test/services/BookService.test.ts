import {
  BookUpdateDTO,
  NewBookDTO,
} from '../../src/dtos';
import { Book } from '../../src/entities/Book';
import { BookService } from '../../src/services/BookService';
import * as errorHandler from '../../src/util/errorHandler';

describe('BookService', () => {
  const bookEntity = {} as Book;
  const id = 1;
  let bookService: BookService;
  let bookRepository: {
    create: jest.Mock,
    delete: jest.Mock,
    find: jest.Mock,
    findOne: jest.Mock,
    save: jest.Mock,
  };

  beforeEach(() => {
    bookRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    bookService = new BookService(bookRepository as any);
  });

  describe('createBook', () => {
    const newBook = new NewBookDTO({
      isbn13: '1234567890123',
      title: 'FooBar',
    });

    it('should create a new repository entity from the DTO', () => {
      bookService.createBook(newBook);

      expect(bookRepository.create).toHaveBeenCalledWith({
        isbn13: '1234567890123',
        title: 'FooBar',
      });
    });

    it('should should save the entity to the repository', () => {
      bookRepository.create.mockImplementationOnce(() => bookEntity);
      bookService.createBook(newBook);

      expect(bookRepository.save).toHaveBeenCalledWith(bookEntity);
    });

    it('should call the dbErrorHandler function if the save fails', async () => {
      const error = new Error();
      bookRepository.save.mockImplementationOnce(() => {
        throw error;
      });
      const dbErrorHandlerSpy = jest.spyOn(errorHandler, 'dbErrorHandler');
      try {
        await bookService.createBook(newBook);
      } catch {
        // Do nothing
      }

      expect(dbErrorHandlerSpy).toHaveBeenCalledWith(error);
    });

    it('should rethrow the error if the save fails', () => {
      const error = new Error();
      bookRepository.save.mockImplementationOnce(() => {
        throw error;
      });
      expect(bookService.createBook(newBook)).rejects.toThrowError(error);
    });
  });

  describe('deleteBook', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      bookRepository.findOne.mockImplementationOnce(() => undefined);

      expect(bookService.deleteBook(id)).rejects
        .toThrow('Book with ID = 1 does not exist');
    });

    it('should delete the entity with the given id if it is found', async () => {
      bookRepository.findOne.mockImplementationOnce(() => bookEntity);

      await bookService.deleteBook(id);
      expect(bookRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getBook', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      bookRepository.findOne.mockImplementationOnce(() => undefined);

      expect(bookService.getBook(id)).rejects
        .toThrow('Book with ID = 1 does not exist');
    });

    it('should return the entity with the given id if it is found', async () => {
      bookRepository.findOne.mockImplementationOnce(() => bookEntity);

      const entity = await bookService.getBook(id);
      expect(entity).toBe(bookEntity);
    });
  });

  describe('getBooks', () => {
    it.skip('should return all of the found entities in the repository', () => {
      const bookEntities = [
        {} as Book,
        {} as Book,
      ];
      bookRepository.find.mockImplementationOnce(() => bookEntities);

      // expect(bookService.getBooks()).toBe(bookEntities);
    });
  });

  describe('updateBook', () => {
    const book = {
      authors: [],
      categories: [],
      id: 1,
      isbn10: '1234567890',
      isbn13: '1234567890123',
      publicationDate: '2001-02-03',
      publishers: [],
      title: 'Foo',
    } as Book;
    const bookUpdateDTO = new BookUpdateDTO({
      authors: [
        1,
        2,
      ],
      categories: [
        7,
      ],
      title: 'Bar',
    });

    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      bookRepository.findOne.mockImplementationOnce(() => undefined);

      expect(bookService.updateBook(id, {} as any)).rejects
        .toThrow('Book with ID = 1 does not exist');
    });

    it('should save the updated entity to the repository', async () => {
      bookRepository.findOne.mockImplementationOnce(() => book);
      await bookService.updateBook(id, bookUpdateDTO);

      expect(bookRepository.save).toHaveBeenCalledWith({
        authors: [
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 }),
        ],
        categories: [
          expect.objectContaining({ id: 7 }),
        ],
        id: 1,
        isbn10: '1234567890',
        isbn13: '1234567890123',
        publicationDate: '2001-02-03',
        publishers: [],
        title: 'Bar',
      });
    });

    it('should return the updated entity from the repository', async () => {
      const updatedBookEntity = {} as Book;
      bookRepository.findOne
        .mockImplementationOnce(() => book)
        .mockImplementationOnce(() => updatedBookEntity);
      const updatedBook = await bookService.updateBook(id, bookUpdateDTO);

      expect(updatedBook).toBe(updatedBookEntity);
    });

    it('should call the dbErrorHandler function if the save fails', async () => {
      const error = new Error();
      bookRepository.findOne.mockImplementationOnce(() => book);
      bookRepository.save.mockImplementationOnce(() => {
        throw error;
      });
      const dbErrorHandlerSpy = jest.spyOn(errorHandler, 'dbErrorHandler');
      try {
        await bookService.updateBook(id, bookUpdateDTO);
      } catch {
        // Do nothing
      }

      expect(dbErrorHandlerSpy).toHaveBeenCalledWith(error);
    });

    it('should rethrow the error if the save fails', () => {
      const error = new Error();
      bookRepository.findOne.mockImplementationOnce(() => book);
      bookRepository.save.mockImplementationOnce(() => {
        throw error;
      });
      expect(bookService.updateBook(id, bookUpdateDTO)).rejects.toThrowError(error);
    });
  });
});
