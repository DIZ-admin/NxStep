import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScoutAI } from './useScoutAI';
import { AllTheProviders as wrapper } from '../utils/test-utils';
import { apiClient } from '../api';

vi.mock('../firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  getDocs: vi.fn().mockResolvedValue([]),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
}));

vi.mock('../api', () => ({
  apiClient: {
    fetchScoutResponse: vi.fn(),
  },
}));

vi.mock('../services/firebaseService', () => ({
  firebaseService: {
    saveScoutSession: vi.fn(),
  }
}));

describe('useScoutAI Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with a greeting message', () => {
    const { result } = renderHook(() => useScoutAI(), { wrapper });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].sender).toBe('ai');
  });

  it('sends message and gets reply successfully', async () => {
    const mockReply = { reply: 'AI response' };
    (apiClient.fetchScoutResponse as any).mockResolvedValueOnce(mockReply);

    const { result } = renderHook(() => useScoutAI(), { wrapper });
    
    act(() => {
      result.current.setInputMessage('Hello Scout!');
    });

    await act(async () => {
      await result.current.handleSendMessage();
    });

    expect(result.current.isSending).toBe(false);
    expect(result.current.messages).toHaveLength(3); // Greeting + User message + AI response
    expect(result.current.messages[1].text).toBe('Hello Scout!');
    expect(result.current.messages[2].text).toBe('AI response');
  });

  it('handles error when sending message', async () => {
    (apiClient.fetchScoutResponse as any).mockRejectedValueOnce({ errorType: 'MISSING_KEY' });

    const { result } = renderHook(() => useScoutAI(), { wrapper });

    await act(async () => {
      await result.current.handleSendMessage('Test Error');
    });

    expect(result.current.errorContext).toBeDefined();
    expect(result.current.isSending).toBe(false);
  });
});
