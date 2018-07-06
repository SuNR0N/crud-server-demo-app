import { Utils } from '../../src/util/Utils';

describe('Utils', () => {
  describe('cleanObject', () => {
    it('should remove undefined object properties', () => {
      const obj = {
        a: 5,
        b: null,
        c: undefined,
        d: 'foo',
      };

      expect(Utils.cleanObject(obj)).toStrictEqual({
        a: 5,
        b: null,
        d: 'foo',
      });
    });
  });

  describe('updateQueryStringParameter', () => {
    it('should add the key with the value if the provided url does not have any query params', () => {
      const url = 'http://www.example.com';
      const updatedUrl = Utils.updateQueryStringParameter(url, 'foo', 'bar');

      expect(updatedUrl).toBe('http://www.example.com?foo=bar');
    });

    it('should add the key with the value if the provided url does not contain the key', () => {
      const url = 'http://www.example.com?bar=foo';
      const updatedUrl = Utils.updateQueryStringParameter(url, 'foo', 'bar');

      expect(updatedUrl).toBe('http://www.example.com?bar=foo&foo=bar');
    });

    it('should update the key with the value if the provided url contains it as its 1st query param', () => {
      const url = 'http://www.example.com?foo=foobar';
      const updatedUrl = Utils.updateQueryStringParameter(url, 'foo', 'bar');

      expect(updatedUrl).toBe('http://www.example.com?foo=bar');
    });

    it('should update the key with the value if the provided url contains it as its nth query param', () => {
      const url = 'http://www.example.com?bar=foo&foo=foobar';
      const updatedUrl = Utils.updateQueryStringParameter(url, 'foo', 'bar');

      expect(updatedUrl).toBe('http://www.example.com?bar=foo&foo=bar');
    });
  });
});
