import { Application } from 'express';
import {
  agent,
  Response,
} from 'supertest';

import { getServerInstance } from '../../src/server';
import { TestUtils } from '../TestUtils';

describe('AuthorController', () => {
  let serverInstance: Application;

  beforeAll(async () => {
    serverInstance = await getServerInstance();
    await TestUtils.resetDatabase();
  });

  afterAll(async () => {
    await TestUtils.closeDatabaseConnection();
  });

  describe('getAuthors', () => {
    it('should return all authors by default', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(28);
    });

    it('should return an author if there is a partial match on the first name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ q: 'atha' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          firstName: 'Nathan',
        }),
        expect.objectContaining({
          firstName: 'Nathan',
        }),
      ]);
    });

    it('should return an author if there is a case insensitive match on the first name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ q: 'nathan' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          firstName: 'Nathan',
        }),
        expect.objectContaining({
          firstName: 'Nathan',
        }),
      ]);
    });

    it('should return an author if there is a partial match on the middle name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ q: 'akma' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          middleName: 'Laakmann',
        }),
      ]);
    });

    it('should return an author if there is a case insensitive match on the middle name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ q: 'c.' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          middleName: 'C.',
        }),
      ]);
    });

    it('should return an author if there is a partial match on the last name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ q: 'owl' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          lastName: 'Fowler',
        }),
      ]);
    });

    it('should return an author if there is a case insensitive match on the last name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ q: 'simpson' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          lastName: 'Simpson',
        }),
      ]);
    });

    it('should return a 400 for an unknown query parameter', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors')
        .query({ foo: 'bar' });

      expect(response.status).toBe(400);
      expect(response.text).toBe("The query parameter 'foo' is not allowed");
    });
  });

  describe('getAuthor', () => {
    describe('given an author exists with the provided id', () => {
      let response: Response;

      beforeEach(async () => {
        response = await agent(serverInstance)
          .get('/api/v1/authors/1');
      });

      it('should return the properties of the author', () => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          firstName: 'Aaron',
          fullName: 'Aaron Frost',
          id: 1,
          lastName: 'Frost',
          middleName: null,
        }));
      });

      it('should return a "self" link', () => {
        expect(response.body._links).toHaveProperty(
          'self',
          {
            href: '/api/v1/authors/1',
            method: 'GET',
          },
        );
      });

      describe('and the current user is authenticated', () => {
        beforeEach(async () => {
          response = await TestUtils.createAuthenticatedUser(
            serverInstance,
            agent(serverInstance).get('/api/v1/authors/1'),
          );
        });

        it('should return an "update" link', () => {
          expect(response.body._links).toHaveProperty(
            'update',
            {
              href: '/api/v1/authors/1',
              method: 'PATCH',
            },
          );
        });

        it('should return a "delete" link', () => {
          expect(response.body._links).toHaveProperty(
            'delete',
            {
              href: '/api/v1/authors/1',
              method: 'DELETE',
            },
          );
        });
      });

      describe('and the current user is not authenticated', () => {
        it('should not return an "update" link', () => {
          expect(response.body._links).not.toHaveProperty('update');
        });

        it('should not return a "delete" link', () => {
          expect(response.body._links).not.toHaveProperty('delete');
        });
      });
    });

    it('should return a 404 if no author exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Author with ID = 999 does not exist');
    });

    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });
  });

  describe('createAuthor', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .post('/api/v1/authors');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
        });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the firstName is missing', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/authors')
            .send({
              lastName: 'Doe',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'firstName' is required");
      });

      it('should return a 400 if the lastName is missing', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/authors')
            .send({
              firstName: 'John',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'lastName' is required");
      });

      it('should return a 400 if the request body contains unknown properties', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/authors')
            .send({
              firstName: 'John',
              foo: 'bar',
              lastName: 'Doe',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'foo' is not allowed");
      });

      describe('and it creates the author', () => {
        let response: Response;

        beforeAll(async () => {
          response = await TestUtils.createAuthenticatedUser(
            serverInstance,
              agent(serverInstance)
              .post('/api/v1/authors')
              .send({
                firstName: 'John',
                lastName: 'Doe',
                middleName: 'X',
              }),
          );
        });

        afterAll(async () => {
          await agent(serverInstance)
            .delete(response.header.location);
        });

        it('should return a 201 with a location header pointing to the new resource', () => {
          expect(response.status).toBe(201);
          expect(response.header.location).toBe('/api/v1/authors/29');
        });

        it('should return the created author when calling the returned location', async () => {
          const getResponse = await agent(serverInstance)
            .get(response.header.location);

          expect(getResponse.status).toBe(200);
          expect(getResponse.body).toEqual(expect.objectContaining({
            firstName: 'John',
            fullName: 'John X Doe',
            id: 29,
            lastName: 'Doe',
            middleName: 'X',
          }));
        });
      });
    });
  });

  describe('updateAuthor', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .patch('/api/v1/authors/2');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the provided id is invalid', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .patch('/api/v1/authors/foobar'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The path parameter 'id' must be a number");
      });

      it('should return a 400 if the request body contains unknown properties', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .patch('/api/v1/authors/2')
            .send({
              foo: 'bar',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'foo' is not allowed");
      });

      it('should return the updated author if it succeeds', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .patch('/api/v1/authors/2')
            .send({
              firstName: 'John',
              lastName: 'Doe',
            }),
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          firstName: 'John',
          fullName: 'John Doe',
          id: 2,
          lastName: 'Doe',
          middleName: null,
        }));
      });

      it('should set the middleName to null if an empty string was provided', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .patch('/api/v1/authors/13')
            .send({
              middleName: '',
            }),
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          middleName: null,
        }));
      });
    });
  });

  describe('deleteAuthor', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .delete('/api/v1/authors/3');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the provided id is invalid', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/authors/foobar'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The path parameter 'id' must be a number");
      });

      it('should return a 404 if no author exists with the provided id', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/authors/999'),
        );

        expect(response.status).toBe(404);
        expect(response.text).toBe('Author with ID = 999 does not exist');
      });

      it('should return a 204 if the delete operation succeeds', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/authors/3'),
        );

        expect(response.status).toBe(204);
      });
    });
  });
});
