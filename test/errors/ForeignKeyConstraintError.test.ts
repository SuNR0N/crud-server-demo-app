import { ForeignKeyConstraintError } from '../../src/errors/ForeignKeyConstraintError';

describe('ForeignKeyConstraintError', () => {
  describe('constructor', () => {
    it('should set its own prototype', () => {
      const setPrototypeOfSpy = jest.spyOn(Object, 'setPrototypeOf');
      const error = new ForeignKeyConstraintError('constraint');

      expect(setPrototypeOfSpy).toHaveBeenCalledWith(error, ForeignKeyConstraintError.prototype);
    });

    it('should set the message as the constraint if no other arguments are provided', () => {
      const error = new ForeignKeyConstraintError('constraint');

      expect(error.message).toBe('constraint');
    });

    it('should override the message if id and table arguments are provided', () => {
      const error = new ForeignKeyConstraintError('constraint', 'id', 'table');

      expect(error.message).toBe('A foreign key constraint violation occurred. Table with ID = id does not exist');
    });
  });
});
