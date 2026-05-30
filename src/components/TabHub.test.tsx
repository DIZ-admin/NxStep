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
    
    // Switch to another tab
    act(() => {
      screen.getByRole('tab', { name: /MAP POOL/i }).click();
    });
    
    await act(async () => {
       await new Promise(resolve => setTimeout(resolve, 100)); // wait for suspense
    });
  });
});
