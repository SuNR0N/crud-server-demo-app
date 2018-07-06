import { Request } from 'express';

import { PageableCollectionBuilder } from '../../src/util/PageableCollectionBuilder';

describe('PageableCollectionBuilder', () => {
  describe('constructor', () => {
    it('should throw an error if the provided offset is not an integer', () => {
      expect(() => {
        // tslint:disable-next-line:no-unused-expression
        new PageableCollectionBuilder([], {} as Request, 0.5, 10, 25);
      }).toThrow('Invalid arguments. "offset", "pageSize" and "total" arguments must be integers.');
    });

    it('should throw an error if the provided pageSize is not an integer', () => {
      expect(() => {
        // tslint:disable-next-line:no-unused-expression
        new PageableCollectionBuilder([], {} as Request, 0, 10.5, 25);
      }).toThrow('Invalid arguments. "offset", "pageSize" and "total" arguments must be integers.');
    });

    it('should throw an error if the provided total is not an integer', () => {
      expect(() => {
        // tslint:disable-next-line:no-unused-expression
        new PageableCollectionBuilder([], {} as Request, 0, 10, 25.5);
      }).toThrow('Invalid arguments. "offset", "pageSize" and "total" arguments must be integers.');
    });

    describe('given the options is not provided', () => {
      let builder: any;

      beforeAll(() => {
        builder = new PageableCollectionBuilder([], {} as Request, 0, 10, 25);
      });

      it('should default the firstLinkRel to "first"', () => {
        expect(builder.options.firstLinkRel).toBe('first');
      });

      it('should default the previousLinkRel to "previous"', () => {
        expect(builder.options.previousLinkRel).toBe('previous');
      });

      it('should default the nextLinkRel to "next"', () => {
        expect(builder.options.nextLinkRel).toBe('next');
      });

      it('should default the lastLinkRel to "last"', () => {
        expect(builder.options.lastLinkRel).toBe('last');
      });

      it('should default the offsetParam to "offset"', () => {
        expect(builder.options.offsetParam).toBe('offset');
      });

      it('should default the pageSizeParam to "page-size"', () => {
        expect(builder.options.pageSizeParam).toBe('page-size');
      });
    });

    it('should override the firstLinkRel if it is provided', () => {
      const builder: any = new PageableCollectionBuilder([], {} as Request, 0, 10, 25, { firstLinkRel: 'foo' });

      expect(builder.options.firstLinkRel).toBe('foo');
    });

    it('should override the previousLinkRel if it is provided', () => {
      const builder: any = new PageableCollectionBuilder([], {} as Request, 0, 10, 25, { previousLinkRel: 'foo' });

      expect(builder.options.previousLinkRel).toBe('foo');
    });

    it('should override the nextLinkRel if it is provided', () => {
      const builder: any = new PageableCollectionBuilder([], {} as Request, 0, 10, 25, { nextLinkRel: 'foo' });

      expect(builder.options.nextLinkRel).toBe('foo');
    });

    it('should override the lastLinkRel if it is provided', () => {
      const builder: any = new PageableCollectionBuilder([], {} as Request, 0, 10, 25, { lastLinkRel: 'foo' });

      expect(builder.options.lastLinkRel).toBe('foo');
    });

    it('should override the offsetParam if it is provided', () => {
      const builder: any = new PageableCollectionBuilder([], {} as Request, 0, 10, 25, { offsetParam: 'foo' });

      expect(builder.options.offsetParam).toBe('foo');
    });

    it('should override the pageSizeParam if it is provided', () => {
      const builder: any = new PageableCollectionBuilder([], {} as Request, 0, 10, 25, { pageSizeParam: 'foo' });

      expect(builder.options.pageSizeParam).toBe('foo');
    });
  });

  describe('build', () => {
    const method = 'GET';
    const originalUrl = 'http://www.example.com';

    it('should not add any links if the number of total items is 0', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 0);

      expect(builder.build()._links).toBeUndefined();
    });

    it('should add a next link if the results contain at least one more page of items', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 11);

      expect(builder.build()._links).toHaveProperty(
        'next',
        {
          href: `${originalUrl}?page-size=10&offset=10`,
          method,
        },
      );
    });

    it('should not add a next link if the current page contains all the remaining items', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 10, 10, 20);

      expect(builder.build()._links).not.toHaveProperty('next');
    });

    it('should add a last link if the results contain at least one more page of items', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 11);

      expect(builder.build()._links).toHaveProperty(
        'last',
        {
          href: `${originalUrl}?page-size=10&offset=10`,
          method,
        },
      );
    });

    it('should not add a last link if the current page contains all the remaining items', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 10, 10, 20);

      expect(builder.build()._links).not.toHaveProperty('last');
    });

    it('should not add a first link if the results contain no items prior to the current result set', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 20);

      expect(builder.build()._links).not.toHaveProperty('first');
    });

    it('should add a first link if the results contain one or more items prior to the current result set', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 10, 10, 20);

      expect(builder.build()._links).toHaveProperty(
        'first',
        {
          href: `${originalUrl}?page-size=10&offset=0`,
          method,
        },
      );
    });

    it('should not add a previous link if the results contain no items prior to the current result set', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 20);

      expect(builder.build()._links).not.toHaveProperty('previous');
    });

    it('should add a previous link if the results contain one or more items prior to the current result set', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 10, 10, 20);

      expect(builder.build()._links).toHaveProperty(
        'previous',
        {
          href: `${originalUrl}?page-size=10&offset=0`,
          method,
        },
      );
    });

    it('should return the same first and previous links on the 2nd page of the results', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 10, 10, 20);
      const href = `${originalUrl}?page-size=10&offset=0`;
      const dto = builder.build();

      expect(dto._links).toEqual(expect.objectContaining({
        first: {
          href,
          method,
        },
        previous: {
          href,
          method,
        },
      }));
    });

    it('should return different first and previous links on the 3nd page of the results', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 20, 10, 25);
      const dto = builder.build();

      expect(dto._links).toEqual(expect.objectContaining({
        first: {
          href: `${originalUrl}?page-size=10&offset=0`,
          method,
        },
        previous: {
          href: `${originalUrl}?page-size=10&offset=10`,
          method,
        },
      }));
    });

    it('should return the same next and last links on the next to last page of the results', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 20);
      const href = `${originalUrl}?page-size=10&offset=10`;
      const dto = builder.build();

      expect(dto._links).toEqual(expect.objectContaining({
        last: {
          href,
          method,
        },
        next: {
          href,
          method,
        },
      }));
    });

    it('should return different next and last links on the third to last page of the results', () => {
      const builder = new PageableCollectionBuilder([], { originalUrl } as Request, 0, 10, 30);
      const dto = builder.build();

      expect(dto._links).toEqual(expect.objectContaining({
        last: {
          href: `${originalUrl}?page-size=10&offset=20`,
          method,
        },
        next: {
          href: `${originalUrl}?page-size=10&offset=10`,
          method,
        },
      }));
    });

    it('should return an object containg the contents', () => {
      const content = [1, 2, 3];
      const builder = new PageableCollectionBuilder<number>(content, { originalUrl } as Request, 0, 10, 20);

      expect(builder.build().content).toBe(content);
    });

    describe('currentPage', () => {
      it('should be 1 if the offset is less than the pageSize', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 0, 10, 0);

        expect(builder.build().currentPage).toBe(1);
      });

      it('should be 2 if the offset equals to the pageSize', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 10, 10, 0);

        expect(builder.build().currentPage).toBe(2);
      });

      it('should be 3 if the result of the pageSize divided by the offset is between 2 and 3 (exclusive)', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 25, 10, 0);

        expect(builder.build().currentPage).toBe(3);
      });
    });

    it('should return an object containg the totalItems', () => {
      const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 0, 10, 13);

      expect(builder.build().totalItems).toBe(13);
    });

    describe('totalPages', () => {
      it('should be 0 if there is no results', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 0, 10, 0);

        expect(builder.build().totalPages).toBe(0);
      });

      it('should be 1 if the total number of items is less than the pageSize', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 0, 10, 5);

        expect(builder.build().totalPages).toBe(1);
      });

      it('should be 1 if the total number of items equals to the pageSize', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 0, 10, 10);

        expect(builder.build().totalPages).toBe(1);
      });

      it('should be one more than the result of the total number of items divided by the pageSize', () => {
        const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 0, 10, 21);

        expect(builder.build().totalPages).toBe(3);
      });
    });

    it('should return an object containg the pagination links as _links', () => {
      const builder = new PageableCollectionBuilder<number>([], { originalUrl } as Request, 20, 10, 45);

      expect(builder.build()._links).toEqual({
        first: {
          href: `${originalUrl}?page-size=10&offset=0`,
          method,
        },
        last: {
          href: `${originalUrl}?page-size=10&offset=40`,
          method,
        },
        next: {
          href: `${originalUrl}?page-size=10&offset=30`,
          method,
        },
        previous: {
          href: `${originalUrl}?page-size=10&offset=10`,
          method,
        },
      });
    });
  });
});
