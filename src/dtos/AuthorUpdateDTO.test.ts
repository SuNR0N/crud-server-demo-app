import {
  AuthorUpdateDTO,
  IAuthorUpdateDTO,
} from './AuthorUpdateDTO';

describe('AuthorUpdateDTO', () => {
  const data: IAuthorUpdateDTO = {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'X',
  };
  let dto: AuthorUpdateDTO;

  beforeEach(() => {
    dto = new AuthorUpdateDTO(data);
  });

  describe('constructor', () => {
    it('should set the properties if an argument is provided', () => {
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
      expect(dto.middleName).toBe('X');
    });
  });

  describe('toEntity', () => {
    it('should return a partial author entity from the DTO', () => {
      expect(dto.toEntity()).toStrictEqual({
        first_name: 'John',
        last_name: 'Doe',
        middle_name: 'X',
      });
    });

    it('should return a partial author entity with defined properties only', () => {
      const partialData: IAuthorUpdateDTO = {
        firstName: 'John',
      };
      const partialDto = new AuthorUpdateDTO(partialData);

      expect(partialDto.toEntity()).toStrictEqual({
        first_name: 'John',
      });
    });
  });
});
