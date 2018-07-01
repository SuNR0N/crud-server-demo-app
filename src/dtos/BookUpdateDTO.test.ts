import {
  Author,
  Category,
  Publisher,
} from '../entities';
import {
  BookUpdateDTO,
  IBookUpdateDTO,
} from './BookUpdateDTO';

describe('BookUpdateDTO', () => {
  const data: IBookUpdateDTO = {
    authors: [
      1,
      3,
    ],
    categories: [
      5,
      7,
    ],
    isbn10: '1234567890',
    isbn13: '1234567890123',
    publicationDate: '2001-02-03',
    publishers: [
      11,
      13,
    ],
    title: 'FooBar',
  };
  let dto: BookUpdateDTO;

  beforeEach(() => {
    dto = new BookUpdateDTO(data);
  });

  describe('constructor', () => {
    it('should set the properties if an argument is provided', () => {
      expect(dto.authors).toEqual([
        1,
        3,
      ]);
      expect(dto.categories).toEqual([
        5,
        7,
      ]);
      expect(dto.isbn10).toBe('1234567890');
      expect(dto.isbn13).toBe('1234567890123');
      expect(dto.publicationDate).toBe('2001-02-03');
      expect(dto.publishers).toEqual([
        11,
        13,
      ]);
      expect(dto.title).toBe('FooBar');
    });
  });

  describe('toEntity', () => {
    it('should return a book entity from the DTO', () => {
      expect(dto.toEntity()).toEqual({
        authors: [
          { id: 1 },
          { id: 3 },
        ],
        categories: [
          { id: 5 },
          { id: 7 },
        ],
        isbn10: '1234567890',
        isbn13: '1234567890123',
        publicationDate: '2001-02-03',
        publishers: [
          { id: 11 },
          { id: 13 },
        ],
        title: 'FooBar',
      });
    });

    it('should map the author ids to Author instances', () => {
      const { authors } = dto.toEntity();

      expect(authors!.every((author) => author instanceof Author)).toBe(true);
    });

    it('should map the category ids to Category instances', () => {
      const { categories } = dto.toEntity();

      expect(categories!.every((category) => category instanceof Category)).toBe(true);
    });

    it('should map the publisher ids to Publisher instances', () => {
      const { publishers } = dto.toEntity();

      expect(publishers!.every((publisher) => publisher instanceof Publisher)).toBe(true);
    });

    it('should return a partial book entity with defined properties only', () => {
      const partialData: IBookUpdateDTO = {
        title: 'FooBar',
      };
      const partialDto = new BookUpdateDTO(partialData);

      expect(partialDto.toEntity()).toStrictEqual({
        title: 'FooBar',
      });
    });
  });
});
