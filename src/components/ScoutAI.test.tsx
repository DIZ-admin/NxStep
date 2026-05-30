import { screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScoutAI } from './ScoutAI';
import { useScoutAI } from '../hooks/useScoutAI';
import { renderWithProviders as render } from '../utils/test-utils';

vi.mock('../hooks/useScoutAI');

describe('ScoutAI Component', () => {
  it('renders chat interface correctly', () => {
    (useScoutAI as any).mockReturnValue({
      messages: [{ sender: 'ai', text: 'Hello', timestamp: '10:00' }],
      inputMessage: '',
      setInputMessage: vi.fn(),
      isSending: false,
      errorContext: null,
      feedRef: { current: null },
      handleSendMessage: vi.fn(),
      t: { scoutAnalyst: 'AI Scout', scoutSubtitle: 'Subtitle' }
    });

    render(<ScoutAI />);

    expect(screen.getByText('AI Scout')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls handleSendMessage on suggestion click', () => {
    const mockHandleSendMessage = vi.fn();
    (useScoutAI as any).mockReturnValue({
      messages: [],
      inputMessage: '',
      setInputMessage: vi.fn(),
      isSending: false,
      errorContext: null,
      feedRef: { current: null },
      handleSendMessage: mockHandleSendMessage,
      t: { sugLabel1: 'Role', sugText1: 'Tell me about role' }
    });

    render(<ScoutAI />);

    act(() => {
      screen.getByText('Role').click();
    });

    expect(mockHandleSendMessage).toHaveBeenCalledWith('Tell me about role');
  });
});
