import {
  CategoryDTO,
  ICategoryDTO,
} from '../../src/dtos/CategoryDTO';
import { Category } from '../../src/entities/Category';

describe('CategoryDTO', () => {
  describe('toDTO', () => {
    const category = {
      id: 1,
      name: 'Foo',
    } as Category;
    let dto: ICategoryDTO;

    beforeEach(() => {
      dto = CategoryDTO.toDTO(category);
    });

    it('should map the entity to DTO', () => {
      expect(dto).toEqual(expect.objectContaining({
        id: 1,
        name: 'Foo',
      }));
    });

    it('should add the "self" link', () => {
      expect(dto._links).toHaveProperty(
        'self',
        {
          href: '/api/v1/categories/1',
          method: 'GET',
        },
      );
    });

    it('should add the "delete" link', () => {
      expect(dto._links).toHaveProperty(
        'delete',
        {
          href: '/api/v1/categories/1',
          method: 'DELETE',
        },
      );
    });

    it('should add the "update" link', () => {
      expect(dto._links).toHaveProperty(
        'update',
        {
          href: '/api/v1/categories/1',
          method: 'PUT',
        },
      );
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
