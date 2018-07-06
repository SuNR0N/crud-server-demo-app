import { LinkBuilder } from '../../src/util/LinkBuilder';

describe('LinkBuilder', () => {
  let linkBuilder: LinkBuilder;

  beforeEach(() => {
    linkBuilder = new LinkBuilder();
  });

  describe('addLink', () => {
    it('it should initialise the _links property if it is undefined', () => {
      linkBuilder.addLink('foo', 'http://www.example.com');

      expect((linkBuilder as any).links).toBeDefined();
    });

    it('it should add a new link with the provided url if it does not exist yet', () => {
      linkBuilder.addLink('foo', 'http://www.example.com');

      expect((linkBuilder as any).links).toHaveProperty(
        'foo',
        {
          href: 'http://www.example.com',
          method: 'GET',
        },
      );
    });

    it('it should add a new link with the provided url and method if it does not exist yet', () => {
      linkBuilder.addLink('foo', 'http://www.example.com/bars/1', 'PUT');

      expect((linkBuilder as any).links).toHaveProperty(
        'foo',
        {
          href: 'http://www.example.com/bars/1',
          method: 'PUT',
        },
      );
    });

    it('it should replace a link with the provided url if one with the same name already exists', () => {
      linkBuilder.addLink('foo', 'http://www.example.com/bars');
      linkBuilder.addLink('foo', 'http://www.example.com/foobars');

      expect((linkBuilder as any).links).toHaveProperty(
        'foo',
        {
          href: 'http://www.example.com/foobars',
          method: 'GET',
        },
      );
    });

    it('it should replace a link with the provided url and method if one with the same name already exists', () => {
      linkBuilder.addLink('foo', 'http://www.example.com/bars');
      linkBuilder.addLink('foo', 'http://www.example.com/bars/1', 'PATCH');

      expect((linkBuilder as any).links).toHaveProperty(
        'foo',
        {
          href: 'http://www.example.com/bars/1',
          method: 'PATCH',
        },
      );
    });
  });

  describe('build', () => {
    it('should return an object containing the links as _links', () => {
      linkBuilder.addLink('foo', 'http://www.example.com');

      expect(linkBuilder.build()).toEqual({
        _links: {
          foo: {
            href: 'http://www.example.com',
            method: 'GET',
          },
        },
      });
    });
  });
});
