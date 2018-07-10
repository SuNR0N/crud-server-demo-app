import { Request } from 'express';

import {
  BookDTO,
  IBookDTO,
} from '../../src/dtos/BookDTO';
import { Book } from '../../src/entities/Book';

describe('BookDTO', () => {
  describe('toDTO', () => {
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
    let dto: IBookDTO;
    let isAuthenticatedMock: jest.Mock;

    beforeEach(() => {
      isAuthenticatedMock = jest.fn(() => false);
      dto = BookDTO.toDTO(book, {
        isAuthenticated: isAuthenticatedMock,
      } as any as Request);
    });

    it('should map the entity to DTO', () => {
      expect(dto).toEqual(expect.objectContaining({
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
      }));
    });

    it('should map the entity to DTO if relationships do not exist', () => {
      const bookWithoutRelationships = {
        authors: null,
        categories: null,
        id: 1,
        isbn10: '1234567890',
        isbn13: '123456789123',
        publicationDate: '2001-02-03',
        publishers: null,
        title: 'FooBar',
      } as any as Book;
      const dtoWithoutRelationships = BookDTO.toDTO(bookWithoutRelationships, {
        isAuthenticated: isAuthenticatedMock,
      } as any as Request);

      expect(dtoWithoutRelationships).toEqual(expect.objectContaining({
        authors: [],
        categories: [],
        id: 1,
        isbn10: '1234567890',
        isbn13: '123456789123',
        publicationDate: '2001-02-03',
        publishers: [],
        title: 'FooBar',
      }));
    });

    it('should add the "self" link', () => {
      expect(dto._links).toHaveProperty(
        'self',
        {
          href: '/api/v1/books/1',
          method: 'GET',
        },
      );
    });

    describe('given the request is authenticated', () => {
      beforeEach(() => {
        isAuthenticatedMock = jest.fn(() => true);
        dto = BookDTO.toDTO(book, {
          isAuthenticated: isAuthenticatedMock,
        } as any as Request);
      });

      it('should add the "delete" link', () => {
        expect(dto._links).toHaveProperty(
          'delete',
          {
            href: '/api/v1/books/1',
            method: 'DELETE',
          },
        );
      });

      it('should add the "update" link', () => {
        expect(dto._links).toHaveProperty(
          'update',
          {
            href: '/api/v1/books/1',
            method: 'PATCH',
          },
        );
      });
    });

    describe('given the request is not authenticated', () => {
      it('should not add the "delete" link', () => {
        expect(dto._links).not.toHaveProperty('delete');
      });

      it('should not add the "update" link', () => {
        expect(dto._links).not.toHaveProperty('update');
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
