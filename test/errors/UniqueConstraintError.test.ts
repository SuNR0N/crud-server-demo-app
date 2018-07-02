import { UniqueConstraintError } from '../../src/errors/UniqueConstraintError';

describe('UniqueConstraintError', () => {
  describe('constructor', () => {
    it('should set its own prototype', () => {
      const setPrototypeOfSpy = jest.spyOn(Object, 'setPrototypeOf');
      const error = new UniqueConstraintError('constraint');

      expect(setPrototypeOfSpy).toHaveBeenCalledWith(error, UniqueConstraintError.prototype);
    });

    it('should set the message as the constraint if no other arguments are provided', () => {
      const error = new UniqueConstraintError('constraint');

      expect(error.message).toBe('constraint');
    });

    it('should override the message if key and value arguments are provided', () => {
      const error = new UniqueConstraintError('constraint', 'key', 'value');

      expect(error.message).toBe('A unique constraint violation occurred. Key (key) with value (value) already exists');
    });
  });
});
