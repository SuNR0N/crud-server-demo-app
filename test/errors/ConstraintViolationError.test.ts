import { ConstraintViolationError } from '../../src/errors/ConstraintViolationError';

describe('ConstraintViolationError', () => {
  describe('constructor', () => {
    it('should set its own prototype', () => {
      const setPrototypeOfSpy = jest.spyOn(Object, 'setPrototypeOf');
      const error = new ConstraintViolationError('constraint');

      expect(setPrototypeOfSpy).toHaveBeenCalledWith(error, ConstraintViolationError.prototype);
    });

    it('should set the message as the constraint if no other arguments are provided', () => {
      const error = new ConstraintViolationError('constraint');

      expect(error.message).toBe('constraint');
    });

    it('should override the message if id and table arguments are provided', () => {
      const error = new ConstraintViolationError('constraint', 'id', 'table');

      expect(error.message).toBe('A constraint violation occurred. Table with ID = id does not exist');
    });
  });
});
