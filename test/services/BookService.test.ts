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
    createQueryBuilder: jest.Mock,
    delete: jest.Mock,
    findOne: jest.Mock,
    save: jest.Mock,
  };
  let selectQueryBuilder: {
    getManyAndCount: jest.Mock,
    leftJoinAndSelect: jest.Mock,
    orWhere: jest.Mock,
    skip: jest.Mock,
    take: jest.Mock,
    where: jest.Mock,
  };

  beforeEach(() => {
    selectQueryBuilder = {
      getManyAndCount: jest.fn(),
      leftJoinAndSelect: jest.fn(() => selectQueryBuilder),
      orWhere: jest.fn(() => selectQueryBuilder),
      skip: jest.fn(() => selectQueryBuilder),
      take: jest.fn(() => selectQueryBuilder),
      where: jest.fn(() => selectQueryBuilder),
    };
    bookRepository = {
      create: jest.fn(),
      createQueryBuilder: jest.fn(() => selectQueryBuilder),
      delete: jest.fn(),
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
    const offset = 0;
    const pageSize = 10;
    const query = 'FoO';

    beforeEach(async () => {
      await bookService.getBooks(offset, pageSize, query);
    });

    it('should call createQueryBuilder with "book"', () => {
      expect(bookRepository.createQueryBuilder).toHaveBeenCalledWith('book');
    });

    it('should call leftJoinAndSelect with "book.authors" and "author" for the 1st time', () => {
      expect(selectQueryBuilder.leftJoinAndSelect).toHaveBeenNthCalledWith(1, 'book.authors', 'author');
    });

    it('should call leftJoinAndSelect with "book.categories" and "category" for the 2nd time', () => {
      expect(selectQueryBuilder.leftJoinAndSelect).toHaveBeenNthCalledWith(2, 'book.categories', 'category');
    });

    it('should call leftJoinAndSelect with "book.publishers" and "publisher" for the 3rd time', () => {
      expect(selectQueryBuilder.leftJoinAndSelect).toHaveBeenNthCalledWith(3, 'book.publishers', 'publisher');
    });

    it('should call where with the proper condition on the title', () => {
      expect(selectQueryBuilder.where).toBeCalledWith('LOWER(book.title) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the isbn10 for the 1st time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(1, 'LOWER(book.isbn10) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the isbn13 for the 2nd time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(2, 'LOWER(book.isbn13) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the first_name of author for the 3nd time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(3, 'LOWER(author.first_name) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the middle_name of author for the 4th time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(4, 'LOWER(author.middle_name) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the last_name of author for the 5th time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(5, 'LOWER(author.last_name) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the name of category for the 6th time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(6, 'LOWER(category.name) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the name of publisher for the 7th time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(7, 'LOWER(publisher.name) LIKE :query', { query: '%foo%'});
    });

    it('should call skip with the provided offset', () => {
      expect(selectQueryBuilder.skip).toHaveBeenCalledWith(offset);
    });

    it('should call take with the provided pageSize', () => {
      expect(selectQueryBuilder.take).toHaveBeenCalledWith(pageSize);
    });

    it('should call getManyAndCount', () => {
      expect(selectQueryBuilder.getManyAndCount).toHaveBeenCalled();
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
