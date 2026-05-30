import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './index';

global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetchScoutResponse returns json response', async () => {
    const mockReponse = { reply: 'test reply' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReponse,
    });

    const res = await apiClient.fetchScoutResponse('hello', []);
    expect(res).toEqual(mockReponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/scout', expect.any(Object));
  });

  it('fetchScoutResponse throws when response is not ok', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error occurred' }),
    });

    await expect(apiClient.fetchScoutResponse('hi', [])).rejects.toThrow();
  });

  it('syncFaceitStats returns json response', async () => {
    const mockRes = { success: true, stats: {} };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRes,
    });

    const res = await apiClient.syncFaceitStats('someuser');
    expect(res).toEqual(mockRes);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('syncFaceitStats throws when response is not ok', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed' }),
    });

    await expect(apiClient.syncFaceitStats('someuser')).rejects.toThrow();
  });
});
