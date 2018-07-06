import {
  AuthorDTO,
  fullNameMapper,
  IAuthorDTO,
} from '../../src/dtos/AuthorDTO';
import { Author } from '../../src/entities/Author';

describe('AuthorDTO', () => {
  describe('fullNameMapper', () => {
    it('should return the full name of the author if they have a middle name', () => {
      const author = {
        first_name: 'John',
        last_name: 'Doe',
        middle_name: 'X',
      } as Author;
      const fullName = fullNameMapper(author);

      expect(fullName).toBe('John X Doe');
    });

    it('should return the full name of the author if they do not have a middle name', () => {
      const author = {
        first_name: 'John',
        last_name: 'Doe',
      } as Author;
      const fullName = fullNameMapper(author);

      expect(fullName).toBe('John Doe');
    });
  });

  describe('toDTO', () => {
    const author = {
      first_name: 'John',
      id: 1,
      last_name: 'Doe',
      middle_name: 'X',
    } as Author;
    let dto: IAuthorDTO;

    beforeEach(() => {
      dto = AuthorDTO.toDTO(author);
    });

    it('should map the entity to DTO', () => {
      expect(dto).toEqual(expect.objectContaining({
        firstName: 'John',
        fullName: 'John X Doe',
        id: 1,
        lastName: 'Doe',
        middleName: 'X',
      }));
    });

    it('should add the "self" link', () => {
      expect(dto._links).toHaveProperty(
        'self',
        {
          href: '/api/v1/authors/1',
          method: 'GET',
        },
      );
    });

    it('should add the "delete" link', () => {
      expect(dto._links).toHaveProperty(
        'delete',
        {
          href: '/api/v1/authors/1',
          method: 'DELETE',
        },
      );
    });

    it('should add the "update" link', () => {
      expect(dto._links).toHaveProperty(
        'update',
        {
          href: '/api/v1/authors/1',
          method: 'PATCH',
        },
      );
    });
  });

  describe('constructor', () => {
    it('should default all properties if called without an argument', () => {
      const dto = new AuthorDTO();

      expect(dto.firstName).toBeNull();
      expect(dto.fullName).toBeNull();
      expect(dto.id).toBeNull();
      expect(dto.lastName).toBeNull();
      expect(dto.middleName).toBeNull();
    });

    it('should set the properties if an argument is provided', () => {
      const dto = new AuthorDTO({
        firstName: 'John',
        fullName: 'John X Doe',
        id: 1,
        lastName: 'Doe',
        middleName: 'X',
      });

      expect(dto.firstName).toBe('John');
      expect(dto.fullName).toBe('John X Doe');
      expect(dto.id).toBe(1);
      expect(dto.lastName).toBe('Doe');
      expect(dto.middleName).toBe('X');
    });
  });
});
