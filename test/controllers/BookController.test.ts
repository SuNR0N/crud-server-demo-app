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
    it('should return all books', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(22);
    });
  });

  describe('getBook', () => {
    it('should return the book if one exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/books/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      expect(response.text).toBe('"id" must be a number');
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
        .toEqual('child "isbn13" fails because ["isbn13" is required]');
    });

    it('should return a 400 if the title is missing', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/books')
        .send({
          isbn13: '1234567890123',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('child "title" fails because ["title" is required]');
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
        .toEqual('"foo" is not allowed');
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
        .toEqual('A constraint violation occurred. Author with ID = 999 does not exist');
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
        .toEqual('child "authors" fails because ["authors" at position 1 fails because ["1" must be a number]]');
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
        .toEqual('A constraint violation occurred. Category with ID = 999 does not exist');
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
        .toEqual('child "categories" fails because ["categories" at position 1 fails because ["1" must be a number]]');
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
        .toEqual('A constraint violation occurred. Publisher with ID = 999 does not exist');
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
        .toEqual('child "publishers" fails because ["publishers" at position 1 fails because ["1" must be a number]]');
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
        expect(getResponse.body).toEqual({
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
        });
      });
    });
  });

  describe('updateBook', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe('"id" must be a number');
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/books/2')
        .send({
          foo: 'bar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('"foo" is not allowed');
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
        .toEqual('A constraint violation occurred. Author with ID = 999 does not exist');
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
        .toEqual('child "authors" fails because ["authors" at position 1 fails because ["1" must be a number]]');
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
        .toEqual('A constraint violation occurred. Category with ID = 999 does not exist');
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
        .toEqual('child "categories" fails because ["categories" at position 1 fails because ["1" must be a number]]');
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
        .toEqual('A constraint violation occurred. Publisher with ID = 999 does not exist');
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
        .toEqual('child "publishers" fails because ["publishers" at position 1 fails because ["1" must be a number]]');
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
      expect(response.body).toEqual({
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
      });
    });
  });

  describe('deleteBook', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/books/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe('"id" must be a number');
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
