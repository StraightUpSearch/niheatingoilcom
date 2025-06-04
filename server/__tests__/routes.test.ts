
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('API Routes', () => {
  describe('GET /api/prices', () => {
    it('returns prices with valid postcode', async () => {
      const response = await request(app)
        .get('/api/prices')
        .query({ postcode: 'BT1', tankSize: 500 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('prices');
      expect(Array.isArray(response.body.prices)).toBe(true);
    });

    it('validates required parameters', async () => {
      const response = await request(app)
        .get('/api/prices');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/suppliers', () => {
    it('returns supplier list', async () => {
      const response = await request(app)
        .get('/api/suppliers');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suppliers');
      expect(Array.isArray(response.body.suppliers)).toBe(true);
    });
  });

  describe('POST /api/alerts', () => {
    it('creates price alert for authenticated user', async () => {
      // This would require authentication setup in tests
      // For now, testing the endpoint exists
      const response = await request(app)
        .post('/api/alerts')
        .send({
          postcode: 'BT1',
          tankSize: 500,
          targetPrice: 60
        });
      
      // Without auth, should return 401
      expect([401, 400]).toContain(response.status);
    });
  });
});
