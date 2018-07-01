import {
  INewAuthorDTO,
  NewAuthorDTO,
} from './NewAuthorDTO';

describe('NewAuthorDTO', () => {
  const data: INewAuthorDTO = {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'X',
  };
  let dto: NewAuthorDTO;

  beforeEach(() => {
    dto = new NewAuthorDTO(data);
  });

  describe('constructor', () => {
    it('should set the properties if an argument is provided', () => {
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
      expect(dto.middleName).toBe('X');
    });
  });

  describe('toEntity', () => {
    it('should return an author entity from the DTO', () => {
      expect(dto.toEntity()).toStrictEqual({
        first_name: 'John',
        last_name: 'Doe',
        middle_name: 'X',
      });
    });

    it('should return a partial author entity with defined properties only', () => {
      const partialData: INewAuthorDTO = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const partialDto = new NewAuthorDTO(partialData);

      expect(partialDto.toEntity()).toStrictEqual({
        first_name: 'John',
        last_name: 'Doe',
      });
    });
  });
});
