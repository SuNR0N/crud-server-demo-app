import {
  CategoryDTO,
  ICategoryDTO,
} from '../../src/dtos';
import { ResourceBuilder } from '../../src/util/ResourceBuilder';

describe('ResourceBuilder', () => {
  describe('build', () => {
    const data: ICategoryDTO = {
      id: 1,
      name: 'Foo',
    };
    let resourceBuilder: ResourceBuilder<ICategoryDTO>;

    beforeEach(() => {
      resourceBuilder = new ResourceBuilder<ICategoryDTO>(CategoryDTO, data);
    });

    it('should instantiate the provided constructor function with the data', () => {
      const assignSpy = jest.spyOn(Object, 'assign');
      resourceBuilder.build();

      expect(assignSpy.mock.calls[0][1]).toBeInstanceOf(CategoryDTO);
    });

    it('should return an object containing the properties of the construced class and the _links', () => {
      resourceBuilder.addLink('foo', 'http://www.example.com');

      expect(resourceBuilder.build()).toEqual({
        _links: {
          foo: {
            href: 'http://www.example.com',
            method: 'GET',
          },
        },
        id: 1,
        name: 'Foo',
      });
    });
  });
});
