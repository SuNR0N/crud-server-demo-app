import { Book } from '../../src/entities/Book';
import { EntityNotFoundError } from '../../src/errors/EntityNotFoundError';

describe('EntityNotFoundError', () => {
  describe('constructor', () => {
    it('should set its own prototype', () => {
      const setPrototypeOfSpy = jest.spyOn(Object, 'setPrototypeOf');
      const error = new EntityNotFoundError(Book, 1);

      expect(setPrototypeOfSpy).toHaveBeenCalledWith(error, EntityNotFoundError.prototype);
    });

    it('should set its id based on the provided id argument', () => {
      const error = new EntityNotFoundError(Book, 1);

      expect(error.id).toBe(1);
    });

    it('should set its entity based on the name of the provided constructor function', () => {
      const error = new EntityNotFoundError(Book, 1);

      expect(error.entity).toBe('Book');
    });

    it('should set a message based on the provided arguments', () => {
      const error = new EntityNotFoundError(Book, 1);

      expect(error.message).toBe('Book with ID = 1 does not exist');
    });
  });
});
