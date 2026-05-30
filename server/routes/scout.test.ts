import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { scoutRouter } from './scout';
import * as geminiService from '../services/geminiService';

vi.mock('../services/geminiService', () => ({
  getGeminiClient: vi.fn(),
  getDynamicSystemInstruction: vi.fn().mockReturnValue('mock instruction')
}));

describe('Scout Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', scoutRouter);
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('POST /api/scout should return reply', async () => {
    const mockGenerateContent = vi.fn().mockResolvedValue({ text: 'AI response' });
    vi.mocked(geminiService.getGeminiClient).mockReturnValue({
      models: { generateContent: mockGenerateContent }
    } as any);

    const res = await request(app)
      .post('/api/scout')
      .send({ message: 'hello context' });
    
    expect(res.status).toBe(200);
    expect(res.body.reply).toBe('AI response');
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('POST /api/scout should require message in body', async () => {
    const res = await request(app).post('/api/scout').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Message is required.');
  });
  
  it('POST /api/scout should return 400 if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await request(app).post('/api/scout').send({ message: 'hello' });
    expect(res.status).toBe(400);
    expect(res.body.errorType).toBe('MISSING_KEY');
  });

  it('POST /api/scout should handle Gemini service errors', async () => {
    const mockGenerateContent = vi.fn().mockRejectedValue(new Error('503 Service Unavailable'));
    vi.mocked(geminiService.getGeminiClient).mockReturnValue({
      models: { generateContent: mockGenerateContent }
    } as any);

    const res = await request(app)
      .post('/api/scout')
      .send({ message: 'crash it' });

    expect(res.status).toBe(500);
    expect(res.body.errorType).toBe('SERVICE_UNAVAILABLE');
  });
});
