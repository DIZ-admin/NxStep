import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';
import { renderWithProviders as render } from '../utils/test-utils';

describe('Footer Component', () => {
  it('renders footer text correctly', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
