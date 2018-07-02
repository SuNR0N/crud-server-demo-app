import { PublisherUpdateDTO } from '../../src/dtos/PublisherUpdateDTO';
import { Publisher } from '../../src/entities/Publisher';
import { PublisherService } from '../../src/services/PublisherService';

describe('PublisherService', () => {
  const publisherEntity = {} as Publisher;
  const id = 1;
  let publisherService: PublisherService;
  let publisherRepository: {
    create: jest.Mock,
    delete: jest.Mock,
    find: jest.Mock,
    findOne: jest.Mock,
    save: jest.Mock,
  };

  beforeEach(() => {
    publisherRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    publisherService = new PublisherService(publisherRepository as any);
  });

  describe('createPublisher', () => {
    const newPublisher = new PublisherUpdateDTO({
      name: 'Foo',
    });

    it('should create a new repository entity from the DTO', () => {
      publisherService.createPublisher(newPublisher);

      expect(publisherRepository.create).toHaveBeenCalledWith({
        name: 'Foo',
      });
    });

    it('should should save the entity to the repository', () => {
      publisherRepository.create.mockImplementationOnce(() => publisherEntity);
      publisherService.createPublisher(newPublisher);

      expect(publisherRepository.save).toHaveBeenCalledWith(publisherEntity);
    });
  });

  describe('deletePublisher', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      publisherRepository.findOne.mockImplementationOnce(() => undefined);

      expect(publisherService.deletePublisher(id)).rejects
        .toThrow('Publisher with ID = 1 does not exist');
    });

    it('should delete the entity with the given id if it is found', async () => {
      publisherRepository.findOne.mockImplementationOnce(() => publisherEntity);

      await publisherService.deletePublisher(1);
      expect(publisherRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getPublisher', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      publisherRepository.findOne.mockImplementationOnce(() => undefined);

      expect(publisherService.getPublisher(id)).rejects
        .toThrow('Publisher with ID = 1 does not exist');
    });

    it('should return the entity with the given id if it is found', async () => {
      publisherRepository.findOne.mockImplementationOnce(() => publisherEntity);

      const entity = await publisherService.getPublisher(id);
      expect(entity).toBe(publisherEntity);
    });
  });

  describe('getCategories', () => {
    it('should return all of the found entities in the repository', () => {
      const publisherEntities = [
        {} as Publisher,
        {} as Publisher,
      ];
      publisherRepository.find.mockImplementationOnce(() => publisherEntities);

      expect(publisherService.getPublishers()).toBe(publisherEntities);
    });
  });

  describe('updatePublisher', () => {
    it('should throw an EntityNotFound error if the entity is not found in the repository', () => {
      publisherRepository.findOne.mockImplementationOnce(() => undefined);

      expect(publisherService.updatePublisher(id, {} as any)).rejects
        .toThrow('Publisher with ID = 1 does not exist');
    });

    it('should save the updated entity to the repository', async () => {
      const publisher = {
        id: 1,
        name: 'Foo',
      } as Publisher;
      const publisherUpdateDTO = new PublisherUpdateDTO({
        name: 'Bar',
      });
      publisherRepository.findOne.mockImplementationOnce(() => publisher);
      await publisherService.updatePublisher(id, publisherUpdateDTO);

      expect(publisherRepository.save).toHaveBeenCalledWith({
        id: 1,
        name: 'Bar',
      });
    });
  });
});
