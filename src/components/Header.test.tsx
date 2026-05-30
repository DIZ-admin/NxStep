import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';
import { renderWithProviders as render } from '../utils/test-utils';

describe('Header Component', () => {
  it('renders header text correctly', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('NxStep')).toBeInTheDocument();
  });
});
