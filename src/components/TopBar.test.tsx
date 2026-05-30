import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopBar } from './TopBar';
import { renderWithProviders as render } from '../utils/test-utils';

vi.mock('motion/react', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TopBar Component', () => {
  it('renders top bar successfully and changes language', () => {
    localStorage.clear();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(<TopBar />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('UA')).toBeInTheDocument();

    const uaBtn = screen.getByRole('button', { name: 'Switch language to Ukrainian' });
    uaBtn.click();
    expect(setItemSpy).toHaveBeenCalledWith('nxstep_portfolio_lang', 'uk');

    const enBtn = screen.getByRole('button', { name: 'Switch language to English' });
    enBtn.click();
    expect(setItemSpy).toHaveBeenCalledWith('nxstep_portfolio_lang', 'en');
  });
});
