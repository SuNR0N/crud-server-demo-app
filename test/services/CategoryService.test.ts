import { CategoryUpdateDTO } from '../../src/dtos/CategoryUpdateDTO';
import { Category } from '../../src/entities/Category';
import { CategoryService } from '../../src/services/CategoryService';

describe('CategoryService', () => {
  const categoryEntity = {} as Category;
  const id = 1;
  let categoryService: CategoryService;
  let categoryRepository: {
    create: jest.Mock,
    delete: jest.Mock,
    find: jest.Mock,
    findOne: jest.Mock,
    save: jest.Mock,
  };

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    categoryService = new CategoryService(categoryRepository as any);
  });

  describe('createCategory', () => {
    const newCategory = new CategoryUpdateDTO({
      name: 'Foo',
    });

    it('should create a new repository entity from the DTO', () => {
      categoryService.createCategory(newCategory);

      expect(categoryRepository.create).toHaveBeenCalledWith({
        name: 'Foo',
      });
    });

    it('should should save the entity to the repository', () => {
      categoryRepository.create.mockImplementationOnce(() => categoryEntity);
      categoryService.createCategory(newCategory);

      expect(categoryRepository.save).toHaveBeenCalledWith(categoryEntity);
    });
  });

  describe('deleteCategory', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      categoryRepository.findOne.mockImplementationOnce(() => undefined);

      expect(categoryService.deleteCategory(id)).rejects
        .toThrow('Category with ID = 1 does not exist');
    });

    it('should delete the entity with the given id if it is found', async () => {
      categoryRepository.findOne.mockImplementationOnce(() => categoryEntity);

      await categoryService.deleteCategory(1);
      expect(categoryRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getCategory', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      categoryRepository.findOne.mockImplementationOnce(() => undefined);

      expect(categoryService.getCategory(id)).rejects
        .toThrow('Category with ID = 1 does not exist');
    });

    it('should return the entity with the given id if it is found', async () => {
      categoryRepository.findOne.mockImplementationOnce(() => categoryEntity);

      const entity = await categoryService.getCategory(id);
      expect(entity).toBe(categoryEntity);
    });
  });

  describe('getCategories', () => {
    it('should return all of the found entities in the repository', () => {
      const categoryEntities = [
        {} as Category,
        {} as Category,
      ];
      categoryRepository.find.mockImplementationOnce(() => categoryEntities);

      expect(categoryService.getCategories()).toBe(categoryEntities);
    });
  });

  describe('updateCategory', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      categoryRepository.findOne.mockImplementationOnce(() => undefined);

      expect(categoryService.updateCategory(id, {} as any)).rejects
        .toThrow('Category with ID = 1 does not exist');
    });

    it('should save the updated entity to the repository', async () => {
      const category = {
        id: 1,
        name: 'Foo',
      } as Category;
      const categoryUpdateDTO = new CategoryUpdateDTO({
        name: 'Bar',
      });
      categoryRepository.findOne.mockImplementationOnce(() => category);
      await categoryService.updateCategory(id, categoryUpdateDTO);

      expect(categoryRepository.save).toHaveBeenCalledWith({
        id: 1,
        name: 'Bar',
      });
    });
  });
});
