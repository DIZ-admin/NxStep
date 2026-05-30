import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { faceitRouter } from './faceit';
import * as faceitService from '../services/faceitService';

vi.mock('../services/faceitService');

describe('Faceit Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use('/api', faceitRouter);
    vi.clearAllMocks();
  });

  it('GET /api/faceit/sync should return stats on success', async () => {
    vi.mocked(faceitService.fetchFaceitStats).mockResolvedValue({ 
      success: true, 
      stats: { matches: 500 } 
    } as any);

    const res = await request(app).get('/api/faceit/sync');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.matches).toBe(500);
  });

  it('GET /api/faceit/sync should handle errors', async () => {
    vi.mocked(faceitService.fetchFaceitStats).mockRejectedValue(new Error('Test API error'));

    const res = await request(app).get('/api/faceit/sync');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Test API error');
  });

  it('GET /api/faceit/history should return history', async () => {
    vi.mocked(faceitService.fetchFaceitHistory).mockResolvedValue([{ id: 1 }] as any);

    const res = await request(app).get('/api/faceit/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.matches).toHaveLength(1);
  });
});
