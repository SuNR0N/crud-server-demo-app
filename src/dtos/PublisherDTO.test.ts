import { Publisher } from '../entities/Publisher';
import { PublisherDTO } from './PublisherDTO';

describe('PublisherDTO', () => {
  describe('toDTO', () => {
    it('should map the entity to DTO', () => {
      const publisher = {
        id: 1,
        name: 'Foo',
      } as Publisher;
      const dto = PublisherDTO.toDTO(publisher);

      expect(dto).toEqual({
        id: 1,
        name: 'Foo',
      });
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
