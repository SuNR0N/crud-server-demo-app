import { ValidationError } from '../../src/errors/ValidationError';

describe('ValidationError', () => {
  describe('constructor', () => {
    it('should set its own prototype', () => {
      const setPrototypeOfSpy = jest.spyOn(Object, 'setPrototypeOf');
      const error = new ValidationError('foo');

      expect(setPrototypeOfSpy).toHaveBeenCalledWith(error, ValidationError.prototype);
    });
  });
});
