import { screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MediaShowcase } from './MediaShowcase';
import { renderWithProviders as render } from '../utils/test-utils';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('MediaShowcase Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders media correctly and switches tabs', () => {
    render(<MediaShowcase />);

    expect(screen.getByText('NxStep Challenger Highlight Reel - Aggressive Quad Kills')).toBeInTheDocument();

    act(() => {
      screen.getByRole('button', { name: /Full Match VODs/i }).click();
    });

    expect(screen.getByText('ESEA Match VOD - Ancient Dominance (28-14 Stats)')).toBeInTheDocument();
  });

  it('handles copy link functionality', () => {
    render(<MediaShowcase />);
    
    act(() => {
      screen.getAllByTitle('Copy demo link')[0].click();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });
});
