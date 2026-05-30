import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToastContext } from './ToastContext';

vi.mock('motion/react', () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const TestComponent = () => {
  const { addToast } = useToastContext();
  return (
    <button onClick={() => addToast('success', 'Test Success', 'It works!')}>
      Add Toast
    </button>
  );
};

describe('ToastContext', () => {
  it('provides addToast function and renders toasts', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Add Toast').click();
    });

    expect(screen.getByText('Test Success')).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Test Success')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
