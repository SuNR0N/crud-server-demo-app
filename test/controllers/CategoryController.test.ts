import { Application } from 'express';
import {
  agent,
  Response,
} from 'supertest';

import { getServerInstance } from '../../src/server';
import { TestUtils } from '../TestUtils';

describe('CategoryController', () => {
  let serverInstance: Application;

  beforeAll(async () => {
    serverInstance = await getServerInstance();
    await TestUtils.resetDatabase();
  });

  afterAll(async () => {
    await TestUtils.closeDatabaseConnection();
  });

  describe('getCategories', () => {
    it('should return all categories by default', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(32);
    });

    it('should return a category if there is a partial match on the name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories')
        .query({ q: 'echno' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Computers & Technology',
        }),
      ]);
    });

    it('should return a category if there is a case insensitive match on the name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories')
        .query({ q: 'technology' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Computers & Technology',
        }),
      ]);
    });

    it('should return a 400 for an unknown query parameter', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories')
        .query({ foo: 'bar' });

      expect(response.status).toBe(400);
      expect(response.text).toBe("The query parameter 'foo' is not allowed");
    });
  });

  describe('getCategory', () => {
    describe('given a category exists with the provided id', () => {
      let response: Response;

      beforeEach(async () => {
        response = await agent(serverInstance)
          .get('/api/v1/categories/1');
      });

      it('should return the properties of the categry', () => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          id: 1,
          name: 'Arts & Photography',
        }));
      });

      it('should return a "self" link', () => {
        expect(response.body._links).toHaveProperty(
          'self',
          {
            href: '/api/v1/categories/1',
            method: 'GET',
          },
        );
      });

      describe('and the current user is authenticated', () => {
        beforeEach(async () => {
          response = await TestUtils.createAuthenticatedUser(
            serverInstance,
            agent(serverInstance).get('/api/v1/categories/1'),
          );
        });

        it('should return an "update" link', () => {
          expect(response.body._links).toHaveProperty(
            'update',
            {
              href: '/api/v1/categories/1',
              method: 'PUT',
            },
          );
        });

        it('should return a "delete" link', () => {
          expect(response.body._links).toHaveProperty(
            'delete',
            {
              href: '/api/v1/categories/1',
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

    it('should return a 404 if no category exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Category with ID = 999 does not exist');
    });

    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });
  });

  describe('createCategory', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .post('/api/v1/categories');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the name is missing', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/categories'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'name' is required");
      });

      it('should return a 400 if the request body contains unknown properties', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/categories')
            .send({
              foo: 'bar',
              name: 'FooBar',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'foo' is not allowed");
      });

      describe('and it creates the category', () => {
        let response: Response;

        beforeAll(async () => {
          response = await TestUtils.createAuthenticatedUser(
            serverInstance,
            agent(serverInstance)
              .post('/api/v1/categories')
              .send({
                name: 'FooBar',
              }),
          );
        });

        afterAll(async () => {
          await agent(serverInstance)
            .delete(response.header.location);
        });

        it('should return a 201 with a location header pointing to the new resource', () => {
          expect(response.status).toBe(201);
          expect(response.header.location).toBe('/api/v1/categories/33');
        });

        it('should return the created category when calling the returned location', async () => {
          const getResponse = await agent(serverInstance)
            .get(response.header.location);

          expect(getResponse.status).toBe(200);
          expect(getResponse.body).toEqual(expect.objectContaining({
            id: 33,
            name: 'FooBar',
          }));
        });
      });
    });
  });

  describe('updateCategory', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .put('/api/v1/categories/2');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the provided id is invalid', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/categories/foobar'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The path parameter 'id' must be a number");
      });

      it('should return a 400 if the name is missing', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/categories/2'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'name' is required");
      });

      it('should return a 400 if the request body contains unknown properties', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/categories/2')
            .send({
              foo: 'bar',
              name: 'FooBar',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'foo' is not allowed");
      });

      it('should return the updated category if it succeeds', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/categories/2')
            .send({
              name: 'FooBar',
            }),
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          id: 2,
          name: 'FooBar',
        }));
      });
    });
  });

  describe('deleteCategory', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .delete('/api/v1/categories/3');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the provided id is invalid', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/categories/foobar'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The path parameter 'id' must be a number");
      });

      it('should return a 404 if no category exists with the provided id', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/categories/999'),
        );

        expect(response.status).toBe(404);
        expect(response.text).toBe('Category with ID = 999 does not exist');
      });

      it('should return a 204 if the delete operation succeeds', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/categories/3'),
        );

        expect(response.status).toBe(204);
      });
    });
  });
});
