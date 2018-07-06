import {
  IPublisherDTO,
  PublisherDTO,
} from '../../src/dtos/PublisherDTO';
import { Publisher } from '../../src/entities/Publisher';

describe('PublisherDTO', () => {
  describe('toDTO', () => {
    const publisher = {
      id: 1,
      name: 'Foo',
    } as Publisher;
    let dto: IPublisherDTO;

    beforeEach(() => {
      dto = PublisherDTO.toDTO(publisher);
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
          href: '/api/v1/publishers/1',
          method: 'GET',
        },
      );
    });

    it('should add the "delete" link', () => {
      expect(dto._links).toHaveProperty(
        'delete',
        {
          href: '/api/v1/publishers/1',
          method: 'DELETE',
        },
      );
    });

    it('should add the "update" link', () => {
      expect(dto._links).toHaveProperty(
        'update',
        {
          href: '/api/v1/publishers/1',
          method: 'PUT',
        },
      );
    });
  });

  describe('constructor', () => {
    it('should default all properties if called without an argument', () => {
      const dto = new PublisherDTO();

      expect(dto.id).toBeNull();
      expect(dto.name).toBeNull();
    });

    it('should set the properties if an argument is provided', () => {
      const dto = new PublisherDTO({
        id: 1,
        name: 'Foo',
      });

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('Foo');
    });
  });
});
