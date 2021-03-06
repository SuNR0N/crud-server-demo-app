import { Application } from 'express';
import {
  agent,
  Response,
} from 'supertest';

import { getServerInstance } from '../../src/server';
import { TestUtils } from '../TestUtils';

describe('PublisherController', () => {
  let serverInstance: Application;

  beforeAll(async () => {
    serverInstance = await getServerInstance();
    await TestUtils.resetDatabase();
  });

  afterAll(async () => {
    await TestUtils.closeDatabaseConnection();
  });

  describe('getPublishers', () => {
    it('should return all publishers by default', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/publishers');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(12);
    });

    it('should return a publisher if there is a partial match on the name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/publishers')
        .query({ q: 'ack' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Fullstack.io',
        }),
        expect.objectContaining({
          name: 'Packt Publishing',
        }),
      ]);
    });

    it('should return a publisher if there is a case insensitive match on the name', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/publishers')
        .query({ q: 'career' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'CareerCup',
        }),
        expect.objectContaining({
          name: 'CareerMonk Publications',
        }),
      ]);
    });

    it('should return a 400 for an unknown query parameter', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/publishers')
        .query({ foo: 'bar' });

      expect(response.status).toBe(400);
      expect(response.text).toBe("The query parameter 'foo' is not allowed");
    });
  });

  describe('getPublisher', () => {
    describe('given a publisher exists with the provided id', () => {
      let response: Response;

      beforeEach(async () => {
        response = await agent(serverInstance)
          .get('/api/v1/publishers/1');
      });

      it('should return the properties of the publisher', () => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          id: 1,
          name: 'Addison Wesley',
        }));
      });

      it('should return a "self" link', () => {
        expect(response.body._links).toHaveProperty(
          'self',
          {
            href: '/api/v1/publishers/1',
            method: 'GET',
          },
        );
      });

      describe('and the current user is authenticated', () => {
        beforeEach(async () => {
          response = await TestUtils.createAuthenticatedUser(
            serverInstance,
            agent(serverInstance).get('/api/v1/publishers/1'),
          );
        });

        it('should return an "update" link', () => {
          expect(response.body._links).toHaveProperty(
            'update',
            {
              href: '/api/v1/publishers/1',
              method: 'PUT',
            },
          );
        });

        it('should return a "delete" link', () => {
          expect(response.body._links).toHaveProperty(
            'delete',
            {
              href: '/api/v1/publishers/1',
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

    it('should return a 404 if no publisher exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/publishers/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Publisher with ID = 999 does not exist');
    });

    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/publishers/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });
  });

  describe('createPublisher', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .post('/api/v1/publishers');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the name is missing', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/publishers'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'name' is required");
      });

      it('should return a 400 if the request body contains unknown properties', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .post('/api/v1/publishers')
            .send({
              foo: 'bar',
              name: 'FooBar',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'foo' is not allowed");
      });

      describe('and it creates the publisher', () => {
        let response: Response;

        beforeAll(async () => {
          response = await TestUtils.createAuthenticatedUser(
            serverInstance,
            agent(serverInstance)
              .post('/api/v1/publishers')
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
          expect(response.header.location).toBe('/api/v1/publishers/13');
        });

        it('should return the created publisher when calling the returned location', async () => {
          const getResponse = await agent(serverInstance)
            .get(response.header.location);

          expect(getResponse.status).toBe(200);
          expect(getResponse.body).toEqual(expect.objectContaining({
            id: 13,
            name: 'FooBar',
          }));
        });
      });
    });
  });

  describe('updatePublisher', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .put('/api/v1/publishers/2');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the provided id is invalid', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/publishers/foobar'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The path parameter 'id' must be a number");
      });

      it('should return a 400 if the name is missing', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/publishers/2'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'name' is required");
      });

      it('should return a 400 if the request body contains unknown properties', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/publishers/2')
            .send({
              foo: 'bar',
              name: 'FooBar',
            }),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The property 'foo' is not allowed");
      });

      it('should return the updated publisher if it succeeds', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .put('/api/v1/publishers/2')
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

  describe('deletePublisher', () => {
    describe('given the current user is not authenticated', () => {
      it('should return a 403', async () => {
        const response = await agent(serverInstance)
          .delete('/api/v1/publishers/3');

        expect(response.status).toBe(403);
        expect(response.text).toBe('Forbidden');
      });
    });

    describe('given the current user is authenticated', () => {
      it('should return a 400 if the provided id is invalid', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/publishers/foobar'),
        );

        expect(response.status).toBe(400);
        expect(response.text).toBe("The path parameter 'id' must be a number");
      });

      it('should return a 404 if no publisher exists with the provided id', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/publishers/999'),
        );

        expect(response.status).toBe(404);
        expect(response.text).toBe('Publisher with ID = 999 does not exist');
      });

      it('should return a 204 if the delete operation succeeds', async () => {
        const response = await TestUtils.createAuthenticatedUser(
          serverInstance,
          agent(serverInstance)
            .delete('/api/v1/publishers/3'),
        );

        expect(response.status).toBe(204);
      });
    });
  });
});
