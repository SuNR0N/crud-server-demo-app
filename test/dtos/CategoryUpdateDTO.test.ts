import {
  CategoryUpdateDTO,
  ICategoryUpdateDTO,
} from '../../src/dtos/CategoryUpdateDTO';

describe('CategoryUpdateDTO', () => {
  const data: ICategoryUpdateDTO = {
    name: 'Foo',
  };
  let dto: CategoryUpdateDTO;

  beforeEach(() => {
    dto = new CategoryUpdateDTO(data);
  });

  describe('constructor', () => {
    it('should set the properties if an argument is provided', () => {
      expect(dto.name).toBe('Foo');
    });
  });

  describe('toEntity', () => {
    it('should return a category entity from the DTO', () => {
      expect(dto.toEntity()).toStrictEqual({
        name: 'Foo',
      });
    });
  });
});
