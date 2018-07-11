import { Application } from 'express';
import {
  agent,
  Response,
} from 'supertest';

import { getServerInstance } from '../../src/server';
import { MockStrategy } from '../../src/util/MockStrategy';
import { TestUtils } from '../TestUtils';

describe('AuthController', () => {
  let serverInstance: Application;

  beforeAll(async () => {
    serverInstance = await getServerInstance();
    await TestUtils.resetDatabase();
  });

  afterAll(async () => {
    await TestUtils.closeDatabaseConnection();
  });

  describe('getProfile', () => {
    it('should return a 403 if the current user is not authenticated', async () => {
      const response = await agent(serverInstance)
        .get('/api/v1/auth/profile');

      expect(response.status).toBe(403);
      expect(response.text).toBe('Forbidden');
    });

    it('should return the profile of the current user if they are authenticated', async () => {
      const response = await TestUtils.createAuthenticatedUser(
        serverInstance,
        agent(serverInstance)
          .get('/api/v1/auth/profile'),
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        avatarUrl: 'https://avatars1.githubusercontent.com/u/4305472?v=4',
        email: 'john.doe@dummy.com',
        id: 12345,
        name: 'John Doe',
        username: 'J0hn_D03',
      });
    });
  });

  describe('authenticate', () => {
    it('should call the authenticate function of the underlying strategy', async () => {
      const authenticateSpy = jest.spyOn(MockStrategy.prototype, 'authenticate');
      await agent(serverInstance)
        .get('/api/v1/auth/github');

      expect(authenticateSpy).toHaveBeenCalled();
    });
  });

  describe('callback', () => {
    let authenticateSpy: jest.SpyInstance;
    let response: Response;

    beforeAll(async () => {
      authenticateSpy = jest.spyOn(MockStrategy.prototype, 'authenticate');
      response = await agent(serverInstance)
        .get('/api/v1/auth/github/callback');
    });

    it('should call the authenticate function of the underlying strategy', async () => {
      expect(authenticateSpy).toHaveBeenCalled();
    });

    it('should redirect the user to "getBooks"', () => {
      expect(response.redirect).toBe(true);
      expect(response.header.location).toBe('/api/v1/books');
    });
  });

  describe('logout', () => {
    it('should destroy the session', async () => {
      const authCallbackResponse = await agent(serverInstance)
        .get('/api/v1/auth/github/callback');
      const cookie = authCallbackResponse.header['set-cookie'];
      await agent(serverInstance)
        .post('/api/v1/auth/logout')
        .set('cookie', cookie);
      const response = await agent(serverInstance)
        .get('/api/v1/auth/profile')
        .set('cookie', cookie);

      expect(response.status).toBe(403);
    });

    it('should return a success message', async () => {
      const response = await agent(serverInstance)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Successfully logged out');
    });
  });
});
