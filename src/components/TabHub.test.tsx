import { screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabHub } from './TabHub';
import { renderWithProviders as render } from '../utils/test-utils';

vi.mock('motion/react', () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TabHub Component', () => {
  it('renders tabs and changes them', async () => {
    render(<TabHub />);

    // Initial tab
    expect(screen.getByRole('tab', { name: /COMBAT STATS/i })).toBeInTheDocument();
    
    // Switch to Map Pool
    act(() => {
      screen.getByRole('tab', { name: /MAP POOL/i }).click();
    });
    
    // Switch to Trials & Teams
    act(() => {
      screen.getByRole('tab', { name: /TRIALS & TEAMS|Тести та команди/i }).click();
    });

    // Switch to Demos & VODs
    act(() => {
      screen.getByRole('tab', { name: /DEMOS & VODS|Записи та кліпи/i }).click();
    });

    // Switch back to Combat Stats
    act(() => {
      screen.getByRole('tab', { name: /COMBAT STATS/i }).click();
    });

    await act(async () => {
       await new Promise(resolve => setTimeout(resolve, 50));
    });
  });
});
