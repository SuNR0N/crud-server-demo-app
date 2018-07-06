import { Application } from 'express';
import {
  agent,
  Response,
} from 'supertest';

import { getServerInstance } from '../../src/server';
import { TestUtils } from '../TestUtils';

describe('BookController', () => {
  let serverInstance: Application;

  beforeAll(async () => {
    serverInstance = await getServerInstance();
    await TestUtils.resetDatabase();
  });

  afterAll(async () => {
    await TestUtils.closeDatabaseConnection();
  });

  describe('getBooks', () => {
    it('should return the first 10 results by default', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books');

      expect(response.status).toBe(200);
      expect(response.body.content.map((book) => book.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should take notice of the provided "offset"', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ offset: 5 });

      expect(response.status).toBe(200);
      expect(response.body.content.map((book) => book.id)).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('should take notice of the provided "page-size"', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ 'page-size': 5 });

      expect(response.status).toBe(200);
      expect(response.body.content.map((book) => book.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return a 400 if the provided "offset" is invalid', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ offset: 'foo' });

      expect(response.status).toBe(400);
      expect(response.text).toBe("The query parameter 'offset' must be a number");
    });

    it('should return a 400 if the provided "page-size" is invalid', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ 'page-size': 'foo' });

      expect(response.status).toBe(400);
      expect(response.text).toBe("The query parameter 'page-size' must be a number");
    });

    it('should return a book if there is a partial match on the title', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'racl' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          title: 'OCA: Oracle Certified Associate Java SE 8 Programmer I Study Guide: Exam 1Z0-808',
        }),
        expect.objectContaining({
          title: 'OCP: Oracle Certified Professional Java Se 8 Programmer II Study Guide: Exam 1Z0-809',
        }),
      ]);
    });

    it('should return a book if there is a case insensitive match on the title', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'oracle' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          title: 'OCA: Oracle Certified Associate Java SE 8 Programmer I Study Guide: Exam 1Z0-808',
        }),
        expect.objectContaining({
          title: 'OCP: Oracle Certified Professional Java Se 8 Programmer II Study Guide: Exam 1Z0-809',
        }),
      ]);
    });

    it('should return a book if there is a partial match on the isbn10', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: '1774' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          isbn10: '0596517742',
        }),
      ]);
    });

    it('should return a book if there is a case insensitive match on the isbn10', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: '099134460x' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          isbn10: '099134460X',
        }),
      ]);
    });

    it('should return a book if there is a partial match on the isbn13', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: '4782' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          isbn13: '9780984782857',
        }),
      ]);
    });

    it('should return a book if there is a partial match on the first name of an author', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'atha' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          authors: expect.arrayContaining(['Nathan Murray']),
        }),
        expect.objectContaining({
          authors: expect.arrayContaining(['Nathan Murray']),
        }),
        expect.objectContaining({
          authors: expect.arrayContaining(['Nathan Rozentals']),
        }),
      ]);
    });

    it('should return a book if there is a case insensitive match on the first name of an author', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'nathan' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          authors: expect.arrayContaining(['Nathan Murray']),
        }),
        expect.objectContaining({
          authors: expect.arrayContaining(['Nathan Murray']),
        }),
        expect.objectContaining({
          authors: expect.arrayContaining(['Nathan Rozentals']),
        }),
      ]);
    });

    it('should return a book if there is a partial match on the middle name of an author', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'akma' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          authors: expect.arrayContaining(['Gayle Laakmann McDowell']),
        }),
      ]);
    });

    it('should return a book if there is a case insensitive match on the middle name of an author', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'c.' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          authors: expect.arrayContaining(['Robert C. Martin']),
        }),
      ]);
    });

    it('should return a book if there is a partial match on the last name of an author', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'owl' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          authors: expect.arrayContaining(['Susan Fowler']),
        }),
      ]);
    });

    it('should return a book if there is a case insensitive match on the last name of an author', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'simpson' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          authors: expect.arrayContaining(['Kyle Simpson']),
        }),
      ]);
    });

    it('should return a book if there is a partial match on the name of a category', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'pute' });

      expect(response.status).toBe(200);
      expect(response.body.content
        .map((book) => book.categories)
        .every((categories: string[]) => categories.includes('Computers & Technology')),
      ).toBe(true);
    });

    it('should return a book if there is a case insensitive match on the name of a category', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'technology' });

      expect(response.status).toBe(200);
      expect(response.body.content
        .map((book) => book.categories)
        .every((categories: string[]) => categories.includes('Computers & Technology')),
      ).toBe(true);
    });

    it('should return a book if there is a partial match on the name of a publisher', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'areer' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          publishers: expect.arrayContaining(['CareerCup']),
        }),
        expect.objectContaining({
          publishers: expect.arrayContaining(['CareerMonk Publications']),
        }),
      ]);
    });

    it('should return a book if there is a case insensitive match on the name of a publisher', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books')
        .query({ q: 'cup' });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual([
        expect.objectContaining({
          publishers: expect.arrayContaining(['CareerCup']),
        }),
      ]);
    });
  });

  describe('getBook', () => {
    describe('given a book exists with the provided id', () => {
      let response: Response;

      beforeAll(async () => {
        response = await agent(serverInstance)
          .get('/api/v1/books/1');
      });

      it('should return the properties of the book', () => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          authors: [
            'Robert C. Martin',
          ],
          categories: [
            'Computers & Technology',
          ],
          id: 1,
          isbn10: '0132350882',
          isbn13: '9780132350884',
          publicationDate: '2008-08-11',
          publishers: [
            'Prentice Hall',
          ],
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        }));
      });

      it('should return a "self" link', () => {
        expect(response.body._links).toHaveProperty(
          'self',
          {
            href: '/api/v1/books/1',
            method: 'GET',
          },
        );
      });

      it('should return an "update" link', () => {
        expect(response.body._links).toHaveProperty(
          'update',
          {
            href: '/api/v1/books/1',
            method: 'PATCH',
          },
        );
      });

      it('should return a "delete" link', () => {
        expect(response.body._links).toHaveProperty(
          'delete',
          {
            href: '/api/v1/books/1',
            method: 'DELETE',
          },
        );
      });
    });

    it('should return a 404 if no book exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Book with ID = 999 does not exist');
    });

    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });
  });

  describe('createBook', () => {
    it('should return a 400 if the isbn13 is missing', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'isbn13' is required");
    });

    it('should return a 400 if the title is missing', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          isbn13: '1234567890123',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'title' is required");
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          foo: 'bar',
          isbn13: '1234567890123',
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'foo' is not allowed");
    });

    it('should return a 400 if a provided author does not exist', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          authors: [
            1,
            999,
          ],
          isbn13: '1234567890123',
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('A foreign key constraint violation occurred. Author with ID = 999 does not exist');
    });

    it('should return a 400 if a provided author has an invalid type', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          authors: [
            1,
            'John Doe',
          ],
          isbn13: '1234567890123',
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'authors' must contain numbers only");
    });

    it('should return a 400 if a provided category does not exist', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          categories: [
            1,
            999,
          ],
          isbn13: '1234567890123',
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('A foreign key constraint violation occurred. Category with ID = 999 does not exist');
    });

    it('should return a 400 if a provided category has an invalid type', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          categories: [
            1,
            'FooBar',
          ],
          isbn13: '1234567890123',
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'categories' must contain numbers only");
    });

    it('should return a 400 if a provided publisher does not exist', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          isbn13: '1234567890123',
          publishers: [
            1,
            999,
          ],
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('A foreign key constraint violation occurred. Publisher with ID = 999 does not exist');
    });

    it('should return a 400 if a provided publisher has an invalid type', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          isbn13: '1234567890123',
          publishers: [
            1,
            'FooBar',
          ],
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'publishers' must contain numbers only");
    });

    it('should return a 409 if a book already exists with the provided isbn13', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          isbn13: '9780596517748',
          title: 'FooBar',
        });

      expect(response.status).toBe(409);
      expect(response.text)
      .toEqual('A unique constraint violation occurred. Key (isbn_13) with value (9780596517748) already exists');
    });

    describe('given it creates the book', () => {
      let response: Response;

      beforeAll(async () => {
        // Sequence is incremented on failed insert
        await TestUtils.resetDatabase();
        response = await agent(serverInstance)
          .post('/api/v1/books')
          .send({
            authors: [
              1,
              3,
              5,
            ],
            categories: [
              7, 9,
            ],
            isbn10: '1234567890',
            isbn13: '1234567890123',
            publicationDate: '2001-02-03',
            publishers: [
              4,
              8,
            ],
            title: 'FooBar',
          });
      });

      afterAll(async () => {
        await agent(serverInstance)
          .delete(response.header.location);
      });

      it('should return a 201 with a location header pointing to the new resource', () => {
        expect(response.status).toBe(201);
        expect(response.header.location).toBe('/api/v1/books/23');
      });

      it('should return the created book when calling the returned location', async () => {
        const getResponse = await agent(serverInstance)
          .get(response.header.location);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(expect.objectContaining({
          authors: [
            'Aaron Frost',
            'Al Sweigart',
            'Ari Lerner',
          ],
          categories: [
            'Comics & Graphic Novels',
            'Cookbooks, Food & Wine',
          ],
          id: 23,
          isbn10: '1234567890',
          isbn13: '1234567890123',
          publicationDate: '2001-02-03',
          publishers: [
            'CareerMonk Publications',
            "O'Reilly Media",
          ],
          title: 'FooBar',
        }));
      });
    });
  });

  describe('updateBook', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          foo: 'bar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'foo' is not allowed");
    });

    it('should return a 400 if a provided author does not exist', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          authors: [
            1,
            999,
          ],
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('A foreign key constraint violation occurred. Author with ID = 999 does not exist');
    });

    it('should return a 400 if a provided author has an invalid type', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          authors: [
            1,
            'John Doe',
          ],
          isbn13: '1234567890123',
          title: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'authors' must contain numbers only");
    });

    it('should return a 400 if a provided category does not exist', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          categories: [
            1,
            999,
          ],
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('A foreign key constraint violation occurred. Category with ID = 999 does not exist');
    });

    it('should return a 400 if a provided category has an invalid type', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          categories: [
            1,
            'FooBar',
          ],
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'categories' must contain numbers only");
    });

    it('should return a 400 if a provided publisher does not exist', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          publishers: [
            1,
            999,
          ],
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('A foreign key constraint violation occurred. Publisher with ID = 999 does not exist');
    });

    it('should return a 400 if a provided publisher has an invalid type', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          publishers: [
            1,
            'FooBar',
          ],
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'publishers' must contain numbers only");
    });

    it('should return the updated publisher if it succeeds', async () => {
      // Sequence is incremented on failed insert
      await TestUtils.resetDatabase();
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          authors: [
            1,
            3,
          ],
          publicationDate: '2001-02-03',
          title: 'FooBar',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        authors: [
          'Aaron Frost',
          'Al Sweigart',
        ],
        categories: [
          'Computers & Technology',
        ],
        id: 2,
        isbn10: '020161622X',
        isbn13: '9780201616224',
        publicationDate: '2001-02-03',
        publishers: [
          'Addison Wesley',
        ],
        title: 'FooBar',
      }));
    });
  });

  describe('deleteBook', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/books/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });

    it('should return a 404 if no book exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/books/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Book with ID = 999 does not exist');
    });

    it('should return a 204 if the delete operation succeeds', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/books/3');

      expect(response.status).toBe(204);
    });
  });
});
