import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('catches error and displays fallback UI', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // It should render standard error boundary text of the application
    expect(screen.getByText(/System Error Caught/)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('renders children if no error', () => {
    render(
      <ErrorBoundary>
        <div>All good</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
