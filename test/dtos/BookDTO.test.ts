import { BookDTO } from '../../src/dtos/BookDTO';
import { Book } from '../../src/entities/Book';

describe('BookDTO', () => {
  describe('toDTO', () => {
    it('should map the entity to DTO', () => {
      const book = {
        authors: [
          {
            first_name: 'John',
            last_name: 'Doe',
            middle_name: 'X',
          },
          {
            first_name: 'Jane',
            last_name: 'Doe',
          },
        ],
        categories: [
          { name: 'Fantasy' },
          { name: 'Novel' },
        ],
        id: 1,
        isbn10: '1234567890',
        isbn13: '123456789123',
        publicationDate: '2001-02-03',
        publishers: [
          { name: 'Foo' },
          { name: 'Bar' },
        ],
        title: 'FooBar',
      } as Book;
      const dto = BookDTO.toDTO(book);

      expect(dto).toEqual({
        authors: [
          'John X Doe',
          'Jane Doe',
        ],
        categories: [
          'Fantasy',
          'Novel',
        ],
        id: 1,
        isbn10: '1234567890',
        isbn13: '123456789123',
        publicationDate: '2001-02-03',
        publishers: [
          'Foo',
          'Bar',
        ],
        title: 'FooBar',
      });
    });

    it('should map the entity to DTO if relationships do not exist', () => {
      const book = {
        authors: null,
        categories: null,
        id: 1,
        isbn10: '1234567890',
        isbn13: '123456789123',
        publicationDate: '2001-02-03',
        publishers: null,
        title: 'FooBar',
      } as any as Book;
      const dto = BookDTO.toDTO(book);

      expect(dto).toEqual({
        authors: [],
        categories: [],
        id: 1,
        isbn10: '1234567890',
        isbn13: '123456789123',
        publicationDate: '2001-02-03',
        publishers: [],
        title: 'FooBar',
      });
    });
  });

  describe('constructor', () => {
    it('should default all properties if called without an argument', () => {
      const dto = new BookDTO();

      expect(dto.authors).toHaveLength(0);
      expect(dto.categories).toHaveLength(0);
      expect(dto.id).toBeNull();
      expect(dto.isbn10).toBeNull();
      expect(dto.isbn13).toBeNull();
      expect(dto.publicationDate).toBeNull();
      expect(dto.publishers).toHaveLength(0);
      expect(dto.title).toBeNull();
    });

    it('should set the properties if an argument is provided', () => {
      const dto = new BookDTO({
        authors: [
          'John Doe',
        ],
        categories: [
          'Fantasy',
        ],
        id: 1,
        isbn10: '1234567890',
        isbn13: '1234567890123',
        publicationDate: '2001-02-03',
        publishers: [
          'Foo',
        ],
        title: 'FooBar',
      });

      expect(dto.authors).toEqual([
        'John Doe',
      ]);
      expect(dto.categories).toEqual([
        'Fantasy',
      ]);
      expect(dto.id).toBe(1);
      expect(dto.isbn10).toBe('1234567890');
      expect(dto.isbn13).toBe('1234567890123');
      expect(dto.publicationDate).toBe('2001-02-03');
      expect(dto.publishers).toEqual([
        'Foo',
      ]);
      expect(dto.title).toBe('FooBar');
    });
  });
});
