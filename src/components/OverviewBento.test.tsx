import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OverviewBento } from './OverviewBento';
import { PortfolioProvider } from '../contexts/PortfolioContext';
import { LanguageProvider } from '../contexts/LanguageContext';

describe('OverviewBento Component', () => {
  it('renders achievements and specialties', () => {
    render(
      <LanguageProvider>
        <PortfolioProvider>
          <OverviewBento />
        </PortfolioProvider>
      </LanguageProvider>
    );

    // Check if some specialties rendering OK
    expect(screen.getByText('Clutcher')).toBeInTheDocument();
  });
});
