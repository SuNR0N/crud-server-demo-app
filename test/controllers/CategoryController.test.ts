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
  });

  describe('getCategory', () => {
    it('should return the category if one exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/categories/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Arts & Photography',
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
    it('should return a 400 if the name is missing', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/categories');

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'name' is required");
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/categories')
        .send({
          foo: 'bar',
          name: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'foo' is not allowed");
    });

    describe('given it creates the category', () => {
      let response: Response;

      beforeAll(async () => {
        response = await agent(serverInstance)
          .post('/api/v1/categories')
          .send({
            name: 'FooBar',
          });
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
        expect(getResponse.body).toEqual({
          id: 33,
          name: 'FooBar',
        });
      });
    });
  });

  describe('updateCategory', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .put('/api/v1/categories/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });

    it('should return a 400 if the name is missing', async () => {
      const response = await agent(serverInstance)
        .put('/api/v1/categories/2');

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'name' is required");
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .put('/api/v1/categories/2')
        .send({
          foo: 'bar',
          name: 'FooBar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual("The property 'foo' is not allowed");
    });

    it('should return the updated category if it succeeds', async () => {
      const response = await agent(serverInstance)
        .put('/api/v1/categories/2')
        .send({
          name: 'FooBar',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 2,
        name: 'FooBar',
      });
    });
  });

  describe('deleteCategory', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/categories/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe("The path parameter 'id' must be a number");
    });

    it('should return a 404 if no category exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/categories/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Category with ID = 999 does not exist');
    });

    it('should return a 204 if the delete operation succeeds', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/categories/3');

      expect(response.status).toBe(204);
    });
  });
});
