import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScoutAI } from './useScoutAI';
import { ToastProvider } from '../components/ToastContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { apiClient } from '../api';

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

  const wrapper = ({ children }: any) => (
    <LanguageProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </LanguageProvider>
  );

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
