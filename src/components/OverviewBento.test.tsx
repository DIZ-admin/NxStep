import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OverviewBento } from './OverviewBento';
import { renderWithProviders as render } from '../utils/test-utils';

describe('OverviewBento Component', () => {
  it('renders achievements and specialties', () => {
    render(<OverviewBento />);

    // Check if some specialties rendering OK
    expect(screen.getByText('Clutcher')).toBeInTheDocument();
  });
});
