import {
  AuthorUpdateDTO,
  NewAuthorDTO,
} from '../../src/dtos';
import { Author } from '../../src/entities/Author';
import { AuthorService } from '../../src/services/AuthorService';

describe('AuthorService', () => {
  const authorEntity = {} as Author;
  const id = 1;
  let authorService: AuthorService;
  let authorRepository: {
    create: jest.Mock,
    createQueryBuilder: jest.Mock,
    delete: jest.Mock,
    findOne: jest.Mock,
    save: jest.Mock,
  };
  let selectQueryBuilder: {
    getMany: jest.Mock,
    orWhere: jest.Mock,
    where: jest.Mock,
  };

  beforeEach(() => {
    selectQueryBuilder = {
      getMany: jest.fn(),
      orWhere: jest.fn(() => selectQueryBuilder),
      where: jest.fn(() => selectQueryBuilder),
    };
    authorRepository = {
      create: jest.fn(),
      createQueryBuilder: jest.fn(() => selectQueryBuilder),
      delete: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    authorService = new AuthorService(authorRepository as any);
  });

  describe('createAuthor', () => {
    const newAuthor = new NewAuthorDTO({
      firstName: 'John',
      lastName: 'Doe',
    });

    it('should create a new repository entity from the DTO', () => {
      authorService.createAuthor(newAuthor);

      expect(authorRepository.create).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
      });
    });

    it('should should save the entity to the repository', () => {
      authorRepository.create.mockImplementationOnce(() => authorEntity);
      authorService.createAuthor(newAuthor);

      expect(authorRepository.save).toHaveBeenCalledWith(authorEntity);
    });
  });

  describe('deleteAuthor', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      authorRepository.findOne.mockImplementationOnce(() => undefined);

      expect(authorService.deleteAuthor(id)).rejects
        .toThrow('Author with ID = 1 does not exist');
    });

    it('should delete the entity with the given id if it is found', async () => {
      authorRepository.findOne.mockImplementationOnce(() => authorEntity);

      await authorService.deleteAuthor(1);
      expect(authorRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getAuthor', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      authorRepository.findOne.mockImplementationOnce(() => undefined);

      expect(authorService.getAuthor(id)).rejects
        .toThrow('Author with ID = 1 does not exist');
    });

    it('should return the entity with the given id if it is found', async () => {
      authorRepository.findOne.mockImplementationOnce(() => authorEntity);

      const entity = await authorService.getAuthor(id);
      expect(entity).toBe(authorEntity);
    });
  });

  describe('getAuthors', () => {
    const query = 'FoO';

    beforeEach(async () => {
      await authorService.getAuthors(query);
    });

    it('should call createQueryBuilder with "author"', () => {
      expect(authorRepository.createQueryBuilder).toHaveBeenCalledWith('author');
    });

    it('should call where with the proper condition on the first_name', () => {
      expect(selectQueryBuilder.where).toBeCalledWith('LOWER(author.first_name) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the middle_name for the 1st time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(1, 'LOWER(author.middle_name) LIKE :query', { query: '%foo%'});
    });

    it('should call orWhere with the proper condition on the last_name for the 2nd time', () => {
      expect(selectQueryBuilder.orWhere)
        .toHaveBeenNthCalledWith(2, 'LOWER(author.last_name) LIKE :query', { query: '%foo%'});
    });

    it('should call getMany', () => {
      expect(selectQueryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('updateAuthor', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      authorRepository.findOne.mockImplementationOnce(() => undefined);

      expect(authorService.updateAuthor(id, {} as any)).rejects
        .toThrow('Author with ID = 1 does not exist');
    });

    it('should save the updated entity to the repository', async () => {
      const author = {
        first_name: 'John',
        id: 1,
        last_name: 'Doe',
      } as Author;
      const authorUpdateDTO = new AuthorUpdateDTO({
        firstName: 'Jane',
        middleName: 'X',
      });
      authorRepository.findOne.mockImplementationOnce(() => author);
      await authorService.updateAuthor(id, authorUpdateDTO);

      expect(authorRepository.save).toHaveBeenCalledWith({
        first_name: 'Jane',
        id: 1,
        last_name: 'Doe',
        middle_name: 'X',
      });
    });
  });
});
