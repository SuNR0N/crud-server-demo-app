import {
  IPublisherUpdateDTO,
  PublisherUpdateDTO,
} from '../../src/dtos/PublisherUpdateDTO';

describe('PublisherUpdateDTO', () => {
  const data: IPublisherUpdateDTO = {
    name: 'Foo',
  };
  let dto: PublisherUpdateDTO;

  beforeEach(() => {
    dto = new PublisherUpdateDTO(data);
  });

  describe('constructor', () => {
    it('should set the properties if an argument is provided', () => {
      expect(dto.name).toBe('Foo');
    });
  });

  describe('toEntity', () => {
    it('should return a publisher entity from the DTO', () => {
      expect(dto.toEntity()).toStrictEqual({
        name: 'Foo',
      });
    });
  });
});
