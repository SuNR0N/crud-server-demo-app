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
    it('should return all authors', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(28);
    });
  });

  describe('getAuthor', () => {
    it('should return the author if one exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/authors/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        firstName: 'Aaron',
        fullName: 'Aaron Frost',
        id: 1,
        lastName: 'Frost',
        middleName: null,
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
      expect(response.text).toBe('"id" must be a number');
    });
  });

  describe('createAuthor', () => {
    it('should return a 400 if the firstName is missing', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/authors')
        .send({
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('child "firstName" fails because ["firstName" is required]');
    });

    it('should return a 400 if the lastName is missing', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/authors')
        .send({
          firstName: 'John',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('child "lastName" fails because ["lastName" is required]');
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/authors')
        .send({
          firstName: 'John',
          foo: 'bar',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('"foo" is not allowed');
    });

    describe('given it creates the author', () => {
      let response: Response;

      beforeAll(async () => {
        response = await agent(serverInstance)
          .post('/api/v1/authors')
          .send({
            firstName: 'John',
            lastName: 'Doe',
            middleName: 'X',
          });
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
        expect(getResponse.body).toEqual({
          firstName: 'John',
          fullName: 'John X Doe',
          id: 29,
          lastName: 'Doe',
          middleName: 'X',
        });
      });
    });
  });

  describe('updateAuthor', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/authors/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe('"id" must be a number');
    });

    it('should return a 400 if the request body contains unknown properties', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/authors/2')
        .send({
          foo: 'bar',
        });

      expect(response.status).toBe(400);
      expect(response.text)
        .toEqual('"foo" is not allowed');
    });

    it('should return the updated author if it succeeds', async () => {
      const response = await agent(serverInstance)
        .patch('/api/v1/authors/2')
        .send({
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        firstName: 'John',
        fullName: 'John Doe',
        id: 2,
        lastName: 'Doe',
        middleName: null,
      });
    });
  });

  describe('deleteAuthor', () => {
    it('should return a 400 if the provided id is invalid', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/authors/foobar');

      expect(response.status).toBe(400);
      expect(response.text).toBe('"id" must be a number');
    });

    it('should return a 404 if no author exists with the provided id', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/authors/999');

      expect(response.status).toBe(404);
      expect(response.text).toBe('Author with ID = 999 does not exist');
    });

    it('should return a 204 if the delete operation succeeds', async () => {
      const response = await agent(serverInstance)
        .delete('/api/v1/authors/3');

      expect(response.status).toBe(204);
    });
  });
});
