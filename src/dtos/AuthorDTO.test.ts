import { Author } from '../entities';
import {
  AuthorDTO,
  fullNameMapper,
} from './AuthorDTO';

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
    it('should map the entity to DTO', () => {
      const author = {
        first_name: 'John',
        id: 1,
        last_name: 'Doe',
        middle_name: 'X',
      } as Author;
      const dto = AuthorDTO.toDTO(author);

      expect(dto).toEqual({
        firstName: 'John',
        fullName: 'John X Doe',
        id: 1,
        lastName: 'Doe',
        middleName: 'X',
      });
    });
  });

  describe('constructor', () => {
    it('should default all properties to null', () => {
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
