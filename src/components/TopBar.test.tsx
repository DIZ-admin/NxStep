import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopBar } from './TopBar';
import { LanguageProvider } from '../contexts/LanguageContext';

vi.mock('motion/react', () => ({
  motion: {
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TopBar Component', () => {
  it('renders top bar successfully', () => {
    render(
      <LanguageProvider>
        <TopBar />
      </LanguageProvider>
    );
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('UA')).toBeInTheDocument();
  });
});
