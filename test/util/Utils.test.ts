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
});
