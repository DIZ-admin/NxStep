import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastContainer } from './Toast';

describe('Toast Component', () => {
  it('renders a toast message correctly', () => {
    const mockRemoveToast = vi.fn();
    const toasts = [
      { id: '1', type: 'success' as const, title: 'Success Title', message: 'It works!' },
    ];

    render(<ToastContainer toasts={toasts} removeToast={mockRemoveToast} />);

    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('It works!')).toBeInTheDocument();
  });
});
