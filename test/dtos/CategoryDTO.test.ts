import { CategoryDTO } from '../../src/dtos/CategoryDTO';
import { Category } from '../../src/entities/Category';

describe('CategoryDTO', () => {
  describe('toDTO', () => {
    it('should map the entity to DTO', () => {
      const category = {
        id: 1,
        name: 'Foo',
      } as Category;
      const dto = CategoryDTO.toDTO(category);

      expect(dto).toEqual({
        id: 1,
        name: 'Foo',
      });
    });
  });

  describe('constructor', () => {
    it('should default all properties if called without an argument', () => {
      const dto = new CategoryDTO();

      expect(dto.id).toBeNull();
      expect(dto.name).toBeNull();
    });

    it('should set the properties if an argument is provided', () => {
      const dto = new CategoryDTO({
        id: 1,
        name: 'Foo',
      });

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('Foo');
    });
  });
});
